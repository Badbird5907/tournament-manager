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
export const generateSingleEliminationBracket = (participants: TournamentAttendee[], tournamentId: string, stageId: string): { matches: Match[], matchParticipants: MatchParticipant[] } => {
  const perfectBrackets = [4, 8, 16, 32, 64, 128, 256];
  const matches: Match[] = [];
  const matchParticipants: MatchParticipant[] = [];

  const closestPerfectBracket = perfectBrackets.find((bracket) => bracket >= participants.length) ?? 4;
  const numByes = closestPerfectBracket - participants.length;
  
  const shuffledParticipants = [...participants].sort(() => Math.random() - 0.5);
  
  const numRounds = Math.log2(closestPerfectBracket);
  let currentMatchNumber = 1;
  const isMatchBye = (match: Match) => match.state === "WALK_OVER";
  const getMatchWinner = (match: Match) => match.winnerId!;
  const createByeParticipant = (matchId: string, attendeeId: string, isWinner = true): MatchParticipant => ({
    id: crypto.randomUUID(),
    matchId,
    stageId,
    tournamentAttendeeId: attendeeId,
    status: "WALK_OVER",
    resultText: "BYE",
    isWinner,
    metadata: {},
    createdAt: new Date(),
    updatedAt: new Date()
  });

  const createMatch = (round: number): Match => ({
    id: crypto.randomUUID(),
    tournamentId,
    stageId,
    round,
    matchNumber: currentMatchNumber++,
    state: "SCHEDULED",
    bracketType: "single_elimination",
    startTime: null,
    winnerId: null,
    nextMatchId: null,
    nextLoserMatchId: null,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  const firstRoundMatches: Match[] = [];
  for (let i = 0; i < closestPerfectBracket / 2; i++) {
    const participant1Index = i * 2;
    const participant2Index = i * 2 + 1;
    
    if (participant1Index >= shuffledParticipants.length) {
      continue;
    }

    const match = createMatch(1);
    firstRoundMatches.push(match);
    matches.push(match);
    
    matchParticipants.push({
      id: crypto.randomUUID(),
      matchId: match.id,
      stageId,
      tournamentAttendeeId: shuffledParticipants[participant1Index]!.id,
      status: "SCHEDULED",
      resultText: null,
      isWinner: null,
      metadata: {},
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    
    if (participant2Index < shuffledParticipants.length) {
      matchParticipants.push({
        id: crypto.randomUUID(),
        matchId: match.id,
        stageId,
        tournamentAttendeeId: shuffledParticipants[participant2Index]!.id,
        status: "SCHEDULED",
        resultText: null,
        isWinner: null,
        metadata: {},
        createdAt: new Date(),
        updatedAt: new Date()
      });
    } else {
      
      const participant = matchParticipants[matchParticipants.length - 1]!;
      participant.status = "WALK_OVER";
      participant.isWinner = true;
      participant.resultText = "BYE";
      match.winnerId = shuffledParticipants[participant1Index]!.id;
      match.state = "WALK_OVER";
    }
  }

  
  let currentRoundMatches = firstRoundMatches;
  const roundMatchesByRound: Match[][] = [firstRoundMatches];

  
  for (let round = 2; round <= numRounds; round++) {
    const nextRoundMatches: Match[] = [];
    for (let i = 0; i < currentRoundMatches.length; i += 2) {
      const match = createMatch(round);
      nextRoundMatches.push(match);
      matches.push(match);

      
      if (currentRoundMatches[i]) {
        currentRoundMatches[i]!.nextMatchId = match.id;
      }
      if (currentRoundMatches[i + 1]) {
        currentRoundMatches[i + 1]!.nextMatchId = match.id;
      }
    }
    roundMatchesByRound.push(nextRoundMatches);
    currentRoundMatches = nextRoundMatches;
  }
  
  const advanceByeWinner = (match: Match, winnerAttendeeId: string, round: number) => {
    if (round >= numRounds) return; 
    const nextMatch = matches.find(m => m.id === match.nextMatchId)!;
    
    const otherMatch = matches.find(m => 
      m.nextMatchId === nextMatch.id && m.id !== match.id
    );
    
    const shouldAdvance = () => {
      if (!otherMatch) return true; 
      if (!isMatchBye(otherMatch)) return false; 
      
      const otherMatchParticipants = matchParticipants.filter(mp => mp.matchId === otherMatch.id);
      if (otherMatchParticipants.length === 0) {
        return false;
      }
      return isMatchBye(otherMatch); 
    };
    if (shouldAdvance()) {
      nextMatch.state = "WALK_OVER";
      nextMatch.winnerId = winnerAttendeeId;
      matchParticipants.push(
        createByeParticipant(nextMatch.id, winnerAttendeeId, true)
      );
      if (otherMatch && isMatchBye(otherMatch)) {
        matchParticipants.push(
          createByeParticipant(nextMatch.id, getMatchWinner(otherMatch), false)
        );
      }
      
      advanceByeWinner(nextMatch, winnerAttendeeId, round + 1);
    } else {
      
      matchParticipants.push(
        createByeParticipant(nextMatch.id, winnerAttendeeId, false)
      );
    }
  };

  firstRoundMatches.forEach(match => {
    if (isMatchBye(match)) {
      advanceByeWinner(match, getMatchWinner(match), 1);
    }
  });

  return { matches, matchParticipants };
}

export const buildDoubleEliminationBracket = (matches: MatchWithParticipants[], stage: TournamentStage): MatchType[] => {
  return [];
}