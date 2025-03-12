import { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardMetricCard } from "@/components/dashboard/DashboardMetricCard";
import { TestResultsList } from "@/components/dashboard/TestResultsList";
import { TestReportUploader } from "@/components/dashboard/TestReportUploader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveLine } from "@nivo/line";
import { ResponsivePie } from "@nivo/pie";
import { mockTestData } from "@/data/mockTestData";
import { Clock, Check, X, AlertTriangle } from "lucide-react";
import { getAllTestResults, initializeWithMockData } from "@/services/testReportService";
import { ParsedTestResult } from "@/lib/xmlParser";

const Dashboard = () => {
  const [testResults, setTestResults] = useState<ParsedTestResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize with mock data
    initializeWithMockData(mockTestData);
    refreshTestResults();
  }, []);

  const refreshTestResults = async () => {
    setLoading(true);
    try {
      const results = await getAllTestResults();
      setTestResults(results);
    } catch (error) {
      console.error("Error fetching test results:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate metrics
  const passRate = testResults.length > 0
    ? Math.round((testResults.filter(test => test.status === 'passed').length / testResults.length) * 100)
    : 0;
  
  const failedTests = testResults.filter(test => test.status === 'failed').length;
  
  const totalDuration = testResults.reduce((total, test) => {
    const duration = parseFloat(test.duration.replace('s', ''));
    return total + (isNaN(duration) ? 0 : duration);
  }, 0);
  
  const flakyTests = testResults.filter(test => test.status === 'flaky').length;

  // Data for success rate chart
  const successRateData = [
    {
      metric: "Passed",
      value: testResults.filter(test => test.status === 'passed').length,
      color: "hsl(142, 76%, 36%)"
    },
    {
      metric: "Failed",
      value: failedTests,
      color: "hsl(346, 87%, 43%)"
    },
    {
      metric: "Flaky",
      value: flakyTests,
      color: "hsl(41, 88%, 64%)"
    }
  ];

  // Data for execution time chart
  const executionTimeData = [
    {
      id: "Execution Time",
      data: testResults
        .slice(-10)
        .map((test, index) => ({
          x: index + 1,
          y: parseFloat(test.duration.replace('s', ''))
        }))
    }
  ];

  // Data for test type distribution
  const testTypeData = (() => {
    const frameworkCounts: Record<string, number> = {};
    
    testResults.forEach(test => {
      frameworkCounts[test.framework] = (frameworkCounts[test.framework] || 0) + 1;
    });
    
    return Object.entries(frameworkCounts).map(([framework, count]) => ({
      id: framework,
      label: framework,
      value: count
    }));
  })();

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <DashboardHeader
        title="Test Automation Dashboard"
        description="Monitor your automated test executions and quality metrics"
      />
      
      {/* Metrics Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardMetricCard
          title="Pass Rate"
          value={`${passRate}%`}
          description="Tests passing successfully"
          icon={<Check className="text-green-500" />}
        />
        <DashboardMetricCard
          title="Failed Tests"
          value={failedTests.toString()}
          description="Tests that didn't pass"
          icon={<X className="text-red-500" />}
        />
        <DashboardMetricCard
          title="Execution Time"
          value={`${totalDuration.toFixed(2)}s`}
          description="Total test execution time"
          icon={<Clock className="text-blue-500" />}
        />
        <DashboardMetricCard
          title="Flaky Tests"
          value={flakyTests.toString()}
          description="Tests with inconsistent results"
          icon={<AlertTriangle className="text-amber-500" />}
        />
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        {/* Test Report Uploader */}
        <Card className="lg:col-span-1">
          <TestReportUploader onReportUploaded={refreshTestResults} />
        </Card>

        {/* Success Rate Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Success Rate</CardTitle>
            <CardDescription>Distribution of test results by status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveBar
                data={successRateData}
                keys={["value"]}
                indexBy="metric"
                margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
                padding={0.3}
                colors={({ data }) => data.color}
                axisBottom={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                }}
                axisLeft={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: "Count",
                  legendPosition: "middle",
                  legendOffset: -40,
                }}
                labelSkipWidth={12}
                labelSkipHeight={12}
                animate={true}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        {/* Execution Time Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Execution Time</CardTitle>
            <CardDescription>Test execution time trend</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveLine
                data={executionTimeData}
                margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                xScale={{ type: "point" }}
                yScale={{ type: "linear", min: "auto", max: "auto" }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: "Test Run",
                  legendOffset: 36,
                  legendPosition: "middle",
                }}
                axisLeft={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: "Duration (s)",
                  legendOffset: -40,
                  legendPosition: "middle",
                }}
                colors={{ scheme: "category10" }}
                pointSize={10}
                pointColor={{ theme: "background" }}
                pointBorderWidth={2}
                pointBorderColor={{ from: "serieColor" }}
                enablePointLabel={true}
                pointLabel="y"
                pointLabelYOffset={-12}
                useMesh={true}
                legends={[
                  {
                    anchor: "bottom-right",
                    direction: "column",
                    justify: false,
                    translateX: 100,
                    translateY: 0,
                    itemsSpacing: 0,
                    itemDirection: "left-to-right",
                    itemWidth: 80,
                    itemHeight: 20,
                    itemOpacity: 0.75,
                    symbolSize: 12,
                    symbolShape: "circle",
                    symbolBorderColor: "rgba(0, 0, 0, .5)",
                  },
                ]}
              />
            </div>
          </CardContent>
        </Card>

        {/* Test Type Distribution */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Test Type Distribution</CardTitle>
            <CardDescription>Tests by framework</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsivePie
                data={testTypeData}
                margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                innerRadius={0.5}
                padAngle={0.7}
                cornerRadius={3}
                colors={{ scheme: "category10" }}
                borderWidth={1}
                borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
                radialLabelsSkipAngle={10}
                radialLabelsTextXOffset={6}
                radialLabelsTextColor="#333333"
                radialLabelsLinkOffset={0}
                radialLabelsLinkDiagonalLength={16}
                radialLabelsLinkHorizontalLength={24}
                radialLabelsLinkStrokeWidth={1}
                radialLabelsLinkColor={{ from: "color" }}
                slicesLabelsSkipAngle={10}
                slicesLabelsTextColor="#333333"
                animate={true}
                legends={[
                  {
                    anchor: "bottom",
                    direction: "row",
                    justify: false,
                    translateX: 0,
                    translateY: 56,
                    itemsSpacing: 0,
                    itemWidth: 100,
                    itemHeight: 18,
                    itemTextColor: "#999",
                    itemDirection: "left-to-right",
                    itemOpacity: 1,
                    symbolSize: 18,
                    symbolShape: "circle",
                  },
                ]}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Test Results */}
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
    </div>
  );
};

export default Dashboard;
