
import { ParsedTestResult } from "@/lib/xmlParser";
import { useTestResults } from "./testResultsStore";

// Get results grouped by date
export const getResultsByDate = (): Record<string, ParsedTestResult[]> => {
  const resultsByDate: Record<string, ParsedTestResult[]> = {};
  const results = useTestResults.getState().results;
  
  results.forEach(result => {
    // Safe handling of uploadDate - could be Date object or string
    let dateStr: string;
    
    if (!result.uploadDate) {
      dateStr = new Date().toISOString().split('T')[0];
    } else if (result.uploadDate instanceof Date) {
      dateStr = result.uploadDate.toISOString().split('T')[0];
    } else {
      // If it's a string, try to parse it or use current date as fallback
      try {
        dateStr = new Date(result.uploadDate).toISOString().split('T')[0];
      } catch (e) {
        console.error("Invalid date format:", result.uploadDate);
        dateStr = new Date().toISOString().split('T')[0];
      }
    }
    
    if (!resultsByDate[dateStr]) {
      resultsByDate[dateStr] = [];
    }
    
    resultsByDate[dateStr].push(result);
  });
  
  return resultsByDate;
};

// Get test results stats by date
export const getTestResultsStatsByDate = (): {
  date: string;
  passed: number;
  failed: number;
  flaky: number;
  total: number;
}[] => {
  const resultsByDate = getResultsByDate();
  
  return Object.entries(resultsByDate).map(([date, results]) => {
    const passed = results.filter(r => r.status === 'passed').length;
    const failed = results.filter(r => r.status === 'failed').length;
    const flaky = results.filter(r => r.status === 'flaky').length;
    
    return {
      date,
      passed,
      failed,
      flaky,
      total: results.length
    };
  }).sort((a, b) => a.date.localeCompare(b.date));
};
