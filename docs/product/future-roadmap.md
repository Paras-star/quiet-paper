# Future roadmap
**Status:** Phase 0 — directional, not a schedule  
**Kind:** documentation only  
Do not implement these items because they appear here.
There are no calendar estimates. Order is **dependency**, not dates.
---
## 1. After documentation: first implementation slice
When a human opens an implementation phase:

1. Legal/product decision on **minors (U1)** — or an explicit “launch later / geo / age-gate” 
instruction.
2. Scaffold the planned stack; no extra products.
3. Public loop per [mvp-scope.md](./mvp-scope.md) and the UX spec.
4. Database per [data-model-proposal.md](../architecture/data-model-proposal.md) (then, not 
now).
5. Editorial import.
6. Operator approval path (even if manual).
7. Privacy notice draft reviewed by a person qualified to do so.
---
## 2. Content and safety
- Grow the editorial library with gaps by age range
- Refine [moderation-guidelines.md](../content/moderation-guidelines.md) from real cases
- Optional closed report-reason list
- Decision on flagged visibility (U6)
- Decision on reject retention (U13)

- Still no AI chatbot; optional **offline** tools for the founder to draft advice are outside the 
product loop
---
## 3. Operator experience
- A small **internal** moderation UI (still not a public social admin)
- Operator authentication (U17) — Auth only if necessary
- Audit log of approve/reject (privacy-minimised)
---
## 4. Selection quality
- Engagement-based weighting **after** simple random works
- Still exclude pending/rejected/unpublishable items
- Still honour session de-duplication
---

## 5. SEO and publishing (sparse)
Index:
- The main tool (homepage)
- A **few** life-stage resources (hand-written)
- Topic or collection pages only if they have unique prose
- Individual advice URLs **only** when a piece has standalone value (curated)
Do not mass-produce `/age/10` … `/age/100`.
Sharing may later include a curated URL. MVP sharing does not depend on it.
---
## 6. Analytics
Possible measurements (no provider selected):

- Advice requests
- Next-advice activations
- Contribution starts vs submissions
- Reports
- Share/copy activations
- Return visits (careful: this can become identity-adjacent)
Prefer aggregate, privacy-preserving counts. Do not replay a person’s advice history in a vendor.
---
## 7. Monetization (principle first)
Only if it does not damage the loop. Options to consider later: advertising, sponsorship, 
partnerships, premium **off** the primary path. No provider assumed. No paywall on “see 
advice” for the core age flow.
---
## 8. Internationalisation

More locales only after the English product is stable. Do not machine-translate advice without 
human review.
---
## 9. What this roadmap refuses
- Profiles, DMs, dating, forums
- Medical or financial productisation
- Thin content farms for search
