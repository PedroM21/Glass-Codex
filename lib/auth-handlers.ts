import bcrypt from "bcryptjs";
import { handleApiError } from "./api-error";
import {
  parseLoginInput,
  parseRegistrationInput,
  readJsonBody,
} from "./auth-input";
import { isUniqueViolation } from "./db-errors";
import { ConflictError } from "./http-errors";
import { generateToken } from "./jwt";
import { setSessionCookie } from "./session";

export type StoredAccount = {
  id: number;
  username: string;
  passwordHash: string;
};

export type NewAccount = {
  username: string;
  email: string;
  passwordHash: string;
};

export type AccountStore = {
  findByUsername(username: string): Promise<StoredAccount | undefined>;
  create(account: NewAccount): Promise<{ id: number; username: string }>;
};

// The controller knows what operations it needs, but not how accounts are
// stored. Production provides PostgreSQL; tests provide an in-memory store.
export function createAuthHandlers(store: AccountStore) {
  const register = async (req: Request): Promise<Response> => {
    try {
      const { username, password, email } =
        parseRegistrationInput(await readJsonBody(req));

      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = await store.create({ username, passwordHash, email });

      const token = generateToken(newUser);
      return setSessionCookie(
        Response.json(
          {
            success: true,
            message: "User registered successfully",
            data: { user: newUser },
          },
          { status: 201, headers: { "Cache-Control": "no-store" } },
        ),
        token,
      );
    } catch (error) {
      if (isUniqueViolation(error)) {
        return handleApiError(new ConflictError(), "register");
      }
      return handleApiError(error, "register");
    }
  };

  const login = async (req: Request): Promise<Response> => {
    try {
      const { username, password } = parseLoginInput(await readJsonBody(req));
      const user = await store.findByUsername(username);

      if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
        return Response.json(
          { success: false, message: "Invalid username or password" },
          { status: 401, headers: { "Cache-Control": "no-store" } },
        );
      }

      const token = generateToken({ id: user.id, username: user.username });
      return setSessionCookie(
        Response.json(
          {
            success: true,
            message: "Login successful",
            data: {
              user: { id: user.id, username: user.username },
            },
          },
          { status: 200, headers: { "Cache-Control": "no-store" } },
        ),
        token,
      );
    } catch (error) {
      return handleApiError(error, "login");
    }
  };

  return { register, login };
}
