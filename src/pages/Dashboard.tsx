
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Test Automation Dashboard</h1>
      <Card>
        <CardHeader>
          <CardTitle>Welcome to your Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This dashboard will be expanded to show your test automation metrics and insights.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
