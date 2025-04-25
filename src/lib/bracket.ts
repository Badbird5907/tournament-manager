import type { Match, MatchParticipant, TournamentAttendee, TournamentStage } from "@/types";
import type React from "react";
import type { MatchType, ParticipantType, SingleEliminationBracket } from "react-tournament-brackets";

type MatchWithParticipants = Match & {
  participants: (MatchParticipant & { attendee: TournamentAttendee & { isWinner: boolean | undefined} })[];
  winner: TournamentAttendee | null;
}
export const generateSingleEliminationBracket = (matches: MatchWithParticipants[], stage: TournamentStage): MatchType[] => {
  return matches.map((match) => {
    return {
        id: match.id,
        name: `${stage.matchNumberPrefix}${match.matchNumber}`,
        nextMatchId: match.nextMatchId,
        tournamentRoundText: `${match.round}`,
        startTime: match.startTime?.toISOString() ?? "Start: TBD",
        state: match.state === "SCHEDULED" ? "SCHEDULED" : match.state,
        participants: match.participants.map((participant) => {
          return {
            id: participant.attendee.id,
            resultText: participant.status === "SCHEDULED" ? "SCH" : participant.resultText,
            isWinner: participant.isWinner ?? false,
            status: participant.status === "SCHEDULED" ? null : participant.status,
            name: participant.attendee.displayName,
          }
        })
      }
    })
};

export const generateDoubleEliminationBracket = (matches: MatchWithParticipants[], stage: TournamentStage): MatchType[] => {
  return [];
}