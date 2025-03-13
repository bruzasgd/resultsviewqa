
/**
 * XML Parser for test reports
 * Handles parsing of XML test reports from different testing frameworks
 */
import { parseXMLString, ParsedTestResult } from './parsers/baseParser';
import { parsePlaywrightXML } from './parsers/playwrightParser';
import { parseCypressXML } from './parsers/cypressParser';
import { parseGenericXML } from './parsers/genericParser';

// Re-export the ParsedTestResult type
// Using 'export type' for TypeScript modules with isolatedModules enabled
export type { ParsedTestResult };

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
    
    // Always consider XML with testcase elements as potentially valid Playwright format
    if (isPlaywright || doc.querySelectorAll('testcase').length > 0) {
      try {
        return parsePlaywrightXML(xmlString);
      } catch (error) {
        console.warn('Error parsing as Playwright XML, falling back to generic parser:', error);
        // Fall through to generic parser
      }
    }
    
    if (isCypress) {
      try {
        return parseCypressXML(xmlString);
      } catch (error) {
        console.warn('Error parsing as Cypress XML, falling back to generic parser:', error);
        // Fall through to generic parser
      }
    }
    
    // Generic fallback parsing
    return parseGenericXML(xmlString);
  } catch (error) {
    console.error('Error parsing XML:', error);
    throw new Error(`Failed to parse test report: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
