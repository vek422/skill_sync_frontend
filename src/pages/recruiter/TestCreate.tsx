import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { cn } from "@/lib/utils";

// Zod validation schema
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

  startSchedule: z
    .date({
      required_error: "Start schedule is required",
    })
    .refine(
      (date) => date > new Date(),
      "Start schedule must be in the future"
    ),

  duration: z
    .number()
    .min(15, "Duration must be at least 15 minutes")
    .max(480, "Duration must not exceed 8 hours (480 minutes)"),
});

type TestCreateFormData = z.infer<typeof testCreateSchema>;

export default function TestCreate() {
  const form = useForm<TestCreateFormData>({
    resolver: zodResolver(testCreateSchema),
    defaultValues: {
      testName: "",
      jobDescription: "",
      startSchedule: undefined,
      duration: 60,
    },
  });

  const onSubmit = (data: TestCreateFormData) => {
    console.log("Form submitted:", data);
    // TODO: Implement API call to create test
  };

  const jobDescriptionValue = form.watch("jobDescription");
  const characterCount = jobDescriptionValue ? jobDescriptionValue.length : 0;

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Create New Test</h1>
        <p className="text-muted-foreground mt-2">
          Set up a new assessment for candidates
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Test Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

              {/* Start Schedule Field */}
              <FormField
                control={form.control}
                name="startSchedule"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-base font-semibold">
                      Start Schedule *
                    </FormLabel>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "flex-1 justify-start pl-3 text-left font-normal h-9",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => {
                              if (date) {
                                // If there's already a time set, preserve it
                                if (field.value) {
                                  const newDate = new Date(date);
                                  newDate.setHours(
                                    field.value.getHours(),
                                    field.value.getMinutes()
                                  );
                                  field.onChange(newDate);
                                } else {
                                  // Set default time to 9:00 AM
                                  const newDate = new Date(date);
                                  newDate.setHours(9, 0, 0, 0);
                                  field.onChange(newDate);
                                }
                              }
                            }}
                            disabled={(date) => {
                              const today = new Date();
                              today.setHours(0, 0, 0, 0);
                              return date < today;
                            }}
                            captionLayout="dropdown"
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <div className="flex items-center gap-2 sm:w-auto">
                        <span className="text-sm text-muted-foreground whitespace-nowrap">
                          at
                        </span>
                        <Input
                          type="time"
                          className="w-28 text-center h-9"
                          value={
                            field.value ? format(field.value, "HH:mm") : "09:00"
                          }
                          onChange={(e) => {
                            const [hours, minutes] = e.target.value.split(":");
                            if (field.value) {
                              const newDate = new Date(field.value);
                              newDate.setHours(
                                parseInt(hours),
                                parseInt(minutes)
                              );
                              field.onChange(newDate);
                            } else {
                              // If no date is selected, set to today with the chosen time
                              const newDate = new Date();
                              newDate.setHours(
                                parseInt(hours),
                                parseInt(minutes),
                                0,
                                0
                              );
                              field.onChange(newDate);
                            }
                          }}
                        />
                      </div>
                    </div>
                    <FormDescription>
                      Select the date and time when the test should be available
                      to candidates
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Duration Field */}
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">
                      Duration (minutes) *
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="60"
                        min="15"
                        max="480"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      Test duration in minutes (15 min - 8 hours)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Form Actions */}
              <div className="flex gap-4 pt-6">
                <Button type="submit" className="flex-1 sm:flex-none">
                  Create Test
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                >
                  Reset Form
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
