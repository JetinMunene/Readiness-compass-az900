import { pickQuestions, type DomainId } from "./questions";
import type { Attempt } from "./readiness";

// Clearly-labelled demonstration data. Deterministic so it looks the same each time.
export function buildSampleAttempts(): Attempt[] {
  let seed = 7;
  const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const plan: [DomainId | "all", number, number][] = [
    ["cloud", 10, 0.5], ["architecture", 10, 0.55], ["governance", 10, 0.6], ["all", 20, 0.68], ["all", 20, 0.76],
  ];
  return plan.map(([domain, n, p], i) => ({
    id: `sample-${i}`,
    createdAt: new Date(Date.now() - (plan.length - i) * 2 * 86400000).toISOString(),
    domain, mode: "test", timed: i % 2 === 0, durationSec: n * 45, sample: true,
    responses: pickQuestions(domain, n, undefined, rand).map((q) => {
      const correct = rand() < p;
      return { questionId: q.id, selected: correct ? q.answer : (q.answer + 1) % 4, correct };
    }),
  }));
}
