# Quiet Paper — Editorial Content Specification

**Status:** editorial source of truth  
**Kind:** documentation only  
**Does not** close U1–U20.  
**Does not** implement UI, schema, authentication, or a corpus.

This file governs how editorial advice is written, reviewed, approved, imported, and withdrawn. It does not replace product, architecture, security, or moderation documents. Where this file and `docs/content/moderation-guidelines.md` overlap on safety, the **stricter publication rule** applies.

Related documents:

- Content model: [`advice-content-model.md`](./advice-content-model.md)
- Optional topics: [`content-taxonomy.md`](./content-taxonomy.md)
- Operator safety rejects: [`moderation-guidelines.md`](./moderation-guidelines.md)
- Public selection: [`../architecture/random-advice-system.md`](../architecture/random-advice-system.md)
- Importer: [`../development/phase-4-editorial-import.md`](../development/phase-4-editorial-import.md)

---

## 1. Purpose

Quiet Paper offers short, human life advice matched to an age the visitor enters (10–100). Editorial content is the founder-reviewed library, distinct from community submissions.

This specification defines:

- What counts as good advice
- Voice and style
- How age targeting works **editorially** (without extra database systems)
- Topics to include, handle carefully, or refuse
- Quality, duplication, authorship, and approval
- How ages 71–100 should be treated later (wisdom-sharing, not conventional advice)

It does **not** create the advice library, change migrations, or change the public AGE → ADVICE → NEXT application.

---

## 2. Definition of Good Advice

A valuable piece preferably is:

- Practical
- Tailored to a specific situation
- Empowering rather than controlling
- Grounded in genuine lived experience where possible
- Emotionally mature
- Thought-provoking
- Useful enough that the reader can apply it or sit with it

Advice should help the reader **make their own decision**. It should not merely order them what they must do.

Preferred reader reactions:

- “I hadn’t thought about it that way.”
- “That’s actually useful.”
- “I needed to hear that.”
- “That gives me something to think about.”
- “That’s uncomfortable but probably true.”
- “Someone might as well have gone through this before me.”

Reject writing that exists only to sound profound.

---

## 3. Editorial Voice and Writing Style

Voice: **a thoughtful friend**.

Aim for:

- Calm
- Direct
- Intelligent
- Warm but not sentimental
- Honest rather than motivational
- Thoughtful and grounded
- Human and considered

Avoid:

- Preaching and moral superiority
- Excessive optimism and motivational-speaker language
- Empty inspiration, clichés, generic self-help
- Artificially profound writing
- Condescension
- Fear-based persuasion

Match existing product voice: ordinary, specific, limited. No stacked exclamation. No guaranteed outcomes. International English (see §19).

---

## 4. Age Targeting Model

### 4.1 Technical model (do not replace)

The database already stores:

- `minimum_age`
- `maximum_age`

Integer ages **10–100**, with `minimum_age ≤ maximum_age`.

**Keep this model.** Do not add age-category tables, life-stage enums, or 91 per-age catalogues.

Any continuous inclusive range the schema allows is valid when the advice genuinely applies throughout it (for example 21–35).

### 4.2 Editorial guidance only

The following bands are **planning aids** for writers and reviewers. They are not separate systems and must not be stored as extra schema.

**Individual / life-stage bands (editorial):**

| Band |
| --- |
| 10–12 |
| 13–15 |
| 16–18 |
| 19–22 |
| 23–26 |
| 27–30 |
| 31–35 |
| 36–40 |
| 41–50 |
| 51–60 |
| 61–70 |

**Life-stage concepts (approximate, editorial only):**

| Concept | Approximate ages |
| --- | --- |
| Adolescence | 11–18 |
| Youth | 14–18 |
| Emerging adulthood | 18–24 |
| Prime adulthood | 25–34 |
| Middle adulthood I | 35–49 |
| Middle adulthood II | 50–64 |
| Senior adulthood | 65–74 |

Map every published item to **one** `minimum_age` / `maximum_age` pair. Do not invent a third technical age system.

U1 (minors / production launch) remains **unresolved**. Editorial targeting of ages 10–12 does not close that legal question.

---

## 5. Age-Specific Editorial Guidance

Advice should be strongly age-specific where appropriate. Prefer a narrow life situation over generic counsel that could apply equally to everyone.

These themes are **guidance**, not mandatory quotas or public category labels.

| Ages | Editorial emphasis |
| --- | --- |
| 10–15 | Identity, emotional literacy, critical thinking, normalising change, friendship, confidence, social pressure, character |
| 16–20 | Self-discovery, emotional resilience, budgeting, time, emotional regulation, independence, education, relationships, uncertainty, personal responsibility |
| 21–25 | Money habits, career exploration, healthy habits, sleep, boundaries, long-term decisions, independence |
| 26–30 | Health, career, family, time, selectivity, leaving unhealthy relationships, mental/emotional wellbeing |
| 31–35 | Purpose, relationships, mortality, legacy, adaptation, gratitude, responsibility |
| 36–40 | Preventative maintenance, stress, accepting present realities rather than idealised youth timelines, defining legacy, overall health |
| 41–45 | Preventative wellness, estate planning (jurisdiction-aware; see §19), lifestyle refinement, retirement preparation, long-term health, financial preparation |
| 46–50 | Financial consolidation, health optimisation, identity rediscovery, enjoyment, learning to laugh and enjoy life |
| 51–55 | Strength preservation, debt reduction, risk reduction, estate planning, joint/mobility health, long-term resilience |
| 56–60 | Insurance optimisation (no assumed national system), social connection, beneficiary review, less domination by external achievement, quiet autonomy, personal values, sustainable enjoyment |
| 61–65 | Health coverage/planning **appropriate to the reader’s country** (name the country if specific), long-term-care planning, daily routines, strength, social networks |
| 66–70 | Functional strength, cognitive fitness, retirement/benefit planning without assuming one country’s scheme, healthcare budgeting, community, volunteering, family, preventing isolation |

Do not hard-code country-specific programmes (for example a named national health insurance scheme) into general rules. Quiet Paper is international. Country-specific lines must name the jurisdiction.

Ages **71–100** are not given a conventional advice theme list here; see §6.

---

## 6. Ages 71–100: Wisdom-Sharing Experience

The founder does **not** want conventional AGE → ADVICE → NEXT to be the primary experience for visitors aged 71–100.

**Principle (later implementation; not built in this task):**

- Do not assume the visitor needs conventional life advice.
- Invite them to share something they have learned that might help younger people.
- Preserve dignity and autonomy.
- Feel respectful, not dismissive or patronising.

Concept (copy may be refined later):

> You’ve lived through experiences that younger people haven’t. Share something you’ve learned that might help them.

**Do not** use wording that assumes a person has “already lived their life to the fullest.”

Technical age support remains 10–100. This section is an editorial/product requirement for a later authorised phase. It does **not** change current application code, selection SQL, or the importer.

The initial conventional editorial corpus does **not** need to cover 71–100 as if it were another advice pool.

---

## 7. Length Requirements

| Layer | Rule |
| --- | --- |
| Editorial preference | Usually **1–3 sentences** |
| Engineering ceiling | **4,000 characters** (unchanged; I6 / importer / database check) |
| Product length lock (U2) | **Still unresolved.** This file does **not** set a new product-level maximum |

Longer than 1–3 sentences needs a genuine reason. Do not treat the 4,000-character ceiling as a target. Do not treat Phase 1’s provisional ~40–400 character UX guide as a new hard product limit.

---

## 8. Editorial Topics

Possible subject areas (not a required taxonomy, not equal distribution, not visitor-facing navigation):

Relationships / love; friendship; family / marriage / parenting; career / work; money; education; failure; grief; regret; success; ambition; confidence; self-respect; loneliness; decision-making; time; ageing; health / lifestyle; creativity; learning; technology; social pressure; identity; character; retirement; meaning; purpose; death; mortality; personal responsibility; emotional maturity.

Category remains **optional** in the data model. Do not require a topic picker. Do not require every topic to have the same number of items.

---

## 9. Prohibited Content

Do not promote or normalise:

- Political or religious persuasion
- Extremist ideology
- Medical diagnosis or treatment
- Illegal activity
- Financial guarantees
- Sexual content involving minors (zero tolerance)
- Hate or discrimination
- Self-harm encouragement
- Dangerous instructions
- Manipulation or coercion
- Guaranteed life outcomes
- Magic
- Pseudoscience presented as fact

Also reject content that creates a **materially unsafe interpretation** even if it is not named above.

Operator `moderation-guidelines.md` remains in force (including personal information, off-platform solicitation, scams, and sexual content involving minors). Editorial approval cannot override those hard rejects.

---

## 10. Sensitive Subjects

Sensitive subjects are **not** automatically banned. Examples: death, divorce, abuse, addiction, mental health, sexual relationships, pregnancy, grief, serious illness, financial hardship.

Review for:

- Age appropriateness
- Safety
- Responsible framing
- Emotional maturity
- No harmful instructions
- No unsupported certainty
- Genuine usefulness

**Do not** impose a rule that sensitive topics are only allowed from ages 25–70. The chosen `minimum_age` / `maximum_age` determines appropriateness.

An item whose range includes children must be suitable for that youngest age (see moderation age-range honesty). Adult-only material must not include 10–17 in the range.

**Overlap with moderation guidelines:** those guidelines currently reject sexual content aimed at arousal and all sexual content involving minors. Editorial pieces about adult relationships must stay non-graphic, non-arousing, and inside those safety rules. This specification does **not** silently relax the operator reject list. If a later human decision changes that list, update both documents together.

---

## 11. Age Specificity Rules

**Primary rule:** advice should be meaningfully age-specific.

Prefer addressing:

- A particular age-related problem
- A particular life stage
- A particular life transition
- A situation especially relevant to that age

Universal advice is acceptable only when it has a legitimate reason to be useful **throughout the chosen range**.

Do not assign extremely broad ranges merely to increase how often the item can be selected.

A range such as 20–40 is allowed **only** when the advice genuinely applies across that whole span. Prefer narrower targeting when the insight is meaningfully age-specific.

Do not mark everything 10–100 unless it truly is.

---

## 12. Quality-Control Requirements

No editorial item should become `status = approved` without **human** editorial review.

Evaluate:

- Clear central idea
- Genuine usefulness
- Appropriate and honest age range
- Practical or thought-provoking value
- Emotional maturity
- Originality
- Grammar, clarity, concision
- No clichés, filler, or unnecessary repetition
- No unsupported certainty
- No manipulative framing or excessive preaching
- No generic motivational filler
- No harmful instructions
- Appropriate handling of sensitive material
- Quiet Paper tone
- Genuine relevance to the selected range

Reject writing that merely sounds wise without useful insight.

---

## 13. Duplicate Detection

Check for:

1. Exact duplicates
2. Obvious paraphrases that convey **substantially the same advice**

Do **not** treat shared topic keywords as automatic duplicates. Two items may share a topic if they offer genuinely different insights.

The importer already skips exact body + age-range matches (and supplied UUID collisions). Editorial review still catches paraphrases the importer will not.

---

## 14. Corpus Size and Coverage

**Planning ranges** (quality first; not a licence to fill quotas with weak items):

| Ages | Planning coverage |
| --- | --- |
| 10–20 | about 10–30 pieces per relevant age/range |
| 21–49 | about 20–40 pieces per relevant age/range |
| 50–70 | about 10–30 pieces per relevant age/range |
| 71–100 | wisdom-sharing experience; **no** conventional advice corpus required for initial launch |

Do **not** interpret this as hundreds of separate pieces for every integer age immediately. Build progressively. After import, popular ages should have more than one item so “next” is real — without manufacturing near-duplicates.

Do not generate the corpus in this repository in this task.

---

## 15. Broad Age Ranges

One item may cover a broad range (for example 20–40) **only** when it is true across the entire range.

Do not use breadth to game random selection. Prefer narrower targeting when the advice is age-specific.

---

## 16. Authorship and AI Assistance

Hybrid production:

- Founder-written items
- AI-assisted or AI-drafted text that receives **human** editorial review

AI output is **not** automatically editorial. Editorial means: **a human reviewed and approved it for publication.**

AI may help with ideation, drafting, rewriting, optional categorisation, age-range suggestions, and duplicate detection. Final responsibility stays human.

This does not authorise generating the founder library into Git, nor adding AI into the public product loop.

---

## 17. Editorial Approval and Removal

Existing technical fields (do not add a new status):

| Field | Values |
| --- | --- |
| `source_type` | `editorial`, `community` |
| `status` | `pending`, `approved`, `rejected`, `flagged` |

Editorial publication:

- `source_type = editorial`
- `status = approved`
- only after human editorial approval
- importer forces those values plus `published_at`; it must not be used to skip human review of the real library

Community submissions remain `community` + `pending` until separately approved. This file does not change that path.

**Removal:** do **not** require physical deletion when an approved editorial item is no longer considered useful. Move it **out of public eligibility** with the existing status model (typically `rejected` for editorial withdrawal). Do not invent a new status. Do not treat `flagged` as the default withdrawal tool (`U6` is unresolved).

Automatic deletion/retention jobs are out of scope (`U9` / `U13` remain open).

---

## 18. Public Eligibility

Public selection remains:

- `status = approved`
- `minimum_age ≤` requested age `≤ maximum_age`
- session exclusion of already-seen IDs
- uniform random choice
- no recycling when the remainder is empty

`source_type = editorial` is **not** enough by itself. Pending, rejected, and flagged items are never selected.

This specification does **not** change `pick_public_advice` or application selection code.

---

## 19. International Audience Considerations

Quiet Paper is for an international audience.

- Avoid unnecessary country-specific assumptions.
- Do not assume a particular healthcare, tax, retirement, education, or legal system.
- If advice is country-specific, **name the jurisdiction**.
- Prefer broadly understandable language.
- Avoid slang that is hard to understand internationally.
- Copy and editorial text use clear international English.

---

## 20. Corpus-Building Principles

Optimise for:

- Quality over quantity
- Distinct insights
- Age relevance
- Human experience
- Practical usefulness
- Emotional maturity
- Variety of situations and perspectives
- Concision

Do not manufacture weak content to hit a number. Do not build a library of the same idea in slightly different words.

---

## 21. Editorial Review Checklist

Use one row (or one pass) per candidate item **before** `approved`.

| # | Check | Yes / no / n/a |
| --- | --- | --- |
| 1 | Is there a clear central insight? | |
| 2 | Is it genuinely useful — something to apply or think about? | |
| 3 | Would a likely reaction match §2 (useful, needed, thought-provoking) rather than “that sounds deep”? | |
| 4 | Is the `minimum_age`–`maximum_age` pair justified for the **whole** range? | |
| 5 | Is it age-specific enough (or, if broader, honestly universal in that range)? | |
| 6 | Is it usually 1–3 sentences, or is extra length justified? | |
| 7 | Under 4,000 characters? | |
| 8 | Does it sound like Quiet Paper (thoughtful friend: calm, direct, honest)? | |
| 9 | Free of preaching, clichés, motivational filler, and fake profundity? | |
| 10 | Original enough — not a paraphrase of an existing approved item? | |
| 11 | Safe: no prohibited content (§9), no unsafe interpretation? | |
| 12 | Sensitive material handled with maturity and an honest youngest age? | |
| 13 | Non-manipulative; no fear tactics; no unsupported certainty or guaranteed outcomes? | |
| 14 | Internationally understandable; jurisdiction named if the advice is local? | |
| 15 | Would a human editor approve this for publication? | |

If any of 1, 2, 4, 11, or 15 is “no,” do not approve.

---

## 22. Explicit Non-Goals

This document does **not**:

- Create the actual advice corpus or add it to Git
- Replace or rewrite database migrations
- Define or change Supabase schema, RLS, or `pick_public_advice`
- Define authentication, moderation UI, or an admin dashboard
- Define production deployment or Vercel
- Define legal policies (privacy, terms, COPPA/GDPR-K) or close **U1–U20**
- Change community contribution (`community` + `pending`) or public reporting
- Change rate limits
- Implement the 71–100 wisdom-sharing UI
- Introduce a new `status` value or require physical deletion of withdrawn editorial rows
- Introduce a new product-level character maximum
- Require equal category coverage or a visitor-facing taxonomy
- Authorise generating hundreds of thin advice entries to fill quotas
