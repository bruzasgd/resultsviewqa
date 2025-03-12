
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsivePie } from "@nivo/pie";
import { ParsedTestResult } from "@/lib/xmlParser";

interface TestTypeDistributionProps {
  testResults: ParsedTestResult[];
}

export const TestTypeDistribution = ({ testResults }: TestTypeDistributionProps) => {
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
            arcLabelsSkipAngle={10}
            arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2]] }}
            arcLinkLabelsOffset={0}
            arcLinkLabelsTextColor="#333333"
            arcLinkLabelsDiagonalLength={16}
            arcLinkLabelsThickness={2}
            arcLinkLabelsColor={{ from: "color" }}
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
