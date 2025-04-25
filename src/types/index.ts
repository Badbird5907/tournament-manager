import type {
  BuildQueryResult,
  DBQueryConfig,
  ExtractTablesWithRelations,
} from "drizzle-orm";

import { z } from "zod";
import type * as schema from "@/server/db/all";

type Schema = typeof schema;
type TSchema = ExtractTablesWithRelations<Schema>;

export type IncludeRelation<TableName extends keyof TSchema> = DBQueryConfig<
  "one" | "many",
  boolean,
  TSchema,
  TSchema[TableName]
>["with"];

export type InferResultType<
  TableName extends keyof TSchema,
  With extends IncludeRelation<TableName> | undefined = undefined,
> = BuildQueryResult<
  TSchema,
  TSchema[TableName],
  {
    with: With;
  }
>;

/*
function getDefaults<Schema extends z.AnyZodObject>(schema: Schema) {
    return Object.fromEntries(
        Object.entries(schema.shape).map(([key, value]) => {
            if (value instanceof z.ZodDefault) return [key, value._def.defaultValue()]
            return [key, undefined]
        })
    )
}
*/
export const getDefaultValue = <ZodSchema extends z.AnyZodObject>(schema: ZodSchema, key: keyof ZodSchema["shape"]) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const value = schema.shape[key] as z.ZodTypeAny;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  if (value instanceof z.ZodDefault) return value._def.defaultValue();
  return undefined;
}


export type Tournament = InferResultType<"tournaments">;
export type TournamentStage = InferResultType<"tournamentStages">;
export type Match = InferResultType<"matches">;
export type MatchParticipant = InferResultType<"matchParticipants">;
export type TournamentAttendee = InferResultType<"tournamentAttendees">;

export const matchStatusEnum = z.enum(["SCHEDULED", "NO_SHOW", "WALK_OVER", "NO_PARTY", "DONE", "SCORE_DONE"]);
export type MatchStatus = z.infer<typeof matchStatusEnum>;

export const matchParticipantStatusEnum = z.enum(["SCHEDULED","PLAYED", "NO_SHOW", "WALK_OVER", "NO_PARTY"]);
export type MatchParticipantStatus = z.infer<typeof matchParticipantStatusEnum>;

