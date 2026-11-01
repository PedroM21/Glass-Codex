import jwt from "jsonwebtoken";
import { verifyToken } from "./jwt";

export class AuthenticationError extends Error {
  constructor() {
    super("Authentication required");
    this.name = "AuthenticationError";
  }
}

// Validate the Bearer header and the token's identity claims.
// Checking whether the account still exists belongs to authCheck().
export function getUserIdFromRequest(req: Request): number {
  const authorization = req.headers.get("authorization");
  const match = /^Bearer ([^\s]+)$/i.exec(authorization?.trim() ?? "");

  if (!match) {
    throw new AuthenticationError();
  }

  try {
    return verifyToken(match[1]).id;
  } catch (error) {
    // Invalid credentials are a 401, but missing server configuration is a 500.
    if (
      error instanceof jwt.JsonWebTokenError ||
      error instanceof jwt.TokenExpiredError ||
      error instanceof jwt.NotBeforeError
    ) {
      throw new AuthenticationError();
    }
    throw error;
  }
}
