# Security requirements
**Status:** Phase 0 — requirements for a future implementation  
**Kind:** documentation only  
Do not configure Vercel, Supabase, or headers in this phase.
When implementation exists, these are **mandatory** unless a human updates this file.
---

## 1. Transport and host
- **HTTPS** only in production.
- Do not disable certificate checks.
- Prefer the platform’s default TLS.
## 2. Secrets
- **Service-role / secret keys never go to the browser**, never into `NEXT_PUBLIC_*`, never into 
client bundles, never into git.
- Anon/public keys, if used, must be harmless given RLS.
- Production secrets live in the host’s secret store.
- Rotate if leaked.
- Different secrets per environment.
## 3. Server-side validation
Validate on the server for every mutation and for age used in selection:
- Age integer 10–100

- Min/max age integer 10–100, min ≤ max
- Text present after trim; length bounds once U2 is set
- Closed report reasons if a list exists
- Reject unexpected fields
Client validation is UX, not a security control.
## 4. Output escaping and XSS
- Treat advice text as **untrusted** even if approved (defence in depth).
- Default: render as **text**, not HTML. No Markdown HTML, no stored XSS.
- Escape if any rich text is ever introduced (it is not in MVP).
- Careful with `dangerouslySetInnerHTML` — do not use it for advice.
## 5. CSRF
If mutations use cookies with credentials, require CSRF protection or same-site cookie strategy 
that is actually safe for the chosen method.
If mutations use same-origin `fetch` with a same-site session cookie, document the chosen 

pattern. Do not assume Next.js “handles it” without checking.
## 6. Rate limiting and spam
Apply to: contribute, report, and abusive **next-advice** or selection hammering.
- Limits are a **server** concern (U11).
- Visible CAPTCHA only if needed; **not** on the calm reading path if avoidable.
- No account does not mean unlimited anonymous writes.
## 7. Database Row Level Security
- Enable RLS on public-sensitive tables when they exist.
- Policies must enforce: public **cannot** read `pending`/`rejected`; public **cannot** approve; 
public **cannot** read internal notes.
- Do not bypass RLS with the service role **in the browser**.
- Server use of the service role is a **privilege**: keep queries tight; never expose raw results that 
include hidden columns to the client.
## 8. Authorization

- Visitors: only anonymous public actions.
- Operators: separate, strong authentication **when** an operator path exists (U17).
- No “hidden URL ” as the only admin lock.
## 9. Admin protection
- No public admin UI in MVP by design.
- If a table editor or SQL is used, it is through the operator’s Supabase account, not a page on the 
marketing host.
- Audit who can approve content.
## 10. Error handling
- User-facing errors are generic (`We couldn’t load another piece`).
- Logs may include request ids, not stack traces in the browser.
- Do not return SQL errors, schema names, or secret presence to clients.
- Do not swallow errors into fake success.
## 11. Logging

- Log operational failures and abuse signals.
- Do not log full advice bodies by default; do not log children-related extra data.
- Retention of logs: U9.
## 12. Abuse prevention
- Rate limits
- Pending-not-public
- Reports
- Size limits on text
- Disallow HTML/URLs policy in guidelines (may still appear in text — moderators reject)
## 13. Secure headers (when hosted)
Intend (implementation phase):
- `Content-Security-Policy` appropriate to Next.js (do not copy a random CSP)
- `Referrer-Policy` of a restrictive value
- `X-Content-Type-Options: nosniff`

- Frame protection (`frame-ancestors` or platform equivalent)
- HSTS at the host
Exact values belong in implementation review, not here as cargo-cult strings.
## 14. Dependency security
- Pin versions **when** the app exists (not in this phase).
- Apply patches; do not add packages for novelty (`AGENTS.md`).
- Do not commit lockfiles that pull unknown postinstall malware — review additions.
## 15. Service-role keys (repeat)
The **browser must never receive Supabase service-role credentials.** This is a firing offense for 
a PR, not a style nit.
## 16. Founder operations
Phishing of the GitHub/Vercel/Supabase accounts is in-scope as a practical risk. Use 2FA on 
those accounts when they exist. That is operational, not application code.
