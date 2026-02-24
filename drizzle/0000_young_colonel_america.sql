CREATE TABLE "artworks" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "artworks_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"imageURL" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"characterId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "characters" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "characters_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"role" varchar(255) NOT NULL,
	"traits" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"flaws" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"arcs" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"narrative" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"purpose" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"userId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "music_themes" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "music_themes_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"trackURL" text NOT NULL,
	"title" varchar(255) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"characterId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"username" varchar(255) NOT NULL,
	"passwordHash" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "artworks" ADD CONSTRAINT "artworks_characterId_characters_id_fk" FOREIGN KEY ("characterId") REFERENCES "public"."characters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "characters" ADD CONSTRAINT "characters_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "music_themes" ADD CONSTRAINT "music_themes_characterId_characters_id_fk" FOREIGN KEY ("characterId") REFERENCES "public"."characters"("id") ON DELETE cascade ON UPDATE no action;