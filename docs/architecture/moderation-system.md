# Moderation system
**Status:** Phase 0 — conceptual  
**Kind:** documentation only  
**Do not** design or implement an admin dashboard in this phase.
---
## 1. Purpose
Community text is untrusted. The public random system must only see **explicitly approved** 
advice. Visitors must be able to **report** what they see. Operators need a path to approve, 
reject, and react to reports.

---
## 2. What the future moderation system must accomplish
1. **Intake:** public contribution creates an advice item in **`pending`**. Validation success ≠ 
publication.
2. **Queue:** an operator can list pending items (even via SQL or a later internal UI).
3. **Decide:** **approve** (eligible for selection) or **reject** (never selected).
4. **Edit (optional later):** fix typos without pretending the visitor “posted a profile.” MVP can 
reject and not edit.
5. **Reports:** accept public reports on visible items; record them; surface them to the operator.
6. **Flag / withhold:** remove or pause an item from the public pool when it is unsafe or under 
review (visibility details: **U6**).
7. **Prevent contact-seeking:** reject attempts to solicit meetings with minors or to publish 
personal contact details (guidelines).
8. **No public spectacle:** no public queue, no public “this user is banned,” no contributor inbox 
in MVP .
9. **Audit enough to debug, little enough to respect privacy:** timestamps and decisions; not a 
dossier on visitors.
---

## 3. Lifecycle
```
Community submit  pending  approved  (public pool)
                       rejected
Approved item  (optional) flagged / withheld  re-approved or rejected
```
Editorial import: trusted path may create **approved** items without the public form.
**Never** auto-publish because the text passed length checks.
---
## 4. Public-facing states (from Phase 1 — no admin screens)
| Visitor sees | Meaning |
| --- | --- |
| Submission received | Pending exists; not live |

| Form error / automated refusal | Invalid input or immediate policy fail (empty, range, etc.) — not 
a later human reject page |
| Report thanks | Report recorded |
| Advice temporarily unavailable | Item cannot be shown (withheld, missing, etc.) — **no public 
reason** |
Human rejection after submit: **no status page** (Phase 1 C2). Retention of the row: **U13**.
---
## 5. Reports path
1. Visitor confirms report (optional closed reason).
2. Server records report (fields: **U8**).
3. Item is excluded from **this session** at least.
4. Operator reviews reports in aggregate.
5. Operator may withhold, reject, or dismiss.
Rate-limit reports. Do not require an account.
---

## 6. Operator interface (explicitly not designed)
MVP may use:
- Supabase table editor / SQL as a stopgap **after** implementation exists
- Later: a small internal UI
This file does **not** specify layout, components, or an “admin product.”
Operator access must be **authorization-gated** when it exists (security requirements). Service-
role keys stay off devices.
---
## 7. Automation
**Not in MVP .** No ML classifier, no auto-hide-on-keywords as the only defence (keyword filters 
may be a later *aid*, never the publisher).

---
## 8. Alignment
Guidelines: [moderation-guidelines.md](../content/moderation-guidelines.md).  
Privacy of retained rejects and reports: [privacy-principles.md](../security/privacy-principles.md).
