
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
      color: "hsl(142, 76%, 36%)"
    },
    {
      metric: "Failed",
      value: failedCount,
      color: "hsl(346, 87%, 43%)"
    },
    {
      metric: "Flaky",
      value: flakyCount,
      color: "hsl(41, 88%, 64%)"
    }
  ];

  return (
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
            theme={{
              tooltip: {
                container: {
                  background: "#ffffff",
                  fontSize: "12px",
                  borderRadius: "6px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                  padding: "12px 16px",
                },
              },
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};
