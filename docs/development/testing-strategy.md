# Testing strategy (future)
**Status:** Phase 3I  
**Kind:** documentation + Vitest unit/boundary tests  
Command: `npm test` (`vitest run`). No Playwright in this phase. Live Supabase is not required.
---
## 1. Purpose

When code exists, tests should protect the **loop** and **invariants**, not chase coverage 
percentages.
---
## 2. Invariants to test first
- Age outside 10–100 rejected on the **server**
- Selection never returns `pending` or `rejected`
- Selection never returns items whose range misses the age
- Community POST always inserts `pending` (or equivalent), never `approved`
- Extra fields (email, status=approved) from the client are ignored
- Duplicate next-advice in a session does not return the same id while others remain
- Exhausted pool is an explicit empty outcome, not a random repeat
- Report does not require auth
- Pages that render advice do not emit raw HTML from the body
- Service-role key is not present in any client bundle (smoke grep / build artefact check)
---

## 3. Layers (later)
| Layer | Use |
| --- | --- |
| Unit | Age and range validators; pool filter |
| Integration | Database policies: anonymous cannot read pending |
| UI (few) | Age error, next busy state, contribute notices — against the UX spec |
| Manual | Keyboard, screen reader on landing + advice + form; 320px width |
Do not start with screenshot testing of marketing.
---
## 4. Accessibility
Phase 1 requires WCAG 2.2 AA intent. When UI exists, test: labels, focus, errors announced, 44px 
targets, reduced motion.
---

## 5. What not to test yet
- Engagement weighting (not in MVP)
- Admin dashboard (not designed)
- Vendor analytics
