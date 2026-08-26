# Security helpers

Server-only abuse dampening. Not a visitor account and not authorization.

- `rate-limit.ts` — in-process sliding windows (I4 not closed; U11 numbers provisional)
- `client-key.ts` — coarse IP-derived key from request headers

Do not import these modules from Client Components.
