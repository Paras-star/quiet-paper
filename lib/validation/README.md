# Validation

Server-side parsers used as the security boundary.

- `age.ts` — requested age integer 10–100; contribution min/max range
- `advice-body.ts` — engineering body max and trim/empty parse (I6 / U2 still open)
- `advice-id.ts` — UUID parse for report targets

Client checks in the age screen are convenience only.
