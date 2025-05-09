import { TournamentPageClient } from "@/app/(authenticated)/tournaments/[id]/client";
import { api } from "@/trpc/server";

export default async function TournamentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await api.tournaments.getById.prefetch({ id });
  return (
    <TournamentPageClient id={id} />
  )
}

