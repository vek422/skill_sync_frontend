import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface ViolationEntry {
  timestamp: string;
  reason: 'fullscreen_exit' | 'tab_switch' | 'window_blur';
  details?: string;
}

export interface AssessmentViolations {
  count: number;
  violations: ViolationEntry[];
  isFullscreenRequired: boolean;
  maxViolations: number;
}

interface ViolationsState {
  assessmentViolations: Record<string, AssessmentViolations>;
}

const initialState: ViolationsState = {
  assessmentViolations: {}
};

const violationsSlice = createSlice({
  name: 'violations',
  initialState,
  reducers: {
    initializeAssessmentViolations: (state, action: PayloadAction<{ assessmentId: string; maxViolations?: number }>) => {
      const { assessmentId, maxViolations = 10 } = action.payload;
      if (!state.assessmentViolations[assessmentId]) {
        state.assessmentViolations[assessmentId] = {
          count: 0,
          violations: [],
          isFullscreenRequired: false,
          maxViolations
        };
      }
    },
    
    setFullscreenRequired: (state, action: PayloadAction<{ assessmentId: string; required: boolean }>) => {
      const { assessmentId, required } = action.payload;
      if (state.assessmentViolations[assessmentId]) {
        state.assessmentViolations[assessmentId].isFullscreenRequired = required;
      }
    },
    
    addViolation: (state, action: PayloadAction<{ assessmentId: string; violation: ViolationEntry }>) => {
      const { assessmentId, violation } = action.payload;
      if (state.assessmentViolations[assessmentId]) {
        state.assessmentViolations[assessmentId].count += 1;
        state.assessmentViolations[assessmentId].violations.push(violation);
      }
    },
    
    clearAssessmentViolations: (state, action: PayloadAction<string>) => {
      const assessmentId = action.payload;
      delete state.assessmentViolations[assessmentId];
    },
    
    resetViolationCount: (state, action: PayloadAction<string>) => {
      const assessmentId = action.payload;
      if (state.assessmentViolations[assessmentId]) {
        state.assessmentViolations[assessmentId].count = 0;
        state.assessmentViolations[assessmentId].violations = [];
      }
    }
  }
});

export const {
  initializeAssessmentViolations,
  setFullscreenRequired,
  addViolation,
  clearAssessmentViolations,
  resetViolationCount
} = violationsSlice.actions;

export default violationsSlice.reducer;
