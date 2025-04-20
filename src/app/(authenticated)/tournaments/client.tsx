"use client";

import { DataTable } from "@/components/ui/data-table";
import { api } from "@/trpc/react";
import type { Tournament } from "@/types";
import type { ColumnDef } from "@tanstack/react-table";

const columns: ColumnDef<Tournament>[] = [
  {
    header: "Name",
    accessorKey: "name",
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
