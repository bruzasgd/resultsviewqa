
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveLine } from "@nivo/line";
import { ParsedTestResult } from "@/lib/xmlParser";
import { cn } from "@/lib/utils";

interface ExecutionTimeChartProps {
  testResults: ParsedTestResult[];
  className?: string;
}

export const ExecutionTimeChart = ({ testResults, className }: ExecutionTimeChartProps) => {
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
    <Card className={cn(className, "border border-blue-200")}>
      <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-white">
        <CardTitle className="text-slate-800">Execution Time</CardTitle>
        <CardDescription>Test execution time trend</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px] pt-2">
        <ResponsiveLine
          data={executionTimeData}
          margin={{ top: 20, right: 110, left: 40, bottom: 40 }}
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
            tickValues: executionTimeData[0].data.length > 6 ? 
              executionTimeData[0].data.filter((_, i) => i % 2 === 0).map(d => d.x) : 
              undefined
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Duration (s)",
            legendOffset: -35,
            legendPosition: "middle",
          }}
          colors={"#1e40af"} // Dark blue instead of amber
          pointSize={8}
          pointColor={"white"}
          pointBorderWidth={2}
          pointBorderColor={"#1e40af"}
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
              effects: [
                {
                  on: "hover",
                  style: {
                    itemBackground: "rgba(0, 0, 0, .03)",
                    itemOpacity: 1,
                  },
                },
              ],
            },
          ]}
          theme={{
            tooltip: {
              container: {
                background: "#ffffff",
                fontSize: "12px",
                borderRadius: "6px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                padding: "10px 12px",
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
      </CardContent>
    </Card>
  );
};
