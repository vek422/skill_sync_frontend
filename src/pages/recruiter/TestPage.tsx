import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Clock,
  Users,
  Network,
  Settings,
  CheckCircle,
  Loader2,
  XCircle,
  Download,
  Trash2,
  Edit,
  Eye,
  RefreshCw,
  PlayCircle,
  Calendar as CalendarIcon,
  Mail,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data types
interface TestData {
  id: string;
  name: string;
  status: "draft" | "scheduled" | "ongoing" | "completed";
  duration: number;
  startDate: string;
  createdAt: string;
  jobDescription: string;
  candidates: Candidate[];
  skillGraph: {
    status: "pending" | "generating" | "complete";
    nodes: SkillNode[];
    edges: SkillEdge[];
  };
}

interface Candidate {
  id: string;
  name: string;
  email: string;
  resumeStatus: "pending" | "processing" | "done" | "failed";
  score?: number;
  inviteSent: boolean;
  testCompleted: boolean;
}

interface SkillNode {
  id: string;
  label: string;
  level: "easy" | "medium" | "hard";
  type: "skill" | "subskill";
}

interface SkillEdge {
  id: string;
  source: string;
  target: string;
}

const TestPage: React.FC = () => {
  const { testId } = useParams<{ testId: string }>();
  const [testData, setTestData] = useState<TestData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [jobDescriptionExpanded, setJobDescriptionExpanded] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");

  // Mock data for demonstration
  useEffect(() => {
    const mockData: TestData = {
      id: testId || "1",
      name: "Frontend Developer Assessment",
      status: "scheduled",
      duration: 60,
      startDate: "2025-07-10T09:00:00Z",
      createdAt: "2025-07-01T10:00:00Z",
      jobDescription: "We are looking for a skilled Frontend Developer to join our team. The ideal candidate should have experience with React, TypeScript, and modern web development practices. You will be responsible for building responsive user interfaces, optimizing performance, and collaborating with the backend team to integrate APIs. Strong problem-solving skills and attention to detail are essential.",
      candidates: [
        {
          id: "1",
          name: "John Doe",
          email: "john@example.com",
          resumeStatus: "done",
          score: 85,
          inviteSent: true,
          testCompleted: true,
        },
        {
          id: "2",
          name: "Jane Smith",
          email: "jane@example.com",
          resumeStatus: "processing",
          inviteSent: true,
          testCompleted: false,
        },
        {
          id: "3",
          name: "Bob Johnson",
          email: "bob@example.com",
          resumeStatus: "pending",
          inviteSent: false,
          testCompleted: false,
        },
      ],
      skillGraph: {
        status: "complete",
        nodes: [
          { id: "1", label: "React", level: "medium", type: "skill" },
          { id: "2", label: "TypeScript", level: "hard", type: "skill" },
          { id: "3", label: "CSS", level: "easy", type: "skill" },
          { id: "4", label: "Hooks", level: "medium", type: "subskill" },
          { id: "5", label: "State Management", level: "hard", type: "subskill" },
        ],
        edges: [
          { id: "e1", source: "1", target: "4" },
          { id: "e2", source: "1", target: "5" },
        ],
      },
    };

    setTimeout(() => {
      setTestData(mockData);
      setLoading(false);
    }, 1000);
  }, [testId]);

  const getStatusBadge = (status: TestData["status"]) => {
    const statusConfig = {
      draft: { variant: "secondary" as const, label: "Draft" },
      scheduled: { variant: "default" as const, label: "Scheduled" },
      ongoing: { variant: "destructive" as const, label: "Ongoing" },
      completed: { variant: "outline" as const, label: "Completed" },
    };
    
    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getResumeStatusIcon = (status: Candidate["resumeStatus"]) => {
    switch (status) {
      case "done":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "processing":
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleCsvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadStatus("uploading");
      
      // Mock upload process
      setTimeout(() => {
        setUploadStatus("success");
        // Here you would parse the CSV and add candidates to the test
      }, 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!testData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Test not found</h2>
          <p className="text-muted-foreground">The test you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header & Metadata Section */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl">{testData.name}</CardTitle>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(testData.startDate)}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {testData.duration} mins
                </div>
                <div className="flex items-center gap-1">
                  <CalendarIcon className="h-4 w-4" />
                  Created {formatDate(testData.createdAt)}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(testData.status)}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Actions
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Test
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Start Test
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Download className="h-4 w-4 mr-2" />
                    Export Results
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Test
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Job Description</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setJobDescriptionExpanded(!jobDescriptionExpanded)}
              >
                {jobDescriptionExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className={`text-sm text-muted-foreground ${jobDescriptionExpanded ? "" : "line-clamp-3"}`}>
              {testData.jobDescription}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="candidates" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Candidates
          </TabsTrigger>
          <TabsTrigger value="skill-graph" className="flex items-center gap-2">
            <Network className="h-4 w-4" />
            Skill Graph
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Test Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Test Created</span>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Resume Parsing</span>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-muted-foreground">2/3</span>
                    <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Graph Generation</span>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Candidates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{testData.candidates.length}</div>
                <p className="text-sm text-muted-foreground">Total candidates</p>
                <div className="mt-2 text-sm">
                  <div className="flex justify-between">
                    <span>Completed:</span>
                    <span>{testData.candidates.filter(c => c.testCompleted).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Invited:</span>
                    <span>{testData.candidates.filter(c => c.inviteSent).length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {testData.candidates.filter(c => c.score).reduce((acc, c) => acc + (c.score || 0), 0) / testData.candidates.filter(c => c.score).length || 0}%
                </div>
                <p className="text-sm text-muted-foreground">Average score</p>
                <div className="mt-2 text-sm">
                  <div className="flex justify-between">
                    <span>Highest:</span>
                    <span>{Math.max(...testData.candidates.map(c => c.score || 0))}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lowest:</span>
                    <span>{Math.min(...testData.candidates.filter(c => c.score).map(c => c.score || 0))}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Candidates Tab */}
        <TabsContent value="candidates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload Candidates</CardTitle>
              <CardDescription>
                Upload a CSV file with candidate information (max 100 rows)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Input
                    type="file"
                    accept=".csv"
                    onChange={handleCsvUpload}
                    className="flex-1"
                  />
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Template
                  </Button>
                </div>
                
                {uploadStatus === "uploading" && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading and parsing CSV...
                  </div>
                )}
                
                {uploadStatus === "success" && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    CSV uploaded successfully!
                  </div>
                )}
                
                {uploadStatus === "error" && (
                  <div className="flex items-center gap-2 text-sm text-red-600">
                    <XCircle className="h-4 w-4" />
                    Error uploading CSV. Please check the format.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Candidate List</CardTitle>
              <CardDescription>
                Manage candidates for this test
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Resume Status</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {testData.candidates.map((candidate) => (
                    <TableRow key={candidate.id}>
                      <TableCell className="font-medium">{candidate.name}</TableCell>
                      <TableCell>{candidate.email}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getResumeStatusIcon(candidate.resumeStatus)}
                          <span className="capitalize">{candidate.resumeStatus}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {candidate.score ? `${candidate.score}%` : "-"}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>
                              <Mail className="h-4 w-4 mr-2" />
                              Send Invite
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              Download Resume
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View Results
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remove
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Skill Graph Tab */}
        <TabsContent value="skill-graph" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Skill Graph</CardTitle>
              <CardDescription>
                Visual representation of skills and their relationships
              </CardDescription>
            </CardHeader>
            <CardContent>
              {testData.skillGraph.status === "pending" && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Graph Generation Pending</h3>
                  <p className="text-muted-foreground">
                    The skill graph will be generated after resume parsing is complete.
                  </p>
                </div>
              )}
              
              {testData.skillGraph.status === "generating" && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Generating Graph...</h3>
                  <p className="text-muted-foreground">
                    This may take a few minutes depending on the complexity.
                  </p>
                </div>
              )}
              
              {testData.skillGraph.status === "complete" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm">Easy</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm">Medium</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-sm">Hard</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Regenerate
                    </Button>
                  </div>
                  
                  {/* Mock skill graph visualization */}
                  <div className="border rounded-lg p-6 bg-muted/50 min-h-[400px] flex items-center justify-center">
                    <div className="text-center">
                      <Network className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Interactive Skill Graph</h3>
                      <p className="text-muted-foreground mb-4">
                        This would show an interactive DAG with {testData.skillGraph.nodes.length} skills
                      </p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        {testData.skillGraph.nodes.map((node) => (
                          <div key={node.id} className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              node.level === "easy" ? "bg-green-500" :
                              node.level === "medium" ? "bg-yellow-500" : "bg-red-500"
                            }`}></div>
                            <span>{node.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Test Settings</CardTitle>
              <CardDescription>
                Configure test parameters and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="testName">Test Name</Label>
                <Input
                  id="testName"
                  defaultValue={testData.name}
                  className="max-w-md"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  defaultValue={testData.duration}
                  className="max-w-md"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date & Time</Label>
                <Input
                  id="startDate"
                  type="datetime-local"
                  defaultValue={new Date(testData.startDate).toISOString().slice(0, 16)}
                  className="max-w-md"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="jobDesc">Job Description</Label>
                <Textarea
                  id="jobDesc"
                  defaultValue={testData.jobDescription}
                  rows={4}
                  className="max-w-2xl"
                />
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label>Test Status</Label>
                <div className="flex items-center gap-2">
                  {getStatusBadge(testData.status)}
                  <Button variant="outline" size="sm">
                    Change Status
                  </Button>
                </div>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button>Save Changes</Button>
                <Button variant="outline">Cancel</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
              <CardDescription>
                Irreversible actions. Please be careful.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Test
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TestPage;