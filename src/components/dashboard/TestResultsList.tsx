
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

  return (
    <ScrollArea className="h-[450px] rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">Status</TableHead>
            <TableHead>Test Name</TableHead>
            <TableHead>Browser</TableHead>
            <TableHead className="w-[100px]">Duration</TableHead>
            <TableHead className="w-[180px]">Timestamp</TableHead>
            <TableHead className="text-right">Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tests.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
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
                <TableRow className="border-b">
                  <TableCell>
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
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span className="truncate max-w-[300px]">{test.name}</span>
                      {test.suite && (
                        <span className="text-xs text-muted-foreground truncate max-w-[300px]">
                          {test.suite}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <Monitor className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{test.browser}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{test.duration}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {formatTime(test.timestamp)}
                  </TableCell>
                  <TableCell className="text-right">
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        {openItems[test.id] ? 'Hide' : 'View'}
                      </Button>
                    </CollapsibleTrigger>
                  </TableCell>
                </TableRow>
                <CollapsibleContent>
                  <TableRow>
                    <TableCell colSpan={6} className="bg-muted/50">
                      <div className="p-4 space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-semibold mb-1">Framework</h4>
                            <Badge variant="outline" className="font-mono">
                              {test.framework}
                            </Badge>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-semibold mb-1">Uploaded</h4>
                            <p className="text-sm text-muted-foreground">
                              {test.uploadDate ? new Date(test.uploadDate).toLocaleString() : 'Unknown'}
                            </p>
                          </div>
                          
                          {test.filename && (
                            <div>
                              <h4 className="text-sm font-semibold mb-1">File</h4>
                              <p className="text-sm text-muted-foreground truncate max-w-[300px]">
                                {test.filename}
                              </p>
                            </div>
                          )}
                          
                          {test.errorMessage && (
                            <div className="col-span-2">
                              <h4 className="text-sm font-semibold text-red-500 mb-1">Error</h4>
                              <div className="bg-red-50 border border-red-200 rounded p-2 overflow-auto max-h-[100px]">
                                <pre className="text-xs text-red-700 whitespace-pre-wrap">{test.errorMessage}</pre>
                              </div>
                            </div>
                          )}
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
