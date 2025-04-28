"use client";

import { StageActions } from "@/app/(authenticated)/tournaments/[id]/stage/[stageId]/actions";
import { api } from "@/trpc/react";

export default function StagePageClient({ tournamentId, stageId }: { tournamentId: string, stageId: string }) {
  const { data: { stage, tournament } = {} } = api.tournaments.getStage.useQuery({ tournamentId, stageId });
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-col md:flex-row gap-4">
        <h1 className="text-4xl font-bold">{stage?.name ?? "Unnamed Stage"}</h1>
      </div>
      <div className="grid grid-flow-row md:grid-flow-col grid-cols-1 md:grid-cols-2 gap-4">
        <StageActions stageId={stageId} tournamentId={tournamentId} />
      </div>
    </div>
  )
}
