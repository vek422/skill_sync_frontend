import React, { useState, useEffect } from "react";
import * as Slider from '@radix-ui/react-slider';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface SkillGraphDistributionControlsProps {
  totalQuestions: number;
  setTotalQuestions: (n: number) => void;
  sliderValues: number[];
  setSliderValues: (v: number[]) => void;
  onUpdate?: () => void;
  isUpdating?: boolean;
  error?: string | null;
  success?: string | null;
  hideUpdateButton?: boolean;
}

const SkillGraphDistributionControls: React.FC<SkillGraphDistributionControlsProps> = ({
  totalQuestions,
  setTotalQuestions,
  sliderValues,
  setSliderValues,
  onUpdate,
  isUpdating,
  error,
  success,
  hideUpdateButton = false,
}) => {
  // Calculate H/M/L from slider (percentages)
  const low = sliderValues[0];
  const medium = sliderValues[1] - sliderValues[0];
  const high = 100 - sliderValues[1];
  // Calculate question counts
  const lowQ = Math.round((low / 100) * totalQuestions);
  const mediumQ = Math.round((medium / 100) * totalQuestions);
  const highQ = totalQuestions - lowQ - mediumQ;

  // When totalQuestions changes, keep slider values
  const handleTotalChange = (value: number) => {
    setTotalQuestions(value);
  };

  // Slider change handler
  const handleSliderChange = (values: number[]) => {
    setSliderValues(values);
  };

  return (
    <div className="mb-8 bg-muted rounded-lg p-6 flex flex-col gap-6">
      {/* Total Questions Input */}
      <div className="flex flex-col gap-2">
        <Label className="mb-1 block">Total Questions</Label>
        <input
          type="number"
          min={1}
          value={totalQuestions}
          onChange={e => handleTotalChange(Number(e.target.value))}
          className="w-32 px-2 py-1 border rounded"
        />
      </div>
      <div className="mt-6">
        <Label className="mb-2 block">Difficulty Percentage Distribution</Label>
        <div className="relative w-full flex flex-col items-stretch">
          {/* 0% and 100% above the slider */}
          <div className="flex justify-between px-1 mb-1">
            <span className="text-xs text-gray-500">0%</span>
            <span className="text-xs text-gray-500">100%</span>
          </div>
          <div className="relative w-full h-14 flex items-center">
            {/* Custom colored track segments */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-3 rounded-full bg-gray-200 z-0" />
            {/* Low (green) */}
            <div
              className="absolute top-1/2 -translate-y-1/2 h-3 rounded-l-full z-10"
              style={{ left: 0, width: `${sliderValues[0]}%`, background: '#22c55e' }}
            />
            {/* Medium (orange) */}
            <div
              className="absolute top-1/2 -translate-y-1/2 h-3 z-10"
              style={{ left: `${sliderValues[0]}%`, width: `${sliderValues[1] - sliderValues[0]}%`, background: '#f59e42' }}
            />
            {/* High (red) */}
            <div
              className="absolute top-1/2 -translate-y-1/2 h-3 rounded-r-full z-10"
              style={{ left: `${sliderValues[1]}%`, width: `${100 - sliderValues[1]}%`, background: '#ef4444' }}
            />
            <Slider.Root
              className="relative flex items-center select-none touch-none w-full h-14 z-20"
              min={0}
              max={100}
              step={1}
              value={sliderValues}
              onValueChange={handleSliderChange}
              minStepsBetweenThumbs={1}
            >
              {/* Thumbs with color */}
              <Slider.Thumb
                className="block w-7 h-7 bg-white border-2 border-green-500 rounded-full shadow-lg focus:outline-none relative"
                aria-label="Low Thumb"
              />
              <Slider.Thumb
                className="block w-7 h-7 bg-white border-2 border-orange-500 rounded-full shadow-lg focus:outline-none relative"
                aria-label="Medium Thumb"
              />
            </Slider.Root>
          </div>
        </div>
        {/* Show both percentage and question count for each difficulty */}
        <div className="flex justify-between mt-4 text-sm">
          <div className="flex flex-col items-start gap-1 min-w-[120px]">
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-2" />
              <span>Low (L): <span className="font-bold text-green-700">{low}%</span></span>
            </div>
            <span className="text-xs text-green-700">Questions: {lowQ}</span>
          </div>
          <div className="flex flex-col items-center gap-1 min-w-[140px] justify-center">
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-orange-500 mr-2" />
              <span>Medium (M): <span className="font-bold text-orange-700">{medium}%</span></span>
            </div>
            <span className="text-xs text-orange-700">Questions: {mediumQ}</span>
          </div>
          <div className="flex flex-col items-end gap-1 min-w-[120px] justify-end">
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-2" />
              <span>High (H): <span className="font-bold text-red-700">{high}%</span></span>
            </div>
            <span className="text-xs text-red-700">Questions: {highQ}</span>
          </div>
        </div>
      </div>
      {!hideUpdateButton && (
        <div className="flex items-center gap-4 mt-2">
          <Button onClick={onUpdate} disabled={isUpdating} className="bg-primary text-primary-foreground">
            {isUpdating ? 'Updating...' : 'Update Skill Graph'}
          </Button>
          {error && <span className="text-red-600 text-sm">{error}</span>}
          {success && <span className="text-green-600 text-sm">{success}</span>}
        </div>
      )}
      <div className="text-xs text-muted-foreground mt-2">
        Adjust the slider. L + M + H will always equal 100%.<br />
        When you update, the values will be converted to question counts.<br />
        The backend will recalculate time and marks based on your distribution.
      </div>
    </div>
  );
};

export default SkillGraphDistributionControls;
