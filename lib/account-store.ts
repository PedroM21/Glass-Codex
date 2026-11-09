import { db } from "@/db/index";
import { createDrizzleAccountStore } from "./drizzle-account-store";

// Production uses Drizzle with the Neon HTTP database connection.
export const accountStore = createDrizzleAccountStore(db);
