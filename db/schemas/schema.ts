import {
  integer,
  pgTable,
  varchar,
  text,
  jsonb,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  username: varchar({ length: 255 }).notNull().unique(),
  passwordHash: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  createdAt: timestamp().notNull().defaultNow(),
});

// User can have multiple characters
export const charactersTable = pgTable("characters", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  role: varchar({ length: 255 }).notNull(),

  traits: jsonb().notNull().$type<string[]>().default([]),
  flaws: jsonb().notNull().$type<string[]>().default([]),
  arcs: jsonb().notNull().$type<string[]>().default([]),

  narrative: text().notNull().default(""),
  purpose: text().notNull().default(""),
  createdAt: timestamp().notNull().defaultNow(),
  userId: integer()
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
});

// Character can have multiple artworks
export const artworksTable = pgTable("artworks", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  imageURL: text().notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  characterId: integer()
    .notNull()
    .references(() => charactersTable.id, { onDelete: "cascade" }),
});

// Character can have multiple music themes
export const musicThemesTable = pgTable("music_themes", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  trackURL: text().notNull(),
  title: varchar({ length: 255 }).notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  characterId: integer()
    .notNull()
    .references(() => charactersTable.id, { onDelete: "cascade" }),
});

// Defines relations and how TS sees them
export const usersRelations = relations(usersTable, ({ many }) => ({
  characters: many(charactersTable), // User has many characters
}));

export const charactersRelations = relations(
  charactersTable,
  ({ one, many }) => ({
    user: one(usersTable, {
      fields: [charactersTable.userId],
      references: [usersTable.id],
    }), // Character belongs to User
    artworks: many(artworksTable), // Character has many artworks
    musicThemes: many(musicThemesTable), // Character has many music themes
  })
);
