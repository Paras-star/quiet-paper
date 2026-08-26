# Random advice system
**Status:** Phase 0 — conceptual  
**Kind:** documentation only  
**Do not implement** the algorithm in this phase.
---
## 1. Purpose
Given a **visitor age**, return **one** piece of advice that is allowed to be shown, is relevant to 
that age, and is not an accidental repeat in the **current session**. If nothing remains, say so 

honestly.
This is **not** a slot machine, loot box, or “AI picks what you need.” Randomness is a fair way to 
choose among eligible human texts.
---
## 2. Public algorithm (eventual)
1. Receive visitor age (integer 10–100, already validated).
2. Consider only advice that is **approved** (and not withheld — U6).
3. Keep items whose **minimum_age ≤ age ≤ maximum_age**.
4. Exclude items already shown in this visitor’s **session** for this purpose (at least for this age; 
UX also allows per-age seen lists).
5. If the remaining set is empty  **exhausted** (honest empty state). If the first request is empty 
 empty/unavailable, not a fake item.
6. Otherwise choose **uniformly at random** among the remainder (MVP).
7. **Later:** engagement-based weighting may replace uniform choice. Weighting must still 
exclude pending/rejected/withheld items and still respect session exclusions. Do not use 
weighting in MVP .
---

## 3. MVP favours simplicity
| MVP | Later |
| --- | --- |
| Uniform random among eligible unseen | Optional weights (views, editor boost — **not** likes-
as-social) |
| Session memory of ids | Same |
| Server applies rules | Same; do not shuffle a downloaded full library in the browser as the 
security boundary |
Do not implement “smart” personalisation. Age range is the relevance model.
---
## 4. Session de-duplication
- Prevents **accidental duplicates during a visit**.
- Does **not** require an account.
- Mechanism (cookie, `sessionStorage`, signed cookie, server session): **U7**.
- Changing age: UX keeps a seen-list **per age** in the session; returning to an age may resume 
that list.

- New browser / expired session: repeats are allowed.
Do not encode the entire history of the person on the internet.
---
## 5. Exhausted pool
Aligned with Phase 1 S4:
- Do not silently recycle.
- Keep the age.
- Offer change age and offer advice.
- Copy stays calm; no “spin anyway.”
If the **first** draw is empty (library gap), that is also an honest empty, not a hang.
---

## 6. Errors
If the database or host fails: keep last successful advice when it exists; otherwise a generic error. 
Do not return pending items as a fallback.
---
## 7. Editorial vs community in the pool
Once **approved**, both source types are eligible unless a later decision hides source or splits 
pools (U4 is about **display**, not eligibility). MVP: **one pool**.
---
## 8. What this system must never do
- Select `pending` or `rejected`
- Select items outside the age range
- Use randomness as a dark pattern to keep people tapping
- Animate like gambling (UX)

- Call an LLM to generate the piece in the request path
