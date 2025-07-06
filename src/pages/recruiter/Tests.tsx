import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { testData } from "@/components/TestTable/columns";
import { TestsDataTable } from "@/components/TestsTable/data-table";
import { createColumns } from "@/components/TestsTable/columns";

export default function Tests() {
  // Handle delete (placeholder)
  const handleDelete = (testId: string) => {
    if (confirm(`Are you sure you want to delete test ${testId}?`)) {
      console.log("Deleting test:", testId);
      // Implement delete logic here
    }
  };

  // Handle duplicate (placeholder)
  const handleDuplicate = (testId: string) => {
    console.log("Duplicating test:", testId);
    // Implement duplicate logic here
  };

  // Create columns with handlers
  const columns = createColumns({
    onDelete: handleDelete,
    onDuplicate: handleDuplicate,
  });

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-2xl">All Tests</h1>
        <Link to="/recruiter/test/create">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create New Test
          </Button>
        </Link>
      </div>

      {/* Tests Table */}
      <TestsDataTable data={testData} columns={columns} />
    </div>
  );
}
