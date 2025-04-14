
import { Calendar } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TimePeriodSelectProps {
  value: string;
  onValueChange: (value: string) => void;
}

export const TimePeriodSelect = ({ value, onValueChange }: TimePeriodSelectProps) => {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[180px] border-blue-200">
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
  );
};
