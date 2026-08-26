# Implementation architecture (planned)
**Status:** Phase 3A — planning only  
**Kind:** documentation only  
**Do not** scaffold Next.js, install packages, create tables, or write application code from this 
file.
This document translates approved product and architecture docs into **implementation 
boundaries** for a later agent. It does not replace:
- [system-architecture.md](./system-architecture.md)
- [data-model-proposal.md](./data-model-proposal.md)
- [random-advice-system.md](./random-advice-system.md)
- [moderation-system.md](./moderation-system.md)
- Product/UX/visual/screen specs under `docs/product/`

If those files and this one disagree, **stop** (`AGENTS.md`). Do not silently pick a side. Do not 
close **U1–U20** here.
**Recommended default** from system architecture (not installed): public reads and writes are 
**server-mediated**. The browser talks to **this application’s server**, not to Supabase with a 
service-role key.
---
## 1. Technology stack
Approved planned stack. **Do not install in this phase.** Do not swap frameworks. Do not pin 
versions here (system architecture).
| Technology | Role |
| --- | --- |
| **Next.js** | Single web application: screens, server-side validation, advice selection, 
contribution/report intake. App Router is **expected** when scaffolding starts (`README.md`) 
unless docs are updated first. |
| **TypeScript** | All application code when it exists (`AGENTS.md`). |
| **Tailwind CSS** | Map visual-design-system tokens to utility classes or CSS variables. One 
mapping, not a second palette. |

| **Supabase Postgres** | Single database for advice, statuses, reports. RLS on from the first 
table. |
| **Vercel** | HTTPS hosting of the Next.js app when deployed. |
| **GitHub** | Source remote; small PRs when implementation exists. |
**Supabase Auth:** only if operator authentication becomes necessary (**U17**). **Not** 
required to read or submit advice.
**Not in MVP stack:** queues, search products, AI APIs in the visitor loop, analytics vendors 
(**U10**), object storage (unless editorial import truly needs it), Redis, Kubernetes, extra CDNs 
beyond the host default.
### Unresolved library choices (do not add now)
| ID | Topic | Notes |
| --- | --- | --- |
| I1 | Server Actions vs Route Handlers vs mixed | Architecture prefers server mediation; **does 
not** lock REST vs Server Actions. Record at scaffolding. |
| I2 | Cookie signing library vs Web Crypto in-runtime | Only if session uses signed cookies 
(**U7**). Prefer platform crypto over a new package if adequate. |
| I3 | Test runner (e.g. Vitest / Playwright) | Choose when Phase 3I starts; do not install now. |
| I4 | Rate-limit store | In-process is enough for a single instance; multi-instance on Vercel may 
need a later store. **Do not** add a third-party abuse SaaS. **U11** remains open. |

Fonts (**U20**), CAPTCHA (**U11**), analytics (**U10**): not libraries to pick in this phase.
---
## 2. Application boundaries
```
Untrusted browser
     HTTPS  Next.js server (trusted for secrets, selection, inserts)
          Postgres (RLS + constrained grants)
Operator (later)  Supabase dashboard / SQL  (not a public app surface in MVP)
```
| Layer | Does | Does not |
| --- | --- | --- |
| **Browser / client** | Render screens; collect age, contribution, report confirm; optional client 
UX validation; hold or send session context as the **U7** mechanism requires; copy/share 
**text** | Select the public pool; approve content; hold service-role keys; render advice as HTML; 
create accounts |
| **Server** | Validate every mutation and every age used for selection; run eligibility + random 
pick; insert `pending`; insert reports; rate-limit; map failures to generic public errors | Trust client 
`status=approved`; log PII casually |

| **Database** | Persist advice, statuses, reports; enforce constraints and RLS | Be queried from 
the browser with a privileged key |
| **Moderation** | Human (or trusted operator process) sets `approved` / `rejected` / withhold 
(**U6**) | Auto-publish because validation passed |
| **Future operator** | Import editorial rows as approved; review pending; act on reports (**U17** 
how they log in) | A public “admin product” in MVP |
### Must NEVER happen in the browser
- Supabase **service-role** (or any DB secret) in client bundles, `NEXT_PUBLIC_*`, or repo
- Client-side “download all advice and pick at random” as the security boundary
- Setting moderation status from a public form field
- `dangerouslySetInnerHTML` (or equivalent) for advice bodies
- Inventing a visitor User/Profile because they typed an age
### Preserve
- No account to read advice
- Age is **request/session context**, not a profile
- Community inserts start **`pending`**
- Pending cannot be selected for the public

- Advice bodies render as **text**
---
## 3. Next.js structure (conceptual)
**Do not create these directories now.** One Next.js app at the repo root (or a single agreed app 
folder at scaffold time). Keep it small.
```
(future)
app/                         # App Router routes / screens
  page                       # Landing / age (S1)
  advice/                    # Advice screen (S2) or same route with state — I5
  contribute/                # S7–S8
  how-this-works/ etc.       # S11–S13 placeholders
  (server actions or route handlers)  # I1
components/                  # Header, footer, age field, buttons, advice region, dialog
lib/ or src/
  validation/                # Age, range, contribution, report — shared, used on server

  domain/                    # Eligibility predicate, pick-one, exhausted outcome
  data/                      # Server-only Supabase client; queries
  session/                   # Read/write seen-ids + age per U7
styles / tailwind config     # Token mapping
tests/                       # Unit + later e2e
```
| Category | Belongs |
| --- | --- |
| App routes / pages | `app/` matching screen spec S1–S13; **not** `/age/10`…`/age/100` |
| Reusable UI | `components/` aligned to screen-spec hierarchy |
| Server data access | `lib/data/` **server-only** (never imported from client components that 
ship secrets) |
| Validation | `lib/validation/` callable from server entrypoints; client may reuse **pure** functions 
for UX |
| Domain logic | `lib/domain/` selection rules; no I/O |
| Utilities | Tiny helpers; no grab-bag |
| Configuration | env documented in §16; no committed secrets |
| Tests | beside modules or `tests/`; invariants from testing-strategy.md |
Do not add a second app, a CMS, or a microservices folder tree.

**I5 (new):** whether advice is a separate URL or client state on one route is **not** locked. UX 
default: **no URL change per piece** in MVP . Scaffolding should prefer **in-place replacement** 
on the advice view.
---
## 4. Request flows
Trusted boundary for all four: **Next.js server**. Untrusted: anything from the browser, including 
hidden fields and cookies the client can edit unless signed (**U7**).
### 4.1 Initial age submission
```
Browser: age integer (untrusted)
   Client UX check (optional)
   Server: validate 10–100 integer
   Domain: eligible set (approved, in range, not withheld U6, not in seen-set)
   Pick uniform random among remainder OR exhausted
   Response: { age, adviceId, body } or empty/error

   Render S2 or S4 or S6
```
| Concern | Spec |
| --- | --- |
| Auth | None |
| DB | Read eligible rows only; never return pending/rejected/internal notes |
| Success | One body as text + id for session exclusion |
| Failure | Generic load error; do not leak SQL |
### 4.2 Next advice
```
Browser: age + seen identifiers (untrusted unless server session / signed cookie)
   Server: re-validate age; treat seen-list as a hint to exclude, not as a grant
   Same eligibility; exclude ids already shown this session for this age
   Random among remainder or exhausted
   Update session seen-set
```

| Concern | Spec |
| --- | --- |
| Auth | None |
| Double-submit | Ignore while in-flight (UX); server still idempotent-enough (same remaining 
pool) |
| Failure | **Keep last successful body** in the UI; generic retry (S6) |
| Exhausted | Explicit empty outcome; **do not** recycle (U5) |
If seen-ids are client-supplied, a visitor can only **hurt themselves** (repeats or skips). They 
must **not** be able to mark items approved or fetch pending rows.
### 4.3 Contribution
```
Browser: minAge, maxAge, body (untrusted). Ignore extra fields (email, status).
   Server validate range + non-empty trim + length cap (provisional until U2)
   Optional cheap policy checks (empty, obvious size) — **not** publish
   INSERT advice status=pending, source=community
   Public success: received for review (S8)

```
| Concern | Spec |
| --- | --- |
| Auth | None |
| Authorization | Cannot set `approved` |
| DB | Insert pending only |
| Automated refusal | Form error (E10); not a moderation verdict page |
| Human reject later | No public page (C2); retention **U13** |
### 4.4 Report
```
Browser: adviceId + optional closed reason (untrusted)
   Server: validate id exists and is a plausible public item; validate reason if a list exists (U8)
   INSERT report
   Generic thanks (S10)
   Session: do not show that id again
```

| Concern | Spec |
| --- | --- |
| Auth | None |
| Output | No “user punished”; no internal flags |
| Visibility of item | **U6** — public pool withhold vs keep until human; session hide is UX-
required |
---
## 5. Validation architecture
**Client validation is UX, not security.** Every mutation and every selection age is validated **on 
the server**.
| Input | Server rules |
| --- | --- |
| Age | Integer, **10–100** inclusive |
| Min / max age | Integers 10–100; min ≤ max |
| Advice body | Trimmed non-empty; **U2** exact min/max unresolved. Before go-live, 
implementers must still set an **explicit** absolute max so the API cannot accept megabytes; 
label it provisional if it is not the product lock |

| Contribution payload | Only min, max, body; **strip/ignore** unknown keys including `status`, 
`source`, `email` |
| Report payload | Advice id required; reason only if a closed list is adopted (**U8** — do not 
invent taxonomy here) |
| Session identifiers | If cookies: verify signature/expiry; never trust a client `approved=true` |
Reject unexpected fields. Do not echo them back.
**I6 (new):** numeric **byte/char ceiling** used as an engineering backstop until U2 is decided 
— must be written down at implement time, not left as “unlimited.”
---
## 6. Random advice architecture
Translate [random-advice-system.md](./random-advice-system.md). Logic lives on the 
**server**.
**Eligibility (all must hold):**
1. Status is **approved** (not `pending`, not `rejected`).

2. Not withheld if **U6** uses a withhold/flag that removes from the pool.
3. `minimum_age ≤ requested_age ≤ maximum_age`.
4. Id not in this session’s seen-set **for this age**.
**Then:** if remainder empty  **exhausted** (honest). Else **uniform random** among 
remainder (MVP).
**Must not:**
- Select pending community rows
- Download the library to the client as the picker
- Silently recycle seen items (U5)
- Apply **engagement weighting** in MVP (**U19**)
Editorial and approved community share **one pool**. **U4** is display-only.
Return **id + text** (and age). Do not return internal notes, reporter lists, or status fields the UI 
does not need.
---

## 7. Session architecture
**U7 is unresolved.** Options (architecture, not a lock):
| Option | Age + seen-ids | Account? |
| --- | --- | --- |
| Memory only | Lost on refresh | No |
| `sessionStorage` | Tab-scoped; client-visible | No |
| HTTP-only **signed** cookie | Server can trust seen-set better; still **not** a login | **No** — 
distinguish from a visitor account |
| Server session store | Heavier; still anonymous | No |
**Recommendation when implementing (not a product close of U7):** prefer a **short-lived, 
HTTP-only, Secure, SameSite** signed cookie or server session for seen-ids **if** CSRF is 
handled (same-site POST / Server Actions pattern documented at implement time). If a cookie is 
used, it is **session context**, not identity. Do not create a `users` table for visitors.
- Change age: separate seen-list per age (UX).
- Report: hide that id in-session regardless of U6.
- Contribution success: no contributor login state.
- TTL: **U9**.

- CSRF: if credentialed cookies, follow security-requirements §5.
---
## 8. Database boundaries
**Do not write SQL here.** [data-model-proposal.md](./data-model-proposal.md) is authoritative. 
Do not redesign the schema.
| Logical entity | Important concepts | Public readable | Notes |
| --- | --- | --- | --- |
| **Advice** | id, body, min/max age, source editorial\|community, status, optional category, 
timestamps, optional published_at | **Only** approved + not withheld bodies/ids/ranges needed 
for display | Community starts pending. No author PII |
| **Category** | name/slug | Not required on public MVP screens | Optional on advice (U3 
decided optional) |
| **Report** | advice id, time, optional reason, handling state | **Never** public | Reporter identity 
**U8** |
| **Moderation metadata** | reviewed at, decision, internal note | **Never** public | |
| **Import** | editorial bulk load | Not a public table | Trusted operator path  approved |
| **Session** | seen ids, age | Not necessarily a table (**U7**) | Must not become accounts |
| **Counters** | optional select/report aggregates | Not visitor-facing | No clickstream of people |

**Flagged (U6):** either a status value or a separate withhold flag — **one** source of truth at 
implement time (**I7**).
Rejected row retention: **U13** (model must allow delete or keep).
---
## 9. Supabase security / RLS
Enable **RLS** on the first real tables.
| Actor | Intended access |
| --- | --- |
| Anonymous visitor | **No** direct privileged DB from the browser. If anon key is ever used in the 
client, it must **only** be able to do what RLS allows — default is **no client DB**. Public data = 
approved bodies via **server** |
| Contributor | Same as visitor; insert only through server as `pending` |
| Moderator / operator | Supabase dashboard / SQL with **their** operator credentials (**U17**), 
not a hidden URL on the marketing host |
| Service role | **Server-only** (or operator cloud, never the browser). Tight queries; strip hidden 
columns before JSON to the client |

Policies must ensure: public cannot read `pending`/`rejected`/notes; public cannot `UPDATE` 
status to approved; public cannot read reports.
Bypassing RLS with the service role **in the browser** is forbidden.
Do **not** create policies in this phase.
---
## 10. API / server-action boundaries
**I1 unresolved:** REST Route Handlers vs Server Actions vs both. Either is acceptable if:
- Input is validated on the server
- Service role stays server-side
- CSRF/cookie story is explicit
Conceptual public operations:
| Operation | Input | Output | Auth | DB | Rate limit | Errors |

| --- | --- | --- | --- | --- | --- | --- |
| Obtain advice | age | one item or exhausted | none | read eligible | yes (abuse) | validation / 
generic 5xx |
| Next advice | age + session | one item or exhausted | none | read eligible | yes | keep previous on 
5xx |
| Submit contribution | min, max, body | received | none | insert pending | yes | validation / E10 / 
5xx |
| Submit report | advice id [, reason] | thanks | none | insert report | yes | validation / 5xx |
No public `approve`, `listPending`, `getReports`.
---
## 11. Rate limiting / abuse
**Server-side.** Anonymous visitors are not unlimited.
| Path | Why |
| --- | --- |
| Contribute | Spam / pending-queue flood |
| Report | Report-bombing (**U6** must not let attackers hide all content without review) |

| Advice / next | Scrape-all / cost / annoyance |
**U11:** exact numbers, visible CAPTCHA, and store are unresolved. **Do not add CAPTCHA** in 
this phase. **Do not** add a third-party abuse vendor.
If 429: public copy per UX E4; no game timer.
**I4:** where counters live (memory vs later shared store) is an implementation decision when 
deploying multiple instances.
---
## 12. Moderation architecture
From [moderation-system.md](./moderation-system.md):
- Insert = **pending**. Validation ≠ publish.
- Automated checks may **refuse** a send (empty, too large, obvious PII shape) as **form 
errors**, never flip to `approved`.
- **Explicit human (operator) approval** before public selection.
- Visitors cannot approve their own (or anyone’s) content.

- Public responses never include queue, notes, or reject reasons for later human rejects.
- MVP operator UI = **not designed**; table editor/SQL after tables exist is allowed as a stopgap.
- **Do not build an admin dashboard** in the public app.
---
## 13. Error architecture
| Class | Public behaviour |
| --- | --- |
| Validation | Field or form errors; focus first invalid; no stack |
| Exhausted pool | S4 honest empty |
| Unavailable / withheld | S5 generic |
| Database / host failure | S6 generic; keep last advice if any |
| Rate limit | E4 wait copy |
| Automated contribution refusal | Stay on form; generic E10 |
| Unexpected 500 | Generic; log server-side with request id **not** shown as SQL |
Never return schema names, SQLSTATE, or whether a secret is set.

---
## 14. Observability
**U10** analytics vendor: not selected. **U9** log retention: unresolved.
| Safe to log (careful) | Avoid |
| --- | --- |
| Request id, route, status, latency | Full advice bodies by default |
| Error class (validation vs 5xx) | Age + IP together as a person timeline |
| Rate-limit hits (coarse) | Report “dossiers”; children-specific extra fields |
| | Service-role keys; cookies’ raw secrets |
Do not install an analytics SDK in this phase. Do not log contributor text into a third party.
---
## 15. Testing architecture

From [testing-strategy.md](./testing-strategy.md). **Do not add runners now.**
| Layer | First invariants |
| --- | --- |
| Unit | Age 10–100; range min≤max; eligibility filter |
| Integration / RLS | Anon cannot read pending; cannot self-approve |
| Server / API | Contribute always pending; extra fields ignored; exhausted ≠ recycle; advice 
rendered as text |
| Security smoke | Service-role string absent from client bundle |
| Accessibility | Labels, focus, 44px, live regions, reduced motion (when UI exists) |
| E2E | Loop: age  advice  next  contribute received; report thanks |
Not in MVP tests: weighting, admin UI, vendor analytics.
---
## 16. Environment / secrets
**Do not create `.env` in this phase.**

| Name (conceptual) | Side | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Public | Origin for share text |
| `NEXT_PUBLIC_SUPABASE_URL` | Public **only if** client uses anon | Often unused if server-
only DB |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public **only if** RLS-safe client | Default: **omit** 
and use server |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server only** | Privileged DB |
| `SUPABASE_URL` | Server | |
| Session signing secret | **Server only** | If signed cookies (U7) |
**Prohibit:** committing real secrets; `SERVICE_ROLE` in `NEXT_PUBLIC_*`; importing server env 
into client components; secrets in `agent-tools/` or chat logs.
Different values per local / preview / production. Preview must not share production community 
data carelessly.
---
## 17. Deployment boundary

```
GitHub    Vercel (Next.js)    Supabase Postgres
```
| Environment | Intent |
| --- | --- |
| Local | App + local or hosted-dev DB; dummy secrets |
| Preview | Separate Supabase project or isolated schema **if** real submissions exist |
| Production | HTTPS; locked RLS; production secrets in Vercel |
Do not configure GitHub/Vercel/Supabase in this phase.
---
## 18. Security threat checklist
Documentation ≠ a secure app. At implementation, check:
| Threat | Checkpoint |

| --- | --- |
| XSS | Advice as text; no HTML bodies |
| Injection | Parameterised queries / client library; never string-built SQL from age |
| IDOR | Report/next cannot read pending by id |
| Authz bypass | No public approve |
| RLS mistakes | Policies tested; service role not in browser |
| Service-role exposure | Bundle grep |
| Spam / malicious submit | Pending + rate limit + human approve |
| Rate-limit bypass | Server, not only UI disable |
| Info leak | Generic errors |
| Cookies | HttpOnly/Secure/SameSite; not an account |
| CSRF | If cookie mutations, explicit pattern |
| Dependencies | Pin when the app exists; review adds |
| Secret leakage | `.gitignore`; host secret store |
---
## 19. Performance

| Goal | Approach (no extra infra) |
| --- | --- |
| First load | Small landing; no full-library download |
| Advice fetch | One indexed range+status query; pick in SQL or small result set on server |
| JS | No chat kits, no icon packs by default |
| Cache | Do **not** cache “random next” as a public CDN of all items. Static pages (S1 shell, 
S11) may cache |
| Mobile | 36rem column; 44px targets; no heavy images |
No Redis/CDN product until a measured need exists.
---
## 20. Unresolved decisions
### Product (U1–U20) — still open unless previously decided
| ID | Topic |
| --- | --- |
| U1 | Minors / ages 10–12 and other youth law |

| U2 | Exact character limits |
| U3 | Category required — **already optional for MVP** |
| U4 | Public source labels |
| U5 | Exhausted pool: no silent recycle |
| U6 | Flagged / withhold visibility |
| U7 | Session storage mechanism |
| U8 | Report metadata |
| U9 | Retention |
| U10 | Analytics |
| U11 | CAPTCHA / rate-limit specifics |
| U12 | Legal pages / cookies / contribute checkbox |
| U13 | Rejected-row retention |
| U14 | Permalinks / SEO timing |
| U15 | Product name / logo |
| U16 | Dark theme |
| U17 | Operator authentication |
| U18 | No-JS first load |
| U19 | Engagement weighting (not MVP) |
| U20 | Font licensing |

### New implementation decisions (this document)
| ID | Topic |
| --- | --- |
| I1 | Server Actions vs Route Handlers |
| I2 | Cookie-signing approach if U7 is a signed cookie |
| I3 | Test runner when tests start |
| I4 | Rate-limit counter storage |
| I5 | Advice as separate URL vs in-place state (UX prefers in-place, no per-piece URL) |
| I6 | Engineering max length until U2 is locked |
| I7 | Flagged as status vs separate withhold column |
---
## 21. Implementation order (future)
Each step should be **independently verifiable**. Do **not** start these until a later phase 
explicitly opens implementation. **U1** should have a written human note before production 
launch (build-the-loop vs launch is allowed only if a human says so).

| Phase | Work | Verify |
| --- | --- | --- |
| **3B** | Scaffold Next.js + TS + Tailwind in this repo; no fake full product | App boots; no 
service-role in client |
| **3C** | Tokens + page shell (header/footer) from visual system | Quiet Paper; 44px; focus rings 
|
| **3D** | S1 age flow, client+**server** validation | Invalid ages rejected server-side |
| **3E** | DB read model + selection + S2/S3/S4 | No pending in pool; exhausted honest; no 
recycle |
| **3F** | S7–S8 contribution insert pending | Extra fields ignored; success ≠ published |
| **3G** | S9–S10 reports | Thanks; session hide; no leaked internals |
| **3H** | RLS, headers, rate limits, secret hygiene | Policy tests; bundle grep |
| **3I** | Automated tests from §15 | Invariants green |
| **Later** | Editorial import; operator path (U17); Vercel after RLS review | Founder can approve 
without public admin product |
Do not ship a pretty landing with **client-only fake advice** as “done.”
---
## 22. Phase boundary

This file is **Phase 3A**. Creating it is **not** authorisation to run `create-next-app`, `npm 
install`, or SQL.
Follow `AGENTS.md`: if asked to scaffold while documentation-only remains in force, **refuse**.
