import type { Match, MatchParticipant, TournamentAttendee, TournamentStage } from "@/types";
import type { MatchType } from "react-tournament-brackets";

type MatchWithParticipants = Match & {
  participants: (MatchParticipant & { attendee: (TournamentAttendee) | null } | null)[];
  winner: TournamentAttendee | null;
}
export const buildSingleEliminationBracket = (matches: MatchWithParticipants[], stage: TournamentStage): MatchType[] => {
  return matches.map((match) => {
    return {
        id: match.id,
        name: `${stage.matchNumberPrefix}${match.matchNumber}`,
        nextMatchId: match.nextMatchId,
        tournamentRoundText: `${match.round}`,
        startTime: match.startTime?.toISOString() ?? "Start: TBD",
        state: match.state === "SCHEDULED" ? "SCHEDULED" : match.state,
        participants: match.participants.map((participant) => {
          if (!participant?.attendee) {
            return {
              id: "unknown",
              resultText: "TBD",
              isWinner: false,
              status: null,
              name: "TBD",
            };
          }
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
export const generateSingleEliminationBracket = (participants: TournamentAttendee[], tournamentId: string) => {
  return [];
}
export const buildDoubleEliminationBracket = (matches: MatchWithParticipants[], stage: TournamentStage): MatchType[] => {
  return [];
}