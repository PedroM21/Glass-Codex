ALTER TABLE "characters" ALTER COLUMN "age" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "characters" ADD COLUMN "personalityNotes" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "characters" DROP COLUMN "narrative";--> statement-breakpoint
ALTER TABLE "characters" DROP COLUMN "arcs";--> statement-breakpoint
ALTER TABLE "characters" DROP COLUMN "purpose";