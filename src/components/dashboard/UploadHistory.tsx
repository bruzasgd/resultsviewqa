import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Clock } from "lucide-react";

interface UploadRecord {
  id: string;
  filename: string;
  timestamp: Date;
  fileSize: string;
}

interface UploadHistoryProps {
  uploads: UploadRecord[];
}

export const UploadHistory = ({ uploads }: UploadHistoryProps) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Upload History</CardTitle>
        <CardDescription>Recent test report uploads</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            {uploads.map((upload) => (
              <div
                key={upload.id}
                className="flex items-start space-x-4 border-b border-gray-200 pb-4 last:border-0"
              >
                <div className="rounded-full p-2 bg-blue-50">
                  <FileText className="h-4 w-4 text-blue-500" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{upload.filename}</p>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-3 w-3 text-gray-400" />
                    <p className="text-xs text-gray-500">
                      {formatDate(upload.timestamp)}
                    </p>
                    <span className="text-xs text-gray-400">{upload.fileSize}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};