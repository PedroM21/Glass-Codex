import jwt from "jsonwebtoken";
import { verifyToken } from "./jwt";
import { getSessionToken } from "./session";

export class AuthenticationError extends Error {
  constructor() {
    super("Authentication required");
    this.name = "AuthenticationError";
  }
}

// Authentication now reads only the session cookie, not Authorization headers.
// authCheck() separately confirms that the account still exists.
export function getUserIdFromRequest(req: Request): number {
  const token = getSessionToken(req);

  if (!token) {
    throw new AuthenticationError();
  }

  try {
    return verifyToken(token).id;
  } catch (error) {
    if (
      error instanceof jwt.JsonWebTokenError ||
      error instanceof jwt.TokenExpiredError ||
      error instanceof jwt.NotBeforeError
    ) {
      throw new AuthenticationError();
    }
    // Configuration/operational problems must remain HTTP 500, not HTTP 401.
    throw error;
  }
}
