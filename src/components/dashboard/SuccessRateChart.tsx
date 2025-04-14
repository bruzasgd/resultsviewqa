
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveBar } from "@nivo/bar";

interface SuccessRateChartProps {
  passedCount: number;
  failedCount: number;
  flakyCount: number;
}

export const SuccessRateChart = ({ passedCount, failedCount, flakyCount }: SuccessRateChartProps) => {
  // Data for success rate chart
  const successRateData = [
    {
      metric: "Passed",
      value: passedCount,
      color: "#10b981" // Keep green for passed tests
    },
    {
      metric: "Failed",
      value: failedCount,
      color: "#ef4444" // Keep red for failed tests
    },
    {
      metric: "Flaky",
      value: flakyCount,
      color: "#1e40af" // Changed to dark blue for flaky tests
    }
  ];

  return (
    <Card className="border border-blue-200">
      <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-white">
        <CardTitle className="text-slate-800">Success Rate</CardTitle>
        <CardDescription>Distribution of test results by status</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px] pt-2">
        <div className="h-[280px]">
          <ResponsiveBar
            data={successRateData}
            keys={["value"]}
            indexBy="metric"
            margin={{ top: 30, right: 30, bottom: 50, left: 60 }}
            padding={0.3}
            colors={({ data }) => data.color}
            borderRadius={4}
            borderWidth={1}
            borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
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
            theme={{
              tooltip: {
                container: {
                  background: "#ffffff",
                  fontSize: "12px",
                  borderRadius: "6px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                  padding: "12px 16px",
                  borderColor: "#1e40af"
                },
              },
              axis: {
                ticks: {
                  text: {
                    fontSize: 11,
                    fill: "#1e293b"
                  }
                },
                legend: {
                  text: {
                    fontSize: 11,
                    fill: "#1e293b"
                  }
                }
              }
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};
