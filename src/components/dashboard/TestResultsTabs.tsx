
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TestResultsList } from "@/components/dashboard/TestResultsList";
import { ParsedTestResult } from "@/lib/xmlParser";
import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UploadHistory } from "./UploadHistory";
import { useUploadHistory } from "@/services/uploadHistoryService";

interface TestResultsTabsProps {
  testResults: ParsedTestResult[];
}

export const TestResultsTabs = ({ testResults }: TestResultsTabsProps) => {
  const [visibleTables, setVisibleTables] = useState({
    recent: true,
    failed: true,
    flaky: true
  });
  
  // For real-time updates of test results
  const [displayedResults, setDisplayedResults] = useState<ParsedTestResult[]>([]);
  const { uploads } = useUploadHistory();
  
  // Update displayed results whenever testResults prop changes
  useEffect(() => {
    setDisplayedResults(testResults.slice(-5).reverse());
  }, [testResults]);

  return (
    <div className="space-y-4">
      <Tabs defaultValue="recent" className="w-full">
        <TabsList className="w-full sm:w-auto grid grid-cols-3 sm:inline-flex bg-muted/80">
          <TabsTrigger value="recent">Recent Tests</TabsTrigger>
          <TabsTrigger value="failed">Failed Tests</TabsTrigger>
          <TabsTrigger value="flaky">Flaky Tests</TabsTrigger>
        </TabsList>

        {/* Recent Tests Tab */}
        <TabsContent value="recent" className="mt-3">
          <Card className="border border-amber-100">
            <CardHeader className="pb-0 bg-gradient-to-r from-amber-50 to-white">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-slate-800">Recent Test Results</CardTitle>
                  <CardDescription>Latest 5 test executions</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setVisibleTables(prev => ({ ...prev, recent: !prev.recent }))}
                  className="flex items-center gap-1 h-8"
                >
                  {visibleTables.recent ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </div>
            </CardHeader>
            <CardContent className={cn(
              "transition-all duration-300 ease-in-out overflow-hidden px-3 pt-2",
              visibleTables.recent ? "max-h-[450px] opacity-100" : "max-h-0 opacity-0 py-0"
            )}>
              <TestResultsList tests={displayedResults} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Failed Tests Tab */}
        <TabsContent value="failed" className="mt-3">
          <Card className="border border-red-100">
            <CardHeader className="pb-0 bg-gradient-to-r from-red-50 to-white">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-slate-800">Failed Tests</CardTitle>
                  <CardDescription>Tests that did not pass</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setVisibleTables(prev => ({ ...prev, failed: !prev.failed }))}
                  className="flex items-center gap-1 h-8"
                >
                  {visibleTables.failed ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </div>
            </CardHeader>
            <CardContent className={cn(
              "transition-all duration-300 ease-in-out overflow-hidden px-3 pt-2",
              visibleTables.failed ? "max-h-[450px] opacity-100" : "max-h-0 opacity-0 py-0"
            )}>
              <TestResultsList tests={testResults.filter(test => test.status === 'failed').slice(0, 5)} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Flaky Tests Tab */}
        <TabsContent value="flaky" className="mt-3">
          <Card className="border border-amber-200">
            <CardHeader className="pb-0 bg-gradient-to-r from-amber-50 to-white">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-slate-800">Flaky Tests</CardTitle>
                  <CardDescription>Tests with inconsistent results</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setVisibleTables(prev => ({ ...prev, flaky: !prev.flaky }))}
                  className="flex items-center gap-1 h-8"
                >
                  {visibleTables.flaky ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </div>
            </CardHeader>
            <CardContent className={cn(
              "transition-all duration-300 ease-in-out overflow-hidden px-3 pt-2",
              visibleTables.flaky ? "max-h-[450px] opacity-100" : "max-h-0 opacity-0 py-0"
            )}>
              <TestResultsList tests={testResults.filter(test => test.status === 'flaky').slice(0, 5)} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Upload History */}
      <UploadHistory uploads={uploads} />
    </div>
  );
};
