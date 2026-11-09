import { eq } from "drizzle-orm";
import type { TablesRelationalConfig } from "drizzle-orm/relations";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import { usersTable } from "@/db/schemas/schema";
import type { AccountStore } from "./auth-handlers";

// Both Neon HTTP and node-postgres extend Drizzle's PostgreSQL database API.
// Keep the SQL query logic in one place and inject the driver-specific connection.
export function createDrizzleAccountStore<
  TQueryResult extends PgQueryResultHKT,
  TFullSchema extends Record<string, unknown>,
  TSchema extends TablesRelationalConfig,
>(database: PgDatabase<TQueryResult, TFullSchema, TSchema>): AccountStore {
  return {
    async findByUsername(username) {
      const [user] = await database
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
      const [user] = await database
        .insert(usersTable)
        .values({ username, passwordHash, email })
        .returning({
          id: usersTable.id,
          username: usersTable.username,
        });

      return user;
    },
  };
}
