/**
 * Session exclusion for public selection.
 * This is not a visitor account. Product storage (U7) remains unresolved.
 *
 * Phase 3E-2 MVP: seen ids live in memory for the current page session
 * (lost on refresh). They are sent as arguments; the server still decides
 * eligibility. See docs/development/phase-3e-selection-notes.md.
 *
 * Within one age session, each eligible piece is shown at most once. After
 * that pool is exhausted, the client clears the age's seen ids and picks
 * again. A pick with an empty exclusion that is already exhausted is a
 * genuine empty pool and is not recycled.
 */
export type AdviceExclusion = {
  seenIds: readonly string[];
};

/** Upper bound on UUIDs sent to pick_public_advice. Above the current corpus. */
export const MAX_ADVICE_EXCLUSION_IDS = 200;

export type SeenByAge = Readonly<Record<number, readonly string[]>>;

export function seenIdsForAge(seen: SeenByAge, age: number): readonly string[] {
  return seen[age] ?? [];
}

export function rememberSeen(seen: SeenByAge, age: number, id: string): SeenByAge {
  const current = seen[age] ?? [];
  if (current.includes(id)) {
    return seen;
  }
  return { ...seen, [age]: [...current, id] };
}

export function clearSeenForAge(seen: SeenByAge, age: number): SeenByAge {
  if (!(age in seen)) {
    return seen;
  }
  const next: Record<number, readonly string[]> = { ...seen };
  delete next[age];
  return next;
}

/** First obtain for an age, or a new See-advice request, starts a fresh cycle. */
export function startAdviceSession(seen: SeenByAge, age: number): SeenByAge {
  return clearSeenForAge(seen, age);
}

/** Recycle only when this session already displayed at least one piece. */
export function shouldRecycleExhaustion(seenIds: readonly string[]): boolean {
  return seenIds.length > 0;
}
