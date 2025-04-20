DO $$ BEGIN
	CREATE TYPE "public"."tournament-manager_bracket_type" AS ENUM('single_elimination', 'double_elimination');
EXCEPTION
	WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	CREATE TABLE "tournament-manager_matches" (
		"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
		"tournament_id" uuid
	);
EXCEPTION
	WHEN duplicate_table THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	CREATE TABLE "tournament-manager_tournament_staff" (
		"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
		"tournament_id" uuid NOT NULL,
		"user_id" uuid NOT NULL,
		"created_at" timestamp DEFAULT now() NOT NULL
	);
EXCEPTION
	WHEN duplicate_table THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	CREATE TABLE "tournament-manager_tournaments" (
		"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
		"slug" text NOT NULL,
		"name" text NOT NULL,
		"end_date" timestamp,
		"bracket_type" "tournament-manager_bracket_type" NOT NULL,
		"owner" uuid,
		"created_at" timestamp DEFAULT now() NOT NULL,
		"updated_at" timestamp DEFAULT now() NOT NULL,
		CONSTRAINT "tournament-manager_tournaments_slug_unique" UNIQUE("slug")
	);
EXCEPTION
	WHEN duplicate_table THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	CREATE TABLE "tournament-manager_users" (
		"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
		"email" text NOT NULL,
		"name" text NOT NULL,
		"created_at" timestamp DEFAULT now() NOT NULL,
		"updated_at" timestamp DEFAULT now() NOT NULL,
		CONSTRAINT "tournament-manager_users_email_unique" UNIQUE("email")
	);
EXCEPTION
	WHEN duplicate_table THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "tournament-manager_matches" ADD CONSTRAINT "tournament-manager_matches_tournament_id_tournament-manager_tournaments_id_fk" FOREIGN KEY ("tournament_id") REFERENCES "public"."tournament-manager_tournaments"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
	WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "tournament-manager_tournament_staff" ADD CONSTRAINT "tournament-manager_tournament_staff_tournament_id_tournament-manager_tournaments_id_fk" FOREIGN KEY ("tournament_id") REFERENCES "public"."tournament-manager_tournaments"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
	WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "tournament-manager_tournament_staff" ADD CONSTRAINT "tournament-manager_tournament_staff_user_id_tournament-manager_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."tournament-manager_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
	WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "tournament-manager_tournaments" ADD CONSTRAINT "tournament-manager_tournaments_owner_tournament-manager_users_id_fk" FOREIGN KEY ("owner") REFERENCES "public"."tournament-manager_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
	WHEN duplicate_object THEN null;
END $$;