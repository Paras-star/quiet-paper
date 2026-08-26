# Privacy principles
**Status:** Phase 0 — principles, not a legal policy  
**Kind:** documentation only  

This is **not** a Privacy Policy, Terms of Service, or cookie notice. Unresolved legal items are 
labelled. Do not invent final legal wording.
---
## 1. Default
Collect **as little personal information as possible**. A visitor must be able to receive advice 
**without an account**.
Age is **context for a request**, not a reason to open a people database.
---
## 2. Age input
- Collected to filter advice (10–100).
- Do not ask for date of birth.
- Do not treat age as a verified identity.
- **Do not** store a permanent “this person is 14” profile.

- Logging every age with IP/time can become personal data. Default: avoid durable age+IP logs.
**Unresolved (U1):** children (especially 10–12, and other minors depending on jurisdiction) — 
whether the service should be offered, restricted, or gated. **Do not silently decide they are 
adults.** Minimise any data if they use the form at all.
---
## 3. Cookies and session state
Session needs (product): remember **age** for the visit and **seen advice ids** so next-advice 
does not repeat.
**Unresolved (U7):** cookie vs `sessionStorage` vs server session vs signed token.
Principles regardless of mechanism:
- Prefer **session** lifetime, not multi-year tracking cookies.
- Do not use the session as an advertising graph.
- Document whatever ships in the real privacy notice later.
- If a cookie is strictly necessary for the loop, legal may still require a notice (U12).

---
## 4. Analytics
**Unresolved (U10):** whether to measure, what, which provider.
If added later:
- Prefer aggregate events (request, next, submit, report, share).
- Do not send full advice text or unnecessary IDs to a third party without a review.
- Do not install a vendor during documentation or casually during first implementation without a 
decision.
---
## 5. Reports
Reports are safety data. They refer to **content**, not to a named reporter.

**Unresolved (U8):** IP hash, nothing, or other anti-abuse keys; retention.
Do not require an email to report. Do not publish who reported.
---
## 6. Community submissions
Stored: text + age range + timestamps + status. **No** name/email/phone/DOB/address/
workplace/social/photo.
Ask people not to include personal information in the **text**. Moderators should reject PII-laden 
text.
Submissions may still be personal data if the text identifies someone. Handle as untrusted, 
potentially sensitive content.
---
## 7. Moderation records

Internal notes and decisions are **operator-confidential**. They may contain quotes of harmful 
text. Restrict access. Do not put them in client bundles or public APIs.
---
## 8. Rejected content
**Unresolved (U13):** retain (abuse, legal hold, appeals that we do not offer in MVP) vs delete vs 
time-box.
Until decided: the model must support either; implementation should not silently keep rejects 
forever “because disk is cheap” without a human choice.
Contributors are not notified (no account). That is a product fact, not a privacy-policy substitute.
---
## 9. Retention (all clocks unresolved — U9)
Need future written periods for:

- Session identifiers
- Pending items
- Approved library (kept while published)
- Rejected items
- Reports
- Server logs
- Backups
---
## 10. Children — extra care
If anyone 10–12 (or under 13 / under 16 in some places) can enter an age:
- No extra data collection “to be safe” (emails to parents, school names).
- No contact between visitors.
- No content that sexualises minors (guidelines; zero tolerance).
- Legal review **before** production.

This document does **not** declare COPPA/GDPR-K compliance.
---
## 11. International audience
US, UK, Europe, Australia, New Zealand (and elsewhere) imply **different** laws. One 
international-English product still needs **qualified** legal advice. Founder must not treat this file 
as that advice.
