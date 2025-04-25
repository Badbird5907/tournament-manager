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
import { useMemo, useState } from "react";
import type { DateRange } from "react-day-picker";

export const EditTournamentBasic = ({ id }: { id: string }) => {
  const utils = api.useUtils();
  const { data: tournament } = api.tournaments.getById.useQuery({ id });
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
    },
  });
  const onSubmit = (data: z.infer<typeof updateTournamentBasicFormSchema>) => {
    console.log(data);
    if (!tournament?.id) {
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
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
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
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <DatePickerWithRange defaultDate={defaultDate} onSelect={(range) => {
              console.log(range);
            }} />
            <Button type="submit">Save</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
