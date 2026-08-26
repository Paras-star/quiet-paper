# Product requirements
**Status:** Phase 0 — source of truth  
**Kind:** documentation only  
**Related:** [mvp-scope.md](./mvp-scope.md), [user-flows.md](./user-flows.md), [ui-ux-
specification.md](./ui-ux-specification.md)
---
## 1. Product statement
The website is an **anonymous global life-advice platform**.
A visitor enters an **age between 10 and 100** and receives **one random piece of life advice** 
whose age range includes that age. The visitor can request **another** piece. The first library is 
written by the **founder**. Visitors may **submit** advice for an age or age range. Submissions 
are **moderated** and are **not** public until explicitly approved.

No account is required to **read** advice.
---
## 2. Goals
- Deliver a calm, fast, trustworthy moment of human advice matched to an age.
- Keep the product understandable to a non-expert operator.
- Minimise personal data.
- Keep children and other visitors safer than an unmoderated comment box would.
- Stay maintainable on a conventional Next.js + Supabase + Vercel stack (planned, not built).
---
## 3. Non-goals (permanent unless this document changes)
The product must **not** become:

- a social network
- a messaging platform
- a dating platform
- an AI chatbot
- a public profile platform
- an anonymous forum
- a medical advice service
- a financial advice service
- an emergency service
Do not add feeds, follows, likes, DMs, photos of people, matching, generated chat replies, or “talk 
to an expert.”
---
## 4. Audience
**Initial intended audience:** global, with a strong focus on the United States, the United 
Kingdom, Europe, Australia, and New Zealand.
**Language:** international English. Avoid country-specific slang. Do not assume currency, date 

format, or cultural norms unless a screen truly needs them (MVP public UI should not).
**Founder skill:** the operator is not an experienced developer. Complexity is a product defect.
---
## 5. Central loop
```
AGE  ADVICE  NEXT ADVICE  NEXT ADVICE  OPTIONAL CONTRIBUTION
```
Keep this loop extremely simple. Age is collected so advice can be **relevant**, not so the 
product can build a profile.
---
## 6. Functional requirements
### 6.1 Age

- Visitors may enter integer ages **10 through 100** inclusive.
- Age is **session/request context**, not a permanent user identity.
- Do not create an account or profile because someone typed an age.
**Unresolved:** whether ages 10–12 (and minors generally) may use the full product, see the 
same pool, and submit advice. See §11. Do not silently treat children as adults.
### 6.2 Advice selection
- Advice is stored with **minimum_age** and **maximum_age**, not 91 separate catalogues.
- An item may cover one age, a small range, or a broad range.
- Public selection uses only **approved** items whose range **contains** the requested age.
- The session should **avoid repeating** items already shown for that age.
- An **exhausted** eligible pool must be handled honestly (see UX spec S4).
- Future: engagement-based weighting. MVP: simple random among eligible unseen items.
### 6.3 Advice sources
1. **Founder / editorial** advice — may be treated as approved when imported by a trusted 
process.

2. **Community** advice — always created as **pending**; never selected publicly until 
**explicitly approved**.
Never auto-publish because a form passed validation.
### 6.4 Reading without an account
Required for MVP . Authentication is out of scope for visitors. **Supabase Auth** is planned only 
if a later requirement (for example operator login) makes it necessary.
### 6.5 Community submission (MVP fields)
Collect **only**:
- advice text
- minimum age
- maximum age
Do **not** require name, email, phone, date of birth, address, workplace, social-media account, 
or profile photo.

Do not invent extra personal-data fields.
### 6.6 Moderation (conceptual)
Lifecycle for community items: **pending  approved | rejected**. A **flagged** state may apply 
to items that are (or were) public and have been reported or withdrawn from the pool pending 
review.
Public advice must be **reportable**. Reports follow a defined path (see [moderation-
system.md](../architecture/moderation-system.md)).
**Do not design or implement an admin dashboard in this phase.** Document capabilities only.
### 6.7 Sharing
Sharing is optional and tertiary. MVP prefers sharing **the words** (device share or copy), not a 
social graph. Permalinks are a **future SEO** option, not required for the loop.
### 6.8 Safety content rules
The platform must have (process and policy) safeguards against:

- sexual content
- sexual content involving minors
- self-harm encouragement
- suicide encouragement
- dangerous instructions
- criminal instructions
- hate
- harassment
- threats
- scams
- financial fraud
- medical misinformation
- personal information exposure
- attempts to solicit contact with minors
Automated moderation is **not** in MVP . Human review of community content is.
---

## 7. Quality requirements
Aligned with Phase 1:
- Simple, calm, human, trustworthy, modern
- Accessible (WCAG 2.2 AA as the UX floor)
- Mobile-first
- Fast
- Emotionally meaningful without manipulation
- International English
---
## 8. Monetization principle
Do **not** implement monetization in MVP .
If money is introduced later, it must **not** undermine the core loop: no forced signup, no advice 
locked behind a paywall on the primary path, no gambling aesthetics, no invasive ad layouts on 
the advice canvas.

Conceptual future options (no provider assumed): advertising, sponsorship, partnerships, 
premium features that stay off the primary path.
---
## 9. SEO principle
Do not generate 91 thin pages because there are 91 ages. Prefer the main tool, a small number 
of life-stage or topic resources, curated collections, and individual pages only when a piece has 
standalone value. Details: [future-roadmap.md](./future-roadmap.md) and the UX spec SEO 
section.
---
## 10. Compatibility with Phase 1 UX
Phase 1 files are valid and must not be discarded:
- [design-principles.md](./design-principles.md)
- [ui-ux-specification.md](./ui-ux-specification.md)

This PRD is written to match that UX (numeric age + steppers, in-place next advice, contribution 
fields, honest “received for review,” public moderation *states* without an admin UI).
Contradictions and tensions are listed in §12 rather than “fixed” in either document.
---
## 11. Unresolved decisions
Legal and product questions **must not** be silently resolved in documentation-as-code or later 
in implementation.
| ID | Topic | Notes |
| --- | --- | --- |
| U1 | **Ages 10–12 and minors generally** | May they use the tool, see the full pool, and submit? 
Parental consent, COPPA-style, GDPR-K/age of consent, and duty of care are **legal** questions. 
UX currently validates 10–100 without a parental gate. |
| U2 | Exact **character limits** for advice | UX marks ~40–400 as provisional. Content model 
does not lock a database constraint yet. |
| U3 | Whether **category is required** | **Decision in this Phase 0:** category is **optional**, not 
mandatory for MVP (see content model). Revisit if editorial workflow needs it. |
| U4 | Whether **source type** (editorial vs community) is visible publicly | UX default: omit until 
decided. Stored in data model either way. |

| U5 | **Exhausted pool** after first request vs only after next | UX defines S4. Confirm copy and 
whether changing age is required. Behaviour is specified in UX; implementation must not secretly 
recycle items. |
| U6 | **Flagged advice visibility** | Hide immediately from the public pool, or keep showing until 
a human confirms? UX uses a generic “temporarily unavailable” if an item cannot be shown. |
| U7 | **Session storage** | Cookie vs memory vs server session vs `sessionStorage`. Privacy 
implications. UX needs seen-IDs for the visit. |
| U8 | **Report storage** | What metadata is stored (reason, time, advice id, hashed IP , nothing 
else)? Retention. |
| U9 | **Privacy retention periods** | Submissions, rejects, reports, logs, session ids. |
| U10 | **Analytics** | Whether to measure, what, and which provider. Not selected. |
| U11 | **CAPTCHA / rate limiting** UX | Server rate limits are required as a *security* concept; 
visible CAPTCHA is optional and must stay off the reading path if used. |
| U12 | **Legal pages and consent** | Privacy policy, terms, cookie banner, contribute checkbox. 
UX allows notices without a checkbox unless legal requires one. |
| U13 | **Rejected submission retention** | Delete, retain for abuse defense, or retain for a short 
period. No contributor inbox in MVP . |
| U14 | **Permalink / SEO strategy timing** | Future; do not implement now. |
| U15 | **Product name and logo** | Not chosen. |
| U16 | **Dark theme** | UX recommends Quiet paper; Lamp hour is alternate. Not MVP . |
| U17 | **Operator authentication** | How the founder approves advice without a designed admin 
product (manual database vs later Auth). |
| U18 | **No-JS** progressive enhancement | UX lists it as future; not decided for MVP . |
| U19 | **Engagement weighting** | Explicitly post-MVP . |
| U20 | **Font licensing** for the recommended Phase 1 pair. |

---
## 12. Phase 0 vs Phase 1
### 12.1 Aligned (not contradictions)
- Same loop, same age bounds, same submission fields, no visitor accounts.
- Community pending until approval.
- Honest exhausted and error states; no social chrome.
- SEO: no per-age thin pages.
- Sharing as tertiary copy/share, not growth hacking.
### 12.2 Tensions (do not silently erase)
| Item | Phase 1 | Phase 0 | Handling |
| --- | --- | --- | --- |
| Stale “Phase 0 missing” wording | UX §0.1 originally listed files as missing (true at first 
authoring) | Files now exist | Phase 1 §0.1 updated in a documentation reconciliation pass to 
point at actual paths; **UX decisions were not changed** |

| Minors (UX C1 / U1) | Field remains 10–100; no parental gate designed | Same range; **legal 
unresolved** | Keep both; do not raise min age here |
| Rejection UX (C2) | No rejection inbox | Same; rejected retention U13 open | Compatible |
| Character limits (C10 / U2) | Provisional 40–400 | Not locked | Compatible; mark provisional |
| Category | Not in contribute form | Optional in model, not required | Compatible |
| Session (C4 / U7) | Client session remembers seen IDs | Mechanism is an implementation/
privacy decision | Compatible if whatever ships still prevents in-session duplicates |
| Stack | Phase 1 design principles said stack was “later” | This Phase 0 names a **planned** 
stack | Not a UX break; stack still not installed |
| Admin | Not designed | Capabilities documented, still no dashboard | Compatible |
No Phase 1 file was edited in the Phase 0 documentation pass. A later **documentation-only 
reconciliation** updated Phase 1 file-presence references only.
