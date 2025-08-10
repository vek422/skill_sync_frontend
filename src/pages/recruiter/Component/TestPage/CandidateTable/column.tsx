import {
  useDeleteCandidateMutation,
  useGetCandidateApplicationQuery,
} from "@/api/candidateApi";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ColumnDef } from "@tanstack/react-table";
import { FileText, Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";

export type TestCandidate = {
  name: string;
  email: string;
  resume_link: string;
  score: number;
  is_shortlisted: boolean;
  screening_status: string;
  application_id: string;
};

export const columns: ColumnDef<TestCandidate>[] = [
  {
    header: "Rank",
    cell: ({ row }) => <span>{row.index + 1}</span>,
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "resume_link",
    header: "Resume Link",
    cell: ({ getValue }) => {
      const link = getValue() as string;
      return (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline underline-offset-2"
        >
          View Resume
        </a>
      );
    },
  },
  {
    accessorKey: "score",
    header: "Score",
    cell: ({ getValue }) => {
      const resume_score = getValue() as number;
      if (!resume_score)
        return (
          <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-800">
            Not Taken
          </span>
        );
      return (
        <span
          className={`px-2 py-1 rounded text-xs ${
            resume_score >= 80
              ? "bg-green-100 text-green-800"
              : resume_score >= 60
              ? "bg-blue-100 text-blue-800"
              : resume_score >= 40
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {resume_score}%
        </span>
      );
    },
  },
  {
    accessorKey: "is_shortlisted",
    header: "Status",
    cell: ({ getValue }) => {
      const isShortlisted = getValue() as boolean;
      if (isShortlisted)
        return (
          <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">
            Shortlisted
          </span>
        );
      return (
        <span className="px-2 py-1 rounded text-xs bg-red-100 text-red-800">
          Not Shortlisted
        </span>
      );
    },
  },
  {
    accessorKey: "screening_status",
    header: "Screening Status",
    cell: ({ getValue }) => {
      const screeningStatus = getValue();
      if (screeningStatus === "completed")
        return (
          <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">
            Completed
          </span>
        );
      if (screeningStatus === "pending")
        return (
          <span className="px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-800">
            Pending
          </span>
        );
      if (screeningStatus === "failed")
        return (
          <span className="px-2 py-1 rounded text-xs bg-red-100 text-red-800">
            Failed
          </span>
        );
      return (
        <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-800">
          N/A
        </span>
      );
    },
  },
  {
    accessorKey: "application_id",
    header: "Action",
    cell: ({ getValue }) => {
      const application_id = getValue();
      return (
        <div className="flex gap-2">
          <ViewScreeningResult application_id={application_id as number} />
          <DeleteCandidate application_id={application_id as number} />
        </div>
      );
    },
  },
];

const ViewScreeningResult = ({
  application_id,
}: {
  application_id: number;
}) => {
  if (!application_id) return null;
  const { data, isLoading, isError, refetch } =
    useGetCandidateApplicationQuery(application_id);

  const formatDate = (iso?: string) => {
    if (!iso) return "-";
    try {
      // Try parseISO first; fall back to Date constructor
      const d = parseISO(iso);
      if (isNaN(d.getTime())) return "-";
      return format(d, "PPpp"); // Localized date + time
    } catch {
      try {
        const d = new Date(iso);
        if (isNaN(d.getTime())) return "-";
        return format(d, "PPpp");
      } catch {
        return "-";
      }
    }
  };

  const ScoreBar = ({ label, value }: { label: string; value?: number }) => (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm font-medium">
        <span>{label}</span>
        <span className="text-muted-foreground">{value ?? 0}%</span>
      </div>
      <Progress value={value ?? 0} className="h-2" />
    </div>
  );

  return (
    <Dialog>
      <DialogTrigger
        asChild
        aria-label="View screening result"
        className="cursor-pointer"
      >
        <FileText className="h-4 w-4" />
      </DialogTrigger>
      <DialogContent className="max-w-none w-[900px] h-[600px] p-0 flex flex-col">
        {/* Header */}
        <div className="p-6 pb-4 border-b">
          <DialogHeader className="space-y-2">
            <DialogTitle className="flex items-center gap-3">
              Screening Result
              {data?.is_shortlisted && (
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800 border border-green-200"
                >
                  Shortlisted
                </Badge>
              )}
            </DialogTitle>
            <DialogDescription>
              Detailed automated screening metrics for this candidate.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Body Scroll */}
        <ScrollArea className="flex-1 h-[20vh]">
          <div className="p-6 pt-4">
            {isLoading && (
              <div className="flex items-center gap-2 py-10 justify-center text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading result...
              </div>
            )}

            {isError && !isLoading && (
              <div className="flex flex-col items-center gap-4 py-10 text-center">
                <p className="text-sm text-destructive">
                  Failed to load result.
                </p>
                <Button size="sm" onClick={() => refetch()}>
                  Retry
                </Button>
              </div>
            )}

            {!isLoading &&
              !isError &&
              data &&
              (() => {
                const app = data; // safe narrowing for TS
                return (
                  <div className="space-y-8">
                    {/* Core Info */}
                    <section
                      aria-labelledby="candidate-info"
                      className="space-y-3"
                    >
                      <h3
                        id="candidate-info"
                        className="text-sm font-semibold tracking-wide text-muted-foreground"
                      >
                        Candidate
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-xs uppercase text-muted-foreground">
                            Application ID
                          </p>
                          <p className="font-medium">{app.application_id}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase text-muted-foreground">
                            Test ID
                          </p>
                          <p className="font-medium">{app.test_id}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase text-muted-foreground">
                            Applied At
                          </p>
                          <p className="font-medium">
                            {formatDate(app.applied_at)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs uppercase text-muted-foreground">
                            Updated At
                          </p>
                          <p className="font-medium">
                            {formatDate(app.updated_at)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs uppercase text-muted-foreground">
                            Screening Completed
                          </p>
                          <p className="font-medium">
                            {formatDate(app.screening_completed_at)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs uppercase text-muted-foreground">
                            Resume
                          </p>
                          <a
                            href={app.resume_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-primary underline underline-offset-2"
                          >
                            Open Link
                          </a>
                        </div>
                      </div>
                    </section>

                    <Separator />

                    {/* Analysis Grid: AI Reasoning (left) & Scores (right) */}
                    <section
                      aria-labelledby="analysis-grid"
                      className="grid gap-6 md:grid-cols-2"
                    >
                      <div className="space-y-4">
                        <h3
                          id="analysis-grid"
                          className="text-sm font-semibold tracking-wide text-muted-foreground"
                        >
                          {app.ai_reasoning ? "AI Reasoning" : "Details"}
                        </h3>
                        {app.ai_reasoning ? (
                          <div className="rounded-md border bg-muted/30 p-4 text-sm leading-relaxed min-h-[260px]">
                            {app.ai_reasoning}
                          </div>
                        ) : (
                          <div className="rounded-md border bg-muted/30 p-4 text-sm text-muted-foreground min-h-[260px] flex items-center justify-center">
                            No AI reasoning available.
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-sm font-semibold tracking-wide text-muted-foreground">
                          Scores
                        </h3>
                        <div className="space-y-4 rounded-md border p-4 bg-background min-h-[260px]">
                          <ScoreBar
                            label="Overall Resume Score"
                            value={app.resume_score}
                          />
                          <ScoreBar
                            label="Skill Match"
                            value={app.skill_match_percentage}
                          />
                          <ScoreBar
                            label="Experience Score"
                            value={app.experience_score}
                          />
                          <ScoreBar
                            label="Education Score"
                            value={app.education_score}
                          />
                        </div>
                      </div>
                    </section>
                  </div>
                );
              })()}
          </div>
        </ScrollArea>

        {/* Footer */}
        <DialogFooter className="px-6 py-4 border-t bg-muted/30">
          <DialogClose asChild>
            <Button variant="secondary">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const DeleteCandidate = ({ application_id }: { application_id: number }) => {
  const [deleteCandidate, { isLoading, error }] = useDeleteCandidateMutation();
  const [isOpen, setIsOpen] = useState(false);
  const handleDeleteCandidate = async () => {
    try {
      await deleteCandidate(application_id).unwrap();
      toast("Deleted Candidate");
    } catch (err) {
      toast("Error while removing the candidate");
    } finally {
      setIsOpen(false);
    }
  };
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger className="text-destructive cursor-pointer">
        <Trash2 className=" h-4 w-4" />
      </PopoverTrigger>
      <PopoverContent>
        <div>Are you sure you want to delete the candidate?</div>

        <div className="flex justify-end gap-2">
          <Button variant={"outline"} onClick={() => setIsOpen(false)}>
            Cancel
          </Button>

          <Button onClick={handleDeleteCandidate} variant={"destructive"}>
            {isLoading ? <Loader2 className="animate-spin" /> : "Remove"}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
