import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CATEGORIES, CATEGORY_ICON, RANKS, rankClass, scoreOf, type Category, type Player, type Rank } from "@/lib/tiers";
import { addPlayer, deletePlayer, saveRanks, setDiscord, unlockAdmin, useTiers } from "@/lib/store";

export const Route = createFileRoute("/")({ component: Home });

type Tab = "Overall" | Category;

function Home() {
  const { players, discord, isAdmin } = useTiers();
  const [tab, setTab] = useState<Tab>("Overall");
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Player | null>(null);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = players.filter((p) => p.name.toLowerCase().includes(q));
    if (tab !== "Overall") {
      list = list.filter((p) => p.ranks[tab] !== "None");
    }
    return [...list].sort((a, b) => {
      if (tab === "Overall") return scoreOf(b) - scoreOf(a);
      const pa = a.ranks[tab] === "None" ? 0 : scoreRank(a.ranks[tab]);
      const pb = b.ranks[tab] === "None" ? 0 : scoreRank(b.ranks[tab]);
      return pb - pa;
    });
  }, [players, query, tab]);

  const top = useMemo(() => {
    if (!players.length) return null;
    return [...players].sort((a, b) => scoreOf(b) - scoreOf(a))[0];
  }, [players]);

  return (
    <div className="min-h-screen bg-bg text-fg">
      <header className="flex items-center justify-between border-b border-border bg-surface px-4 py-4 sm:px-10">
        <div className="text-2xl font-black tracking-tight text-accent">ModernTiers</div>
        <button
          type="button"
          className="rounded-lg border border-border bg-surface-2 px-4 py-2 text-sm font-medium"
          onClick={() => {
            if (isAdmin) return;
            const pass = window.prompt("Enter admin password");
            if (pass == null) return;
            if (!unlockAdmin(pass)) window.alert("Wrong password");
          }}
        >
          {isAdmin ? "Admin on" : "Admin"}
        </button>
      </header>

      <div className="flex flex-wrap items-center gap-3 border-b border-border bg-surface px-4 py-3 sm:px-10">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search players..."
          className="min-w-48 flex-1 max-w-xs rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-accent"
        />
        <span className="text-sm text-muted">{players.length} PLAYERS</span>
        <span className="text-sm text-muted">{CATEGORIES.length} CATEGORIES</span>
        <span className="text-sm font-semibold text-accent">
          {top ? `${top.name} — TOP PLAYER` : "—"}
        </span>
        <a
          href={discord}
          target="_blank"
          rel="noreferrer"
          className="ml-auto rounded-lg border border-border bg-surface-2 px-3 py-2 text-xs leading-snug"
        >
          <span className="block text-muted">DISCORD SERVER</span>
          <span className="font-semibold text-sky-400">{discord.replace(/^https?:\/\//, "")}</span>
        </a>
      </div>

      <div className="flex gap-1.5 overflow-x-auto border-b border-border bg-surface px-4 py-3 sm:px-10">
        <TabButton active={tab === "Overall"} label="OVERALL" icon={CATEGORY_ICON.Overall} onClick={() => setTab("Overall")} />
        {CATEGORIES.map((cat) => (
          <TabButton
            key={cat}
            active={tab === cat}
            label={cat}
            icon={CATEGORY_ICON[cat]}
            onClick={() => setTab(cat)}
          />
        ))}
      </div>

      {isAdmin && (
        <div className="flex flex-wrap gap-2 px-4 pt-3 sm:px-10">
          <button
            type="button"
            className="rounded-lg bg-ok px-4 py-2 text-sm font-semibold text-black"
            onClick={() => {
              const name = window.prompt("Enter new player name");
              if (!name) return;
              const err = addPlayer(name);
              if (err) window.alert(err);
            }}
          >
            + Add Player
          </button>
          <button
            type="button"
            className="rounded-lg bg-[#5865F2] px-4 py-2 text-sm font-semibold text-white"
            onClick={() => {
              const next = window.prompt("Discord invite link", discord);
              if (!next?.trim()) return;
              setDiscord(next);
            }}
          >
            Edit Discord
          </button>
        </div>
      )}

      <div className="space-y-2 px-3 py-3 sm:px-10">
        {rows.length === 0 && (
          <div className="py-16 text-center text-muted">No players found.</div>
        )}
        {rows.map((player, i) => (
          <article
            key={player.id}
            className={`flex flex-wrap items-center gap-3 rounded-xl border border-border bg-surface px-3 py-3 ${i === 0 ? "border-l-4 border-l-accent" : ""}`}
          >
            <div className={`w-12 text-center text-2xl font-black ${i === 0 ? "text-accent" : "text-zinc-600"}`}>
              {i + 1}
            </div>
            <img
              alt=""
              width={52}
              height={52}
              className="size-12 rounded-lg bg-surface-2"
              src={`https://mc-heads.net/avatar/${encodeURIComponent(player.name)}/100`}
            />
            <div className="min-w-28 flex-1 text-lg font-bold">{player.name}</div>
            <div className="text-sm text-muted">
              {tab === "Overall" ? `${scoreOf(player)} pts` : ""}
            </div>
            <div className="flex max-w-xl flex-wrap gap-1.5">
              {tab === "Overall" ? (
                CATEGORIES.map((cat) => {
                  const rank = player.ranks[cat];
                  if (rank === "None") return null;
                  return (
                    <span key={cat} className={`rounded-md px-2 py-0.5 text-xs font-bold ${rankClass(rank)}`}>
                      {cat}: {rank}
                    </span>
                  );
                })
              ) : (
                <span className={`rounded-md px-3 py-1 text-sm font-bold ${rankClass(player.ranks[tab])}`}>
                  {player.ranks[tab]}
                </span>
              )}
            </div>
            {isAdmin && (
              <div className="ml-auto flex gap-1.5">
                <button
                  type="button"
                  className="rounded-md bg-sky-500 px-3 py-1.5 text-xs font-semibold text-white"
                  onClick={() => setEditing(player)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="rounded-md bg-danger px-3 py-1.5 text-xs font-semibold text-white"
                  onClick={() => {
                    if (window.confirm(`Delete ${player.name}?`)) deletePlayer(player.id);
                  }}
                >
                  Delete
                </button>
              </div>
            )}
          </article>
        ))}
      </div>

      <footer className="border-t border-border px-4 py-8 text-center text-sm text-muted">
        Skins from{" "}
        <a className="underline" href="https://mc-heads.net" target="_blank" rel="noreferrer">
          MC-Heads
        </a>
      </footer>

      {editing && (
        <EditModal
          player={editing}
          onClose={() => setEditing(null)}
          onSave={(ranks) => {
            saveRanks(editing.id, ranks);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

function scoreRank(rank: Rank) {
  const map: Record<Rank, number> = {
    HT1: 10, LT1: 9, HT2: 8, LT2: 7, HT3: 6, LT3: 5, HT4: 4, LT4: 3, HT5: 2, LT5: 1, None: 0,
  };
  return map[rank];
}

function TabButton({
  active,
  label,
  icon,
  onClick,
}: {
  active: boolean;
  label: string;
  icon: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${
        active ? "bg-accent font-bold text-accent-ink" : "bg-surface-2 text-muted hover:text-fg"
      }`}
    >
      <img src={icon} alt="" width={20} height={20} className="size-5" />
      {label}
    </button>
  );
}

function EditModal({
  player,
  onClose,
  onSave,
}: {
  player: Player;
  onClose: () => void;
  onSave: (ranks: Record<Category, Rank>) => void;
}) {
  const [draft, setDraft] = useState(player.ranks);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-border bg-surface"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-lg font-bold">Edit {player.name}</h2>
          <button type="button" className="text-2xl leading-none text-muted" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="space-y-3 px-5 py-4">
          {CATEGORIES.map((cat) => (
            <label key={cat} className="flex items-center justify-between gap-3 text-sm font-semibold">
              <span className="min-w-28">{cat}</span>
              <select
                className="flex-1 rounded-lg border border-border bg-surface-2 px-3 py-2"
                value={draft[cat]}
                onChange={(e) => setDraft({ ...draft, [cat]: e.target.value as Rank })}
              >
                {RANKS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
        <div className="flex justify-end gap-2 border-t border-border px-5 py-4">
          <button type="button" className="rounded-lg bg-surface-2 px-4 py-2 text-sm font-semibold" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-ink"
            onClick={() => onSave(draft)}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
