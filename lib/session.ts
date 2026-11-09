// A signed JWT in a browser-managed HttpOnly cookie (stateless session).
// In production __Host- requires Secure, Path=/, and no Domain attribute.
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 4;

export function sessionCookieName(): string {
  return process.env.NODE_ENV === "production"
    ? "__Host-gc_session"
    : "gc_session";
}

function cookieOptions(maxAge: number): string {
  const attributes = [
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${maxAge}`,
  ];

  if (process.env.NODE_ENV === "production") {
    attributes.push("Secure");
  }

  return attributes.join("; ");
}

export function setSessionCookie(response: Response, token: string): Response {
  response.headers.append(
    "Set-Cookie",
    `${sessionCookieName()}=${encodeURIComponent(token)}; ${cookieOptions(SESSION_MAX_AGE_SECONDS)}`,
  );
  return response;
}

export function clearSessionCookie(response: Response): Response {
  response.headers.append(
    "Set-Cookie",
    `${sessionCookieName()}=; ${cookieOptions(0)}`,
  );
  return response;
}

export function getSessionToken(req: Request): string | undefined {
  const header = req.headers.get("cookie");
  if (!header) return undefined;

  const name = sessionCookieName();
  const matches = header.split(";").map((part) => part.trim()).filter(
    (part) => part.startsWith(`${name}=`),
  );

  // Reject ambiguous cookie headers rather than accepting a second value.
  if (matches.length !== 1) return undefined;

  try {
    const token = decodeURIComponent(matches[0].slice(name.length + 1));
    return token || undefined;
  } catch {
    return undefined;
  }
}
