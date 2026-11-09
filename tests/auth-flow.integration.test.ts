import assert from "node:assert/strict";
import test from "node:test";
import bcrypt from "bcryptjs";
import {
  createAuthHandlers,
  type AccountStore,
  type NewAccount,
  type StoredAccount,
} from "../lib/auth-handlers";
import { verifyToken } from "../lib/jwt";

const SECRET = "glass-codex-controller-integration-test-secret";
const previousSecret = process.env.JWT_SECRET;
process.env.JWT_SECRET = SECRET;

test.after(() => {
  if (previousSecret === undefined) {
    delete process.env.JWT_SECRET;
  } else {
    process.env.JWT_SECRET = previousSecret;
  }
});

// A test double: it behaves like a tiny account database but uses no network.
class InMemoryAccountStore implements AccountStore {
  accounts: Array<StoredAccount & { email: string }> = [];
  nextId = 1;

  async findByUsername(username: string): Promise<StoredAccount | undefined> {
    return this.accounts.find((account) => account.username === username);
  }

  async create(input: NewAccount): Promise<{ id: number; username: string }> {
    if (
      this.accounts.some(
        (account) =>
          account.username === input.username || account.email === input.email,
      )
    ) {
      throw Object.assign(new Error("Duplicate account"), { code: "23505" });
    }

    const account = { ...input, id: this.nextId++ };
    this.accounts.push(account);
    return { id: account.id, username: account.username };
  }
}

function jsonRequest(path: string, body: unknown): Request {
  return new Request(`https://glass-codex.test${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

const registration = {
  username: "writer",
  email: "writer@example.com",
  password: "a long test passphrase",
};

test("register then log in with the same account using real bcrypt and JWT", async () => {
  const store = new InMemoryAccountStore();
  const { register, login } = createAuthHandlers(store);

  const created = await register(jsonRequest("/api/auth/register", registration));
  assert.equal(created.status, 201);
  assert.equal(created.headers.get("Cache-Control"), "no-store");

  const registeredBody = await created.json();
  assert.deepEqual(registeredBody.data.user, { id: 1, username: "writer" });
  assert.equal(registeredBody.data.user.passwordHash, undefined);
  assert.deepEqual(verifyToken(registeredBody.data.token), {
    id: 1,
    username: "writer",
  });

  assert.equal(store.accounts.length, 1);
  assert.notEqual(store.accounts[0].passwordHash, registration.password);
  assert.equal(
    await bcrypt.compare(registration.password, store.accounts[0].passwordHash),
    true,
  );

  const signedIn = await login(
    jsonRequest("/api/auth/login", {
      username: registration.username,
      password: registration.password,
    }),
  );
  assert.equal(signedIn.status, 200);
  assert.equal(signedIn.headers.get("Cache-Control"), "no-store");

  const loginBody = await signedIn.json();
  assert.deepEqual(loginBody.data.user, { id: 1, username: "writer" });
  assert.deepEqual(verifyToken(loginBody.data.token), {
    id: 1,
    username: "writer",
  });
});

test("wrong password and unknown username return the same 401 response", async () => {
  const store = new InMemoryAccountStore();
  const { register, login } = createAuthHandlers(store);
  await register(jsonRequest("/api/auth/register", registration));

  const incorrect = await login(
    jsonRequest("/api/auth/login", { username: "writer", password: "wrong" }),
  );
  const unknown = await login(
    jsonRequest("/api/auth/login", { username: "nobody", password: "wrong" }),
  );

  assert.equal(incorrect.status, 401);
  assert.equal(unknown.status, 401);
  assert.deepEqual(await incorrect.json(), await unknown.json());
});

test("invalid registration is rejected before reaching the account store", async () => {
  const store = new InMemoryAccountStore();
  const { register } = createAuthHandlers(store);

  const response = await register(
    jsonRequest("/api/auth/register", {
      ...registration,
      email: "not-an-email",
    }),
  );

  assert.equal(response.status, 400);
  assert.equal(store.accounts.length, 0);
});

test("duplicate username returns 409 without inserting another account", async () => {
  const store = new InMemoryAccountStore();
  const { register } = createAuthHandlers(store);

  await register(jsonRequest("/api/auth/register", registration));
  const response = await register(
    jsonRequest("/api/auth/register", {
      ...registration,
      email: "different@example.com",
    }),
  );

  assert.equal(response.status, 409);
  assert.deepEqual(await response.json(), {
    success: false,
    message: "Account already exists",
  });
  assert.equal(store.accounts.length, 1);
});

test("duplicate email also returns 409", async () => {
  const store = new InMemoryAccountStore();
  const { register } = createAuthHandlers(store);

  await register(jsonRequest("/api/auth/register", registration));
  const response = await register(
    jsonRequest("/api/auth/register", {
      ...registration,
      username: "anotherWriter",
    }),
  );

  assert.equal(response.status, 409);
  assert.equal(store.accounts.length, 1);
});

test("malformed JSON returns 400 rather than 500", async () => {
  const store = new InMemoryAccountStore();
  const { login } = createAuthHandlers(store);
  const request = new Request("https://glass-codex.test/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{invalid",
  });

  const response = await login(request);
  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), {
    success: false,
    message: "Malformed JSON body",
  });
});

test("unexpected account-store failure returns a generic 500", async () => {
  const store: AccountStore = {
    async findByUsername() {
      throw new Error("Synthetic database outage");
    },
    async create() {
      throw new Error("Synthetic database outage");
    },
  };
  const { login } = createAuthHandlers(store);

  const response = await login(
    jsonRequest("/api/auth/login", {
      username: "writer",
      password: registration.password,
    }),
  );

  assert.equal(response.status, 500);
  assert.deepEqual(await response.json(), {
    success: false,
    message: "Internal server error",
  });
});
