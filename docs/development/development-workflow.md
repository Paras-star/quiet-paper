# Development workflow (future)
**Status:** Phase 0  
**Kind:** documentation only  
**This repository is not in an implementation phase.** Do not run scaffolds because this file 
describes a future workflow.
---
## 1. Now (documentation phase)
- Edit Markdown only.
- Do not install app packages, init Next.js, or provision cloud projects as part of “getting ready.”
- Humans review docs before any implementation commit series.
- Follow `AGENTS.md`.
---

## 2. When an implementation phase is explicitly opened
Suggested order:
1. Confirm U1 (minors) has a **written** human decision, or an explicit “build the loop but do not 
produce-launch.”
2. Create the Next.js + TypeScript + Tailwind app **in this repo** per the then-current instructions 
(not now).
3. Add Supabase **only** when the data model is being implemented; enable RLS from the first 
table.
4. Implement the public loop to match the UX spec.
5. Server-only secrets; no service role on the client.
6. Editorial import path.
7. Operator approve/reject path (even if manual).
8. Checks: types, lint, tests that exist.
9. Deploy to Vercel only after secrets and RLS reviews.
GitHub is the planned remote. Branching: small PRs; do not rewrite history of `main` for fun.
---

## 3. Day-to-day rules (when code exists)
- Inspect before editing (`AGENTS.md`).
- Minimal diffs.
- One concern per change.
- Do not drive-by reformat.
- After behaviour changes: run the repo’s real checks; if none, say so.
- Document new unresolved questions in the PRD list rather than inventing policy.
---
## 4. What “done” is not
Green local `create-next-app` with no moderation status checks is not done. A pretty landing with 
client-only fake advice is not done.
