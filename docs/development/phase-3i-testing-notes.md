# Phase 3I testing notes
Implementation notes only. Does **not** close U1–U20.
## Runner
**Vitest** (I3). One runner. Node environment. No Playwright, no second framework, no coverage 
tool.
Why: implementation-plan I3 lists Vitest as the unit-test example; this phase needs TypeScript 
unit/boundary tests, not a browser stack. Playwright remains available later for e2e if a human 
opens that work.
Command: `npm test`  `vitest run`.

Vitest may warn that `vitest.config.ts` is loaded as CommonJS while containing ESM. Harmless 
today; do not set `"type": "module"` on the Next app to silence it.
`server-only` is aliased to `tests/stubs/server-only.ts` so data/security modules can load under 
Vitest.
## Categories
| Area | Where |
| --- | --- |
| Age / range / body / id parsers | `tests/validation/` |
| Per-age seen-ids | `tests/session/` |
| Selection interpretation (mocks) | `tests/data/advice-select.test.ts` |
| Contribution insert literals (mocks) | `tests/data/advice-contribute.test.ts` |
| Report eligibility (mocks) | `tests/data/advice-report.test.ts` |
| Extra payload keys ignored | `tests/actions/` |
| Rate-limit Map | `tests/security/rate-limit.test.ts` |
| Env/source hygiene | `tests/security/credentials.test.ts`, `tests/data/supabase-server.test.ts` |
| SQL eligibility / RLS deny-by-default | `tests/invariants/sql-eligibility.test.ts` |

## Covered invariants
- Ages outside 10–100 rejected; min ≤ max
- Body trim/empty/4000 ceiling
- Invalid UUIDs never query
- Empty RPC remainder  `exhausted` (not a recycled item)
- Malformed RPC row  `unavailable`
- Contribution insert is always `source_type: community`, `status: pending`
- Client `status` / `email` / `source` are not passed into insert
- Reports look up `status = 'approved'` and insert `{ advice_id }` only
- Rate limit: N allows then block; keys/scopes isolated; body/header-supplied keys do not choose 
the bucket
- No `NEXT_PUBLIC_` service-role usage
- Migrations force RLS and revoke anon/authenticated
## Not tested here (need live infra or later phases)
- Real Postgres / RPC `ORDER BY random()`
- Multi-instance rate-limit sharing (I4)
- Anon key + live RLS against a hosted project

- Client bundle smoke after `next build` (run manually / CI later)
- Playwright e2e of the AGE  ADVICE  NEXT loop
- CAPTCHA (not implemented)
No application behaviour was changed to introduce tests. `server-only` is stubbed only in the 
Vitest alias so Node can load server modules.
