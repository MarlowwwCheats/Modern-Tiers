import { useSyncExternalStore } from "react";
import { ADMIN_PASSWORD, DEFAULT_DISCORD, emptyRanks, slugId, type Player, type Rank, type Category } from "@/lib/tiers";

const PLAYERS_KEY = "moderntiers.players";
const DISCORD_KEY = "moderntiers.discord";
const ADMIN_KEY = "moderntiers.admin";

type State = {
  players: Player[];
  discord: string;
  isAdmin: boolean;
};

let state: State = {
  players: [],
  discord: DEFAULT_DISCORD,
  isAdmin: false,
};

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((fn) => fn());
}

function persist() {
  if (typeof window === "undefined") return;
  localStorage.setItem(PLAYERS_KEY, JSON.stringify(state.players));
  localStorage.setItem(DISCORD_KEY, state.discord);
}

function hydrate() {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(PLAYERS_KEY);
    const discord = localStorage.getItem(DISCORD_KEY);
    const admin = sessionStorage.getItem(ADMIN_KEY) === "1";
    state = {
      players: raw ? (JSON.parse(raw) as Player[]) : [],
      discord: discord || DEFAULT_DISCORD,
      isAdmin: admin,
    };
  } catch {
    state = { players: [], discord: DEFAULT_DISCORD, isAdmin: false };
  }
}

if (typeof window !== "undefined") hydrate();

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function getSnapshot() {
  return state;
}

const serverSnapshot: State = { players: [], discord: DEFAULT_DISCORD, isAdmin: false };

export function useTiers() {
  return useSyncExternalStore(subscribe, getSnapshot, () => serverSnapshot);
}

export function unlockAdmin(password: string): boolean {
  if (password !== ADMIN_PASSWORD) return false;
  state = { ...state, isAdmin: true };
  sessionStorage.setItem(ADMIN_KEY, "1");
  emit();
  return true;
}

export function addPlayer(name: string): string | null {
  const trimmed = name.trim();
  const id = slugId(trimmed);
  if (!id) return "Name needs at least one letter or number.";
  if (state.players.some((p) => p.id === id)) return "That player already exists.";
  state = {
    ...state,
    players: [...state.players, { id, name: trimmed, ranks: emptyRanks() }],
  };
  persist();
  emit();
  return null;
}

export function saveRanks(id: string, ranks: Record<Category, Rank>) {
  state = {
    ...state,
    players: state.players.map((p) => (p.id === id ? { ...p, ranks } : p)),
  };
  persist();
  emit();
}

export function deletePlayer(id: string) {
  state = { ...state, players: state.players.filter((p) => p.id !== id) };
  persist();
  emit();
}

export function setDiscord(link: string) {
  state = { ...state, discord: link.trim() };
  persist();
  emit();
}
