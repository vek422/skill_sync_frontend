import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Calendar, Timer } from "lucide-react";
import { motion } from "motion/react";

interface AssignedTestCardProps {
  testName: string;
  scheduledTime: string;
  duration: string;
  status: "scheduled" | "ongoing" | "completed";
  onAction: () => void;
  countdownText?: string;
}

export function AssignedTestCard({
  testName,
  scheduledTime,
  duration,
  status,
  onAction,
  countdownText,
}: AssignedTestCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "ongoing":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getActionButton = () => {
    switch (status) {
      case "scheduled":
        return (
          <Button onClick={onAction} className="w-full">
            <Clock className="mr-2 h-4 w-4" />
            Start Test
          </Button>
        );
      case "ongoing":
        return (
          <Button onClick={onAction} variant="outline" className="w-full">
            <Timer className="mr-2 h-4 w-4" />
            Resume Test
          </Button>
        );
      case "completed":
        return (
          <Button onClick={onAction} variant="secondary" className="w-full">
            View Results
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      <Card className="hover:shadow-lg transition-shadow duration-200">
        {countdownText && status === "scheduled" && (
          <div className="absolute -top-2 -right-2 z-10">
            <Badge variant="destructive" className="text-xs font-medium">
              {countdownText}
            </Badge>
          </div>
        )}

        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold truncate">
              {testName}
            </CardTitle>
            <Badge className={getStatusColor(status)}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="mr-2 h-4 w-4" />
              <span>{scheduledTime}</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Timer className="mr-2 h-4 w-4" />
              <span>{duration}</span>
            </div>
          </div>

          {getActionButton()}
        </CardContent>
      </Card>
    </motion.div>
  );
}
