# UI/UX specification
**Status:** Phase 1 — definition only. Do not implement from this document until a later phase 
explicitly starts application work.  
**Product (unnamed):** a global, anonymous, age-relevant life-advice site.  
**Companion:** [design-principles.md](./design-principles.md)

This specification defines the public visitor experience: landing and age, advice, next advice, 
contribution, submission result, and the few public states that moderation requires. It does not 
define an admin dashboard, a logo, or a product name.
---
## 0. Relationship to Phase 0 and remaining tensions
### 0.1 Phase 0 source of truth (now in this repository)
Phase 0 product, architecture, security, and content documentation **exists in this repository**. It 
was not present when this UX specification was first written. This section records current paths 
only; it does not change UX decisions.
Read alongside this file:
| Concern | Path |
| --- | --- |
| Agent rules | `AGENTS.md` |
| Product requirements | `docs/product/product-requirements.md` |
| User flows | `docs/product/user-flows.md` |

| MVP scope | `docs/product/mvp-scope.md` |
| Future roadmap | `docs/product/future-roadmap.md` |
| System architecture | `docs/architecture/system-architecture.md` |
| Data model | `docs/architecture/data-model-proposal.md` |
| Random advice | `docs/architecture/random-advice-system.md` |
| Moderation system | `docs/architecture/moderation-system.md` |
| Privacy principles | `docs/security/privacy-principles.md` |
| Security requirements | `docs/security/security-requirements.md` |
| Threat model | `docs/security/threat-model.md` |
| Advice content model | `docs/content/advice-content-model.md` |
| Content taxonomy | `docs/content/content-taxonomy.md` |
| Moderation guidelines | `docs/content/moderation-guidelines.md` |
(Some filenames differ from the list originally expected at Phase 1 start; the table above is the 
actual tree.)
This specification remains the source of truth for **public UI/UX**. Phase 0 remains the source 
of truth for **product rules, architecture, privacy, and content policy**. Where the UX needs a 
behaviour that architecture owns, the need is a **dependency**, not a schema change. Do not 
treat this UX spec as permission to rewrite architecture.

The repository still contains **no application code**.
### 0.2 Contradictions and tensions (do not resolve silently)
These are conflicts or underspecified clashes between the requested UX and typical constraints 
of this product. They are recorded so a later phase can decide — not so UI can paper over them.
| ID | Tension | UX implication | What not to do in this phase |
| --- | --- | --- | --- |
| C1 | **Minimum age 10 vs child privacy / capacity.** Collecting an age of 10 and showing life 
advice (and possibly accepting submissions) involves children. Privacy, parental consent, and 
age-appropriate content rules (including COPPA-style and GDPR-K style regimes) often treat 
under-13 (and sometimes under-16) differently. | Age field still validates **10–100** as 
requested. Copy stays non-predatory and non-playful. Contribution copy must tell people not to 
include personal information — extra-important if a child can submit. | Do not raise the minimum 
age in the UI spec. Do not add parental-gate UI. Flag C1 for product + legal + privacy before 
implementation. |
| C2 | **No account vs “submission rejected” as a public state.** Without identity, the contributor 
usually cannot return later to see a rejection. | MVP success state is **received for review**, not a 
status inbox. “Rejected” is specified as **copy and a possible same-session message only if the 
server can respond immediately** (e.g. automated refusal for empty/too-short text). Deferred 
human rejection is **not** a logged-in notification in MVP . | Do not invent email, magic links, or a 
reference-code portal to “fix” this. |
| C3 | **Sharing vs anonymity and thin URLs.** Sharing is useful; shareable permalinks can create 
a content farm, tracking surface, or identity leak. | Sharing is **optional, tertiary**, and prefers 
**in-device share / copy of the words** in MVP . Stable public permalinks are an SEO *future* 
option, not the default next-advice URL. | Do not design Open Graph preview pages for every 
random draw. |
| C4 | **Session duplicate-avoidance vs a true random pool.** UX requires no accidental duplicate 
in a session and a graceful empty pool. Random systems sometimes re-draw, weight, or allow 
repeats across sessions. | UX requires the **client session** to remember seen advice IDs (or 
equivalent tokens) for the current age and to ask the server for “next unseen.” Empty pool is a 
first-class screen state. | Do not specify shuffling algorithms, weights, or database tables. |

| C5 | **“Submit for another age range” vs “advice for the age I entered.”** Contributors may write 
for ages they are not. | Contribution is **not** locked to the visitor’s selected age. Selected age 
may be used only as a **soft default** for the range, which the visitor can change. | Do not 
require proof of age to write for a range. |
| C6 | **Report without account vs abuse.** Reports need enough signal to be useful and not 
enough identity to contradict anonymity. | Report is a **two-step confirm** with optional short 
reason from a closed list. Rate-limiting is a server concern; UI only disables repeat reports on the 
same item in-session. | Do not add CAPTCHA as a visual brand element; if later required, keep it 
off the advice-reading path. |
| C7 | **SEO landing pages vs one-piece-at-a-time product.** Indexable pages per age (10 through 
100) would create ~91 thin duplicates. Topic pages are optional later; taxonomy now lives in 
`docs/content/content-taxonomy.md` and is **not** a public IA for MVP . | SEO section (below) 
prefers **a small set of editorial/life-stage pages**, not automatic age URLs. Random advice 
views are **not** the canonical URL strategy. | Do not implement SEO. Do not promise `/age/17` 
as a product surface. |
| C8 | **“Advice temporarily unavailable” vs showing why.** Transparency can conflict with 
moderator safety and with not implying the visitor did something wrong. | Use a **generic, calm** 
unavailable state. Do not say “removed for violation” on the public advice screen. | Do not design 
public moderation reasons. |
| C9 | **Numeric precision vs “life stage.”** The product asks for a number 10–100, not “in my 
thirties.” | Age input is numeric. Life-stage language may appear later in SEO/editorial pages, not 
as a substitute for age on the primary path. | Do not replace age with a stage picker in MVP . |
| C10 | **Character limits, topics, and source labels** live in the content model and taxonomy 
(`docs/content/advice-content-model.md`, `docs/content/content-taxonomy.md`). Exact limits, 
required category, and public source labels remain **unresolved** there (PRD U2, U3, U4). | This 
spec proposes **UX-facing limits and labels** (see §9) marked **provisional**. Category is not 
on the contribute form. Source type is omitted on S2 until U4 is decided. | Do not treat provisional 
limits as database constraints. Do not add a topic picker or source badge in MVP . |
---
## 1. Design goals
### 1.1 Visitor outcomes

A first-time visitor on a phone should, within a few seconds:
1. Understand that the site gives **one piece of life advice related to an age**.
2. Understand **why age is asked** (relevance, not profiling theatre).
3. Understand that **no account is required**.
4. Enter an age from **10 to 100** and receive advice.
5. Be able to request **another piece** without losing the age.
6. Be able to **offer advice** for an age range, with honest review expectations.
7. Be able to **leave** without guilt, email capture, or a wall.
### 1.2 Quality goals
| Goal | Design expression |
| --- | --- |
| Simple | One column; one primary button; short copy |
| Calm | Quiet colour; no gamification; generous space |
| Human | Advice in readable serif (or equivalent); conversational UI chrome in sans |
| Trustworthy | Explanations adjacent to asks; no dark patterns |

| Modern | Contemporary type, spacing, and focus; not skeuomorphic gadgets |
| Accessible | WCAG 2.2 AA as the floor; keyboard and screen reader on the critical path |
| Mobile-first | Thumb-zone primary actions; 44×44 CSS px minimum targets |
| Fast | Age  advice in one step; next advice without a full page reload when possible |
| Meaningful, not manipulative | No “this will change your life”; no fake intimacy |
### 1.3 Anti-goals (interface)
- Onboarding carousels
- Accounts, avatars, streaks, hearts, comment threads
- Age as a colourful game or slot machine
- Chat UI (composer at the bottom, bubbles, “AI is typing”)
- Related-advice sidebars, tag clouds, or infinite scroll of mixed ages
- Marketing stats (“12,403 lives improved”)
- Admin or moderator UI in the public site
---
## 2. User flows

Flows are **conceptual**. URLs are illustrative, not a routing mandate.
### 2.1 Primary path — receive advice
```
Open site
   Landing / age selection (empty, valid, or invalid)
   Submit age (Enter or primary button)
   Advice screen (first piece for that age)
        Next advice (same age, new piece)
        Change age (returns to age selection with previous age prefilled)
        Offer advice (contribution)
        Share (system share or copy; stay on advice)
        Report (confirm  thanks  next piece or unavailable)
```
**Rules**

- Age remains in session until the visitor changes it or the session ends.
- Next advice does not re-ask age.
- Browser back from advice should return to age selection with the age still in the field (do not 
trap the visitor).
### 2.2 Next advice (in-session)
```
Visitor activates “Another piece of advice”
   Control immediately shows busy/disabled state
   Server asked for next unseen item for this age + session
   Success: advice text replaced; focus and live region updated
   Empty pool: exhausted state (age kept)
   Failure: previous advice remains; inline error + retry
```
Prevent double-submit: ignore additional activations until the in-flight request finishes or fails.
### 2.3 Contribution

```
From advice (or from landing footer)
   Contribution screen
   Visitor sets minimum age, maximum age, advice text
   Reads review / privacy notices (visible, not only in a legal page)
   Submit
        Client validation errors (stay on form)
        Server validation / automated refusal (stay on form or result with refusal)
        Success: submission received
        Server error: stay on form, preserve input, offer retry
```
No account. No “save draft” across devices. Optionally keep unsaved text in `sessionStorage` for 
accidental refresh only — not as an identity feature.
### 2.4 Report (safety, tertiary)
```
Advice screen  “Report this advice”
   Confirm dialog (reason list optional)

   “Report sent” acknowledgement
   That piece is not shown again in this session
   Attempt next advice automatically, or show unavailable/exhausted if none
```
### 2.5 What is not a user flow in this phase
- Sign up / sign in
- Moderator queue
- Appeal of a rejection
- Following authors
- Search
- Topic browsing (future SEO/editorial only)
---
## 3. Screen inventory
Public screens and overlay states for MVP . Names are design names, not routes.

| ID | Name | Purpose | Entry |
| --- | --- | --- | --- |
| S1 | Landing / age | Explain the product; collect age | First visit; change age; home |
| S2 | Advice | Show one piece; next; contribute | Valid age submit; next success |
| S3 | Advice loading | Wait for first or next piece | After age submit or next |
| S4 | Pool exhausted | No unseen advice left for this age | Next / first fetch empty |
| S5 | Advice unavailable | Requested item cannot be shown | Fetch 404/410/withheld; post-
report with nothing else |
| S6 | Generic error | Server/network failure | Failed fetch or submit |
| S7 | Contribute | Collect range + text + consent-to-rules | Secondary CTA |
| S8 | Submission received | Honest success; not published | Successful contribute |
| S9 | Report confirm | Prevent accidental reports | Report control |
| S10 | Report received | Acknowledge report | After confirm |
| S11 | How this works | Short explainer (page or disclosure) | Footer / “Why age?” |
| S12 | Privacy notice | Public privacy summary + link to full policy when it exists | Footer |
| S13 | Content expectations | What not to submit (public excerpt) | Linked from contribute |
| S14 | Not found (site) | Unknown URL | Future SEO/mistype |
**Out of inventory (explicitly not designed as screens)**

- Admin dashboard
- Rejection inbox for contributors
- User settings
- Cookie megabanner beyond a legally required minimum (if a later legal phase requires a banner, 
keep it non-blocking of age entry as much as the law allows)
**S8 vs deferred rejection:** human rejection after S8 has **no dedicated public screen** in MVP 
(see C2). Automated refusal of a form (too short, invalid range) is an **error state on S7**, not a 
“your advice was banned” page.
---
## 4. Component inventory
These are conceptual components for a future design system. Not to be built in this phase.
| Component | Role | Notes |
| --- | --- | --- |
| `PageShell` | Max-width column, header, footer | Header is wordmark placeholder + quiet home 
control only |

| `SiteHeader` | Minimal | No nav mega-menu |
| `SiteFooter` | How this works, privacy, contribute, report policy | Small type, not a sitemap farm |
| `ProductIntro` | 1–2 sentence purpose + “no account needed” | Landing |
| `AgeField` | Labelled numeric entry + optional steppers | Primary input; see §5.1 |
| `FieldError` | Text error bound via `aria-describedby` | Never colour-only |
| `ButtonPrimary` | One per view | Age submit; next advice; form submit |
| `ButtonSecondary` | Offer advice; change age | Lower contrast fill or outline |
| `ButtonTertiary` / `TextButton` | Report, share, legal | Not competing with advice |
| `AdviceCanvas` | Dominant advice text + age context | Not a social “card” with avatar |
| `AgeContext` | “Advice for age {n}.” | Plain sentence, not a badge cluster |
| `ShareControl` | Web Share if available, else copy | See §5.2 |
| `ReportControl` | Opens S9 | Tertiary placement |
| `InlineAlert` | Error, warning, info | Icon + text; role=alert when error |
| `EmptyState` | Exhausted / unavailable | Same layout as advice, quieter type |
| `TextField` | Min/max age on contribute | Numeric, labelled |
| `TextArea` | Advice body | Visible character count |
| `NoticeList` | Review, no-PII, no-guarantee-of-publish | Adjacent to submit, not a modal-only |
| `Dialog` | Report confirm only | Focus trap, ESC, return focus |
| `LiveRegion` | Announces new advice and errors | `polite` for new advice; `assertive` for errors |

| `FocusRing` | Visible :focus-visible | Required on all controls |
**Not in inventory:** avatar, like button, comment field, chatbot composer, cookie preference 
centre (unless legally mandated later), age **slider** as the sole control.
---
## 5. Primary user flow — detailed UX
### 5.1 Landing / age selection (S1)
#### Purpose
The visitor immediately understands the site, why age is asked, that no account is required, and 
that the next step is simply to receive advice. **Entering an age is the primary action.**
#### Layout (mobile-first)
1. **Header** — placeholder wordmark (text only, e.g. the site’s eventual name as plain words). 
Home is the same screen.
2. **Intro** (one short heading + one short paragraph), for example:

   - Heading: `Advice for the age you are.`
   - Body: `Enter an age. We’ll show one piece of advice that people have offered for that time of 
life. No account. No feed.`
3. **Why age** (one sentence, visible without a tap if space allows; otherwise a disclosure):
   - `We ask for an age so the advice can match that stage of life — not to identify you.`
4. **No account** (same block or immediately under the field):
   - `You can use this site without creating an account.`
5. **Age field** — the visual centre of the screen on a phone (see control decision below).
6. **Primary button** — `See advice` (not “Get started,” “Unlock,” or “Continue to your journey”).
7. **Footer** — How this works, Privacy, Offer advice (secondary, low emphasis).
Do not put the contribution form on the landing screen.
#### Age control: input vs slider vs both
| Option | Accessibility | Mobile / one-handed | Precision (10–100) | Recommendation |
| --- | --- | --- | --- | --- |
| **Slider only** | Native range is awkward to announce and to set exactly; 91 discrete values | 
Thumb travel is long; easy to overshoot | Poor | **Reject** as primary |
| **Numeric field only** | Excellent if labelled; works with keyboard and `inputmode="numeric"` | 
Number pad on many phones; still OK one-handed | Excellent | **Accept** as the source of truth |

| **Slider + numeric** | Possible if they are one widget (same name/value) | Extra chrome; slider 
still imprecise | Numeric saves it | **Not worth the complexity** for MVP |
| **Numeric + steppers** | Steppers must be named (“Increase age”, “Decrease age”); field 
remains labelled | Good for one-handed adjust without the keypad | Excellent | 
**Recommended** |
**Decision:** Use a **labelled numeric text field** as the single source of truth, with **optional 
large +/- steppers** beside or below it for one-handed adjustment. Do **not** use a slider.
**Field behaviour**
- Visible `<label>`: `Age` (not placeholder-as-label). Placeholder may be `10–100` as hint only.
- Allowed integers: **10 through 100** inclusive.
- `inputmode="numeric"` / `autocomplete="bday-age"` is acceptable; do not request a date of 
birth.
- Steppers clamp at 10 and 100 and do not wrap.
- Validate on **submit** and if the field is non-empty and blurred. Do not scream on the first 
keystroke.
- Invalid examples: empty, `09`, `7`, `101`, `34.5`, `twenty`, leading junk.
- Error text examples:
  - Empty: `Enter an age from 10 to 100.`
  - Out of range: `Use an age from 10 to 100.`
  - Not an integer: `Use a whole number from 10 to 100.`

- Primary button may stay enabled; activation runs validation. Alternatively disable only when 
empty **if** the disabled reason is also visible — prefer **enabled + error on submit** so screen-
reader users are not blocked by a silent disabled control.
- Submitting with Enter in the field is supported.
**Do not**
- Show a default age (that would pretend we know them).
- Ask sex, location, name, or email on this screen.
- Use a wheel picker that hides neighbouring values as a carnival ride.
### 5.2 Advice screen (S2)
#### Purpose
The advice is visually dominant. Age is context. Actions are few.
#### Content order (reading and source order)
1. Quiet way back / change age: `Change age` (keeps current value for edit).
2. **Age context:** `Advice for age 42.`

3. **Advice text** — largest type on the page; comfortable measure (~45–70 characters).
4. Optional **source restraint:** if editorial vs community must be distinguished later, use a 
single calm line (`Offered by a visitor` / `From the editors`). Until content docs exist, **omit 
author-like attribution**. Never show a username.
5. **Primary:** `Another piece of advice`
6. **Secondary:** `Offer advice` (contribution)
7. **Tertiary row:** `Share` · `Report this advice`
8. Footer legal links remain available but visually recede.
#### Sharing (recommended, constrained)
Sharing is **allowed** so a piece of wording can be passed to one person. It must not turn the 
product into a social graph.
| Context | Mechanism | What is shared |
| --- | --- | --- |
| Capable mobile browsers | Web Share API | Plain text: advice + `Advice for age {n}.` + site origin. 
No tracking query soup. |
| Others | `Copy advice` | Same plain text; button becomes `Copied` then restores |
Do **not** lead with Twitter/X, Instagram, or TikTok glyphs. Do **not** auto-open share on load. 
Do **not** require share to see another piece.

**MVP recommendation:** implement **copy** everywhere; use **Web Share** as progressive 
enhancement. **Do not** depend on a unique permalink for MVP sharing (C3). If a later SEO 
phase adds curated permalinks, share may then include that URL.
#### What stays off this screen
Navigation bars, ads, view counts, “related advice,” comment counts, author follow, newsletter, 
and decorative randomisation.
### 5.3 Next advice
| Requirement | UX behaviour |
| --- | --- |
| Immediate feedback | Primary button switches to a **busy** state (`Loading…` accessible 
name, `aria-busy` on the advice region). Do not blank the whole page. |
| Avoid full reload | Replace advice in place. Keep age, header, footer. Use history API only if a 
later technical phase wants shareable session URLs — default is **no URL change per piece** in 
MVP . |
| No accidental duplicates | Session holds IDs (or tokens) of shown advice **for this age**. Next 
request excludes them. Changing age starts a separate seen-list for the new age. Returning to a 
previous age may restore that age’s seen-list for the session. |
| Age preserved | Age context line does not reset. |
| Exhausted pool (S4) | Heading: `That’s all we have for age {n} right now.` Body: `You can change 
the age, or offer advice for someone else.` Primary becomes `Change age`. Secondary: `Offer 
advice`. Do not fake a repeat of the first item. |

| Server / DB error (S6) | Keep the **last successful advice** on screen. `InlineAlert`: `We couldn’t 
load another piece. Check your connection and try again.` Retry control. Do not empty the 
canvas. |
| First-load failure after age submit | No previous advice: show error on a still layout with `Try 
again` and `Change age`. |
| Rapid double-tap | Ignore while `aria-busy`. |
**Motion:** if motion is not reduced, a short crossfade (≤150ms) is optional. If reduced motion, 
instant swap. **No shuffle, flip, or slot.**
**Focus:** after successful next, move focus to the advice heading or the advice article 
(`tabindex="-1"`) so keyboard and SR users hear the new piece via focus + live region. Do not 
dump focus on the browser chrome.
### 5.4 Community contribution (S7)
#### Purpose
Let a visitor offer advice for an **age range**. Be explicit that humans (or a defined moderation 
process) review it, that publication is not guaranteed, that inappropriate content may be refused, 
and that personal information must not be included.
#### Fields (required conceptual set)

| Field | UI | Validation (UX) |
| --- | --- | --- |
| Minimum age | Label `From age` | Integer 10–100 |
| Maximum age | Label `To age` | Integer 10–100; **≥ minimum** |
| Advice text | Label `Advice` | Non-empty after trim; see provisional length in §9 |
**Soft default (C5):** if the visitor already selected an age, pre-fill `From age` and `To age` with 
that number (a single-year range). Helper: `You can widen this if the advice fits more than one 
age.` They may change both freely.
If they arrived from the footer without selecting an age, leave range empty.
#### Notices (visible before submit, not only in Terms)
Present as a short list, not a paragraph wall:
1. `Someone will review this before it can appear.`
2. `Sending it does not mean it will be published.`
3. `We may refuse advice that is harmful, spam, or against our guidelines.`
4. `Do not include names, contact details, locations, or other personal information — yours or 
anyone else’s.`

Link `guidelines` to S13 (public excerpt). Do not require a separate checkbox if the notices are 
adjacent and a later legal review does not demand explicit consent UI. If legal later requires a 
checkbox, use one clear checkbox: `I understand this will be reviewed and may not be published.` 
— never a pre-ticked box.
#### Copy constraints on the form
- Title: `Offer advice`
- Subtitle: `Write something you wish a person in this age range might hear. Keep it specific and 
human — not a slogan.`
- Submit: `Send for review`
- Cancel: `Back to advice` (if they had a session age) or `Back`
#### Not required in MVP
Account, email, display name, topic tags, country, “I am this age,” CAPTCHA on first view (see 
C6).
### 5.5 Submission result (S8)
After a successful send:

- Heading: `Received — thank you.`
- Body: `We’ll review what you sent. If it can be published, it may appear later for visitors in that 
age range. If it cannot, it simply won’t appear. We won’t email you about this.`
- Do **not** say “published,” “live,” “approved,” or give a countdown.
- Primary: `Back to advice` (restore session age and last piece) or `See advice` if they had not 
picked an age (send them to S1).
- Secondary: `Offer another piece` (returns to empty S7). Consider a short client-side cooldown 
message if they immediately return — optional, not a punishment.
### 5.6 Public-facing moderation states (no admin UI)
| State | Screen | Visitor-facing language | Must not say |
| --- | --- | --- | --- |
| Submission received | S8 | See §5.5 | “It’s up,” “Approved” |
| Submission rejected | S7 error **or** omitted for later human reject (C2) | Immediate 
automated: `This couldn’t be sent. Check the age range and that the advice isn’t empty.` Human 
later: **no public page in MVP** | “Your account is banned” (there is no account) |
| Advice reported | S10 then S2/S4/S5 | `Thanks. We’ll look at this.` Then remove that piece from 
the session | “This user will be punished”; public verdict |
| Advice temporarily unavailable | S5 | `This advice isn’t available right now.` Offer `Another piece 
of advice` and `Change age` | The moderation reason; “deleted for violating…” |
S5 is also used when a deep link (future) points at a withheld item.

---
## 6. Design system (preliminary)
This is a **token and behaviour** system, not a Figma file. Colour is direction-level (§11); 
structure below is shared.
### 6.1 Typography hierarchy
| Role | Approx. size (mobile) | Approx. size (desktop) | Weight | Use |
| --- | --- | --- | --- | --- |
| Display / advice | 1.5–1.75rem, line-height 1.4–1.5 | 2–2.25rem, line-height 1.4 | Regular | Advice 
body (dominant) |
| Page title | 1.5rem | 1.75–2rem | Semibold | Landing heading, form titles |
| Subtitle | 1.0625–1.125rem | 1.125rem | Regular | Explanatory paragraphs |
| UI / labels | 1rem | 1rem | Medium labels, regular body | Fields, buttons, notices |
| Context | 0.9375–1rem | 1rem | Regular | “Advice for age n.” |
| Footer / meta | 0.875rem | 0.875rem | Regular | Tertiary links; **minimum 0.875rem** |
**Floor:** body and advice never below **16px** (1rem) on mobile. Advice may be larger, not 

smaller.
**Line length:** advice 45–70 characters; UI paragraphs ≤ 65 characters.
**Font recommendations (not final licences)**
- **Advice / display:** a readable old-style or contemporary serif with good italic: *Source Serif 
4*, *Fraunces* (light optical size), or *Newsreader*.
- **UI:** a humanist or highly legible sans: *Source Sans 3*, *IBM Plex Sans*, or *Atkinson 
Hyperlegible* (strong accessibility choice).
- **Monospace:** not used in public UI.
Load at most **two families**. Prefer font-display: swap; avoid layout jump by reserving line-
height.
### 6.2 Spacing system
Base unit **4px**. Common steps: 4, 8, 12, 16, 24, 32, 40, 48, 64, 80.
- Between label and input: 8
- Between input and helper/error: 8

- Between intro and age field: 32
- Between advice and primary button: 32–40
- Page padding: 16 (narrow phones) / 24 (typical) / 32+ (large)
Do not mix an 8-point grid with random 10px gaps.
### 6.3 Border-radius philosophy
**Restrained and consistent.** Slight rounding reads modern without app-like “pills.”
- Controls and fields: **8px**
- Dialog: **12px**
- Advice canvas: **0–8px** (see visual direction; Quiet Paper prefers 0)
- **Never** fully rounded pills for primary buttons (too consumer-app / dating)
- **Never** mixed radii on one screen (16, 24, and 9999 together)
### 6.4 Page width
| Token | Value | Use |

| --- | --- | --- |
| `content-narrow` | **36rem** (576px) | Advice, landing, forms — reading measure |
| `content-wide` | **40–42rem** | Optional on large desktop only; do not stretch advice to 80rem |
| Shell | centred in the viewport | Side margins absorb extra width |
There is no multi-column dashboard.
### 6.5 Breakpoints
| Name | Width | Layout notes |
| --- | --- | --- |
| Small phone | ≥320 | Keep padding 16; steppers wrap under field if needed |
| Mobile (primary) | ≥375–430 | Default design target |
| Tablet | ≥768 | Same single column, more vertical air; still `content-narrow` |
| Desktop | ≥1024 | Column remains centred; do not add a sidebar of links |
| Large desktop | ≥1440 | Still one column; extra space is margin, not widgets |
Use `rem`-based breakpoints in implementation later; the table is the intent.

### 6.6 Button hierarchy
| Level | Look | Use |
| --- | --- | --- |
| Primary | Solid fill, high contrast with label, min height 44px, horizontal padding ≥16px | One per 
screen |
| Secondary | Outline or pale fill, same height | Offer advice, change age, retry |
| Tertiary | Text + optional icon, underline on hover, min 44px hit area | Share, report, legal |
Disabled: reduced contrast **and** `aria-disabled` or disabled + visible reason. Never disabled-
only grey without explanation if the visitor needs to act.
### 6.7 Input styling
- Box: 2px border, 8px radius, 12px 16px padding, min height 44px
- Background: solid (not glass)
- Label **above** the field, always visible
- Helper under field, `id` referenced by `aria-describedby`
- Error: border darkens/thickens **and** error text; `aria-invalid="true"`
- Do not use colour-only invalid (red border without text)

Age steppers: 44×44, same border language as the field, grouped with the input via `role="group"` 
and `aria-labelledby` pointing at the age label.
### 6.8 Card / advice styling
The advice is **not** a social card.
- No avatar, timestamp, or like row
- Prefer type on the page background (Quiet Paper) or a single bordered region with ample 
padding (Civic)
- If a surface is used: padding ≥24px; no heavy drop shadow
- Quotes: optional opening quotation is allowed if it does not look like a pull-quote ad; prefer **no 
decorative quotation marks** if they encourage slogan tone
### 6.9 Loading, empty, error (visual)
| State | Pattern |
| --- | --- |
| Loading | Keep chrome; advice region shows a short textual `Loading advice…` (not a skeleton 
shimmer that looks like a feed). Spinner only if it has an accessible name and is not the only 
indicator. |
| Empty (exhausted) | Honest heading + next actions (§5.3) |

| Error | `InlineAlert` with icon + text + retry. Keep prior content when it exists. |
### 6.10 Focus, hover, disabled
- **Focus-visible:** 2px solid ring, **offset 2px**, contrast ≥ 3:1 against adjacent background. 
Never `outline: none` without a replacement.
- **Hover:** slight background or underline on tertiary; primary may darken. **No hover-only 
information.** Touch devices must not depend on hover.
- **Disabled:**  opacity is not enough; include not-allowed cursor on pointer devices and an SR-
accessible name that includes the state when relevant.
- **Active/pressed:**  immediate; no 300ms delay (use proper viewport / touch-action later).
---
## 7. Responsive behaviour
Mobile is the **primary** design target. The core loop must work with **one thumb**.
### 7.1 Mobile
- Single column, intro short enough that the age field is in the first viewport on a common 667–
844px height **when the keyboard is closed**.

- When the numeric keyboard opens, the field and primary button should remain visible if 
possible (avoid giant intro images).
- Primary button **full width** of the content column.
- Tertiary share/report in a row with wrapping; each target ≥44px.
- Steppers: if the keypad is up, steppers still work when the user dismisses it.
- Safe-area insets respected (notch / home indicator).
- No horizontal scroll at 320px width.
### 7.2 Tablet
- Same structure, wider margins.
- Primary button **not** stretched to 768px; cap button width at ~24rem **or** keep full column 
if column is already `content-narrow`.
- Dialogs centred, max-width 28rem.
### 7.3 Desktop
- Mouse and keyboard first-class: Enter submits age; Tab order is intro  age  steppers  primary 
 footer.
- No hover-only primary actions.
- Do not add a two-pane “list of advice | reader” — that is a different product.

### 7.4 Large desktop
- Extra space is unused margin.
- Advice type may take the desktop size in the type table; it does not grow without limit.
### 7.5 Landscape phones
- Compress intro; keep field and CTA usable; avoid locking orientation.
---
## 8. Accessibility requirements
Target: **WCAG 2.2 Level AA** as the design floor. Some AAA choices (large text, Atkinson) are 
welcome where they do not harm the character.
### 8.1 Principles in practice
| Principle | Application |

| --- | --- |
| Perceivable | Text alternatives for any icon-only control; captions N/A (no video in MVP); 
contrast AA for text and UI components |
| Operable | Full keyboard path; no keyboard trap except managed dialog; targets 44px; no 
flashing |
| Understandable | Labels, consistent layout, error text that names the field and how to fix |
| Robust | Semantic HTML; honour browser zoom to 200% without loss of content |
### 8.2 Keyboard
- Tab order matches visual order.
- Age submit via Enter.
- Dialog: Tab cycles; Escape closes; focus returns to the control that opened it.
- Steppers are in tab order or grouped so the text field remains the fastest path.
### 8.3 Visible focus
Required on every interactive element. Custom components must expose focus appearance 
equivalent to native.
### 8.4 Screen readers

- Page titles change: `Age | {site}`, `Advice for age {n} | {site}`, `Offer advice | {site}`, `Submission 
received | {site}`.
- Advice is an `<article>` with a heading (`Advice for age {n}`).
- `aria-live="polite"` on the advice region for replacements.
- Errors in `role="alert"` or assertive live region.
- Icon buttons have accessible names (`Report this advice`, `Copy advice`).
- Decorative rules/backgrounds are `aria-hidden`.
### 8.5 Semantic HTML
Use `main`, `header`, `footer`, `form`, `label`, `button` (not `div` click). Do not fake buttons with 
clickable cards unless they have button semantics.
### 8.6 Input labels
Every input has a visible label. Placeholders are hints. Group min/max ages with a `fieldset` / 
`legend`: `Who is this advice for?`
### 8.7 Error messaging

- Identify the field.
- Describe what went wrong and how to fix it.
- Move focus to the first invalid field on submit.
- Do not use colour alone; include text and `aria-invalid`.
### 8.8 Reduced motion
Honour `prefers-reduced-motion: reduce`: instant content swap, no decorative animation, no 
parallax (there should be none anyway).
### 8.9 Contrast
- Body text ≥ 4.5:1
- Large advice text (≥18pt regular or 14pt bold) ≥ 3:1, but **prefer 4.5:1** anyway for serif at 
display size
- UI components and focus ring ≥ 3:1
- Placeholder text is not the only instruction
### 8.10 Touch targets

Minimum **44×44 CSS pixels** for age steppers, buttons, share, report, footer links (increase hit 
area with padding if type is smaller). Spacing between adjacent targets ≥ 8px where possible.
### 8.11 Readable text
Minimum 16px for input text (prevents iOS zoom on focus). Advice comfortably larger. Avoid 
ultra-thin font weights for body.
### 8.12 Other
- Language: `lang="en"` (international English).
- Do not auto-play sound.
- If a future cookie banner appears, it must be keyboard-accessible and must not obscure the age 
field without a way to dismiss or accept.
---
## 9. Interaction states
Documented per critical control.

### 9.1 Age field
| State | Behaviour |
| --- | --- |
| Empty | No error until submit/blur-with-intent |
| Typing | Accept digits; may strip leading zeros on blur except allow empty |
| Stepper min/max | Decrease disabled at 10; increase disabled at 100; field still editable |
| Invalid | Error text; `aria-invalid`; focus on submit failure |
| Submitting | Primary busy; field readonly or left enabled — **prefer leave enabled** so the visitor 
can correct after a failed first fetch |
### 9.2 Primary button
Default  hover  focus-visible  active  busy (spinner + name change)  disabled (exhausted, or 
in-flight).
### 9.3 Advice region
Idle  busy (next)  updated  error (sibling alert)  exhausted (replace region).
### 9.4 Share

Idle  (`Share` native sheet) or `Copy`  `Copied` (2s)  idle. Failure to copy: `Couldn’t copy. Select 
the advice text instead.`
### 9.5 Report dialog
Closed  open (focus first control)  submitting  S10  close  next advice attempt.
### 9.6 Contribute form
Pristine  editing  invalid fields  submitting  S8 or server error with values preserved.
---
## 10. Error states (catalogue)
| ID | Trigger | UI | Recovery |
| --- | --- | --- | --- |
| E1 | Age empty / out of range / not integer | Field error on S1 | Correct and resubmit |
| E2 | Network down on first advice | S6 in advice layout | Try again; change age |

| E3 | 5xx / database error on next | Alert on S2; keep text | Retry |
| E4 | 429 rate limit | `Please wait a moment before requesting another piece.` | Wait; button 
briefly disabled with countdown **text** (not a game timer aesthetic) |
| E5 | Empty pool | S4 | Change age; contribute |
| E6 | Item withheld | S5 | Next; change age |
| E7 | Contribute min > max | Field error on max (or group error) | Fix range |
| E8 | Contribute text empty / too short / too long | Field error | Edit |
| E9 | Contribute 5xx | Alert on S7; keep text | Retry |
| E10 | Contribute automated refusal (spam shape, PII detector, etc.) | Form-level alert: `This 
couldn’t be sent as written. Remove personal details and try again.` (keep generic; don’t expose 
detector rules) | Edit |
| E11 | Copy/share failed | Non-blocking message | Manual select |
| E12 | Report failed | `We couldn’t send the report. Try again.` | Retry; don’t claim it was sent |
| E13 | Session lost (age forgotten) | Treat as S1 | Re-enter age |
| E14 | JavaScript unavailable | Later implementation: form POST for age and contribute if 
possible; this spec **prefers** a working no-JS first load of S1. Next-without-reload may require 
JS. Document as progressive enhancement, not a Phase 1 build. | — |
Timeouts should feel like E2/E3, not a blank white screen.
---

## 11. Content presentation rules
### 11.1 How advice should look and read
Advice is displayed as **prose**, not as a branded quote tile.
- Sentence case. One to a few sentences. Specific > universal.
- Prefer a human speaking to **one person**, second person sparingly and without command 
voice (`You must…`).
- Allow quiet, practical, or bittersweet advice. Not every item is uplifting.
**Avoid on the canvas and in UI chrome**
- Excessive exclamation marks
- Generic inspirational clichés (“Live, laugh, love”; “Follow your dreams”)
- Manipulative intimacy (“I’m the only one who understands you”)
- Guaranteed outcomes (“This will make you rich / healed / successful”)
- Medical claims or treatment instructions
- Financial guarantees or investment tips as certainty
- Overly authoritative voice (“As science proves…”, “Never, under any circumstances…”) unless the 
content is a carefully scoped safety redirect written by editors

**Provisional length (C10):** design the advice canvas for **about 40–400 characters**. If a 
piece is longer, allow wrapping; do not truncate with “…” on the main screen. The content model 
uses the same range as a **writing/layout guide**; a locked API/database maximum is still 
**unresolved** (PRD U2). When that cap is decided, match the textarea max to it.
**Truncation:** none on S2. Exhausted/error messages stay short.
### 11.2 UI chrome voice
International English. Examples of preferred words:
- `advice` (uncountable): “a piece of advice,” not “an advice”
- `age` not `yo` or `yrs`
- `review` not `moderation team is crushing it`
- `visitors` not `users` in public copy
- `may` / `might` for uncertainty; avoid `will definitely`
Avoid US-only or UK-only slang (`awesome sauce`, `ta`, `gotten` is acceptable US but “have got” is 
clearer internationally). Do not assume `college` vs `university`, `soccer` vs `football`, `$`, or `MM/
DD`.

### 11.3 Safety lines
A single, calm line may appear in How this works / footer, not as a stamp on every advice:
`This is personal opinion, not professional advice. If you are in danger or in distress, contact local 
emergency services or a qualified professional.`
Do not turn the advice screen into a crisis hotline widget. Do not list country-specific numbers on 
every page (wrong number risk). How this works may say to seek **local** resources.
### 11.4 Sample advice (illustrative only, not a content library)
These show tone for layout testing:
- `If you can, keep one evening a week with nothing scheduled. Exhaustion often looks like a 
personality.`
- `Friendship at this age sometimes needs a calendar. Suggest a time instead of “we should hang 
out.”`
- `You do not have to have a five-year plan. You can have a next sensible step.`
Reject as tone samples: `BELIEVE IN YOURSELF!!!`; `Crush your goals, king.`; `Invest now or stay 
poor.`

---
## 12. Three visual directions
No logo. No final name. Directions are substantially different. Shared rules: no mesh gradients, 
no glassmorphism, no clutter, no generic indigo-on-white SaaS dashboard.
### Direction A — “Quiet paper”
**Emotional character:** A letter on a desk. Editorial, warm, unhurried, adult without being 
exclusive.
**Typography:** Serif for advice (*Source Serif 4* or *Fraunces* at a text optical size). Humanist 
sans for UI (*Source Sans 3*).
**Visual language:** Ink on paper. Hairline rules. Almost no icons; if icons exist they are simple 
strokes, not filled stickers.
**Background:** Solid warm off-white (`#F4EFE6` range). Optional **very** light paper grain at 
≤3% opacity; none if it hurts contrast.
**Card approach:** No card. Advice sits in the column like a book paragraph. A 1px rule above 
the age context is enough.

**Button approach:** Rectangular 8px radius, dark ink fill, off-white label. Secondary is ink 
outline.
**Advantages:** Distinct from chat, dating, and startup kits. Matches “human note.” Excellent for 
long-term trust. Photograph-free, so no stock-photo uncanny valley.
**Disadvantages:** Can read “old magazine” if serif is too decorative. Dark environments (night 
phone) may feel glare-y unless a later dark variant is added. Younger visitors may expect more 
“app.”
### Direction B — “Lamp hour”
**Emotional character:** A quiet conversation after the rest of the house is asleep. Intimate, 
contemporary, serious.
**Typography:** High-contrast serif for advice (*Newsreader*). Neutral grotesque for UI (*IBM 
Plex Sans*).
**Visual language:** Dark field, one warm accent (lamp amber) used only on the primary button 
and focus ring. No stars, no city skylines, no bokeh.
**Background:** Solid deep blue-black (`#12141A` range). No gradient sky.

**Card approach:** Advice on a slightly lighter raised slab (`#1B1E27`) with a 1px low-contrast 
border. Padding generous. No blur.
**Button approach:** Amber primary, dark label (not white-on-yellow if contrast fails). Secondary 
is ghost (border in muted grey).
**Advantages:** Immediately not a content farm or LinkedIn. Feels modern. Strong focus on the 
words.
**Disadvantages:** Contrast and outdoor glare need care. Risk of “depression app” or sleep-
meditation aesthetic if amber and copy turn mystical. Iconography can accidentally look like a 
dating night-mode.
### Direction C — “Public desk”
**Emotional character:** A library enquiry desk or civic notice. Egalitarian, clear, slightly formal, 
anti-funnel.
**Typography:** *Atkinson Hyperlegible* for UI and, if needed, for advice; or Plex Serif for advice 
+ Atkinson for UI.
**Visual language:** Structure over atmosphere. 2px borders. Information hierarchy like a well-
set form. A single civic accent (teal or brick) **only** for primary actions.

**Background:** Plain `#FFFFFF` or `#F7F7F5`. No texture.
**Card approach:** Bordered box, 0–4px radius (more rectangular), title bar not needed. Looks 
like a form you can trust, not a product card.
**Button approach:** Rectangular, high contrast, 8px radius maximum. Primary uses the civic 
accent **only if** contrast AA is met; otherwise charcoal fill.
**Advantages:** Best accessibility story. Hardest to confuse with gambling or dating. 
International and institutional trust. Scales to legal pages without a theme break.
**Disadvantages:** Can feel bureaucratic or cold. Emotional meaning must come almost entirely 
from the advice prose. Risk of “government website 2012” if spacing is tight and grey is 
overused.
---
## 13. Recommended visual direction
**Recommend Direction A — Quiet paper — as the default visual language**, with **Direction C’s 
accessibility habits** (Atkinson or equivalent for UI if serif+sans pairing fails contrast; 44px 
targets; 2px focus offset; no colour-only state).

**Why A**
- Best match for calm, human, non-chat, non-funnel.
- Advice-as-prose is native to a paper metaphor; cards are optional later.
- Sharing and contribution feel like passing a note, not posting content.
**What to borrow from C**
- Hyperlegible UI font if user testing shows serif UI labels fail.
- Strong borders on inputs (paper can go too faint).
- Honest empty/error states without illustration.
**Why not B as default**
- Strong character, but higher risk of mood mismatch (grief, insomnia) and contrast bugs. Keep B 
as a **documented alternate** if later research shows night-time use dominates.
**Implementation note (future):** tokens should map `canvas`, `ink`, `ink-muted`, `action`, 
`action-text`, `danger-text`, `focus` so a B theme could swap later without layout changes. Do not 
build two themes in MVP .

---
## 14. SEO implications (do not implement)
The reading experience is **session-based** (age in session, random piece, next). That is a poor 
match for thousands of indexable URLs.
### 14.1 What not to do
- Do not generate `/age/10` … `/age/100` as 91 thin pages that only wrap the same app shell.
- Do not index `?age=27&item=…` random draws.
- Do not auto-publish a permalink for every community submission.
### 14.2 Viable future surfaces (small, editorial)
| Surface | Role | Duplicate-thin risk | Recommendation |
| --- | --- | --- | --- |
| Homepage | Explains product; age tool | Low if unique intro | Index |
| Life-stage pages | e.g. “Advice around the teenage years,” “Advice in midlife” — **ranges**, not 
each integer | Low if hand-written intros | Few pages, editorial |
| Topic pages | Taxonomy exists for operators (`docs/content/content-taxonomy.md`); not a 

visitor navigation IA in MVP | High if auto-tag dumps | Manual collections only; do not implement 
now |
| Advice permalinks | One URL per **curated** piece | Low if curated; high if all items | Opt-in after 
moderation + uniqueness review |
| Editorial collections | “On starting over,” “On friendship” | Low | Good long-term |
| Age landing pages | One URL per integer | **Very high** | Avoid as a programme; maybe 3–4 
“round” ages only if they have unique essays |
### 14.3 Technical intent (later)
- Canonical homepage for the interactive tool.
- `noindex` on session result states if they ever get URLs.
- If permalinks exist: unique title from a truncated unique sentence **plus** editors’ title; unique 
meta description; no keyword-stuffed “advice for 27 year olds cheap.”
- Sharing in MVP does not require these URLs.
---
## 15. Mobile UX requirements (checklist)
- [ ] Age field usable in portrait with thumb; steppers 44px
- [ ] Number pad does not hide the only CTA without scroll

- [ ] One primary action visible without hunting
- [ ] Advice readable at arm’s length; user can zoom
- [ ] Next advice does not require two-handed keyboard
- [ ] Contribute: range fields side by side **only if** each stays 44px and ≥16px font; otherwise 
stack
- [ ] Textarea large enough for at least four lines before inner scroll
- [ ] Sticky legal banners do not cover primary actions
- [ ] Landscape still completable
- [ ] No hover-only share
- [ ] Web Share or copy without leaving a broken in-app browser trap (copy always available)
- [ ] Offline/error recoverable with one tap
- [ ] Dynamic type / OS font scaling: layout does not clip advice
---
## 16. Future extensibility (UX only)
Design the **information architecture** so these can be added without painting the product into 
a feed:

| Possible later | How not to block it | How not to leak it into MVP |
| --- | --- | --- |
| Named product + logo | Header is a text wordmark slot | No illustrative logo exploration in UI 
copy |
| Dark theme (Lamp hour) | Semantic colour tokens | No theme switcher now |
| Editorial permalinks | Advice canvas can become a page | No “Copy link to this card” as a 
growth loop |
| Life-stage SEO pages | Footer can add a short “Read more” later | No related-grid on S2 |
| Accounts | Session age remains valid for anonymous visitors | No “Sign in to see more” |
| Topics | Contribution stays range + text | No tag picker now |
| Translations | All copy in resource strings; `lang` | No machine-translate widget |
| Crisis localisation | How this works page can grow | No geo-IP popups on advice |
| Rate limits / CAPTCHA | Error catalogue E4/E10 | No visible “security theatre” on landing |
| Saved “pieces I liked” | Would need consent + storage model | No heart button now |
If a future feature requires persistent identity, it must remain **off the primary path**.
---
## 17. Screen-by-screen copy deck (MVP public)

Placeholder site name in titles: `the site` until naming.
**S1 heading:** `Advice for the age you are.`  
**S1 body:** `Enter an age from 10 to 100. We’ll show one piece of advice for that time of life. 
You don’t need an account.`  
**S1 why:** `Age helps us choose something relevant. We don’t use it to identify you.`  
**S1 label:** `Age`  
**S1 primary:** `See advice`
**S2 primary:** `Another piece of advice`  
**S2 secondary:** `Offer advice`  
**S2 change:** `Change age`  
**S2 share:** `Share` / `Copy advice`  
**S2 report:** `Report this advice`
**S4 title:** `That’s all we have for age {n} right now.`
**S5 title:** `This advice isn’t available right now.`
**S7 title:** `Offer advice`  

**S7 submit:** `Send for review`
**S8 title:** `Received — thank you.`  
**S8 body:** see §5.5
**S9 title:** `Report this advice?`  
**S9 body:** `We’ll review it. This won’t notify a public audience.`  
**S9 confirm:** `Send report`  
**S9 cancel:** `Cancel`
**S10:** `Thanks. We’ll look at this.`
---
## 18. Decisions locked in this phase
1. Numeric age field + steppers; **no slider**.
2. Age validation **10–100** inclusive, integers only.
3. Advice-dominant single column; max content ~36rem.

4. Next advice is in-place, session-deduplicated, with exhausted and error states.
5. Contribution is a separate screen; no account; honest review copy.
6. Success ≠ publication.
7. No public admin UI; four public moderation *meanings* as specified, with rejection-after-the-
fact **not** a personal inbox (C2).
8. Share is tertiary; copy + optional Web Share; no social glyph row.
9. Visual default: **Quiet paper**, with Public desk accessibility habits.
10. SEO is editorial and sparse, not per-age thin pages.
11. International English; no currency or date UI in MVP public flow.
12. No product name or logo.
---
## 19. Decisions that must be made before coding
These are **blockers or near-blockers** for a faithful implementation. They are not resolved here. 
Phase 0 now exists in-repo (`docs/product/product-requirements.md` U1–U20 and the files in 
§0.1). Cross-check C1–C10 against that list before coding; **do not treat this reconciliation as 
closing those items.**
1. **Read Phase 0 in this repository** before implementation (`AGENTS.md`, PRD, architecture, 
privacy, content model). Remaining open items are still open.

2. **C1 / U1 — children:** Confirm whether ages 10–12 (or 10–15) may use the tool, see which 
advice, and submit. UX will not change the 10–100 range until product/legal says so.
3. **Session mechanics (U7):** How seen-IDs are stored (memory, cookie, server session), TTL, 
and privacy alignment.
4. **Advice identity:** What token the UI sends for “not this one again” and for report — 
architecture owns this.
5. **Provisional 40–400 character limit vs locked max (U2).** Content model does not lock a 
database constraint yet.
6. **Whether editorial vs community must be labelled on S2 (U4).**
7. **Legal (U12):** cookie banner, privacy policy URL, terms, guideline page source of truth.
8. **Whether a checkbox is required** on contribute (U12).
9. **Rate limits (U11)** and whether E4 copy needs a specific wait.
10. **No-JS** posture for first paint and contribute POST (U18).
11. **Focus of first-load vs next-load** if the random endpoint is slow (timeout numbers).
12. **Product name (U15)** (wordmark slot) — still not chosen, but engineering will need an 
HTML title.
13. **Font licensing (U20)** for the recommended pair.
14. **Report reason taxonomy (U8)** (closed list vs free text) — keep closed if implemented; list 
not invented here beyond “harmful / spam / other.”
15. **Dark mode (U16):** out of MVP unless engineering tokens are free.
---

## 20. Phase boundary
This document and `docs/product/design-principles.md` are the Phase 1 deliverables.
**Do not** initialise an application, install packages, create tables, or build components on the 
basis of this phase alone.
