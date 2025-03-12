
import { CheckCircle, XCircle, Clock, AlertTriangle, Monitor, Code, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TestResult {
  id: string;
  name: string;
  status: 'passed' | 'failed' | 'flaky';
  duration: string;
  timestamp: string;
  framework: string;
  browser: string;
  errorMessage?: string;
}

interface TestResultsListProps {
  tests: TestResult[];
}

export const TestResultsList = ({ tests }: TestResultsListProps) => {
  const [expandedTests, setExpandedTests] = useState<Record<string, boolean>>({});

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'passed':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Passed</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Failed</Badge>;
      case 'flaky':
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">Flaky</Badge>;
      default:
        return null;
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedTests((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="space-y-3">
      {tests.length === 0 ? (
        <p className="text-center text-muted-foreground py-6">No test results found</p>
      ) : (
        tests.map((test) => (
          <div 
            key={test.id}
            className="rounded-md border bg-background overflow-hidden"
          >
            <div className="flex items-center justify-between p-3 cursor-pointer hover:bg-muted/30" onClick={() => toggleExpand(test.id)}>
              <div className="flex items-center gap-3">
                {getStatusIcon(test.status)}
                <div>
                  <div className="font-medium flex items-center gap-2">
                    {test.name}
                    {getStatusBadge(test.status)}
                  </div>
                  <div className="text-xs text-muted-foreground">{test.timestamp}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-2">
                  <Code className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{test.framework}</span>
                </div>
                <div className="hidden md:flex items-center gap-2">
                  <Monitor className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{test.browser}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{test.duration}</span>
                </div>
                {expandedTests[test.id] ? 
                  <ChevronUp className="h-4 w-4" /> : 
                  <ChevronDown className="h-4 w-4" />
                }
              </div>
            </div>
            
            {expandedTests[test.id] && (
              <div className="p-3 pt-0 border-t mt-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm p-3 bg-muted/20 rounded-md">
                  <div>
                    <p className="font-medium">Framework</p>
                    <p className="text-muted-foreground">{test.framework}</p>
                  </div>
                  <div>
                    <p className="font-medium">Browser</p>
                    <p className="text-muted-foreground">{test.browser}</p>
                  </div>
                  <div>
                    <p className="font-medium">Duration</p>
                    <p className="text-muted-foreground">{test.duration}</p>
                  </div>
                  <div>
                    <p className="font-medium">Timestamp</p>
                    <p className="text-muted-foreground">{test.timestamp}</p>
                  </div>
                  {test.errorMessage && (
                    <div className="col-span-2">
                      <p className="font-medium">Error Message</p>
                      <p className="text-red-600 mt-1 p-2 bg-red-50 rounded border border-red-100 overflow-x-auto">
                        {test.errorMessage}
                      </p>
                    </div>
                  )}
                </div>
                <div className="mt-2 flex justify-end">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand(test.id);
                    }}
                  >
                    Close Details
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};
