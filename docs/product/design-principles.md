# Design principles
**Status:** Phase 1 — UI/UX definition  
**Scope:** Public visitor experience only. No product name, logo, or implementation.  
**Audience:** Designers, engineers, and writers implementing the first public slice.
These principles govern every public screen. If a later idea conflicts with them, change the idea, 
not the principle, unless product documentation is explicitly updated.
---
## 1. Purpose of the interface

The interface exists to do one thing well: help a visitor **name an age**, **receive one human 
piece of advice**, and **optionally ask for another** or **offer advice for someone else**.
Everything else is secondary. Secondary things must stay visually and cognitively quiet.
The site is not a destination to browse, compare, follow, or optimise a self. It is a brief, serious 
exchange.
---
## 2. Character
The product should feel:
- **Simple** — one primary action per screen
- **Calm** — no urgency, scores, streaks, or celebration confetti
- **Human** — like a thoughtful note, not a brand manifesto
- **Trustworthy** — plain language, honest limits, no hidden capture
- **Modern** — current typography and spacing, not nostalgic pastiche
- **Accessible** — usable with keyboard, screen reader, large text, and one hand
- **Mobile-first** — designed for a phone, expanded for larger screens

- **Fast** — perceived as instant; waiting is explained, never decorated
- **Emotionally meaningful without being manipulative** — respect the visitor’s inner life; do not 
manufacture a peak experience
It must **not** feel like:
| Avoid | Why it is wrong here |
| --- | --- |
| A social network | No profiles, feeds, followers, likes, or comments |
| A dating application | No photos of people, chemistry language, or pairing |
| A gambling / random-number toy | No spinning, slot motion, “roll again” energy, or luck framing |
| A generic AI chatbot | No bubbles, typing indicators as personality, or “ask me anything” |
| A self-help subscription funnel | No scarcity, upsell, email-first walls, or transformation promises 
|
| A content farm | No related-article grids, tags-as-navigation, or infinite skim |
---
## 3. Core principles

### 3.1 One question, then one answer
The landing screen asks for age because advice is age-relevant, not because the product is 
collecting a demographic. Say that out loud in the UI.
After age is given, the advice is the product. Surrounding chrome must not compete with it.
### 3.2 Honesty over persuasion
Copy tells the truth about:
- No account required
- Advice is one piece at a time, not a complete life plan
- Community submissions are reviewed and may never appear
- The service can fail, run out, or withhold content
Do not imply guaranteed outcomes, expert status, or that the next piece will be “better.”
### 3.3 Anonymity is a feeling as well as a policy

The visitor should never be nudged toward identity: no “sign in to save,” no public username on 
advice, no “people like you also…” social proof.
Sharing, if present, shares **the words**, not a persona.
### 3.4 Restraint is the visual brand
Prefer:
- Solid surfaces over atmosphere
- Typography over illustration
- One accent used rarely over a palette of highlights
- Margins over boxes
Avoid:
- Excessive gradients
- Glassmorphism
- Decorative blobs, mesh backgrounds, or particle fields
- Generic “startup SaaS” cards with drop shadows and pill buttons

### 3.5 Accessibility is not a layer
Contrast, focus, labels, error text, motion, and touch size are part of the design system, not a later 
audit. Meaning is never carried by colour alone.
### 3.6 International English, local humility
Write clear international English. Avoid slang, idioms, sports metaphors, and assumed holidays, 
currencies, schools, or family structures. Do not require a date format or locale-specific example 
unless the screen truly needs a date (MVP public UI should not).
### 3.7 Age is sensitive, not playful
Ages 10–100 include children, adolescents, and older adults. The control for age is a precise, 
labelled field, not a game. Tone around age is matter-of-fact. Do not joke about being “old” or 
“just a kid.”
### 3.8 Moderation is felt as safety, not as spectacle
Public UI may say that submissions are reviewed, that a report was received, or that a piece of 
advice is temporarily unavailable. It must not expose queues, scores, moderator identity, or why a 
specific person was rejected.

### 3.9 The advice voice is ordinary and specific
On-screen advice should read like something a thoughtful human would say to another human: 
concrete, limited, sometimes quiet. It is not a motivational poster, a diagnosis, or a command.
### 3.10 Session over account, page over feed
MVP interaction is session-based. The visitor’s age and recently seen advice persist for the visit 
(and no longer than product/privacy rules allow). The UI does not invent a profile to make this 
work.
---
## 4. Hierarchy of actions
On every screen, rank actions:
1. **Primary** — the reason the visitor is here (enter age, request next advice, submit 
contribution)
2. **Secondary** — optional, still on-path (offer advice, change age)
3. **Tertiary** — safety and legality (report, privacy, how this works)

4. **Absent** — anything that would make the page feel busy (stats, related content, accounts, 
ads)
Only one primary action is visually emphasised.
---
## 5. Emotional register of copy
| Do | Do not |
| --- | --- |
| “Advice for age 27.” | “Wisdom unlocked for a 27-year-old legend.” |
| “Another piece of advice.” | “Hit me with another!” / “Spin again.” |
| “We’ll review this before it can appear.” | “You’re live!” / “Thanks, it’s published.” |
| “This does not replace care from a qualified professional.” | Medical, legal, or financial 
guarantees |
| “You can use this site without an account.” | “Join thousands of members.” |
Punctuation: prefer periods. Avoid stacked exclamation marks. Questions are fine when they are 
real questions.

---
## 6. Motion and time
- Default to **no motion** beyond an immediate content swap.
- Honour `prefers-reduced-motion`: no crossfades, no sliding cards, no number ticking.
- Never animate randomness (shuffle, slot, dice, confetti).
- Loading is a short, labelled wait on the existing screen — not a branded splash.
---
## 7. Trust mechanics (visible)
Trust is built with:
- A short explanation of why age is asked
- A visible statement that no account is required
- Advice presented as **one person’s suggestion**, not platform law
- Contribution warnings about review, rejection, and personal data

- A way to report advice that feels harmful
- Stable, boring legal links in the footer — not a marketing banner
Trust is **not** built with testimonial carousels, user counts, or expert badges.
---
## 8. What this phase does not decide
- Final product name or logo
- Final colour tokens for production (three directions are proposed; one is recommended)
- Admin / moderator tooling
- Authentication, payments, or saved libraries
- Implementation stack
Those belong to later phases. These principles still constrain them.
---

## 9. How to use this document
Read this file for **judgment**. Read `docs/product/ui-ux-specification.md` for **screens, 
components, states, and the design system**.
If the two documents ever drift, update both in the same change.
