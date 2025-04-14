
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { uploadTestReport } from "@/services/testReportService";
import { toast } from "@/components/ui/use-toast";
import { useUploadHistory, generateContentHash } from "@/services/uploadHistoryService";
import { TimePeriodSelect } from "./header/TimePeriodSelect";
import { FileUploader } from "./header/FileUploader";
import { DuplicateUploadDialog } from "./header/DuplicateUploadDialog";

interface DashboardHeaderProps {
  title: string;
  description: string;
  onRefresh: () => void;
  onReportUploaded?: () => void;
  timePeriod?: string;
  onTimePeriodChange?: (value: string) => void;
}

export const DashboardHeader = ({ 
  title, 
  description, 
  onRefresh, 
  onReportUploaded,
  timePeriod = "7days",
  onTimePeriodChange
}: DashboardHeaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);
  const [pendingUpload, setPendingUpload] = useState<{
    xmlContent: string;
    filename: string;
    contentHash: string;
  } | null>(null);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setUploadProgress(10);
      
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 100);
      
      const xmlContent = await file.text();
      setUploadProgress(95);
      
      const contentHash = await generateContentHash(xmlContent);
      clearInterval(progressInterval);
      
      const uploadHistory = useUploadHistory.getState();
      const existingUpload = uploadHistory.getUploadByHash(contentHash);
      
      if (existingUpload) {
        setPendingUpload({
          xmlContent,
          filename: file.name,
          contentHash
        });
        setShowDuplicateDialog(true);
        setUploadProgress(100);
        return;
      }

      await processUpload(xmlContent, file.name, contentHash);
      
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload test report",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };
  
  const processUpload = async (xmlContent: string, filename: string, contentHash: string) => {
    try {
      await uploadTestReport(xmlContent, filename);
      useUploadHistory.getState().addUpload({
        filename,
        fileSize: `${(xmlContent.length / 1024).toFixed(0)} KB`,
        contentHash
      });
      onReportUploaded?.();
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">{title}</h1>
        <p className="text-muted-foreground mt-1">{description}</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <TimePeriodSelect 
          value={timePeriod} 
          onValueChange={onTimePeriodChange || (() => {})} 
        />
        
        <Button 
          variant="outline" 
          onClick={onRefresh} 
          className="border-blue-200 hover:bg-blue-50 hover:text-blue-700"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isUploading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
        
        <FileUploader
          onFileSelect={handleUpload}
          isUploading={isUploading}
          uploadProgress={uploadProgress}
        />
      </div>
      
      <DuplicateUploadDialog
        open={showDuplicateDialog}
        onOpenChange={setShowDuplicateDialog}
        onCancel={() => {
          setShowDuplicateDialog(false);
          setPendingUpload(null);
        }}
        onConfirm={async () => {
          if (pendingUpload) {
            await processUpload(
              pendingUpload.xmlContent,
              pendingUpload.filename,
              pendingUpload.contentHash
            );
          }
          setShowDuplicateDialog(false);
          setPendingUpload(null);
        }}
      />
    </div>
  );
};
