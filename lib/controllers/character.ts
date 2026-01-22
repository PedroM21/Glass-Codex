import { db } from "@/db/index";
import { artworksTable, charactersTable } from "@/db/schemas/schema";
import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
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
      }),
    );

    return NextResponse.json(
      {
        success: true,
        message: "Characters fetched successfully",
        data: { characters: charactersWithArtworks },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
};

// Get specific character
export const getSpecificCharacter = async (
  req: Request,
  context: { params: any },
) => {
  try {
    const { params } = context;

    const unwrappedParams = await params;
    const characterId = Number(unwrappedParams.id);

    if (isNaN(characterId)) {
      return NextResponse.json(
        { message: "Invalid character ID" },
        { status: 400 },
      );
    }

    // verify
    const user = await authCheck(req);

    // fetch characters from the database
    const character = await db
      .select()
      .from(charactersTable)
      .where(
        and(
          eq(charactersTable.id, characterId),
          eq(charactersTable.userId, user.id),
        ),
      )
      .limit(1);

    if (!character.length) {
      return NextResponse.json(
        { message: "Character not found" },
        { status: 404 },
      );
    }

    // fetch artworks specific character
    const artworks = await db
      .select()
      .from(artworksTable)
      .where(eq(artworksTable.characterId, characterId));

    return NextResponse.json(
      {
        success: true,
        data: {
          character: {
            ...character[0],
            artworks,
          },
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
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
        { status: 400 },
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
      .returning({
        id: charactersTable.id,
        name: charactersTable.name,
        role: charactersTable.role,
        traits: charactersTable.traits,
        flaws: charactersTable.flaws,
      });

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
        data: {
          character: {
            ...newCharacter,
            role,
            traits,
            flaws,
            artworks: newArtwork ? [newArtwork] : [],
          },
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create character error: ", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create character",
      },
      { status: 500 },
    );
  }
};

// Update character details
export const updateCharacter = async (
  req: Request,
  context: { params: { id: string } },
) => {
  try {
    const { params } = context;

    const unwrappedParams = await params;
    const characterId = Number(unwrappedParams.id);

    if (isNaN(characterId)) {
      return NextResponse.json(
        { message: "Invalid character ID" },
        { status: 400 },
      );
    }

    // verify
    const user = await authCheck(req);

    // parse body
    const body = await req.json();
    const { name, role, traits, flaws, narrative, purpose } = body;

    // partial update object
    const updateData: Record<string, any> = {};

    if (name !== undefined) updateData.name = name;
    if (role !== undefined) updateData.role = role;
    if (traits !== undefined) updateData.traits = traits;
    if (flaws !== undefined) updateData.flaws = flaws;
    if (narrative !== undefined) updateData.narrative = narrative;
    if (purpose !== undefined) updateData.purpose = purpose;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { message: "No fields to update" },
        { status: 400 },
      );
    }

    // update + ownership check
    const [updatedCharacter] = await db
      .update(charactersTable)
      .set(updateData)
      .where(
        and(
          eq(charactersTable.id, characterId),
          eq(charactersTable.userId, user.id),
        ),
      )
      .returning();

    if (!updatedCharacter) {
      return NextResponse.json(
        { message: "Character not found" },
        { status: 404 },
      );
    }

    // fetch artworks for this character
    const artworks = await db
      .select()
      .from(artworksTable)
      .where(eq(artworksTable.characterId, characterId));

    return NextResponse.json(
      {
        success: true,
        message: "Character updated successfully",
        data: {
          character: {
            ...updatedCharacter,
            artworks,
          },
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Update character error: ", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
};

// Delete a character
export const deleteCharacter = async (
  req: Request,
  context: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await context.params;
    const numericId = Number(id);

    if (Number.isNaN(numericId)) {
      return NextResponse.json(
        { success: false, message: "Invalid character id." },
        { status: 400 },
      );
    }

    // verify user
    const user = await authCheck(req);

    const result = await db
      .delete(charactersTable)
      .where(
        and(
          eq(charactersTable.id, numericId),
          eq(charactersTable.userId, user.id),
        ),
      )
      .returning({ id: charactersTable.id });

    if (result.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Character not found or unauthorized",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Character deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting character: ", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete character",
      },
      { status: 500 },
    );
  }
};
