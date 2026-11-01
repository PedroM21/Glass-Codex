import assert from "node:assert/strict";
import test from "node:test";
import {
  parseLoginInput,
  parseRegistrationInput,
  readJsonBody,
} from "../lib/auth-input";
import { handleApiError } from "../lib/api-error";
import { isUniqueViolation } from "../lib/db-errors";
import { ConflictError, ValidationError } from "../lib/http-errors";

const validRegistration = {
  username: "  StoryWriter  ",
  email: "  Writer@Example.com ",
  password: "my very secure passphrase",
};

test("normalizes username and email during registration", () => {
  const result = parseRegistrationInput(validRegistration);

  assert.deepEqual(result, {
    username: "StoryWriter",
    email: "writer@example.com",
    password: "my very secure passphrase",
  });
});

test("does not trim passwords during login", () => {
  const result = parseLoginInput({
    username: "  writer  ",
    password: " intentional spaces ",
  });

  assert.deepEqual(result, {
    username: "writer",
    password: " intentional spaces ",
  });
});

test("rejects missing or non-string login credentials", () => {
  for (const value of [
    null,
    [],
    {},
    { username: 123, password: "validPassword" },
    { username: "writer", password: null },
    { username: " ", password: "somePassword" },
  ]) {
    assert.throws(() => parseLoginInput(value), ValidationError);
  }
});

test("rejects invalid registration emails and short usernames", () => {
  for (const value of [
    { ...validRegistration, username: "ab" },
    { ...validRegistration, email: "not-an-email" },
    { ...validRegistration, email: null },
  ]) {
    assert.throws(() => parseRegistrationInput(value), ValidationError);
  }
});

test("rejects weak or bcrypt-truncated registration passwords", () => {
  for (const password of [
    "short",
    "            ",
    "x".repeat(73),
    "🔒".repeat(19),
  ]) {
    assert.throws(
      () => parseRegistrationInput({ ...validRegistration, password }),
      ValidationError,
    );
  }
  assert.equal(
    parseRegistrationInput({ ...validRegistration, password: "x".repeat(72) })
      .password.length,
    72,
  );
});

test("rejects malformed request JSON as a validation error", async () => {
  const req = new Request("https://glass-codex.test/api/auth/login", {
    method: "POST",
    body: "{bad json",
    headers: { "Content-Type": "application/json" },
  });

  await assert.rejects(() => readJsonBody(req), ValidationError);
});

test("recognizes PostgreSQL unique violations without hiding other database failures", () => {
  assert.equal(isUniqueViolation({ code: "23505" }), true);
  assert.equal(isUniqueViolation({ cause: { code: "23505" } }), true);
  assert.equal(isUniqueViolation({ code: "23503" }), false);
  assert.equal(isUniqueViolation(new Error("network failure")), false);
});

test("maps invalid input to HTTP 400", async () => {
  const res = handleApiError(new ValidationError("A valid email address is required"), "register");
  assert.equal(res.status, 400);
  assert.deepEqual(await res.json(), {
    success: false,
    message: "A valid email address is required",
  });
});

test("maps duplicate accounts to HTTP 409", async () => {
  const res = handleApiError(new ConflictError(), "register");
  assert.equal(res.status, 409);
  assert.deepEqual(await res.json(), {
    success: false,
    message: "Account already exists",
  });
});
