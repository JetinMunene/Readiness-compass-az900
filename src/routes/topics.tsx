import { createFileRoute, Link } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { DOMAINS, QUESTIONS } from "@/lib/questions";

export const Route = createFileRoute("/topics")({
  head: () => ({
    meta: [
      { title: "Study topics — ReadyTrack" },
      { name: "description", content: "AZ-900 learning objectives by domain with links to official Microsoft Learn material." },
      { property: "og:title", content: "Study topics — ReadyTrack" },
      { property: "og:description", content: "AZ-900 objectives with links to official Microsoft Learn material." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Topics,
});

function Topics() {
  return (
    <AppShell title="Study topics">
      <p className="mb-6 max-w-2xl text-muted-foreground">
        Objectives summarised from the public{" "}
        <a className="text-primary underline" target="_blank" rel="noreferrer" href="https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900">AZ-900 study guide</a>.
        Always check the official guide for the latest outline.
      </p>
      <div className="grid gap-6 lg:grid-cols-3">
        {DOMAINS.map((d) => {
          const topics = [...new Set(QUESTIONS.filter((q) => q.domain === d.id).map((q) => q.topic))];
          return (
            <section key={d.id} className="card flex flex-col p-6">
              <div className="flex items-baseline justify-between gap-2"><h2 className="text-lg font-bold">{d.name}</h2><span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold">{d.weight}</span></div>
              <ul className="mt-4 flex-1 list-disc space-y-2 pl-5 text-sm">{d.objectives.map((o) => <li key={o}>{o}</li>)}</ul>
              <p className="mt-4 text-xs text-muted-foreground">Practice topics: {topics.join(", ")}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <a href={d.learnUrl} target="_blank" rel="noreferrer" className="btn btn-outline">Microsoft Learn <ExternalLink className="size-4" /></a>
                <Link to="/practice" search={{ domain: d.id }} className="btn btn-primary">Practise</Link>
              </div>
            </section>
          );
        })}
      </div>
    </AppShell>
  );
}
