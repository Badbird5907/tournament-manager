import StagePageClient from "@/app/(authenticated)/tournaments/[id]/stage/[stageId]/client";
import { api } from "@/trpc/server";

export default async function StagePage({ params }: { params: Promise<{ id: string, stageId: string }> }) {
  const { id, stageId } = await params;
  await api.tournaments.getStage.prefetch({ tournamentId: id, stageId });
  return (
    <StagePageClient tournamentId={id} stageId={stageId} />
  )
}
