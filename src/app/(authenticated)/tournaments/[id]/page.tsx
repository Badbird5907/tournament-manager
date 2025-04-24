import { TournamentPageClient } from "@/app/(authenticated)/tournaments/[id]/client";
import { api } from "@/trpc/server";

export default async function TournamentPage({ params }: { params: { id: string } }) {
  const { id } = params;
  await api.tournaments.getById.prefetch({ id });
  return (
    <TournamentPageClient id={id} />
  )
}

