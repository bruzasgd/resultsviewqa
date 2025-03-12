
import { SuccessRateChart } from "@/components/dashboard/SuccessRateChart";
import { TestReportUploader } from "@/components/dashboard/TestReportUploader";
import { ParsedTestResult } from "@/lib/xmlParser";
import { Card } from "@/components/ui/card";

interface ChartsRowProps {
  testResults: ParsedTestResult[];
  onReportUploaded: () => void;
}

export const ChartsRow = ({ testResults, onReportUploaded }: ChartsRowProps) => {
  const passedCount = testResults.filter(test => test.status === 'passed').length;
  const failedCount = testResults.filter(test => test.status === 'failed').length;
  const flakyCount = testResults.filter(test => test.status === 'flaky').length;

  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
      {/* Test Report Uploader */}
      <Card className="lg:col-span-1">
        <TestReportUploader onReportUploaded={onReportUploaded} />
      </Card>

      {/* Success Rate Chart */}
      <SuccessRateChart 
        passedCount={passedCount}
        failedCount={failedCount}
        flakyCount={flakyCount}
      />
    </div>
  );
};
