
import { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { MetricsRow } from "@/components/dashboard/MetricsRow";
import { ChartsRow } from "@/components/dashboard/ChartsRow";
import { ChartsSecondRow } from "@/components/dashboard/ChartsSecondRow";
import { TestResultsTabs } from "@/components/dashboard/TestResultsTabs";
import { ApiDocumentation } from "@/components/dashboard/ApiDocumentation";
import { mockTestData } from "@/data/mockTestData";
import { getAllTestResults, initializeWithMockData, subscribeToTestResults } from "@/services/testReportService";
import { ParsedTestResult } from "@/lib/xmlParser";

const Dashboard = () => {
  const [testResults, setTestResults] = useState<ParsedTestResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize with mock data
    initializeWithMockData(mockTestData);
    refreshTestResults();

    // Subscribe to test result changes
    const unsubscribe = subscribeToTestResults(() => {
      refreshTestResults();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const refreshTestResults = async () => {
    setLoading(true);
    try {
      const results = await getAllTestResults();
      setTestResults(results);
    } catch (error) {
      console.error("Error fetching test results:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate metrics and trends
  const calculateMetrics = () => {
    const currentPassRate = testResults.length > 0
      ? Math.round((testResults.filter(test => test.status === 'passed').length / testResults.length) * 100)
      : 0;

    const failedTests = testResults.filter(test => test.status === 'failed').length;
    const previousFailedTests = testResults.slice(0, -5).filter(test => test.status === 'failed').length;
    const failedTrend = failedTests > previousFailedTests ? 'up' : 'down';
    
    const totalDuration = testResults.reduce((total, test) => {
      const duration = parseFloat(test.duration.replace('s', ''));
      return total + (isNaN(duration) ? 0 : duration);
    }, 0);
    
    const flakyTests = testResults.filter(test => test.status === 'flaky').length;
    const previousFlakyTests = testResults.slice(0, -5).filter(test => test.status === 'flaky').length;
    const flakyTrend = flakyTests > previousFlakyTests ? 'up' : 'down';

    return {
      passRate: currentPassRate,
      failedTests,
      totalDuration,
      flakyTests,
      failedTrend: failedTrend as 'up' | 'down' | 'neutral',
      flakyTrend: flakyTrend as 'up' | 'down' | 'neutral'
    };
  };

  const metrics = calculateMetrics();

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <DashboardHeader 
        title="Test Automation Dashboard" 
        description="Monitor your automated test executions and quality metrics" 
        onRefresh={refreshTestResults}
        onReportUploaded={refreshTestResults}
      />
      
      <MetricsRow {...metrics} />
      
      <ChartsRow testResults={testResults} />
      
      <ChartsSecondRow testResults={testResults} />

      <TestResultsTabs testResults={testResults} />

      <ApiDocumentation />
    </div>
  );
};

export default Dashboard;
