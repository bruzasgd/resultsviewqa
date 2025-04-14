
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { removeResultsByUploadId } from "@/services/testReportService";
import { toast } from "@/components/ui/use-toast";
import { UploadItem } from "./upload-history/UploadItem";
import { DeleteConfirmDialog } from "./upload-history/DeleteConfirmDialog";
import { HistoryHeader } from "./upload-history/HistoryHeader";

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
    try {
      if (!(date instanceof Date) || isNaN(date.getTime())) {
        return "Invalid date";
      }
      
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
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
      <Card className="w-full border border-blue-100">
        <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-white">
          <HistoryHeader
            isSelectionMode={isSelectionMode}
            selectedCount={getSelectedCount()}
            onClearSelection={handleClearSelectionMode}
            onEnterSelectionMode={() => setIsSelectionMode(true)}
            onDeleteSelected={handleDeleteSelected}
            uploadsExist={uploads.length > 0}
          />
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
                  <UploadItem
                    key={upload.id}
                    upload={upload}
                    isSelectionMode={isSelectionMode}
                    isSelected={selectedUploads[upload.id] || false}
                    onSelect={toggleSelection}
                    formatDate={formatDate}
                  />
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <DeleteConfirmDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={confirmDelete}
        selectedCount={getSelectedCount()}
      />
    </>
  );
};
