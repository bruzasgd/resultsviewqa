
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { ReactNode } from "react";

interface DashboardMetricCardProps {
  title: string;
  value: string;
  trend: string;
  icon: ReactNode;
  description: string;
  trendDirection: 'up' | 'down';
}

export const DashboardMetricCard = ({ 
  title, 
  value, 
  trend, 
  icon, 
  description,
  trendDirection
}: DashboardMetricCardProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-2">{value}</h3>
          </div>
          <div className="p-2 rounded-full bg-muted">{icon}</div>
        </div>
        <div className="flex items-center mt-4">
          <div className={`flex items-center ${
            trendDirection === 'up' 
              ? 'text-green-500' 
              : 'text-red-500'
          }`}>
            {trendDirection === 'up' ? (
              <TrendingUp className="h-4 w-4 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 mr-1" />
            )}
            <span className="text-sm font-medium">{trend}</span>
          </div>
          <span className="text-sm text-muted-foreground ml-2">{description}</span>
        </div>
      </CardContent>
    </Card>
  );
};
