
import { ParsedTestResult } from "@/lib/xmlParser";

export interface TestAnalysis {
  totalTests: number;
  passRate: number;
  failRate: number;
  averageDuration: number;
  flakyTestsCount: number;
  failuresByBrowser: Record<string, number>;
  failuresByFramework: Record<string, number>;
  mostFrequentErrors: Array<{ message: string; count: number }>;
}

export const analyzeTestResults = (results: ParsedTestResult[]): TestAnalysis => {
  const totalTests = results.length;
  const passedTests = results.filter(test => test.status === 'passed').length;
  const failedTests = results.filter(test => test.status === 'failed').length;
  const flakyTests = results.filter(test => test.status === 'flaky').length;

  // Calculate average duration
  const totalDuration = results.reduce((sum, test) => {
    const duration = parseFloat(test.duration.replace('s', ''));
    return sum + (isNaN(duration) ? 0 : duration);
  }, 0);

  // Analyze failures by browser
  const failuresByBrowser: Record<string, number> = {};
  results
    .filter(test => test.status === 'failed')
    .forEach(test => {
      failuresByBrowser[test.browser] = (failuresByBrowser[test.browser] || 0) + 1;
    });

  // Analyze failures by framework
  const failuresByFramework: Record<string, number> = {};
  results
    .filter(test => test.status === 'failed')
    .forEach(test => {
      failuresByFramework[test.framework] = (failuresByFramework[test.framework] || 0) + 1;
    });

  // Analyze most frequent error messages
  const errorCounts: Record<string, number> = {};
  results
    .filter(test => test.errorMessage)
    .forEach(test => {
      if (test.errorMessage) {
        errorCounts[test.errorMessage] = (errorCounts[test.errorMessage] || 0) + 1;
      }
    });

  const mostFrequentErrors = Object.entries(errorCounts)
    .map(([message, count]) => ({ message, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    totalTests,
    passRate: (passedTests / totalTests) * 100,
    failRate: (failedTests / totalTests) * 100,
    averageDuration: totalDuration / totalTests,
    flakyTestsCount: flakyTests,
    failuresByBrowser,
    failuresByFramework,
    mostFrequentErrors,
  };
};
