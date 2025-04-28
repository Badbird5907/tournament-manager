import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableRow, TableHead, TableHeader, TableBody, TableCell } from "@/components/ui/table";
import { api } from "@/trpc/react";
import { capitalizeDeep } from "@/lib/utils";
import { Plus, Trash } from "lucide-react";
import Link from "next/link";
import { Spinner } from "@/components/ui/spinner";

export const StageList = ({ id }: { id: string }) => {
  const { data: { tournament, stages } = {}, isLoading } = api.tournaments.getById.useQuery({ id });
  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>Stages</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Bracket Type</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={3}>
                  <Spinner />
                </TableCell>
              </TableRow>
            )}
            {!isLoading && stages?.length === 0 && (
              <TableRow>
                <TableCell colSpan={3}>
                  No stages found! Create one below.
                </TableCell>
              </TableRow>
            )}
            {stages?.map((stage) => (
              <TableRow key={stage.id}>
                <TableCell>{stage.name}</TableCell>
                <TableCell>{capitalizeDeep(stage.bracketType?.replace("_", " ") ?? "<UNKNOWN>")}</TableCell>
                <TableCell>
                  <div className="flex flex-row gap-2">
                    <Link href={`/tournaments/${id}/stage/${stage.id}`}>
                      <Button>
                        Edit
                      </Button>
                    </Link>
                    <Button variant="destructive">
                      <Trash />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <Button className="w-full">
          <Plus />
          Add Stage
        </Button>
      </CardFooter>
    </Card>
  )
};

