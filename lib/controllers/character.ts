import { db } from "@/db/index";
import { charactersTable } from "@/db/schemas/schema";
import { NextResponse } from "next/server";
import { authCheck } from "./auth";

export const createCharacter = async (req: Request) => {
  try {
    const { name, role, traits, flaws } = await req.json();

    if (!name) {
      return NextResponse.json(
        { success: false, message: "Name is required" },
        { status: 400 }
      );
    }

    // verify user
    const user = await authCheck(req);

    // create character in the database
    const [newCharacter] = await db
      .insert(charactersTable)
      .values({
        name,
        role,
        traits,
        flaws,
        userId: user.id,
      })
      .returning({ id: charactersTable.id, name: charactersTable.name });

    return NextResponse.json(
      {
        success: true,
        message: "Character created successfully",
        data: { character: newCharacter },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error(error);
    return (
      NextResponse.json({
        success: false,
        message: error.message || "Failed to create character",
      }),
      { status: 401 }
    );
  }
};

// // User can have multiple characters
// export const charactersTable = pgTable("characters", {
//   id: integer().primaryKey().generatedAlwaysAsIdentity(),
//   name: varchar({ length: 255 }).notNull(),
//   role: varchar({ length: 255 }).notNull(),

//   traits: jsonb().notNull().$type<string[]>(),
//   flaws: jsonb().notNull().$type<string[]>(),
//   arcs: jsonb().notNull().$type<string[]>(),

//   narrative: text().notNull(),
//   purpose: text().notNull(),
//   createdAt: timestamp().notNull().defaultNow(),
//   userId: integer()
//     .notNull()
//     .references(() => usersTable.id, { onDelete: "cascade" }),
// });
