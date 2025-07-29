import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Candidate } from "@/api/candidatesApi";

export const candidateColumns: ColumnDef<Candidate>[] = [
  {
    accessorKey: "user_id",
    header: "ID",
    cell: ({ getValue }) => getValue(),
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ getValue }) => getValue(),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ getValue }) => getValue(),
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ getValue }) => <Badge variant="outline">{getValue() as string}</Badge>,
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ getValue }) => new Date(getValue() as string).toLocaleDateString(),
  },
];

export function CandidatesTable({ data, onRowClick }: { data: Candidate[]; onRowClick: (candidate: Candidate) => void }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns: candidateColumns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: "includesString",
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <div className="w-full flex flex-col gap-6">
      <Card className="p-4">
        <div className="flex gap-4 items-center flex-wrap">
          <div className="relative flex-1 min-w-[300px]">
            <Input
              placeholder="Search by name or email..."
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </Card>
      <div className="text-sm text-muted-foreground">
        Showing {table.getFilteredRowModel().rows.length} of {data.length} candidates
      </div>
      <div className="rounded-md border overflow-hidden">
        <ScrollArea className="h-[70vh]">
          <Table>
            <TableHeader className="bg-secondary text-secondary-foreground sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="hover:bg-muted/80 cursor-pointer transition-all duration-200 hover:shadow-sm"
                    onClick={() => onRowClick(row.original)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={candidateColumns.length} className="h-24 text-center">
                    {globalFilter ? "No candidates match your search." : "No candidates found."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    </div>
  );
}
