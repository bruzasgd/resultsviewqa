
import { Card, CardContent } from "@/components/ui/card";
import { ReactNode } from "react";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";

interface DashboardMetricCardProps {
  title: string;
  value: string;
  description: string;
  icon: ReactNode;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
}

export const DashboardMetricCard = ({ 
  title, 
  value, 
  icon, 
  description,
  trend,
  trendDirection = 'neutral'
}: DashboardMetricCardProps) => {
  const getTrendColor = () => {
    switch (trendDirection) {
      case 'up':
        return 'text-green-500';
      case 'down':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getTrendIcon = () => {
    switch (trendDirection) {
      case 'up':
        return <ArrowUp className="h-3 w-3 text-green-500" />;
      case 'down':
        return <ArrowDown className="h-3 w-3 text-red-500" />;
      default:
        return <Minus className="h-3 w-3 text-gray-500" />;
    }
  };

  return (
    <Card className="transition-all hover:shadow-md">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-2">{value}</h3>
          </div>
          <div className="p-2 rounded-full bg-muted">{icon}</div>
        </div>
        <div className="flex items-center mt-4">
          {trend && (
            <span className={`text-sm font-medium ${getTrendColor()} flex items-center`}>
              {getTrendIcon()}
              <span className="ml-1">{trend}</span>
            </span>
          )}
          <span className="text-sm text-muted-foreground ml-2">{description}</span>
        </div>
      </CardContent>
    </Card>
  );
};
