import { z } from "zod";

export const updateTournamentBasicFormSchema = z.object({
  name: z.string().min(1),
  startDate: z.date(),
  endDate: z.date(),
  slug: z.string().min(1).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
});

