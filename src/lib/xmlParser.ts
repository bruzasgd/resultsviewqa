
/**
 * XML Parser for test reports
 * Handles parsing of XML test reports from different testing frameworks
 */

// Helper function to parse XML string to DOM with enhanced validation
const parseXMLString = (xmlString: string): Document => {
  if (!xmlString || !xmlString.trim()) {
    throw new Error('Empty XML string provided');
  }
  
  // Remove BOM if present and clean whitespace
  const cleanXml = xmlString.trim().replace(/^\ufeff/g, '');
  
  const parser = new DOMParser();
  const doc = parser.parseFromString(cleanXml, "application/xml");
  const parseError = doc.querySelector('parsererror');
  if (parseError) {
    console.error("XML parsing error details:", parseError.textContent);
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
  suite?: string;
  filename?: string;
  uploadDate?: Date;
}

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
        ...(errorMessage && { errorMessage })
      });
    });

    return results;
  } catch (error) {
    console.error("Cypress XML parsing error:", error);
    throw error;
  }
};

// Generic XML parser that identifies the framework and calls the appropriate parser
export const parseTestXML = (xmlString: string): ParsedTestResult[] => {
  try {
    console.log("Parsing XML, length:", xmlString.length);
    console.log("First 100 chars:", xmlString.substring(0, 100));
    
    const doc = parseXMLString(xmlString);
    
    // Log the structure for debugging
    console.log("XML structure:", {
      hasTestSuites: !!doc.querySelector('testsuites'),
      hasTestSuite: !!doc.querySelector('testsuite'),
      testcaseCount: doc.querySelectorAll('testcase').length
    });
    
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
      const uploadDate = new Date();
      
      const testsuites = doc.querySelectorAll('testsuite');
      
      if (testsuites.length === 0) {
        // Handle flat structure with no test suites
        testcases.forEach((testcase, index) => {
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
    }
  } catch (error) {
    console.error('Error parsing XML:', error);
    throw new Error(`Failed to parse test report: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
