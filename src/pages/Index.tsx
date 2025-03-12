
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartBar, FileJson, Zap, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Test Automation Analytics Platform
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform your test automation results into actionable insights. Support for Playwright, Cypress, and other testing frameworks.
          </p>
          <div className="mt-8">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link to="/dashboard">
                <ChartBar className="mr-2 h-5 w-5" />
                View Dashboard
              </Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          <Card className="border-primary/20">
            <CardHeader>
              <FileJson className="h-12 w-12 text-primary mb-2" />
              <CardTitle>Multi-Framework Support</CardTitle>
              <CardDescription>
                Import test results from Playwright, Cypress, and other automation tools via XML reports.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <ChartBar className="h-12 w-12 text-primary mb-2" />
              <CardTitle>Advanced Analytics</CardTitle>
              <CardDescription>
                Visualize test execution trends, success rates, and performance metrics.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <Zap className="h-12 w-12 text-primary mb-2" />
              <CardTitle>Real-time Processing</CardTitle>
              <CardDescription>
                Upload reports via API and get instant insights about your test automation quality.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Stats Preview */}
      <section className="container mx-auto px-4 py-16">
        <Card className="border-primary/20">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <Shield className="h-8 w-8 mx-auto text-primary mb-2" />
                <h3 className="text-2xl font-bold">Test Coverage</h3>
                <p className="text-muted-foreground">Track your automation coverage over time</p>
              </div>
              <div>
                <Zap className="h-8 w-8 mx-auto text-primary mb-2" />
                <h3 className="text-2xl font-bold">Execution Time</h3>
                <p className="text-muted-foreground">Monitor test execution performance</p>
              </div>
              <div>
                <ChartBar className="h-8 w-8 mx-auto text-primary mb-2" />
                <h3 className="text-2xl font-bold">Success Rate</h3>
                <p className="text-muted-foreground">Analyze test stability and success patterns</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Index;
