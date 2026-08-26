# Phase 3C visual implementation notes
**Status:** implementation notes only. Does **not** close U1–U20 or implementation IDs I1–I7.
This phase maps Quiet Paper tokens into CSS. It does not implement the product loop.
---
## Document conflicts (not silently resolved)
Per `AGENTS.md`, conflicts are recorded rather than picked quietly.
### Colour: Phase 3C brief vs visual design system
The Phase 3C task text asked for a **sage** action colour and a **slate-blue** focus treatment.

`docs/product/visual-design-system.md` §3 specifies:
- `color-action` = `#1C1917` (same as ink)
- `color-focus` = `#1C1917`
- **No second brand accent**
**Choice for this phase:** follow the visual design system. Sage and slate-blue were **not** 
added. That is a mapping of the approved token table, not a new brand decision.
### Column width: 704px vs 36rem / 42rem
The Phase 3C task text asked for a documented **704px** large-screen column.
`docs/product/visual-design-system.md` §6 and `docs/product/ui-ux-specification.md` §6.4 
specify:
- Advice / landing / forms: **`layout-advice` = 36rem (576px)**
- Optional intro only: **`layout-wide` = 40–42rem (640–672px)**
- Extra viewport width is **margin**, not a wider advice measure

**704px is not in those tables.** **Choice for this phase:** keep the shell and advice measure at 
**36rem**. Expose `layout-wide` as **42rem** (the documented upper bound) for optional intro 
use. Do not treat 704px as a product decision.
### Wordmark copy
Visual system: placeholder such as `the site`. Screen specs: `[Product Name]`. UX copy deck: 
`the site`.
**Choice:** wordmark text is **the site**. HTML `title` remains a temporary engineering string 
(`Life advice`) until U15. Not a marketable name.
### Heading vs advice size on a future advice screen
Screen specs §21 note that advice must be the largest type while `h1` may be the quieter age 
line. This phase does not build that screen. Type tokens `type-title` (sans) and `type-advice` 
(serif) are both available.
---
## Temporary technical choices (not product decisions)
| Topic | Choice | Not a decision about |

| --- | --- | --- |
| Fonts | Keep Phase 3B `next/font` loading of Source Sans 3 and Source Serif 4 | U20 licence |
| Light theme only | Tokens named for a possible later swap; no switcher | U16 |
| Footer hrefs | In-page `#` placeholders | U12 legal pages |
| Dialog demo | Native `<dialog>` for focus/overlay look | Reports, U8, U17 |
| Age-looking field on the preview | Static markup, no min/max logic, steppers do not change a 
value | Age selection, U1 |
---
## What this phase does not do
No database, Supabase, API routes, Server Actions, authentication, session store, advice pool, 
contribution, reports, moderation, analytics, CAPTCHA, rate limits, or monetisation.
