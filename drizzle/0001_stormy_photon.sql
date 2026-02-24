ALTER TABLE "characters" ADD COLUMN "age" integer;--> statement-breakpoint
ALTER TABLE "characters" ADD COLUMN "species" varchar(255);--> statement-breakpoint
ALTER TABLE "characters" ADD COLUMN "coreWant" varchar(255);--> statement-breakpoint
ALTER TABLE "characters" ADD COLUMN "coreNeed" varchar(255);--> statement-breakpoint
ALTER TABLE "characters" ADD COLUMN "backstory" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "characters" ADD COLUMN "arcNotes" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "characters" ADD COLUMN "relationshipNotes" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "characters" ADD COLUMN "extraNotes" jsonb DEFAULT '{}'::jsonb NOT NULL;