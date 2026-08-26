# Threat model
**Status:** Phase 0 — lightweight  
**Kind:** documentation only  
Not a full STRIDE certification. Enough so future implementers do not only think about features.
---
## 1. What we are protecting
| Asset | Why |
| --- | --- |
| Visitors, especially minors | Harmful or grooming content; data collection |
| Advice library integrity | Spam, propaganda, scams in the pool |
| Operator secrets | Database takeover |
| Trust in the product | Looks like a scam or a trap |
| Reporter and submitter anonymity | Retaliation, doxxing |

---
## 2. Actors
- Honest visitor
- Bored or malicious anonymous visitor (spam, scrape, inject)
- Groomer or predator testing the contribute/report paths
- Compromised operator account
- Future third-party scripts (analytics — U10)
There is **no** other-user inbox to hijack. That removes a large class of social-product threats 
**if we do not add messaging**.
---
## 3. Threats and responses (conceptual)
| Threat | Response in design |
| --- | --- |
| XSS via advice text | Store/render as text; no HTML; CSP later |

| SQL injection | Parameterised queries / ORM; never string-build SQL from age |
| CSRF on contribute/report | Same-site + server checks |
| Publish without approval | Status checks on **every** select query; RLS |
| Flood pending queue | Rate limits; size limits |
| Scrape entire library | Selection API returns one item; do not expose list-all publicly |
| Service role in client | Forbidden |
| Open admin page | Do not ship one on the public host in MVP |
| Fake “approved” by posting extra JSON fields | Ignore unknown fields; server sets status = 
pending |
| Report-bombing to hide content | Rate limits; human still decides U6 |
| Session replay / seen-list tampering | If seen-ids are client-supplied, a user can only **hurt 
themselves** (more repeats or skip). Do not trust client to mark items approved. If skipping is an 
abuse issue, sign the session or keep seen-ids server-side (U7). |
| PII in free text | Guidelines + human reject |
| Minor-targeted sexual content | Zero-tolerance guidelines; human review; legal U1 |
| SEO spam / thin pages | Do not generate 91 age URLs |
| Supply-chain (npm) | Minimal dependencies |
| Logging PII | Privacy principles |
---

## 4. Out of scope for this model
- Nation-state vs Vercel
- Physical theft of the founder’s laptop (still: disk encryption and 2FA are wise)
- Legal discovery processes
---
## 5. Residual risk
Anonymous contribution **will** receive bad text. The control is **pending + human**, not a filter 
that claims to understand everything. Residual risk is delayed harmful editorial mistakes and 
operator fatigue. Mitigate with a small library and a slow queue, not with fake AI certainty.
