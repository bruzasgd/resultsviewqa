
import { parseXMLString, ParsedTestResult } from './baseParser';

// Parse Cypress XML report
export const parseCypressXML = (xmlString: string): ParsedTestResult[] => {
  try {
    const doc = parseXMLString(xmlString);
    const testcases = doc.querySelectorAll('testcase');
    const results: ParsedTestResult[] = [];
    const uploadDate = new Date();

    testcases.forEach((testcase, index) => {
      const failures = testcase.querySelectorAll('failure');
      const skipped = testcase.querySelectorAll('skipped');
      
      // Determine status
      let status: 'passed' | 'failed' | 'flaky' = 'passed';
      let errorMessage: string | undefined;
      
      if (failures.length > 0) {
        status = 'failed';
        errorMessage = failures[0].textContent || 'Unknown error';
      } else if (skipped.length > 0) {
        status = 'flaky'; // Treating skipped as flaky for now
      }

      // Get parent testsuite for additional metadata
      const testsuite = testcase.closest('testsuite');
      const browser = testsuite?.getAttribute('hostname') || 'Chrome';
      const timestamp = testsuite?.getAttribute('timestamp') || new Date().toISOString();
      const suite = testsuite?.getAttribute('name') || '';
      
      // Extract team information (if available) from metadata attributes or custom properties
      const team = testsuite?.getAttribute('team') || 
                  testcase.getAttribute('team') || 
                  'QA'; // Default team if not specified
      
      results.push({
        id: `cy-${index + 1}-${Date.now()}`,
        name: testcase.getAttribute('name') || `Test ${index + 1}`,
        status,
        duration: `${parseFloat(testcase.getAttribute('time') || '0').toFixed(2)}s`,
        timestamp,
        framework: 'Cypress',
        browser,
        suite,
        uploadDate,
        team,
        ...(errorMessage && { errorMessage })
      });
    });

    return results;
  } catch (error) {
    console.error("Cypress XML parsing error:", error);
    throw error;
  }
};
