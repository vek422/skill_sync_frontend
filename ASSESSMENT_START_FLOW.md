# Assessment Start Flow Implementation

## Overview

This update implements the proper assessment start flow where assessments only start when the user clicks "Start Assessment" and routes to `/candidate/test/:id` with appropriate start logic.

## Key Changes Made

### 1. CandidateHomePage.tsx

- **Added navigation hook**: `import { useNavigate } from "react-router-dom"`
- **Updated handleTestAction function**:
  - Now properly navigates to `/candidate/test/${testId}` for active tests
  - Handles different status types (ongoing, in-progress, started, live, active, available, scheduled)
  - Routes to results page for completed tests
  - Added proper logging for debugging

### 2. TestInstruction.tsx

- **Added required imports**: `useState`, `useParams`, `useNavigate`
- **Added state management**: `instructionsRead` state to track checkbox
- **Implemented handleStartTest function**:
  - Validates that instructions are read
  - Checks for valid test ID
  - Navigates to `/candidate/test/${id}` when starting
- **Updated UI**:
  - Made checkbox controlled with proper state
  - Disabled "Start Test" button until instructions are accepted
  - Added click handler to button

### 3. TestInterface.tsx

- **Changed autoStart behavior**: Set `autoStart: false` in WebSocket hook
- **Added startAssessment function**: Extracted from WebSocket hook return
- **Improved UI flow**:
  - Shows connection status screen
  - Shows assessment start screen with "Start Assessment" button when not started
  - Shows loading screen for questions after starting
  - Proper separation of connection, start, and question loading states
- **Fixed variable naming**: Changed `testId` to `id` in display

### 4. AssignedTestCard.tsx

- **Already properly configured**: The card shows Start Test buttons for appropriate statuses
- **Action button logic**: Handles all status types correctly (scheduled, live, active, available, ongoing, etc.)
- **Proper button states**: Start Test, Resume Test, View Results based on status

## Route Configuration

The routes are correctly configured in `routes/index.ts`:

- `/candidate/test/:id/instruction` → TestInstructionPage
- `/candidate/test/:id` → TestInterface

## Assessment Flow

1. **Home Page**: User sees assigned tests with "Start Test" button for available tests
2. **Click Start Test**: Routes to `/candidate/test/:id` (TestInterface)
3. **Assessment Interface**:
   - Connects to WebSocket (autoStart: false)
   - Shows "Start Assessment" button
   - User clicks to begin assessment
   - Questions load and assessment begins

## WebSocket Integration

- **Connection**: Establishes WebSocket connection on page load
- **Manual Start**: Assessment only starts when user clicks "Start Assessment"
- **State Management**: Uses Redux to persist assessment state
- **Error Handling**: Proper error states and reconnection logic

## Files Modified

1. `src/pages/candidate/CandidateHomePage.tsx`
2. `src/pages/candidate/TestInstruction.tsx`
3. `src/pages/candidate/TestInterface.tsx`
4. `src/pages/candidate/components/AssignedTestCard.tsx` (already correct)

## Testing Recommendations

1. Test navigation from home page to test interface
2. Verify WebSocket connection establishment
3. Test assessment start button functionality
4. Verify state persistence between page refreshes
5. Test error handling and reconnection scenarios

## Key Benefits

- ✅ User has control over when assessment starts
- ✅ Clear UI feedback for each stage
- ✅ Proper navigation between screens
- ✅ WebSocket connects but waits for user action
- ✅ Assessment state properly managed in Redux
- ✅ Error handling and loading states
