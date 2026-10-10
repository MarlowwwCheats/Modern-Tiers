import { i as __toESM } from "../_runtime.mjs";
import { K as require_react, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-D75gTH9J.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CATEGORIES = [
	"Vanilla",
	"UHC",
	"Pot",
	"NethOP",
	"SMP",
	"Diamond SMP",
	"Sword",
	"Axe",
	"Mace",
	"Spear"
];
var RANKS = [
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
	"None"
];
var RANK_POINTS = {
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
	None: 0
};
var ASSET = "https://cdn.jsdelivr.net/gh/InventivetalentDev/minecraft-assets@1.21.4/assets/minecraft/textures";
var CATEGORY_ICON = {
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
	Spear: `${ASSET}/item/diamond_spear.png`
};
var DEFAULT_DISCORD = "https://discord.gg/x2fBWYB547";
function emptyRanks() {
	return Object.fromEntries(CATEGORIES.map((c) => [c, "None"]));
}
function scoreOf(player) {
	return CATEGORIES.reduce((sum, cat) => sum + (RANK_POINTS[player.ranks[cat]] ?? 0), 0);
}
function slugId(name) {
	return name.toLowerCase().replace(/[^a-z0-9]/g, "");
}
function rankClass(rank) {
	if (rank === "HT1" || rank === "LT1") return "bg-accent text-accent-ink";
	if (rank === "HT2" || rank === "LT2") return "bg-violet-400 text-black";
	if (rank === "HT3" || rank === "LT3") return "bg-sky-400 text-black";
	if (rank === "HT4" || rank === "LT4") return "bg-emerald-400 text-black";
	if (rank === "HT5" || rank === "LT5") return "bg-slate-400 text-black";
	return "bg-surface-2 text-muted";
}
var PLAYERS_KEY = "moderntiers.players";
var DISCORD_KEY = "moderntiers.discord";
var ADMIN_KEY = "moderntiers.admin";
var state = {
	players: [],
	discord: DEFAULT_DISCORD,
	isAdmin: false
};
var listeners = /* @__PURE__ */ new Set();
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
			players: raw ? JSON.parse(raw) : [],
			discord: discord || "https://discord.gg/x2fBWYB547",
			isAdmin: admin
		};
	} catch {
		state = {
			players: [],
			discord: DEFAULT_DISCORD,
			isAdmin: false
		};
	}
}
if (typeof window !== "undefined") hydrate();
function subscribe(fn) {
	listeners.add(fn);
	return () => listeners.delete(fn);
}
function getSnapshot() {
	return state;
}
var serverSnapshot = {
	players: [],
	discord: DEFAULT_DISCORD,
	isAdmin: false
};
function useTiers() {
	return (0, import_react.useSyncExternalStore)(subscribe, getSnapshot, () => serverSnapshot);
}
function unlockAdmin(password) {
	if (password !== "AdminAbuse") return false;
	state = {
		...state,
		isAdmin: true
	};
	sessionStorage.setItem(ADMIN_KEY, "1");
	emit();
	return true;
}
function addPlayer(name) {
	const trimmed = name.trim();
	const id = slugId(trimmed);
	if (!id) return "Name needs at least one letter or number.";
	if (state.players.some((p) => p.id === id)) return "That player already exists.";
	state = {
		...state,
		players: [...state.players, {
			id,
			name: trimmed,
			ranks: emptyRanks()
		}]
	};
	persist();
	emit();
	return null;
}
function saveRanks(id, ranks) {
	state = {
		...state,
		players: state.players.map((p) => p.id === id ? {
			...p,
			ranks
		} : p)
	};
	persist();
	emit();
}
function deletePlayer(id) {
	state = {
		...state,
		players: state.players.filter((p) => p.id !== id)
	};
	persist();
	emit();
}
function setDiscord(link) {
	state = {
		...state,
		discord: link.trim()
	};
	persist();
	emit();
}
function Home() {
	const { players, discord, isAdmin } = useTiers();
	const [tab, setTab] = (0, import_react.useState)("Overall");
	const [query, setQuery] = (0, import_react.useState)("");
	const [editing, setEditing] = (0, import_react.useState)(null);
	const rows = (0, import_react.useMemo)(() => {
		const q = query.trim().toLowerCase();
		let list = players.filter((p) => p.name.toLowerCase().includes(q));
		if (tab !== "Overall") list = list.filter((p) => p.ranks[tab] !== "None");
		return [...list].sort((a, b) => {
			if (tab === "Overall") return scoreOf(b) - scoreOf(a);
			const pa = a.ranks[tab] === "None" ? 0 : scoreRank(a.ranks[tab]);
			return (b.ranks[tab] === "None" ? 0 : scoreRank(b.ranks[tab])) - pa;
		});
	}, [
		players,
		query,
		tab
	]);
	const top = (0, import_react.useMemo)(() => {
		if (!players.length) return null;
		return [...players].sort((a, b) => scoreOf(b) - scoreOf(a))[0];
	}, [players]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center justify-between border-b border-border bg-surface px-4 py-4 sm:px-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-2xl font-black tracking-tight text-accent",
					children: "ModernTiers"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "rounded-lg border border-border bg-surface-2 px-4 py-2 text-sm font-medium",
					onClick: () => {
						if (isAdmin) return;
						const pass = window.prompt("Enter admin password");
						if (pass == null) return;
						if (!unlockAdmin(pass)) window.alert("Wrong password");
					},
					children: isAdmin ? "Admin on" : "Admin"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-3 border-b border-border bg-surface px-4 py-3 sm:px-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: query,
						onChange: (e) => setQuery(e.target.value),
						placeholder: "Search players...",
						className: "min-w-48 flex-1 max-w-xs rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-accent"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-sm text-muted",
						children: [players.length, " PLAYERS"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-sm text-muted",
						children: [CATEGORIES.length, " CATEGORIES"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm font-semibold text-accent",
						children: top ? `${top.name} — TOP PLAYER` : "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: discord,
						target: "_blank",
						rel: "noreferrer",
						className: "ml-auto rounded-lg border border-border bg-surface-2 px-3 py-2 text-xs leading-snug",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-muted",
							children: "DISCORD SERVER"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold text-sky-400",
							children: discord.replace(/^https?:\/\//, "")
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-1.5 overflow-x-auto border-b border-border bg-surface px-4 py-3 sm:px-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabButton, {
					active: tab === "Overall",
					label: "OVERALL",
					icon: CATEGORY_ICON.Overall,
					onClick: () => setTab("Overall")
				}), CATEGORIES.map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabButton, {
					active: tab === cat,
					label: cat,
					icon: CATEGORY_ICON[cat],
					onClick: () => setTab(cat)
				}, cat))]
			}),
			isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2 px-4 pt-3 sm:px-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "rounded-lg bg-ok px-4 py-2 text-sm font-semibold text-black",
					onClick: () => {
						const name = window.prompt("Enter new player name");
						if (!name) return;
						const err = addPlayer(name);
						if (err) window.alert(err);
					},
					children: "+ Add Player"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "rounded-lg bg-[#5865F2] px-4 py-2 text-sm font-semibold text-white",
					onClick: () => {
						const next = window.prompt("Discord invite link", discord);
						if (!next?.trim()) return;
						setDiscord(next);
					},
					children: "Edit Discord"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2 px-3 py-3 sm:px-10",
				children: [rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "py-16 text-center text-muted",
					children: "No players found."
				}), rows.map((player, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: `flex flex-wrap items-center gap-3 rounded-xl border border-border bg-surface px-3 py-3 ${i === 0 ? "border-l-4 border-l-accent" : ""}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `w-12 text-center text-2xl font-black ${i === 0 ? "text-accent" : "text-zinc-600"}`,
							children: i + 1
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							alt: "",
							width: 52,
							height: 52,
							className: "size-12 rounded-lg bg-surface-2",
							src: `https://mc-heads.net/avatar/${encodeURIComponent(player.name)}/100`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "min-w-28 flex-1 text-lg font-bold",
							children: player.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm text-muted",
							children: tab === "Overall" ? `${scoreOf(player)} pts` : ""
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex max-w-xl flex-wrap gap-1.5",
							children: tab === "Overall" ? CATEGORIES.map((cat) => {
								const rank = player.ranks[cat];
								if (rank === "None") return null;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: `rounded-md px-2 py-0.5 text-xs font-bold ${rankClass(rank)}`,
									children: [
										cat,
										": ",
										rank
									]
								}, cat);
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `rounded-md px-3 py-1 text-sm font-bold ${rankClass(player.ranks[tab])}`,
								children: player.ranks[tab]
							})
						}),
						isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "ml-auto flex gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "rounded-md bg-sky-500 px-3 py-1.5 text-xs font-semibold text-white",
								onClick: () => setEditing(player),
								children: "Edit"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "rounded-md bg-danger px-3 py-1.5 text-xs font-semibold text-white",
								onClick: () => {
									if (window.confirm(`Delete ${player.name}?`)) deletePlayer(player.id);
								},
								children: "Delete"
							})]
						})
					]
				}, player.id))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				className: "border-t border-border px-4 py-8 text-center text-sm text-muted",
				children: [
					"Skins from",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						className: "underline",
						href: "https://mc-heads.net",
						target: "_blank",
						rel: "noreferrer",
						children: "MC-Heads"
					})
				]
			}),
			editing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditModal, {
				player: editing,
				onClose: () => setEditing(null),
				onSave: (ranks) => {
					saveRanks(editing.id, ranks);
					setEditing(null);
				}
			})
		]
	});
}
function scoreRank(rank) {
	return {
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
		None: 0
	}[rank];
}
function TabButton({ active, label, icon, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		className: `flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${active ? "bg-accent font-bold text-accent-ink" : "bg-surface-2 text-muted hover:text-fg"}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: icon,
			alt: "",
			width: 20,
			height: 20,
			className: "size-5"
		}), label]
	});
}
function EditModal({ player, onClose, onSave }) {
	const [draft, setDraft] = (0, import_react.useState)(player.ranks);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4",
		onClick: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-border bg-surface",
			onClick: (e) => e.stopPropagation(),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b border-border px-5 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "text-lg font-bold",
						children: ["Edit ", player.name]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "text-2xl leading-none text-muted",
						onClick: onClose,
						children: "×"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-3 px-5 py-4",
					children: CATEGORIES.map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center justify-between gap-3 text-sm font-semibold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "min-w-28",
							children: cat
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							className: "flex-1 rounded-lg border border-border bg-surface-2 px-3 py-2",
							value: draft[cat],
							onChange: (e) => setDraft({
								...draft,
								[cat]: e.target.value
							}),
							children: RANKS.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: r,
								children: r
							}, r))
						})]
					}, cat))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-end gap-2 border-t border-border px-5 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "rounded-lg bg-surface-2 px-4 py-2 text-sm font-semibold",
						onClick: onClose,
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-ink",
						onClick: () => onSave(draft),
						children: "Save Changes"
					})]
				})
			]
		})
	});
}
//#endregion
export { Home as component };
