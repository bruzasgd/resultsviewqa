
import { SuccessRateChart } from "@/components/dashboard/SuccessRateChart";
import { ParsedTestResult } from "@/lib/xmlParser";

interface ChartsRowProps {
  testResults: ParsedTestResult[];
}

export const ChartsRow = ({ testResults }: ChartsRowProps) => {
  const passedCount = testResults.filter(test => test.status === 'passed').length;
  const failedCount = testResults.filter(test => test.status === 'failed').length;
  const flakyCount = testResults.filter(test => test.status === 'flaky').length;

  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
      {/* Success Rate Chart */}
      <SuccessRateChart 
        passedCount={passedCount}
        failedCount={failedCount}
        flakyCount={flakyCount}
      />
    </div>
  );
};
