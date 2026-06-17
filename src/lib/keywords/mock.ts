import type {
  KeywordIdea,
  KeywordIntent,
  KeywordProvider,
} from "./provider";

// Deterministic mock: same seed -> same ideas, so demos are stable and testable.
// Generates realistic-looking long-tail variations with derived metrics.

const MODIFIERS: { tpl: (s: string) => string; intent: KeywordIntent }[] = [
  { tpl: (s) => `${s}`, intent: "informational" },
  { tpl: (s) => `best ${s}`, intent: "commercial" },
  { tpl: (s) => `${s} near me`, intent: "transactional" },
  { tpl: (s) => `how to choose ${s}`, intent: "informational" },
  { tpl: (s) => `${s} reviews`, intent: "commercial" },
  { tpl: (s) => `buy ${s} online`, intent: "transactional" },
  { tpl: (s) => `affordable ${s}`, intent: "commercial" },
  { tpl: (s) => `${s} for beginners`, intent: "informational" },
  { tpl: (s) => `${s} vs alternatives`, intent: "commercial" },
  { tpl: (s) => `${s} guide`, intent: "informational" },
  { tpl: (s) => `top ${s} brands`, intent: "commercial" },
  { tpl: (s) => `${s} delivery`, intent: "transactional" },
];

// Small deterministic hash -> number in [0, 1).
function hash01(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  // Convert to unsigned and normalize.
  return ((h >>> 0) % 100000) / 100000;
}

export class MockKeywordProvider implements KeywordProvider {
  async research(seed: string, limit = 10): Promise<KeywordIdea[]> {
    const clean = seed.trim().toLowerCase().replace(/\s+/g, " ");
    if (!clean) return [];

    const ideas = MODIFIERS.map(({ tpl, intent }) => {
      const term = tpl(clean);
      const r = hash01(term);
      const r2 = hash01(term + "::d");
      // Longer / more specific terms -> lower volume, lower difficulty.
      const lengthPenalty = Math.min(term.split(" ").length, 6) / 6;
      const volume = Math.round((50 + r * 9950) * (1.1 - lengthPenalty * 0.6));
      const difficulty = Math.round(10 + r2 * 80 * (1.1 - lengthPenalty * 0.5));
      return { term, volume, difficulty, intent };
    });

    // Sort by a simple "opportunity" heuristic: high volume, low difficulty.
    ideas.sort(
      (a, b) => b.volume - b.difficulty * 50 - (a.volume - a.difficulty * 50)
    );
    return ideas.slice(0, limit);
  }
}
