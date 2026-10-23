import { useSyncExternalStore } from "react";
import type { Attempt } from "./readiness";

// Local (demo) mode: data is saved in this browser only.
const KEY = "readytrack.attempts.v1";
const PKEY = "readytrack.profile.v1";
const listeners = new Set<() => void>();
const EMPTY: Attempt[] = [];
let cache: Attempt[] | null = null;

function read(): Attempt[] {
  if (cache) return cache;
  try { cache = JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { cache = []; }
  return cache!;
}
function write(v: Attempt[]) {
  localStorage.setItem(KEY, JSON.stringify(v));
  cache = v; listeners.forEach((l) => l());
}
const subscribe = (l: () => void) => { listeners.add(l); return () => listeners.delete(l); };

export function useAttempts() {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}
export function saveAttempt(a: Attempt) {
  if (read().some((x) => x.id === a.id)) return; // duplicate guard
  write([...read(), a]);
}
export function clearAttempts(onlySample = false) {
  write(onlySample ? read().filter((a) => !a.sample) : []);
}
export function loadSampleData(samples: Attempt[]) {
  write([...read().filter((a) => !a.sample), ...samples]);
}

export interface Profile { name: string; examDate: string; defaultMode: "learning" | "test" }
const DEFAULT_PROFILE: Profile = { name: "", examDate: "", defaultMode: "learning" };
let pcache: Profile | null = null;
function readProfile(): Profile {
  if (pcache) return pcache;
  try { pcache = { ...DEFAULT_PROFILE, ...JSON.parse(localStorage.getItem(PKEY) || "{}") }; } catch { pcache = DEFAULT_PROFILE; }
  return pcache!;
}
export function useProfile() {
  return useSyncExternalStore(subscribe, readProfile, () => DEFAULT_PROFILE);
}
export function saveProfile(p: Profile) {
  localStorage.setItem(PKEY, JSON.stringify(p)); pcache = p; listeners.forEach((l) => l());
}
