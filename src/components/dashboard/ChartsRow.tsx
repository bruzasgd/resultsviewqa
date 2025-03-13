
import { SuccessRateChart } from "@/components/dashboard/SuccessRateChart";
import { ParsedTestResult } from "@/lib/xmlParser";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";
import { getTestResultsStatsByDate } from "@/services/testReportService";

interface ChartsRowProps {
  testResults: ParsedTestResult[];
}

export const ChartsRow = ({ testResults }: ChartsRowProps) => {
  const passedCount = testResults.filter(test => test.status === 'passed').length;
  const failedCount = testResults.filter(test => test.status === 'failed').length;
  const flakyCount = testResults.filter(test => test.status === 'flaky').length;
  
  // Get daily stats for the bar chart
  const dailyStats = getTestResultsStatsByDate();

  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
      {/* Success Rate Chart */}
      <SuccessRateChart 
        passedCount={passedCount}
        failedCount={failedCount}
        flakyCount={flakyCount}
      />
      
      {/* Daily Upload Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Test Results</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={dailyStats}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="date" angle={-45} textAnchor="end" height={50} />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => {
                  return [`${value} tests`, name.charAt(0).toUpperCase() + name.slice(1)];
                }}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Legend />
              <Bar dataKey="passed" stackId="a" name="Passed" fill="#10b981" />
              <Bar dataKey="failed" stackId="a" name="Failed" fill="#ef4444" />
              <Bar dataKey="flaky" stackId="a" name="Flaky" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
