# Glass Codex v2 — Cookie-backed authentication

## Request flow

1. The browser POSTs login or registration credentials to the same-origin
   route. The route rejects missing or cross-origin `Origin` headers.
2. The authentication handler validates input, uses PostgreSQL and bcrypt,
   and signs a JWT with a four-hour expiration.
3. The response includes an `HttpOnly` session cookie in `Set-Cookie`. The
   JSON response contains only the public user object, **not the token**.
4. The browser sends the cookie on subsequent same-origin requests without
   frontend JavaScript reading or constructing `Authorization` headers.
5. `getUserIdFromRequest()` validates the cookie's signed JWT and
   `authCheck()` verifies the account still exists. Character queries
   continue to check ownership in their SQL conditions.
6. The application layout also requires an authenticated session before
   rendering private pages.
7. Sign-out POSTs to `/api/auth/logout`; the response expires the browser
   cookie and the frontend navigates to `/login`.

## Cookie attributes

- `HttpOnly` blocks reading the token via `document.cookie`.
- `SameSite=Lax` reduces cross-site cookie transmission.
- `Path=/` allows session use throughout Glass Codex.
- `Max-Age=14400` corresponds to the four-hour JWT lifetime.
- On production HTTPS, the `__Host-gc_session` name uses `Secure`,
  `Path=/`, and no `Domain` attribute. On local HTTP development we use
  `gc_session` without `Secure`.

These properties reduce credential theft but **do not prevent XSS or CSRF on
their own**.

## Cross-origin request protection

All state-changing endpoints (register, login, logout, create/update/delete
character) require an `Origin` header exactly matching the destination
origin. When present, `Sec-Fetch-Site` must be `same-origin` or `none`.
Requests failing the check get HTTP 403. The browser API client uses
relative URLs and `credentials: "same-origin"`.

If deploying behind a reverse proxy or alternate hostname, confirm the
server observes the public origin correctly. Fail-closed origin validation
may need an explicit, trusted public-origin configuration for that
deployment. No untrusted `X-Forwarded-Host` is accepted as authoritative.

## How to test

- `npm test` includes unit and in-memory integration tests for cookie
  attributes, validation, JWT expiration, CSRF rejection, logout, and
  registration/login without returning the token in JSON.
- `npm run test:db` runs separately against disposable local
  PostgreSQL, applying the real Drizzle migrations and verifying login
  with a cookie and account records in the database.
- CI runs both suites and type checks on the authentication refactor
  branch. Refer to `docs/testing.md` for local PostgreSQL setup.

## Remaining work before deployment

- Stateless JWT logout only removes the browser cookie. A copied token
  remains cryptographically valid until expiry; true immediate server-side
  logout needs a session table/revocation mechanism.
- Add rate limiting for login and registration, as well as abuse monitoring.
- Add true HTTP server/browser end-to-end tests (including live redirect,
  Set-Cookie behavior, logout, and `/api/auth/me`).
- Review dependencies and update affected Next.js packages before release.
- Strengthen account recovery, cookie/session rotation, and any additional
  CSRF defenses required by future cross-origin integrations.
- Existing tokens stored in localStorage are never accepted by the new
  endpoints. Login, registration, and logout remove legacy storage entries.
  Users with only legacy tokens must sign in again after deployment.
