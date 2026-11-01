import bcrypt from "bcryptjs";
import { ValidationError } from "./http-errors";

type LoginInput = {
  username: string;
  password: string;
};

type RegistrationInput = LoginInput & {
  email: string;
};

// Request JSON is untrusted: TypeScript types alone don't validate it.
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function readJsonBody(req: Request): Promise<unknown> {
  try {
    return await req.json();
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new ValidationError("Malformed JSON body");
    }
    throw error;
  }
}

export function parseLoginInput(value: unknown): LoginInput {
  if (!isRecord(value)) {
    throw new ValidationError("Expected a JSON object");
  }

  const { username, password } = value;
  if (
    typeof username !== "string" ||
    !username.trim() ||
    username.trim().length > 255
  ) {
    throw new ValidationError("A valid username is required");
  }

  // Do not trim passwords: spaces can be intentional.
  if (
    typeof password !== "string" ||
    !password ||
    password.length > 4096
  ) {
    throw new ValidationError("A valid password is required");
  }

  return { username: username.trim(), password };
}

export function parseRegistrationInput(value: unknown): RegistrationInput {
  const login = parseLoginInput(value);
  const { username, password } = login;

  if (username.length < 3 || username.length > 50) {
    throw new ValidationError("Username must be 3–50 characters");
  }

  // bcrypt truncates values over 72 UTF-8 bytes. Reject those instead of
  // silently accepting a password that won't be fully checked later.
  if (password.length < 12 || !password.trim() || bcrypt.truncates(password)) {
    throw new ValidationError("Password must be at least 12 characters and at most 72 UTF-8 bytes");
  }

  if (!isRecord(value) || typeof value.email !== "string") {
    throw new ValidationError("A valid email address is required");
  }

  const email = value.email.trim().toLowerCase();
  if (email.length > 255 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new ValidationError("A valid email address is required");
  }

  return { username, password, email };
}
