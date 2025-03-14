
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Clock, Cpu, BarChart2 } from "lucide-react";
import { ParsedTestResult } from "@/lib/xmlParser";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TestInsightsProps {
  testResults: ParsedTestResult[];
}

export const TestInsights = ({ testResults }: TestInsightsProps) => {
  // Calculate insights
  const calculateInsights = () => {
    if (!testResults.length) {
      return {
        slowestTests: [],
        mostFrequentlyFailed: [],
        flakyTests: [],
      };
    }

    // Group tests by name
    const testGroups: Record<string, ParsedTestResult[]> = {};
    testResults.forEach(test => {
      if (!testGroups[test.name]) {
        testGroups[test.name] = [];
      }
      testGroups[test.name].push(test);
    });

    // Find slowest tests
    const slowestTests = Object.values(testGroups)
      .map(tests => {
        const avgDuration = tests.reduce((sum, test) => {
          return sum + parseFloat(test.duration.replace('s', ''));
        }, 0) / tests.length;
        
        return {
          name: tests[0].name,
          suite: tests[0].suite,
          avgDuration,
          framework: tests[0].framework,
        };
      })
      .sort((a, b) => b.avgDuration - a.avgDuration)
      .slice(0, 5);

    // Find most frequently failed tests
    const mostFrequentlyFailed = Object.entries(testGroups)
      .map(([name, tests]) => {
        const failCount = tests.filter(t => t.status === 'failed').length;
        const totalCount = tests.length;
        const failRate = totalCount > 0 ? (failCount / totalCount) * 100 : 0;
        
        return {
          name,
          suite: tests[0].suite,
          failCount,
          totalCount,
          failRate
        };
      })
      .filter(test => test.failCount > 0)
      .sort((a, b) => b.failRate - a.failRate)
      .slice(0, 5);

    // Find flaky tests (tests that have both passed and failed)
    const flakyTests = Object.entries(testGroups)
      .map(([name, tests]) => {
        const statuses = new Set(tests.map(t => t.status));
        const isFlaky = statuses.size > 1;
        const flakyRate = isFlaky 
          ? (tests.filter(t => t.status === 'flaky').length / tests.length) * 100 
          : 0;
        
        return {
          name,
          suite: tests[0].suite,
          isFlaky,
          flakyRate,
          totalRuns: tests.length
        };
      })
      .filter(test => test.isFlaky || test.flakyRate > 0)
      .sort((a, b) => b.flakyRate - a.flakyRate)
      .slice(0, 5);

    return {
      slowestTests,
      mostFrequentlyFailed,
      flakyTests
    };
  };

  const insights = calculateInsights();

  return (
    <Card className="border border-amber-100">
      <CardHeader className="pb-2 bg-gradient-to-r from-amber-50 to-white">
        <CardTitle className="text-slate-800">Test Insights</CardTitle>
        <CardDescription>Advanced analysis of test execution patterns</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-amber-100">
          {/* Slowest Tests */}
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-4 w-4 text-amber-500" />
              <h3 className="font-medium text-sm">Slowest Tests</h3>
            </div>
            <ScrollArea className="h-[220px]">
              {insights.slowestTests.length ? (
                <div className="space-y-2">
                  {insights.slowestTests.map((test, index) => (
                    <div key={index} className="bg-amber-50/40 p-2 rounded-md">
                      <div className="flex justify-between mb-1">
                        <div className="text-xs font-medium truncate max-w-[170px]">{test.name}</div>
                        <div className="text-xs text-amber-700 font-medium">{test.avgDuration.toFixed(1)}s</div>
                      </div>
                      {test.suite && (
                        <div className="text-xs text-muted-foreground truncate max-w-[200px]">{test.suite}</div>
                      )}
                      <div className="mt-1">
                        <span className="inline-block px-1.5 py-0.5 bg-amber-100 text-amber-800 text-[10px] rounded-sm">
                          {test.framework}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No test data available
                </div>
              )}
            </ScrollArea>
          </div>
          
          {/* Most Frequently Failed */}
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <BarChart2 className="h-4 w-4 text-red-500" />
              <h3 className="font-medium text-sm">Failure Hotspots</h3>
            </div>
            <ScrollArea className="h-[220px]">
              {insights.mostFrequentlyFailed.length ? (
                <div className="space-y-2">
                  {insights.mostFrequentlyFailed.map((test, index) => (
                    <div key={index} className="bg-red-50/40 p-2 rounded-md">
                      <div className="flex justify-between mb-1">
                        <div className="text-xs font-medium truncate max-w-[170px]">{test.name}</div>
                        <div className="text-xs text-red-700 font-medium">{test.failRate.toFixed(0)}%</div>
                      </div>
                      {test.suite && (
                        <div className="text-xs text-muted-foreground truncate max-w-[200px]">{test.suite}</div>
                      )}
                      <div className="mt-1 text-[10px] text-muted-foreground">
                        Failed {test.failCount} of {test.totalCount} runs
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No failures detected
                </div>
              )}
            </ScrollArea>
          </div>
          
          {/* Flaky Tests */}
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <h3 className="font-medium text-sm">Flaky Tests</h3>
            </div>
            <ScrollArea className="h-[220px]">
              {insights.flakyTests.length ? (
                <div className="space-y-2">
                  {insights.flakyTests.map((test, index) => (
                    <div key={index} className="bg-amber-50/40 p-2 rounded-md">
                      <div className="flex justify-between mb-1">
                        <div className="text-xs font-medium truncate max-w-[170px]">{test.name}</div>
                        <div className="text-xs text-amber-700 font-medium">{test.flakyRate.toFixed(0)}%</div>
                      </div>
                      {test.suite && (
                        <div className="text-xs text-muted-foreground truncate max-w-[200px]">{test.suite}</div>
                      )}
                      <div className="mt-1 text-[10px] text-muted-foreground">
                        Inconsistent in {test.totalRuns} runs
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No flaky tests detected
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
