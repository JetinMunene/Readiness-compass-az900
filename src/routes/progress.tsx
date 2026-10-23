import { createFileRoute, Link } from "@tanstack/react-router";
import { Bar as RBar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AppShell, Bar } from "@/components/AppShell";
import { ScoreChart } from "@/components/ScoreChart";
import { domainName } from "@/lib/questions";
import { attemptScore, topicAccuracy } from "@/lib/readiness";
import { useAttempts } from "@/lib/store";

export const Route = createFileRoute("/progress")({
  head: () => ({
    meta: [
      { title: "Progress — ReadyTrack" },
      { name: "description", content: "Historical AZ-900 practice scores, topic accuracy and improvement over time." },
      { property: "og:title", content: "Progress — ReadyTrack" },
      { property: "og:description", content: "Your AZ-900 practice history and improvement." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Progress,
});

function Progress() {
  const attempts = useAttempts();
  if (!attempts.length) return <AppShell title="Progress"><div className="card p-10 text-center"><p className="text-muted-foreground">Your history will appear after your first quiz.</p><Link to="/practice" className="btn btn-primary mt-4">Start First Quiz</Link></div></AppShell>;
  const sorted = [...attempts].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  const half = Math.ceil(sorted.length / 2);
  const avg = (xs: typeof sorted) => xs.length ? Math.round(xs.reduce((s, a) => s + attemptScore(a), 0) / xs.length) : 0;
  const delta = sorted.length > 1 ? avg(sorted.slice(half)) - avg(sorted.slice(0, half)) : 0;
  const topics = topicAccuracy(attempts).sort((a, b) => b.pct - a.pct);

  return (
    <AppShell title="Progress">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2"><h2 className="mb-4 font-semibold">Score history</h2><ScoreChart attempts={attempts} height={280} /></div>
        <div className="card p-5">
          <h2 className="font-semibold">Improvement</h2>
          <p className={`mt-2 font-display text-4xl font-bold ${delta >= 0 ? "text-success" : "text-destructive"}`}>{delta >= 0 ? "+" : ""}{delta} pts</p>
          <p className="mt-1 text-sm text-muted-foreground">Average of your recent half of sessions compared with your earlier half.</p>
        </div>
      </div>
      <div className="card mt-6 p-5">
        <h2 className="mb-4 font-semibold">Accuracy by topic</h2>
        <ResponsiveContainer width="100%" height={Math.max(220, topics.length * 30)}>
          <BarChart data={topics} layout="vertical" margin={{ left: 40 }}>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
            <XAxis type="number" domain={[0, 100]} fontSize={12} />
            <YAxis type="category" dataKey="topic" width={160} fontSize={12} />
            <Tooltip formatter={(v) => [`${v}%`, "Accuracy"]} />
            <RBar dataKey="pct" fill="var(--primary)" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="card mt-6 overflow-x-auto p-5">
        <h2 className="mb-3 font-semibold">All sessions</h2>
        <table className="w-full text-sm">
          <thead className="text-left text-muted-foreground"><tr><th className="py-2">Date</th><th>Domain</th><th>Mode</th><th>Questions</th><th>Score</th><th /></tr></thead>
          <tbody>{[...sorted].reverse().map((a) => (
            <tr key={a.id} className="border-t">
              <td className="py-2">{new Date(a.createdAt).toLocaleDateString()}{a.sample && <span className="ml-2 rounded bg-secondary px-1.5 text-xs">sample</span>}</td>
              <td>{a.domain === "all" ? "All" : domainName(a.domain)}</td><td className="capitalize">{a.mode}</td><td>{a.responses.length}</td>
              <td className="w-32"><div className="flex items-center gap-2"><span className="w-10 font-semibold">{attemptScore(a)}%</span><div className="flex-1"><Bar pct={attemptScore(a)} /></div></div></td>
              <td className="text-right"><Link to="/results/$id" params={{ id: a.id }} className="text-primary hover:underline">Review</Link></td>
            </tr>))}</tbody>
        </table>
      </div>
    </AppShell>
  );
}
