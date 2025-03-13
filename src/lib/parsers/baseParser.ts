
/**
 * Base parser utilities for XML test reports
 */

// Helper function to parse XML string to DOM with enhanced validation
export const parseXMLString = (xmlString: string): Document => {
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
