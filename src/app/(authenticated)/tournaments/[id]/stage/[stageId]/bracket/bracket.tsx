"use client";

import { api } from "@/trpc/react";
import { SingleEliminationBracket, Match, SVGViewer, createTheme } from 'react-tournament-brackets';
import { useMemo } from "react";
import { simpleBracket, walkOverData } from "@/app/(authenticated)/tournaments/[id]/stage/[stageId]/bracket/test";

const customTheme = createTheme({
  textColor: { 
    main: 'var(--color-foreground)', 
    highlighted: 'white', 
    dark: 'var(--color-muted-foreground)' 
  },
  matchBackground: { 
    wonColor: 'var(--color-accent)', 
    lostColor: 'var(--color-muted)' 
  },
  score: {
    background: { 
      wonColor: 'var(--color-primary)', 
      lostColor: 'var(--color-secondary)' 
    },
    text: { 
      highlightedWonColor: 'var(--success)', 
      highlightedLostColor: 'var(--color-destructive)' 
    },
  },
  border: {
    color: 'var(--color-border)',
    highlightedColor: 'var(--color-primary)',
  },
  roundHeaders: { 
    background: 'var(--color-primary)',
  },
  fontFamily: 'var(--font-sans)',
  transitionTimingFunction: 'ease-in-out',
  disabledColor: 'var(--color-muted)',
  canvasBackground: 'transparent'
});

export const Bracket = ({ id, stageId, parentRef }: { id: string; stageId: string; parentRef: React.RefObject<HTMLDivElement | null> }) => {
  const { data: bracketData } = api.tournaments.getBracket.useQuery({ tournamentId: id, stageId });
  console.log(JSON.stringify(bracketData, null, 2));
  const { width, height } = useMemo(() => {
    let width = parentRef?.current?.clientWidth ?? 32;
    if (width < 128) {
      width = 128;
    }
    let height = parentRef?.current?.clientHeight ?? 64;
    if (height < 128) {
      height = 128;
    }
    return { width, height };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parentRef, parentRef?.current, parentRef?.current?.clientWidth, parentRef?.current?.clientHeight]);
  if (!bracketData || !parentRef) {
    return <div className="w-full h-full flex items-center justify-center">Loading bracket...</div>;
  }
  if (bracketData.length === 0) {
    return <div className="w-full h-full flex items-center justify-center">
      The bracket has not been generated yet!
    </div>;
  }
  return (
    <div className="w-full min-h-screen h-full flex">
      <SingleEliminationBracket
        matches={bracketData}
        matchComponent={Match}
        theme={customTheme}
        options={{
          style: {
            roundHeader: {
              backgroundColor: customTheme.roundHeaders.background,
            },
          },
        }}
        svgWrapper={({ children, ...props }: { children: React.ReactNode }) => (
          <SVGViewer 
            width={width} 
            height={height - 48}
            bracketWidth={width}
            bracketHeight={height - 64}
            background={customTheme.canvasBackground}
            SVGBackground={customTheme.canvasBackground}
            {...props}
            className="w-full h-full"
          >
            {children}
          </SVGViewer>
        )}
      />
    </div>
  );
};
