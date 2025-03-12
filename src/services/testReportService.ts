
import { toast } from "@/components/ui/use-toast";
import { parseTestXML, ParsedTestResult } from "@/lib/xmlParser";
import { uploadTestReportAPI, getTestResultsAPI } from "@/lib/apiSimulator";

// For simplicity, we'll store test results in memory
// In a real app, this would be stored in a database
let testResults: ParsedTestResult[] = [];

// Upload a test report as XML
export const uploadTestReport = async (xmlString: string): Promise<ParsedTestResult[]> => {
  try {
    // Parse the XML first to validate it
    const parsedResults = parseTestXML(xmlString);
    
    if (parsedResults.length === 0) {
      throw new Error("No test results found in the XML file");
    }
    
    // Simulate API call to upload the test report
    const response = await uploadTestReportAPI(xmlString);
    
    if (!response.success) {
      throw new Error(response.error || "Failed to upload test report");
    }
    
    // In a real app, the backend would parse and store the results
    // For this demo, we're handling it client-side
    testResults = [...testResults, ...parsedResults];
    
    return parsedResults;
  } catch (error) {
    console.error("Error processing test report:", error);
    throw error;
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
