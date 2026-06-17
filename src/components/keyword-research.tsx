"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

type Idea = {
  term: string;
  volume: number;
  difficulty: number;
  intent: "informational" | "commercial" | "transactional";
};

const intentStyles: Record<string, string> = {
  informational: "bg-sky-500/15 text-sky-300",
  commercial: "bg-amber-500/15 text-amber-300",
  transactional: "bg-emerald-500/15 text-emerald-300",
};

function difficultyColor(d: number) {
  if (d < 33) return "text-emerald-400";
  if (d < 66) return "text-amber-400";
  return "text-red-400";
}

export function KeywordResearch({
  siteId,
  canEdit,
}: {
  siteId: string;
  canEdit: boolean;
}) {
  const router = useRouter();
  const [seed, setSeed] = useState("");
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [listName, setListName] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function research(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setIdeas([]);
    setSelected({});

    const res = await fetch("/api/keywords/research", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ seed }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Research failed.");
      return;
    }
    const data = await res.json();
    setIdeas(data.ideas);
    if (!listName) setListName(`${seed} keywords`);
  }

  function toggle(term: string) {
    setSelected((p) => ({ ...p, [term]: !p[term] }));
  }

  const chosen = ideas.filter((i) => selected[i.term]);

  async function save() {
    setError(null);
    setSaving(true);
    const res = await fetch(`/api/sites/${siteId}/keyword-lists`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: listName, keywords: chosen }),
    });
    setSaving(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Could not save list.");
      return;
    }
    setIdeas([]);
    setSelected({});
    setSeed("");
    setListName("");
    router.refresh();
  }

  return (
    <div className="space-y-5">
      <form onSubmit={research} className="flex flex-col gap-2 sm:flex-row">
        <input
          value={seed}
          onChange={(e) => setSeed(e.target.value)}
          required
          minLength={2}
          placeholder="Enter a topic, e.g. “cold brew coffee”"
          className="h-11 flex-1 rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] px-4 text-sm outline-none focus:border-[var(--color-accent)] focus:ring-4 focus:ring-[var(--color-accent-soft)]"
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Searching…" : "Find keywords"}
        </Button>
      </form>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}

      {ideas.length > 0 ? (
        <div className="space-y-4">
          <div className="overflow-hidden rounded-xl border border-[var(--color-line)]">
            <table className="w-full text-sm">
              <thead className="bg-white/[0.03] text-left text-xs uppercase tracking-wider text-[var(--color-muted)]">
                <tr>
                  <th className="w-10 px-4 py-2.5"></th>
                  <th className="px-4 py-2.5">Keyword</th>
                  <th className="px-4 py-2.5">Volume</th>
                  <th className="px-4 py-2.5">Difficulty</th>
                  <th className="px-4 py-2.5">Intent</th>
                </tr>
              </thead>
              <tbody>
                {ideas.map((i) => (
                  <tr
                    key={i.term}
                    className="border-t border-[var(--color-line)] hover:bg-white/[0.02]"
                  >
                    <td className="px-4 py-2.5">
                      <input
                        type="checkbox"
                        checked={!!selected[i.term]}
                        onChange={() => toggle(i.term)}
                        disabled={!canEdit}
                        className="h-4 w-4 accent-[var(--color-accent)]"
                      />
                    </td>
                    <td className="px-4 py-2.5 font-medium">{i.term}</td>
                    <td className="px-4 py-2.5 font-mono text-[var(--color-ink-soft)]">
                      {i.volume.toLocaleString()}
                    </td>
                    <td
                      className={`px-4 py-2.5 font-mono ${difficultyColor(
                        i.difficulty
                      )}`}
                    >
                      {i.difficulty}
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] ${
                          intentStyles[i.intent]
                        }`}
                      >
                        {i.intent}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {canEdit ? (
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <input
                value={listName}
                onChange={(e) => setListName(e.target.value)}
                placeholder="List name"
                className="h-10 flex-1 rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] px-4 text-sm outline-none focus:border-[var(--color-accent)] focus:ring-4 focus:ring-[var(--color-accent-soft)]"
              />
              <Button
                type="button"
                onClick={save}
                disabled={saving || chosen.length === 0 || !listName}
              >
                {saving
                  ? "Saving…"
                  : `Save ${chosen.length || ""} keyword${
                      chosen.length === 1 ? "" : "s"
                    }`.trim()}
              </Button>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
