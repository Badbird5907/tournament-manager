import { PlusIcon } from "lucide-react"

import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import type { TRPCError } from "@trpc/server";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const schema = z.object({
  displayName: z.string().min(1),
});
export const AddParticipantDialog = ({ tournamentId }: { tournamentId: string }) => {
  const utils = api.useUtils();
  const addParticipant = api.tournaments.addParticipant.useMutation({
    onSuccess: async () => {
      await utils.tournaments.getParticipants.invalidate();
    }
  });
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      displayName: "",
    },
  });
  const onSubmit = (data: z.infer<typeof schema>) => {
    addParticipant.mutateAsync({ tournamentId, displayName: data.displayName })
      .then(() => {
        toast.success("Participant added successfully");
      })
      .catch((e) => {
        toast.error("Failed to add participant", {
          description: (e as TRPCError).message,
        });
      })
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button><PlusIcon className="w-4 h-4" /> Add Participant</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Participant</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Add a new participant to the tournament.
        </DialogDescription>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" onClickLoading={() => addParticipant.mutateAsync({ tournamentId, displayName: form.getValues().displayName })}>Add Participant</Button>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
