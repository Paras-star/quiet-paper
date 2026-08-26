# Phase 3E-1 selection foundation notes
Implementation notes only. Does **not** close U1–U20.

## I7 — flagged vs withhold column
`docs/architecture/implementation-plan.md` requires **one** source of truth.
**Choice:** `advice.status` is the only visibility field. Public selection requires `status = 
'approved'`. `pending`, `rejected`, and `flagged` are ineligible. There is no separate withhold 
column.
This does **not** decide U6 (when a live item becomes flagged). It only models “not in the public 
pool” as a status other than `approved`.
## I6 — body length
Until U2 is locked, the database rejects bodies longer than **4000** characters (`lib/validation/
advice-body.ts`). That is an engineering ceiling, not the product character limit.
## Randomness
`pick_public_advice` uses `ORDER BY random() LIMIT 1` among eligible rows. Uniform. No 
weighting (U19).
## Session (U7)

`seenIds` is an argument to selection. Product storage remains unresolved.
**Phase 3E-2 MVP (not a close of U7):** in-memory, per-tab React state, keyed by age. Lost on 
refresh. Repeats across visits are allowed. The browser sends the list; the server still validates 
age and eligibility. No cookie, `sessionStorage`, or sessions table.
## I1 — public obtain/next boundary
**Phase 3E-2 choice (not a close of I1):** one `"use server"` action (`requestPublicAdvice`) 
wrapping `pickPublicAdvice`. No credentialed session cookie, so CSRF for cookie mutations 
does not apply to this path.
## Packages
`@supabase/supabase-js` is the official client for server queries. `server-only` stops that module 
from being imported into client components.
