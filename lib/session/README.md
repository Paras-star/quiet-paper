# Session

Age context and seen-advice identifiers for a visit. Storage mechanism is unresolved (U7). This is not a visitor account.

`exclusion.ts` is the argument shape for selection (`seenIds`) plus in-memory per-age helpers used by the public loop (Phase 3E-2) and by post-report session hide (Phase 3G). Nothing is stored in cookies or `sessionStorage`. After every eligible piece for an age has been shown once, the session exclusion for that age is cleared so the next pick can recycle randomly; a first pick that is already empty stays exhausted.
