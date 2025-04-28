"use client";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { api } from "@/trpc/react";
import Link from "next/link";
import { toast } from "sonner";

export const StageActions = ({ stageId, tournamentId }: { stageId: string, tournamentId: string }) => {
  const utils = api.useUtils();
  const { mutateAsync: deleteBracket } = api.tournaments.deleteBracket.useMutation({
    onSuccess: async () => {
      await utils.tournaments.getStage.invalidate({ tournamentId, stageId });
    },
  });
  const { mutateAsync: generateBracket } = api.tournaments.generateBracket.useMutation({
    onSuccess: async () => {
      await utils.tournaments.getStage.invalidate({ tournamentId, stageId });
    },
  });
  return (
    <Card>
      <CardHeader>
        <CardTitle>Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-row gap-4">
          <Button onClickLoading={() => deleteBracket({ tournamentId, stageId }).then(() => {
            toast.success("Bracket cleared");
          })}>Clear Bracket</Button>
          <Button onClickLoading={() => generateBracket({ tournamentId, stageId, participants: "ALL" }).then(() => {
            toast.success("Bracket generated");
          })}>Auto-Generate Bracket</Button>
          <Link href={`/tournaments/${tournamentId}/stage/${stageId}/bracket`}>
            <Button>View Bracket</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}