# Advice content model
**Status:** Phase 0  

**Kind:** documentation only  
**Do not** generate the founder’s 10–100 library in this phase.
---
## 1. What an advice item is
A short piece of **human** life advice that can apply to people whose age falls in an inclusive 
range.
It is **not** a medical order, investment guarantee, legal instruction, crisis protocol, slogan 
poster, or chat reply.
Voice: ordinary, specific, limited. Match [design-principles.md](../product/design-principles.md) 
and Phase 1 content rules (no stacked exclamation, no guaranteed outcomes).
---
## 2. Fields
| Field | Required | Notes |

| --- | --- | --- |
| Advice text | Yes | International English; no HTML |
| Minimum age | Yes | 10–100 |
| Maximum age | Yes | 10–100, ≥ min |
| Source type | Yes (system-set) | `editorial` or `community` |
| Moderation status | Yes (system-set) | pending / approved / rejected / flagged as modelled |
| Timestamps | Yes (system-set) | created/updated; published optional |
| Category | **No** | Optional; see §4 |
| Engagement counters | No | Optional aggregates later |
Public form sets **only** text + min + max. Source and status are set by the system.
---
## 3. Character length
**Unresolved (U2).** Phase 1 UX provisionally designs for about **40–400 characters**.
Until a human locks this:

- Treat 40–400 as a **layout and writing** guide, not a database law.
- Implementation must pick an explicit max **before** going live so the API cannot accept 
megabytes.
- Do not silently treat the UX number as final without recording the decision.
---
## 4. Category is not mandatory
**Decision:** category is **optional**.
Reasons: the product loop does not ask for a topic; MVP submit fields do not include it; a forced 
taxonomy would create junk labels.
Editors may tag later for collections/SEO. Contributors do not.
---
## 5. Source type visibility

Stored always. **Public display unresolved (U4).** Phase 1 default: omit labels like “From the 
editors” until decided.
Do not show usernames (there are none).
---
## 6. Age range usage
Prefer honest ranges:
- One age: min = max = 16
- Narrow: 16–18
- Broad: 40–55
Do not mark everything 10–100 unless it truly is. Over-broad items clog every session.
Ranges overlap by design. Random selection among overlapping items is expected.
---

## 7. Editorial library structure (future import)
The founder intends coverage across **10–100**. That is a **content goal**, not a requirement 
to invent text now.
**Do not write the advice corpus in this repository in this phase.**
Suggested **later** working structure (files on the operator’s machine or a private sheet):
- One row per item
- Columns: `body`, `minimum_age`, `maximum_age`, optional `category`, optional internal `id`/
`notes`
- Source implied as editorial on import
- Status `approved` only on trusted import
Formats to support in a future importer: **CSV** and **JSON** (array of objects). UTF-8. No 
HTML.
Import must be **idempotent-enough** to re-run without duplicating blindly (strategy chosen at 
implementation: stable ids in the file vs hash of body+range).

Gaps: after import, check that popular ages have **more than one** item so “next” is real.
---
## 8. Community items
Same body+range model. Status `pending`. Same voice guidelines; reject slogan-only and 
prohibited categories of harm.
---
## 9. Display
One item at a time. No truncation on the advice screen (Phase 1). No auto-hashtags. No “related 
items” grid.
