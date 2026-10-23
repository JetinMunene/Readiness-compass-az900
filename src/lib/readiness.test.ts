import { describe, expect, it } from "vitest";
import { band, readiness, type Attempt } from "./readiness";
import { QUESTIONS, pickQuestions } from "./questions";

const mk = (id: string, correctRate: number): Attempt => ({
  id, createdAt: new Date().toISOString(), domain: "all", mode: "test", timed: false, durationSec: 60,
  responses: QUESTIONS.map((q, i) => ({ questionId: q.id, selected: 0, correct: i / QUESTIONS.length < correctRate })),
});

describe("readiness bands", () => {
  it("below 50 needs foundation", () => expect(band(49)).toBe("Needs foundation building"));
  it("50 is developing", () => expect(band(50)).toBe("Developing"));
  it("70 is nearly ready", () => expect(band(70)).toBe("Nearly ready; revise weaker topics"));
  it("85 is strong", () => expect(band(85)).toBe("Strong practice performance"));
});

describe("readiness data threshold", () => {
  it("hides status with fewer than 3 sessions", () => {
    expect(readiness([mk("a", 1), mk("b", 1)]).enough).toBe(false);
  });
  it("shows status with 3 full sessions", () => {
    const r = readiness([mk("a", 1), mk("b", 1), mk("c", 1)]);
    expect(r.enough && r.score).toBe(100);
  });
});

describe("question bank", () => {
  it("has at least 30 questions with unique ids", () => {
    expect(QUESTIONS.length).toBeGreaterThanOrEqual(30);
    expect(new Set(QUESTIONS.map((q) => q.id)).size).toBe(QUESTIONS.length);
  });
  it("never repeats within a session", () => {
    const qs = pickQuestions("all", 30);
    expect(new Set(qs.map((q) => q.id)).size).toBe(30);
  });
});
