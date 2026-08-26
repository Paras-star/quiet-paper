# Current project state

**This file is a continuation record, not a source of truth.**

The authoritative documents remain:

- Product, UX, visual, and screen specs under `docs/product/`
- Architecture under `docs/architecture/`
- Privacy and security under `docs/security/`
- Content and moderation under `docs/content/`
- Agent rules in `AGENTS.md`

Do not treat this handoff as permission to change those files or to close unresolved decisions. If this file and an authoritative document disagree, **follow the authoritative document**.

Inspected: 26 August 2026, after restoring the application from the attached handoff (the destination Git repository contained only an empty `Initialize project` commit).

---

## State

| Item | Value |
| --- | --- |
| Current development phase | **Phase 4 first slice complete** (offline editorial importer). Phases 3A–3I are implemented in this tree. |
| Next intended work | Implementation plan “Later”: operator path (**U17**, still unresolved — do not invent Auth) and Vercel after RLS review. Do **not** start those until a human opens that work. |
| `AGENTS.md` phase line | Phase 4 editorial importer CLI only. No Auth, admin UI, Vercel config, or real editorial corpus. |
| Git | This workspace started empty (`fef279c Initialize project`). Source was reconstructed from the handoff dump of HEAD `1d70dd7` (`feat: add editorial advice importer`). |
| Application code | Yes. Next.js App Router under `app/`, presentational components under `components/`. |
| Technology stack | Next.js **16.3.2**, React **19.2.8**, TypeScript, Tailwind CSS **v4**, `@supabase/supabase-js`, Vitest, `server-only`. |
| Supabase credentials in this environment | **Not present.** Selection / contribution / reports return generic `unavailable` until `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set server-side. |
| Remote `pick_public_advice` | Previously reported as not visible through PostgREST (`PGRST202`). Not re-verified here (no database credentials). Do not duplicate the function blindly. |

---

## Completed phases

Phase 0 documentation through Phase 3I tests, plus Phase 4 first slice (offline editorial importer), as described in the handoff and in `docs/architecture/implementation-plan.md` §21.

Public loop: AGE → ADVICE → NEXT, contribution (pending community), reports (no status mutation), rate limits, security headers, RLS deny-by-default migrations, Vitest invariants.

---

## Explicitly not done

- Operator authentication (U17)
- Admin dashboard
- Vercel project / production deploy
- Real editorial corpus in Git
- Closing U1–U20
- Client-side catalogue fallback
- CAPTCHA, analytics, payments, visitor accounts

---

## Unresolved decisions

U1–U20 remain open. See `docs/product/product-requirements.md` §11. Do not mark them solved in code.

---

## Next phase

Do **not** automatically start Auth, Vercel, an admin UI, or a real advice library.

When a human opens further work, the documented successor items are:

1. Confirm remote schema vs `supabase/migrations/` (RPC grant / schema cache) using real credentials.
2. Operator path only after U17 is decided.
3. Vercel after RLS review.

---

## Git safety

Never commit `.env` files, service-role keys, `uploads/`, `agent-tools/`, or leftover `*.webp` screenshots.
