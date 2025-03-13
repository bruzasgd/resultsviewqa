
import { Badge } from "@/components/ui/badge";
import { API_ENDPOINTS } from "@/lib/apiSimulator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export const ApiDocumentation = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-8 p-4 border rounded-lg bg-background">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">API Documentation</h2>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
        </div>
        
        <CollapsibleContent>
          <div className="space-y-4 pt-2">
            {/* GET Test Results */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge className="bg-green-100 text-green-800">GET</Badge>
                <code className="text-sm">{API_ENDPOINTS.GET_TEST_RESULTS}</code>
              </div>
              <span className="text-sm text-muted-foreground">Retrieve test results</span>
            </div>

            {/* Upload Test Report */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-100 text-blue-800">POST</Badge>
                <code className="text-sm">{API_ENDPOINTS.UPLOAD_TEST_REPORT}</code>
              </div>
              <span className="text-sm text-muted-foreground">Upload XML reports</span>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
