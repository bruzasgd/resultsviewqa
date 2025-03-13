import { ParsedTestResult } from "./xmlParser";

// API endpoint URLs (simulation)
export const API_ENDPOINTS = {
  // Endpoint for uploading test reports in XML format
  UPLOAD_TEST_REPORT: '/api/test-reports',
  // Endpoint for retrieving all test results
  GET_TEST_RESULTS: '/api/test-results'
};

// Common error messages for better error handling
export const ERROR_MESSAGES = {
  UPLOAD_FAILED: 'Failed to upload test report. Please check your XML format and try again.',
  FETCH_FAILED: 'Failed to fetch test results. Please try again later.',
  INVALID_XML: 'Invalid XML format. Please check your test report structure.',
  NETWORK_ERROR: 'Network error occurred. Please check your internet connection.'
};

// Simulate API response structure
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Simulated API call for uploading test reports
 * @param xmlData - The XML string containing test results
 * @returns Promise with upload response
 */
export const uploadTestReportAPI = async (
  xmlData: string
): Promise<ApiResponse<{ results: ParsedTestResult[] }>> => {
  console.log('📤 Uploading test report...');
  
  // Removed strict XML validation to better support Playwright reports
  // Basic check to ensure it's an XML file
  if (!xmlData.includes('<test') && !xmlData.includes('<testsuite')) {
    console.warn('XML validation: Missing test elements, but proceeding anyway');
  }

  try {
    // Simulate network delay (500ms)
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simulate successful upload
    return {
      success: true,
      data: {
        results: [] // Results are processed client-side in this demo
      }
    };
  } catch (error) {
    console.error('❌ Upload failed:', error);
    return {
      success: false,
      error: ERROR_MESSAGES.UPLOAD_FAILED
    };
  }
};

/**
 * Simulated API call for retrieving test results
 * @returns Promise with test results response
 */
export const getTestResultsAPI = async (): Promise<ApiResponse<{ results: ParsedTestResult[] }>> => {
  console.log('📥 Fetching test results...');
  
  try {
    // Simulate network delay (300ms)
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Simulate successful response
    return {
      success: true,
      data: {
        results: [] // Results are handled in the service layer
      }
    };
  } catch (error) {
    console.error('❌ Fetch failed:', error);
    return {
      success: false,
      error: ERROR_MESSAGES.FETCH_FAILED
    };
  }
};
