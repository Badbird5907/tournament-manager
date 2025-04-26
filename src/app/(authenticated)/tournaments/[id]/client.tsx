"use client";

import { EditTournamentBasic } from "@/app/(authenticated)/tournaments/[id]/edit";
import { StageList } from "@/app/(authenticated)/tournaments/[id]/stages";
import { api } from "@/trpc/react";

export const TournamentPageClient = ({ id }: { id: string }) => {
  const { data: { tournament } = {} } = api.tournaments.getById.useQuery({ id });
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-col md:flex-row gap-4">
        <h1 className="text-4xl font-bold">{tournament?.name ?? "Unnamed Tournament"}</h1>
      </div>
      <div className="grid grid-flow-row md:grid-flow-col grid-cols-1 md:grid-cols-2 gap-4">
        <EditTournamentBasic id={id} />
        <StageList id={id} />
      </div>
    </div>
  );
};
