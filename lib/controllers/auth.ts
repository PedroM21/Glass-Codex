import bcrypt from "bcryptjs";
import { db } from "@/db/index";
import { usersTable } from "@/db/schemas/schema";
import { generateToken } from "@/lib/jwt";
import { eq } from "drizzle-orm";
import { AuthenticationError, getUserIdFromRequest } from "@/lib/auth";
import { parseLoginInput, parseRegistrationInput, readJsonBody } from "@/lib/auth-input";
import { isUniqueViolation } from "@/lib/db-errors";
import { ConflictError } from "@/lib/http-errors";
import { handleApiError } from "@/lib/api-error";

// Register a new user. Rely on database uniqueness constraints to avoid races.
export const register = async (req: Request): Promise<Response> => {
  try {
    const { username, password, email } =
      parseRegistrationInput(await readJsonBody(req));

    // bcrypt generates a unique salt; the result is safe to store, not the password.
    const passwordHash = await bcrypt.hash(password, 10);

    const [newUser] = await db
      .insert(usersTable)
      .values({ username, passwordHash, email })
      .returning({ id: usersTable.id, username: usersTable.username });

    const token = generateToken(newUser);

    return Response.json(
      {
        success: true,
        message: "User registered successfully",
        data: { token, user: newUser },
      },
      { status: 201, headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    if (isUniqueViolation(error)) {
      return handleApiError(new ConflictError(), "register");
    }
    return handleApiError(error, "register");
  }
};

// Authenticate a user. Never reveal whether the username or password was wrong.
export const login = async (req: Request): Promise<Response> => {
  try {
    const { username, password } = parseLoginInput(await readJsonBody(req));

    const [user] = await db
      .select({
        id: usersTable.id,
        username: usersTable.username,
        passwordHash: usersTable.passwordHash,
      })
      .from(usersTable)
      .where(eq(usersTable.username, username))
      .limit(1);

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return Response.json(
        { success: false, message: "Invalid username or password" },
        { status: 401, headers: { "Cache-Control": "no-store" } },
      );
    }

    const token = generateToken({ id: user.id, username: user.username });

    return Response.json(
      {
        success: true,
        message: "Login successful",
        data: {
          token,
          user: { id: user.id, username: user.username },
        },
      },
      { status: 200, headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return handleApiError(error, "login");
  }
};

// Authenticate the token, then confirm that its account still exists.
export const authCheck = async (req: Request) => {
  const userId = getUserIdFromRequest(req);

  const [user] = await db
    .select({ id: usersTable.id, username: usersTable.username })
    .from(usersTable)
    .where(eq(usersTable.id, userId));

  if (!user) {
    throw new AuthenticationError();
  }

  return user;
};
