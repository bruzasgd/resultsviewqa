import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, FileCode, AlertCircle } from "lucide-react";
import { useState } from "react";
import { API_ENDPOINTS } from "@/lib/apiSimulator";

export const XmlDocumentation = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-8 p-4 border rounded-lg bg-background">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCode className="h-5 w-5 text-blue-500" />
            <h2 className="text-xl font-semibold">XML Reports Documentation</h2>
          </div>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
        </div>
        
        <CollapsibleContent className="space-y-4 pt-4">
          <Alert className="bg-blue-50 border-blue-200">
            <AlertCircle className="h-4 w-4 text-blue-500" />
            <AlertTitle>Important</AlertTitle>
            <AlertDescription>
              This dashboard supports XML reports from Playwright, Cypress, and other JUnit-compatible test frameworks.
            </AlertDescription>
          </Alert>
          
          <p className="text-sm text-muted-foreground">
            You can upload test reports through the upload button in the Dashboard header or by using the API endpoints below.
          </p>
          
          <Tabs defaultValue="format" className="pt-2">
            <TabsList className="bg-blue-100/50 border border-blue-200">
              <TabsTrigger value="format" className="data-[state=active]:bg-blue-200 data-[state=active]:text-blue-900">XML Format</TabsTrigger>
              <TabsTrigger value="playwright" className="data-[state=active]:bg-blue-200 data-[state=active]:text-blue-900">Playwright</TabsTrigger>
              <TabsTrigger value="cypress" className="data-[state=active]:bg-blue-200 data-[state=active]:text-blue-900">Cypress</TabsTrigger>
              <TabsTrigger value="api" className="data-[state=active]:bg-blue-200 data-[state=active]:text-blue-900">API Usage</TabsTrigger>
            </TabsList>
            
            <TabsContent value="format" className="mt-4 space-y-4">
              <h3 className="text-lg font-medium">Standard XML Format</h3>
              <p className="text-sm">Your XML test report should include:</p>
              <ul className="list-disc pl-6 text-sm space-y-1">
                <li><code className="bg-gray-100 px-1 rounded text-xs">&lt;testsuites&gt;</code> as the root element</li>
                <li>Individual <code className="bg-gray-100 px-1 rounded text-xs">&lt;testsuite&gt;</code> elements</li>
                <li><code className="bg-gray-100 px-1 rounded text-xs">&lt;testcase&gt;</code> elements with attributes:
                  <ul className="list-disc pl-6 mt-1">
                    <li><code className="bg-gray-100 px-1 rounded text-xs">name</code>: Test case name</li>
                    <li><code className="bg-gray-100 px-1 rounded text-xs">time</code>: Test duration</li>
                    <li><code className="bg-gray-100 px-1 rounded text-xs">status</code>: Test status (optional)</li>
                    <li>Optional <code className="bg-gray-100 px-1 rounded text-xs">&lt;failure&gt;</code> or <code className="bg-gray-100 px-1 rounded text-xs">&lt;error&gt;</code> elements for failed tests</li>
                  </ul>
                </li>
              </ul>
              
              <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-60">
{`<?xml version="1.0" encoding="UTF-8"?>
<testsuites name="Example Tests" tests="3" failures="1" time="1.23">
  <testsuite name="Login Tests" tests="2" failures="1" time="0.83" timestamp="2023-04-01T12:30:45" team="Frontend">
    <testcase name="Should log in successfully" time="0.45" status="passed" />
    <testcase name="Should show error with invalid credentials" time="0.38" status="failed">
      <failure message="Expected error message to be visible">Error details...</failure>
    </testcase>
  </testsuite>
  <testsuite name="API Tests" tests="1" failures="0" time="0.4" timestamp="2023-04-01T12:31:15" team="Backend">
    <testcase name="Should return correct data" time="0.4" status="passed" />
  </testsuite>
</testsuites>`}
              </pre>
            </TabsContent>
            
            <TabsContent value="playwright" className="mt-4 space-y-4">
              <h3 className="text-lg font-medium">Playwright Reports</h3>
              <p className="text-sm">To generate JUnit XML reports from Playwright:</p>
              
              <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-60">
{`// In your playwright.config.ts file:
export default defineConfig({
  reporter: [['junit', { outputFile: 'results/junit-results.xml' }]],
  // other configuration...
});`}
              </pre>
              
              <p className="text-sm">You can specify a team for your Playwright tests using the metadata field:</p>
              
              <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-60">
{`// In your tests
test.describe('Login tests', () => {
  test.use({ 
    testIdAttribute: 'data-test-id',
    metadata: { team: 'Frontend' }
  });
  
  test('should log in', async ({ page }) => {
    // Your test code
  });
});`}
              </pre>
            </TabsContent>
            
            <TabsContent value="cypress" className="mt-4 space-y-4">
              <h3 className="text-lg font-medium">Cypress Reports</h3>
              <p className="text-sm">To generate JUnit XML reports from Cypress:</p>
              
              <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-60">
{`// Install the cypress-junit-reporter plugin
npm install --save-dev cypress-junit-reporter

// In your cypress.config.js file:
module.exports = {
  reporter: 'junit',
  reporterOptions: {
    mochaFile: 'results/cypress-[hash].xml',
    toConsole: true,
  },
  // other configuration...
};`}
              </pre>
              
              <p className="text-sm">You can add team information to your Cypress tests:</p>
              
              <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-60">
{`// In your test file
describe('Login tests', { team: 'Frontend' }, () => {
  it('should log in', () => {
    // Your test code
  });
});`}
              </pre>
            </TabsContent>
            
            <TabsContent value="api" className="mt-4 space-y-4">
              <h3 className="text-lg font-medium">API Usage</h3>
              <p className="text-sm">You can programmatically upload test reports using the following API endpoints:</p>
              
              <div className="space-y-3">
                <div className="bg-gray-100 p-3 rounded">
                  <p className="font-medium">Upload Test Report</p>
                  <p className="text-xs mt-1"><span className="font-medium">Endpoint:</span> <code>{API_ENDPOINTS.UPLOAD_TEST_REPORT}</code></p>
                  <p className="text-xs mt-1"><span className="font-medium">Method:</span> POST</p>
                  <p className="text-xs mt-1"><span className="font-medium">Content-Type:</span> multipart/form-data</p>
                  <p className="text-xs mt-1"><span className="font-medium">Request Body:</span></p>
                  <pre className="text-xs bg-gray-200 p-2 rounded mt-1">
{`{
  "file": "(XML file as multipart/form-data)",
  "team": "optional team name"
}`}
                  </pre>
                </div>
                
                <div className="bg-gray-100 p-3 rounded">
                  <p className="font-medium">Get Test Results</p>
                  <p className="text-xs mt-1"><span className="font-medium">Endpoint:</span> <code>{API_ENDPOINTS.GET_TEST_RESULTS}</code></p>
                  <p className="text-xs mt-1"><span className="font-medium">Method:</span> GET</p>
                  <p className="text-xs mt-1"><span className="font-medium">Query Parameters:</span></p>
                  <pre className="text-xs bg-gray-200 p-2 rounded mt-1">
{`{
  "team": "optional team filter",
  "days": "optional number of days to retrieve (default: 7)"
}`}
                  </pre>
                </div>
                
                <div className="bg-gray-100 p-3 rounded">
                  <p className="font-medium">Example API Usage with curl</p>
                  <pre className="text-xs bg-gray-200 p-2 rounded mt-1">
{`# Upload a test report
curl -X POST \\
  ${API_ENDPOINTS.UPLOAD_TEST_REPORT} \\
  -H "Content-Type: multipart/form-data" \\
  -F "file=@./path/to/your/report.xml" \\
  -F "team=Frontend"

# Get test results
curl -X GET \\
  ${API_ENDPOINTS.GET_TEST_RESULTS}?days=14&team=Frontend
`}
                  </pre>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
