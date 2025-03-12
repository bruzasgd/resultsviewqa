
import { Calendar, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const DashboardHeader = () => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-3xl font-bold">Test Automation Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of your test automation metrics and insights</p>
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
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload Report
        </Button>
      </div>
    </div>
  );
};
