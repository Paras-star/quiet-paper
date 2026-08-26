# Phase 4 — editorial importer
Implementation notes only. Does **not** close U1–U20. This is **not** operator authentication 
(U17).
## What this is
An **offline CLI** on the operator’s machine. It reads UTF-8 CSV or JSON and inserts rows into 
existing `public.advice` using `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.
It is **not**:
- a public Server Action or Route Handler

- an admin page
- a login / Supabase Auth flow
- permission to write the real founder library into git
## Command
```bash
# credentials: export them, or put them in gitignored .env.local
npm run import-editorial -- fixtures/editorial-import.example.json
npm run import-editorial -- path/to/local-library.csv
```
Requires Node.js 22+. The script loads `.env.local` then `.env` only for keys that are not already 
set. It never prints secret values.
`fixtures/editorial-import.example.json` and `.csv` are **format demos only**. Do not commit a 
real editorial corpus.
## File format
UTF-8. No HTML.

**JSON:** an array of objects.
**CSV:** header row; RFC 4180-style quoting (`"` and `""`).
| Field | Required | Notes |
| --- | --- | --- |
| `body` | yes | Trimmed; non-empty; max 4000 characters (I6 engineering ceiling; U2 open) |
| `minimum_age` | yes | Integer 10–100 |
| `maximum_age` | yes | Integer 10–100; must be ≥ minimum |
| `id` | no | If present and non-empty, must be a UUID. Stored as `advice.id`. |
Every other field is **ignored**, including `status`, `source_type`, `email`, `category`, and notes.
Stored values are **always**:
- `source_type = editorial`
- `status = approved`
- `published_at` = current timestamp at import

Input cannot create pending or community rows through this tool.
## Idempotency (no schema change)
- If a valid `id` is supplied and that UUID already exists: **skip**. Do not overwrite.
- If `id` is omitted: skip when a row already has the same `body` + `minimum_age` + 
`maximum_age`.
- Invalid rows are not inserted. Other valid rows in the same file may still be inserted.
## Environment
| Name | Side | Purpose |
| --- | --- | --- |
| `SUPABASE_URL` | Operator machine / server | Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Operator machine / server | Privileged access. **Never** 
`NEXT_PUBLIC_*`. **Never** commit a real key. |
This CLI is a **trusted local process**, not a user account.

## Security boundary
- Browser and public app loop are unchanged.
- Contribution still inserts `community` + `pending` only.
- Selection still returns `status = 'approved'` only.
- Do not log advice bodies together with IP or identity.
- Row errors name the row number and field issue; they do not dump secrets or SQL.
## SQL stopgap (no in-app moderation UI)
Use the operator’s Supabase SQL editor / table editor after RLS review. These examples do 
**not** invent retention, flagging (U6), or report-reason policy (U8).
List pending community offers:
```sql
SELECT id, body, minimum_age, maximum_age, created_at
FROM public.advice
WHERE status = 'pending'
ORDER BY created_at;

```
Inspect one item:
```sql
SELECT id, body, minimum_age, maximum_age, source_type, status, created_at, published_at, 
internal_note
FROM public.advice
WHERE id = '00000000-0000-0000-0000-000000000000';
```
Approve (eligible for public selection):
```sql
UPDATE public.advice
SET status = 'approved',
    published_at = COALESCE(published_at, now()),
    reviewed_at = now()
WHERE id = '00000000-0000-0000-0000-000000000000'
  AND status = 'pending';

```
Reject (never selected):
```sql
UPDATE public.advice
SET status = 'rejected',
    reviewed_at = now()
WHERE id = '00000000-0000-0000-0000-000000000000'
  AND status = 'pending';
```
Inspect reports (not public):
```sql
SELECT r.id, r.advice_id, r.created_at, r.handling_state, a.status AS advice_status
FROM public.advice_report AS r
JOIN public.advice AS a ON a.id = r.advice_id
ORDER BY r.created_at DESC;

```
Do not put this SQL behind a public URL. Do not build an admin dashboard in this phase.
## Out of scope here
Authentication, Vercel project config, admin UI, CAPTCHA, analytics, Playwright, generating 
founder advice text, schema/RLS changes, changing selection/contribution/report/rate limits.
