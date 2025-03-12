
import { Clock, Check, X, AlertTriangle } from "lucide-react";
import { DashboardMetricCard } from "@/components/dashboard/DashboardMetricCard";

interface MetricsRowProps {
  passRate: number;
  failedTests: number;
  totalDuration: number;
  flakyTests: number;
  failedTrend: 'up' | 'down' | 'neutral';
  flakyTrend: 'up' | 'down' | 'neutral';
}

export const MetricsRow = ({
  passRate,
  failedTests,
  totalDuration,
  flakyTests,
  failedTrend,
  flakyTrend
}: MetricsRowProps) => {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <DashboardMetricCard
        title="Pass Rate"
        value={`${passRate}%`}
        description="Tests passing successfully"
        icon={<Check className="text-green-500" />}
        trend="vs last run"
        trendDirection={passRate > 80 ? 'up' : 'down'}
      />
      <DashboardMetricCard
        title="Failed Tests"
        value={failedTests.toString()}
        description="Tests that didn't pass"
        icon={<X className="text-red-500" />}
        trend="vs last run"
        trendDirection={failedTrend}
      />
      <DashboardMetricCard
        title="Execution Time"
        value={`${totalDuration.toFixed(2)}s`}
        description="Total test execution time"
        icon={<Clock className="text-blue-500" />}
        trend="Average duration"
        trendDirection="neutral"
      />
      <DashboardMetricCard
        title="Flaky Tests"
        value={flakyTests.toString()}
        description="Tests with inconsistent results"
        icon={<AlertTriangle className="text-amber-500" />}
        trend="vs last run"
        trendDirection={flakyTrend}
      />
    </div>
  );
};
