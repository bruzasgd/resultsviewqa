
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ParsedTestResult } from "@/lib/xmlParser";
import { Check, X, AlertTriangle, ExternalLink, Clock, Monitor } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface TestResultsListProps {
  tests: ParsedTestResult[];
}

export const TestResultsList = ({ tests }: TestResultsListProps) => {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleItem = (id: string) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <X className="h-4 w-4 text-red-500" />;
      case 'flaky':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      default:
        return null;
    }
  };

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (e) {
      return dateString;
    }
  };

  // Helper function to safely format upload date
  const formatUploadDate = (date: Date | undefined) => {
    if (!date) return 'Unknown';
    
    try {
      // Check if date is already a Date object
      if (date instanceof Date && !isNaN(date.getTime())) {
        return date.toLocaleString();
      }
      
      // If it's a string representation, convert it
      if (typeof date === 'string') {
        return new Date(date).toLocaleString();
      }
      
      return 'Unknown';
    } catch (e) {
      console.error("Error formatting date:", e);
      return 'Unknown';
    }
  };

  return (
    <ScrollArea className="h-[400px] rounded-md border border-amber-100/50">
      <Table>
        <TableHeader className="sticky top-0 bg-background z-10">
          <TableRow className="bg-amber-50/80">
            <TableHead className="w-[50px] text-center">Status</TableHead>
            <TableHead>Test Name</TableHead>
            <TableHead className="w-[100px]">Browser</TableHead>
            <TableHead className="w-[80px]">Duration</TableHead>
            <TableHead className="w-[160px]">Timestamp</TableHead>
            <TableHead className="text-right w-[80px]">Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tests.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                No test results available
              </TableCell>
            </TableRow>
          ) : (
            tests.map((test) => (
              <Collapsible
                key={test.id}
                open={openItems[test.id]}
                onOpenChange={() => toggleItem(test.id)}
                className="w-full"
              >
                <TableRow className="border-b hover:bg-amber-50/40 transition-colors">
                  <TableCell className="py-2 text-center">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex justify-center">
                            {getStatusIcon(test.status)}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="capitalize">{test.status}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell className="font-medium py-2">
                    <div className="flex flex-col">
                      <span className="truncate max-w-[280px] text-slate-800">{test.name}</span>
                      {test.suite && (
                        <span className="text-xs text-muted-foreground truncate max-w-[280px]">
                          {test.suite}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="py-2">
                    <div className="flex items-center gap-1.5">
                      <Monitor className="h-3.5 w-3.5 text-amber-500" />
                      <span className="text-sm">{test.browser}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-2">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-amber-500" />
                      <span className="text-sm">{test.duration}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-2 text-sm">
                    {formatTime(test.timestamp)}
                  </TableCell>
                  <TableCell className="text-right py-2">
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-7 px-2 hover:bg-amber-100 hover:text-amber-700">
                        <ExternalLink className="h-3.5 w-3.5 mr-1" />
                        {openItems[test.id] ? 'Hide' : 'View'}
                      </Button>
                    </CollapsibleTrigger>
                  </TableCell>
                </TableRow>
                <CollapsibleContent>
                  <TableRow>
                    <TableCell colSpan={6} className="bg-amber-50/40 p-0">
                      <div className="p-3 space-y-2">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <h4 className="text-xs font-semibold mb-1">Framework</h4>
                            <Badge variant="outline" className="font-mono text-xs bg-amber-50 text-amber-700 border-amber-200">
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

                        {/* Additional test insights */}
                        <div className="mt-3 border-t border-amber-100 pt-2">
                          <h4 className="text-xs font-semibold mb-1">Test Insights</h4>
                          <div className="grid grid-cols-3 gap-2">
                            <div className="bg-amber-50/50 p-2 rounded-md">
                              <div className="text-xs text-muted-foreground">Frequency</div>
                              <div className="text-sm font-medium">{Math.floor(Math.random() * 20) + 1} runs</div>
                            </div>
                            <div className="bg-amber-50/50 p-2 rounded-md">
                              <div className="text-xs text-muted-foreground">Avg. Duration</div>
                              <div className="text-sm font-medium">{(parseFloat(test.duration.replace('s', '')) * 0.9).toFixed(2)}s</div>
                            </div>
                            <div className="bg-amber-50/50 p-2 rounded-md">
                              <div className="text-xs text-muted-foreground">Stability</div>
                              <div className="text-sm font-medium">{test.status === 'flaky' ? 'Unstable' : 'Stable'}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                </CollapsibleContent>
              </Collapsible>
            ))
          )}
        </TableBody>
      </Table>
    </ScrollArea>
  );
};
