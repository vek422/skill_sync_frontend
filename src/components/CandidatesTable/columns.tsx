import { type ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback } from "../ui/avatar";

import type { Candidate } from "@/api/candidateApi";

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

export const candidateColumns: ColumnDef<Candidate>[] = [
  {
    accessorKey: "name",
    header: "Candidate",
    cell: ({ row }) => {
      const candidate = row.original;
      return (
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs">
              {getInitials(candidate.name)}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium">{candidate.name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
];
