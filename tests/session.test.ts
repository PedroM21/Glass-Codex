import assert from "node:assert/strict";
import test from "node:test";
import {
  clearSessionCookie,
  getSessionToken,
  sessionCookieName,
  SESSION_MAX_AGE_SECONDS,
  setSessionCookie,
} from "../lib/session";
import { rejectCrossOriginMutation } from "../lib/csrf";
import { POST as logout } from "../app/api/auth/logout/route";

function mutation(origin: string | null, fetchSite = "same-origin"): Request {
  return new Request("https://glass-codex.test/api/character/create", {
    method: "POST",
    headers: {
      ...(origin ? { Origin: origin } : {}),
      "Sec-Fetch-Site": fetchSite,
    },
  });
}

test("session cookie cannot be read by frontend JavaScript and has limited scope", () => {
  const response = setSessionCookie(Response.json({ success: true }), "signed.test.token");
  const cookie = response.headers.get("Set-Cookie") ?? "";

  assert.match(cookie, /HttpOnly/);
  assert.match(cookie, /SameSite=Lax/);
  assert.match(cookie, /Path=\//);
  assert.match(cookie, new RegExp(`Max-Age=${SESSION_MAX_AGE_SECONDS}`));
  assert.doesNotMatch(cookie, /Domain=/);
  assert.doesNotMatch(cookie, /SameSite=None/);
  assert.ok(!JSON.stringify({ success: true }).includes("signed.test.token"));
  const req = new Request("https://glass-codex.test/", {
    headers: { Cookie: cookie.split(";")[0] },
  });
  assert.equal(getSessionToken(req), "signed.test.token");
});

test("production cookie uses Secure and the __Host- prefix", () => {
  const previous = process.env.NODE_ENV;
  process.env.NODE_ENV = "production";
  try {
    const response = setSessionCookie(new Response(), "abc");
    const cookie = response.headers.get("Set-Cookie") ?? "";
    assert.equal(sessionCookieName(), "__Host-gc_session");
    assert.match(cookie, /^__Host-gc_session=/);
    assert.match(cookie, /(?:^|; )Secure(?:;|$)/);
  } finally {
    if (previous === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = previous;
  }
});

test("clearSessionCookie expires the session in the browser", () => {
  const response = clearSessionCookie(new Response());
  const cookie = response.headers.get("Set-Cookie") ?? "";
  assert.match(cookie, /Max-Age=0/);
  assert.match(cookie, /HttpOnly/);
});

test("same-origin writes are accepted", () => {
  assert.equal(rejectCrossOriginMutation(mutation("https://glass-codex.test")), null);
});

test("different-origin, missing-origin, and same-site subdomain writes are blocked", () => {
  const requests = [
    mutation("https://attacker.test", "cross-site"),
    mutation(null, "none"),
    mutation("https://glass-codex.test", "same-site"),
    mutation("null", "cross-site"),
  ];
  for (const req of requests) {
    assert.equal(rejectCrossOriginMutation(req)?.status, 403);
  }
});

test("logout rejects cross-origin requests and clears cookie for same-origin requests", async () => {
  const blocked = await logout(mutation("https://attacker.test", "cross-site"));
  assert.equal(blocked.status, 403);
  assert.equal(blocked.headers.get("Set-Cookie"), null);

  const success = await logout(mutation("https://glass-codex.test"));
  assert.equal(success.status, 200);
  assert.match(success.headers.get("Set-Cookie") ?? "", /Max-Age=0/);
});
