
import { parseXMLString, ParsedTestResult } from './baseParser';

// Generic fallback parser
export const parseGenericXML = (xmlString: string): ParsedTestResult[] => {
  try {
    const doc = parseXMLString(xmlString);
    
    // Generic fallback parsing with enhanced error handling
    const testcases = doc.querySelectorAll('testcase');
    
    if (testcases.length === 0) {
      throw new Error('No test cases found in the XML report');
    }
    
    const results: ParsedTestResult[] = [];
    let testIndex = 0;
    const uploadDate = new Date();
    
    const testsuites = doc.querySelectorAll('testsuite');
    
    if (testsuites.length === 0) {
      // Handle flat structure with no test suites
      testcases.forEach((testcase) => {
        const failures = testcase.querySelectorAll('failure');
        
        let status: 'passed' | 'failed' | 'flaky' = 'passed';
        let errorMessage: string | undefined;
        
        if (failures.length > 0) {
          status = 'failed';
          errorMessage = failures[0].textContent || 'Unknown error';
        }
        
        results.push({
          id: `test-${++testIndex}-${Date.now()}`,
          name: testcase.getAttribute('name') || testcase.getAttribute('classname') || `Test ${testIndex}`,
          status,
          duration: `${parseFloat(testcase.getAttribute('time') || '0').toFixed(2)}s`,
          timestamp: new Date().toISOString(),
          framework: 'Unknown',
          browser: 'Unknown',
          uploadDate,
          ...(errorMessage && { errorMessage })
        });
      });
    } else {
      testsuites.forEach(testsuite => {
        const browser = testsuite.getAttribute('hostname') || 'Unknown';
        const timestamp = testsuite.getAttribute('timestamp') || new Date().toISOString();
        const suite = testsuite.getAttribute('name') || '';
        
        const testcases = testsuite.querySelectorAll('testcase');
        testcases.forEach(testcase => {
          const failures = testcase.querySelectorAll('failure');
          const skipped = testcase.querySelectorAll('skipped');
          const error = testcase.querySelectorAll('error');
          
          let status: 'passed' | 'failed' | 'flaky' = 'passed';
          let errorMessage: string | undefined;
          
          if (failures.length > 0 || error.length > 0) {
            status = 'failed';
            errorMessage = (failures[0] || error[0]).textContent || 'Unknown error';
          } else if (skipped.length > 0) {
            status = 'flaky';
          }
          
          results.push({
            id: `test-${++testIndex}-${Date.now()}`,
            name: testcase.getAttribute('name') || testcase.getAttribute('classname') || `Test ${testIndex}`,
            status,
            duration: `${parseFloat(testcase.getAttribute('time') || '0').toFixed(2)}s`,
            timestamp,
            framework: testsuite.getAttribute('name')?.split('.')[0] || 'Unknown',
            browser,
            suite,
            uploadDate,
            ...(errorMessage && { errorMessage })
          });
        });
      });
    }
    
    return results;
  } catch (error) {
    console.error('Error parsing generic XML:', error);
    throw error;
  }
};
