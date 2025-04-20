import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { z } from "zod";
import { tournaments, tournamentStaff } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

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
  
  get: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const { user } = ctx;
      const { id } = input;
      
      const tournament = await db.query.tournaments.findFirst({
        where: eq(tournaments.id, id),
      });
      
      if (!tournament) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Tournament not found",
        });
      }
      
      const isOwner = tournament.owner === user.id;
      const isStaff = await db.query.tournamentStaff.findFirst({
        where: (staff) => 
          eq(staff.tournamentId, id) && eq(staff.userId, user.id),
      });
      
      if (!isOwner && !isStaff) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have permission to access this tournament",
        });
      }
      
      return tournament;
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
        bracketType: input.bracketType,
        owner: user.id,
        endDate: input.endDate,
      }).returning();
      
      return newTournament[0];
    }),
});

export default tournamentRouter;