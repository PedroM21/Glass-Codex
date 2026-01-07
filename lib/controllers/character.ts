import { db } from "@/db/index";
import { artworksTable, charactersTable } from "@/db/schemas/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { authCheck } from "./auth";

// View all characters for a user
export const getCharacters = async (req: Request) => {
  try {
    // verify user
    const user = await authCheck(req);

    // fetch characters from the database
    const userCharacters = await db
      .select()
      .from(charactersTable)
      .where(eq(charactersTable.userId, user.id));

    // fetch artworks for each character
    const charactersWithArtworks = await Promise.all(
      userCharacters.map(async (char) => {
        const artworks = await db
          .select()
          .from(artworksTable)
          .where(eq(artworksTable.characterId, char.id));

        return {
          ...char,
          artworks,
        };
      })
    );

    return NextResponse.json(
      {
        success: true,
        message: "Characters fetched successfully",
        data: { characters: charactersWithArtworks },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
};

// Create a new character
export const createCharacter = async (req: Request) => {
  try {
    const { name, role, traits, flaws, imageURL } = await req.json();

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

    // add image url to artworks table
    let newArtwork = null;
    if (imageURL) {
      [newArtwork] = await db
        .insert(artworksTable)
        .values({
          imageURL,
          characterId: newCharacter.id,
        })
        .returning({ id: artworksTable.id, imageURL: artworksTable.imageURL });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Character created successfully",
        data: { character: newCharacter, artwork: newArtwork },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Create character error: ", error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Failed to create character",
      },
      { status: 500 }
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
