
import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface FileUploaderProps {
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isUploading: boolean;
  uploadProgress: number;
}

export const FileUploader = ({ onFileSelect, isUploading, uploadProgress }: FileUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="relative flex-1">
      <input
        type="file"
        accept=".xml"
        onChange={onFileSelect}
        ref={fileInputRef}
        className="hidden"
      />
      <Button 
        onClick={() => fileInputRef.current?.click()} 
        disabled={isUploading}
        className="w-full sm:w-auto relative overflow-hidden bg-blue-600 hover:bg-blue-700 text-white"
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
  );
};
