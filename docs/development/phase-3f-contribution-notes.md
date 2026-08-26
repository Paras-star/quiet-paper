# Phase 3F contribution notes
Implementation notes only. Does **not** close U1–U20.

## Intake
Community offers are inserted by the Next.js server with `source_type = 'community'` and `status 
= 'pending'`. The browser cannot set status or source. Extra payload keys are ignored.
There is no auto-publish path. Selection (Phase 3E) still requires `approved`.
## I1
Contribution uses one `"use server"` action (`submitCommunityAdvice`) wrapping 
`insertCommunityAdvice`. No public REST approve API. No credentialed session cookie, so CSRF 
for cookie mutations does not apply to this path.
## I6 / U2
The 4000-character ceiling remains the engineering backstop (database check + server parse + 
textarea `maxLength`). The UI states that this maximum is provisional. The ~40–400 character 
range is a writing guide only. **U2 is unresolved.**
## U11 / rate limiting
See `docs/development/phase-3h-security-notes.md`. CAPTCHA is still not implemented. 
**U11** remains unresolved.

## U7 / U12 / U18
- **U7:** contribution does not add cookies or `sessionStorage`. Return-to-advice uses in-
memory React state, same as Phase 3E.
- **U12:** no contribution checkbox.
- **U18:** the form is a client component; no-JS POST is not implemented. U18 remains 
unresolved.
## Reports
Phase 3G. See `docs/development/phase-3g-report-notes.md`.
