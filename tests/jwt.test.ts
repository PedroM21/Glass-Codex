import assert from "node:assert/strict";
import test from "node:test";
import jwt from "jsonwebtoken";
import { generateToken, verifyToken } from "../lib/jwt";

const TEST_SECRET = "glass-codex-unit-test-secret-not-for-production";
const TEST_USER = { id: 12, username: "writer" };
const originalSecret = process.env.JWT_SECRET;

// The JWT helper reads the secret when called, so each test can use a safe fixture.
process.env.JWT_SECRET = TEST_SECRET;

test.after(() => {
  if (originalSecret === undefined) {
    delete process.env.JWT_SECRET;
  } else {
    process.env.JWT_SECRET = originalSecret;
  }
});

test("generates a token that verifies to the expected user", () => {
  const token = generateToken(TEST_USER);

  assert.deepEqual(verifyToken(token), TEST_USER);
});

test("rejects a token if its payload has been changed", () => {
  const token = generateToken(TEST_USER);
  const [header, , signature] = token.split(".");
  const modifiedPayload = Buffer.from(
    JSON.stringify({ id: 999, username: "writer" }),
  ).toString("base64url");
  const tamperedToken = [header, modifiedPayload, signature].join(".");

  assert.throws(() => verifyToken(tamperedToken), jwt.JsonWebTokenError);
});

test("rejects an expired token", () => {
  const token = jwt.sign(TEST_USER, TEST_SECRET, {
    algorithm: "HS256",
    expiresIn: -1,
  });

  assert.throws(() => verifyToken(token), jwt.TokenExpiredError);
});

test("rejects a signed token with an invalid user ID", () => {
  const token = jwt.sign(
    { id: "twelve", username: "writer" },
    TEST_SECRET,
    { algorithm: "HS256", expiresIn: "1h" },
  );

  assert.throws(() => verifyToken(token), jwt.JsonWebTokenError);
});

test("rejects a signed token without an expiration claim", () => {
  const token = jwt.sign(TEST_USER, TEST_SECRET, {
    algorithm: "HS256",
  });

  assert.throws(() => verifyToken(token), jwt.JsonWebTokenError);
});

test("rejects tokens signed with an unexpected algorithm", () => {
  const token = jwt.sign(TEST_USER, TEST_SECRET, {
    algorithm: "HS384",
    expiresIn: "1h",
  });

  assert.throws(() => verifyToken(token), jwt.JsonWebTokenError);
});

test("fails explicitly when JWT_SECRET is missing", () => {
  delete process.env.JWT_SECRET;

  try {
    assert.throws(
      () => generateToken(TEST_USER),
      /JWT_SECRET is not configured/,
    );
  } finally {
    process.env.JWT_SECRET = TEST_SECRET;
  }
});
