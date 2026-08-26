# Phase 3H security notes
Implementation notes only. Does **not** close U1–U20, I4, or U11.
## What was implemented
- In-process server rate limits on **contribute**, **report**, and **select/next**, checked in Server 
Actions **before** database work.
- Conservative HTTP headers in `next.config.ts`.
- Verification that existing RLS (enable + force, no public grants, no policies) remains deny-by-
default for `anon` / `authenticated`.
- CAPTCHA **not** added.
## Rate-limit mechanism

| Item | Choice |
| --- | --- |
| Store | In-memory `Map` in the Next.js server process |
| Window | Sliding timestamps |
| Client key | First `X-Forwarded-For` hop, else `X-Real-IP`, else `unknown`. Coarse. Not identity. |
| Shared store | **No.** Multiple Vercel instances do not share counts (I4 still open). |
| Failures | Limiter errors  generic `unavailable`. Limited  `rate-limited` without internals. |
### Provisional limits (not a U11 close)
| Scope | Limit | Window |
| --- | --- | --- |
| `contribute` | 5 | 10 minutes |
| `report` | 8 | 10 minutes |
| `select` | 40 | 1 minute |
These are engineering defaults so anonymous writes are not unlimited. Exact numbers, visible 
CAPTCHA, and a shared store remain **U11 / I4**.

Public copy:
- Select/next: UX E4 `Please wait a moment before requesting another piece.`
- Contribute: `Please wait a moment before sending again.`
- Report: `Please wait a moment before sending another report.`
No countdown timer.
## Protected mutation / read paths
| Action | When limited |
| --- | --- |
| `submitCommunityAdvice` | No insert |
| `submitAdviceReport` | No lookup/insert |
| `requestPublicAdvice` | No `pick_public_advice` RPC |
Contribution still hardcodes `pending` + `community`. Reports still require `approved` and do not 
change status.
## RLS verification

`0001_advice.sql` and `0002_reports.sql`:
- RLS enabled and **forced** on `advice` and `advice_report`
- `REVOKE ALL` from `PUBLIC`, `anon`, `authenticated`
- Privileges granted only to `service_role`
- **No** `CREATE POLICY` rows — default deny for roles that do not bypass RLS
- Supabase `service_role` bypasses RLS and is used only from `lib/data/supabase-server.ts` 
(`server-only`)
No policy changes in Phase 3H. Weakening RLS would be incorrect.
## Headers added
On all paths:
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `X-Frame-Options: DENY`

**Deferred:** Content-Security-Policy (must be designed for Next.js fonts, scripts, and Server 
Actions; a copied CSP would likely break the app). **HSTS** belongs on the HTTPS host, not 
local HTTP .
## CAPTCHA
**Not implemented.** U11 is unresolved. No provider, site key, or secret was chosen or 
committed. Remaining dependency: a human decision on whether a visible CAPTCHA is 
required, which vendor, and that it stay off the calm reading path.
## CSRF
Mutations are same-origin Server Actions without credentialed session cookies (U7 still 
memory). No additional CSRF token in this phase.
## Security limitations
- In-process limits reset on deploy/restart and do not hold across instances.
- `X-Forwarded-For` is only trustworthy behind a host that overwrites it (e.g. Vercel).
- Shared `unknown` bucket if no IP header (local).
- No IP is logged with age or advice text.
- Selection scrape is slowed, not cryptographically stopped.
- No test runner (Phase 3I). See `docs/development/phase-3i-testing-notes.md`.

## Validation performed
- `npm run lint`, `npm run typecheck`, `npm run build`
- Client production chunks must not contain the service-role client
- No live Supabase rate-limit test unless credentials exist
docs/development/phase-3i-testing-notes.md
