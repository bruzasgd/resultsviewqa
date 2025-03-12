import { Badge } from "@/components/ui/badge";
import { API_ENDPOINTS } from "@/lib/apiSimulator";

export const ApiDocumentation = () => {
  return (
    <div className="mt-8 p-6 border rounded-lg bg-background">
      <h2 className="text-2xl font-bold mb-4">API Documentation</h2>
      <p className="text-muted-foreground mb-6">
        Welcome to the Test Results API documentation! This guide will help you understand how to interact with our API to manage test results.
        Below you'll find detailed information about each endpoint, including examples and common use cases.
      </p>
      
      <div className="space-y-8">
        {/* Quick Start Guide */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-3">🚀 Quick Start Guide</h3>
          <div className="bg-muted p-4 rounded-md">
            <ol className="list-decimal list-inside space-y-2">
              <li>First, make sure you have access to the API endpoints</li>
              <li>Use the GET endpoint to retrieve test results</li>
              <li>Use the POST endpoint to upload new test reports</li>
              <li>Check the response status and handle any errors appropriately</li>
            </ol>
          </div>
        </div>

        {/* GET Test Results */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-green-100 text-green-800">GET</Badge>
            <code className="text-sm">{API_ENDPOINTS.GET_TEST_RESULTS}</code>
          </div>
          <p className="text-muted-foreground mb-2">📊 Retrieve all test results from the system</p>
          <p className="text-sm text-muted-foreground mb-3">Use this endpoint when you need to fetch the current state of all test results. Perfect for displaying test reports or analyzing test performance.</p>
          <div className="bg-muted p-3 rounded-md">
            <p className="font-medium mb-2">Response Format:</p>
            <pre className="text-sm overflow-x-auto">
              {
`{
  "success": boolean,
  "data": {
    "results": [{
      "id": string,
      "name": string,
      "status": "passed" | "failed" | "flaky",
      "duration": string,
      "timestamp": string,
      "framework": string,
      "browser": string,
      "errorMessage": string (optional)
    }]
  },
  "error": string (optional)
}`
              }
            </pre>
          </div>
        </div>

        {/* Upload Test Report */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-blue-100 text-blue-800">POST</Badge>
            <code className="text-sm">{API_ENDPOINTS.UPLOAD_TEST_REPORT}</code>
          </div>
          <p className="text-muted-foreground mb-2">Upload XML test report</p>
          <div className="bg-muted p-3 rounded-md">
            <p className="font-medium mb-2">Request Format:</p>
            <pre className="text-sm overflow-x-auto">
              {
`// Content-Type: application/xml
<?xml version="1.0" encoding="UTF-8"?>
<testsuites>
  <testsuite name="Example Suite">
    <testcase name="Test Case 1" status="passed" />
    <testcase name="Test Case 2" status="failed">
      <failure>Error message here</failure>
    </testcase>
  </testsuite>
</testsuites>`
              }
            </pre>
          </div>
        </div>

        {/* Usage Example */}
        <div>
          <h3 className="text-lg font-semibold mb-2">💡 Usage Examples</h3>
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-md">
              <p className="font-medium mb-2">JavaScript/TypeScript Example:</p>
              <pre className="text-sm overflow-x-auto bg-background p-3 rounded">
                {
`// 1. Fetch test results
try {
  const response = await fetch('${API_ENDPOINTS.GET_TEST_RESULTS}');
  const data = await response.json();
  
  if (data.success) {
    console.log('✅ Test results:', data.data.results);
  } else {
    console.error('❌ Error:', data.error);
  }
} catch (error) {
  console.error('❌ Network error:', error);
}

// 2. Upload test report
try {
  const response = await fetch('${API_ENDPOINTS.UPLOAD_TEST_REPORT}', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/xml'
    },
    body: xmlString
  });
  const data = await response.json();

  if (data.success) {
    console.log('✅ Upload successful!');
  } else {
    console.error('❌ Upload failed:', data.error);
  }
} catch (error) {
  console.error('❌ Network error:', error);
}`
                }
              </pre>
            </div>

            <div className="bg-muted p-4 rounded-md">
              <p className="font-medium mb-2">🔍 Tips for Success:</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Always check the response's success status before using the data</li>
                <li>Implement proper error handling for failed requests</li>
                <li>Validate XML format before uploading test reports</li>
                <li>Consider implementing retry logic for failed requests</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};