import { DOMAINS, getQuestion, type DomainId } from "./questions";

export interface Response { questionId: string; selected: number | null; correct: boolean }
export interface Attempt {
  id: string;
  createdAt: string;
  domain: DomainId | "all";
  mode: "learning" | "test";
  timed: boolean;
  durationSec: number;
  responses: Response[];
  sample?: boolean;
}

export const MIN_SESSIONS = 3;
export const MIN_QUESTIONS = 30;

export const attemptScore = (a: Attempt) =>
  a.responses.length ? Math.round((a.responses.filter((r) => r.correct).length / a.responses.length) * 100) : 0;

export function band(pct: number) {
  if (pct >= 85) return "Strong practice performance";
  if (pct >= 70) return "Nearly ready; revise weaker topics";
  if (pct >= 50) return "Developing";
  return "Needs foundation building";
}

export function domainAccuracy(attempts: Attempt[]) {
  const acc: Record<DomainId, { correct: number; total: number }> = {
    cloud: { correct: 0, total: 0 }, architecture: { correct: 0, total: 0 }, governance: { correct: 0, total: 0 },
  };
  for (const a of attempts) for (const r of a.responses) {
    const q = getQuestion(r.questionId); if (!q) continue;
    acc[q.domain].total++; if (r.correct) acc[q.domain].correct++;
  }
  return acc;
}

export function topicAccuracy(attempts: Attempt[]) {
  const map = new Map<string, { topic: string; domain: DomainId; correct: number; total: number }>();
  for (const a of attempts) for (const r of a.responses) {
    const q = getQuestion(r.questionId); if (!q) continue;
    const e = map.get(q.topic) ?? { topic: q.topic, domain: q.domain, correct: 0, total: 0 };
    e.total++; if (r.correct) e.correct++; map.set(q.topic, e);
  }
  return [...map.values()].map((e) => ({ ...e, pct: Math.round((e.correct / e.total) * 100) }));
}

/**
 * Transparent readiness estimate (study guidance only — not an exam prediction):
 * - uses the 5 most recent sessions
 * - score = average of the three domain accuracies (every domain must be practised)
 * - minus a consistency penalty: half the standard deviation of recent session scores
 * Requires MIN_SESSIONS sessions and MIN_QUESTIONS answers before a status is shown.
 */
export function readiness(all: Attempt[]) {
  const sorted = [...all].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const totalQuestions = all.reduce((s, a) => s + a.responses.length, 0);
  const recent = sorted.slice(0, 5);
  const dom = domainAccuracy(recent);
  const missing = DOMAINS.filter((d) => dom[d.id].total === 0).map((d) => d.name);
  if (all.length < MIN_SESSIONS || totalQuestions < MIN_QUESTIONS || missing.length) {
    return { enough: false as const, totalQuestions, sessions: all.length, missing };
  }
  const domainAvg = DOMAINS.reduce((s, d) => s + dom[d.id].correct / dom[d.id].total, 0) / 3 * 100;
  const scores = recent.map(attemptScore);
  const mean = scores.reduce((s, x) => s + x, 0) / scores.length;
  const sd = Math.sqrt(scores.reduce((s, x) => s + (x - mean) ** 2, 0) / scores.length);
  const score = Math.max(0, Math.round(domainAvg - sd / 2));
  return { enough: true as const, score, label: band(score), consistencyPenalty: Math.round(sd / 2), totalQuestions, sessions: all.length, missing };
}
