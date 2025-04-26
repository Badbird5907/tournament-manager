"use client";

import { DataTable } from "@/components/ui/data-table";
import { api } from "@/trpc/react";
import { useMemo } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";
import { Dialog, DialogTitle, DialogContent, DialogHeader, DialogTrigger, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { toast } from "sonner";
import type { TRPCError } from "@trpc/server";
import { AddParticipantDialog } from "@/app/(authenticated)/tournaments/[id]/participants/add";
import { BulkAddParticipantsPage } from "@/app/(authenticated)/tournaments/[id]/participants/bulk";

export const ParticipantsPageClient = ({ tournamentId }: { tournamentId: string }) => {
  const { data: participants, isLoading } = api.tournaments.getParticipants.useQuery({ tournamentId });
  const utils = api.useUtils();
  const removeParticipant = api.tournaments.removeParticipant.useMutation({
    onSuccess: async () => {
      await utils.tournaments.getParticipants.invalidate();
    }
  });
  const columns = useMemo(() => [
    {
      header: "Name",
      accessorKey: "displayName",
    },
    {
      header: "Added",
      accessorKey: "createdAt",
      cell: ({ row }: { row: { original: { createdAt: Date } } }) => {
        const createdAt = row.original.createdAt;
        return <span>{format(createdAt, "MMM d, yyyy")}</span>;
      }
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: ({ row }: { row: { original: { id: string } } }) => {
        const id = row.original.id;
        return (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive" size="icon">
                <Trash2Icon className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Remove Participant</DialogTitle>
              </DialogHeader>
              <DialogDescription>
                Are you sure you want to remove this participant?
                This can cause some issues with the bracket! It is highly recommended you do not
                remove participants after generating a bracket.
              </DialogDescription>
              <DialogFooter className="flex flex-row gap-2 w-full">
                <Button variant="destructive" size="icon" className="w-full" onClickLoading={() => removeParticipant.mutateAsync({ tournamentId, participantId: id })
                .then(() => {
                  toast.success("Participant removed");
                })
                .catch((e) => {
                  toast.error("Failed to remove participant", {
                    description: (e as TRPCError).message,
                  });
                })}>
                  Yes, I know what I&apos;m doing
                </Button>
                <DialogClose asChild>
                  <Button variant="outline" className="w-full">
                    Cancel
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        );
      }
    }
  ], [removeParticipant, tournamentId]);
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Participants</h1>
      <DataTable columns={columns} data={participants ?? []} loading={isLoading} actionsBar={
        <div className="flex flex-row gap-2">
          <AddParticipantDialog tournamentId={tournamentId} />
          <BulkAddParticipantsPage tournamentId={tournamentId} />
        </div>
      } />
    </div>
  )
}
