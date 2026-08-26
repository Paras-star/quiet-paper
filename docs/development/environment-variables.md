# Environment variables (Phase 3E–3H, Phase 4 importer)

Do **not** commit real keys. `.env` files are gitignored.
Advice selection and contribution talk to Postgres **from the Next.js server only**. Do not put a 
service-role key in `NEXT_PUBLIC_*` or client components.
| Name | Side | Required for selection and contribution | Purpose |
| --- | --- | --- | --- |
| `SUPABASE_URL` | Server | Yes | Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Server | Yes | Privileged DB access. **Never** send to the 
browser. |
`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are **omitted** on 
purpose (architecture default: no client database).
Copy `.env.example` to `.env.local` locally and fill values from the Supabase project. Apply 
`supabase/migrations/0001_advice.sql` and `supabase/migrations/0002_reports.sql` (and 
optionally `supabase/seed.sql`) in the SQL editor or CLI.
Until those variables are set, `pickPublicAdvice`, `insertCommunityAdvice`, and 
`insertAdviceReport` return a generic unavailable result. They do not invent a client-side 
catalogue or a client-side insert.
The Phase 4 editorial CLI (`npm run import-editorial`) uses the same two server-only variables on 
the operator machine. It is not a public route and not a login. See `docs/development/phase-4-

editorial-import.md`.
