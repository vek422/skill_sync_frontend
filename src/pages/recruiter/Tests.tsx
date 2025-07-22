import { Button } from "@/components/ui/button";
import { Plus, Loader2, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { TestsDataTable } from "@/components/TestsTable/data-table";
import { createColumns } from "@/components/TestsTable/columns";
import { useGetTestsQuery } from "@/api/testApi";
import { useProfileQuery } from "@/api/authApi";
import { type Test as TableTest } from "@/components/TestTable/columns";
import { type Test as ApiTest } from "@/api/testApi";
import { Card, CardContent } from "@/components/ui/card";

// Transform API test data to table format (use raw status)
const transformTestData = (apiTests: ApiTest[]): TableTest[] => {
  return apiTests.map((test) => ({
    test_id: test.test_id.toString(),
    test_name: test.test_name,
    test_status: test.status, // Use raw API status
    test_created_at: test.created_at,
    test_duration: test.time_limit_minutes || 60,
    total_candidate: 0,
  }));
};

export default function Tests() {
  // Get current user profile to verify filtering
  const { data: profile } = useProfileQuery();
  
  // Fetch tests from API - now expecting direct array response (only current recruiter's tests)
  const { 
    data: testsData, 
    isLoading, 
    error, 
    refetch 
  } = useGetTestsQuery({});
  
  // Log the server response for debugging
  console.log("Current Recruiter Profile:", profile);
  console.log("Tests API Response (My Tests Only):", testsData);
  console.log("Tests Loading:", isLoading);
  console.log("Tests Error:", error);
  
  // Verify filtering is working
  if (testsData && profile) {
    console.log("Filtering Verification:");
    console.log("Current User ID:", profile.user_id);
    console.log("Tests created_by IDs:", testsData.map(test => ({ 
      test_id: test.test_id, 
      test_name: test.test_name,
      created_by: test.created_by 
    })));
  }
  


  // Enhanced delete handler with status checking
  const handleDelete = async (testId: string) => {
    // Find the test to check its status
    const testToDelete = testsData?.find(test => test.test_id.toString() === testId);
    console.log("Deleting test:", testToDelete);
    if (!testToDelete) {
      alert("Test not found!");
      return;
    }

    // Check if test is ongoing
    if (testToDelete.status === "published" || testToDelete.status === "ongoing") {
      alert("⚠️ Cannot Delete Test\n\nThis test is currently ongoing and cannot be deleted. Please wait for the test to complete before attempting to delete it.");
      return;
    }

    // Confirmation dialog for valid deletion
    const confirmMessage = `🗑️ Delete Test Confirmation\n\nAre you sure you want to delete "${testToDelete.test_name}"?\n\nThis action cannot be undone.`;
    
    if (confirm(confirmMessage)) {
      try {
        // TODO: Implement deleteTest API call if available
        alert("Delete test API not implemented. Please contact the developer.");
        console.log("Test deleted successfully");
        alert("✅ Test deleted successfully!");
        // Refetch tests after deletion
        refetch();
      } catch (error) {
        console.error("Failed to delete test:", error);
        alert("❌ Failed to delete test. Please try again.");
      }
    }
  };

  // Handle duplicate (placeholder)
  const handleDuplicate = (testId: string) => {
    console.log("Duplicating test:", testId);
    // TODO: Implement duplicate logic here
  };

  // Create columns with handlers
  const columns = createColumns({
    onDelete: handleDelete,
    onDuplicate: handleDuplicate,
  });

  // Transform API data for table - now handling direct array
  const tableData = testsData ? transformTestData(testsData) : [];
  
  // Log the transformed data for debugging
  console.log("Raw API tests data:", testsData);
  console.log("Transformed table data:", tableData);

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-2xl">My Tests</h1>
        <Link to="/recruiter/test/create">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create New Test
          </Button>
        </Link>
      </div>

      {/* Loading State */}
      {isLoading && (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Loading tests...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <span>Failed to load tests. Please try again.</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => refetch()}
                className="ml-2"
              >
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tests Table */}
      {!isLoading && !error && (
        <TestsDataTable 
          data={tableData} 
          columns={columns} 
        />
      )}

      {/* Empty State */}
      {!isLoading && !error && tableData.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <h3 className="text-lg font-medium">No tests found</h3>
              <p className="text-muted-foreground mt-1">
                You haven't created any tests yet. Create your first test to get started.
              </p>
              <Link to="/recruiter/test/create">
                <Button className="mt-4 gap-2">
                  <Plus className="h-4 w-4" />
                  Create Your First Test
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
