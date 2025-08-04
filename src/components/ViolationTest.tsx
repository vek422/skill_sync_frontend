import React from 'react';
import { useViolationTracker } from '@/hooks/useViolationTracker';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ViolationTestProps {
  assessmentId: string;
}

export const ViolationTest: React.FC<ViolationTestProps> = ({ assessmentId }) => {
  const {
    violations,
    enterFullscreen,
    exitFullscreen,
    isFullscreen,
    isMaxViolationsReached
  } = useViolationTracker({
    assessmentId,
    enableTracking: true,
    maxViolations: 5, // Lower limit for testing
    onMaxViolationsReached: () => {
      alert('Max violations reached! Assessment would be submitted.');
    }
  });

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Violation Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p><strong>Violation Count:</strong> {violations.count} / {violations.maxViolations}</p>
          <p><strong>Is Fullscreen:</strong> {isFullscreen ? 'Yes' : 'No'}</p>
          <p><strong>Max Violations Reached:</strong> {isMaxViolationsReached ? 'Yes' : 'No'}</p>
        </div>
        
        <div className="space-y-2">
          <Button 
            onClick={enterFullscreen}
            disabled={isFullscreen}
            className="w-full"
          >
            Enter Fullscreen
          </Button>
          <Button 
            onClick={exitFullscreen}
            disabled={!isFullscreen}
            variant="outline"
            className="w-full"
          >
            Exit Fullscreen (Test Violation)
          </Button>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Recent Violations:</h4>
          <div className="max-h-32 overflow-y-auto text-sm">
            {violations.violations.length === 0 ? (
              <p className="text-gray-500">No violations yet</p>
            ) : (
              violations.violations.slice(-5).map((violation, index) => (
                <div key={index} className="mb-1 p-2 bg-red-50 rounded">
                  <div><strong>Type:</strong> {violation.reason}</div>
                  <div><strong>Time:</strong> {new Date(violation.timestamp).toLocaleTimeString()}</div>
                  {violation.details && <div><strong>Details:</strong> {violation.details}</div>}
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
