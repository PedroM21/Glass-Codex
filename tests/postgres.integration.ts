import assert from "node:assert/strict";
import test from "node:test";
import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import { usersTable } from "../db/schemas/schema";
import { createAuthHandlers } from "../lib/auth-handlers";
import { createDrizzleAccountStore } from "../lib/drizzle-account-store";
import { verifyToken } from "../lib/jwt";
import { getSessionToken } from "../lib/session";

// Only an explicitly configured, local, disposable PostgreSQL database is allowed.
// Tests must not import the production db/index.ts connection.
const connectionString = process.env.TEST_DATABASE_URL;
if (!connectionString) {
  throw new Error("TEST_DATABASE_URL must target a disposable local PostgreSQL database");
}
const target = new URL(connectionString);
if (
  !["localhost", "127.0.0.1"].includes(target.hostname) ||
  target.pathname !== "/glass_codex_test"
) {
  throw new Error("Refusing to run database integration tests outside local glass_codex_test");
}

const previousSecret = process.env.JWT_SECRET;
process.env.JWT_SECRET = "test-only-secret-for-postgres-integration";
const pool = new Pool({ connectionString, max: 2 });
const testDb = drizzle({ client: pool });
const accountStore = createDrizzleAccountStore(testDb);
const { register, login } = createAuthHandlers(accountStore);

test.after(async () => {
  await pool.end();
  if (previousSecret === undefined) delete process.env.JWT_SECRET;
  else process.env.JWT_SECRET = previousSecret;
});

function post(path: "register" | "login", data: object): Request {
  return new Request(`https://glass-codex.test/api/auth/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

function uniqueRegistration() {
  const suffix = randomUUID().slice(0, 12);
  return {
    username: `dbtest_${suffix}`,
    email: `dbtest_${suffix}@example.com`,
    password: "a strong test passphrase",
  };
}

test("existing Drizzle migrations created users with unique constraints", async () => {
  const result = await pool.query(
    `SELECT constraint_name FROM information_schema.table_constraints
     WHERE table_schema = 'public' AND table_name = 'users'
       AND constraint_type = 'UNIQUE'`,
  );
  const names = new Set(result.rows.map((row: { constraint_name: string }) => row.constraint_name));
  assert.equal(names.has("users_username_unique"), true);
  assert.equal(names.has("users_email_unique"), true);
});

test("register and log in using real PostgreSQL, Drizzle, bcrypt and JWT", async () => {
  const input = uniqueRegistration();
  const registered = await register(post("register", input));
  assert.equal(registered.status, 201);
  const registeredBody = await registered.json();
  const userId: number = registeredBody.data.user.id;
  assert.equal(typeof userId, "number");

  const [stored] = await testDb.select().from(usersTable)
    .where(eq(usersTable.id, userId));
  assert.equal(stored.username, input.username);
  assert.equal(stored.email, input.email);
  assert.notEqual(stored.passwordHash, input.password);
  assert.equal(await bcrypt.compare(input.password, stored.passwordHash), true);

  const loggedIn = await login(post("login", {
    username: input.username,
    password: input.password,
  }));
  assert.equal(loggedIn.status, 200);
  const body = await loggedIn.json();
  assert.equal(body.data.token, undefined);
  const cookie = loggedIn.headers.get("Set-Cookie");
  assert.match(cookie ?? "", /HttpOnly/);
  const token = getSessionToken(
    new Request("https://glass-codex.test/", {
      headers: { Cookie: cookie!.split(";")[0] },
    }),
  );
  assert.ok(token);
  assert.deepEqual(verifyToken(token), {
    id: userId,
    username: input.username,
  });
  assert.equal(body.data.user.passwordHash, undefined);
});

test("PostgreSQL rejects duplicate username and email, returning HTTP 409", async () => {
  const input = uniqueRegistration();
  const original = await register(post("register", input));
  assert.equal(original.status, 201);

  const duplicateName = await register(post("register", {
    ...input,
    email: `other_${randomUUID().slice(0, 12)}@example.com`,
  }));
  const duplicateEmail = await register(post("register", {
    ...input,
    username: `other_${randomUUID().slice(0, 12)}`,
  }));
  for (const response of [duplicateName, duplicateEmail]) {
    assert.equal(response.status, 409);
    assert.deepEqual(await response.json(), {
      success: false,
      message: "Account already exists",
    });
  }
});

test("Drizzle account adapter returns undefined for missing users", async () => {
  const result = await accountStore.findByUsername(
    `missing_${randomUUID().slice(0, 12)}`,
  );
  assert.equal(result, undefined);
});
