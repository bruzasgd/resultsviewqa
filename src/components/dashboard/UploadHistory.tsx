
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
    <Card className="w-full border border-amber-100">
      <CardHeader className="pb-2 bg-gradient-to-r from-amber-50 to-white">
        <CardTitle className="text-slate-800">Upload History</CardTitle>
        <CardDescription>Recent test report uploads</CardDescription>
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
  );
};
