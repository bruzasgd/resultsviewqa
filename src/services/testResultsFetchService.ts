
import { useTestResults } from "./testResultsStore";
import { getTestResultsAPI } from "@/lib/apiSimulator";
import { ParsedTestResult } from "@/lib/xmlParser";

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
  notifyTestResultListeners();
};

// Get results for the last N days
export const getResultsForLastNDays = (days: number): ParsedTestResult[] => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  const results = useTestResults.getState().results;
  
  return results.filter(result => {
    if (!result.uploadDate) return true; // Include results with no date
    
    let resultDate: Date;
    
    if (result.uploadDate instanceof Date) {
      resultDate = result.uploadDate;
    } else {
      // If it's a string, try to parse it
      try {
        resultDate = new Date(result.uploadDate);
        if (isNaN(resultDate.getTime())) {
          return true; // Include results with invalid dates
        }
      } catch (e) {
        return true; // Include results with unparseable dates
      }
    }
    
    return resultDate >= cutoffDate;
  });
};

// Clear all test results
export const clearTestResults = (): void => {
  useTestResults.getState().clearAllResults();
  notifyTestResultListeners();
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
  notifyTestResultListeners();
};

// Import from event bus
import { notifyTestResultListeners } from "./testResultsEventBus";
