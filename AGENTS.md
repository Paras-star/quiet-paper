# Agent instructions

This file is permanent. Future coding agents and human contributors must follow it.

The repository owner is not an experienced developer. Prefer the simplest conventional approach that meets the product documents. Do not impress with architecture.

---

## Current phase

**Phase 4 (editorial importer CLI only) is authorised.** Do **not** add authentication, an admin UI, Vercel project config, or a real editorial corpus until a later phase explicitly opens that work.

If you are asked to add analytics, CAPTCHA, authentication, or a moderation UI before a later phase says so, **refuse** and point at `docs/architecture/implementation-plan.md`.

This file still applies after visual-system work.

---

## Source of truth

Read before changing behaviour:

| Concern | Document |
| --- | --- |
| What the product is | `docs/product/product-requirements.md` |
| What ships first | `docs/product/mvp-scope.md` |
| Flows | `docs/product/user-flows.md` |
| Public UI/UX | `docs/product/ui-ux-specification.md`, `docs/product/design-principles.md` |
| Architecture | `docs/architecture/` |
| Privacy / security | `docs/security/` |
| Content and moderation rules | `docs/content/` |
| How to work | `docs/development/` |

If two documents conflict, **stop and document the conflict**. Do not silently pick a side. Do not “fix” legal questions in code.

Unresolved decisions are listed in `docs/product/product-requirements.md` and must stay unresolved until a human decides.

---

## Inspect before editing

1. Read the relevant docs and the existing code (when it exists).
2. Change the smallest set of files that accomplishes the request.
3. Do not modify unrelated files, reformat the repo, or “tidy” names as a side quest.
4. Reuse existing components, utilities, types, and patterns. Do not add a parallel stack.

---

## Product constraints (never “improve” these away)

- Central loop: **age → advice → next advice → optional contribution**.
- No social network, messaging, dating, chatbot, public profiles, or anonymous forum.
- No medical, financial, or emergency service positioning.
- Visitors read advice **without an account**.
- Age is **session/request context**, not a user profile.
- Community submissions start as **pending** and must be **explicitly approved** before they can be selected for the public.
- Do not auto-publish because validation passed.
- Do not collect name, email, phone, date of birth, address, workplace, social accounts, or photos unless a later human decision changes the PRD.
- The browser must **never** receive Supabase **service-role** credentials.
- Do not generate 91 thin pages for ages 10–100.

---

## Implementation rules (when coding is allowed)

- Use **TypeScript** for application code in the planned stack.
- Validate **on the server**. Client checks are convenience, not security.
- Escape output; prevent XSS; consider CSRF on cookie-based mutations.
- Respect database **Row Level Security**. Do not bypass RLS with the service role from the client, from `NEXT_PUBLIC_*` env, or from copies in the repo.
- Keep secrets in server-only environment variables. Never commit `.env` files with real keys.
- Rate-limit public write paths (contribute, report, next-advice abuse).
- Honour moderation status in every query that can surface advice.
- Preserve privacy: minimise data, do not log advice text or ages alongside identifiers unless a documented security need exists.
- Do not introduce dependencies without a concrete need. Prefer the platform and existing libraries.
- Do not rewrite working architecture without a written justification in the change.
- Do not fabricate APIs, package APIs, or “I think Supabase does X.” Verify.
- Do not hide errors with empty catches or fake success. Fail honestly in logs and in user-facing copy that does not leak internals.
- After changes, run the checks that the repo actually has (typecheck, lint, tests). If they cannot run, say so.

---

## What not to build unless the PRD and a human say so

- Authentication for ordinary visitors
- Admin UI (document it; do not invent a dashboard in a drive-by)
- Payments, ads, or analytics providers
- AI generation of advice in the product loop
- Chat interfaces
- Exact SQL/migrations invented outside an implementation phase

---

## Honesty

- If something failed, say that it failed and what you observed.
- If a legal or minor-safety question is unresolved, do not “just ship ages 10–12 like adults.”
- If you cannot verify a behaviour, do not claim it works.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
