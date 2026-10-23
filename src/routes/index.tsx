import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BarChart3, Target, Timer } from "lucide-react";
import { Logo, NOTICE } from "@/components/AppShell";
import { DOMAINS, QUESTIONS } from "@/lib/questions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ReadyTrack — AZ-900 practice & readiness tracker" },
      { name: "description", content: "Practise original AZ-900 questions, track accuracy by topic and see an honest readiness estimate." },
      { property: "og:title", content: "ReadyTrack — AZ-900 practice & readiness tracker" },
      { property: "og:description", content: "Practise original AZ-900 questions and find your weak topics." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-forest text-forest-foreground">
      <header className="mx-auto flex max-w-6xl items-center justify-between p-6">
        <Logo />
        <Link to="/dashboard" className="text-sm font-medium opacity-80 hover:opacity-100">Dashboard</Link>
      </header>
      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-16 lg:grid-cols-2 lg:py-24">
        <div>
          <p className="mb-4 inline-block rounded-full bg-forest-foreground/10 px-3 py-1 text-xs font-medium">For Azure Fundamentals (AZ-900) learners</p>
          <h1 className="text-4xl font-bold leading-tight sm:text-6xl">Know where you stand before exam day.</h1>
          <p className="mt-6 max-w-lg text-lg opacity-80">
            Practise {QUESTIONS.length}+ original questions, see accuracy by topic, and get an honest readiness estimate — not a guess.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/practice" className="btn btn-primary px-6 py-3 text-base">Start Practising <ArrowRight className="size-4" /></Link>
            <Link to="/topics" className="btn px-6 py-3 text-base ring-1 ring-forest-foreground/30 hover:bg-forest-foreground/10">Browse topics</Link>
          </div>
          <p className="mt-10 text-xs opacity-60">{NOTICE}</p>
        </div>
        <div className="grid gap-4 self-center">
          {DOMAINS.map((d) => (
            <div key={d.id} className="rounded-xl bg-forest-foreground/[0.06] p-5 ring-1 ring-forest-foreground/10">
              <div className="flex items-center justify-between"><h3 className="font-semibold">{d.name}</h3><span className="text-sm opacity-70">{d.weight}</span></div>
              <p className="mt-1 text-sm opacity-70">{d.objectives.slice(0, 2).join(" · ")}</p>
            </div>
          ))}
          <div className="grid grid-cols-3 gap-3 text-sm">
            {[[Target, "Topic accuracy"], [Timer, "Timed or untimed"], [BarChart3, "Progress charts"]].map(([I, t]) => {
              const Icon = I as typeof Target;
              return <div key={t as string} className="flex flex-col items-center gap-2 rounded-xl bg-primary/20 p-4 text-center"><Icon className="size-5" />{t as string}</div>;
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
