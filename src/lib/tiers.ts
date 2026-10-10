export const CATEGORIES = [
  "Vanilla",
  "UHC",
  "Pot",
  "NethOP",
  "SMP",
  "Diamond SMP",
  "Sword",
  "Axe",
  "Mace",
  "Spear",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const RANKS = [
  "HT1",
  "LT1",
  "HT2",
  "LT2",
  "HT3",
  "LT3",
  "HT4",
  "LT4",
  "HT5",
  "LT5",
  "None",
] as const;

export type Rank = (typeof RANKS)[number];

export const RANK_POINTS: Record<Rank, number> = {
  HT1: 10,
  LT1: 9,
  HT2: 8,
  LT2: 7,
  HT3: 6,
  LT3: 5,
  HT4: 4,
  LT4: 3,
  HT5: 2,
  LT5: 1,
  None: 0,
};

const ASSET = "https://cdn.jsdelivr.net/gh/InventivetalentDev/minecraft-assets@1.21.4/assets/minecraft/textures";

export const CATEGORY_ICON: Record<Category | "Overall", string> = {
  Overall: `${ASSET}/item/nether_star.png`,
  Vanilla: `${ASSET}/item/end_crystal.png`,
  UHC: `${ASSET}/item/golden_apple.png`,
  Pot: `${ASSET}/item/splash_potion.png`,
  NethOP: `${ASSET}/item/netherite_sword.png`,
  SMP: "/shield.svg",
  "Diamond SMP": `${ASSET}/block/cobweb.png`,
  Sword: `${ASSET}/item/diamond_sword.png`,
  Axe: `${ASSET}/item/diamond_axe.png`,
  Mace: `${ASSET}/item/mace.png`,
  Spear: `${ASSET}/item/diamond_spear.png`,
};

export type Player = {
  id: string;
  name: string;
  ranks: Record<Category, Rank>;
};

export const ADMIN_PASSWORD = "AdminAbuse";
export const DEFAULT_DISCORD = "https://discord.gg/x2fBWYB547";

export function emptyRanks(): Record<Category, Rank> {
  return Object.fromEntries(CATEGORIES.map((c) => [c, "None"])) as Record<Category, Rank>;
}

export function scoreOf(player: Player): number {
  return CATEGORIES.reduce((sum, cat) => sum + (RANK_POINTS[player.ranks[cat]] ?? 0), 0);
}

export function slugId(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function rankClass(rank: Rank): string {
  if (rank === "HT1" || rank === "LT1") return "bg-accent text-accent-ink";
  if (rank === "HT2" || rank === "LT2") return "bg-violet-400 text-black";
  if (rank === "HT3" || rank === "LT3") return "bg-sky-400 text-black";
  if (rank === "HT4" || rank === "LT4") return "bg-emerald-400 text-black";
  if (rank === "HT5" || rank === "LT5") return "bg-slate-400 text-black";
  return "bg-surface-2 text-muted";
}
