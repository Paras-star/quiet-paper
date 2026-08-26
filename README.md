# Anonymous age-based life advice (unnamed)

A planned **anonymous, global life-advice** site: a visitor enters an age from 10 to 100 and receives one piece of advice that applies to that age. They may request another piece. They may later offer advice for an age range. Community offers are **reviewed before they can appear**. No account is required to read advice.

This product is **not** a social network, messenger, dating app, AI chatbot, profile platform, forum, medical service, financial service, or emergency service.

**Core loop:** age → advice → next advice → (optional) contribution.

There is **no public product name or logo** yet.

---

## Current phase

**Phase 4 — editorial importer.** Operators can load approved editorial rows from a local CSV/JSON file using server-only credentials. This is not authentication, not an admin UI, and not a public HTTP endpoint. Format demos live in `fixtures/`; do not commit a real advice library.

---

## Run locally

Requires Node.js 22 (or the current LTS).

```bash
npm install
npm run dev
```

Then open the URL printed in the terminal. Other checks:

```bash
npm run lint
npm run typecheck
npm run build
npm test
```

Editorial import (operator machine only; credentials in `.env.local`, never in git):

```bash
npm run import-editorial -- fixtures/editorial-import.example.json
```

See [`docs/development/phase-4-editorial-import.md`](./docs/development/phase-4-editorial-import.md).

Do not commit `.env` files or Supabase service-role keys. Copy `.env.example` to `.env.local` for local database access.

Without `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`, the public loop still runs; selection, contribution, and reports return a generic unavailable result. They do not invent a client-side catalogue.

---

## Where the source of truth lives

| Area | Path |
| --- | --- |
| Agent rules | [`AGENTS.md`](./AGENTS.md) |
| Product | [`docs/product/`](./docs/product/) |
| UI/UX | [`docs/product/ui-ux-specification.md`](./docs/product/ui-ux-specification.md), [`docs/product/design-principles.md`](./docs/product/design-principles.md) |
| Visual system | [`docs/product/visual-design-system.md`](./docs/product/visual-design-system.md) |
| Screens | [`docs/product/screen-specifications.md`](./docs/product/screen-specifications.md) |
| Architecture | [`docs/architecture/`](./docs/architecture/) |
| Implementation plan | [`docs/architecture/implementation-plan.md`](./docs/architecture/implementation-plan.md) |
| Privacy and security | [`docs/security/`](./docs/security/) |
| Content and moderation | [`docs/content/`](./docs/content/) |
| How we will develop | [`docs/development/`](./docs/development/) |

---

## Planned technology stack

- **Next.js** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Supabase PostgreSQL**
- **Supabase Auth** only if authentication becomes necessary (not required to read advice)
- **Vercel** for hosting (not configured in this phase)
- **Git** and **GitHub**

The founder is not an experienced developer. The stack is conventional on purpose.

---

## International English

Copy and docs use clear international English. Do not assume one country’s slang, currency, date format, or school system.
