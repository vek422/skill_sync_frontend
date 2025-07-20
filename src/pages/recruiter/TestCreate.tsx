import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import SkillGraphDistributionControls from "@/components/SkillGraphDistributionControls";
import { useCreateTestMutation, type CreateTestRequest } from "@/api/testApi";
import { useNavigate } from "react-router-dom";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

// Updated Zod validation schema to match backend
const testCreateSchema = z.object({
  testName: z
    .string()
    .min(1, "Test name is required")
    .min(3, "Test name must be at least 3 characters")
    .max(100, "Test name must not exceed 100 characters"),

  jobDescription: z
    .string()
    .min(1, "Job description is required")
    .min(300, "Job description must be at least 300 characters")
    .max(2000, "Job description must not exceed 2000 characters"),

  // Backend fields - all optional except auto_shortlist
  resumeScoreThreshold: z
    .number()
    .min(0, "Resume score threshold must be at least 0")
    .max(100, "Resume score threshold must not exceed 100")
    .optional(),

  maxShortlistedCandidates: z
    .number()
    .min(1, "Must allow at least 1 candidate")
    .max(1000, "Cannot exceed 1000 candidates")
    .optional(),

  autoShortlist: z.boolean(),

  // Removed totalQuestions, timeLimitMinutes, totalMarks from schema
}).refine(
  (data) => {
    // If auto shortlist is enabled, max shortlisted candidates is required
    if (data.autoShortlist && !data.maxShortlistedCandidates) {
      return false;
    }
    return true;
  },
  {
    message: "Max shortlisted candidates is required when auto shortlist is enabled",
    path: ["maxShortlistedCandidates"],
  }
).refine(
  (data) => {
    // If auto shortlist is enabled, resume score threshold is required
    if (data.autoShortlist && data.resumeScoreThreshold === undefined) {
      return false;
    }
    return true;
  },
  {
    message: "Resume score threshold is required when auto shortlist is enabled",
    path: ["resumeScoreThreshold"],
  }
);

type TestCreateFormData = z.infer<typeof testCreateSchema>;

export default function TestCreate() {
  // State for question distribution (percentages) and total questions
  const [totalQuestions, setTotalQuestions] = useState(20);
  // sliderValues: [low%, low+medium%], e.g. [33, 66]
  const [sliderValues, setSliderValues] = useState<number[]>([33, 66]);
  const [totalTime, setTotalTime] = useState(0);

  // Calculate question counts from slider
  const low = sliderValues[0];
  const medium = sliderValues[1] - sliderValues[0];
  // const high = 100 - sliderValues[1];
  const lowCount = Math.round((low / 100) * totalQuestions);
  const medCount = Math.round((medium / 100) * totalQuestions);
  const highCount = totalQuestions - lowCount - medCount;

  // Calculate total time whenever distribution changes
  useEffect(() => {
    if (lowCount + medCount + highCount !== totalQuestions) {
      setTotalTime(0);
      return;
    }
    const seconds = lowCount * 45 + medCount * 60 + highCount * 90;
    setTotalTime(Math.ceil(seconds / 60));
  }, [lowCount, medCount, highCount, totalQuestions]);
  // RTK Query hook for API call with built-in loading states
  const [createTest, { isLoading, error, isSuccess }] = useCreateTestMutation();
  const navigate = useNavigate();
  
  const form = useForm<TestCreateFormData>({
    resolver: zodResolver(testCreateSchema),
    defaultValues: {
      testName: "",
      jobDescription: "",
      resumeScoreThreshold: undefined,
      maxShortlistedCandidates: undefined,
      autoShortlist: false,
      // Removed totalQuestions, timeLimitMinutes, totalMarks from defaultValues
    },
  });

  // Transform form data to API format and submit
  const onSubmit = async (data: TestCreateFormData) => {
    try {

      // Calculate question_distribution counts
      const low = sliderValues[0];
      const medium = sliderValues[1] - sliderValues[0];
      // const high = 100 - sliderValues[1];
      const lowCount = Math.round((low / 100) * totalQuestions);
      const medCount = Math.round((medium / 100) * totalQuestions);
      const highCount = totalQuestions - lowCount - medCount;

      // Transform camelCase form fields to snake_case API fields and include all required fields
      const apiData: CreateTestRequest & { question_distribution: { low: number; medium: number; high: number } } = {
        test_name: data.testName,
        job_description: data.jobDescription,
        auto_shortlist: data.autoShortlist,
        ...(data.resumeScoreThreshold !== undefined && { 
          resume_score_threshold: data.resumeScoreThreshold 
        }),
        ...(data.maxShortlistedCandidates !== undefined && { 
          max_shortlisted_candidates: data.maxShortlistedCandidates 
        }),
        total_questions: totalQuestions,
        time_limit_minutes: totalTime,
        total_marks: totalQuestions, // or set to another value if needed
        question_distribution: {
          low: lowCount,
          medium: medCount,
          high: highCount
        }
      };

      console.log("Submitting test data:", apiData);
      
      // Call API using RTK Query mutation
      const result = await createTest(apiData).unwrap();
      console.log("Test created successfully:", result);
      
      // Reset form on success
      form.reset();
      
      // Navigate to tests list or show success message
      // navigate('/recruiter/tests');
      
    } catch (error) {
      console.error("Failed to create test:", error);
      // RTK Query error is automatically handled in the error state
    }
  };

  // Auto-redirect on success after showing message
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        navigate('/recruiter/tests');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, navigate]);

  const jobDescriptionValue = form.watch("jobDescription");
  const characterCount = jobDescriptionValue ? jobDescriptionValue.length : 0;
  
  // Watch autoShortlist to conditionally enable maxShortlistedCandidates
  const autoShortlistEnabled = form.watch("autoShortlist");

  // Clear maxShortlistedCandidates and resumeScoreThreshold when autoShortlist is disabled
  useEffect(() => {
    if (!autoShortlistEnabled) {
      form.setValue("maxShortlistedCandidates", undefined);
      form.setValue("resumeScoreThreshold", undefined);
    }
  }, [autoShortlistEnabled, form]);

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Create New Test</h1>
        <p className="text-muted-foreground mt-2">
          Set up a new assessment for candidates
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Test Name Field */}
              <FormField
                control={form.control}
                name="testName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">
                      Test Name *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter test name (e.g., Frontend Developer Assessment)"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      A clear and descriptive name for your test
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Job Description Field */}
              <FormField
                control={form.control}
                name="jobDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">
                      Job Description *
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Provide a detailed job description including required skills, responsibilities, and qualifications..."
                        className="min-h-32 resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="flex flex-col gap-1">
                      <span>
                        Ensure required skills and responsibilities are properly
                        mentioned.
                      </span>
                      <span
                        className={
                          characterCount >= 300
                            ? "text-green-600"
                            : "text-orange-600"
                        }
                      >
                        Character count: {characterCount}/300 minimum
                      </span>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Assessment Configuration Card */}
          <Card>
            <CardHeader>
              <CardTitle>Assessment Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Auto Shortlist */}
              <FormField
                control={form.control}
                name="autoShortlist"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base font-semibold">
                        Auto Shortlist Candidates
                      </FormLabel>
                      <FormDescription>
                        Automatically shortlist candidates based on resume score
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Resume Score Threshold - Show after Auto Shortlist toggle */}
              {autoShortlistEnabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="resumeScoreThreshold"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">
                          Resume Score Threshold (%) *
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="70"
                            min="0"
                            max="100"
                            value={field.value ?? ""}
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(value === "" ? undefined : Number(value));
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          Minimum resume score to qualify (0-100%) - Required when auto shortlist is enabled
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Max Shortlisted Candidates */}
                  <FormField
                    control={form.control}
                    name="maxShortlistedCandidates"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">
                          Max Shortlisted Candidates *
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="50"
                            min="1"
                            max="1000"
                            value={field.value ?? ""}
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(value === "" ? undefined : Number(value));
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          Maximum number of candidates to shortlist (1-1000) - Required when auto shortlist is enabled
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Question Distribution Slider (multi-thumb, like Skill Graph) */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Question Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <SkillGraphDistributionControls
                totalQuestions={totalQuestions}
                setTotalQuestions={setTotalQuestions}
                sliderValues={sliderValues}
                setSliderValues={setSliderValues}
                hideUpdateButton
              />
              <div className="text-sm mt-1">
                <span className={lowCount + medCount + highCount === totalQuestions ? "text-green-600" : "text-red-600"}>
                  Total: {lowCount + medCount + highCount} / {totalQuestions} questions
                </span>
              </div>
              <div className="text-sm mt-1">
                <span className="font-semibold">Calculated Time: </span>
                {lowCount + medCount + highCount === totalQuestions ? `${totalTime} minutes` : <span className="text-red-600">(fix distribution)</span>}
              </div>
            </CardContent>
          </Card>
           {/* Status Messages */}
          {error && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-red-700">
                  <XCircle className="h-5 w-5" />
                  <div>
                    <p className="font-semibold">Failed to create test</p>
                    <p className="text-sm">
                      {(error as any)?.data?.message || 'An unexpected error occurred. Please try again.'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {isSuccess && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="h-5 w-5" />
                  <div>
                    <p className="font-semibold">Test created successfully!</p>
                    <p className="text-sm">Redirecting to tests list...</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Form Actions */}
          <div className="flex gap-4 pt-6">
            <Button 
              type="submit" 
              className="flex-1 sm:flex-none"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Test...
                </>
              ) : (
                'Create Test'
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
              disabled={isLoading}
            >
              Reset Form
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
