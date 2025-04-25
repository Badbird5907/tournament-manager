// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { matchParticipantStatusEnum, matchStatusEnum } from "@/types";
import { coreUsers } from "@badbird5907/db/schema";
import { relations } from "drizzle-orm";
import { integer, jsonb, pgEnum, pgTableCreator, text, timestamp, uuid, boolean, type AnyPgColumn } from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
const prefix = "tournament-manager_";
export const createTable = pgTableCreator(
  (name: string) => `${prefix}${name}`,
);

export const pgBracketType = pgEnum(`${prefix}bracket_type`, [
  "single_elimination",
  "double_elimination",
]);
export const users = createTable("users", {
  id: uuid("id").primaryKey().references(() => coreUsers.id, { onDelete: "cascade" }),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
export const tournaments = createTable("tournaments", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"), // Optional end date
  owner: uuid("owner").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Junction table for tournament staff (many-to-many relationship)
export const tournamentStaff = createTable("tournament_staff", {
  id: uuid("id").primaryKey().defaultRandom(),
  tournamentId: uuid("tournament_id").references(() => tournaments.id).notNull(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
export const tournamentStages = createTable("tournament_stages", {
  id: uuid("id").primaryKey().defaultRandom(),
  tournamentId: uuid("tournament_id").notNull().references(() => tournaments.id),
  name: text("name").notNull(),
  matchNumberPrefix: text("match_number_prefix").default("Q"),
  bracketType: pgBracketType("bracket_type"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
export const tournamentAttendees = createTable("tournament_attendees", {
  id: uuid("id").primaryKey().defaultRandom(),
  tournamentId: uuid("tournament_id").notNull().references(() => tournaments.id),
  displayName: text("display_name").notNull(),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().notNull().default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
export const matchStatus = pgEnum(`${prefix}match_status`, matchStatusEnum.options);
export const matches = createTable("matches", {
  id: uuid("id").primaryKey().defaultRandom(),
  tournamentId: uuid("tournament_id").references(() => tournaments.id),
  stageId: uuid("stage_id").references(() => tournamentStages.id),
  round: integer("round").notNull(),
  startTime: timestamp("start_time"),
  winnerId: uuid("winner_id").references(() => tournamentAttendees.id),
  matchNumber: integer("match_number").notNull(),
  state: matchStatus("state").default("SCHEDULED").notNull(),
  nextMatchId: uuid("next_match_id").references((): AnyPgColumn => matches.id),
  nextLoserMatchId: uuid("next_loser_match_id").references((): AnyPgColumn => matches.id),
  bracketType: pgBracketType("bracket_type").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
export const matchParticipantStatus = pgEnum(`${prefix}match_participant_status`, matchParticipantStatusEnum.options);
export const matchParticipants = createTable("match_participants", {
  id: uuid("id").primaryKey().defaultRandom(),
  matchId: uuid("match_id").references(() => matches.id).notNull(),
  tournamentAttendeeId: uuid("tournament_attendee_id").references(() => tournamentAttendees.id).notNull(),
  resultText: text("result_text"),
  isWinner: boolean("is_winner"),
  status: matchParticipantStatus("status").default("SCHEDULED").notNull(),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().notNull().default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
export const tournamentAttendeesRelations = relations(tournamentAttendees, ({ many }) => ({
  matchParticipants: many(matchParticipants),
}));

export const matchesRelations = relations(matches, ({ one, many }) => ({
  winner: one(tournamentAttendees, {
    fields: [matches.winnerId],
    references: [tournamentAttendees.id],
  }),
  participants: many(matchParticipants),
}));

export const matchParticipantsRelations = relations(matchParticipants, ({ one }) => ({
  match: one(matches, {
    fields: [matchParticipants.matchId],
    references: [matches.id],
  }),
  attendee: one(tournamentAttendees, {
    fields: [matchParticipants.tournamentAttendeeId],
    references: [tournamentAttendees.id],
  }),
}));