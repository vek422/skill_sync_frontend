import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import MCQCanvas from "./components/MCQCanvas";
import { Button } from "@/components/ui/button";
import { useAssessmentWebSocket } from "@/hooks/useAssessmentWebSocket";
import { useAppSelector } from "@/store";
import { useParams } from "react-router-dom";

export default function TestInterface() {
  const { id } = useParams<{ id: string }>();
  const [selectedOption, setSelectedOption] = useState<string>("");

  const {
    connectionStatus,
    assessmentStarted,
    assessmentCompleted,
    currentQuestion,
    progress,
    currentError,
    submitAnswer,
    completeAssessment,
    startAssessment,
    sendMessage,
    isConnected,
    hasError,
  } = useAssessmentWebSocket({
    testId: id ? parseInt(id) : 0,
    autoStart: false,
  });
  console.log(currentQuestion);
  const { final_score, correct_answers } = useAppSelector(
    (state) => state.assessment
  );

  const handleSubmitAnswer = (skipped = false) => {
    if (skipped && currentQuestion) {
      submitAnswer(currentQuestion.question_id, "skipped");
    }
    if (currentQuestion && selectedOption) {
      submitAnswer(currentQuestion.question_id, selectedOption);
      setSelectedOption("");
    }
  };

  // Test function to send get_test_info message
  const handleTestGetInfo = () => {
    console.log("Sending get_test_info message...");
    sendMessage({
      type: "get_test_info",
      data: { test_id: id ? parseInt(id) : 0 },
    });
  };

  // Debug logging for assessment completion state changes
  useEffect(() => {
    console.log("Assessment completed state changed:", assessmentCompleted);
    if (assessmentCompleted) {
      console.log("Assessment completion details:", {
        final_score,
        correct_answers,
        progress,
      });
    }
  }, [assessmentCompleted, final_score, correct_answers, progress]);

  // Show error state
  if (hasError) {
    return (
      <ScrollArea className="w-screen h-screen p-5 px-5 flex">
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <h1 className="font-bold text-2xl text-red-600">Connection Error</h1>
          <p className="text-gray-600">{currentError}</p>
          <Button onClick={() => window.location.reload()}>Reload Page</Button>
        </div>
      </ScrollArea>
    );
  }

  // Show completion state (only when explicitly marked as completed by backend)
  // if (assessmentCompleted) {
  //   console.log("🎉 Assessment marked as completed, showing results");
  //   return (
  //     <ScrollArea className="w-screen h-screen p-5 px-5 flex">
  //       <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
  //         <h1 className="font-bold text-3xl text-green-600">
  //           🎉 Assessment Completed!
  //         </h1>
  //         {final_score !== null && (
  //           <div className="text-center">
  //             <p className="text-xl">
  //               <strong>Final Score:</strong> {final_score}%
  //             </p>
  //             <p className="text-lg">
  //               <strong>Correct Answers:</strong> {correct_answers}
  //             </p>
  //           </div>
  //         )}
  //       </div>
  //     </ScrollArea>
  //   );
  // }

  // Show loading state
  if (!isConnected) {
    return (
      <ScrollArea className="w-screen h-screen p-5 px-5 flex">
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <h1 className="font-bold text-2xl">Connecting...</h1>
          <div className="text-sm text-gray-600">
            Status: {connectionStatus}
          </div>
        </div>
      </ScrollArea>
    );
  }

  // Show assessment start screen
  if (!assessmentStarted) {
    return (
      <ScrollArea className="w-screen h-screen p-5 px-5 flex">
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <h1 className="font-bold text-3xl">Ready to Start Assessment?</h1>
          <p className="text-gray-600 text-center max-w-md">
            Your assessment is ready to begin. Click the button below to start
            your test session.
          </p>
          <Button onClick={startAssessment} size="lg" className="mt-4">
            Start Assessment
          </Button>
          <div className="text-sm text-gray-600">
            Test ID: {id} | Status: {connectionStatus}
          </div>
        </div>
      </ScrollArea>
    );
  }

  // Show loading state for questions
  if (!currentQuestion) {
    return (
      <ScrollArea className="w-screen h-screen p-5 px-5 flex">
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <h1 className="font-bold text-2xl">Loading Question...</h1>
          <div className="text-sm text-gray-600">
            Status: {connectionStatus}
          </div>
        </div>
      </ScrollArea>
    );
  }

  return (
    <ScrollArea className="w-screen h-screen p-5 px-5 flex">
      {/* Test Button for debugging */}
      {isConnected && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-yellow-800">
              Debug Test:
            </span>
            <Button
              onClick={handleTestGetInfo}
              size="sm"
              variant="outline"
              className="text-xs"
            >
              Send get_test_info
            </Button>
            <span className="text-xs text-yellow-600">
              Check console for response
            </span>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="flex justify-between">
        <div>
          <h1 className="font-bold text-2xl">Assessment</h1>
          <h1 className="text-gray-600">Test ID: {id}</h1>
          <div className="text-sm text-gray-500">
            Status:{" "}
            <span
              className={`font-medium ${
                connectionStatus === "connected"
                  ? "text-green-600"
                  : "text-yellow-600"
              }`}
            >
              {connectionStatus}
            </span>
          </div>
        </div>
        <div>
          {progress && (
            <div className="text-right">
              <h1 className="font-semibold">
                Question {progress.answered_questions + 1} of{" "}
                {progress.total_questions}
              </h1>
              <div className="text-sm text-gray-600">
                {(
                  (progress.answered_questions / progress.total_questions) *
                  100
                ).toFixed(1)}
                % Complete
              </div>
              {/* Progress bar */}
              <div className="w-32 h-2 bg-gray-200 rounded-full mt-2">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-300"
                  style={{
                    width: `${
                      (progress.answered_questions / progress.total_questions) *
                      100
                    }%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        <MCQCanvas
          question={currentQuestion}
          selectedOption={selectedOption}
          onOptionSelect={setSelectedOption}
        />
      </div>

      <div className="py-10 flex gap-4">
        <Button
          onClick={() => handleSubmitAnswer()}
          disabled={!selectedOption}
          className="cursor-pointer"
        >
          Submit and Next
        </Button>
        <Button
          onClick={() => handleSubmitAnswer(true)}
          variant={"outline"}
          className="cursor-pointer"
        >
          Skip
        </Button>

        {/* {progress &&
          progress.answered_questions >= progress.total_questions && (
            <Button onClick={handleCompleteAssessment} variant="secondary">
              Complete Assessment
            </Button>
          )} */}
      </div>
    </ScrollArea>
  );
}
