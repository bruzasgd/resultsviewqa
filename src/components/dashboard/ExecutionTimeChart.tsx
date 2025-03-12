
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveLine } from "@nivo/line";
import { ParsedTestResult } from "@/lib/xmlParser";

interface ExecutionTimeChartProps {
  testResults: ParsedTestResult[];
}

export const ExecutionTimeChart = ({ testResults }: ExecutionTimeChartProps) => {
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

  return (
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
