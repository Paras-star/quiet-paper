# Domain logic

Eligibility for the public pool:

- `status` is `approved` (not `pending`, `rejected`, or `flagged`)
- `minimum_age <= requested_age <= maximum_age`
- id not in the caller-supplied exclusion list (session storage is U7 / Part 2)

Domain types live in `public-advice.ts` (selection outcomes), `contribution.ts` (intake outcomes), and `report.ts` (report intake). Contribution never marks a row approved. Reports do not change advice status. `rate-limited` is a generic public outcome for abuse dampening.
