
import { parseXMLString, ParsedTestResult } from './baseParser';

// Parse Playwright XML report
export const parsePlaywrightXML = (xmlString: string): ParsedTestResult[] => {
  try {
    const doc = parseXMLString(xmlString);
    
    // Check for required Playwright structure
    if (!doc.querySelector('testsuites') && !doc.querySelector('testsuite')) {
      throw new Error('Invalid Playwright report format: Missing testsuites/testsuite element');
    }
    
    const testcases = doc.querySelectorAll('testcase');
    
    if (testcases.length === 0) {
      throw new Error('No test cases found in Playwright report');
    }
    const results: ParsedTestResult[] = [];
    const uploadDate = new Date();

    testcases.forEach((testcase, index) => {
      const failures = testcase.querySelectorAll('failure');
      const flaky = testcase.getAttribute('flaky') === 'true';
      
      // Determine status
      let status: 'passed' | 'failed' | 'flaky' = 'passed';
      let errorMessage: string | undefined;
      
      if (failures.length > 0) {
        status = 'failed';
        errorMessage = failures[0].textContent || 'Unknown error';
      } else if (flaky) {
        status = 'flaky';
      }

      // Get parent testsuite for additional metadata
      const testsuite = testcase.closest('testsuite');
      const browser = testsuite?.getAttribute('hostname') || 'Unknown';
      const timestamp = testsuite?.getAttribute('timestamp') || new Date().toISOString();
      const suite = testsuite?.getAttribute('name') || '';

      results.push({
        id: `pw-${index + 1}-${Date.now()}`,
        name: testcase.getAttribute('name') || `Test ${index + 1}`,
        status,
        duration: `${parseFloat(testcase.getAttribute('time') || '0').toFixed(2)}s`,
        timestamp,
        framework: 'Playwright',
        browser,
        suite,
        uploadDate,
        ...(errorMessage && { errorMessage })
      });
    });

    return results;
  } catch (error) {
    console.error("Playwright XML parsing error:", error);
    throw error;
  }
};
