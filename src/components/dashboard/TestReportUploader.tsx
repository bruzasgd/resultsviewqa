
import { useState } from "react";
import { Upload, FileUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { uploadTestReport } from "@/services/testReportService";
import { toast } from "@/components/ui/use-toast";

interface TestReportUploaderProps {
  onReportUploaded: () => void;
}

export const TestReportUploader = ({ onReportUploaded }: TestReportUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = async (file: File) => {
    if (!file.name.endsWith('.xml')) {
      toast({
        title: "Invalid file format",
        description: "Please upload an XML file",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    try {
      const fileContent = await file.text();
      const results = await uploadTestReport(fileContent);
      
      toast({
        title: "Upload successful",
        description: `${results.length} test results imported`,
      });
      
      onReportUploaded();
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await processFile(e.target.files[0]);
    }
  };

  return (
    <Card className={`${dragActive ? 'border-primary' : ''}`}>
      <CardHeader>
        <CardTitle className="text-xl">Upload Test Report</CardTitle>
        <CardDescription>
          Drag and drop or select an XML test report to upload
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center ${
            dragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/20'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center gap-4">
            <Upload className="h-10 w-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Drag and drop your XML file here or click to browse
            </p>
            <div className="relative">
              <Input
                id="file-upload"
                type="file"
                accept=".xml"
                className="absolute inset-0 opacity-0 cursor-pointer h-full w-full"
                onChange={handleFileChange}
                disabled={isUploading}
              />
              <Button variant="outline" disabled={isUploading}>
                <FileUp className="mr-2 h-4 w-4" />
                {isUploading ? "Uploading..." : "Select File"}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
