import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Check, ChevronLeft, ChevronRight, Clock, X } from "lucide-react";
import { z } from "zod";
import { AppShell } from "@/components/AppShell";
import { DOMAINS, QUESTIONS, pickQuestions, type DomainId, type Question } from "@/lib/questions";
import { saveAttempt, useProfile } from "@/lib/store";

const search = z.object({
  domain: z.enum(["all", "cloud", "architecture", "governance"]).optional(),
  topics: z.string().optional(),
});

export const Route = createFileRoute("/practice")({
  validateSearch: search,
  head: () => ({
    meta: [
      { title: "Practice — ReadyTrack" },
      { name: "description", content: "Original AZ-900 practice quizzes by domain, timed or untimed." },
      { property: "og:title", content: "Practice — ReadyTrack" },
      { property: "og:description", content: "Original AZ-900 practice quizzes by domain." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Practice,
});

interface Config { domain: DomainId | "all"; count: number; timed: boolean; mode: "learning" | "test"; topics?: string[] }

function Practice() {
  const s = Route.useSearch();
  const profile = useProfile();
  const [session, setSession] = useState<{ cfg: Config; qs: Question[] } | null>(null);
  const [cfg, setCfg] = useState<Config>({ domain: s.domain ?? "all", count: 10, timed: false, mode: profile.defaultMode });
  useEffect(() => setCfg((c) => ({ ...c, mode: profile.defaultMode })), [profile.defaultMode]);
  const topics = s.topics?.split(",").filter(Boolean);

  if (session) return <AppShell title="Practice"><Quiz cfg={session.cfg} qs={session.qs} onQuit={() => setSession(null)} /></AppShell>;

  const available = QUESTIONS.filter((q) => (cfg.domain === "all" || q.domain === cfg.domain) && (!topics?.length || topics.includes(q.topic))).length;
  const opt = (active: boolean) => `rounded-lg border px-4 py-3 text-left text-sm font-medium transition ${active ? "border-primary bg-secondary ring-2 ring-primary" : "bg-card hover:bg-muted"}`;

  return (
    <AppShell title="Start a practice session">
      <div className="card max-w-3xl space-y-7 p-6">
        {topics?.length ? <p className="rounded-lg bg-secondary px-4 py-2 text-sm">Retrying weak topics: <b>{topics.join(", ")}</b></p> : null}
        <fieldset>
          <legend className="mb-2 font-semibold">Domain</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {[{ id: "all" as const, name: "All domains" }, ...DOMAINS].map((d) => (
              <button key={d.id} className={opt(cfg.domain === d.id)} onClick={() => setCfg({ ...cfg, domain: d.id })} aria-pressed={cfg.domain === d.id}>{d.name}</button>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="mb-2 font-semibold">Number of questions</legend>
          <div className="flex flex-wrap gap-2">
            {[5, 10, 20, 30].map((n) => (
              <button key={n} disabled={n > available && n !== 5} className={opt(cfg.count === n)} onClick={() => setCfg({ ...cfg, count: n })} aria-pressed={cfg.count === n}>{n}</button>
            ))}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">{available} questions available for this selection{cfg.count > available ? ` — you'll get all ${available}` : ""}.</p>
        </fieldset>
        <div className="grid gap-6 sm:grid-cols-2">
          <fieldset>
            <legend className="mb-2 font-semibold">Mode</legend>
            <div className="grid gap-2">
              <button className={opt(cfg.mode === "learning")} onClick={() => setCfg({ ...cfg, mode: "learning" })}>Learning — explanation after each answer</button>
              <button className={opt(cfg.mode === "test")} onClick={() => setCfg({ ...cfg, mode: "test" })}>Test — answers revealed at the end</button>
            </div>
          </fieldset>
          <fieldset>
            <legend className="mb-2 font-semibold">Timer</legend>
            <div className="grid gap-2">
              <button className={opt(!cfg.timed)} onClick={() => setCfg({ ...cfg, timed: false })}>Untimed</button>
              <button className={opt(cfg.timed)} onClick={() => setCfg({ ...cfg, timed: true })}>Timed — 1 minute per question</button>
            </div>
          </fieldset>
        </div>
        <button className="btn btn-primary w-full py-3 text-base" disabled={!available}
          onClick={() => { const c = { ...cfg, topics }; setSession({ cfg: c, qs: pickQuestions(c.domain, c.count, topics) }); }}>
          Start quiz
        </button>
      </div>
    </AppShell>
  );
}

function Quiz({ cfg, qs, onQuit }: { cfg: Config; qs: Question[]; onQuit: () => void }) {
  const navigate = useNavigate();
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(() => qs.map(() => null));
  const [locked, setLocked] = useState<boolean[]>(() => qs.map(() => false));
  const [submitting, setSubmitting] = useState(false);
  const start = useRef(Date.now());
  const limit = qs.length * 60;
  const [elapsed, setElapsed] = useState(0);
  const submitted = useRef(false);

  const submit = () => {
    if (submitted.current) return; // prevent duplicate submissions
    submitted.current = true; setSubmitting(true);
    const id = crypto.randomUUID();
    saveAttempt({
      id, createdAt: new Date().toISOString(), domain: cfg.domain, mode: cfg.mode, timed: cfg.timed,
      durationSec: Math.round((Date.now() - start.current) / 1000),
      responses: qs.map((q, k) => ({ questionId: q.id, selected: answers[k], correct: answers[k] === q.answer })),
    });
    navigate({ to: "/results/$id", params: { id } });
  };

  useEffect(() => {
    const t = setInterval(() => setElapsed(Math.round((Date.now() - start.current) / 1000)), 1000);
    return () => clearInterval(t);
  }, []);
  const answersRef = useRef(answers); answersRef.current = answers;
  useEffect(() => { if (cfg.timed && elapsed >= limit) submit(); }); // auto-submit when time runs out

  const q = qs[i];
  const sel = answers[i];
  const reveal = cfg.mode === "learning" && locked[i];
  const unanswered = answers.filter((a) => a === null).length;
  const remaining = Math.max(0, limit - elapsed);
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_240px]">
      <div className="card p-6">
        <div className="mb-4 flex items-center justify-between text-sm text-muted-foreground">
          <span>Question {i + 1} of {qs.length} · {q.topic} · {q.difficulty}</span>
          <span className="flex items-center gap-1 font-medium"><Clock className="size-4" />{cfg.timed ? `${fmt(remaining)} left` : fmt(elapsed)}</span>
        </div>
        <div className="mb-6 h-1.5 rounded-full bg-secondary"><div className="h-full rounded-full bg-primary" style={{ width: `${((qs.length - unanswered) / qs.length) * 100}%` }} /></div>
        <h2 className="text-lg font-semibold leading-snug">{q.prompt}</h2>
        <div className="mt-5 grid gap-2" role="radiogroup">
          {q.options.map((o, k) => {
            const isSel = sel === k;
            let cls = isSel ? "border-primary bg-secondary ring-2 ring-primary" : "bg-card hover:bg-muted";
            if (reveal && k === q.answer) cls = "border-success bg-secondary ring-2 ring-success";
            else if (reveal && isSel) cls = "border-destructive bg-destructive/10 ring-2 ring-destructive";
            return (
              <button key={k} role="radio" aria-checked={isSel} disabled={locked[i]}
                onClick={() => setAnswers((a) => a.map((v, j) => (j === i ? k : v)))}
                className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition disabled:cursor-default ${cls}`}>
                <span className="grid size-6 shrink-0 place-items-center rounded-full border text-xs font-bold">{String.fromCharCode(65 + k)}</span>
                <span className="flex-1">{o}</span>
                {reveal && k === q.answer && <Check className="size-4 text-success" />}
                {reveal && isSel && k !== q.answer && <X className="size-4 text-destructive" />}
              </button>
            );
          })}
        </div>
        {reveal && <div className="mt-4 rounded-lg bg-secondary p-4 text-sm"><b>{sel === q.answer ? "Correct. " : "Not quite. "}</b>{q.explanation}</div>}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <button className="btn btn-outline" disabled={i === 0} onClick={() => setI(i - 1)}><ChevronLeft className="size-4" />Previous</button>
          <div className="flex gap-2">
            {cfg.mode === "learning" && !locked[i] && (
              <button className="btn btn-primary" disabled={sel === null} onClick={() => setLocked((l) => l.map((v, j) => (j === i ? true : v)))}>Check answer</button>
            )}
            {i < qs.length - 1 && (cfg.mode === "test" || locked[i] || sel === null) && (
              <button className={`btn ${cfg.mode === "test" || locked[i] ? "btn-primary" : "btn-outline"}`} onClick={() => setI(i + 1)}>{sel === null ? "Skip" : "Next"}<ChevronRight className="size-4" /></button>
            )}
          </div>
        </div>
      </div>
      <aside className="card h-fit space-y-4 p-5">
        <p className="text-sm font-semibold">Questions</p>
        <div className="grid grid-cols-5 gap-2">
          {qs.map((_, k) => (
            <button key={k} onClick={() => setI(k)} aria-label={`Go to question ${k + 1}${answers[k] === null ? ", unanswered" : ""}`}
              className={`aspect-square rounded-md text-xs font-semibold ${k === i ? "ring-2 ring-primary" : ""} ${answers[k] !== null ? "bg-primary text-primary-foreground" : "bg-muted"}`}>{k + 1}</button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">{unanswered ? `${unanswered} unanswered — unanswered questions count as incorrect.` : "All questions answered."}</p>
        <button className="btn btn-primary w-full" disabled={submitting}
          onClick={() => { if (!unanswered || confirm(`${unanswered} unanswered. Submit anyway?`)) submit(); }}>
          {submitting ? "Saving…" : "Submit quiz"}
        </button>
        <button className="btn w-full text-muted-foreground hover:text-foreground" onClick={() => { if (confirm("Quit? This session won't be saved.")) onQuit(); }}>Quit without saving</button>
      </aside>
    </div>
  );
}
