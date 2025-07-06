import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type Test = {
  test_id: string;
  test_name: string;
  test_status: "draft" | "ongoing" | "completed" | "scheduled";
  test_created_at: string;
  test_duration: number; // in minutes
  total_candidate: number;
};
export const testData: Test[] = [
  {
    test_id: "TST-001",
    test_name: "React Fundamentals",
    test_status: "draft",
    test_created_at: "2025-06-20T10:00:00Z",
    test_duration: 45,
    total_candidate: 0,
  },
  {
    test_id: "TST-002",
    test_name: "JavaScript Aptitude",
    test_status: "scheduled",
    test_created_at: "2025-06-18T09:00:00Z",
    test_duration: 60,
    total_candidate: 35,
  },
  {
    test_id: "TST-003",
    test_name: "Node.js Backend Challenge",
    test_status: "ongoing",
    test_created_at: "2025-06-15T12:30:00Z",
    test_duration: 75,
    total_candidate: 28,
  },
  {
    test_id: "TST-004",
    test_name: "Frontend Internship Test",
    test_status: "completed",
    test_created_at: "2025-06-10T08:45:00Z",
    test_duration: 90,
    total_candidate: 42,
  },
  {
    test_id: "TST-005",
    test_name: "SQL Query Writing",
    test_status: "draft",
    test_created_at: "2025-06-22T11:15:00Z",
    test_duration: 30,
    total_candidate: 0,
  },
  {
    test_id: "TST-006",
    test_name: "Data Structures Assessment",
    test_status: "scheduled",
    test_created_at: "2025-06-19T13:00:00Z",
    test_duration: 60,
    total_candidate: 20,
  },
  {
    test_id: "TST-007",
    test_name: "React + TypeScript Round",
    test_status: "ongoing",
    test_created_at: "2025-06-17T10:30:00Z",
    test_duration: 45,
    total_candidate: 15,
  },
  {
    test_id: "TST-008",
    test_name: "Full Stack Evaluation",
    test_status: "completed",
    test_created_at: "2025-06-05T16:00:00Z",
    test_duration: 90,
    total_candidate: 38,
  },
  {
    test_id: "TST-009",
    test_name: "Logical Reasoning Test",
    test_status: "draft",
    test_created_at: "2025-06-23T14:45:00Z",
    test_duration: 30,
    total_candidate: 0,
  },
  {
    test_id: "TST-010",
    test_name: "Python Coding Basics",
    test_status: "scheduled",
    test_created_at: "2025-06-20T15:15:00Z",
    test_duration: 60,
    total_candidate: 40,
  },
  {
    test_id: "TST-011",
    test_name: "System Design Quiz",
    test_status: "completed",
    test_created_at: "2025-06-01T11:00:00Z",
    test_duration: 60,
    total_candidate: 22,
  },
  {
    test_id: "TST-012",
    test_name: "API Integration Test",
    test_status: "ongoing",
    test_created_at: "2025-06-21T17:00:00Z",
    test_duration: 45,
    total_candidate: 12,
  },
  {
    test_id: "TST-013",
    test_name: "HTML + CSS Basics",
    test_status: "draft",
    test_created_at: "2025-06-24T09:00:00Z",
    test_duration: 30,
    total_candidate: 0,
  },
  {
    test_id: "TST-014",
    test_name: "Java Coding Round",
    test_status: "scheduled",
    test_created_at: "2025-06-18T18:30:00Z",
    test_duration: 75,
    total_candidate: 26,
  },
  {
    test_id: "TST-015",
    test_name: "General Aptitude Test",
    test_status: "completed",
    test_created_at: "2025-06-07T08:15:00Z",
    test_duration: 60,
    total_candidate: 50,
  },
];

export const columns: ColumnDef<Test>[] = [
  {
    accessorKey: "test_id",
    header: "Test ID",
  },
  {
    accessorKey: "test_name",
    header: "Test Name",
  },
  {
    accessorKey: "test_status",
    header: "Status",
    cell: ({ getValue }) => {
      const status = getValue() as string;
      const getStatusBadgeProps = (status: string) => {
        switch (status) {
          case "draft":
            return {
              variant: "outline" as const,
              className: "border-gray-300 text-gray-600 bg-gray-50",
            };
          case "scheduled":
            return {
              variant: "outline" as const,
              className: "border-blue-300 text-blue-700 bg-blue-50",
            };
          case "ongoing":
            return {
              variant: "outline" as const,
              className: "border-yellow-300 text-yellow-700 bg-yellow-50",
            };
          case "completed":
            return {
              variant: "outline" as const,
              className: "border-green-300 text-green-700 bg-green-50",
            };
          default:
            return {
              variant: "outline" as const,
              className: "",
            };
        }
      };

      const { variant, className } = getStatusBadgeProps(status);

      return (
        <Badge variant={variant} className={cn(className)}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "test_created_at",
    header: "Created At",
    cell: ({ getValue }) => new Date(getValue() as string).toLocaleDateString(),
  },
  {
    accessorKey: "test_duration",
    header: "Duration (mins)",
  },
  {
    accessorKey: "total_candidate",
    header: "Candidates",
  },
];
