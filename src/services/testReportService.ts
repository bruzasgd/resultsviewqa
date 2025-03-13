
import { toast } from "@/components/ui/use-toast";
import { parseTestXML, ParsedTestResult } from "@/lib/xmlParser";
import { uploadTestReportAPI, getTestResultsAPI } from "@/lib/apiSimulator";

// For simplicity, we'll store test results in memory
// In a real app, this would be stored in a database
let testResults: ParsedTestResult[] = [];

// Event listeners for state updates
type TestResultsListener = () => void;
const listeners: TestResultsListener[] = [];

// Subscribe to test results changes
export const subscribeToTestResults = (listener: TestResultsListener) => {
  listeners.push(listener);
  return () => {
    const index = listeners.indexOf(listener);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  };
};

// Notify listeners of changes
const notifyListeners = () => {
  listeners.forEach(listener => listener());
};

// Upload a test report as XML
export const uploadTestReport = async (xmlString: string, filename?: string): Promise<ParsedTestResult[]> => {
  try {
    console.log("Starting to process XML file upload", { filenameProvided: !!filename });
    
    // Basic format validation
    if (!xmlString || !xmlString.trim()) {
      throw new Error("Empty test report provided");
    }

    // More lenient validation
    if (!xmlString.includes('<test')) {
      console.warn("XML may not be in expected format - doesn't contain test elements");
    }

    console.log("XML validation passed, parsing test results...");
    
    // Parse the XML and validate test results
    const parsedResults = parseTestXML(xmlString);
    
    if (parsedResults.length === 0) {
      throw new Error("No test cases found in the report. Please ensure the XML contains valid test results.");
    }
    
    console.log(`Successfully parsed ${parsedResults.length} test results`);
    
    // Add filename if provided
    if (filename) {
      parsedResults.forEach(result => {
        result.filename = filename;
      });
    }
    
    // Simulate API call to upload the test report
    const response = await uploadTestReportAPI(xmlString);
    
    if (!response.success) {
      throw new Error(response.error || "Failed to upload test report");
    }
    
    // Update the test results with new data - prepend new results
    testResults = [...parsedResults, ...testResults];
    
    // Notify all subscribers about the state change
    notifyListeners();
    
    return parsedResults;
  } catch (error) {
    console.error("Error processing test report:", error);
    // Provide more descriptive error messages to the user
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred while processing the test report";
    throw new Error(`Test Report Upload Failed: ${errorMessage}`);
  }
};

// Get all test results
export const getAllTestResults = async (): Promise<ParsedTestResult[]> => {
  try {
    // Simulate API call to get test results
    const response = await getTestResultsAPI();
    
    if (!response.success) {
      throw new Error(response.error || "Failed to fetch test results");
    }
    
    // In a real app, this would return data from the API response
    // For this demo, we're using our in-memory storage
    return testResults;
  } catch (error) {
    console.error("Error fetching test results:", error);
    return testResults; // Fallback to local data on error
  }
};

// Get results grouped by date
export const getResultsByDate = (): Record<string, ParsedTestResult[]> => {
  const resultsByDate: Record<string, ParsedTestResult[]> = {};
  
  testResults.forEach(result => {
    const date = result.uploadDate 
      ? result.uploadDate.toISOString().split('T')[0] 
      : new Date().toISOString().split('T')[0];
    
    if (!resultsByDate[date]) {
      resultsByDate[date] = [];
    }
    
    resultsByDate[date].push(result);
  });
  
  return resultsByDate;
};

// Get results for the last N days
export const getResultsForLastNDays = (days: number): ParsedTestResult[] => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  return testResults.filter(result => {
    const resultDate = result.uploadDate || new Date();
    return resultDate >= cutoffDate;
  });
};

// Clear all test results
export const clearTestResults = (): void => {
  testResults = [];
  notifyListeners();
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

// Initialize with some data (for demo purposes)
export const initializeWithMockData = (mockData: ParsedTestResult[]): void => {
  // Add upload date if not present
  const dataWithDates = mockData.map(item => ({
    ...item,
    uploadDate: item.uploadDate || new Date()
  }));
  
  testResults = [...dataWithDates];
  notifyListeners();
};
