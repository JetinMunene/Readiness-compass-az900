import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { attemptScore, type Attempt } from "@/lib/readiness";

export function ScoreChart({ attempts, height = 240 }: { attempts: Attempt[]; height?: number }) {
  const data = [...attempts].sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    .map((a, i) => ({ n: `#${i + 1}`, score: attemptScore(a) }));
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ left: -20, right: 8, top: 8 }}>
        <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
        <XAxis dataKey="n" fontSize={12} stroke="var(--muted-foreground)" />
        <YAxis domain={[0, 100]} fontSize={12} stroke="var(--muted-foreground)" />
        <Tooltip formatter={(v) => [`${v}%`, "Score"]} />
        <Line type="monotone" dataKey="score" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4, fill: "var(--primary)" }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
