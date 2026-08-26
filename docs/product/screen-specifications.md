# Screen specifications (MVP)
**Status:** Phase 2B — screen specification only  
**Kind:** documentation only. Do not implement UI from this file until an implementation phase 
is authorised.  
**Depends on:** [ui-ux-specification.md](./ui-ux-specification.md) (interaction and copy 
examples), [visual-design-system.md](./visual-design-system.md) (tokens and look), [user-
flows.md](./user-flows.md), [product-requirements.md](./product-requirements.md)

This document tells a future frontend agent **how each public screen is structured** so layout, 
hierarchy, states, copy *intent*, responsive behaviour, and accessibility are not guessed.
It does **not** invent product behaviour. Where Phase 0, Phase 1, and Phase 2A disagree, see 
§18. Unresolved IDs **U1–U20** stay open.
**Do not** add a second visual language. Tokens (`color-*`, `type-*`, `space-*`, `layout-*`, `radius-
*`, `motion-*`) come only from the visual design system. If a screen needs something those 
tokens do not cover, record it in §19 as a **design-system gap** — do not invent a new colour or 
type size here.
---
## 0. How to read this spec
- Screen IDs **S1–S14** match the UX specification inventory.
- Copy examples in quotes are **illustrative**, aligned with the UX copy deck. They are not a 
locked marketing deck. Purpose, tone, and length matter more than exact wording.
- Age bounds are **10–100** inclusive (UX locked). **U1** (minors/legal) is still unresolved; do 
not add parental-gate UI.
- Wordmark: placeholder **`[Product Name]`** in this spec only. **U15** is unresolved; do not 
invent a real name or logo.
- Light theme only (**U16**).
- No visitor account. No name/email/phone on any screen.

### Global landmarks (every screen)
```
header#site-header     — wordmark; home = landing
main#main              — one column, layout-advice (36rem)
footer#site-footer     — quiet links
```
`lang="en"`. Page title pattern: `{screen purpose} · [Product Name]` (HTML title still needs a 
temporary engineering string until U15).
Focus ring, 44×44px targets, and motion rules are global (visual system §9–10). They are not re-
specified as new tokens per screen.
---
## 1. Global header
**Purpose:** Orient the visitor. Provide a way home. Never compete with advice.

| Element | Spec |
| --- | --- |
| Content | Text wordmark only: `[Product Name]` (plain words, `type-ui` or slightly larger, `color-
ink`). Not a logo. |
| Link | Entire wordmark is a link to landing (S1). Accessible name: site name, or `Home` if name 
is still placeholder. |
| Navigation | **None** in MVP . No hamburger, no age-in-header, no account, no theme switch. |
| Height | Quiet; padding `space-4`–`space-5` vertical. Not a fat app bar. |
| Rule | Optional 1px `color-border` under header. |
| Alignment | Wordmark **start** (left in L TR) on all breakpoints, or centred if a later visual pass 
prefers — **default: start**. Same on mobile and desktop. |
**Responsive:** Same header at all widths. Extra width is unused, not extra nav.
**Focus order:** Wordmark is the first focusable in the header.
**U15 / U20:** Final name and font licence unresolved.
---
## 2. Global footer

**Purpose:** How-it-works, legal placeholders, contribution entry, safety line. Receded (`type-
meta`, `color-ink-muted`).
| Element | Spec |
| --- | --- |
| Structure | Stacked links, then one safety sentence. Not a multi-column sitemap, not a 
newsletter field. |
| Links (intent) | `How this works`  S11. `Privacy`  S12 (placeholder until **U12**). `Offer advice` 
 S7. Optional `Guidelines`  S13. |
| Legal URLs | **Do not invent final URLs.** Use in-app routes or `#` placeholders labelled as 
incomplete until U12. |
| Safety line | Purpose: this is opinion, not professional care. Approximate length: one sentence. 
UX example: personal opinion / local emergency or qualified professional. **No country-specific 
phone numbers.** |
| Spacing | `space-9`–`space-10` above footer; link targets still ≥44px (padding on the hit area). |
**Cookie / consent banner (U12):** not designed. If later required, it must not cover the age field 
without a way to dismiss/accept; must be keyboard accessible. Do not add a banner in MVP 
spec as default chrome.
---
## 3. Copy principles (all screens)

| Do | Do not |
| --- | --- |
| State what happens next | Fake urgency, scarcity, “don’t miss this” |
| Call advice “a piece of advice” | Promise it will fix someone’s life |
| “Received / we’ll review” | “Published,” “you’re live,” “AI generated” |
| Matter-of-fact age language | Jokes about being old or a kid |
| Errors that name the field and the fix | Colour-only errors; stack traces |
**CTA intent:** Primary = complete the loop (see advice / another piece / send for review). 
Secondary = offer advice or change age. Tertiary = share, report, legal.
**Approximate lengths:** Headings ~5–10 words. Body 1–3 short sentences. Errors one 
sentence.
Canonical *example* strings: UX specification §17. If this file and that deck differ slightly, 
**prefer the UX deck** for wording and this file for layout.
---
## 4. S1 — Landing / age selection

### Purpose
Explain the product and collect an **explicitly entered** integer age 10–100. Primary action: 
receive advice. No default age. **No slider.**
### Structure (source order = visual order)
1. Header (wordmark).
2. `h1` — purpose: name the product idea. Tone: calm, specific. Example: `Advice for the age you 
are.` `type-title`.
3. Intro paragraph — purpose: one piece of advice, no account, no feed. ~2 sentences. `type-
body`, `color-ink-secondary`.
4. Why-age sentence — purpose: relevance, not identification. Visible without a tap if space 
allows; otherwise a disclosure control named `Why we ask for an age`.
5. No-account sentence — purpose: no signup. May sit in the same block as why-age.
6. Age **group**: visible `<label for="age">Age</label>`; numeric field; optional `+` / `−`.
7. Helper (not an error): `10–100` as placeholder and/or `aria-describedby` hint.
8. Primary button: intent “show one piece.” Example: `See advice`.
9. Footer.
Do **not** put the contribution form on this screen.

### Age field
| Rule | Spec |
| --- | --- |
| Control | Labelled numeric **text** input. Steppers optional but recommended. **No slider, no 
wheel.** |
| Empty default | Field starts **empty**. Do not prefill 10, 18, or 30. |
| Allowed | Integers 10–100 inclusive. |
| `inputmode` | `numeric`. Do not request date of birth. |
| Steppers | 44×44, names `Increase age` / `Decrease age`. Clamp; do not wrap. Disabled at 
bounds **and** `aria-disabled`/`disabled`. |
| Validate | On submit; on blur if non-empty. Not on first keystroke. |
| Empty submit | Error: enter an age from 10 to 100. `aria-invalid`, `aria-describedby`, focus field. |
| Out of range | Same bounds message. |
| Non-integer | Whole number from 10 to 100. |
| Primary | Prefer **enabled** + error on submit (do not silently disable with no reason). |
| Enter | Submits the form from the field. |
**U1:** Bounds stay 10–100 until legal says otherwise. No parental chrome.

### Focus order (S1)
Wordmark  (disclosure if present)  age field  decrease  increase (or steppers after field as 
grouped)  primary  footer links.
### Keyboard
Tab through the order above. Enter in field = submit. Steppers activate on Enter/Space.
### Empty vs invalid
- **Empty (initial):** no error text, no red border.
- **Invalid:** `color-border-strong` **and** `color-danger-text` message; not colour alone.
### Layout by breakpoint
| Width | What actually changes |
| --- | --- |
| 320–390 | Padding `space-4`; if steppers do not fit beside the field, wrap **under** the field; 
primary full column width; keep `h1` + field in first viewport when keyboard is closed |

| 391–767 | Default mobile; field visual centre; primary full column |
| 768–1023 | Same column `layout-advice`; more vertical space; primary may remain full column 
width of 36rem (do not stretch to 768px) |
| 1024–1439 | Centred column; mouse hover on buttons; no extra promo column |
| 1440+ | Margin only; type may use desktop title size |
### States
| State | UI |
| --- | --- |
| Default | Empty field, primary ready |
| Submitting first fetch | Primary busy (`aria-busy`); do not navigate away until success or error |
| First-load error | Stay on S1 **or** still shell with alert + Try again + keep age (UX: still layout, 
`Try again`, `Change age`) — prefer keep age value |
| Session lost (E13) | Treat as this screen, empty or unknown age |
---
## 5. S2 — Advice screen (core)
### Purpose

Show **one** piece of advice as the dominant object. Age is context. Few actions. Not a feed, 
not a social post.
### Structure (source order)
1. Header.
2. `Change age` — secondary or tertiary; keeps current age for edit on S1.
3. Age context — `type-context`, `color-ink-secondary`. Example: `Advice for age 42.` 
Semantically a heading (`h1` on this view) **or** `p` with `h1` on the advice — **prefer `h1` = age 
context, advice = body of `article`** so one `h1` per page. If advice is `h1`, age context is a 
preceding `p`. **Pick one and keep it:** recommended: `h1` visually quiet context + advice in 
`article` with `tabindex="-1"` (advice is largest type even if not `h1`). *Design-system gap:* 
heading vs visual size conflict — see §19.
4. Advice text — `type-advice`, serif, `color-ink`, measure 45–70 characters, **no truncation**.
5. **Category:** do not show. Category is optional in data and **not** on the public canvas (U3 
decided optional; no topic UI).
6. **Source label:** **omit** until **U4**. Never a username.
7. Primary: `Another piece of advice` (next).
8. Secondary: `Offer advice`  S7.
9. Tertiary row: `Share` / `Copy advice` · `Report this advice`.
10. Footer recedes.

**Forbidden on the advice object:** avatar, timestamp, likes, comments, related items, photos, 
engagement score, decorative quotation chrome that looks like an ad.
### Visual hierarchy
Advice type is the largest. Age context smaller and quieter. Primary button after a `space-6`–
`space-7` gap. Tertiary does not compete (text buttons, `type-ui`).
### Next, share, report, change age, contribute
See §6–§7 and §10–§12. All visible on S2 except contribute which navigates to S7.
### Loading / transition
See S3 (§6). Do not blank the whole page.
### Accessibility
- `article` for the piece; `aria-live="polite"` on the advice region for replacements.
- After successful next: focus the advice container (`tabindex="-1"`).
- Icon-only controls forbidden unless named; share/report are **text**.

### Layout by breakpoint
| Width | What changes |
| --- | --- |
| 320–390 | Advice wraps; primary full width; share/report wrap; each ≥44px; no horizontal scroll |
| 391–767 | Same; comfortable measure inside padding |
| 768–1023 | Column still 36rem; primary not viewport-wide if that exceeds the column |
| 1024–1439 | Centred; no reader/list split |
| 1440+ | Desktop advice size; measure stays ~36rem |
---
## 6. S3 — Next advice / in-place loading
Applies to **first** fetch after S1 and **next** on S2.
| Topic | Spec |
| --- | --- |

| Button | Immediate busy: accessible name `Loading…` (or equivalent); `aria-busy="true"` on the 
advice **region**; ignore further activations until settle |
| Previous advice | **Keep last successful text visible** until a new payload is ready (next). First 
load: no previous text — show textual `Loading advice…` in the advice region, keep header/footer 
|
| Indicator | Text required. Spinner optional, named, **not** the only indicator. No skeleton feed. 
No slot/roulette/shuffle |
| Replacement | Swap in place. Optional ≤150ms opacity if motion not reduced. Else instant 
(`motion-duration-default` 0) |
| Reduced motion | Instant swap; text loading is enough |
| Focus | On success, move focus to advice region; polite live region also announces |
| Duplicate prevention | Session seen-IDs for **this age** (mechanism **U7**). Do not specify 
storage UI |
| Exhausted | Go to S4; do not recycle unless a later source-of-truth change **explicitly** allows it 
(current docs: **do not silently recycle**) |
| Error | See S6: keep previous advice if any; alert + retry |
| Rate limit (E4 / U11) | Calm wait copy; optional brief disable with **text** wait, not a game timer. 
No CAPTCHA on this path |
---
## 7. S4 — Exhausted pool
When no remaining **eligible unseen** items exist for this age in this session (including empty 
library on first draw).

**U5:** UX already defines this state; implementation must not secretly reshuffle. Copy/timing of 
first-request vs next-request empty is specified as the **same honest empty**.
| Topic | Spec |
| --- | --- |
| Hierarchy | `h1`: that’s all we have for age {n} right now. Body: change age or offer advice. `type-
title` + `type-body`. **Not** `type-advice` (this is not a piece of advice) |
| Visual | Same column; quieter than S2; no fake card of old advice styled as new |
| Primary | `Change age`  S1 with age prefilled |
| Secondary | `Offer advice`  S7, range soft-defaulted to this age |
| Next button | Hidden or not present (nothing to fetch) |
| Live region | Polite announcement of the empty message |
| Age | Remain in session context; do not clear age |
---
## 8. S5 / S6 — Unavailable and generic error
### S5 Temporarily unavailable

Item cannot be shown (withheld, missing, post-report with nothing else, future dead permalink).
- Heading example: `This advice isn’t available right now.`
- **No** moderation reason, IDs, or “deleted for violating…”. **U6** unresolved for whether 
flagged items drop immediately; **appearance** if not shown is this generic state.
- Actions: `Another piece of advice` (if pool may still have items), `Change age`.
### S6 Generic error (network / 5xx)
**Must not expose:** database errors, stack traces, internal IDs, host names, security details.
| Situation | UI |
| --- | --- |
| Next failed, previous exists | Keep previous advice. `InlineAlert` error (`role="alert"`). Retry. Age 
preserved |
| First load failed | Still layout; `Try again`; `Change age`; preserve typed age |
| Contribute 5xx | Stay on S7; preserve fields; alert (E9) |
Retry control: secondary or primary as the only recovery action on that alert.

**U11:** 429 uses E4 copy, not internals.
---
## 9. S7 — Contribution form
### Purpose
Collect **only** min age, max age, advice text. Frame as **send for review**, not publish. No 
account fields.
### Structure
1. Header.
2. `h1` `Offer advice`.
3. Subtitle — purpose: write for a range, specific and human, not a slogan. ~2 sentences.
4. Fieldset legend: `Who is this advice for?`
5. `From age` / `To age` — labelled numbers 10–100, min ≤ max.
6. Helper: can widen if it fits more than one age.
7. `Advice` textarea — ≥4 visible lines.

8. Character count: show **if** a max is implemented. **U2 unresolved** — do not treat 40–400 
as a locked database max. Until U2: UI may use 40–400 as a **writing guide**; implementation 
must still enforce *some* explicit server max before go-live (content model) and the visible count 
must match that chosen max, labelled as provisional/not final if needed.
9. Notice list (visible, not modal-only): review before appear; sending ≠ published; may refuse 
harmful/spam/guideline-breaking; no names/contact/locations/PII.
10. Link `guidelines`  S13.
11. Checkbox: **omit** unless **U12** requires it. If required: `I understand this will be reviewed 
and may not be published.` Never pre-ticked.
12. Primary: `Send for review`.
13. Secondary: `Back to advice` or `Back`.
14. Footer.
**Soft default:** if session age exists, prefill from=to that age (C5). From footer with no age: 
leave range empty.
**Prohibited:** name, email, phone, profile, social, CAPTCHA on first view (U11).
### Keyboard / focus
Wordmark  title is not a control  from age  to age  textarea  guideline link  submit  back  
footer. Submit on Enter is **not** required from textarea (Enter = newline).

### Layout by breakpoint
| Width | What changes |
| --- | --- |
| 320–390 | Stack from/to ages; all full column; notices list comfortably wrapped |
| 391–767 | Same stack unless two fields each stay ≥44px and 16px font |
| 768+ | From/to may sit in one row **only if** those size rules hold; otherwise stay stacked |
| 1024+ | Form width `layout-form` 36rem centred |
### Validation (see also §10)
Client then **server**. Preserve values on error.
---
## 10. S7 error states — contribution validation
Do **not** invent a final character limit. Mark **U2**.

| Case | UI |
| --- | --- |
| Min > max | Error on max or group; example: range invalid, from must be ≤ to |
| Missing advice | Error on textarea; non-empty after trim |
| Too short / too long | Field error **only if** a limit is in force. Until U2, copy should not claim a 
fake legal limit; if a provisional guide is shown, say it is a guide |
| Empty / non-integer ages | Same pattern as S1 bounds 10–100 |
| Automated refusal (PII/spam shape) | Form-level alert, generic: couldn’t send as written; remove 
personal details (E10). Do not name detectors |
| Generic submission failure | Alert, preserve fields, retry (E9) |
| Rate limit | Calm wait; no internals |
Focus first invalid field. `role="alert"` for the error summary or first error.
No public “banned” state.
---
## 11. S8 — Contribution received
**Not published.**

| Element | Spec |
| --- | --- |
| `h1` | Example: `Received — thank you.` Success colour **plus** heading (not colour alone) |
| Body | Review; may appear later if publishable; if not, it simply won’t; **no email** |
| Must not say | Live, approved, published, countdown |
| Primary | `Back to advice` (restore session age + last piece) or `See advice`  S1 if no age |
| Secondary | `Offer another piece`  empty S7. Optional short cooldown message if immediate 
return — not punitive |
| Live region | Assertive or polite announcement of received-for-review |
---
## 12. S9 / S10 — Report flow
**Trigger:** tertiary `Report this advice` on S2 (and S5 if an item id still exists — usually S2).
**UI:** modal **dialog** (UX), not a toast-only confirm. `layout-dialog` max 28rem. Labelled title. 
Focus trap, Escape, return focus to the report control.

| Topic | Spec |
| --- | --- |
| Reasons | UX allows optional closed list. **U8 unresolved** — **do not invent** a final 
taxonomy. MVP minimum: confirm without extra PII. If reasons are added later, keep a **short 
closed list** (UX sketch only: harmful / spam / other) — not free-text essays |
| Body | We’ll review; this won’t notify a public audience |
| Confirm | `Send report` |
| Cancel | `Cancel` |
| Privacy | No name/email. Do not display IP . What is stored is **U8** |
| Success (S10) | `Thanks. We’ll look at this.` Then that item is **not shown again this session**; 
attempt next or S4/S5 |
| Failure | `We couldn’t send the report. Try again.` Do not claim success (E12) |
No public verdict, no “user will be punished.”
---
## 13. Share flow
Tertiary on S2. **U14:** no permalink required for MVP .

| Topic | Spec |
| --- | --- |
| Primary | **Copy** everywhere. **Web Share API** as enhancement when available (typically 
mobile) |
| Payload | Plain text: advice + `Advice for age {n}.` + site origin. No tracking query soup |
| Success | Button name `Copied` ~2s, then restore. Non-modal |
| Failure | `Couldn’t copy. Select the advice text instead.` |
| Visual | Text control. **No** icon wall (X, Instagram, TikTok, WhatsApp glyphs) |
| Desktop | Copy. Web Share only if the browser provides it |
| Mobile | Web Share sheet if capable, else copy |
| Do not | Auto-open share on load; require share to see next |
---
## 14. Change age
Control: `Change age` on S2/S4/S5/S6.
- Navigates to **S1** with the **current age prefilled** for editing (not locked).
- Submitting a new valid age fetches advice for the new age.

- Seen-list is **per age** for the session (UX). Storage mechanism **U7**.
- No profile, no “saved ages,” no persistent account age.
- Browser **Back** from S2 should not trap the visitor; age field remains usable (UX).
---
## 15. S11–S13 — Supporting pages
Not the core loop; keep Quiet Paper.
| Screen | Purpose | Spec notes |
| --- | --- | --- |
| S11 How this works | Why age; no account; review of contributions; opinion not professional 
care | Short page or disclosure; same header/footer; no diagrams required |
| S12 Privacy | Summary + link to full policy **when it exists** | **U12** placeholder; do not invent 
legal text |
| S13 Guidelines | What not to submit (public excerpt) | Linked from S7; not a full moderator 
manual |
| S14 Not found | Unknown URL | Generic; offer home / see advice. Future SEO |
**U18:** Whether these are static HTML without JS is unresolved; appearance is the same 
column.

---
## 16. Global loading pattern
Used by S3 and any slow submit.
| Requirement | Spec |
| --- | --- |
| Keyboard | Busy button not a focus black hole; user can still Tab to change age / footer unless a 
dialog is open |
| Screen readers | `aria-busy` on region; named loading text; polite live region optional for first 
load |
| Reduced motion | Text only; no required spinner |
| Slow network | Keep chrome; keep previous advice on next; timeout feels like S6 not a white 
screen |
| Mobile | No overlay that blocks the whole viewport unless a dialog; no splash brand animation |
---
## 17. Global public error pattern

One `InlineAlert` recipe: icon + **text** + optional retry. `role="alert"` for errors.
Never: stack traces, SQL, JSON dumps, request IDs in public copy, “403 Forbidden” as the only 
message.
Preserve: age, form fields, last advice when they exist.
---
## 18. Accessibility (cross-cutting)
| Topic | Spec |
| --- | --- |
| Focus indicator | 2px `color-focus`, offset 2px, all interactive elements |
| Focus order | Landmarks then source order; dialogs cycle |
| Keyboard | Full path; Enter submits age; Escape closes S9 |
| Touch | ≥44×44 CSS px; ≥8px gap |
| Labels | Visible; `fieldset`/`legend` on contribute range |
| Errors | Named field + fix; assertive; `aria-invalid` |

| Loading | See §16 |
| Advice replacement | Focus + polite live region |
| Landmarks | `header`, `main`, `footer` |
| Headings | One `h1` per screen; do not skip levels |
| Reduced motion | Instant swap |
| Text zoom | 200% wrap; advice not clipped |
| SR | Advice in `article`; icon buttons named if any exist (prefer text) |
---
## 19. Conceptual component hierarchy
Specification only. **No code.**
```
PageShell
 SiteHeader
    WordmarkLink           S1
 Main

    ProductIntro           S1
    AgeFieldGroup          S1 (label, input, steppers, FieldError)
    ButtonPrimary          S1 submit, S2 next, S7 submit
    ButtonSecondary        change age, offer advice, retry, back
    ButtonTertiary         share, report, footer-style in-page
    AdviceRegion           S2/S3 (context + AdviceCanvas + live region)
    EmptyState             S4 / S5
    InlineAlert            S6, form errors
    ContributeForm         S7 (range fields, textarea, NoticeList)
    ReceivedState          S8
    ReportDialog           S9
    ReportThanks           S10 (may be dialog or inline)
 SiteFooter
     FooterLinks            S11, S12, S7, S13
```
`ShareControl` and `ReportControl` live in `Main` on S2 as tertiary actions.
Do not add Avatar, LikeButton, CommentThread, ChatComposer, AgeSlider, ThemeSwitch.

---
## 20. Unresolved decisions (preserved)
Do not close these in UI invention:
U1 minors/legal · U2 character limits · U4 public source label · U5 exhausted-pool 
implementation detail (no silent recycle) · U6 flagged visibility · U7 session storage · U8 report 
metadata · U9 retention · U10 analytics · U11 CAPTCHA/rate limits · U12 legal pages/cookies · 
U13 rejected-submission retention · U14 permalink/SEO · U15 name/logo · U16 dark theme · U17 
operator auth · U18 no-JS · U19 engagement weighting · U20 font licensing.
---
## 21. Contradictions / tensions (Phase 0 vs 1 vs 2A)
Not silently “fixed”:
| Item | Notes |
| --- | --- |

| Copy micro-variants | UX deck vs visual-system examples (e.g. `See advice` vs nearby 
phrasings). **Prefer UX §17** for examples; layout in this file. |
| Heading vs visual dominance | Advice must be the largest type; `h1` may be the quieter age line. 
Documented as a gap in §19. |
| Contribute button label | UX `Send for review` vs visual-system `Send for review` — same intent; 
use UX. |
| Character limits | UX ~40–400 provisional; content model U2 unlocked. Canvas wraps; no fake 
final max in copy. |
| Report reasons | UX optional closed list vs U8. This spec: confirm-first; no invented taxonomy. |
| Session | UX needs seen-IDs; U7 storage unspecified. No UI for “cookie settings” unless U12. |
| Source labels | U4 omit vs possible later `Offered by a visitor`. MVP: omit. |
| No-JS | UX prefers working S1 without JS; U18 undecided. Spec does not require a JS-only 
landing. |
| First-load empty vs S4 | Architecture: first empty = honest empty, not a hang. Same S4 visual. |
---
## 22. Design-system gaps (do not invent tokens)
1. **h1 vs advice size** — visual system does not define heading token separate from `type-title` 
vs `type-advice` when they swap roles on S2.
2. **Prefilled age on “change age”** — visual system shows empty landing as default; this spec 
(per UX) prefills on change-age. Empty remains for true first visit.
3. **Character-count UI** — visual system says show count if max exists; U2 unlocked — 
implementation needs a labelled provisional max, not a new colour token.

4. **Busy spinner** — optional; no spinner size token. Text is enough.
5. **Dialog scrim** — `color-overlay` exists; no extra blur/glass (forbidden).
6. **Footer link lists on 320px** — wrap; no new breakpoint.
If implementation needs a token not in the visual system, **update the visual system in a later 
docs change** — do not fork a palette in code.
---
## 23. Phase boundary
This file is Phase 2B. **Do not** start Phase 3 (implementation) from this document alone. 
Follow `AGENTS.md`: documentation-only until a later phase explicitly starts application work.
