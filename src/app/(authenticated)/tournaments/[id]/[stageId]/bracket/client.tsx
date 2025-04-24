"use client";

import { api } from "@/trpc/react";
import { SingleEliminationBracket, DoubleEliminationBracket, Match, SVGViewer } from '@g-loot/react-tournament-brackets';
import { useWindowSize } from "@/hooks/use-window-size";
import { useMemo } from "react";

export const TournamentBracketClient = ({ id, stageId }: { id: string; stageId: string }) => {
  const { data: bracketData } = api.tournaments.getBracket.useQuery({ tournamentId: id, stageId });
  const [width, height] = useWindowSize();
  const { finalWidth, finalHeight } = useMemo(() => {
    if (!width || !height) {
      return {
        finalWidth: 0,
        finalHeight: 0,
      };
    }
    return {
      finalWidth: Math.max(width - 50, 500),
      finalHeight: Math.max(height - 100, 500),
    };
  }, [width, height]);

  if (!bracketData) {
    return <div>Loading bracket...</div>;
  }

  const commonProps = {
    matchComponent: Match,
    svgWrapper: ({ children, ...props }: { children: React.ReactNode }) => (
      <SVGViewer width={finalWidth} height={finalHeight} {...props}>
        {children}
      </SVGViewer>
    ),
  };
  return (
    <SingleEliminationBracket
      matches={bracketData}
      {...commonProps}
    />
  );
};
