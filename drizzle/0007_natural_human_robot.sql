ALTER TABLE "tournament-manager_match_participants" ALTER COLUMN "match_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "tournament-manager_match_participants" ALTER COLUMN "tournament_attendee_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "tournament-manager_matches" ALTER COLUMN "tournament_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "tournament-manager_matches" ALTER COLUMN "stage_id" DROP NOT NULL;