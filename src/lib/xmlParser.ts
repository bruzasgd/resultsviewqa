
/**
 * XML Parser for test reports
 * Handles parsing of XML test reports from different testing frameworks
 */

// Helper function to parse XML string to DOM with enhanced validation
const parseXMLString = (xmlString: string): Document => {
  if (!xmlString || !xmlString.trim()) {
    throw new Error('Empty XML string provided');
  }
  if (!xmlString.includes('<?xml')) {
    throw new Error('Invalid XML: Missing XML declaration');
  }
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, "application/xml");
  const parseError = doc.querySelector('parsererror');
  if (parseError) {
    throw new Error(`XML parsing error: ${parseError.textContent}`);
  }
  return doc;
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
  
  // Validate XML structure for Playwright
  if (doc.getElementsByTagName('parsererror').length > 0) {
    throw new Error('Invalid XML format in Playwright report');
  }
  
  // Check for required Playwright structure
  if (!doc.querySelector('testsuites') && !doc.querySelector('testsuite')) {
    throw new Error('Invalid Playwright report format: Missing testsuites/testsuite element');
  }
  
  const testcases = doc.querySelectorAll('testcase');
  
  if (testcases.length === 0) {
    throw new Error('No test cases found in Playwright report');
  }
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
  try {
    const doc = parseXMLString(xmlString);
    
    // Enhanced framework detection
    const isPlaywright = doc.querySelector('playwright') ||
      doc.documentElement.tagName.toLowerCase().includes('playwright') ||
      doc.querySelector('testsuites[name*="playwright"]') ||
      doc.querySelector('testsuite[name*="playwright"]') ||
      doc.querySelector('testcase[name*="playwright"]');
    const isCypress = doc.querySelector('cypress') ||
      doc.documentElement.getAttribute('name')?.toLowerCase().includes('cypress') ||
      doc.querySelector('testsuites[name*="cypress"]') ||
      doc.querySelector('testsuite[name*="cypress"]');
    
    if (isPlaywright) {
      try {
        return parsePlaywrightXML(xmlString);
      } catch (error) {
        console.error('Error parsing Playwright XML:', error);
        throw new Error(`Failed to parse Playwright report: ${error instanceof Error ? error.message : 'Unknown error'}. Please ensure the XML file is a valid Playwright test report.`);
      }
    } else if (isCypress) {
      return parseCypressXML(xmlString);
    } else {
      // Generic fallback parsing with enhanced error handling
      const testcases = doc.querySelectorAll('testcase');
      
      if (testcases.length === 0) {
        throw new Error('No test cases found in the XML report');
      }
      
      const results: ParsedTestResult[] = [];
      let testIndex = 0;
      
      const testsuites = doc.querySelectorAll('testsuite');
      testsuites.forEach(testsuite => {
        const browser = testsuite.getAttribute('hostname') || 'Unknown';
        const timestamp = testsuite.getAttribute('timestamp') || new Date().toISOString();
        
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
            id: `test-${++testIndex}`,
            name: testcase.getAttribute('name') || testcase.getAttribute('classname') || `Test ${testIndex}`,
            status,
            duration: `${parseFloat(testcase.getAttribute('time') || '0').toFixed(2)}s`,
            timestamp,
            framework: testsuite.getAttribute('name')?.split('.')[0] || 'Unknown',
            browser,
            ...(errorMessage && { errorMessage })
          });
        });
      });
      
      return results;
    }
  } catch (error) {
    console.error('Error parsing XML:', error);
    throw new Error(`Failed to parse test report: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
