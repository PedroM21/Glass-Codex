import assert from "node:assert/strict";
import test from "node:test";
import jwt from "jsonwebtoken";
import { AuthenticationError, getUserIdFromRequest } from "../lib/auth";
import { handleApiError } from "../lib/api-error";
import { generateToken } from "../lib/jwt";
import { sessionCookieName } from "../lib/session";

const TEST_SECRET = "glass-codex-auth-tests-not-for-production";
const originalSecret = process.env.JWT_SECRET;
process.env.JWT_SECRET = TEST_SECRET;

test.after(() => {
  if (originalSecret === undefined) delete process.env.JWT_SECRET;
  else process.env.JWT_SECRET = originalSecret;
});

function makeRequest(token?: string, extraHeaders: Record<string, string> = {}): Request {
  return new Request("https://glass-codex.test/api/character/view", {
    headers: {
      ...(token ? { Cookie: `${sessionCookieName()}=${token}` } : {}),
      ...extraHeaders,
    },
  });
}

test("extracts the user ID from a valid HttpOnly session cookie", () => {
  const token = generateToken({ id: 12, username: "writer" });
  assert.equal(getUserIdFromRequest(makeRequest(token)), 12);
});

test("rejects requests without a session cookie", () => {
  assert.throws(() => getUserIdFromRequest(makeRequest()), AuthenticationError);
});

test("does not accept the old bearer-token header without a session cookie", () => {
  const token = generateToken({ id: 12, username: "writer" });
  assert.throws(
    () => getUserIdFromRequest(makeRequest(undefined, {
      Authorization: `Bearer ${token}`,
    })),
    AuthenticationError,
  );
});

test("rejects malformed or duplicate session cookies", () => {
  const token = generateToken({ id: 12, username: "writer" });
  for (const cookie of [
    `${sessionCookieName()}=%ZZ`,
    `${sessionCookieName()}=invalid`,
    `${sessionCookieName()}=${token}; ${sessionCookieName()}=${token}`,
  ]) {
    assert.throws(
      () => getUserIdFromRequest(makeRequest(undefined, { Cookie: cookie })),
      AuthenticationError,
    );
  }
});

test("maps expired session cookies to authentication errors", () => {
  const expired = jwt.sign(
    { id: 12, username: "writer" },
    TEST_SECRET,
    { algorithm: "HS256", expiresIn: -1 },
  );

  assert.throws(() => getUserIdFromRequest(makeRequest(expired)), AuthenticationError);
});

test("does not hide missing server configuration as an authentication error", () => {
  delete process.env.JWT_SECRET;
  try {
    const signed = jwt.sign(
      { id: 12, username: "writer" },
      TEST_SECRET,
      { algorithm: "HS256", expiresIn: "1h" },
    );
    assert.throws(() => getUserIdFromRequest(makeRequest(signed)), /JWT_SECRET is not configured/);
  } finally {
    process.env.JWT_SECRET = TEST_SECRET;
  }
});

test("returns HTTP 401 without advertising bearer authentication", async () => {
  const response = handleApiError(new AuthenticationError(), "getCharacters");

  assert.equal(response.status, 401);
  assert.equal(response.headers.get("WWW-Authenticate"), null);
  assert.deepEqual(await response.json(), {
    success: false,
    message: "Authentication required",
  });
});

test("returns HTTP 500 without leaking internal error details", async () => {
  const response = handleApiError(new Error("database password should not leak"), "getCharacters");

  assert.equal(response.status, 500);
  assert.deepEqual(await response.json(), {
    success: false,
    message: "Internal server error",
  });
});
