
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Clock, Trash2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { removeResultsByUploadId } from "@/services/testReportService";
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface UploadRecord {
  id: string;
  filename: string;
  timestamp: Date;
  fileSize: string;
  contentHash?: string;
}

interface UploadHistoryProps {
  uploads: UploadRecord[];
  onRemoveUpload?: (id: string) => void;
}

export const UploadHistory = ({ uploads, onRemoveUpload }: UploadHistoryProps) => {
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedUploads, setSelectedUploads] = useState<Record<string, boolean>>({});
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const toggleSelection = (id: string) => {
    setSelectedUploads(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleClearSelectionMode = () => {
    setIsSelectionMode(false);
    setSelectedUploads({});
  };

  const handleDeleteSelected = () => {
    setIsConfirmDialogOpen(true);
  };

  const confirmDelete = () => {
    const selectedIds = Object.entries(selectedUploads)
      .filter(([_, isSelected]) => isSelected)
      .map(([id]) => id);

    if (selectedIds.length === 0) {
      toast({
        title: "No reports selected",
        description: "Please select at least one report to delete",
      });
      return;
    }

    selectedIds.forEach(id => {
      removeResultsByUploadId(id);
      if (onRemoveUpload) onRemoveUpload(id);
    });

    toast({
      title: "Reports removed",
      description: `${selectedIds.length} report${selectedIds.length > 1 ? 's' : ''} successfully removed`,
    });

    setIsSelectionMode(false);
    setSelectedUploads({});
    setIsConfirmDialogOpen(false);
  };

  const getSelectedCount = () => {
    return Object.values(selectedUploads).filter(Boolean).length;
  };

  return (
    <>
      <Card className="w-full border border-amber-100">
        <CardHeader className="pb-2 bg-gradient-to-r from-amber-50 to-white">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-slate-800">Upload History</CardTitle>
              <CardDescription>Recent test report uploads</CardDescription>
            </div>
            <div className="flex gap-2">
              {isSelectionMode ? (
                <>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-amber-200 hover:bg-amber-50 text-slate-700"
                    onClick={handleClearSelectionMode}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="bg-red-500 hover:bg-red-600"
                    onClick={handleDeleteSelected}
                    disabled={getSelectedCount() === 0}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete ({getSelectedCount()})
                  </Button>
                </>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-amber-200 hover:bg-amber-50 text-slate-700"
                  onClick={() => setIsSelectionMode(true)}
                  disabled={uploads.length === 0}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Clear History
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <ScrollArea className="h-[250px] pr-4">
            <div className="space-y-3">
              {uploads.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  No upload history
                </div>
              ) : (
                uploads.map((upload) => (
                  <div
                    key={upload.id}
                    className="flex items-start space-x-3 border-b border-gray-200 pb-3 last:border-0 hover:bg-amber-50/30 transition-colors rounded-md p-2"
                  >
                    {isSelectionMode && (
                      <Checkbox 
                        id={`select-${upload.id}`}
                        checked={selectedUploads[upload.id] || false}
                        onCheckedChange={() => toggleSelection(upload.id)}
                        className="mt-1.5"
                      />
                    )}
                    <div className="rounded-full p-1.5 bg-amber-100">
                      <FileText className="h-3.5 w-3.5 text-amber-600" />
                    </div>
                    <div className="flex-1 space-y-0.5">
                      <p className="text-sm font-medium text-slate-800">{upload.filename}</p>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <p className="text-xs text-gray-500">
                          {formatDate(upload.timestamp)}
                        </p>
                        <span className="text-xs text-gray-400">{upload.fileSize}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent className="border-amber-200">
          <DialogHeader>
            <DialogTitle className="text-slate-800">Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {getSelectedCount()} selected report{getSelectedCount() !== 1 ? 's' : ''}? 
              This will remove all associated test results and cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsConfirmDialogOpen(false)}
              className="border-amber-200 hover:bg-amber-50"
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
