# Data model proposal
**Status:** Phase 0 — conceptual  
**Kind:** documentation only  
**Do not** create SQL, migrations, or Supabase tables from this file.
Relationships and constraints are in **plain language**. Names are conceptual, not required 
physical table names.
---
## 1. Design aims
- One advice catalogue, not 91 catalogues

- Community rows exist **before** they are public (`pending`)
- Reports attach to advice, not to user accounts
- Category is **optional** (see §6)
- Minimise personal data
- Simple enough for a non-expert operator to understand
---
## 2. Advice (core)
An **Advice** item is a piece of text that may be shown if it is eligible.
**Fields (conceptual)**
| Concept | Meaning |
| --- | --- |
| Identity | Stable id for session de-duplication, reports, and future permalinks |
| Body | The advice text |
| Minimum age | Inclusive integer 10–100 |

| Maximum age | Inclusive integer 10–100; must be ≥ minimum |
| Source type | `editorial` (founder) or `community` |
| Moderation status | See §3 |
| Category | Optional reference to a category |
| Created at / updated at | Operator and audit time |
| Published at | Optional; when it first became eligible for the public, if that is useful |
| Engagement counters | Optional; e.g. how often selected or reported — **only if** they earn their 
keep for future weighting or safety. Do not store clickstreams of individuals. |
**Constraints**
- `minimum_age` and `maximum_age` in 10–100; min ≤ max.
- Public selection: status is eligible (normally **approved** and not withheld) **and** 
`minimum_age ≤ requested_age ≤ maximum_age`.
- Community-created items start as **pending**.
- Editorial imports may start as **approved** only via a trusted operator process, not via the 
public form.
**Not on Advice**
- Author name, email, or any profile

- Visitor age of the reader (readers are not rows)
---
## 3. Submission / moderation state
**Preferred simplicity:** do **not** duplicate “Submission” and “Advice.” A community offer 
**is** an Advice row whose status is `pending` until it is `approved` or `rejected`.
**Status values**
| Status | Public random selection | Meaning |
| --- | --- | --- |
| `pending` | No | Awaiting review |
| `approved` | Yes, unless withheld (U6) | Allowed in the pool |
| `rejected` | No | Not published |
| `flagged` | **Unresolved (U6)** | Reported or withdrawn pending review; may overlay or replace 
`approved` |
If `flagged` is modelled as a **separate flag** on an approved row rather than a status, say so at 
implementation time — do not have two conflicting sources of truth.

**Moderation metadata (not public)**
- When reviewed
- What decision
- Internal note (keep short; may contain sensitive reasons — protect like operator data)
- Optional internal reject code (not shown to the contributor in MVP)
**Rejected retention:** unresolved (U13). The model must **allow** either delete or retain; do not 
assume one.
---
## 4. Reports
A **Report** says a visitor objected to a **specific Advice** item.
| Concept | Meaning |
| --- | --- |
| Which advice | Required |

| When | Required |
| Reason | Optional closed list (harmful, spam, other, etc.) — exact list not locked |
| Reporter identity | **None** in MVP . Do **not** create a user. Whether a hashed IP , coarse rate-
limit key, or nothing beyond a session anti-repeat token is stored: **U8** |
| Report handling state | e.g. open / reviewed / dismissed — internal |
Many reports may point at one advice item. Volume may later inform flagging.
---
## 5. Categories
A **Category** is an optional label for editorial grouping, future topic pages, and moderator 
filtering.
| Concept | Meaning |
| --- | --- |
| Name / slug | Human and URL-safe later |
| Description | For operators, not necessarily public |

Advice **may** have zero or one category in MVP (zero-or-one keeps the model simple). Many-
to-many is postponed.
---
## 6. Decision: category is not mandatory
**Product reasoning:** the loop is age  advice. Visitors do not pick a topic. Contributors in MVP 
do not submit a category (Phase 1 form has three fields only). Forcing a category would invent 
work, fake taxonomy, or block imports.
Therefore:
- Category is **optional** on Advice.
- Public contribution **does not** collect category.
- Editors **may** set category on import or later.
- Taxonomy exists so future SEO/collections have a hook — not to clutter MVP .
This is U3 resolved for MVP as **optional**; it can be revisited.
---

## 7. Analytics / counters
Justified:
- Per-advice **selection count** (anonymous, aggregate) — optional, useful later for weighting
- Per-advice **report count** — can be derived from Reports
Not justified as stored visitor journeys:
- Full sequence of ages and items per person
- Advertising identifiers
- Cross-site tracking
Site-wide totals (requests, next, submits) may live in an analytics tool later (U10) rather than in 
Postgres.
---
## 8. Relationships (plain language)

- One category can describe many advice items; an advice item may have no category.
- One advice item can have many reports.
- There are **no** User or Profile entities in the MVP public model.
- Session seen-lists are **not** necessarily a table. They may be cookie/session payload (U7). If 
they become a table, they must not become accounts.
---
## 9. Indexing intent (not SQL)
When implemented, lookups will need:
- Public pool: status + age range containment for a requested age
- Operator: filter by `pending`, by reports
Physical indexes are an implementation concern.
---

## 10. Alignment with Phase 1
The UX contribute form maps 1:1 to body + min + max. Extra columns must have defaults or 
remain unused by the public form. Do not add hidden PII fields “just in case.”
