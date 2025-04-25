"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { capitalizeDeep } from "@/lib/utils";
import { api } from "@/trpc/react";
import type { Tournament } from "@/types";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

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
    header: "Created",
    accessorKey: "createdAt",
    cell: ({ row }) => {
      const tournament = row.original;
      return (
        <div>{new Date(tournament.createdAt).toLocaleDateString()}</div>
      )
    }
  },
  {
    header: "Last Updated",
    accessorKey: "updatedAt",
    cell: ({ row }) => {
      const tournament = row.original;
      const date = new Date(tournament.updatedAt);
      return (
        <div>{date.toLocaleDateString() + " " + date.toLocaleTimeString()}</div>
      )
    }
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
          <Link href={`/tournaments/${tournament.id}`}>
            <Button>Edit</Button>
          </Link>
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
