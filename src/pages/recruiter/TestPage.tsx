
// Remove duplicate SkillGraphDistributionControls definition at the bottom of the file.
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDeleteTestMutation, useGetTestByIdQuery, useUpdateTestMutation } from "@/api/testApi";
import { useBulkUploadCandidatesMutation, useGetCandidatesByTestQuery, useShortlistBulkCandidatesMutation } from "@/api/candidateApi";
import { parseExcelFile, downloadSampleTemplate, validateFileType } from "@/utils/excelParser";
import type { ExcelCandidateItem } from "@/utils/excelParser";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SkillGraphDistributionControls from "@/components/SkillGraphDistributionControls";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Upload,
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
import SkillTreeGraph from "@/components/SkillTreeGraph";


import { useUpdateSkillGraphMutation } from "@/api/testApi";
// --- SkillGraphDistributionControls state for TestPage ---
// (This replaces the inline component with the reusable one)


const TestPage: React.FC = () => {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  const [deleteTest] = useDeleteTestMutation();
  
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ExcelCandidateItem[] | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [minScore, setMinScore] = useState<number>(60);
  const [shortlistResult, setShortlistResult] = useState<null | {notified: number, message: string, shortlisted: any[]}>(null);

  // UI state for tabs and job description
  const [activeTab, setActiveTab] = useState("overview");
  const [jobDescriptionExpanded, setJobDescriptionExpanded] = useState(false);

  // RTK Query hooks
  const [bulkUpload, { isLoading: isUploading }] = useBulkUploadCandidatesMutation();
  const [shortlistBulk, { isLoading: isShortlisting }] = useShortlistBulkCandidatesMutation();
  const { 
    data: candidates, 
    refetch: refetchCandidates, 
    isLoading: candidatesLoading, 
    error: candidatesError,
    isSuccess: candidatesSuccess 
  } = useGetCandidatesByTestQuery(
    Number(testId!),
    { skip: !testId }
  );


  // Fetch test data from API
  const { data: test, isLoading: testLoading, error: testError } = useGetTestByIdQuery(Number(testId), { skip: !testId });

  // Unified test update state
  const [updateTest, { isLoading: isUpdatingTest }] = useUpdateTestMutation();
  const [editMode, setEditMode] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState<string | null>(null);
  // Editable fields state
  const [formState, setFormState] = useState<any>(null);
  // For slider
  const [sliderValues, setSliderValues] = useState<number[]>([33, 66]);

  // Initialize form state from test data
  useEffect(() => {
    if (test) {
      setFormState({
        test_name: test.test_name || '',
        job_description: test.job_description || '',
        scheduled_at: test.scheduled_at ? new Date(test.scheduled_at).toISOString().slice(0, 16) : '',
        time_limit_minutes: test.time_limit_minutes || '',
        resume_score_threshold: test.resume_score_threshold ?? '',
        max_shortlisted_candidates: test.max_shortlisted_candidates ?? '',
        auto_shortlist: !!test.auto_shortlist,
        total_questions: test.total_questions || 0,
        total_marks: test.total_marks || '',
        application_deadline: test.application_deadline ? new Date(test.application_deadline).toISOString().slice(0, 16) : '',
        assessment_deadline: test.assessment_deadline ? new Date(test.assessment_deadline).toISOString().slice(0, 16) : '',
        // question_distribution: { low, medium, high }
        question_distribution: test.parsed_job_description?.question_distribution || { low: 0, medium: 0, high: 0 },
      });
      // Set slider from distribution
      const dist = test.parsed_job_description?.question_distribution || { low: 33, medium: 33, high: 34 };
      setSliderValues([dist.low, dist.low + dist.medium]);
    }
  }, [test]);

  // Keep question_distribution in sync with slider
  useEffect(() => {
    if (!formState) return;
    const low = sliderValues[0];
    const medium = sliderValues[1] - sliderValues[0];
    const high = 100 - sliderValues[1];
    // Calculate counts
    const l = Math.round((low / 100) * (formState.total_questions || 0));
    const m = Math.round((medium / 100) * (formState.total_questions || 0));
    const h = (formState.total_questions || 0) - l - m;
    setFormState((prev: any) => ({ ...prev, question_distribution: { low: l, medium: m, high: h } }));
  }, [sliderValues, formState?.total_questions]);

  // Handlers for form fields
  const handleFieldChange = (field: string, value: any) => {
    setFormState((prev: any) => ({ ...prev, [field]: value }));
    if (field === 'total_questions') {
      // Recalculate distribution
      const low = sliderValues[0];
      const medium = sliderValues[1] - sliderValues[0];
      const high = 100 - sliderValues[1];
      const l = Math.round((low / 100) * value);
      const m = Math.round((medium / 100) * value);
      const h = value - l - m;
      setFormState((prev: any) => ({ ...prev, question_distribution: { low: l, medium: m, high: h } }));
    }
  };

  const handleSave = async () => {
    setUpdateError(null); setUpdateSuccess(null);
    if (!testId || !formState) return;
    try {
      // Only include fields that are not empty string or undefined/null
      const {
        test_name,
        job_description,
        auto_shortlist,
        total_questions,
        time_limit_minutes,
        total_marks,
        question_distribution,
        resume_score_threshold,
        max_shortlisted_candidates,
      } = formState;

      const payload: any = {
        test_name,
        job_description,
        auto_shortlist,
        total_questions,
        time_limit_minutes,
        total_marks,
        question_distribution,
      };
      if (resume_score_threshold !== '' && resume_score_threshold !== undefined && resume_score_threshold !== null) payload.resume_score_threshold = resume_score_threshold;
      if (max_shortlisted_candidates !== '' && max_shortlisted_candidates !== undefined && max_shortlisted_candidates !== null) payload.max_shortlisted_candidates = max_shortlisted_candidates;

      // Remove any fields that are empty string
      Object.keys(payload).forEach(key => {
        if (payload[key] === '' || payload[key] === undefined || payload[key] === null) {
          delete payload[key];
        }
      });

      console.log('[UpdateTest] Sending payload:', payload);
      await updateTest({ testId: Number(testId), testData: payload }).unwrap();
      setUpdateSuccess('Test updated successfully!');
      setEditMode(false);
    } catch (e: any) {
      setUpdateError(e?.data?.message || 'Failed to update test');
    }
  };

  // Normalize candidates from API to a consistent structure for the table
  const normalizedCandidates = React.useMemo(() => {
    if (!candidates) return [];
    return candidates.map((c: any, idx: number) => ({
      name: c['candidate_name'] || c['name'] || '',
      email: c['candidate_email'] || c['email'] || '',
      resume_link: c['resume_link'],
      resume_score: c['resume_score'] ?? c['score'] ?? null,
      is_shortlisted: c['is_shortlisted'],
      testCompleted: c['test_completed'] ?? false,
      inviteSent: c['invite_sent'] ?? false,
      key: (c['candidate_email'] || c['email'] || '') + (c['resume_score'] ?? c['score'] ?? idx),
    }));
  }, [candidates]);

  // Sort normalized candidates by resume_score
  const sortedCandidates = React.useMemo(() => {
    return [...normalizedCandidates].sort((a, b) => {
      if ((a.resume_score ?? null) === null && (b.resume_score ?? null) === null) return 0;
      if ((a.resume_score ?? null) === null) return 1;
      if ((b.resume_score ?? null) === null) return -1;
      return b.resume_score - a.resume_score;
    });
  }, [normalizedCandidates]);

  // Debug logging for candidates query
  useEffect(() => {
    if (testId) {
      console.log('TestPage - testId:', testId);
      console.log('TestPage - candidates loading:', candidatesLoading);
      console.log('TestPage - candidates error:', candidatesError);
      console.log('TestPage - candidates data:', candidates);
      console.log('TestPage - candidates success:', candidatesSuccess);
    }
  }, [testId, candidatesLoading, candidatesError, candidates, candidatesSuccess]);

  // Log the test data to the console when it is loaded
  useEffect(() => {
    if (test) {
      console.log('Fetched test data:', test);
    }
  }, [test]);

  // Action handlers
  const handleEditTest = () => {
    if (testId) {
      navigate(`/recruiter/test/edit/${testId}`);
    }
  };

  const handleDeleteTest = async () => {
    if (!testId || !test) return;

    // Check if test is ongoing
    if (test.status === "ongoing" || test.status === "scheduled") {
      alert("⚠️ Cannot Delete Test\n\nThis test is currently active and cannot be deleted. Please wait for the test to complete before attempting to delete it.");
      return;
    }

    // Confirmation dialog
    const confirmMessage = `🗑️ Delete Test Confirmation\n\nAre you sure you want to delete "${test.test_name}"?\n\nThis action cannot be undone and will permanently remove all associated data including:\n• Test questions and settings\n• Candidate submissions\n• Results and reports\n\nType "DELETE" to confirm.`;
    
    const userInput = prompt(confirmMessage + "\n\nType 'DELETE' to confirm:");
    
    if (userInput === "DELETE") {
      try {
        await deleteTest(parseInt(testId)).unwrap();
        alert("✅ Test deleted successfully!");
        navigate("/recruiter/tests"); // Navigate back to tests list
      } catch (error) {
        console.error("Failed to delete test:", error);
        alert("❌ Failed to delete test. Please try again.");
      }
    } else if (userInput !== null) {
      alert("❌ Deletion cancelled. You must type 'DELETE' exactly to confirm.");
    }
  };

  const handleStartTest = () => {
    // TODO: Implement start test functionality
    alert("🚀 Start Test feature coming soon!");
  };

  const handleExportResults = () => {
    // TODO: Implement export functionality
    alert("📊 Export Results feature coming soon!");
  };

  const handleShortlistBulk = async () => {
    if (!testId) return;
    setShortlistResult(null);
    try {
      const result = await shortlistBulk({ test_id: Number(testId), min_score: minScore }).unwrap();
      setShortlistResult(result);
      refetchCandidates();
    } catch (err: any) {
      setShortlistResult({ notified: 0, message: err?.data?.message || "Shortlisting failed", shortlisted: [] });
    }
  };

  // Helper for status badge
  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: string; label: string }> = {
      draft: { variant: "secondary", label: "Draft" },
      scheduled: { variant: "default", label: "Scheduled" },
      ongoing: { variant: "destructive", label: "Ongoing" },
      completed: { variant: "outline", label: "Completed" },
    };
    const config = statusConfig[status] || { variant: "secondary", label: status };
    return <Badge variant={config.variant as any}>{config.label}</Badge>;
  };

  // Helper for date formatting
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "-";
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
    if (!file || !testId) return;

    console.log('File selected:', file.name, file.type, file.size);
    
    setErrors([]);
    setWarnings([]);
    setParsedData(null);
    setUploadStatus("idle");
    
    // Validate file type
    if (!validateFileType(file)) {
      setErrors(['Please select a valid Excel file (.xlsx, .xls) or CSV file (.csv)']);
      return;
    }

    setUploadedFile(file);
    console.log('File ready for upload:', file.name);
  };

  const handleProcessAndUpload = async () => {
    if (!uploadedFile || !testId) return;

    try {
      setUploadStatus("uploading");
      setUploadProgress(0);
      setErrors([]);
      setWarnings([]);
      setIsParsing(true);

      console.log('Starting file parsing and upload for test ID:', testId);
      
      // First, parse the file
      const result = await parseExcelFile(uploadedFile);
      
      if (!result.validation.valid) {
        setErrors(result.validation.errors);
        setWarnings(result.validation.warnings);
        setUploadStatus("error");
        setIsParsing(false);
        return;
      }
      
      setParsedData(result.data);
      setWarnings(result.validation.warnings);
      setIsParsing(false);

      // Show progress simulation for upload
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);
      
      // Add test_id from URL to each application
      const applicationsWithTestId = result.data.map(candidate => ({
        ...candidate,
        test_id: Number(testId)
      }));
      
      console.log('Upload data:', { applications: applicationsWithTestId });
      console.log('Sending to URL:', '/candidate-application/bulk');
      console.log('Test ID:', testId);
      console.log('Applications with test ID:', applicationsWithTestId);

      const uploadResult = await bulkUpload({
        applications: applicationsWithTestId
      }).unwrap();

      clearInterval(progressInterval);
      setUploadProgress(100);

      console.log('Upload result:', uploadResult);

      // Reset form and refetch data
      setUploadedFile(null);
      setParsedData(null);
      setUploadProgress(0);
      setUploadStatus("success");
      
      // Refetch candidates to update the table
      refetchCandidates();

      // Show success message with details
      const successMsg = `Successfully uploaded ${uploadResult.success || uploadResult.results?.filter(r => r.status === 'success').length} candidates`;
      const failedCount = uploadResult.failed || uploadResult.results?.filter(r => r.status === 'error').length;
      
      if (failedCount > 0) {
        setWarnings([`${successMsg}. ${failedCount} failed.`]);
      } else {
        setWarnings([successMsg]);
      }
      
    } catch (error: any) {
      console.error('Upload error:', error);
      setUploadProgress(0);
      setIsParsing(false);
      setUploadStatus("error");
      setErrors([`Upload failed: ${error?.data?.detail || error?.data?.message || error.message || 'Unknown error'}`]);
    }
  };

  const handleDownloadTemplate = () => {
    downloadSampleTemplate();
  };


  // Move hooks to top level to avoid conditional hook calls
  // Loading and error UI will be handled below in the render

  // --- Scheduling State ---
  const [scheduleState, setScheduleState] = useState({
    scheduled_at: '',
    time_limit_minutes: '',
    assessment_deadline: '',
  });

  // Auto-calculate assessment_deadline when scheduled_at or time_limit_minutes changes
  useEffect(() => {
    if (scheduleState.scheduled_at && scheduleState.time_limit_minutes) {
      const start = new Date(scheduleState.scheduled_at);
      const mins = parseInt(scheduleState.time_limit_minutes, 10);
      if (!isNaN(start.getTime()) && !isNaN(mins)) {
        const end = new Date(start.getTime() + mins * 60000);
        setScheduleState(prev => ({ ...prev, assessment_deadline: end.toISOString().slice(0, 16) }));
      }
    }
  }, [scheduleState.scheduled_at, scheduleState.time_limit_minutes]);

  // Schedule handler
  const handleSchedule = async () => {
    setUpdateError(null); setUpdateSuccess(null);
    if (!testId) return;
    try {
      const { scheduled_at, time_limit_minutes, assessment_deadline } = scheduleState;
      const payload: any = {};
      if (scheduled_at) payload.scheduled_at = scheduled_at;
      if (time_limit_minutes) payload.time_limit_minutes = time_limit_minutes;
      if (assessment_deadline) payload.assessment_deadline = assessment_deadline;
      console.log('[ScheduleTest] Sending payload:', payload);
      await updateTest({ testId: Number(testId), testData: payload }).unwrap();
      setUpdateSuccess('Test scheduled successfully!');
    } catch (e: any) {
      setUpdateError(e?.data?.message || 'Failed to schedule test');
    }
  };

  if (testLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (testError || !test) {
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
              <CardTitle className="text-2xl">{test.test_name}</CardTitle>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(test.scheduled_at)}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {test.time_limit_minutes} mins
                </div>
                <div className="flex items-center gap-1">
                  <CalendarIcon className="h-4 w-4" />
                  Created {formatDate(test.created_at)}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(test.status)}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Actions
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem 
                    onClick={handleEditTest}
                    className="cursor-pointer hover:bg-accent"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Test
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={handleStartTest}
                    className="cursor-pointer hover:bg-accent"
                  >
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Start Test
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={handleExportResults}
                    className="cursor-pointer hover:bg-accent"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Results
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-red-600 focus:text-red-600 cursor-pointer hover:bg-red-50" 
                    onClick={handleDeleteTest}
                  >
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
              {test.job_description}
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
                <div className="text-2xl font-bold">{candidates?.length || 0}</div>
                <p className="text-sm text-muted-foreground">Total candidates</p>
                <div className="mt-2 text-sm">
                  <div className="flex justify-between">
                    <span>Completed:</span>
                    <span>{candidates?.filter(c => c.score !== null).length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shortlisted:</span>
                    <span>{candidates?.filter(c => c.is_shortlisted).length || 0}</span>
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
                  {candidates && candidates.filter(c => c.score !== null).length > 0
                    ? Math.round(
                        candidates
                          .filter(c => c.score !== null)
                          .reduce((acc, c) => acc + c.score!, 0) /
                        candidates.filter(c => c.score !== null).length
                      )
                    : 0}%
                </div>
                <p className="text-sm text-muted-foreground">Average score</p>
                <div className="mt-2 text-sm">
                  <div className="flex justify-between">
                    <span>Highest:</span>
                    <span>{candidates && candidates.length > 0 ? Math.max(...candidates.map(c => c.score || 0)) : 0}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lowest:</span>
                    <span>{candidates && candidates.filter(c => c.score !== null).length > 0 ? Math.min(...candidates.filter(c => c.score !== null).map(c => c.score!)) : 0}%</span>
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
                Upload an Excel or CSV file with candidate information (max 100 rows)
                {uploadedFile && (
                  <><br /><span className="text-green-600">Selected: {uploadedFile.name}</span></>
                )}
                {parsedData && (
                  <><br /><span className="text-blue-600">Parsed {parsedData.length} candidates successfully</span></>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Input
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleCsvUpload}
                    className="flex-1"
                    disabled={isParsing || isUploading}
                  />
                  <Button variant="outline" size="sm" onClick={handleDownloadTemplate}>
                    <Download className="h-4 w-4 mr-2" />
                    Template
                  </Button>
                </div>

                {/* Upload Button - Show when file is selected */}
                {uploadedFile && (
                  <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg border">
                    <div>
                      <p className="text-sm font-medium">Ready to upload: {uploadedFile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {parsedData ? `${parsedData.length} candidates parsed` : 'Click to parse and upload'}
                      </p>
                    </div>
                    <Button 
                      onClick={handleProcessAndUpload} 
                      disabled={isParsing || isUploading}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isParsing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Parsing...
                        </>
                      ) : isUploading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          {parsedData ? `Upload ${parsedData.length} Candidates` : 'Parse & Upload'}
                        </>
                      )}
                    </Button>
                  </div>
                )}
                
                {(isParsing || isUploading) && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {isParsing ? 'Parsing file...' : 'Uploading candidates...'}
                    {uploadProgress > 0 && <span>({uploadProgress}%)</span>}
                  </div>
                )}
                
                {uploadStatus === "success" && !isParsing && !isUploading && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    Upload completed successfully!
                  </div>
                )}
                
                {errors.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-red-600">
                    <XCircle className="h-4 w-4" />
                    <div>
                      {errors.map((error, index) => (
                        <div key={index}>{error}</div>
                      ))}
                    </div>
                  </div>
                )}

                {warnings.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-yellow-600">
                    <CheckCircle className="h-4 w-4" />
                    <div>
                      {warnings.map((warning, index) => (
                        <div key={index}>{warning}</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Manual Shortlisting Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Manual Shortlisting</CardTitle>
              <CardDescription>
                Select a minimum resume score to shortlist candidates for assessment. All candidates with a score above or equal to this threshold will be shortlisted and notified.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row items-center gap-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="min-score">Minimum Resume Score</Label>
                <Input
                  id="min-score"
                  type="number"
                  min={0}
                  max={100}
                  value={minScore}
                  onChange={e => setMinScore(Number(e.target.value))}
                  className="w-24"
                />
              </div>
              <Button
                onClick={handleShortlistBulk}
                disabled={isShortlisting || !testId}
                className="ml-0 md:ml-4"
              >
                {isShortlisting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Shortlist Candidates
              </Button>
              {/* Send Invitation Button (UI only) */}
              <Button
                variant="secondary"
                className="ml-0 md:ml-4"
                // No onClick yet, logic to be added later
                disabled={normalizedCandidates.filter(c => c.is_shortlisted).length === 0}
              >
                Send Invitation to {normalizedCandidates.filter(c => c.is_shortlisted).length} Candidate{normalizedCandidates.filter(c => c.is_shortlisted).length === 1 ? '' : 's'}
              </Button>
              {shortlistResult && (
                <div className="ml-0 md:ml-4 text-green-700 text-sm">
                  {shortlistResult.message}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Candidate List
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => refetchCandidates()}
                  disabled={candidatesLoading}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${candidatesLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </CardTitle>
              <CardDescription>
                Manage candidates for this test ({sortedCandidates?.length || 0} total)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {candidatesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="ml-2">Loading candidates...</span>
                </div>
              ) : candidatesError ? (
                <div className="flex items-center justify-center py-8 text-red-600">
                  <XCircle className="h-6 w-6" />
                  <span className="ml-2">Failed to load candidates. Please try refreshing the page.</span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => refetchCandidates()}
                    className="ml-4"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Retry
                  </Button>
                </div>
              ) : sortedCandidates && sortedCandidates.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rank</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Resume Link</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedCandidates.map((candidate, index) => (
                      <TableRow key={candidate.key}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            {candidate.resume_score !== null && candidate.resume_score !== undefined ? (
                              <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${
                                index === 0 ? 'bg-yellow-100 text-yellow-800' :
                                index === 1 ? 'bg-gray-100 text-gray-800' :
                                index === 2 ? 'bg-orange-100 text-orange-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {index + 1}
                              </span>
                            ) : (
                              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full text-sm bg-gray-50 text-gray-400">
                                -
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{candidate.name}</TableCell>
                        <TableCell>{candidate.email}</TableCell>
                        <TableCell>
                          <a 
                            href={candidate.resume_link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm"
                          >
                            View Resume
                          </a>
                        </TableCell>
                        <TableCell>
                          {candidate.resume_score !== null && candidate.resume_score !== undefined ? (
                            <span className={`px-2 py-1 rounded text-xs ${
                              candidate.resume_score >= 80 ? 'bg-green-100 text-green-800' :
                              candidate.resume_score >= 60 ? 'bg-blue-100 text-blue-800' :
                              candidate.resume_score >= 40 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {candidate.resume_score}%
                            </span>
                          ) : (
                            <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-800">
                              Not Taken
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          {candidate.is_shortlisted ? (
                            <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                              Shortlisted
                            </span>
                          ) : (
                            <span className="px-2 py-1 rounded text-xs bg-red-100 text-red-800">
                              Not Shortlisted
                            </span>
                          )}
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
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No candidates uploaded yet</p>
                  <p className="text-sm">Upload an Excel file to add candidates</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Skill Graph Tab (with Recharts visualization if data exists) */}
        <TabsContent value="skill-graph" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Skill Graph</CardTitle>
              <CardDescription>
                Visual representation of skills and their relationships
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mt-8">
                {test && test.skill_graph && test.skill_graph.root_nodes && test.skill_graph.root_nodes.length > 0 ? (
                  <SkillTreeGraph root_nodes={test.skill_graph.root_nodes} />
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Network className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Skill Graph Data</h3>
                    <p className="text-muted-foreground mb-4">
                      No skill graph data is available for this test. Please check if the skill graph has been generated or try again later.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          {/* Scheduling Section */}
          <Card>
            <CardHeader>
              <CardTitle>Schedule Test</CardTitle>
              <CardDescription>Set the start time and duration. End time is auto-calculated.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="scheduledAt">Scheduled At</Label>
                <Input id="scheduledAt" type="datetime-local" value={scheduleState.scheduled_at} onChange={e => setScheduleState(prev => ({ ...prev, scheduled_at: e.target.value }))} className="max-w-md" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timeLimit">Duration (minutes)</Label>
                <Input id="timeLimit" type="number" value={scheduleState.time_limit_minutes} onChange={e => setScheduleState(prev => ({ ...prev, time_limit_minutes: e.target.value }))} className="max-w-md" />
              </div>
              <div className="space-y-2">
                <Label>Assessment End Time</Label>
                <Input type="datetime-local" value={scheduleState.assessment_deadline} readOnly className="max-w-md" />
              </div>
              <div className="flex gap-4 pt-4">
                <Button onClick={handleSchedule} disabled={isUpdatingTest}>
                  {isUpdatingTest ? 'Scheduling...' : 'Schedule'}
                </Button>
              </div>
              {updateError && <div className="text-red-600 text-sm mt-2">{updateError}</div>}
              {updateSuccess && <div className="text-green-600 text-sm mt-2">{updateSuccess}</div>}
            </CardContent>
          </Card>

          {/* Update Test Section */}
          <Card>
            <CardHeader>
              <CardTitle>Test Settings</CardTitle>
              <CardDescription>Configure test parameters and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {formState && (
                <>
                  {/* Slider for question distribution */}
                  <div className="mb-8">
                    <SkillGraphDistributionControls
                      totalQuestions={formState.total_questions}
                      setTotalQuestions={val => handleFieldChange('total_questions', val)}
                      sliderValues={sliderValues}
                      setSliderValues={setSliderValues}
                      onUpdate={undefined}
                      hideUpdateButton
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="testName">Test Name</Label>
                    <Input id="testName" value={formState.test_name} onChange={e => handleFieldChange('test_name', e.target.value)} className="max-w-md" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="jobDesc">Job Description</Label>
                    <Textarea id="jobDesc" value={formState.job_description} onChange={e => handleFieldChange('job_description', e.target.value)} rows={4} className="max-w-2xl" />
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(test.status)}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Resume Score Threshold</Label>
                    <Input value={formState.resume_score_threshold} onChange={e => handleFieldChange('resume_score_threshold', e.target.value)} className="max-w-md" />
                  </div>
                  <div className="space-y-2">
                    <Label>Max Shortlisted Candidates</Label>
                    <Input value={formState.max_shortlisted_candidates} onChange={e => handleFieldChange('max_shortlisted_candidates', e.target.value)} className="max-w-md" />
                  </div>
                  <div className="space-y-2">
                    <Label>Auto Shortlist</Label>
                    <Input value={formState.auto_shortlist ? 'Enabled' : 'Disabled'} onChange={e => handleFieldChange('auto_shortlist', e.target.value === 'Enabled')} className="max-w-md" />
                  </div>
                  <div className="space-y-2">
                    <Label>Total Questions</Label>
                    <Input value={formState.total_questions} onChange={e => handleFieldChange('total_questions', Number(e.target.value))} className="max-w-md" />
                  </div>
                  <div className="space-y-2">
                    <Label>Total Marks</Label>
                    <Input value={formState.total_marks} onChange={e => handleFieldChange('total_marks', e.target.value)} className="max-w-md" />
                  </div>
                  <div className="flex gap-4 pt-4">
                    <Button onClick={handleSave} disabled={isUpdatingTest}>
                      {isUpdatingTest ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button variant="outline" onClick={() => { setEditMode(false); setFormState(null); setUpdateError(null); setUpdateSuccess(null); }}>Cancel</Button>
                  </div>
                  {updateError && <div className="text-red-600 text-sm mt-2">{updateError}</div>}
                  {updateSuccess && <div className="text-green-600 text-sm mt-2">{updateSuccess}</div>}
                </>
              )}
              {!formState && <div>Loading...</div>}
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
              <Button variant="destructive" onClick={handleDeleteTest}>
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