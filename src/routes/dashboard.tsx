import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, Bar, Stat } from "@/components/AppShell";
import { ScoreChart } from "@/components/ScoreChart";
import { DOMAINS, domainName } from "@/lib/questions";
import { attemptScore, domainAccuracy, MIN_QUESTIONS, MIN_SESSIONS, readiness, topicAccuracy } from "@/lib/readiness";
import { loadSampleData, useAttempts } from "@/lib/store";
import { buildSampleAttempts } from "@/lib/sample";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — ReadyTrack" },
      { name: "description", content: "Your AZ-900 practice accuracy, readiness estimate and weakest topics." },
      { property: "og:title", content: "Dashboard — ReadyTrack" },
      { property: "og:description", content: "Your AZ-900 practice accuracy and readiness estimate." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const attempts = useAttempts();
  if (!attempts.length) {
    return (
      <AppShell title="Dashboard">
        <div className="card mx-auto max-w-xl p-10 text-center">
          <h2 className="text-xl font-bold">No practice yet</h2>
          <p className="mt-2 text-muted-foreground">Take a short quiz and your accuracy, weak topics and readiness estimate will appear here.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/practice" className="btn btn-primary">Start First Quiz</Link>
            <button className="btn btn-outline" onClick={() => loadSampleData(buildSampleAttempts())}>Explore with sample data</button>
          </div>
        </div>
      </AppShell>
    );
  }
  const total = attempts.reduce((s, a) => s + a.responses.length, 0);
  const correct = attempts.reduce((s, a) => s + a.responses.filter((r) => r.correct).length, 0);
  const r = readiness(attempts);
  const dom = domainAccuracy(attempts);
  const weak = topicAccuracy(attempts).sort((a, b) => a.pct - b.pct).slice(0, 3);
  const recent = [...attempts].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);
  const hasSample = attempts.some((a) => a.sample);

  return (
    <AppShell title="Dashboard">
      {hasSample && <p className="mb-4 rounded-lg bg-secondary px-4 py-2 text-sm text-secondary-foreground">Showing sample demonstration data — not a real learner's results. Remove it in Settings.</p>}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card bg-forest p-5 text-forest-foreground sm:col-span-2 lg:col-span-1">
          <p className="text-sm opacity-75">Estimated readiness</p>
          {r.enough ? (<>
            <p className="mt-1 font-display text-4xl font-bold">{r.score}%</p>
            <p className="mt-1 text-sm font-medium">{r.label}</p>
          </>) : (<>
            <p className="mt-2 font-semibold">Not enough practice data yet</p>
            <p className="mt-1 text-xs opacity-75">
              Needs {MIN_SESSIONS}+ sessions and {MIN_QUESTIONS}+ answers covering all domains ({r.sessions}/{MIN_SESSIONS} sessions, {r.totalQuestions}/{MIN_QUESTIONS} answers{r.missing.length ? `; missing: ${r.missing.join(", ")}` : ""}).
            </p>
          </>)}
        </div>
        <Stat label="Overall accuracy" value={`${Math.round((correct / total) * 100)}%`} />
        <Stat label="Questions answered" value={total} />
        <Stat label="Sessions completed" value={attempts.length} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2"><h2 className="mb-4 font-semibold">Score history</h2><ScoreChart attempts={attempts} /></div>
        <div className="card space-y-5 p-5">
          <h2 className="font-semibold">Domain progress</h2>
          {DOMAINS.map((d) => {
            const pct = dom[d.id].total ? Math.round((dom[d.id].correct / dom[d.id].total) * 100) : 0;
            return <div key={d.id}><div className="mb-1 flex justify-between text-sm"><span>{d.name}</span><span className="font-semibold">{dom[d.id].total ? `${pct}%` : "—"}</span></div><Bar pct={pct} /></div>;
          })}
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="card p-5">
          <h2 className="mb-3 font-semibold">Weakest topics</h2>
          <ul className="space-y-2 text-sm">{weak.map((t) => <li key={t.topic} className="flex justify-between"><span>{t.topic}</span><span className="font-semibold text-destructive">{t.pct}%</span></li>)}</ul>
        </div>
        <div className="card p-5">
          <h2 className="mb-3 font-semibold">Recent attempts</h2>
          <ul className="space-y-2 text-sm">{recent.map((a) => (
            <li key={a.id}><Link to="/results/$id" params={{ id: a.id }} className="flex justify-between hover:text-primary">
              <span>{a.domain === "all" ? "All domains" : domainName(a.domain)} · {a.responses.length}q</span><span className="font-semibold">{attemptScore(a)}%</span>
            </Link></li>))}</ul>
        </div>
        <div className="card bg-secondary p-5">
          <h2 className="mb-2 font-semibold">Suggested next session</h2>
          {weak[0] ? <>
            <p className="text-sm text-muted-foreground">Focus on <b className="text-foreground">{weak[0].topic}</b> in {domainName(weak[0].domain)}, then mix in a full 20-question set.</p>
            <Link to="/practice" search={{ domain: weak[0].domain }} className="btn btn-primary mt-4">Practise {domainName(weak[0].domain)}</Link>
          </> : <Link to="/practice" className="btn btn-primary">Practise</Link>}
        </div>
      </div>
    </AppShell>
  );
}
