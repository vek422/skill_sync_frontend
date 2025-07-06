import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import TestDistributionChart from "@/components/TestDistributionChart";
import { testData, type Test } from "@/components/TestTable/columns";
import {
  CalendarDays,
  Users,
  CheckSquare,
  Plus,
  TrendingUp,
  Activity,
} from "lucide-react";

export default function Dashboard() {
  // Calculate KPIs from test data
  const scheduledTests = testData.filter(
    (test) => test.test_status === "scheduled"
  ).length;
  const totalCandidates = testData.reduce(
    (sum, test) => sum + test.total_candidate,
    0
  );
  const completedTests = testData.filter(
    (test) => test.test_status === "completed"
  ).length;
  const ongoingTests = testData.filter(
    (test) => test.test_status === "ongoing"
  ).length;

  // Prepare chart data
  const chartData = [
    { type: "scheduled", value: scheduledTests },
    { type: "ongoing", value: ongoingTests },
    { type: "completed", value: completedTests },
    {
      type: "draft",
      value: testData.filter((test) => test.test_status === "draft").length,
    },
  ].filter((item) => item.value > 0); // Only show categories with data

  // Get recent tests (last 5)
  const recentTests = testData
    .sort(
      (a, b) =>
        new Date(b.test_created_at).getTime() -
        new Date(a.test_created_at).getTime()
    )
    .slice(0, 5);

  const getStatusBadgeProps = (status: Test["test_status"]) => {
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

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your testing activity and candidate engagement
          </p>
        </div>
        <Link to="/recruiter/test/create">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create New Test
          </Button>
        </Link>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Section - 8 columns */}
        <div className="lg:col-span-8 space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Scheduled Tests Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Scheduled Tests
                </CardTitle>
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{scheduledTests}</div>
                <p className="text-xs text-muted-foreground">
                  Tests ready to start
                </p>
              </CardContent>
            </Card>

            {/* Total Candidates Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Candidates
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalCandidates}</div>
                <p className="text-xs text-muted-foreground">
                  Across all tests
                </p>
              </CardContent>
            </Card>

            {/* Completed Tests Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Completed Tests
                </CardTitle>
                <CheckSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completedTests}</div>
                <p className="text-xs text-muted-foreground">
                  Successfully finished
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Tests Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Tests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {recentTests.map((test) => (
                    <div
                      key={test.test_id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{test.test_name}</h3>
                          <Badge {...getStatusBadgeProps(test.test_status)}>
                            {test.test_status}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {test.test_id} • {test.total_candidate} candidates •{" "}
                          {test.test_duration}min
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(test.test_created_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>

                {/* View All Tests Link */}
                <div className="mt-4 pt-4 border-t">
                  <Link to="/recruiter/tests">
                    <Button variant="outline" className="w-full">
                      View All Tests
                    </Button>
                  </Link>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Section - 4 columns */}
        <div className="lg:col-span-4 space-y-6">
          {/* Test Distribution Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Test Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
                <TestDistributionChart data={chartData} />
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No test data available</p>
                    <p className="text-sm">
                      Create your first test to see distribution
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats Card */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Active Tests
                </span>
                <span className="font-medium">{ongoingTests}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Draft Tests
                </span>
                <span className="font-medium">
                  {
                    testData.filter((test) => test.test_status === "draft")
                      .length
                  }
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Avg. Duration
                </span>
                <span className="font-medium">
                  {testData.length > 0
                    ? Math.round(
                        testData.reduce(
                          (sum, test) => sum + test.test_duration,
                          0
                        ) / testData.length
                      )
                    : 0}
                  min
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Total Tests
                </span>
                <span className="font-medium">{testData.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
