
import { Calendar, Upload, Download, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRef } from "react";
import { uploadTestReport } from "@/services/testReportService";
import { toast } from "@/components/ui/use-toast";
import { useUploadHistory, generateContentHash } from "@/services/uploadHistoryService";

interface DashboardHeaderProps {
  title: string;
  description: string;
  onRefresh: () => void;
  onReportUploaded?: () => void;
}

export const DashboardHeader = ({ title, description, onRefresh, onReportUploaded }: DashboardHeaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const xmlContent = await file.text();
      const contentHash = await generateContentHash(xmlContent);
      
      const uploadHistory = useUploadHistory.getState();
      const existingUpload = uploadHistory.getUploadByHash(contentHash);
      
      if (existingUpload) {
        toast({
          title: "Warning",
          description: `This file was already uploaded on ${existingUpload.timestamp.toLocaleString()}`,
          variant: "destructive",
        });
        return;
      }

      await uploadTestReport(xmlContent);
      
      // Add to upload history
      uploadHistory.addUpload({
        filename: file.name,
        fileSize: `${(file.size / 1024).toFixed(0)} KB`,
        contentHash
      });

      toast({
        title: "Success",
        description: "Test report uploaded successfully",
      });
      onReportUploaded?.();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload test report",
        variant: "destructive",
      });
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-muted-foreground mt-1">{description}</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <Select defaultValue="7days">
          <SelectTrigger className="w-[180px]">
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
        
        <Button variant="outline" onClick={onRefresh}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
        
        <input
          type="file"
          accept=".xml"
          onChange={handleUpload}
          ref={fileInputRef}
          className="hidden"
        />
        <Button onClick={() => fileInputRef.current?.click()}>
          <Upload className="mr-2 h-4 w-4" />
          Upload Report
        </Button>
      </div>
    </div>
  );
};
