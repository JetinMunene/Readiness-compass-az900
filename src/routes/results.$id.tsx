import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, X } from "lucide-react";
import { AppShell, Bar, Stat } from "@/components/AppShell";
import { getQuestion } from "@/lib/questions";
import { attemptScore, band, topicAccuracy } from "@/lib/readiness";
import { useAttempts } from "@/lib/store";

export const Route = createFileRoute("/results/$id")({
  head: () => ({
    meta: [
      { title: "Quiz results — ReadyTrack" },
      { name: "description", content: "Score, topic breakdown and full review of your AZ-900 practice session." },
      { property: "og:title", content: "Quiz results — ReadyTrack" },
      { property: "og:description", content: "Review every question with explanations." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Results,
});

function Results() {
  const { id } = Route.useParams();
  const attempts = useAttempts();
  const a = attempts.find((x) => x.id === id);
  if (!a) return <AppShell title="Results"><div className="card p-8 text-center"><p className="text-muted-foreground">This session wasn't found in this browser.</p><Link to="/practice" className="btn btn-primary mt-4">New quiz</Link></div></AppShell>;

  const score = attemptScore(a);
  const correct = a.responses.filter((r) => r.correct).length;
  const topics = topicAccuracy([a]).sort((x, y) => x.pct - y.pct);
  const weak = topics.filter((t) => t.pct < 70).map((t) => t.topic);
  const fmt = (s: number) => `${Math.floor(s / 60)}m ${s % 60}s`;

  return (
    <AppShell title="Session results">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card bg-forest p-5 text-forest-foreground"><p className="text-sm opacity-75">Score</p><p className="font-display text-4xl font-bold">{score}%</p><p className="text-sm">{band(score)}</p></div>
        <Stat label="Correct" value={correct} />
        <Stat label="Incorrect / skipped" value={a.responses.length - correct} />
        <Stat label="Time used" value={fmt(a.durationSec)} hint={a.timed ? "Timed session" : "Untimed"} />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="card space-y-4 p-5">
          <h2 className="font-semibold">Topic breakdown</h2>
          {topics.map((t) => <div key={t.topic}><div className="mb-1 flex justify-between text-sm"><span>{t.topic}</span><span>{t.correct}/{t.total}</span></div><Bar pct={t.pct} /></div>)}
        </div>
        <div className="card bg-secondary p-5">
          <h2 className="mb-2 font-semibold">Recommended next steps</h2>
          {weak.length ? <p className="text-sm">Revise <b>{weak.join(", ")}</b> on the Study topics page, then retry just those topics.</p>
            : <p className="text-sm">Every topic at 70% or above. Try a longer, timed mixed session to test consistency.</p>}
          <div className="mt-4 flex flex-wrap gap-2">
            {weak.length > 0 && <Link to="/practice" search={{ topics: weak.join(",") }} className="btn btn-primary">Retry weak topics</Link>}
            <Link to="/practice" search={{ domain: a.domain }} className="btn btn-outline">Retry quiz</Link>
            <Link to="/topics" className="btn btn-outline">Study topics</Link>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">Bands are study guidance only, not official passing criteria or a prediction of your exam result.</p>
        </div>
      </div>
      <h2 className="mb-3 mt-8 text-xl font-bold">Review</h2>
      <ol className="space-y-4">
        {a.responses.map((r, k) => {
          const q = getQuestion(r.questionId); if (!q) return null;
          return (
            <li key={k} className="card p-5">
              <div className="flex items-start gap-3">
                <span className={`mt-0.5 grid size-6 shrink-0 place-items-center rounded-full ${r.correct ? "bg-success text-primary-foreground" : "bg-destructive text-destructive-foreground"}`}>{r.correct ? <Check className="size-4" /> : <X className="size-4" />}</span>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">{k + 1}. {q.topic} · {q.difficulty}</p>
                  <p className="font-medium">{q.prompt}</p>
                  <ul className="mt-2 space-y-1 text-sm">
                    {q.options.map((o, j) => <li key={j} className={j === q.answer ? "font-semibold text-success" : j === r.selected ? "text-destructive line-through" : "text-muted-foreground"}>{String.fromCharCode(65 + j)}. {o}</li>)}
                  </ul>
                  {r.selected === null && <p className="mt-1 text-xs text-destructive">Not answered</p>}
                  <p className="mt-3 rounded-lg bg-secondary p-3 text-sm">{q.explanation}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </AppShell>
  );
}
