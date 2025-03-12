
/**
 * XML Parser for test reports
 * Handles parsing of XML test reports from different testing frameworks
 */

// Helper function to parse XML string to DOM
const parseXMLString = (xmlString: string): Document => {
  const parser = new DOMParser();
  return parser.parseFromString(xmlString, "application/xml");
};

// Interface for standardized test result
export interface ParsedTestResult {
  id: string;
  name: string;
  status: 'passed' | 'failed' | 'flaky';
  duration: string;
  timestamp: string;
  framework: string;
  browser: string;
  errorMessage?: string;
}

// Parse Playwright XML report
export const parsePlaywrightXML = (xmlString: string): ParsedTestResult[] => {
  const doc = parseXMLString(xmlString);
  const testcases = doc.querySelectorAll('testcase');
  const results: ParsedTestResult[] = [];

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

    results.push({
      id: `pw-${index + 1}`,
      name: testcase.getAttribute('name') || `Test ${index + 1}`,
      status,
      duration: `${parseFloat(testcase.getAttribute('time') || '0').toFixed(2)}s`,
      timestamp: testcase.getAttribute('timestamp') || new Date().toISOString(),
      framework: 'Playwright',
      browser: testcase.getAttribute('browser') || 'Unknown',
      ...(errorMessage && { errorMessage })
    });
  });

  return results;
};

// Parse Cypress XML report
export const parseCypressXML = (xmlString: string): ParsedTestResult[] => {
  const doc = parseXMLString(xmlString);
  const testcases = doc.querySelectorAll('testcase');
  const results: ParsedTestResult[] = [];

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

    results.push({
      id: `cy-${index + 1}`,
      name: testcase.getAttribute('name') || `Test ${index + 1}`,
      status,
      duration: `${parseFloat(testcase.getAttribute('time') || '0').toFixed(2)}s`,
      timestamp: testcase.getAttribute('timestamp') || new Date().toISOString(),
      framework: 'Cypress',
      browser: testcase.getAttribute('browser') || 'Chrome', // Cypress default
      ...(errorMessage && { errorMessage })
    });
  });

  return results;
};

// Generic XML parser that identifies the framework and calls the appropriate parser
export const parseTestXML = (xmlString: string): ParsedTestResult[] => {
  const doc = parseXMLString(xmlString);
  
  // Identify framework based on XML structure
  if (doc.querySelector('playwright')) {
    return parsePlaywrightXML(xmlString);
  } else if (doc.querySelector('cypress') || doc.documentElement.getAttribute('name')?.includes('cypress')) {
    return parseCypressXML(xmlString);
  } else {
    // Generic fallback parsing
    const testcases = doc.querySelectorAll('testcase');
    const results: ParsedTestResult[] = [];
    
    testcases.forEach((testcase, index) => {
      const failures = testcase.querySelectorAll('failure');
      
      results.push({
        id: `test-${index + 1}`,
        name: testcase.getAttribute('name') || `Test ${index + 1}`,
        status: failures.length > 0 ? 'failed' : 'passed',
        duration: `${parseFloat(testcase.getAttribute('time') || '0').toFixed(2)}s`,
        timestamp: testcase.getAttribute('timestamp') || new Date().toISOString(),
        framework: 'Unknown',
        browser: 'Unknown',
        ...(failures.length > 0 && { errorMessage: failures[0].textContent || 'Unknown error' })
      });
    });
    
    return results;
  }
};
