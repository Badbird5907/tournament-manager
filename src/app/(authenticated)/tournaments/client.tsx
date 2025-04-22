"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { api } from "@/trpc/react";
import type { Tournament } from "@/types";
import type { ColumnDef } from "@tanstack/react-table";

/*

export const tournaments = createTable("tournaments", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  endDate: timestamp("end_date"), // Optional end date
  bracketType: pgBracketType("bracket_type").notNull(),
  owner: uuid("owner").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});*/
const columns: ColumnDef<Tournament>[] = [
  {
    header: "Name",
    accessorKey: "name",
  },
  {
    header: "Slug",
    accessorKey: "slug",
  },
  {
    header: "Owner",
    accessorKey: "owner",
  },
  {
    header: "Created At",
    accessorKey: "createdAt",
  },
  {
    header: "Updated At",
    accessorKey: "updatedAt",
  },
  {
    header: "Bracket Type",
    accessorKey: "bracketType",
  },
  {
    header: "End Date",
    accessorKey: "endDate",
    cell: ({ row }) => {
      const tournament = row.original;
      return (
        <div>
          {tournament.endDate ? new Date(tournament.endDate).toLocaleDateString() : "N/A"}
        </div>
      )
    }
  },
  {
    header: "Actions",
    accessorKey: "actions",
    cell: ({ row }) => {
      const tournament = row.original;
      return (
        <div>
          <Button>Edit</Button>
        </div>
      )
    }
  },
];

export default function TournamentsClient() {
  const { data, isLoading } = api.tournaments.getAll.useQuery();
  return (
    <div>
      <DataTable
        columns={columns}
        loading={isLoading}
        data={data ?? []}
      />
    </div>
  )
}
