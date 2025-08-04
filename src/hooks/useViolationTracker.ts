import { useEffect, useCallback, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import {
    initializeAssessmentViolations,
    setFullscreenRequired,
    addViolation,
    type ViolationEntry
} from '../store/slices/violationsSlice';

interface UseViolationTrackerOptions {
    assessmentId: string;
    onMaxViolationsReached?: () => void;
    maxViolations?: number;
    enableTracking?: boolean;
}

export const useViolationTracker = ({
    assessmentId,
    onMaxViolationsReached,
    maxViolations = 10,
    enableTracking = false
}: UseViolationTrackerOptions) => {
    const dispatch = useAppDispatch();
    const violations = useAppSelector(state => state.violations.assessmentViolations[assessmentId]);
    const isTrackingRef = useRef(false);
    const lastViolationTimeRef = useRef(0);

    // Initialize violations for this assessment
    useEffect(() => {
        dispatch(initializeAssessmentViolations({ assessmentId, maxViolations }));
    }, [assessmentId, maxViolations, dispatch]);

    // Add violation helper with debouncing
    const addViolationEntry = useCallback((reason: ViolationEntry['reason'], details?: string) => {
        if (!isTrackingRef.current) return;

        const now = Date.now();
        // Debounce violations within 1 second
        if (now - lastViolationTimeRef.current < 1000) {
            return;
        }
        lastViolationTimeRef.current = now;

        const violation: ViolationEntry = {
            timestamp: new Date().toISOString(),
            reason,
            details
        };

        dispatch(addViolation({ assessmentId, violation }));

        console.warn(`Assessment violation detected: ${reason}`, violation);

        // Check if max violations reached
        const currentCount = violations?.count || 0;
        if (currentCount + 1 >= maxViolations) {
            onMaxViolationsReached?.();
        }
    }, [assessmentId, dispatch, violations?.count, maxViolations, onMaxViolationsReached]);

    // Fullscreen change handler
    const handleFullscreenChange = useCallback(() => {
        if (!isTrackingRef.current) return;

        if (!document.fullscreenElement) {
            addViolationEntry('fullscreen_exit', 'User exited fullscreen mode');
        }
    }, [addViolationEntry]);

    // Visibility change handler (tab switching)
    const handleVisibilityChange = useCallback(() => {
        if (!isTrackingRef.current) return;

        if (document.hidden) {
            addViolationEntry('tab_switch', 'User switched away from assessment tab');
        }
    }, [addViolationEntry]);

    // Window blur handler (switching applications)
    const handleWindowBlur = useCallback(() => {
        if (!isTrackingRef.current) return;

        addViolationEntry('window_blur', 'User switched to another application');
    }, [addViolationEntry]);

    // Enter fullscreen
    const enterFullscreen = useCallback(async () => {
        try {
            if (document.documentElement.requestFullscreen) {
                await document.documentElement.requestFullscreen();
            }
            dispatch(setFullscreenRequired({ assessmentId, required: true }));
            return true;
        } catch (error) {
            console.error('Failed to enter fullscreen:', error);
            return false;
        }
    }, [assessmentId, dispatch]);

    // Exit fullscreen
    const exitFullscreen = useCallback(async () => {
        try {
            if (document.fullscreenElement && document.exitFullscreen) {
                await document.exitFullscreen();
            }
            dispatch(setFullscreenRequired({ assessmentId, required: false }));
        } catch (error) {
            console.error('Failed to exit fullscreen:', error);
        }
    }, [assessmentId, dispatch]);

    // Start tracking violations
    const startTracking = useCallback(() => {
        isTrackingRef.current = true;

        // Add event listeners
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('blur', handleWindowBlur);
    }, [handleFullscreenChange, handleVisibilityChange, handleWindowBlur]);

    // Stop tracking violations
    const stopTracking = useCallback(() => {
        isTrackingRef.current = false;

        // Remove event listeners
        document.removeEventListener('fullscreenchange', handleFullscreenChange);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('blur', handleWindowBlur);
    }, [handleFullscreenChange, handleVisibilityChange, handleWindowBlur]);

    // Effect to manage tracking based on enableTracking prop
    useEffect(() => {
        if (enableTracking) {
            startTracking();
        } else {
            stopTracking();
        }

        return () => {
            stopTracking();
        };
    }, [enableTracking, startTracking, stopTracking]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopTracking();
            exitFullscreen();
        };
    }, [stopTracking, exitFullscreen]);

    return {
        violations: violations || { count: 0, violations: [], isFullscreenRequired: false, maxViolations },
        enterFullscreen,
        exitFullscreen,
        startTracking,
        stopTracking,
        isFullscreen: !!document.fullscreenElement,
        isMaxViolationsReached: (violations?.count || 0) >= maxViolations
    };
};
