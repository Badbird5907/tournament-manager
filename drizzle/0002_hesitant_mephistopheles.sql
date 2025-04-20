ALTER TABLE "tournament-manager_users" DROP CONSTRAINT "tournament-manager_users_id_core_users_id_fk";
--> statement-breakpoint
ALTER TABLE "tournament-manager_users" ADD CONSTRAINT "tournament-manager_users_id_core_users_id_fk" FOREIGN KEY ("id") REFERENCES "public"."core_users"("id") ON DELETE cascade ON UPDATE no action;