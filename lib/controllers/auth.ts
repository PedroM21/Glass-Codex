import { db } from "@/db/index";
import { usersTable } from "@/db/schemas/schema";
import { eq } from "drizzle-orm";
import { AuthenticationError, getUserIdFromRequest } from "@/lib/auth";
import { createAuthHandlers } from "@/lib/auth-handlers";
import { accountStore } from "@/lib/account-store";

// Next.js routes keep importing these two handlers as before.
export const { register, login } = createAuthHandlers(accountStore);

// Validate the token and confirm that the account still exists in PostgreSQL.
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
