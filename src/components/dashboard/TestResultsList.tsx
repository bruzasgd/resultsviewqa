
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ParsedTestResult } from "@/lib/xmlParser";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { TestResultRow } from "./test-results/TestResultRow";
import { TestDetailsPanel } from "./test-results/TestDetailsPanel";

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

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (e) {
      return dateString;
    }
  };

  const formatUploadDate = (date: Date | string | undefined) => {
    if (!date) return 'Unknown';
    
    try {
      if (date instanceof Date && !isNaN(date.getTime())) {
        return date.toLocaleString();
      }
      
      if (typeof date === 'string') {
        const parsedDate = new Date(date);
        if (!isNaN(parsedDate.getTime())) {
          return parsedDate.toLocaleString();
        }
      }
      
      return 'Unknown';
    } catch (e) {
      console.error("Error formatting date:", e);
      return 'Unknown';
    }
  };

  return (
    <ScrollArea className="h-[400px] rounded-md border border-blue-100/50 w-full">
      <Table>
        <TableHeader className="sticky top-0 bg-background z-10">
          <TableRow className="bg-blue-50/80">
            <TableHead className="w-[50px] text-center">Status</TableHead>
            <TableHead>Test Name</TableHead>
            <TableHead className="w-[100px]">Browser</TableHead>
            <TableHead className="w-[100px]">Team</TableHead>
            <TableHead className="w-[80px]">Duration</TableHead>
            <TableHead className="w-[160px]">Timestamp</TableHead>
            <TableHead className="text-right w-[80px]">Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tests.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
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
                <TestResultRow
                  test={test}
                  isOpen={openItems[test.id]}
                  onToggle={() => toggleItem(test.id)}
                  formatTime={formatTime}
                />
                <CollapsibleContent>
                  <TableRow>
                    <TableCell colSpan={7} className="bg-blue-50/40 p-0">
                      <TestDetailsPanel test={test} formatUploadDate={formatUploadDate} />
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
