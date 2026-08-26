# Visual design system — Quiet Paper
**Status:** Phase 2A — visual definition only  
**Kind:** documentation only. Do not implement CSS, Tailwind config, or components from this 
file until an implementation phase is authorised.  
**Depends on:** [design-principles.md](./design-principles.md), [ui-ux-specification.md](./ui-ux-
specification.md), [product-requirements.md](./product-requirements.md)
This document turns the Phase 1 recommendation into a single visual system: **Quiet Paper** 
(Phase 1 Direction A, “Quiet paper”) with **Public desk** (Direction C) accessibility habits. It does 
not change product rules, architecture, or unresolved decisions.
**Do not** treat this file as permission to pick a product name, draw a logo, ship dark mode, lock 
font licences, or close legal questions.

---
## 0. Unresolved decisions this system must not close
Visual work may *depend* on these items; it must **not** decide them. IDs match `product-
requirements.md` §11.
| ID | Topic | Visual implication until decided |
| --- | --- | --- |
| U1 | Minors / legal treatment of ages 10–12 and other minors | Age field still 10–100; control 
stays precise and non-playful; no parental-gate chrome invented |
| U2 | Exact character limits | Advice canvas designed for the **provisional ~40–400 character** 
writing/layout guide; wrapping, not truncation; textarea max locked only when U2 is decided |
| U4 | Public source labels (editorial vs community) | **Omit** source badges on the advice 
canvas |
| U6 | Flagged advice visibility | If an item cannot be shown, use the generic unavailable 
appearance — no “removed for violation” styling |
| U7 | Session storage | No visual “you are logged in” or cookie-banner design beyond a possible 
future legal requirement (U12) |
| U8 | Report metadata | Report UI is confirm + thanks; no reporter identity chrome |
| U9 | Retention | No public “we keep this for N days” timeline on screens unless legal copy later 
requires it |
| U10 | Analytics | No charts, counters, or third-party pixel UI |
| U11 | CAPTCHA / rate-limit UX | No CAPTCHA on the reading path; rate-limit uses calm error 
text (UX E4), not a game timer |

| U12 | Legal pages and consent | Footer has quiet placeholder links; contribute checkbox only if 
legal later requires it |
| U13 | Rejected submissions | No rejection inbox, stamp, or status page |
| U14 | Permalink / SEO timing | MVP share is copy/Web Share of **words**, not a permalink card 
|
| U15 | Product name and logo | Header is a **text wordmark slot** (plain words). No mark, icon-
logo, or invented name |
| U16 | Dark mode | **Light theme only.** Tokens are named so a later theme could swap; do not 
build a switcher |
| U17 | Operator authentication | No public admin chrome |
| U18 | No-JS behaviour | Appearance is specified; whether first load works without JS is still a 
product/engineering decision |
| U19 | Engagement weighting | No “popular” badges, scores, or heat on the advice canvas |
| U20 | Font licensing | Families below are **recommendations** with known public licences; a 
human must confirm licence fit before production webfont use |
U3 (category required) is already decided as **optional** for MVP; the contribute form has no 
topic picker. U5 (exhausted pool) follows the UX empty state — this system only specifies how 
that state looks.
---
## 1. Visual philosophy

Quiet Paper treats the screen like a **single sheet of good paper and one paragraph of ink.**
The product loop is **age  advice  next advice  optional contribution.** The visitor is not 
browsing a catalogue. They are receiving one human sentence (or a few) for a named age. The 
visual system therefore:
- Puts **the advice** at the largest type size on the advice screen
- Uses **solid, warm, quiet surfaces** instead of atmosphere (no mesh, glass, particles)
- Uses **typography and margin** instead of illustration, photography of people, or decorative 
cards
- Keeps chrome (header, footer, extra actions) **visually receded**
- Looks **contemporary and calm**, not nostalgic pastiche, not a children’s app, not a SaaS 
dashboard
**Why this supports the product**
| Product need | Quiet Paper response |
| --- | --- |
| Trust without accounts | Boring, legible, institutional-enough paper; no growth chrome |
| Human, not AI chat | Serif prose on a page, not bubbles or a composer dock |
| Not social / dating / gambling | No avatars, no pills, no shuffle motion, no photos of people |
| Ages 10–100 | Matter-of-fact type and colour; not cute, not luxury-fashion, not “senior portal” |

| Accessibility | Ink-on-paper contrast; Direction C habits for focus, size, and labels |
**What we borrow from Direction C (Public desk)**
- Hyperlegible **UI** sans if the serif+sans pairing fails contrast or small-label tests
- **2px** input borders (paper must not go faint)
- **44×44 CSS px** minimum targets
- **2px focus ring with 2px offset**
- Honest empty/error states **without** illustration
- Meaning never by colour alone
**What we do not borrow from Direction B (Lamp hour)**
Dark canvas, amber-as-brand, night-mode default. That remains a documented alternate for a 
later phase (U16), not MVP .
---
## 2. Brand character

No final name. No logo.
| Aspect | Definition |
| --- | --- |
| Personality | A careful stranger leaving a short note. Editorial, adult, unhurried. Not a coach, not 
a brand mascot. |
| Emotional tone | Calm, specific, sometimes bittersweet. Warmth is **in the paper and the 
prose**, not in cheerleading copy or stickers. |
| Visual character | Ink, hairline rules, generous margin, rectangular controls with modest radius. 
Almost no icons. |
| Trust signals | Why-age sentence; no-account sentence; review notices on contribute; report 
control; quiet footer links; advice framed as **one person’s suggestion**. **Not** testimonials, 
user counts, expert badges, or stock photos. |
| Degree of warmth | Medium-low. Warm off-white and brown-black ink, not candy pastels. Do not 
add illustrated characters “for kids” or gold foil “for elders.” One visual language for 10–100. |
Wordmark slot: set the eventual name in the UI sans, sentence or title case, **not** a logotype. 
Until U15 is decided, use a neutral placeholder in specs only (for example `the site`) — do not 
invent a marketable name here.
---
## 3. Colour system (light theme only)

Semantic tokens. Hex values are the Quiet Paper **starting palette**. Contrast notes assume the 
paired background in the table. Implementation must re-check in the real typeface at the real 
size.
**Do not ship dark mode (U16).**
| Token | Hex | Typical use | Contrast notes |
| --- | --- | --- | --- |
| `color-canvas` | `#F4EFE6` | Page background | Warm paper. Solid. No gradient. |
| `color-surface` | `#FBF8F3` | Optional raised field fill, dialog fill | Slightly lighter paper; still solid |
| `color-ink` | `#1C1917` | Primary text, primary button fill, hairline emphasis | On `canvas` well 
above 4.5:1 (target ≥ 12:1) |
| `color-ink-secondary` | `#4F4A44` | Supporting paragraphs, age context | On `canvas` ≥ 4.5:1 |
| `color-ink-muted` | `#6F6962` | Footer, meta, tertiary labels | On `canvas` ≥ 4.5:1 for **text**; if it 
fails at 0.875rem, darken rather than shrink type |
| `color-border` | `#C9BDAA` | Input border, rules, secondary button outline | ≥ 3:1 against `canvas` 
for UI components |
| `color-border-strong` | `#1C1917` | Invalid field border (with error **text**), focus-adjacent | Used 
**with** copy, never alone |
| `color-action` | `#1C1917` | Primary button background | Same as ink; one accent, used rarely |
| `color-action-hover` | `#3A342E` | Primary hover/active | Still high contrast with `color-action-
text` |
| `color-action-text` | `#F7F3EB` | Label on primary button | On `action` ≥ 4.5:1 |
| `color-action-secondary-bg` | `transparent` | Secondary button | Outline `color-ink`; label `color-
ink` |

| `color-action-secondary-hover` | `#EBE4D8` | Secondary hover fill | Keep ink label ≥ 4.5:1 |
| `color-success-text` | `#215C38` | Success **text** (submission received), optional icon | On 
`canvas` ≥ 4.5:1; also include a heading, not colour alone |
| `color-warning-text` | `#8A5A12` | Rare warnings | On `canvas` ≥ 4.5:1; pair with text |
| `color-danger-text` | `#8F2D2A` | Errors, destructive tertiary (report confirm) | On `canvas` ≥ 
4.5:1; pair with text + `aria-invalid` |
| `color-focus` | `#1C1917` | `:focus-visible` ring | ≥ 3:1 vs `canvas`; 2px ring, 2px offset. If ink-on-
ink-button is unclear, use `color-action-text` ring on primary fill |
| `color-overlay` | `#1C1917` at 40% opacity | Dialog backdrop only | Must not be the only way to 
understand modality; dialog is labelled |
**Rules**
- No second brand accent. No purple SaaS, no gold “premium,” no rainbow states.
- Success/warning/error are **text colour + icon + words**, not coloured banners that shout.
- Do not use red/green as the only invalid/valid signal.
- Placeholder text is not the only instruction and must not be the contrast strategy for labels.
---
## 4. Typography

Reading quality is the brand. At most **two families**. `font-display: swap`. Reserve line-height to 
limit layout jump.
### 4.1 Recommended families (licence still U20)
| Role | Primary recommendation | Why | Fallbacks |
| --- | --- | --- | --- |
| **Advice (serif)** | [Source Serif 4](https://fonts.google.com/specimen/Source+Serif+4) (SIL 
OFL; confirm U20) | Editorial, readable italic, not costume “quote font” | `Iowan Old Style`, 
`Palatino Linotype`, `Palatino`, `Georgia`, `serif` |
| **UI (sans)** | [Atkinson Hyperlegible](https://brailleinstitute.org/freefont) (OFL; confirm U20) 
**or** Source Sans 3 if Atkinson feels too “civic” next to the serif | Direction C habit: small labels, 
errors, buttons stay readable for a wide age range | Source Sans 3, `system-ui`, `Segoe UI`, 
`Roboto`, `Helvetica Neue`, `Arial`, `sans-serif` |
Do **not** use the serif for tiny UI chrome if testing shows it fails. Do **not** use ultra-thin 
weights. Do **not** use display fonts, comic fonts, or monospaced UI.
Monospace is **not** used in public UI.
### 4.2 Scale
Root: `1rem` = browser default (typically 16px). Advice and inputs never below 1rem.

| Token | Mobile | Desktop | Weight | Line-height | Letter-spacing | Use |
| --- | --- | --- | --- | --- | --- | --- |
| `type-advice` | 1.5–1.75rem | 2–2.25rem | Regular (400) | 1.4–1.5 | 0 to −0.01em | Advice body 
— dominant |
| `type-title` | 1.5rem | 1.75–2rem | Semibold (600) | 1.25–1.3 | 0 | Landing/form titles (UI sans) |
| `type-body` | 1.0625–1.125rem | 1.125rem | Regular | 1.5 | 0 | Intro, notices |
| `type-ui` | 1rem | 1rem | Medium (500) labels; regular body | 1.4 | 0 | Buttons, fields |
| `type-context` | 0.9375–1rem | 1rem | Regular | 1.4 | 0 | “Advice for age n.” |
| `type-meta` | 0.875rem | 0.875rem | Regular | 1.4 | 0.01em | Footer, tertiary; **minimum 
0.875rem** |
Button text: `type-ui`, medium weight, sentence case. Not all-caps. Not tracked-out.
### 4.3 Advice reading measure
- **45–70 characters** per line (UX). Prefer ~60.
- Max width: `layout-advice` = **36rem** (see §6). Do not stretch advice on large desktops.
- Provisional length (U2): canvas must wrap **~40–400 characters** without “…” truncation on 
the advice screen.
- Italic allowed for emphasis inside a piece; do not set entire advice in italic.

---
## 5. Spacing
Base unit **4px**. Do not mix this scale with ad-hoc 10px / 15px gaps.
| Token | Value |
| --- | --- |
| `space-1` | 4px |
| `space-2` | 8px |
| `space-3` | 12px |
| `space-4` | 16px |
| `space-5` | 24px |
| `space-6` | 32px |
| `space-7` | 40px |
| `space-8` | 48px |
| `space-9` | 64px |
| `space-10` | 80px |

**Application**
| Context | Tokens |
| --- | --- |
| Page padding (inline) | `space-4` (narrow phones) / `space-5` (typical) / `space-6+` (large) plus 
safe-area insets |
| Section spacing (intro  age field) | `space-6` |
| Label  input | `space-2` |
| Input  helper/error | `space-2` |
| Advice  primary button | `space-6`–`space-7` |
| Stack of notices | `space-2` between items; `space-5` before submit |
| Control gap (stepper  field) | `space-2` minimum; **≥8px** between adjacent 44px targets |
| Card / advice region padding | If a surface is used at all: ≥ `space-5`; Quiet Paper **prefers zero 
card** — type on `canvas` |
| Dialog padding | `space-5`–`space-6` |
| Footer block from main | `space-9`–`space-10` |
---

## 6. Layout
The product is a **letter, not a dashboard.** One column. No sidebar of links, no related-advice 
rail, no feed.
| Token | Value | Use |
| --- | --- | --- |
| `layout-advice` / `content-narrow` | **36rem** (576px) | Landing, advice, forms — reading 
measure |
| `layout-form` | **36rem**, fields full width of this column | Contribute; stack min/max ages on 
small screens |
| `layout-wide` | **40–42rem** | Optional on large desktop for intro only; **do not** widen the 
advice measure to 80rem |
| `layout-dialog` | max **28rem** | Report confirm |
| `layout-button-max` | ~**24rem** | If the column is wider than `content-narrow` (it should not be 
on tablet+); otherwise primary is full column width on mobile |
**Header**
- One row: wordmark slot (text) left or centred; no nav mega-menu.
- Height quiet; no fat app bar.
- Home = landing.

**Footer**
- Small `type-meta`, `color-ink-muted`.
- Links: How this works, Privacy (placeholder until U12), Offer advice, guidelines excerpt as in UX.
- Not a sitemap farm, not a newsletter capture.
**Desktop / tablet / mobile**
Same structure, different padding. Extra viewport width becomes **margin**, not widgets. See 
§11.
---
## 7. Components (visual rules)
Conceptual. No package selection.
### 7.1 Age input
- Visible label `Age` above the field (never placeholder-as-label).

- Numeric text field: 2px `color-border`, 8px radius, padding 12px 16px, min height **44px**, 16px 
text, `color-surface` or `color-canvas` fill.
- Placeholder hint only: `10–100`.
- Visual centre of landing on a phone (keyboard closed).
- No default value. No slider. No wheel.
### 7.2 +/− controls
- 44×44 CSS px, same 2px border language as the field.
- Named: `Increase age`, `Decrease age`.
- Group with the field (`role="group"` / `aria-labelledby`).
- Disabled appearance at 10 / 100 **plus** accessible disabled state (not colour alone).
- Do not wrap from 100 to 10.
### 7.3 Primary button
- Fill `color-action`, text `color-action-text`.
- Radius **8px**, never pill (`9999px`).
- Min height 44px, horizontal padding ≥16px.
- One per screen.

- Mobile: full width of the content column.
- Hover: `color-action-hover`. Focus: visible ring. Busy: keep size, change accessible name 
(`Loading…`), `aria-busy` on the relevant region.
### 7.4 Secondary button
- Ink outline, transparent or `color-action-secondary-hover` on hover.
- Same height as primary.
- Use: Change age, Offer advice, retry.
### 7.5 Advice canvas (not a social card)
**Forbidden on this object:** avatar, display name, timestamp, like row, comment count, follow, 
photo, “related,” engagement score.
**Required:**
- Age context line in `type-context`, `color-ink-secondary`: `Advice for age {n}.`
- Advice in `type-advice` serif, `color-ink`, measure 45–70 characters.
- Type **on the page canvas** (preferred) or a single region with 0–8px radius (Quiet Paper 
prefers **0**) and no heavy shadow.

- Optional 1px rule above the age context, `color-border`.
- No decorative quotation marks if they make slogan tone.
### 7.6 Next-advice action
- Same as primary button. Label: `Another piece of advice` (UX).
- In-flight: disabled/busy; ignore double activation.
- Not a shuffle icon, dice, or “spin.”
### 7.7 Contribution form
- Title + short subtitle (UX).
- Fieldset `Who is this advice for?` with `From age` / `To age`.
- Stack fields on small screens; side-by-side only if each control stays ≥44px and ≥16px font.
- Notices as a short list **above** submit, not only in a legal page.
- Submit: `Send for review` (primary). Cancel/back: secondary.
### 7.8 Textarea

- Same border language as inputs.
- At least **four lines** visible before inner scroll.
- Visible character count if a max exists; until U2 is locked, still prevent megabyte paste at 
implementation time with **some** explicit max — the visual count should match the chosen 
max, labelled as such.
- Resize: vertical only or none; do not break the column.
### 7.9 Validation states
- Invalid: `aria-invalid="true"`, border `color-border-strong` **and** `color-danger-text` message via 
`aria-describedby`.
- Focus first invalid field on submit.
- Empty age: no scream until submit / blur-with-intent.
### 7.10 Report action
- Tertiary text button, min 44px hit area. Label `Report this advice`.
- Opens a labelled dialog (not a toast-only confirm).
- Confirm primary may use ink fill; it is not a “fun” red CTA. Danger is in the **copy**, not a giant 
red panel.

### 7.11 Share action
- Tertiary: `Share` (Web Share when available) / `Copy advice`.
- Success: `Copied` for ~2s, then restore. Failure: non-blocking text, not a modal.
- No network glyphs (X, Instagram, TikTok).
### 7.12 Loading
- Keep header/footer.
- Advice region: textual `Loading advice…` (or equivalent). Optional spinner **only** with 
accessible name, never as the sole indicator.
- **No** skeleton shimmer that looks like a feed.
### 7.13 Unavailable
- Heading + short body (UX S5). Generic. No moderation reason.
- Actions: another piece, change age.
### 7.14 Exhausted pool

- Heading + short body (UX S4). Honest. No recycled item styled as new.
- Primary becomes `Change age`; secondary `Offer advice`.
---
## 8. Iconography
Restrained. Typography first.
- Prefer **text controls** over icons.
- If an icon is used (steppers, close dialog), it is a **simple stroke**, 1.5–2px, currentColor, not a 
filled sticker, not a 3D glyph, not a mascot.
- Every icon-only control has a visible or SR **name**.
- Decorative rules are `aria-hidden`.
- **Do not choose or install an icon pack in this phase.** When implementation starts, prefer 
system/simple SVG in-repo over a large icon library unless a concrete need appears 
(`AGENTS.md`).
No illustrated empty states, no emoji as UI, no “AI sparkle.”
---

## 9. Motion
Quiet Paper defaults to **stillness.** Randomness is never animated.
| Token | Value |
| --- | --- |
| `motion-duration-default` | **0ms** (instant swap) |
| `motion-duration-optional` | ≤ **150ms** opacity only, if motion is not reduced |
| `motion-easing` | `ease-out` if any optional fade exists |
| `motion-loading` | No loop that looks like a slot; spinner rotation only if `prefers-reduced-motion` 
is not `reduce` |
**Advice replacement:** swap text in place. Optional short fade. **No** slide, flip, shuffle, scale-
bounce, number ticker, confetti.
**Loading:** labelled wait on the existing screen; no branded splash.
**`prefers-reduced-motion: reduce`:** instant swap; no decorative animation; no spinner required 
(text is enough). Honour this as mandatory, not best-effort.

---
## 10. Accessibility
Floor: **WCAG 2.2 Level AA** (UX). Direction C habits are mandatory in this system.
| Topic | Requirement |
| --- | --- |
| Contrast | Body/UI text ≥ **4.5:1**; large advice prefer **4.5:1** even if 3:1 would pass; 
components and focus ≥ **3:1** |
| Focus | `:focus-visible` 2px solid `color-focus`, **offset 2px**; never `outline: none` without 
replacement |
| Keyboard | Tab order = visual order; Enter submits age; dialog trap + Escape + restore focus; 
steppers named and reachable |
| Touch | **≥44×44 CSS px**; spacing ≥8px between adjacent targets |
| Labels | Visible `<label>` on every input; fieldset/legend for age range; placeholders are hints |
| Errors | Text that names the field and the fix; `role="alert"` or assertive live region; not colour-only 
|
| Live regions | `aria-live="polite"` on advice replacement; assertive for errors |
| Reduced motion | See §9 |
| Text scaling | Layout must wrap; no clipped advice at 200% zoom or OS font scaling |
| Language | `lang="en"`; international English copy |

| Semantics | `header`, `main`, `footer`, `form`, `article` for advice, real `button`s |
CAPTCHA, if ever required (U11), stays **off** the advice-reading path and must itself be 
accessible.
---
## 11. Responsive system
One design, not five. Same column, same hierarchy; padding and wrapping change.
| Range | Intent |
| --- | --- |
| **320–390px** | Padding `space-4`; steppers wrap **under** the field if needed; no horizontal 
scroll; primary full column width |
| **391–767px** | Default mobile target; age field in first viewport (keyboard closed); share/report 
row wraps; each target ≥44px |
| **768–1023px** | Same single column at `layout-advice`; more vertical air; primary not 
stretched to tablet width if column is already 36rem |
| **1024–1439px** | Centred column; no sidebar; mouse + keyboard first-class |
| **1440px+** | Extra space is margin; advice type may use desktop size; measure stays ~36rem |

Safe-area insets on notched phones. Landscape: compress intro; keep field + CTA usable; do not 
lock orientation.
Hover is enhancement. Primary actions must work with tap and keyboard.
---
## 12. Visual states (screens)
Appearance only; copy from the UX spec. No new product behaviour.
| State | Appearance |
| --- | --- |
| **Initial age screen** | Wordmark slot; short intro; why-age; no-account line; empty age field as 
visual centre; primary `See advice`; quiet footer. No default age. |
| **Invalid age** | Field `aria-invalid`; stronger border; error text under field (`color-danger-text` + 
words); focus to field; primary remains a normal button |
| **Loading (first advice)** | Landing chrome or advice chrome kept; region text `Loading advice…
` |
| **Advice** | Change age (tertiary/secondary); context line; dominant serif advice; primary next; 
secondary offer; tertiary share · report |
| **Next-advice loading** | Previous advice **remains** until success unless first load; primary 

busy; `aria-busy` on advice region |
| **Exhausted pool** | Honest heading; no fake repeat; change age + offer advice |
| **Unavailable / error** | Generic unavailable **or** keep last advice + inline alert + retry; never 
empty white screen |
| **Contribution form** | Title, range fields, textarea, notice list, primary send, back |
| **Contribution validation error** | Same form; values preserved; field/group errors |
| **Contribution received** | Calm success heading; body that this is **review, not publication**; 
no confetti; primary back to advice |
| **Report confirmation** | Small dialog; title + body; send report / cancel; then thanks and that 
item not shown again in-session |
Do not design a public rejection inbox (C2 / U13).
---
## 13. Design tokens (conceptual tables)
Not CSS. Not Tailwind config. Implementers map these names to whatever styling method the 
implementation phase chooses.
### 13.1 Colour

See §3 table (`color-canvas` … `color-focus`).
### 13.2 Typography
See §4.2 (`type-advice` … `type-meta`). Families: `font-advice`, `font-ui` (U20).
### 13.3 Spacing
See §5 (`space-1` … `space-10`).
### 13.4 Radii
| Token | Value | Use |
| --- | --- | --- |
| `radius-none` | 0 | Advice canvas (preferred) |
| `radius-control` | 8px | Inputs, buttons |
| `radius-dialog` | 12px | Report dialog |
| `radius-pill` | **forbidden** | Do not use |

### 13.5 Shadows
| Token | Value | Use |
| --- | --- | --- |
| `shadow-none` | none | Default |
| `shadow-dialog` | optional very small (e.g. 0 8px 24px ink at 8–12% opacity) | Dialog only, if a 
border is not enough |
| `shadow-card` | **forbidden** | No social-card elevation |
Hairline **borders** beat drop shadows.
### 13.6 Motion
See §9 (`motion-duration-default`, `motion-duration-optional`, `motion-easing`).
### 13.7 Breakpoints
| Token | Width |
| --- | --- |
| `bp-xs` | 320px |

| `bp-sm` | 391px |
| `bp-md` | 768px |
| `bp-lg` | 1024px |
| `bp-xl` | 1440px |
Prefer `rem`-based media queries at implementation.
### 13.8 Control heights
| Token | Value |
| --- | --- |
| `size-touch` | **44px** minimum (width and height) |
| `size-input` | ≥44px |
| `size-button` | ≥44px |
| `size-stepper` | 44×44px |
---
## 14. Anti-patterns

Future coding agents must **not** introduce:
- Generic indigo/white SaaS dashboards, pill buttons, heavy card shadows
- Glassmorphism, mesh gradients, blob backgrounds, particle fields
- Chat bubbles, “AI is typing,” sparkle icons, generated-advice framing
- Avatars, likes, comments, feeds, streaks, confetti, slot/shuffle/dice motion
- Fake testimonials, fake statistics, “join thousands,” expert badges
- Photos of people, dating-app night mode, gamified age wheels
- Children’s cartoon chrome **or** luxury-fashion chrome as a substitute for one adult-calm 
language
- Colour-only errors; `outline: none` without a ring; targets under 44px
- Skeleton feed shimmers; related-article grids; 91 age landing templates
- Invented product name or SVG logo “to look finished”
- Dark-mode toggle in MVP (U16)
- Visible CAPTCHA on landing/advice (U11)
- Service-role keys or any secret in the client (security docs)
- New packages for icons, animation, or UI kits without a documented need
---

## 15. Implementation guidance (future frontend)
When an implementation phase is opened (`AGENTS.md`):
1. **Read** this file with the UX spec. If they conflict, **stop and document** — do not silently 
pick.
2. Map §13 tokens to CSS custom properties **or** Tailwind theme keys **once**. Do not hard-
code hex in random components.
3. Build a small set of primitives that match the UX inventory: page shell, age field+steppers, 
primary/secondary/tertiary buttons, advice article, inline alert, textarea, dialog, live region. 
**Reuse them.** Do not add a second button library.
4. Structure pages as one centred column (`layout-advice`). Do not introduce a dashboard layout.
5. Render advice as **text**, not HTML (XSS). Serif class on the article only.
6. Put focus and live-region behaviour in the same place as the visual swap for next advice.
7. Honour `prefers-reduced-motion` at the token level (duration 0).
8. Confirm **U20** (font licence) before self-hosting or linking webfonts.
9. Do not install an icon pack, animation library, or component kit unless a human agrees it is 
necessary.
10. Do not treat provisional 40–400 characters, omitted source labels, or light-only theme as 
closed legal/product decisions.
Planned stack (not installed): Next.js, TypeScript, Tailwind CSS. This design system is **stack-

agnostic**; Tailwind is a likely mapping, not a requirement to invent `tailwind.config` in this 
phase.
---
## 16. Relationship to other docs
| Doc | Authority |
| --- | --- |
| `design-principles.md` | Judgement, anti-goals, copy register |
| `ui-ux-specification.md` | Screens, flows, copy deck, interaction |
| **This file** | Colour, type, space, component look, tokens |
| `product-requirements.md` | Unresolved IDs U1–U20 |
Phase 2B (if opened later) may produce mockups or implementation; it is **not** authorised by 
this file alone.
