# System architecture (planned)
**Status:** Phase 0 — conceptual  
**Kind:** documentation only  
**Do not** scaffold, deploy, or provision from this file.
The founder is not an experienced developer. This architecture prefers **few moving parts** and 
**conventional** choices over clever ones.
---
## 1. Planned stack
| Layer | Choice | Notes |
| --- | --- | --- |
| UI | Next.js + TypeScript + Tailwind CSS | App structure decided at implementation; follow Phase 
1 UX |

| Hosting | Vercel | HTTPS at the edge when deployed |
| Data | Supabase PostgreSQL | Single database |
| Auth | Supabase Auth **only if necessary** | Not for reading advice |
| Source | Git + GitHub | |
**Do not invent exact dependency versions here.**
No extra services in MVP: no queue product, no search product, no AI API in the user loop, no 
analytics vendor, no object store unless editorial import truly needs it (plain text in Postgres is 
enough).
---
## 2. Runtime shape (when built)
```
Visitor browser
     HTTPS  Next.js (Vercel)
          Server-only code talks to Supabase with a privileged or server key
          Browser never receives the service-role key
     PostgreSQL (RLS + constrained grants)

```
Public pages and public mutations (get advice, next, contribute, report) go through **the 
application server**, not through a browser-embedded service role.
If a later design uses the Supabase anon key in the browser, it must be **RLS-safe** for those 
exact operations. Default recommendation: **server-mediated** reads/writes for selection, 
submit, and report so session de-duplication and rate limits are not trivial to bypass.
---
## 3. Application modules (logical)
| Module | Responsibility |
| --- | --- |
| Age intake | Validate 10–100 integer |
| Selection | Approved + in-range + not in session seen-set; random among remainder |
| Session context | Age + seen advice identifiers for this visit (mechanism: U7) |
| Contribution | Validate; insert **pending** community advice |
| Reporting | Record report; possibly influence visibility (U6, U8) |
| Editorial import | Trusted bulk load of founder advice as approved |

| Operator moderation | Approve/reject/flag — **no dashboard specified** |
There is no message bus, no microservice split, no separate “AI service.”
---
## 4. What is stored vs what is not
**Stored (conceptually):** advice, status, age range, optional category, reports, timestamps, 
modest counters if justified.
**Not stored for MVP visitors:** name, email, password, profile, date of birth, durable “user” row 
created at age entry.
Age may be sent **with a request**. Persisting every entered age as a log of people is a privacy 
issue (see privacy principles). Prefer not to keep identifiable age histories.
---
## 5. Environments (later)

- Local development
- Production
Keep secrets out of git. Preview environments must use **separate** keys and data if they 
contain community text.
---
## 6. Explicit non-architecture
- No CDN-specific design beyond the host default
- No Kubernetes
- No real-time subscriptions for the public loop
- No client-side “random among all rows” that downloads the library
