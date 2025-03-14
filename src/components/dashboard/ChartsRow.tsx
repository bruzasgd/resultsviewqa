
import { SuccessRateChart } from "@/components/dashboard/SuccessRateChart";
import { type ParsedTestResult } from "@/lib/xmlParser";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Bar, 
  BarChart, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  CartesianGrid
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
  
  // Custom colors for the bars - using the theme colors from the image
  const colors = {
    passed: "#10b981",
    failed: "#ef4444",
    flaky: "#f7cc4d" // Changed to amber/yellow to match the theme
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
      <Card className="border border-amber-100">
        <CardHeader className="pb-2 bg-gradient-to-r from-amber-50 to-white">
          <CardTitle className="text-slate-800">Daily Test Results</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={dailyStats.map(item => ({
                ...item,
                formattedDate: formatDate(item.date)
              }))}
              margin={{ top: 10, right: 20, left: 5, bottom: 35 }}
              barGap={4}
              barSize={18}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis 
                dataKey="formattedDate" 
                angle={0} 
                tick={{ fontSize: 11, fill: "#1e293b" }}
                height={40}
                tickMargin={5}
              />
              <YAxis 
                tickFormatter={(value) => value === 0 ? '0' : value}
                tick={{ fontSize: 11, fill: "#1e293b" }}
                width={25}
              />
              <Tooltip 
                formatter={(value, name) => {
                  const nameStr = String(name);
                  return [
                    `${value} tests`, 
                    nameStr.charAt(0).toUpperCase() + nameStr.slice(1)
                  ];
                }}
                labelFormatter={(label) => `Date: ${label}`}
                contentStyle={{ 
                  borderRadius: '6px',
                  padding: '8px 10px',
                  fontSize: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  borderColor: "#f7cc4d"
                }}
              />
              <Legend 
                formatter={(value) => {
                  const valueStr = String(value);
                  return valueStr.charAt(0).toUpperCase() + valueStr.slice(1);
                }}
                wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }}
              />
              <Bar 
                dataKey="passed" 
                name="Passed" 
                fill={colors.passed}
                radius={[3, 3, 0, 0]}
              />
              <Bar 
                dataKey="failed" 
                name="Failed" 
                fill={colors.failed}
                radius={[3, 3, 0, 0]} 
              />
              <Bar 
                dataKey="flaky" 
                name="Flaky" 
                fill={colors.flaky}
                radius={[3, 3, 0, 0]} 
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
