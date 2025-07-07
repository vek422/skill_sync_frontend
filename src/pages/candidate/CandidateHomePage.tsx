import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AssignedTestCard } from "./components/AssignedTestCard";
import { EmptyState } from "./components/EmptyState";
import { motion } from "motion/react";
import { User, Calendar, CheckCircle2 } from "lucide-react";

interface Test {
  id: string;
  testName: string;
  scheduledTime: string;
  duration: string;
  status: "scheduled" | "ongoing" | "completed";
  scheduledDate: Date;
}

export default function CandidateHomePage() {
  const [tests, setTests] = useState<Test[]>([]);
  const [candidateName] = useState("Vedant");
  const [stats, setStats] = useState({
    totalAssigned: 0,
    totalCompleted: 0,
  });

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockTests: Test[] = [
      {
        id: "1",
        testName: "Frontend Developer Assessment",
        scheduledTime: "Jul 12, 2025 – 10:00 AM",
        duration: "60 mins",
        status: "scheduled",
        scheduledDate: new Date("2025-07-12T10:00:00"),
      },
      {
        id: "2",
        testName: "React.js Technical Interview",
        scheduledTime: "Jul 15, 2025 – 2:00 PM",
        duration: "90 mins",
        status: "scheduled",
        scheduledDate: new Date("2025-07-15T14:00:00"),
      },
      {
        id: "3",
        testName: "JavaScript Fundamentals",
        scheduledTime: "Jul 10, 2025 – 3:00 PM",
        duration: "45 mins",
        status: "ongoing",
        scheduledDate: new Date("2025-07-10T15:00:00"),
      },
    ];

    setTests(mockTests);
    setStats({
      totalAssigned: mockTests.length,
      totalCompleted: mockTests.filter((t) => t.status === "completed").length,
    });
  }, []);

  const getCountdownText = (scheduledDate: Date): string | undefined => {
    const now = new Date();
    const timeDiff = scheduledDate.getTime() - now.getTime();

    if (timeDiff <= 0) return undefined;

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) {
      return `${days}d ${hours}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  const handleTestAction = (testId: string, status: string) => {
    // Handle test actions based on status
    console.log(`Action for test ${testId} with status ${status}`);
    // Add your navigation logic here
  };

  const handleRefresh = () => {
    // Refresh tests data
    console.log("Refreshing tests...");
    // Add your refresh logic here
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                Welcome back, {candidateName}!
              </h1>
              <p className="text-muted-foreground mt-1">
                Here are the upcoming assessments you're assigned to.
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Assigned
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalAssigned}</div>
                <p className="text-xs text-muted-foreground">assessments</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Completed
                </CardTitle>
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalCompleted}</div>
                <p className="text-xs text-muted-foreground">assessments</p>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold mb-6">Upcoming Assessments</h2>

          {tests.length === 0 ? (
            <EmptyState onRefresh={handleRefresh} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tests
                .filter((test) => test.status !== "completed")
                .map((test, index) => (
                  <motion.div
                    key={test.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <AssignedTestCard
                      testName={test.testName}
                      scheduledTime={test.scheduledTime}
                      duration={test.duration}
                      status={test.status}
                      countdownText={getCountdownText(test.scheduledDate)}
                      onAction={() => handleTestAction(test.id, test.status)}
                    />
                  </motion.div>
                ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
