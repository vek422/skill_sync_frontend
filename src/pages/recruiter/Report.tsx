import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from "recharts";
import { Users, TrendingUp, Clock, Award, Download } from "lucide-react";
import { DataTable } from "@/components/CandidatesTable/data-table";
import { columns, type Candidate } from "@/components/CandidatesTable/columns";

// Mock data - replace with actual API calls
const testData = {
  name: "React Developer Assessment",
  dateconducted: "2025-01-15",
  totalCandidates: 25,
  completionRate: 76,
  averageScore: 78.5,
  averageTime: "52 min",
};

const completionData = [
  { name: "Completed", value: 19, color: "#10b981" },
  { name: "In Progress", value: 4, color: "#f59e0b" },
  { name: "Not Started", value: 2, color: "#ef4444" },
];

const skillData = [
  { skill: "React", average: 82 },
  { skill: "JavaScript", average: 76 },
  { skill: "TypeScript", average: 71 },
  { skill: "Problem Solving", average: 85 },
  { skill: "System Design", average: 68 },
];

const candidatesData: Candidate[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@email.com",
    status: "Completed",
    score: 87,
    timeSpent: "54 min",
    skills: {
      react: 90,
      javascript: 85,
      typescript: 80,
      problemSolving: 92,
      systemDesign: 78,
    },
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@email.com",
    status: "In Progress",
    score: null,
    timeSpent: "23 min",
    skills: null,
  },
  {
    id: 3,
    name: "Rahul Mehta",
    email: "rahul@email.com",
    status: "Completed",
    score: 92,
    timeSpent: "48 min",
    skills: {
      react: 95,
      javascript: 88,
      typescript: 85,
      problemSolving: 98,
      systemDesign: 84,
    },
  },
  {
    id: 4,
    name: "Sarah Johnson",
    email: "sarah@email.com",
    status: "Completed",
    score: 73,
    timeSpent: "61 min",
    skills: {
      react: 75,
      javascript: 70,
      typescript: 65,
      problemSolving: 80,
      systemDesign: 75,
    },
  },
  {
    id: 5,
    name: "Mike Chen",
    email: "mike@email.com",
    status: "Not Started",
    score: null,
    timeSpent: null,
    skills: null,
  },
];

const scoreTimeData = candidatesData
  .filter((c) => c.score && c.timeSpent)
  .map((c) => ({
    name: c.name,
    score: c.score,
    time: parseInt(c.timeSpent?.split(" ")[0] || "0"),
  }));

export default function Report() {
  const [filteredCandidates, setFilteredCandidates] =
    useState<Candidate[]>(candidatesData);

  const handleSearchChange = (searchTerm: string) => {
    const filtered = candidatesData.filter((candidate) => {
      const matchesSearch =
        candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.email.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
    setFilteredCandidates(filtered);
  };

  const handleFilterChange = (key: string, value: string) => {
    if (key === "status") {
      if (value === "all") {
        setFilteredCandidates(candidatesData);
      } else {
        const filtered = candidatesData.filter(
          (candidate) => candidate.status === value
        );
        setFilteredCandidates(filtered);
      }
    }
  };

  const filterOptions = [
    { label: "All Status", value: "all", filterKey: "status" },
    { label: "Completed", value: "Completed", filterKey: "status" },
    { label: "In Progress", value: "In Progress", filterKey: "status" },
    { label: "Not Started", value: "Not Started", filterKey: "status" },
  ];

  const handleDownloadReport = () => {
    // Implementation for downloading CSV/PDF report
    console.log("Downloading report...");
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{testData.name}</h1>
          <p className="text-muted-foreground">
            Conducted on {new Date(testData.dateconducted).toLocaleDateString()}
          </p>
        </div>
        <Button onClick={handleDownloadReport} className="gap-2">
          <Download className="h-4 w-4" />
          Download Report
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Candidates
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{testData.totalCandidates}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completion Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{testData.completionRate}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{testData.averageScore}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{testData.averageTime}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Completion Status Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Completion Status</CardTitle>
            <CardDescription>
              Distribution of test completion status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={completionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {completionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4">
              {completionData.map((entry) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-sm">
                    {entry.name} ({entry.value})
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Skill-wise Average Scores */}
        <Card>
          <CardHeader>
            <CardTitle>Skill-wise Performance</CardTitle>
            <CardDescription>Average scores by skill category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={skillData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="skill" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="average" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Candidates Table */}
      <Card>
        <CardHeader>
          <CardTitle>Candidates</CardTitle>
          <CardDescription>
            Detailed view of all test participants
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={filteredCandidates}
            searchPlaceholder="Search candidates..."
            onSearchChange={handleSearchChange}
            filterOptions={filterOptions}
            onFilterChange={handleFilterChange}
          />
        </CardContent>
      </Card>

      {/* Score vs Time Scatter Plot */}
      <Card>
        <CardHeader>
          <CardTitle>Score vs Time Analysis</CardTitle>
          <CardDescription>
            Relationship between test scores and time taken
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart data={scoreTimeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="time"
                name="Time (minutes)"
                label={{
                  value: "Time (minutes)",
                  position: "insideBottom",
                  offset: -5,
                }}
              />
              <YAxis
                dataKey="score"
                name="Score (%)"
                label={{
                  value: "Score (%)",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip
                formatter={(value, name) => [
                  value,
                  name === "score" ? "Score (%)" : "Time (min)",
                ]}
                labelFormatter={(label) =>
                  `Candidate: ${
                    scoreTimeData.find((d) => d.time === label)?.name
                  }`
                }
              />
              <Scatter dataKey="score" fill="#3b82f6" />
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
