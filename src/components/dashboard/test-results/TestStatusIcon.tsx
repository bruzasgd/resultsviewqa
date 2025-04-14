
import { Check, X, AlertTriangle } from "lucide-react";

interface TestStatusIconProps {
  status: string;
}

export const TestStatusIcon = ({ status }: TestStatusIconProps) => {
  switch (status) {
    case 'passed':
      return <Check className="h-4 w-4 text-green-500" />;
    case 'failed':
      return <X className="h-4 w-4 text-red-500" />;
    case 'flaky':
      return <AlertTriangle className="h-4 w-4 text-blue-500" />;
    default:
      return null;
  }
};
