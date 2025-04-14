
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsivePie } from "@nivo/pie";
import { ParsedTestResult } from "@/lib/xmlParser";
import { cn } from "@/lib/utils";

interface TestTypeDistributionProps {
  testResults: ParsedTestResult[];
  className?: string;
}

export const TestTypeDistribution = ({ testResults, className }: TestTypeDistributionProps) => {
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

  // Custom color array with dark blues
  const customColors = ["#1e40af", "#1d4ed8", "#2563eb", "#3b82f6", "#60a5fa"];

  return (
    <Card className={cn(className, "border border-blue-200")}>
      <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-white">
        <CardTitle className="text-slate-800">Test Type Distribution</CardTitle>
        <CardDescription>Tests by framework</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px] pt-2">
        <ResponsivePie
          data={testTypeData}
          margin={{ top: 20, right: 20, bottom: 40, left: 20 }}
          innerRadius={0.5}
          padAngle={0.7}
          cornerRadius={3}
          colors={customColors}
          borderWidth={1}
          borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
          arcLabelsSkipAngle={10}
          arcLabelsTextColor="#ffffff"
          arcLabelsRadiusOffset={0.6}
          arcLinkLabelsOffset={2}
          arcLinkLabelsTextColor="#333333"
          arcLinkLabelsDiagonalLength={16}
          arcLinkLabelsStraightLength={8}
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={{ from: "color" }}
          animate={true}
          legends={[
            {
              anchor: "bottom",
              direction: "row",
              justify: false,
              translateX: 0,
              translateY: 30,
              itemsSpacing: 0,
              itemWidth: 80,
              itemHeight: 16,
              itemTextColor: "#666",
              itemDirection: "left-to-right",
              itemOpacity: 1,
              symbolSize: 12,
              symbolShape: "circle",
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
            labels: {
              text: {
                fontSize: 11,
                fontWeight: 500
              }
            },
            legends: {
              text: {
                fontSize: 11
              }
            }
          }}
        />
      </CardContent>
    </Card>
  );
};
