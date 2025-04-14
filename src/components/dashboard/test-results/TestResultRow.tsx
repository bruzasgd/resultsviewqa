
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Monitor, Users, Clock, ExternalLink } from "lucide-react";
import { ParsedTestResult } from "@/lib/xmlParser";
import { TestStatusIcon } from "./TestStatusIcon";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TestResultRowProps {
  test: ParsedTestResult;
  isOpen: boolean;
  onToggle: () => void;
  formatTime: (dateString: string) => string;
}

export const TestResultRow = ({ test, isOpen, onToggle, formatTime }: TestResultRowProps) => {
  return (
    <TableRow className="border-b hover:bg-blue-50/40 transition-colors">
      <TableCell className="py-2 text-center">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex justify-center">
                <TestStatusIcon status={test.status} />
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
          <Monitor className="h-3.5 w-3.5 text-blue-500" />
          <span className="text-sm">{test.browser}</span>
        </div>
      </TableCell>
      <TableCell className="py-2">
        {test.team ? (
          <div className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-blue-500" />
            <span className="text-sm">{test.team}</span>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">Unassigned</span>
        )}
      </TableCell>
      <TableCell className="py-2">
        <div className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-blue-500" />
          <span className="text-sm">{test.duration}</span>
        </div>
      </TableCell>
      <TableCell className="py-2 text-sm">
        {formatTime(test.timestamp)}
      </TableCell>
      <TableCell className="text-right py-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-7 px-2 hover:bg-blue-100 hover:text-blue-700"
          onClick={onToggle}
        >
          <ExternalLink className="h-3.5 w-3.5 mr-1" />
          {isOpen ? 'Hide' : 'View'}
        </Button>
      </TableCell>
    </TableRow>
  );
};
