
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TestResultsList } from "@/components/dashboard/TestResultsList";
import { ParsedTestResult } from "@/lib/xmlParser";

interface TestResultsTabsProps {
  testResults: ParsedTestResult[];
}

export const TestResultsTabs = ({ testResults }: TestResultsTabsProps) => {
  return (
    <Tabs defaultValue="recent" className="w-full">
      <TabsList>
        <TabsTrigger value="recent">Recent Tests</TabsTrigger>
        <TabsTrigger value="failed">Failed Tests</TabsTrigger>
        <TabsTrigger value="flaky">Flaky Tests</TabsTrigger>
      </TabsList>
      <TabsContent value="recent" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Recent Test Results</CardTitle>
            <CardDescription>Latest test executions from all frameworks</CardDescription>
          </CardHeader>
          <CardContent>
            <TestResultsList tests={testResults.slice(-10).reverse()} />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="failed" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Failed Tests</CardTitle>
            <CardDescription>Tests that did not pass</CardDescription>
          </CardHeader>
          <CardContent>
            <TestResultsList tests={testResults.filter(test => test.status === 'failed')} />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="flaky" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Flaky Tests</CardTitle>
            <CardDescription>Tests with inconsistent results</CardDescription>
          </CardHeader>
          <CardContent>
            <TestResultsList tests={testResults.filter(test => test.status === 'flaky')} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
