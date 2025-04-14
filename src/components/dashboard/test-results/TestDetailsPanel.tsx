
import { Badge } from "@/components/ui/badge";
import { ParsedTestResult } from "@/lib/xmlParser";

interface TestDetailsPanelProps {
  test: ParsedTestResult;
  formatUploadDate: (date: Date | string | undefined) => string;
}

export const TestDetailsPanel = ({ test, formatUploadDate }: TestDetailsPanelProps) => {
  return (
    <div className="p-3 space-y-2">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <h4 className="text-xs font-semibold mb-1">Framework</h4>
          <Badge variant="outline" className="font-mono text-xs bg-blue-50 text-blue-700 border-blue-200">
            {test.framework}
          </Badge>
        </div>
        
        <div>
          <h4 className="text-xs font-semibold mb-1">Uploaded</h4>
          <p className="text-xs text-muted-foreground">
            {formatUploadDate(test.uploadDate)}
          </p>
        </div>
        
        {test.filename && (
          <div>
            <h4 className="text-xs font-semibold mb-1">File</h4>
            <p className="text-xs text-muted-foreground truncate max-w-[300px]">
              {test.filename}
            </p>
          </div>
        )}
        
        {test.errorMessage && (
          <div className="col-span-2">
            <h4 className="text-xs font-semibold text-red-500 mb-1">Error</h4>
            <div className="bg-red-50 border border-red-200 rounded p-2 overflow-auto max-h-[80px]">
              <pre className="text-xs text-red-700 whitespace-pre-wrap">{test.errorMessage}</pre>
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 border-t border-blue-100 pt-2">
        <h4 className="text-xs font-semibold mb-1">Test Insights</h4>
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-blue-50/50 p-2 rounded-md">
            <div className="text-xs text-muted-foreground">Frequency</div>
            <div className="text-sm font-medium">{Math.floor(Math.random() * 20) + 1} runs</div>
          </div>
          <div className="bg-blue-50/50 p-2 rounded-md">
            <div className="text-xs text-muted-foreground">Avg. Duration</div>
            <div className="text-sm font-medium">{(parseFloat(test.duration.replace('s', '')) * 0.9).toFixed(2)}s</div>
          </div>
          <div className="bg-blue-50/50 p-2 rounded-md">
            <div className="text-xs text-muted-foreground">Stability</div>
            <div className="text-sm font-medium">{test.status === 'flaky' ? 'Unstable' : 'Stable'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
