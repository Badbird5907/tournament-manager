import { ParticipantsPageClient } from "@/app/(authenticated)/tournaments/[id]/participants/client";
import { api, HydrateClient } from "@/trpc/server";

export default async function ParticipantsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await api.tournaments.getParticipants.prefetch({ tournamentId: id });
  return (
    <ParticipantsPageClient tournamentId={id} />
  )
}
