CREATE TABLE "tournament-manager_match_participants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"match_id" uuid,
	"tournament_attendee_id" uuid,
	"result_text" text,
	"is_winner" boolean,
	"status" text,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tournament-manager_tournament_attendees" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tournament_id" uuid,
	"display_name" text NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tournament-manager_tournament_stages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tournament_id" uuid,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tournament-manager_matches" ADD COLUMN "stage_id" uuid;--> statement-breakpoint
ALTER TABLE "tournament-manager_matches" ADD COLUMN "round" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "tournament-manager_matches" ADD COLUMN "winner_id" uuid;--> statement-breakpoint
ALTER TABLE "tournament-manager_matches" ADD COLUMN "match_number" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "tournament-manager_matches" ADD COLUMN "next_match_id" uuid;--> statement-breakpoint
ALTER TABLE "tournament-manager_matches" ADD COLUMN "next_loser_match_id" uuid;--> statement-breakpoint
ALTER TABLE "tournament-manager_matches" ADD COLUMN "bracket_type" "tournament-manager_bracket_type" NOT NULL;--> statement-breakpoint
ALTER TABLE "tournament-manager_matches" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "tournament-manager_matches" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "tournament-manager_tournament_staff" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "tournament-manager_match_participants" ADD CONSTRAINT "tournament-manager_match_participants_match_id_tournament-manager_matches_id_fk" FOREIGN KEY ("match_id") REFERENCES "public"."tournament-manager_matches"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tournament-manager_match_participants" ADD CONSTRAINT "tournament-manager_match_participants_tournament_attendee_id_tournament-manager_tournament_attendees_id_fk" FOREIGN KEY ("tournament_attendee_id") REFERENCES "public"."tournament-manager_tournament_attendees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tournament-manager_tournament_attendees" ADD CONSTRAINT "tournament-manager_tournament_attendees_tournament_id_tournament-manager_tournaments_id_fk" FOREIGN KEY ("tournament_id") REFERENCES "public"."tournament-manager_tournaments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tournament-manager_tournament_stages" ADD CONSTRAINT "tournament-manager_tournament_stages_tournament_id_tournament-manager_tournaments_id_fk" FOREIGN KEY ("tournament_id") REFERENCES "public"."tournament-manager_tournaments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tournament-manager_matches" ADD CONSTRAINT "tournament-manager_matches_stage_id_tournament-manager_tournament_stages_id_fk" FOREIGN KEY ("stage_id") REFERENCES "public"."tournament-manager_tournament_stages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tournament-manager_matches" ADD CONSTRAINT "tournament-manager_matches_winner_id_tournament-manager_tournament_attendees_id_fk" FOREIGN KEY ("winner_id") REFERENCES "public"."tournament-manager_tournament_attendees"("id") ON DELETE no action ON UPDATE no action;