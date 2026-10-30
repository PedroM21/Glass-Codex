import jwt from "jsonwebtoken";

type TokenUser = {
  id: number;
  username: string;
};

const JWT_ALGORITHM = "HS256" as const;
const JWT_LIFETIME_SECONDS = 60 * 60 * 4;

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (!secret || !secret.trim()) {
    throw new Error("JWT_SECRET is not configured");
  }

  return secret;
}

export function generateToken(user: TokenUser): string {
  return jwt.sign(
    { id: user.id, username: user.username },
    getJwtSecret(),
    {
      algorithm: JWT_ALGORITHM,
      expiresIn: JWT_LIFETIME_SECONDS,
    },
  );
}

export function verifyToken(token: string): TokenUser {
  const decoded = jwt.verify(token, getJwtSecret(), {
    algorithms: [JWT_ALGORITHM],
  });

  if (
    typeof decoded === "string" ||
    !Number.isSafeInteger(decoded.id) ||
    decoded.id <= 0 ||
    typeof decoded.username !== "string" ||
    decoded.username.length === 0 ||
    typeof decoded.exp !== "number"
  ) {
    throw new jwt.JsonWebTokenError("Invalid token claims");
  }

  return { id: decoded.id, username: decoded.username };
}
