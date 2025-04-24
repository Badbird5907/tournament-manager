// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { coreUsers } from "@badbird5907/db/schema";
import { relations, sql } from "drizzle-orm";
import { index, integer, jsonb, pgEnum, pgTable, pgTableCreator, serial, text, timestamp, uuid, varchar, boolean, type AnyPgColumn } from "drizzle-orm/pg-core";

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
  endDate: timestamp("end_date"), // Optional end date
  bracketType: pgBracketType("bracket_type").notNull(),
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
export const matches = createTable("matches", {
  id: uuid("id").primaryKey().defaultRandom(),
  tournamentId: uuid("tournament_id").references(() => tournaments.id),
  stageId: uuid("stage_id").references(() => tournamentStages.id),
  round: integer("round").notNull(),
  winnerId: uuid("winner_id").references(() => tournamentAttendees.id),
  matchNumber: integer("match_number").notNull(),
  nextMatchId: uuid("next_match_id").references((): AnyPgColumn => matches.id),
  nextLoserMatchId: uuid("next_loser_match_id").references((): AnyPgColumn => matches.id),
  bracketType: pgBracketType("bracket_type").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ([{
  participants: index("match_participants_idx").on(table.id),
}]));
export const matchParticipants = createTable("match_participants", {
  id: uuid("id").primaryKey().defaultRandom(),
  matchId: uuid("match_id").references(() => matches.id).notNull(),
  tournamentAttendeeId: uuid("tournament_attendee_id").references(() => tournamentAttendees.id).notNull(),
  resultText: text("result_text"),
  isWinner: boolean("is_winner"),
  status: text("status"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().notNull().default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ([{
  matchIdx: index("match_idx").on(table.matchId),
  attendeeIdx: index("attendee_idx").on(table.tournamentAttendeeId),
}]));
export const matchParticipantsRelations = relations(matchParticipants, ({ one }) => ({
  match: one(matches, {
    fields: [matchParticipants.matchId],
    references: [matches.id],
  }),
  tournamentAttendee: one(tournamentAttendees, {
    fields: [matchParticipants.tournamentAttendeeId],
    references: [tournamentAttendees.id],
  }),
}));
export const tournamentAttendeesRelations = relations(tournamentAttendees, ({ many }) => ({
  matchParticipants: many(matchParticipants),
}));