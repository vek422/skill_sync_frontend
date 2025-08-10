import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useUpdateQuestionCountsMutation } from "@/api/testApi";

interface QuestionCountSettingsProps {
  testId: number;
  high: number; // current high priority questions from backend
  medium: number; // current medium priority questions
  low: number; // current low priority questions
}

const MIN_HIGH = 5;
const MIN_MEDIUM = 3;
const MIN_LOW = 3;

export const QuestionCountSettings: React.FC<QuestionCountSettingsProps> = ({
  testId,
  high: highProp,
  medium: mediumProp,
  low: lowProp,
}) => {
  const [high, setHigh] = useState(Math.max(highProp || 0, MIN_HIGH));
  const [medium, setMedium] = useState(Math.max(mediumProp || 0, MIN_MEDIUM));
  const [low, setLow] = useState(Math.max(lowProp || 0, MIN_LOW));
  const [updateQuestionCounts, { isLoading, error, data }] =
    useUpdateQuestionCountsMutation();

  const adjust = (
    setter: React.Dispatch<React.SetStateAction<number>>,
    value: number,
    min: number
  ) => setter(Math.max(min, value));

  const handleSave = async () => {
    await updateQuestionCounts({
      test_id: testId,
      data: {
        high_priority_questions: high,
        medium_priority_questions: medium,
        low_priority_questions: low,
        total_questions: high + medium + low, // required by TS type (backend ignores)
        time_limit_minutes: 0, // placeholder
      },
    });
  };

  return (
    <div className="p-4 border rounded-lg bg-muted flex flex-col gap-6 max-w-xl">
      {/* High */}
      <div className="flex flex-col gap-2">
        <Label>High Priority Questions</Label>
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="outline"
            onClick={() => adjust(setHigh, high - 1, MIN_HIGH)}
          >
            -
          </Button>
          <Input
            type="number"
            value={high}
            min={MIN_HIGH}
            onChange={(e) => adjust(setHigh, Number(e.target.value), MIN_HIGH)}
            className="w-24 text-center"
          />
          <Button
            size="icon"
            variant="outline"
            onClick={() => setHigh(high + 1)}
          >
            +
          </Button>
          <span className="ml-2 text-xs text-muted-foreground">
            min: {MIN_HIGH}
          </span>
        </div>
      </div>
      {/* Medium */}
      <div className="flex flex-col gap-2">
        <Label>Medium Priority Questions</Label>
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="outline"
            onClick={() => adjust(setMedium, medium - 1, MIN_MEDIUM)}
          >
            -
          </Button>
          <Input
            type="number"
            value={medium}
            min={MIN_MEDIUM}
            onChange={(e) =>
              adjust(setMedium, Number(e.target.value), MIN_MEDIUM)
            }
            className="w-24 text-center"
          />
          <Button
            size="icon"
            variant="outline"
            onClick={() => setMedium(medium + 1)}
          >
            +
          </Button>
          <span className="ml-2 text-xs text-muted-foreground">
            min: {MIN_MEDIUM}
          </span>
        </div>
      </div>
      {/* Low */}
      <div className="flex flex-col gap-2">
        <Label>Low Priority Questions</Label>
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="outline"
            onClick={() => adjust(setLow, low - 1, MIN_LOW)}
          >
            -
          </Button>
          <Input
            type="number"
            value={low}
            min={MIN_LOW}
            onChange={(e) => adjust(setLow, Number(e.target.value), MIN_LOW)}
            className="w-24 text-center"
          />
          <Button size="icon" variant="outline" onClick={() => setLow(low + 1)}>
            +
          </Button>
          <span className="ml-2 text-xs text-muted-foreground">
            min: {MIN_LOW}
          </span>
        </div>
      </div>
      <Button onClick={handleSave} disabled={isLoading} className="w-fit">
        {isLoading ? "Saving..." : "Save Settings"}
      </Button>
      {error && (
        <div className="text-red-600 text-sm">
          {(error as any)?.data?.message || "Failed to update."}
        </div>
      )}
      {data && (
        <div className="text-green-600 text-sm">
          {(data as any)?.message || "Updated"}
        </div>
      )}
    </div>
  );
};

export default QuestionCountSettings;
