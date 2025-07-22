import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import TestDistributionChart from "@/components/TestDistributionChart";
import { useGetRecruiterDashboardSummaryQuery } from "@/api/candidateApi";
import {
  CalendarDays,
  Users,
  CheckSquare,
  Plus,
  TrendingUp,
  Activity,
} from "lucide-react";

export default function Dashboard() {
  // Fetch real dashboard data from API
  const { data, isLoading, error } = useGetRecruiterDashboardSummaryQuery();

  // Show loading and error states
  if (isLoading) {
    return <div className="p-6">Loading dashboard...</div>;
  }
  if (error || !data) {
    return (
      <div className="p-6 text-red-600">Failed to load dashboard data.</div>
    );
  }

  // Destructure API data
  const scheduledTests = data.scheduled_tests;
  const totalCandidates = data.total_candidates;
  const completedTests = data.completed_tests;
  const chartData = data.test_distribution.map((item) => ({
    type: item.label.toLowerCase(),
    value: item.count,
  }));
  const recentTests = data.recent_tests;
  const quickStats = data.quick_stats;

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
            <Card className="bg-gradient-to-br from-blue-100 to-blue-300 border-0 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-bold text-blue-900">
                  Scheduled Tests
                </CardTitle>
                <CalendarDays className="h-6 w-6 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-blue-900">{scheduledTests}</div>
                <p className="text-xs text-blue-800 font-semibold">
                  Tests ready to start
                </p>
              </CardContent>
            </Card>

            {/* Total Candidates Card */}
            <Card className="bg-gradient-to-br from-purple-100 to-purple-300 border-0 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-bold text-purple-900">
                  Total Candidates
                </CardTitle>
                <Users className="h-6 w-6 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-purple-900">{totalCandidates}</div>
                <p className="text-xs text-purple-800 font-semibold">
                  Across all tests
                </p>
              </CardContent>
            </Card>

            {/* Completed Tests Card */}
            <Card className="bg-gradient-to-br from-green-100 to-green-300 border-0 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-bold text-green-900">
                  Completed Tests
                </CardTitle>
                <CheckSquare className="h-6 w-6 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-green-900">{completedTests}</div>
                <p className="text-xs text-green-800 font-semibold">
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
                      className="flex items-center justify-between p-3 border rounded-lg bg-white/80 hover:bg-blue-50 transition-colors shadow-sm"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-lg text-gray-800">{test.name}</h3>
                          <Badge
                            className={`px-2 py-1 rounded text-xs font-semibold 
                              ${test.status === "draft" ? "bg-gray-200 text-gray-800" : ""}
                              ${test.status === "scheduled" ? "bg-blue-200 text-blue-800" : ""}
                              ${test.status === "ongoing" ? "bg-yellow-200 text-yellow-800" : ""}
                              ${test.status === "completed" ? "bg-green-200 text-green-800" : ""}
                              ${test.status === "ended" ? "bg-red-200 text-red-800" : ""}
                            `}
                          >
                            {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          <span className="font-semibold">{test.test_id}</span> • <span className="font-semibold">{test.candidate_count}</span> candidates • <span className="font-semibold">{test.duration_minutes}</span>min
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-purple-700">
                        {test.date}
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
          <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-0 shadow-md">
            <CardHeader>
              <CardTitle className="font-bold text-gray-900">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-blue-700">
                  Active Tests
                </span>
                <span className="font-bold text-blue-700 bg-blue-100 px-2 py-1 rounded">
                  {data.quick_stats.active_tests}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-orange-700">
                  Draft Tests
                </span>
                <span className="font-bold text-orange-700 bg-orange-100 px-2 py-1 rounded">
                  {data.quick_stats.draft_tests}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-purple-700">
                  Avg. Duration
                </span>
                <span className="font-bold text-purple-700 bg-purple-100 px-2 py-1 rounded">
                  {data.quick_stats.avg_duration_minutes} min
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-green-700">
                  Total Tests
                </span>
                <span className="font-bold text-green-700 bg-green-100 px-2 py-1 rounded">
                  {data.quick_stats.total_tests}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
