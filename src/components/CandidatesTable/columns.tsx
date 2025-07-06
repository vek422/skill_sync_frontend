import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, MoreHorizontal, ArrowUpDown } from "lucide-react";

export type Candidate = {
  id: number;
  name: string;
  email: string;
  status: "Completed" | "In Progress" | "Not Started";
  score: number | null;
  timeSpent: string | null;
  skills: {
    react: number;
    javascript: number;
    typescript: number;
    problemSolving: number;
    systemDesign: number;
  } | null;
};

const getStatusBadge = (status: string) => {
  const variants = {
    Completed: "bg-green-100 text-green-800",
    "In Progress": "bg-yellow-100 text-yellow-800",
    "Not Started": "bg-red-100 text-red-800",
  };
  return (
    variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800"
  );
};

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

export const columns: ColumnDef<Candidate>[] = [
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
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => {
      const status = getValue() as string;
      return <Badge className={getStatusBadge(status)}>{status}</Badge>;
    },
  },
  {
    accessorKey: "score",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent p-0 h-auto font-semibold"
        >
          Score
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ getValue }) => {
      const score = getValue() as number | null;
      return score ? `${score}%` : "-";
    },
    sortingFn: (rowA, rowB) => {
      const scoreA = rowA.original.score;
      const scoreB = rowB.original.score;

      // Handle null values - put them at the end
      if (scoreA === null && scoreB === null) return 0;
      if (scoreA === null) return 1;
      if (scoreB === null) return -1;

      return scoreA - scoreB;
    },
  },
  {
    accessorKey: "timeSpent",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent p-0 h-auto font-semibold"
        >
          Time Taken
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ getValue }) => {
      const timeSpent = getValue() as string | null;
      return timeSpent || "-";
    },
    sortingFn: (rowA, rowB) => {
      const timeA = rowA.original.timeSpent;
      const timeB = rowB.original.timeSpent;

      // Handle null values - put them at the end
      if (timeA === null && timeB === null) return 0;
      if (timeA === null) return 1;
      if (timeB === null) return -1;

      // Extract numeric value from time string (e.g., "54 min" -> 54)
      const getTimeValue = (timeString: string) => {
        const match = timeString.match(/(\d+)/);
        return match ? parseInt(match[1]) : 0;
      };

      return getTimeValue(timeA) - getTimeValue(timeB);
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const candidate = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="gap-2">
              <Eye className="h-4 w-4" />
              View Report
            </DropdownMenuItem>
            {candidate.status === "Not Started" && (
              <DropdownMenuItem className="gap-2">Re-invite</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
