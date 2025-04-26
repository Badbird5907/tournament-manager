import { createTRPCRouter, protectedProcedure, tournamentPublicProcedure, tournamentStaffProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { z } from "zod";
import { tournamentAttendees, tournamentStaff, tournamentStages, tournaments } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { buildDoubleEliminationBracket, buildSingleEliminationBracket, generateSingleEliminationBracket } from "@/lib/bracket";
import { updateTournamentBasicFormSchema } from "@/types/forms/tournament";

const tournamentRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const { user } = ctx;
    
    const staffTournamentIds = await db
      .select({ tournamentId: tournamentStaff.tournamentId })
      .from(tournamentStaff)
      .where(eq(tournamentStaff.userId, user.id));
    
    const staffTournamentIdArray = staffTournamentIds.map(item => item.tournamentId);
    
    const userTournaments = await db.query.tournaments.findMany({
      where: (tournaments, { or, eq, inArray }) => 
        or(
          eq(tournaments.owner, user.id),
          inArray(tournaments.id, staffTournamentIdArray)
        ),
      orderBy: (tournaments, { desc }) => [desc(tournaments.createdAt)],
    });
    
    return userTournaments;
  }),
  
  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      const { id } = input;
      
      const [tournament, stages] = await Promise.all([
        db.query.tournaments.findFirst({
          where: (t, { eq }) => eq(t.id, id)
        }),
        db.query.tournamentStages.findMany({
          where: (s, { eq }) => eq(s.tournamentId, id)
        })
      ]);
      
      if (!tournament) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Tournament not found",
        });
      }      
      return {
        tournament,
        stages,
      };
    }),
    
  create: protectedProcedure
    .input(z.object({
      name: z.string().min(1),
      slug: z.string().min(1),
      bracketType: z.enum(["single_elimination", "double_elimination"]),
      endDate: z.date().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      
      const existingTournament = await db.query.tournaments.findFirst({
        where: eq(tournaments.slug, input.slug),
      });
      
      if (existingTournament) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "A tournament with this slug already exists",
        });
      }
      
      const newTournament = await db.insert(tournaments).values({
        name: input.name,
        slug: input.slug,
        owner: user.id,
        endDate: input.endDate,
      }).returning();
      
      if (!newTournament[0]) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create tournament",
        });
      }
      
      const newStage = await db.insert(tournamentStages).values({
        tournamentId: newTournament[0].id,
        name: "Default",
        bracketType: input.bracketType,
      }).returning();

      return {
        tournament: newTournament[0],
        stage: newStage[0],
      };
    }),
    getBracket: tournamentPublicProcedure
    .input(z.object({
      stageId: z.string().uuid(),
    }))
    .query(async ({ ctx, input }) => {
      const { tournament } = ctx;
      const { stageId } = input;
      const stage = await db.query.tournamentStages.findFirst({
        where: (stages, { eq }) => eq(stages.id, stageId),
      });
      if (!stage) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Stage not found",
        });
      }
      const matches = await db.query.matches.findMany({
        where: (matches, { eq, and }) => (
          and(
            eq(matches.stageId, stageId),
            eq(matches.tournamentId, tournament.id)
          )
        ),
        with: {
          winner: true,
          participants: {
            with: {
              attendee: true
            }
          }
        },
        orderBy: (matches, { asc }) => [asc(matches.round), asc(matches.matchNumber)],
      });
      const { bracketType } = stage;
      if (bracketType === "single_elimination") {
        return buildSingleEliminationBracket(matches, stage);
      } else if (bracketType === "double_elimination") {
        return buildDoubleEliminationBracket(matches, stage);
      } else {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Invalid bracket type ${(bracketType as unknown as string) ?? "<unknown>"}`,
        });
      }
    }),
    update: tournamentStaffProcedure
    .input(updateTournamentBasicFormSchema)
    .mutation(async ({ ctx, input }) => {
      const { tournament } = ctx;
      // check slug is changed
      if (input.slug !== tournament.slug) {
        const existingTournament = await db.query.tournaments.findFirst({
          where: eq(tournaments.slug, input.slug),
        });
        if (existingTournament) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "A tournament with this slug already exists",
          });
        }
      }
      const updatedTournament = await db.update(tournaments).set({
        ...input,
      }).where(eq(tournaments.id, tournament.id)).returning();
      return updatedTournament[0];
    }),
    getParticipants: tournamentStaffProcedure
    .input(z.object({
      tournamentId: z.string().uuid(),
    }))
    .query(async ({ input }) => {
      const { tournamentId } = input;
      const participants = await db.query.tournamentAttendees.findMany({
        where: (participants, { eq }) => eq(participants.tournamentId, tournamentId),
      });
      return participants;
    }),
    removeParticipant: tournamentStaffProcedure
    .input(z.object({
      tournamentId: z.string().uuid(),
      participantId: z.string().uuid(),
    }))
    .mutation(async ({ input }) => {
      const { tournamentId, participantId } = input;
      await db.delete(tournamentAttendees).where(and(eq(tournamentAttendees.tournamentId, tournamentId), eq(tournamentAttendees.id, participantId)));
    }),
    addParticipant: tournamentStaffProcedure
    .input(z.object({
      displayName: z.string().min(1),
    }))
    .mutation(async ({ input }) => {
      const { tournamentId, displayName } = input;
      await db.insert(tournamentAttendees).values({
        tournamentId,
        displayName,
      });
    }),
    bulkAddParticipants: tournamentStaffProcedure
    .input(z.object({
      tournamentId: z.string().uuid(),
      displayNames: z.array(z.string().min(1)),
    }))
    .mutation(async ({ input }) => {
      const { tournamentId, displayNames } = input;
      await db.insert(tournamentAttendees).values(displayNames.map((displayName) => ({
        tournamentId,
        displayName,
      })));
    }),
    generateBracket: tournamentStaffProcedure
    .input(z.object({
      tournamentId: z.string().uuid(),
      participants: z.string().uuid().array(),
    }))
    .mutation(async ({ input }) => {
      const { tournamentId, participants: participantIds } = input;
      const allParticipants = await db.query.tournamentAttendees.findMany({
        where: (participants, { inArray }) => inArray(participants.id, participantIds),
      });
      const matches = generateSingleEliminationBracket(allParticipants, tournamentId);
    }),
});

export default tournamentRouter;