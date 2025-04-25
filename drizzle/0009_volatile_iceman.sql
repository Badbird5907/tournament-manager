CREATE TYPE "public"."tournament-manager_match_participant_status" AS ENUM('SCHEDULED', 'PLAYED', 'NO_SHOW', 'WALK_OVER', 'NO_PARTY');--> statement-breakpoint
CREATE TYPE "public"."tournament-manager_match_status" AS ENUM('SCHEDULED', 'NO_SHOW', 'WALK_OVER', 'NO_PARTY', 'DONE', 'SCORE_DONE');--> statement-breakpoint
ALTER TABLE "tournament-manager_match_participants" ALTER COLUMN "status" SET DATA TYPE "tournament-manager_match_participant_status" USING status::"tournament-manager_match_participant_status";--> statement-breakpoint
ALTER TABLE "tournament-manager_match_participants" ALTER COLUMN "status" SET DEFAULT 'SCHEDULED';--> statement-breakpoint
ALTER TABLE "tournament-manager_matches" ADD COLUMN "state" "tournament-manager_match_status" DEFAULT 'SCHEDULED';