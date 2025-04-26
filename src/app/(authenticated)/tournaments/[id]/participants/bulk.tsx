import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";
import type { TRPCError } from "@trpc/server";
import { ImportIcon, Trash2Icon, UploadIcon } from "lucide-react"
import { useMemo, useState, useCallback } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";

export const BulkAddParticipantsPage = ({ tournamentId }: { tournamentId: string }) => {
  // user uploads a txt file with one display name per line
  // we read the file as soon as the user uploads it, and we display a table of the names
  const [state, setState] = useState<"idle" | "loading" | "confirm" | "uploading">("idle");
  const [names, setNames] = useState<{ id: string, name: string }[]>([]);
  const [open, setOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const utils = api.useUtils();
  const bulkAddParticipants = api.tournaments.bulkAddParticipants.useMutation({
    onSuccess: async () => {
      await utils.tournaments.getParticipants.invalidate();
      setOpen(false);
      setState("idle");
      setNames([]);
    }
  });

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const names = text.split("\n").filter(name => name.trim() !== "");
      setNames(names.map((name, i) => ({ id: i.toString(), name })));
      setState("confirm");
    }
    reader.readAsText(file);
  }, []);

  const handleFileSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const file = formData.get("file") as File;
    handleFile(file);
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file && file.type === "text/plain") {
      handleFile(file);
    } else {
      toast.error("Please upload a text file");
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const columns = useMemo(() => [
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: ({ row }: { row: { original: { id: string } } }) => {
        const id = row.original.id;
        return (
          <Button variant="destructive" size="icon" onClick={() => {
            setNames(names.filter((name) => name.id !== id));
          }}>
            <Trash2Icon className="w-4 h-4" />
          </Button>
        )
      }
    }
  ], [names]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <ImportIcon className="w-4 h-4" />
          Bulk Add Participants
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bulk Add Participants</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Upload a txt file with one display name per line.
        </DialogDescription>
        {state === "idle" && (
          <div className="space-y-4">
            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
                isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"
              )}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <UploadIcon className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Drag and drop your text file here, or click to select
              </p>
              <form onSubmit={handleFileSubmit} className="mt-4">
                <Input
                  type="file"
                  name="file"
                  accept=".txt"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleFile(file);
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const input: HTMLInputElement | null = document.querySelector('input[type="file"]');
                    input?.click();
                  }}
                >
                  Select File
                </Button>
              </form>
            </div>
          </div>
        )}
        {state === "confirm" && (
          <>
            <div className="w-full">
              <DataTable columns={columns} data={names} scrollable="h-[300px] overflow-y-auto w-full" />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setState("idle");
                  setNames([]);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setState("uploading");
                  bulkAddParticipants.mutateAsync({
                    tournamentId,
                    displayNames: names.map((name) => name.name),
                  }).catch((e) => {
                    toast.error("Failed to add participants", {
                      description: (e as TRPCError).message,
                    });
                    setOpen(false);
                  });
                }}
              >
                Upload
              </Button>
            </div>
          </>
        )}
        {state === "uploading" && (
          <div className="flex justify-center items-center">
            <Spinner className="w-8 h-8" />
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
