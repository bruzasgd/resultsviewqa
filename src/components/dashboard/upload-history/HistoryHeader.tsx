
import { Button } from "@/components/ui/button";
import { XCircle, Trash2 } from "lucide-react";

interface HistoryHeaderProps {
  isSelectionMode: boolean;
  selectedCount: number;
  onClearSelection: () => void;
  onEnterSelectionMode: () => void;
  onDeleteSelected: () => void;
  uploadsExist: boolean;
}

export const HistoryHeader = ({
  isSelectionMode,
  selectedCount,
  onClearSelection,
  onEnterSelectionMode,
  onDeleteSelected,
  uploadsExist,
}: HistoryHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <div className="text-slate-800">Upload History</div>
        <div className="text-muted-foreground">Recent test report uploads</div>
      </div>
      <div className="flex gap-2">
        {isSelectionMode ? (
          <>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-blue-200 hover:bg-blue-50 text-slate-700"
              onClick={onClearSelection}
            >
              <XCircle className="h-4 w-4 mr-1" />
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              className="bg-red-500 hover:bg-red-600"
              onClick={onDeleteSelected}
              disabled={selectedCount === 0}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete ({selectedCount})
            </Button>
          </>
        ) : (
          <Button 
            variant="outline" 
            size="sm" 
            className="border-blue-200 hover:bg-blue-50 text-slate-700"
            onClick={onEnterSelectionMode}
            disabled={!uploadsExist}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Clear History
          </Button>
        )}
      </div>
    </div>
  );
};
