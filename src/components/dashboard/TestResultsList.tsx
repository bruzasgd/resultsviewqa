
import { CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TestResult {
  id: string;
  name: string;
  status: 'passed' | 'failed' | 'flaky';
  duration: string;
  timestamp: string;
}

interface TestResultsListProps {
  tests: TestResult[];
}

export const TestResultsList = ({ tests }: TestResultsListProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'flaky':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-3">
      {tests.length === 0 ? (
        <p className="text-center text-muted-foreground py-6">No test results found</p>
      ) : (
        tests.slice(0, 5).map((test) => (
          <div 
            key={test.id}
            className="flex items-center justify-between p-3 rounded-md border bg-background"
          >
            <div className="flex items-center gap-3">
              {getStatusIcon(test.status)}
              <div>
                <div className="font-medium">{test.name}</div>
                <div className="text-xs text-muted-foreground">{test.timestamp}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{test.duration}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
