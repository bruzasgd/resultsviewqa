
import { ExecutionTimeChart } from "@/components/dashboard/ExecutionTimeChart";
import { TestTypeDistribution } from "@/components/dashboard/TestTypeDistribution";
import { TestInsights } from "@/components/dashboard/TestInsights";
import { ParsedTestResult } from "@/lib/xmlParser";

interface ChartsSecondRowProps {
  testResults: ParsedTestResult[];
}

export const ChartsSecondRow = ({ testResults }: ChartsSecondRowProps) => {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        {/* Execution Time Chart */}
        <ExecutionTimeChart testResults={testResults} className="lg:col-span-2" />

        {/* Test Type Distribution */}
        <TestTypeDistribution testResults={testResults} />
      </div>
      
      {/* Test Insights */}
      <TestInsights testResults={testResults} />
    </div>
  );
};
