
import { Badge } from "@/components/ui/badge";
import { API_ENDPOINTS } from "@/lib/apiSimulator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ApiDocumentation = () => {
  return (
    <div className="mt-8 p-6 border rounded-lg bg-background">
      <Collapsible>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">API Documentation</h2>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              <ChevronDown className="h-4 w-4" />
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        
        <p className="text-muted-foreground mb-4">
          Essential endpoints for managing test results in your automation pipeline.
        </p>
        
        <CollapsibleContent>
          <div className="space-y-6">
            {/* GET Test Results */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-green-100 text-green-800">GET</Badge>
                <code className="text-sm">{API_ENDPOINTS.GET_TEST_RESULTS}</code>
              </div>
              <p className="text-sm text-muted-foreground mb-2">Retrieve all test results from the system</p>
            </div>

            {/* Upload Test Report */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-blue-100 text-blue-800">POST</Badge>
                <code className="text-sm">{API_ENDPOINTS.UPLOAD_TEST_REPORT}</code>
              </div>
              <p className="text-sm text-muted-foreground mb-2">Upload XML test report (supports Playwright, Cypress and JUnit formats)</p>
              <div className="bg-muted p-3 rounded-md">
                <p className="text-xs font-medium mb-1">Sample Usage:</p>
                <pre className="text-xs overflow-x-auto">
                  {
`fetch('${API_ENDPOINTS.UPLOAD_TEST_REPORT}', {
  method: 'POST',
  headers: { 'Content-Type': 'application/xml' },
  body: xmlString
})`
                  }
                </pre>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
