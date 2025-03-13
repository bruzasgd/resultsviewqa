
import { SuccessRateChart } from "@/components/dashboard/SuccessRateChart";
import { ParsedTestResult } from "@/lib/xmlParser";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Bar, 
  BarChart, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  CartesianGrid,
  Cell
} from "recharts";
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
  
  // Custom colors for the bars
  const colors = {
    passed: "#10b981",
    failed: "#ef4444",
    flaky: "#f59e0b"
  };

  // Format date for better readability
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat('en-US', { 
        month: 'short', 
        day: 'numeric' 
      }).format(date);
    } catch (e) {
      return dateStr;
    }
  };

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
              data={dailyStats.map(item => ({
                ...item,
                formattedDate: formatDate(item.date)
              }))}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              barGap={2}
              barSize={20}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis 
                dataKey="formattedDate" 
                angle={0} 
                interval={0}
                tick={{ fontSize: 12 }}
                height={50}
              />
              <YAxis 
                tickFormatter={(value) => value === 0 ? '0' : value}
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                formatter={(value, name) => {
                  // Convert name to string before using string methods
                  const nameStr = String(name);
                  return [
                    `${value} tests`, 
                    nameStr.charAt(0).toUpperCase() + nameStr.slice(1)
                  ];
                }}
                labelFormatter={(label) => `Date: ${label}`}
                contentStyle={{ 
                  borderRadius: '6px',
                  padding: '8px 12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend 
                formatter={(value) => {
                  // Convert value to string before using string methods
                  const valueStr = String(value);
                  return valueStr.charAt(0).toUpperCase() + valueStr.slice(1);
                }}
              />
              <Bar 
                dataKey="passed" 
                name="Passed" 
                fill={colors.passed}
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="failed" 
                name="Failed" 
                fill={colors.failed}
                radius={[4, 4, 0, 0]} 
              />
              <Bar 
                dataKey="flaky" 
                name="Flaky" 
                fill={colors.flaky}
                radius={[4, 4, 0, 0]} 
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
