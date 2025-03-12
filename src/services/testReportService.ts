
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
export const uploadTestReport = async (xmlString: string): Promise<ParsedTestResult[]> => {
  try {
    // Basic format validation
    if (!xmlString || !xmlString.trim()) {
      throw new Error("Empty test report provided");
    }

    if (!xmlString.includes('<?xml')) {
      throw new Error("Invalid file format: Not a valid XML file");
    }

    if (!xmlString.includes('<testsuites') && !xmlString.includes('<testsuite')) {
      throw new Error("Invalid test report format: Missing required test suite elements");
    }

    // Parse the XML and validate test results
    const parsedResults = parseTestXML(xmlString);
    
    if (parsedResults.length === 0) {
      throw new Error("No test cases found in the report. Please ensure the XML contains valid test results.");
    }
    
    // Simulate API call to upload the test report
    const response = await uploadTestReportAPI(xmlString);
    
    if (!response.success) {
      throw new Error(response.error || "Failed to upload test report");
    }
    
    // Update the test results with new data
    testResults = [...parsedResults];
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

// Clear all test results
export const clearTestResults = (): void => {
  testResults = [];
};

// Initialize with some data (for demo purposes)
export const initializeWithMockData = (mockData: ParsedTestResult[]): void => {
  testResults = [...mockData];
};
