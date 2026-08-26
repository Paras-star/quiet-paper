# Phase 3G report notes
Implementation notes only. Does **not** close U1–U20.
## What is stored
`advice_report` stores `advice_id`, `created_at`, and an internal `handling_state` defaulting to 

`open`. There is **no** reporter identity, IP , cookie, or reason field. **U8** remains unresolved.
## Eligibility
The server accepts a report only when the id is a UUID **and** the row exists with `status = 
'approved'`. Pending, rejected, and flagged items cannot be reported. Lookup failure and missing 
rows both return a generic `unavailable` result (no existence oracle).
## U6
Inserting a report **does not** change `advice.status`. There is no auto-flag or auto-removal 
from the public pool. Session hide (do not show that id again this visit, then attempt next) is 
client in-memory exclusion, same as Phase 3E seen-ids.
## Duplicates / U7
There is no durable duplicate-report key. The same visitor can submit another report after 
refresh. In-tab, the reported id is added to the seen-list so Next will not return it. **U7** is 
unresolved.
## U11 / rate limiting
See `docs/development/phase-3h-security-notes.md`. CAPTCHA is still not implemented. 
**U11** remains unresolved.

## I1
One `"use server"` action (`submitAdviceReport`). Extra payload keys are ignored. No public list/
approve API.
