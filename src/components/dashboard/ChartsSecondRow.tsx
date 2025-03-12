
import { ExecutionTimeChart } from "@/components/dashboard/ExecutionTimeChart";
import { TestTypeDistribution } from "@/components/dashboard/TestTypeDistribution";
import { ParsedTestResult } from "@/lib/xmlParser";

interface ChartsSecondRowProps {
  testResults: ParsedTestResult[];
}

export const ChartsSecondRow = ({ testResults }: ChartsSecondRowProps) => {
  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
      {/* Execution Time Chart */}
      <ExecutionTimeChart testResults={testResults} />

      {/* Test Type Distribution */}
      <TestTypeDistribution testResults={testResults} />
    </div>
  );
};
