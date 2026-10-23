import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { BarChart3, BookOpen, Gauge, ListChecks, Menu, Settings, Sprout, X } from "lucide-react";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: Gauge },
  { to: "/practice", label: "Practice", icon: ListChecks },
  { to: "/progress", label: "Progress", icon: BarChart3 },
  { to: "/topics", label: "Study topics", icon: BookOpen },
  { to: "/settings", label: "Profile & settings", icon: Settings },
] as const;

export const NOTICE = "Unofficial study tool. Not affiliated with or endorsed by Microsoft.";

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold">
      <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground"><Sprout className="size-5" /></span>
      ReadyTrack
    </Link>
  );
}

export function AppShell({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const nav = (
    <nav className="flex flex-col gap-1">
      {NAV.map(({ to, label, icon: Icon }) => (
        <Link key={to} to={to} onClick={() => setOpen(false)}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-forest-foreground/75 transition hover:bg-forest-foreground/10 hover:text-forest-foreground"
          activeProps={{ className: "bg-primary text-primary-foreground hover:bg-primary" }}>
          <Icon className="size-4" />{label}
        </Link>
      ))}
    </nav>
  );
  return (
    <div className="min-h-screen lg:flex">
      <aside className="hidden w-64 shrink-0 flex-col justify-between bg-forest p-5 text-forest-foreground lg:sticky lg:top-0 lg:flex lg:h-screen">
        <div className="space-y-8"><Logo />{nav}</div>
        <p className="text-xs text-forest-foreground/60">{NOTICE}</p>
      </aside>
      <header className="flex items-center justify-between bg-forest px-4 py-3 text-forest-foreground lg:hidden">
        <Logo />
        <button aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(!open)} className="rounded-md p-2">
          {open ? <X /> : <Menu />}
        </button>
      </header>
      {open && <div className="bg-forest px-4 pb-4 lg:hidden">{nav}</div>}
      <main className="mx-auto w-full max-w-6xl flex-1 p-4 sm:p-6 lg:p-10">
        <h1 className="mb-6 text-2xl font-bold sm:text-3xl">{title}</h1>
        {children}
        <p className="mt-12 text-center text-xs text-muted-foreground lg:hidden">{NOTICE}</p>
      </main>
    </div>
  );
}

export function Stat({ label, value, hint }: { label: string; value: ReactNode; hint?: string }) {
  return (
    <div className="card p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-3xl font-bold">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function Bar({ pct }: { pct: number }) {
  return (
    <div className="h-2.5 overflow-hidden rounded-full bg-secondary" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
      <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
    </div>
  );
}
