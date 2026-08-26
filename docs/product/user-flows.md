# User flows
**Status:** Phase 0 — source of truth  
**Kind:** documentation only  
**Public UI detail:** [ui-ux-specification.md](./ui-ux-specification.md) is authoritative for screens, 
copy, and interaction states. This file is the product-level flow map.
---
## 1. Actors
| Actor | Description | Account |
| --- | --- | --- |

| Visitor | Anyone using the public site | None required |
| Contributor | A visitor offering advice | None in MVP |
| Founder / editor | Writes and imports the initial library; approves or rejects | Not a public actor; 
operator process is unresolved (U17) |
| Moderator | May be the founder initially | No public dashboard in this phase |
There is **no** end-user identity. Age is not an actor.
---
## 2. Primary flow — receive advice
1. Visitor opens the site (landing / age).
2. They understand what the site does, why age is asked, and that no account is required.
3. They enter an integer age **10–100** (numeric field; steppers allowed per UX spec).
4. Invalid input stays on landing with an accessible error.
5. Valid submit requests **one** approved advice item whose range contains that age, excluding 
items already seen in this session for that age.
6. Advice screen shows age context and the advice text as the dominant content.
7. Visitor may:
   - request **next** advice (same age)

   - **change age**
   - **offer advice**
   - **share** (copy / system share)
   - **report** this advice
   - leave
Browser back should not trap them on advice (UX spec).
---
## 3. Next advice
1. Visitor activates “Another piece of advice.”
2. UI shows immediate busy state; duplicate activations are ignored while in flight.
3. Server (conceptually) returns the next eligible unseen item.
4. Success: text replaced in place; age preserved; no full reload required if the later app can avoid 
it.
5. Exhausted pool: honest empty state; do not silently repeat.
6. Failure: previous advice remains; retry.

Seen-item tracking is **session-scoped**. Cross-session repeats are allowed unless a later 
decision says otherwise.
---
## 4. Change age
1. Visitor returns to age entry with the previous value available to edit (UX).
2. New age starts (or resumes) that age’s seen-list for the session.
---
## 5. Contribution
1. Entry from advice (secondary) or landing footer.
2. Fields: minimum age, maximum age, advice text. Soft-default range to the current session age 
if present (UX C5).
3. Visible notices: review, no guarantee of publication, possible refusal, no personal information.
4. Client validation then **server** validation.
5. On success: **submission received** — not published.

6. Human (or trusted operator) later approves or rejects. The contributor is **not** notified in 
MVP (no account, no email). Immediate automated refusal of empty/invalid input is a form error, 
not a moderation verdict page.
---
## 6. Report
1. Visitor confirms report (optional closed reason list — UX).
2. Acknowledgement: we will look at it.
3. That item is not shown again in the session.
4. System records a report for moderation (what exactly is stored: U8).
5. Flagged/unavailable behaviour: U6.
---
## 7. Operator flows (not public UI)
Documented for later implementation; **no dashboard design**.
- Import editorial advice (CSV/JSON).

- List pending community items.
- Approve (eligible for public random selection) or reject.
- Review reports; possibly flag or unpublish.
- Inspect counts if analytics exist later.
How the operator authenticates: **unresolved (U17)**. Do not imply a consumer login.
---
## 8. Flows that must not exist in MVP
- Sign up / sign in for visitors
- Follow, like, comment, message
- Search and topic browse (except future editorial pages)
- Contributor status inbox
- Payment
- Chat with a model
- Parental consent wizard (not designed; U1 may require a later flow — do not invent one here)

---
## 9. Alignment
This map matches Phase 1 sections 2–5. If a screen-level detail disagrees with this file, **prefer 
the UX specification** for interface behaviour and this file plus the PRD for product rules.
