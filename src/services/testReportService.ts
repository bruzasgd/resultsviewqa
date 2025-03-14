
import { toast } from "@/components/ui/use-toast";
import { parseTestXML, ParsedTestResult } from "@/lib/xmlParser";
import { uploadTestReportAPI, getTestResultsAPI } from "@/lib/apiSimulator";
import { useUploadHistory } from "@/services/uploadHistoryService";
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Store to handle test results with persistence
interface TestResultsState {
  results: ParsedTestResult[];
  addResults: (newResults: ParsedTestResult[]) => void;
  removeResultsByUploadId: (uploadId: string) => void;
  clearAllResults: () => void;
}

export const useTestResults = create<TestResultsState>()(
  persist(
    (set) => ({
      results: [],
      addResults: (newResults) => {
        set((state) => ({
          results: [...newResults, ...state.results]
        }));
      },
      removeResultsByUploadId: (uploadId) => {
        set((state) => ({
          results: state.results.filter(result => result.uploadId !== uploadId)
        }));
      },
      clearAllResults: () => {
        set({ results: [] });
      }
    }),
    {
      name: 'test-results-storage',
      skipHydration: false,
    }
  )
);

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
  console.log("Notifying listeners of test result changes");
  listeners.forEach(listener => listener());
};

// Upload a test report as XML
export const uploadTestReport = async (xmlString: string, filename?: string): Promise<ParsedTestResult[]> => {
  try {
    console.log("Starting to process XML file upload", { filenameProvided: !!filename });
    
    // Basic format validation - more lenient especially for Playwright
    if (!xmlString || !xmlString.trim()) {
      throw new Error("Empty test report provided");
    }

    // Very basic XML check - extremely lenient for Playwright reports
    if (!xmlString.includes('<')) {
      console.warn("Input doesn't appear to be XML, but will try to parse anyway");
    }

    console.log("XML validation passed, parsing test results...");
    
    // Generate a unique upload ID
    const uploadId = crypto.randomUUID();
    
    // Parse the XML and validate test results - use try/catch to make this more robust
    let parsedResults: ParsedTestResult[] = [];
    try {
      parsedResults = parseTestXML(xmlString);
    } catch (error) {
      console.error("Error parsing XML:", error);
      throw new Error(`Failed to parse test results: ${error instanceof Error ? error.message : 'Unknown format'}`);
    }
    
    if (parsedResults.length === 0) {
      throw new Error("No test cases found in the report. Please check your XML format.");
    }
    
    console.log(`Successfully parsed ${parsedResults.length} test results`);
    
    // Add filename and uploadId if provided
    parsedResults.forEach(result => {
      if (filename) result.filename = filename;
      result.uploadId = uploadId;
    });
    
    // Simulate API call to upload the test report
    const response = await uploadTestReportAPI(xmlString);
    
    if (!response.success) {
      throw new Error(response.error || "Failed to upload test report");
    }
    
    // Add results to persistent store
    useTestResults.getState().addResults(parsedResults);
    
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
    console.log("📥 Fetching test results...");
    // Simulate API call to get test results
    const response = await getTestResultsAPI();
    
    if (!response.success) {
      throw new Error(response.error || "Failed to fetch test results");
    }
    
    // Return results from persistent store
    return useTestResults.getState().results;
  } catch (error) {
    console.error("Error fetching test results:", error);
    return useTestResults.getState().results; // Fallback to local data on error
  }
};

// Remove results for a specific upload
export const removeResultsByUploadId = (uploadId: string): void => {
  useTestResults.getState().removeResultsByUploadId(uploadId);
  notifyListeners();
};

// Get results grouped by date
export const getResultsByDate = (): Record<string, ParsedTestResult[]> => {
  const resultsByDate: Record<string, ParsedTestResult[]> = {};
  const results = useTestResults.getState().results;
  
  results.forEach(result => {
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
  const results = useTestResults.getState().results;
  
  return results.filter(result => {
    const resultDate = result.uploadDate || new Date();
    return resultDate >= cutoffDate;
  });
};

// Clear all test results
export const clearTestResults = (): void => {
  useTestResults.getState().clearAllResults();
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
  // Skip if we already have data
  if (useTestResults.getState().results.length > 0) {
    console.log("Skipping mock data initialization since there's already data");
    return;
  }
  
  // Add upload date and ID if not present
  const dataWithDates = mockData.map(item => ({
    ...item,
    uploadDate: item.uploadDate || new Date(),
    uploadId: item.uploadId || crypto.randomUUID()
  }));
  
  useTestResults.getState().addResults(dataWithDates);
  notifyListeners();
};
