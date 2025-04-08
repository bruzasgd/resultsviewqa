
import { toast } from "@/components/ui/use-toast";
import { parseTestXML, ParsedTestResult } from "@/lib/xmlParser";
import { uploadTestReportAPI } from "@/lib/apiSimulator";
import { useTestResults } from "./testResultsStore";
import { notifyTestResultListeners } from "./testResultsEventBus";

/**
 * Upload a test report as XML
 */
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
    
    // Add filename, uploadId, and uploadDate if provided
    const currentDate = new Date();
    parsedResults.forEach(result => {
      if (filename) result.filename = filename;
      result.uploadId = uploadId;
      result.uploadDate = currentDate;
    });
    
    // Simulate API call to upload the test report
    const response = await uploadTestReportAPI(xmlString);
    
    if (!response.success) {
      throw new Error(response.error || "Failed to upload test report");
    }
    
    // Add results to persistent store
    useTestResults.getState().addResults(parsedResults);
    
    // Notify all subscribers about the state change
    notifyTestResultListeners();
    
    return parsedResults;
  } catch (error) {
    console.error("Error processing test report:", error);
    // Provide more descriptive error messages to the user
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred while processing the test report";
    throw new Error(`Test Report Upload Failed: ${errorMessage}`);
  }
};
