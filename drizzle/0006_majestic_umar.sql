ALTER TABLE "tournament-manager_match_participants" ALTER COLUMN "match_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "tournament-manager_match_participants" ALTER COLUMN "tournament_attendee_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "tournament-manager_matches" ALTER COLUMN "tournament_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "tournament-manager_matches" ALTER COLUMN "stage_id" SET NOT NULL;