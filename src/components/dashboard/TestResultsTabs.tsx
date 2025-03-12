
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TestResultsList } from "@/components/dashboard/TestResultsList";
import { ParsedTestResult } from "@/lib/xmlParser";
import { useState } from "react";
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

  const { uploads } = useUploadHistory();

  return (
    <div className="space-y-6">
      <Tabs defaultValue="recent" className="w-full">
        <TabsList>
          <TabsTrigger value="recent">Recent Tests</TabsTrigger>
          <TabsTrigger value="failed">Failed Tests</TabsTrigger>
          <TabsTrigger value="flaky">Flaky Tests</TabsTrigger>
        </TabsList>

        {/* Recent Tests Tab */}
        <TabsContent value="recent" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Recent Test Results</CardTitle>
                  <CardDescription>Latest 5 test executions</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setVisibleTables(prev => ({ ...prev, recent: !prev.recent }))}
                  className="flex items-center gap-2"
                >
                  {visibleTables.recent ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </div>
            </CardHeader>
            <CardContent className={cn(
              "transition-all duration-300 ease-in-out overflow-hidden",
              visibleTables.recent ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
            )}>
              <TestResultsList tests={testResults.slice(-5).reverse()} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Failed Tests Tab */}
        <TabsContent value="failed" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Failed Tests</CardTitle>
                  <CardDescription>Tests that did not pass</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setVisibleTables(prev => ({ ...prev, failed: !prev.failed }))}
                  className="flex items-center gap-2"
                >
                  {visibleTables.failed ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </div>
            </CardHeader>
            <CardContent className={cn(
              "transition-all duration-300 ease-in-out overflow-hidden",
              visibleTables.failed ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
            )}>
              <TestResultsList tests={testResults.filter(test => test.status === 'failed').slice(0, 5)} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Flaky Tests Tab */}
        <TabsContent value="flaky" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Flaky Tests</CardTitle>
                  <CardDescription>Tests with inconsistent results</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setVisibleTables(prev => ({ ...prev, flaky: !prev.flaky }))}
                  className="flex items-center gap-2"
                >
                  {visibleTables.flaky ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </div>
            </CardHeader>
            <CardContent className={cn(
              "transition-all duration-300 ease-in-out overflow-hidden",
              visibleTables.flaky ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
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
