import { TournamentBracketClient } from "@/app/(authenticated)/tournaments/[id]/stage/[stageId]/bracket/client";

export default async function TournamentBracketPage({ params }: { params: Promise<{ id: string; stageId: string }> }) {
  const { id, stageId } = await params;
  return (
    <TournamentBracketClient id={id} stageId={stageId} />
  );
}
