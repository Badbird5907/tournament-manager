import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableRow, TableHead, TableHeader, TableBody, TableCell } from "@/components/ui/table";
import { api } from "@/trpc/react";
import { capitalizeDeep } from "@/lib/utils";

export const TournamentStages = ({ id }: { id: string }) => {
  const { data: { tournament, stages } = {} } = api.tournaments.getById.useQuery({ id });
  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Bracket Type</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stages?.map((stage) => (
            <TableRow key={stage.id}>
              <TableCell>{stage.name}</TableCell>
              <TableCell>{capitalizeDeep(stage.bracketType ?? "<UNKNOWN>")}</TableCell>
              <TableCell>
                <Button>Edit</Button>
                <Button>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
};

