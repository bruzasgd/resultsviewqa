
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle 
} from "lucide-react";
import { DashboardMetricCard } from "@/components/dashboard/DashboardMetricCard";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { TestResultsList } from "@/components/dashboard/TestResultsList";
import { mockTestData } from "@/data/mockTestData";

const Dashboard = () => {
  // Sample data for the charts
  const testSuccessData = [
    { name: 'Mon', passed: 85, failed: 15 },
    { name: 'Tue', passed: 75, failed: 25 },
    { name: 'Wed', passed: 90, failed: 10 },
    { name: 'Thu', passed: 95, failed: 5 },
    { name: 'Fri', passed: 88, failed: 12 },
    { name: 'Sat', passed: 92, failed: 8 },
    { name: 'Sun', passed: 78, failed: 22 },
  ];

  const testDurationData = [
    { name: 'Mon', duration: 240 },
    { name: 'Tue', duration: 300 },
    { name: 'Wed', duration: 270 },
    { name: 'Thu', duration: 250 },
    { name: 'Fri', duration: 280 },
    { name: 'Sat', duration: 220 },
    { name: 'Sun', duration: 290 },
  ];

  const testTypeDistribution = [
    { name: 'API Tests', value: 45 },
    { name: 'UI Tests', value: 30 },
    { name: 'Integration', value: 15 },
    { name: 'Unit Tests', value: 10 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="container mx-auto p-6 space-y-8">
      <DashboardHeader />
      
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardMetricCard 
          title="Pass Rate" 
          value="87%" 
          trend="+2.5%" 
          icon={<CheckCircle className="h-5 w-5 text-green-500" />} 
          description="Overall test pass rate" 
          trendDirection="up"
        />
        
        <DashboardMetricCard 
          title="Failed Tests" 
          value="13" 
          trend="-4" 
          icon={<XCircle className="h-5 w-5 text-red-500" />} 
          description="Tests failing this week" 
          trendDirection="down"
        />
        
        <DashboardMetricCard 
          title="Avg. Duration" 
          value="3m 12s" 
          trend="+12s" 
          icon={<Clock className="h-5 w-5 text-blue-500" />} 
          description="Average test execution time" 
          trendDirection="up"
        />
        
        <DashboardMetricCard 
          title="Flaky Tests" 
          value="7" 
          trend="+2" 
          icon={<AlertTriangle className="h-5 w-5 text-amber-500" />} 
          description="Tests with inconsistent results" 
          trendDirection="up"
        />
      </div>

      {/* Chart Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="distribution">Test Distribution</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
                Test Success Rate (Last 7 Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={testSuccessData} stackOffset="expand">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(tick) => `${tick}%`} />
                    <Tooltip formatter={(value) => [`${value}%`, 'Tests']} />
                    <Legend />
                    <Bar dataKey="passed" name="Passed" stackId="a" fill="#4ade80" />
                    <Bar dataKey="failed" name="Failed" stackId="a" fill="#f87171" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  Test Execution Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={testDurationData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(tick) => `${tick}s`} />
                      <Tooltip formatter={(value) => [`${value}s`, 'Duration']} />
                      <Line type="monotone" dataKey="duration" stroke="#3b82f6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-muted-foreground" />
                  Recent Failed Tests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TestResultsList tests={mockTestData.filter(test => test.status === 'failed')} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Test Performance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={testDurationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="duration" name="Duration (seconds)" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="distribution">
          <Card>
            <CardHeader>
              <CardTitle>Test Type Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={testTypeDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {testTypeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
