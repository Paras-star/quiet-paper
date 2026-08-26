# Data access

Server-only database access. Import from Server Components, Route Handlers, or Server Actions — never from Client Components.

- `supabase-server.ts` — service-role client (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`)
- `advice-select.ts` — `pickPublicAdvice`
- `advice-contribute.ts` — `insertCommunityAdvice` (always `pending` + `community`)
- `advice-report.ts` — `insertAdviceReport` (approved items only; does not change status)
- `advice-editorial-import.ts` — operator-machine editorial import (always `editorial` + `approved`)

The browser must never receive the service-role key. Do not use `NEXT_PUBLIC_*` for it.

See `docs/development/environment-variables.md`, `supabase/migrations/0001_advice.sql`, and `supabase/migrations/0002_reports.sql`.
