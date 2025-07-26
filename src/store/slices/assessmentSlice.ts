import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// Types
export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error' | 'reconnecting';

export type QuestionOption = {
    option_id: string;
    option: string;
};

export type Question = {
    question_id: string;
    text: string;
    options: QuestionOption[];
    difficulty: string;
    skill: string;
    time_limit: number;
};

export type QuestionResponse = {
    selectedOption: string;
    optionText: string;
    timestamp: string;
    isCorrect?: boolean;
    correctAnswer?: string;
};

export type ErrorLog = {
    id: string;
    type: string;
    message: string;
    code?: string;
    details?: string;
    timestamp: string;
    recoverable?: boolean;
};

export type Progress = {
    answered_questions: number;
    total_questions: number;
};

export type AssessmentState = {
    // Session identifiers
    assessment_id: string | null;
    application_id: string | null;
    test_id: number | null;
    connection_id: string | null;
    thread_id: string | null;

    // Time tracking
    start_time: string | null;
    end_time: string | null;

    // Connection status
    connection_status: ConnectionStatus;

    // Assessment state
    assessment_started: boolean;
    assessment_completed: boolean;

    // Questions and responses
    current_question: Question | null;
    past_questions: Question[];
    responses: Record<string, QuestionResponse>;

    // Progress tracking
    progress: Progress | null;

    // Results
    final_score: number | null;
    correct_answers: number | null;

    // Error handling
    current_error: string | null;
    error_logs: ErrorLog[];

    // WebSocket management
    reconnect_attempts: number;
    last_message_timestamp: string | null;
};

const initialState: AssessmentState = {
    // Session identifiers
    assessment_id: null,
    application_id: null,
    test_id: null,
    connection_id: null,
    thread_id: null,

    // Time tracking
    start_time: null,
    end_time: null,

    // Connection status
    connection_status: 'disconnected',

    // Assessment state
    assessment_started: false,
    assessment_completed: false,

    // Questions and responses
    current_question: null,
    past_questions: [],
    responses: {},

    // Progress tracking
    progress: null,

    // Results
    final_score: null,
    correct_answers: null,

    // Error handling
    current_error: null,
    error_logs: [],

    // WebSocket management
    reconnect_attempts: 0,
    last_message_timestamp: null,
};

const assessmentSlice = createSlice({
    name: "assessment",
    initialState,
    reducers: {
        // Connection management
        setConnectionStatus(state, action: PayloadAction<ConnectionStatus>) {
            state.connection_status = action.payload;
            state.last_message_timestamp = new Date().toISOString();

            if (action.payload === 'connected') {
                state.reconnect_attempts = 0;
                state.current_error = null;
            } else if (action.payload === 'reconnecting') {
                state.reconnect_attempts += 1;
            }
        },

        setConnectionEstablished(state, action: PayloadAction<{
            connection_id: string;
            user_id: number;
            test_id: number;
        }>) {
            state.connection_status = 'connected';
            state.connection_id = action.payload.connection_id;
            state.test_id = action.payload.test_id;
            state.current_error = null;
            state.last_message_timestamp = new Date().toISOString();
        },

        // Assessment lifecycle
        startAssessment(state, action: PayloadAction<{
            test_id: number;
            application_id?: string;
        }>) {
            state.test_id = action.payload.test_id;
            state.application_id = action.payload.application_id || null;
            state.start_time = new Date().toISOString();
            state.assessment_started = false; // Will be set to true when server confirms
            state.current_error = null;
        },

        setAssessmentStarted(state, action: PayloadAction<{
            assessment_id: string;
            thread_id: string;
            test_id: number;
        }>) {
            state.assessment_started = true;
            state.assessment_id = action.payload.assessment_id;
            state.thread_id = action.payload.thread_id;
            state.test_id = action.payload.test_id;
            state.current_error = null;
            state.last_message_timestamp = new Date().toISOString();
        },

        setAssessmentRecovered(state, action: PayloadAction<{
            assessment_id: string;
            thread_id: string;
            progress: Progress;
        }>) {
            state.assessment_started = true;
            state.assessment_id = action.payload.assessment_id;
            state.thread_id = action.payload.thread_id;
            state.progress = action.payload.progress;
            state.current_error = null;
            state.last_message_timestamp = new Date().toISOString();
        },

        completeAssessment(state, action: PayloadAction<{
            final_score: number;
            correct_answers: number;
            total_questions: number;
            assessment_id: string;
            thread_id: string;
        }>) {
            // Only complete if we have valid completion data
            if (action.payload.assessment_id && action.payload.thread_id) {
                console.log('🏁 Marking assessment as completed with final score:', action.payload.final_score);
                state.assessment_completed = true;
                state.end_time = new Date().toISOString();
                state.final_score = action.payload.final_score;
                state.correct_answers = action.payload.correct_answers;
                state.connection_status = 'disconnected';
                state.last_message_timestamp = new Date().toISOString();

                // Update progress to completion
                if (state.progress) {
                    state.progress.answered_questions = action.payload.total_questions;
                }
            } else {
                console.warn('⚠️ Invalid completion data received, not marking assessment as completed');
            }
        },

        // Question management
        setCurrentQuestion(state, action: PayloadAction<{
            question_id: string;
            thread_id: string;
            question: Omit<Question, 'question_id'>;
        }>) {
            const newQuestion: Question = {
                question_id: action.payload.question_id,
                ...action.payload.question
            };

            // Move current question to past questions if it exists
            if (state.current_question) {
                state.past_questions.push(state.current_question);
            }

            state.current_question = newQuestion;
            state.current_error = null;
            state.last_message_timestamp = new Date().toISOString();
        },

        // Answer management
        submitAnswer(state, action: PayloadAction<{
            question_id: string;
            selected_option: string;
            option_text: string;
        }>) {
            const response: QuestionResponse = {
                selectedOption: action.payload.selected_option,
                optionText: action.payload.option_text,
                timestamp: new Date().toISOString()
            };

            state.responses[action.payload.question_id] = response;
            state.last_message_timestamp = new Date().toISOString();
        },

        setAnswerFeedback(state, action: PayloadAction<{
            question_id: string;
            feedback: {
                correct: boolean;
                selected_option: string;
                correct_answer: string;
                message: string;
            };
            progress: Progress;
            thread_id: string;
        }>) {
            // Update the response with feedback
            if (state.responses[action.payload.question_id]) {
                state.responses[action.payload.question_id].isCorrect = action.payload.feedback.correct;
                state.responses[action.payload.question_id].correctAnswer = action.payload.feedback.correct_answer;
            }

            // Update progress
            state.progress = action.payload.progress;
            state.last_message_timestamp = new Date().toISOString();
        },

        // Progress management
        updateProgress(state, action: PayloadAction<Progress>) {
            state.progress = action.payload;
            state.last_message_timestamp = new Date().toISOString();
        },

        // Error management
        setError(state, action: PayloadAction<{
            message: string;
            code?: string;
            details?: string;
            recoverable?: boolean;
        }>) {
            state.current_error = action.payload.message;

            // Add to error log
            const errorLog: ErrorLog = {
                id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                type: 'websocket_error',
                message: action.payload.message,
                code: action.payload.code,
                details: action.payload.details,
                timestamp: new Date().toISOString(),
                recoverable: action.payload.recoverable ?? false
            };

            state.error_logs.push(errorLog);
            state.last_message_timestamp = new Date().toISOString();

            // Keep only last 50 error logs to prevent memory issues
            if (state.error_logs.length > 50) {
                state.error_logs = state.error_logs.slice(-50);
            }
        },

        clearCurrentError(state) {
            state.current_error = null;
        },

        addErrorLog(state, action: PayloadAction<Omit<ErrorLog, 'id' | 'timestamp'>>) {
            const errorLog: ErrorLog = {
                ...action.payload,
                id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                timestamp: new Date().toISOString()
            };

            state.error_logs.push(errorLog);

            // Keep only last 50 error logs
            if (state.error_logs.length > 50) {
                state.error_logs = state.error_logs.slice(-50);
            }
        },

        clearErrorLogs(state) {
            state.error_logs = [];
        },

        // Session management
        resetAssessment(state) {
            return {
                ...initialState,
                // Preserve error logs for debugging
                error_logs: state.error_logs
            };
        },

        // Update last message timestamp (for heartbeat/activity tracking)
        updateLastMessageTimestamp(state) {
            state.last_message_timestamp = new Date().toISOString();
        },

        // Reconnection management
        incrementReconnectAttempts(state) {
            state.reconnect_attempts += 1;
        },

        resetReconnectAttempts(state) {
            state.reconnect_attempts = 0;
        }
    }
});

export const {
    setConnectionStatus,
    setConnectionEstablished,
    startAssessment,
    setAssessmentStarted,
    setAssessmentRecovered,
    completeAssessment,
    setCurrentQuestion,
    submitAnswer,
    setAnswerFeedback,
    updateProgress,
    setError,
    clearCurrentError,
    addErrorLog,
    clearErrorLogs,
    resetAssessment,
    updateLastMessageTimestamp,
    incrementReconnectAttempts,
    resetReconnectAttempts
} = assessmentSlice.actions;

export const assessmentReducer = assessmentSlice.reducer;
