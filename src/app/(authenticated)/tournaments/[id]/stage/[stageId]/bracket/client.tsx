"use client";
import { useRef } from "react";
import { Bracket } from "./bracket";

export const TournamentBracketClient = ({ id, stageId }: { id: string; stageId: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div className="w-full h-full flex" ref={ref}>
      <Bracket id={id} stageId={stageId} parentRef={ref} />
    </div>
  );
};
