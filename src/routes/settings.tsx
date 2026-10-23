import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { buildSampleAttempts } from "@/lib/sample";
import { clearAttempts, loadSampleData, saveProfile, useAttempts, useProfile, type Profile } from "@/lib/store";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Profile & settings — ReadyTrack" },
      { name: "description", content: "Set your name, exam date and default quiz mode, and manage your practice data." },
      { property: "og:title", content: "Profile & settings — ReadyTrack" },
      { property: "og:description", content: "Manage your ReadyTrack profile and data." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Settings,
});

function Settings() {
  const profile = useProfile();
  const attempts = useAttempts();
  const [form, setForm] = useState<Profile>(profile);
  const [saved, setSaved] = useState(false);
  useEffect(() => setForm(profile), [profile]);
  const days = form.examDate ? Math.ceil((new Date(form.examDate).getTime() - Date.now()) / 86400000) : null;
  const input = "mt-1 w-full rounded-lg border bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring";

  return (
    <AppShell title="Profile & settings">
      <div className="grid max-w-4xl gap-6 lg:grid-cols-2">
        <form className="card space-y-4 p-6" onSubmit={(e) => { e.preventDefault(); saveProfile({ ...form, name: form.name.trim().slice(0, 60) }); setSaved(true); setTimeout(() => setSaved(false), 2000); }}>
          <h2 className="font-semibold">Profile</h2>
          <label className="block text-sm">Display name<input className={input} maxLength={60} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
          <label className="block text-sm">Planned exam date<input type="date" className={input} value={form.examDate} onChange={(e) => setForm({ ...form, examDate: e.target.value })} /></label>
          {days !== null && <p className="text-xs text-muted-foreground">{days >= 0 ? `${days} days to go.` : "That date has passed."}</p>}
          <label className="block text-sm">Default quiz mode
            <select className={input} value={form.defaultMode} onChange={(e) => setForm({ ...form, defaultMode: e.target.value as Profile["defaultMode"] })}>
              <option value="learning">Learning</option><option value="test">Test</option>
            </select>
          </label>
          <button className="btn btn-primary">Save</button>
          {saved && <span role="status" className="ml-3 text-sm text-success">Saved in this browser</span>}
        </form>
        <div className="card space-y-4 p-6">
          <h2 className="font-semibold">Your data</h2>
          <p className="text-sm text-muted-foreground">Local mode: {attempts.length} sessions are stored in this browser only. Accounts and cloud sync aren't set up yet.</p>
          <div className="flex flex-wrap gap-2">
            <button className="btn btn-outline" onClick={() => loadSampleData(buildSampleAttempts())}>Load sample data</button>
            <button className="btn btn-outline" disabled={!attempts.some((a) => a.sample)} onClick={() => clearAttempts(true)}>Remove sample data</button>
            <button className="btn btn-outline text-destructive" disabled={!attempts.length} onClick={() => { if (confirm("Delete all practice history?")) clearAttempts(); }}>Delete all history</button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
