
import { FileText, Clock } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { UploadRecord } from "../UploadHistory";

interface UploadItemProps {
  upload: UploadRecord;
  isSelectionMode: boolean;
  isSelected: boolean;
  onSelect: (id: string) => void;
  formatDate: (date: Date) => string;
}

export const UploadItem = ({ 
  upload, 
  isSelectionMode, 
  isSelected, 
  onSelect,
  formatDate 
}: UploadItemProps) => {
  return (
    <div className="flex items-start space-x-3 border-b border-gray-200 pb-3 last:border-0 hover:bg-blue-50/30 transition-colors rounded-md p-2">
      {isSelectionMode && (
        <Checkbox 
          id={`select-${upload.id}`}
          checked={isSelected}
          onCheckedChange={() => onSelect(upload.id)}
          className="mt-1.5"
        />
      )}
      <div className="rounded-full p-1.5 bg-blue-100">
        <FileText className="h-3.5 w-3.5 text-blue-600" />
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
  );
};
