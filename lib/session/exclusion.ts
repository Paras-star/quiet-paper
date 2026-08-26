/**
 * Session exclusion for public selection.
 * This is not a visitor account. Product storage (U7) remains unresolved.
 *
 * Phase 3E-2 MVP: seen ids live in memory for the current page session
 * (lost on refresh). They are sent as arguments; the server still decides
 * eligibility. See docs/development/phase-3e-selection-notes.md.
 */
export type AdviceExclusion = {
  seenIds: readonly string[];
};

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
