ALTER TABLE "tournament-manager_match_participants" DROP CONSTRAINT "tournament-manager_match_participants_match_id_tournament-manager_matches_id_fk";
--> statement-breakpoint
ALTER TABLE "tournament-manager_match_participants" DROP CONSTRAINT "tournament-manager_match_participants_tournament_attendee_id_tournament-manager_tournament_attendees_id_fk";
--> statement-breakpoint
ALTER TABLE "tournament-manager_matches" DROP CONSTRAINT "tournament-manager_matches_tournament_id_tournament-manager_tournaments_id_fk";
--> statement-breakpoint
ALTER TABLE "tournament-manager_matches" DROP CONSTRAINT "tournament-manager_matches_stage_id_tournament-manager_tournament_stages_id_fk";
--> statement-breakpoint
ALTER TABLE "tournament-manager_matches" DROP CONSTRAINT "tournament-manager_matches_winner_id_tournament-manager_tournament_attendees_id_fk";
--> statement-breakpoint
ALTER TABLE "tournament-manager_matches" DROP CONSTRAINT "tournament-manager_matches_next_match_id_tournament-manager_matches_id_fk";
--> statement-breakpoint
ALTER TABLE "tournament-manager_matches" DROP CONSTRAINT "tournament-manager_matches_next_loser_match_id_tournament-manager_matches_id_fk";
--> statement-breakpoint
ALTER TABLE "tournament-manager_match_participants" ADD CONSTRAINT "tournament-manager_match_participants_match_id_tournament-manager_matches_id_fk" FOREIGN KEY ("match_id") REFERENCES "public"."tournament-manager_matches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tournament-manager_match_participants" ADD CONSTRAINT "tournament-manager_match_participants_tournament_attendee_id_tournament-manager_tournament_attendees_id_fk" FOREIGN KEY ("tournament_attendee_id") REFERENCES "public"."tournament-manager_tournament_attendees"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tournament-manager_matches" ADD CONSTRAINT "tournament-manager_matches_tournament_id_tournament-manager_tournaments_id_fk" FOREIGN KEY ("tournament_id") REFERENCES "public"."tournament-manager_tournaments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tournament-manager_matches" ADD CONSTRAINT "tournament-manager_matches_stage_id_tournament-manager_tournament_stages_id_fk" FOREIGN KEY ("stage_id") REFERENCES "public"."tournament-manager_tournament_stages"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tournament-manager_matches" ADD CONSTRAINT "tournament-manager_matches_winner_id_tournament-manager_tournament_attendees_id_fk" FOREIGN KEY ("winner_id") REFERENCES "public"."tournament-manager_tournament_attendees"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tournament-manager_matches" ADD CONSTRAINT "tournament-manager_matches_next_match_id_tournament-manager_matches_id_fk" FOREIGN KEY ("next_match_id") REFERENCES "public"."tournament-manager_matches"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tournament-manager_matches" ADD CONSTRAINT "tournament-manager_matches_next_loser_match_id_tournament-manager_matches_id_fk" FOREIGN KEY ("next_loser_match_id") REFERENCES "public"."tournament-manager_matches"("id") ON DELETE set null ON UPDATE no action;