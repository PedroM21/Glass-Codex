import { db } from "@/db/index";
import { usersTable } from "@/db/schemas/schema";
import { eq } from "drizzle-orm";
import type { AccountStore } from "./auth-handlers";

// Production adapter: run the account operations against PostgreSQL with Drizzle.
export const accountStore: AccountStore = {
  async findByUsername(username) {
    const [user] = await db
      .select({
        id: usersTable.id,
        username: usersTable.username,
        passwordHash: usersTable.passwordHash,
      })
      .from(usersTable)
      .where(eq(usersTable.username, username))
      .limit(1);

    return user;
  },

  async create({ username, passwordHash, email }) {
    const [user] = await db
      .insert(usersTable)
      .values({ username, passwordHash, email })
      .returning({
        id: usersTable.id,
        username: usersTable.username,
      });

    return user;
  },
};
