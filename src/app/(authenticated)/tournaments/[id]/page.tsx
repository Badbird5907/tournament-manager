import { TournamentPageClient } from "@/app/(authenticated)/tournaments/[id]/client";
import { api, HydrateClient } from "@/trpc/server";

export default async function TournamentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await api.tournaments.getById.prefetch({ id });
  return (
    <HydrateClient>
      <TournamentPageClient id={id} />
    </HydrateClient>
  )
}

