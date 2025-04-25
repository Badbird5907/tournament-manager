"use client";
import { api } from "@/trpc/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateTournamentBasicFormSchema } from "@/types/forms/tournament";
import { type z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import type { TRPCError } from "@trpc/server";
import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { useMemo } from "react";

export const EditTournamentBasic = ({ id }: { id: string }) => {
  const utils = api.useUtils();
  const { data: { tournament } = {} } = api.tournaments.getById.useQuery({ id });
  const updateTournament = api.tournaments.update.useMutation({
    onSuccess: async () => {
      await utils.tournaments.getById.invalidate({ id });
    },
  });
  const form = useForm<z.infer<typeof updateTournamentBasicFormSchema>>({
    resolver: zodResolver(updateTournamentBasicFormSchema),
    defaultValues: {
      name: tournament?.name,
      slug: tournament?.slug,
      startDate: tournament?.startDate ? new Date(tournament.startDate) : undefined,
      endDate: tournament?.endDate ? new Date(tournament.endDate) : undefined,
    },
  });
  const onSubmit = (data: z.infer<typeof updateTournamentBasicFormSchema>) => {
    console.log(data);
    if (!tournament?.id) {
      console.error("Tournament not found");
      return;
    }
    updateTournament.mutateAsync({
      ...data,
      tournamentId: tournament.id,
    }).then(() => {
      toast.success("Tournament updated");
    }).catch((error: TRPCError) => {
      toast.error(error.message);
    });
  }
  const defaultDate = useMemo(() => {
    if (!tournament?.startDate || !tournament.endDate) {
      return undefined;
    }
    return {
      from: new Date(tournament.startDate),
      to: new Date(tournament.endDate),
    }
  }, [tournament?.startDate, tournament?.endDate])
  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-row gap-4 w-full">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="py-4 space-y-2">
              <FormLabel>Date Range</FormLabel>
              <DatePickerWithRange className="w-full" defaultDate={defaultDate} onRangeSelect={(range) => {
                if (range?.from) {
                  form.setValue("startDate", range.from, { shouldValidate: true });
                }
                if (range?.to) {
                  form.setValue("endDate", range.to, { shouldValidate: true });
                }
              }} />
            </div>
            <Button type="submit" className="w-full" loading={updateTournament.isPending}>Save</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
