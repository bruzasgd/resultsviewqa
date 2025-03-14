import { Calendar, Upload, RefreshCw, AlertCircle, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRef, useState } from "react";
import { uploadTestReport } from "@/services/testReportService";
import { toast } from "@/components/ui/use-toast";
import { useUploadHistory, generateContentHash } from "@/services/uploadHistoryService";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  const fileInputRef = useRef<HTMLInputElement>(null);
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
      
      // Simulate progress
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
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };
  
  const processUpload = async (xmlContent: string, filename: string, contentHash: string) => {
    try {
      await uploadTestReport(xmlContent, filename);
      
      // Add to upload history
      useUploadHistory.getState().addUpload({
        filename,
        fileSize: `${(xmlContent.length / 1024).toFixed(0)} KB`,
        contentHash
      });

      toast({
        title: "Success",
        description: (
          <div className="flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-green-500" />
            <span>Test report uploaded successfully: {filename}</span>
          </div>
        ),
      });
      
      onReportUploaded?.();
    } catch (error) {
      toast({
        title: "Error",
        description: (
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
            <div>
              <p className="font-medium">Upload failed</p>
              <p className="text-sm text-muted-foreground">{error instanceof Error ? error.message : "Failed to process test report"}</p>
            </div>
          </div>
        ),
        variant: "destructive",
      });
    }
  };
  
  const handleTimePeriodChange = (value: string) => {
    if (onTimePeriodChange) {
      onTimePeriodChange(value);
    }
  };
  
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">{title}</h1>
        <p className="text-muted-foreground mt-1">{description}</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <Select value={timePeriod} onValueChange={handleTimePeriodChange}>
          <SelectTrigger className="w-[180px] border-amber-200">
            <Calendar className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Time Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="yesterday">Yesterday</SelectItem>
            <SelectItem value="7days">Last 7 Days</SelectItem>
            <SelectItem value="30days">Last 30 Days</SelectItem>
            <SelectItem value="90days">Last 90 Days</SelectItem>
          </SelectContent>
        </Select>
        
        <Button variant="outline" onClick={onRefresh} className="border-amber-200 hover:bg-amber-50 hover:text-amber-700">
          <RefreshCw className={`mr-2 h-4 w-4 ${isUploading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
        
        <input
          type="file"
          accept=".xml"
          onChange={handleUpload}
          ref={fileInputRef}
          className="hidden"
        />
        <div className="relative flex-1">
          <Button 
            onClick={() => fileInputRef.current?.click()} 
            disabled={isUploading}
            className="w-full sm:w-auto relative overflow-hidden bg-amber-500 hover:bg-amber-600 text-white"
          >
            <Upload className="mr-2 h-4 w-4" />
            {isUploading ? 'Uploading...' : 'Upload Report'}
          </Button>
          {isUploading && (
            <Progress 
              value={uploadProgress} 
              className="absolute bottom-0 left-0 right-0 h-1 rounded-none" 
            />
          )}
        </div>
      </div>
      
      {/* Duplicate Upload Dialog */}
      <AlertDialog open={showDuplicateDialog} onOpenChange={setShowDuplicateDialog}>
        <AlertDialogContent className="border-amber-200">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-slate-800">Duplicate Report Detected</AlertDialogTitle>
            <AlertDialogDescription>
              This report appears to have been uploaded before. Do you want to upload it again?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setShowDuplicateDialog(false);
              setPendingUpload(null);
            }} className="border-amber-200 hover:bg-amber-50 hover:text-amber-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={async () => {
              if (pendingUpload) {
                await processUpload(
                  pendingUpload.xmlContent,
                  pendingUpload.filename,
                  pendingUpload.contentHash
                );
              }
              setShowDuplicateDialog(false);
              setPendingUpload(null);
            }} className="bg-amber-500 hover:bg-amber-600 text-white">
              Upload Anyway
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
