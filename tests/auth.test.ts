import assert from "node:assert/strict";
import test from "node:test";
import jwt from "jsonwebtoken";
import { AuthenticationError, getUserIdFromRequest } from "../lib/auth";
import { handleApiError } from "../lib/api-error";
import { generateToken } from "../lib/jwt";

const TEST_SECRET = "glass-codex-auth-tests-not-for-production";
const originalSecret = process.env.JWT_SECRET;
process.env.JWT_SECRET = TEST_SECRET;

test.after(() => {
  if (originalSecret === undefined) {
    delete process.env.JWT_SECRET;
  } else {
    process.env.JWT_SECRET = originalSecret;
  }
});

function makeRequest(authorization?: string): Request {
  return new Request("https://glass-codex.test/api/character/view", {
    headers: authorization ? { Authorization: authorization } : {},
  });
}

test("extracts the user ID from a valid Bearer token", () => {
  const token = generateToken({ id: 12, username: "writer" });
  assert.equal(getUserIdFromRequest(makeRequest(`Bearer ${token}`)), 12);
});

test("rejects requests without an Authorization header", () => {
  assert.throws(() => getUserIdFromRequest(makeRequest()), AuthenticationError);
});

test("rejects malformed Authorization headers", () => {
  for (const header of ["Bearer", "Bearerabc", "Basic dGVzdA==", "Bearer a b"]) {
    assert.throws(
      () => getUserIdFromRequest(makeRequest(header)),
      AuthenticationError,
    );
  }
});

test("maps expired tokens to authentication errors", () => {
  const expired = jwt.sign(
    { id: 12, username: "writer" },
    TEST_SECRET,
    { algorithm: "HS256", expiresIn: -1 },
  );

  assert.throws(
    () => getUserIdFromRequest(makeRequest(`Bearer ${expired}`)),
    AuthenticationError,
  );
});

test("does not hide missing server configuration as an authentication error", () => {
  delete process.env.JWT_SECRET;
  try {
    const signed = jwt.sign(
      { id: 12, username: "writer" },
      TEST_SECRET,
      { algorithm: "HS256", expiresIn: "1h" },
    );
    assert.throws(
      () => getUserIdFromRequest(makeRequest(`Bearer ${signed}`)),
      /JWT_SECRET is not configured/,
    );
  } finally {
    process.env.JWT_SECRET = TEST_SECRET;
  }
});

test("returns HTTP 401 and a Bearer challenge for authentication errors", async () => {
  const response = handleApiError(new AuthenticationError(), "getCharacters");

  assert.equal(response.status, 401);
  assert.equal(response.headers.get("WWW-Authenticate"), "Bearer");
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
