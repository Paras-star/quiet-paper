# MVP scope
**Status:** Phase 0 — source of truth  
**Kind:** documentation only
MVP means the **smallest honest public loop** plus the **minimum operator capability** to 
seed and moderate content. It does not mean a platform.

---
## 1. In scope (conceptual product)
### Public
- Landing with product explanation, why-age, no-account statement
- Age entry 10–100 with validation
- One approved, in-range advice item
- Next advice without re-entering age
- Session-level avoidance of duplicates
- Exhausted-pool and error states
- Change age
- Contribute: text + min age + max age + review notices
- Submission received (not published)
- Report + received acknowledgement
- Advice temporarily unavailable (generic)
- Footer: how this works, privacy placeholder, contribution, guidelines excerpt as specified in UX
- Share/copy as tertiary

- International English copy
- Accessibility behaviour as specified in the UX spec (when UI is built)
### Content
- Founder editorial library covering ages 10–100 **as a goal** (content is written by humans 
later; **do not generate the library in this phase**)
- Bulk import format described (CSV/JSON), not implemented
- Community items stored as pending until explicit approval
### Operator (capability, not a designed product)
- A way for a trusted person to approve/reject pending items and react to reports
- May initially be operational (database / SQL editor / scripts) rather than an admin application
- **No admin dashboard design or implementation in this documentation phase**
### Platform intent (not built now)
- Planned: Next.js, TypeScript, Tailwind CSS, Supabase PostgreSQL, Vercel, GitHub
- Server-side validation and RLS **when** a database exists

- HTTPS via the host when deployed
---
## 2. Explicitly out of scope for MVP
- Visitor authentication and Supabase Auth for the public
- User profiles, saved libraries, email capture
- Admin dashboard UI
- Automated ML/AI moderation
- Engagement-weighted randomisation
- Analytics vendor
- Advertising, payments, premium
- SEO page generation / permalinks (strategy only)
- 91 age landing pages
- Chat, forums, comments, likes
- Native mobile apps
- Localisation beyond international English
- Dark mode theme switcher

- Product name and logo
- Legal policy final text (placeholders and principles only)
- Parental-consent system (blocked on U1)
- CAPTCHA unless later required (keep off reading path)
- Generating founder advice text in-repo
---
## 3. MVP success (product, not metrics vendor)
A stranger on a phone can enter an age, read advice, ask for another piece, and leave. A second 
stranger can submit advice that **does not appear** until a human approves it. Harmful public 
items can be reported. The operator can keep the pending queue from going live automatically.
---
## 4. MVP non-success
- Shipping a feed, chatbot, or signup wall
- Auto-publishing community text

- Collecting emails “for later”
- Treating unresolved minor-safety law as solved
- Scaffolding the app during a documentation-only phase
