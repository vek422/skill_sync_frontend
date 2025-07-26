# Assessment WebSocket Implementation

This implementation provides a complete WebSocket integration for the Jatayu AI Quiz Backend, following the WebSocket guide specifications.

## 🗂️ Files Created

### 1. Redux State Management

- **`src/store/slices/assessmentSlice.ts`** - Complete Redux slice for assessment state
- **Updated `src/store/index.ts`** - Added assessment slice to store with persistence

### 2. WebSocket Hook

- **`src/hooks/useAssessmentWebSocket.ts`** - React hook for WebSocket lifecycle management

### 3. Example Component

- **`src/components/examples/AssessmentWebSocketExample.tsx`** - Complete React component example
- **`src/components/examples/AssessmentWebSocketExample.css`** - Styles for the example

## 🚀 Features Implemented

### ✅ Redux State Management

- **Session Identifiers**: `assessment_id`, `application_id`, `test_id`, `connection_id`, `thread_id`
- **Time Tracking**: `start_time`, `end_time`
- **Connection Management**: `connection_status` with reconnection logic
- **Question Management**: `current_question`, `past_questions` with automatic history
- **Response Storage**: `responses` with both option ID and text
- **Progress Tracking**: `answered_questions`, `total_questions`, `percentage_complete`
- **Error Handling**: `current_error`, `error_logs` with detailed logging
- **Persistence**: State survives browser tab closures

### ✅ WebSocket Lifecycle

- **Auto-connection** on hook initialization
- **Automatic reconnection** with exponential backoff
- **Message handling** for all WebSocket guide message types
- **Error recovery** with retry logic
- **Clean disconnection** on unmount

### ✅ Message Protocol Implementation

All message types from the WebSocket guide:

#### Connection Messages

- ✅ `connection_established` - Sets connection state and auto-starts assessment
- ✅ `error` - Comprehensive error handling with logging

#### Assessment Control

- ✅ `start_assessment` - Initiates assessment session
- ✅ `assessment_started` - Confirms start and requests first question
- ✅ `assessment_recovered` - Handles state recovery on reconnection

#### Question Flow

- ✅ `get_question` - Requests next question
- ✅ `question` - Receives and stores question data
- ✅ `submit_answer` - Submits user responses
- ✅ `answer_feedback` - Processes feedback and auto-requests next question

#### Progress & Completion

- ✅ `get_progress` - Requests progress updates
- ✅ `progress_update` - Updates progress state
- ✅ `complete_assessment` - Completes assessment session
- ✅ `assessment_completed` - Handles final results

## 📝 Usage Examples

### Basic Hook Usage

```typescript
import { useAssessmentWebSocket } from "../hooks/useAssessmentWebSocket";

const MyAssessmentComponent = () => {
  const {
    connectionStatus,
    currentQuestion,
    progress,
    submitAnswer,
    isConnected,
  } = useAssessmentWebSocket({
    testId: 42,
    autoStart: true,
  });

  // Component logic here...
};
```

### Advanced Hook Configuration

```typescript
const {
  // State
  connectionStatus,
  assessmentStarted,
  currentQuestion,
  progress,
  currentError,

  // Actions
  submitAnswer,
  requestQuestion,
  completeAssessment,
  resetAssessment,

  // Utils
  isConnected,
  hasError,
} = useAssessmentWebSocket({
  testId: 42,
  autoStart: true,
  maxReconnectAttempts: 5,
  reconnectDelay: 1000,
  websocketUrl: "ws://localhost:8000",
});
```

### Redux State Access

```typescript
import { useAppSelector } from "../store";

const MyComponent = () => {
  const { responses, past_questions, error_logs, final_score } = useAppSelector(
    (state) => state.assessment
  );
};
```

## 🔄 State Flow

### Connection Flow

1. **Initialize** - Hook creates WebSocket connection
2. **Connect** - `connection_established` message received
3. **Start** - Assessment auto-starts (if enabled)
4. **Ready** - `assessment_started` confirms ready state

### Question Flow

1. **Request** - `get_question` sent to server
2. **Receive** - `question` message with question data
3. **Display** - Question shown to user
4. **Answer** - User selects option and submits
5. **Feedback** - `answer_feedback` with results
6. **Next** - Auto-request next question (if available)

### Error Recovery

1. **Detection** - Connection loss or error detected
2. **Reconnect** - Automatic reconnection with backoff
3. **Recovery** - `assessment_recovered` restores state
4. **Continue** - Assessment continues from where it left off

## 🛠️ Configuration Options

### Hook Options

```typescript
interface UseAssessmentWebSocketOptions {
  testId: number; // Required: Test ID to connect to
  autoStart?: boolean; // Auto-start assessment (default: true)
  maxReconnectAttempts?: number; // Max reconnection attempts (default: 5)
  reconnectDelay?: number; // Initial reconnect delay (default: 1000ms)
  websocketUrl?: string; // WebSocket base URL (default: ws://localhost:8000)
}
```

### Redux Persistence

The assessment state is persisted to localStorage and will be restored on page reload:

```typescript
// In store/index.ts
const persistConfig = {
  storage,
  key: "root",
  whitelist: ["auth", "assessment"], // Assessment state persisted
};
```

## 🔍 Debugging

### Development Mode

The example component includes debug information in development mode:

- Connection status
- Current question ID
- Response count
- Reconnection attempts

### Error Logging

All errors are logged to `state.assessment.error_logs` with:

- Unique error ID
- Error type and code
- Timestamp
- Recovery status
- Additional details

### Console Logging

WebSocket events are logged to console for debugging:

- Connection events
- Message parsing errors
- Reconnection attempts

## 🚨 Error Handling

### Connection Errors

- **AUTH_FAILED** - Token invalid/expired
- **ACCESS_DENIED** - No permission for test
- **TEST_NOT_FOUND** - Test doesn't exist

### Assessment Errors

- **ASSESSMENT_FAILED** - Can't start assessment
- **QUESTION_ERROR** - Question generation failed
- **SESSION_EXPIRED** - Assessment timed out

### Recovery Strategies

- **Automatic retry** for recoverable errors
- **Exponential backoff** for reconnections
- **State persistence** survives page reloads
- **Manual retry buttons** for user-initiated recovery

## 🎯 Next Steps

1. **Integration**: Import and use `useAssessmentWebSocket` in your assessment pages
2. **Styling**: Customize the CSS for your design system
3. **Error Handling**: Add custom error UI components
4. **Testing**: Test with various network conditions
5. **Production**: Remove debug info and add proper error tracking

## 📚 Dependencies

- **Redux Toolkit** - State management
- **Redux Persist** - State persistence
- **React** - Hook implementation
- **TypeScript** - Type safety

All dependencies should already be available in your existing setup.
