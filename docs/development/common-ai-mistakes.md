# Common AI-agent mistakes (this project)

**Status:** Phase 0  
**Kind:** documentation only
Future coding agents fail this product in predictable ways. Do not do these.
---
## 1. Building the app during a docs phase
Scaffolding Next.js, installing Tailwind, opening Supabase, or adding `package.json` “to save 
time” **violates** the current phase. Stop.
---
## 2. Turning it into a different product
Feeds, likes, comments, chat bubbles, “AI advice,” profiles, streaks, paywalls, 91 age URLs, dating 
copy, forums. If it is not age  advice  next  optional contribute, it is wrong.
---

## 3. Auto-publishing
Setting new rows to `approved` because the JSON validated. Community must start **pending**.
---
## 4. Service role in the client
`NEXT_PUBLIC_SUPABASE_SERVICE_ROLE` or a key in a browser module. Never.
---
## 5. Inventing PII fields
Email “so we can notify,” date of birth “for COPPA,” name “for trust.” The PRD forbids them unless 
a human changes the PRD.
---

## 6. Treating children as a solved UX problem
Implementing ages 10–12 like a toy without U1 is not clever. Do not add a fake parental 
checkbox to “cover COPPA” without legal input — and do not silently drop the minimum age 
either.
---
## 7. Fake APIs and fake packages
Do not invent Supabase methods, Next.js APIs, or npm libraries. Verify.
---
## 8. Silent architecture rewrites
Replacing Postgres with a spreadsheet, adding Redis, adding Prisma+Drizzle together, 
microservices. Not without a written reason.
---

## 9. Hiding errors
Empty `catch`, always showing a successful submit, swallowing RLS failures. Users and 
operators need honest failure.
---
## 10. Gambling UI for “random”
Spinners, slot machines, confetti, “roll.” Forbidden by design principles.
---
## 11. HTML in advice
Markdown renderers, `innerHTML`, rich text “to be nice.” XSS and tone problems.
---
## 12. Thin SEO farms

Scripts that emit `/age/27` shells. Forbidden.
---
## 13. Scope creep in moderation
A full CMS, roles matrix, SLA dashboard. MVP needs a **path** to approve/reject, not an admin 
SaaS.
---
## 14. Analytics by default
Dropping a tracking pixel because “we’ll want metrics.” U10 is unresolved.
---
## 15. Editing Phase 1 to match a whim

Do not delete UX files. If you disagree, record a contradiction; do not “fix” the spec silently.
---
## 16. Dependency souvenir hunting
Adding shadcn, a chatbot kit, i18n frameworks, state machines, and three date libraries before 
the loop works.
---
## 17. Claiming tests passed when they were not run
`AGENTS.md`: explain failures honestly.
