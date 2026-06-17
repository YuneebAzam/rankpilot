// Keyword research provider abstraction.
//
// The app depends on this interface, never on a concrete vendor. Swap the mock
// for a real API (e.g. DataForSEO, Semrush) in one place — see `getKeywordProvider`.

export type KeywordIntent = "informational" | "commercial" | "transactional";

export type KeywordIdea = {
  term: string;
  volume: number; // estimated monthly searches
  difficulty: number; // 0–100
  intent: KeywordIntent;
};

export interface KeywordProvider {
  research(seed: string, limit?: number): Promise<KeywordIdea[]>;
}

let provider: KeywordProvider | null = null;

export function getKeywordProvider(): KeywordProvider {
  if (provider) return provider;
  // Only the mock exists today. A real provider would be selected here based on
  // env (e.g. if (process.env.DATAFORSEO_KEY) provider = new DataForSeoProvider()).
  // Lazy import keeps the provider modules decoupled.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { MockKeywordProvider } = require("./mock") as typeof import("./mock");
  provider = new MockKeywordProvider();
  return provider;
}
