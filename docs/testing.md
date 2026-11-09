# Glass Codex authentication and database tests

## Test layers

- `npm test` runs fast, database-free tests. They cover JWT verification, input
  validation, HTTP response mapping, and the registration/login flow using an
  in-memory `AccountStore`.
- `npm run test:db` runs tests against a real **disposable local PostgreSQL
  database**. It uses `pg` as the test driver, real Drizzle queries from
  `lib/drizzle-account-store.ts`, and bcrypt/JWT in the authentication flow.
- CI runs the existing SQL migrations using `npx drizzle-kit migrate`
  before running database tests.

Neither test suite should connect to a production database. The DB tests refuse
connections unless `TEST_DATABASE_URL` points at `localhost` or `127.0.0.1`
and a database named `glass_codex_test`.

## Run locally (requires Docker and Node.js)

Start an isolated PostgreSQL 16 database:

```bash
docker run --rm --name glass-codex-test-db -p 5432:5432 \
  -e POSTGRES_USER=glass_codex_test \
  -e POSTGRES_PASSWORD=test-only-password \
  -e POSTGRES_DB=glass_codex_test \
  postgres:16
```

In a separate terminal, after `npm ci`, set this test-only URL:

```bash
export TEST_DATABASE_URL='postgres://glass_codex_test:test-only-password@127.0.0.1:5432/glass_codex_test'
```

Migrate **only the local test database**:

```bash
DATABASE_URL="$TEST_DATABASE_URL" npx drizzle-kit migrate
```

Then run:

```bash
npm test
npm run test:db
npx next typegen && npx tsc --noEmit
```

To stop PostgreSQL, run `docker stop glass-codex-test-db`.

**Never** substitute the production Neon URL into these commands. The migration
command modifies the database at `DATABASE_URL` and does not have the
test-only URL guard present in the test file.

## How the adapter is shared

`lib/drizzle-account-store.ts` contains the queries for finding and creating
accounts. `lib/account-store.ts` injects the Neon HTTP connection in production.
The database integration test injects a `node-postgres` connection to disposable
PostgreSQL. Both use the same Drizzle table definitions and query builder.

The tests cover actual migrations, uniqueness constraints, account insertion,
lookup, bcrypt hashing, and login token creation. They do not yet cover the
complete Next.js HTTP server, browser sessions, or the production Neon HTTP
network transport.
