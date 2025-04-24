"use client";

import { api } from "@/trpc/react";

export const TournamentPageClient = ({ id }: { id: string }) => {
  const { data: tournament } = api.tournaments.getById.useQuery({ id });
  return (
    <div>
      <h1>{tournament?.name}</h1>
    </div>
  );
};
