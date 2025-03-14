
import { useEffect, useState, useCallback } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { MetricsRow } from "@/components/dashboard/MetricsRow";
import { ChartsRow } from "@/components/dashboard/ChartsRow";
import { ChartsSecondRow } from "@/components/dashboard/ChartsSecondRow";
import { TestResultsTabs } from "@/components/dashboard/TestResultsTabs";
import { ApiDocumentation } from "@/components/dashboard/ApiDocumentation";
import { mockTestData } from "@/data/mockTestData";
import { getAllTestResults, initializeWithMockData, subscribeToTestResults, getResultsForLastNDays, removeResultsByUploadId } from "@/services/testReportService";
import { ParsedTestResult } from "@/lib/xmlParser";
import { toast } from "@/components/ui/use-toast";
import { useUploadHistory } from "@/services/uploadHistoryService";

const Dashboard = () => {
  const [testResults, setTestResults] = useState<ParsedTestResult[]>([]);
  const [filteredResults, setFilteredResults] = useState<ParsedTestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [timePeriod, setTimePeriod] = useState("7days");
  const { uploads, removeUpload } = useUploadHistory();

  const refreshTestResults = useCallback(async () => {
    setLoading(true);
    try {
      const results = await getAllTestResults();
      setTestResults(results);
    } catch (error) {
      console.error("Error fetching test results:", error);
      toast({
        title: "Error",
        description: "Failed to fetch test results. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initialize with mock data
    initializeWithMockData(mockTestData);
    refreshTestResults();

    // Subscribe to test result changes
    const unsubscribe = subscribeToTestResults(() => {
      console.log("Test results updated, refreshing...");
      refreshTestResults();
    });

    return () => {
      unsubscribe();
    };
  }, [refreshTestResults]);

  useEffect(() => {
    // Apply time period filter
    filterResultsByTimePeriod(timePeriod);
  }, [testResults, timePeriod]);

  const filterResultsByTimePeriod = (period: string) => {
    let days = 7; // default
    
    switch (period) {
      case "today":
        days = 1;
        break;
      case "yesterday":
        days = 2;
        break;
      case "7days":
        days = 7;
        break;
      case "30days":
        days = 30;
        break;
      case "90days":
        days = 90;
        break;
      default:
        days = 7;
    }
    
    const filtered = getResultsForLastNDays(days);
    setFilteredResults(filtered);
  };

  const handleTimePeriodChange = (value: string) => {
    setTimePeriod(value);
  };

  const handleRemoveUpload = (id: string) => {
    // Remove from upload history
    removeUpload(id);
    
    // Remove associated test results
    removeResultsByUploadId(id);
    
    // Refresh the dashboard
    refreshTestResults();
  };

  // Calculate metrics and trends based on filtered results
  const calculateMetrics = () => {
    const currentPassRate = filteredResults.length > 0
      ? Math.round((filteredResults.filter(test => test.status === 'passed').length / filteredResults.length) * 100)
      : 0;

    const failedTests = filteredResults.filter(test => test.status === 'failed').length;
    const previousFailedTests = filteredResults.slice(0, -5).filter(test => test.status === 'failed').length;
    const failedTrend = failedTests > previousFailedTests ? 'up' : 'down';
    
    const totalDuration = filteredResults.reduce((total, test) => {
      const duration = parseFloat(test.duration.replace('s', ''));
      return total + (isNaN(duration) ? 0 : duration);
    }, 0);
    
    const flakyTests = filteredResults.filter(test => test.status === 'flaky').length;
    const previousFlakyTests = filteredResults.slice(0, -5).filter(test => test.status === 'flaky').length;
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
    <div className="flex flex-col gap-4 p-3 md:p-6 bg-white">
      <DashboardHeader 
        title="Test Automation Dashboard" 
        description="Monitor your automated test executions and quality metrics" 
        onRefresh={refreshTestResults}
        onReportUploaded={refreshTestResults}
        timePeriod={timePeriod}
        onTimePeriodChange={handleTimePeriodChange}
      />
      
      <MetricsRow {...metrics} />
      
      <ChartsRow testResults={filteredResults} />
      
      <ChartsSecondRow testResults={filteredResults} />

      <TestResultsTabs 
        testResults={filteredResults} 
        uploads={uploads}
        onRemoveUpload={handleRemoveUpload}
      />

      <ApiDocumentation />
    </div>
  );
};

export default Dashboard;
