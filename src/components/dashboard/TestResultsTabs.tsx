
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TestResultsList } from "@/components/dashboard/TestResultsList";
import { ParsedTestResult } from "@/lib/xmlParser";
import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UploadHistory, UploadRecord } from "./UploadHistory";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TestResultsTabsProps {
  testResults: ParsedTestResult[];
  uploads?: UploadRecord[];
  onRemoveUpload?: (id: string) => void;
}

export const TestResultsTabs = ({ testResults, uploads = [], onRemoveUpload }: TestResultsTabsProps) => {
  const [visibleTables, setVisibleTables] = useState({
    recent: true,
    failed: true,
    flaky: true
  });
  
  const [displayedResults, setDisplayedResults] = useState<ParsedTestResult[]>([]);
  const [failedResults, setFailedResults] = useState<ParsedTestResult[]>([]);
  const [flakyResults, setFlakyResults] = useState<ParsedTestResult[]>([]);
  
  const [selectedTeam, setSelectedTeam] = useState<string>("all");
  const [availableTeams, setAvailableTeams] = useState<string[]>([]);
  
  useEffect(() => {
    if (testResults.length > 0) {
      const teams = new Set<string>();
      testResults.forEach(test => {
        if (test.team) {
          teams.add(test.team);
        }
      });
      setAvailableTeams(Array.from(teams).sort());
    }
  }, [testResults]);
  
  useEffect(() => {
    if (testResults.length > 0) {
      const filteredByTeam = selectedTeam === "all" 
        ? testResults 
        : testResults.filter(test => test.team === selectedTeam);
      
      const sortedResults = [...filteredByTeam].sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      
      setDisplayedResults(sortedResults.slice(0, 5));
      setFailedResults(sortedResults.filter(test => test.status === 'failed').slice(0, 5));
      setFlakyResults(sortedResults.filter(test => test.status === 'flaky').slice(0, 5));
    } else {
      setDisplayedResults([]);
      setFailedResults([]);
      setFlakyResults([]);
    }
  }, [testResults, selectedTeam]);

  return (
    <div className="space-y-4">
      <Tabs defaultValue="recent" className="w-full">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-blue-100">
          <TabsList className="w-full md:w-auto flex bg-blue-50/80 rounded-md p-1 border border-blue-200">
            <TabsTrigger 
              value="recent" 
              className="flex-1 md:flex-none px-6 py-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Recent
            </TabsTrigger>
            <TabsTrigger 
              value="failed" 
              className="flex-1 md:flex-none px-6 py-2 data-[state=active]:bg-red-600 data-[state=active]:text-white"
            >
              Failed
            </TabsTrigger>
            <TabsTrigger 
              value="flaky" 
              className="flex-1 md:flex-none px-6 py-2 data-[state=active]:bg-amber-600 data-[state=active]:text-white"
            >
              Flaky
            </TabsTrigger>
          </TabsList>
          
          {availableTeams.length > 0 && (
            <div className="flex items-center gap-2 bg-gray-50/50 p-2 rounded-md border border-gray-100">
              <div className="flex items-center gap-1.5">
                <Users size={16} className="text-blue-600" />
                <span className="text-sm font-medium text-gray-600">Filter by Team:</span>
              </div>
              <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                <SelectTrigger className="w-[180px] h-9 bg-white border-blue-100">
                  <SelectValue placeholder="Select team" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Teams</SelectItem>
                  {availableTeams.map(team => (
                    <SelectItem key={team} value={team}>{team}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <div className="mt-4 space-y-4">
          <TabsContent value="recent">
            <Card className="border-blue-100">
              <CardHeader className="pb-0 bg-gradient-to-r from-blue-50/50 to-transparent">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-xl text-blue-900">Recent Test Results</CardTitle>
                    <CardDescription>Latest test executions across all teams</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setVisibleTables(prev => ({ ...prev, recent: !prev.recent }))}
                    className="h-8 hover:bg-blue-100"
                  >
                    {visibleTables.recent ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className={cn(
                "transition-all duration-300 ease-in-out",
                visibleTables.recent ? "max-h-[350px] opacity-100" : "max-h-0 opacity-0 py-0"
              )}>
                <TestResultsList tests={displayedResults} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="failed">
            <Card className="border-red-100">
              <CardHeader className="pb-0 bg-gradient-to-r from-red-50/50 to-transparent">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-xl text-red-900">Failed Tests</CardTitle>
                    <CardDescription>Tests that did not pass</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setVisibleTables(prev => ({ ...prev, failed: !prev.failed }))}
                    className="h-8 hover:bg-red-100"
                  >
                    {visibleTables.failed ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className={cn(
                "transition-all duration-300 ease-in-out",
                visibleTables.failed ? "max-h-[350px] opacity-100" : "max-h-0 opacity-0 py-0"
              )}>
                <TestResultsList tests={failedResults} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="flaky">
            <Card className="border-amber-100">
              <CardHeader className="pb-0 bg-gradient-to-r from-amber-50/50 to-transparent">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-xl text-amber-900">Flaky Tests</CardTitle>
                    <CardDescription>Tests with inconsistent results</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setVisibleTables(prev => ({ ...prev, flaky: !prev.flaky }))}
                    className="h-8 hover:bg-amber-100"
                  >
                    {visibleTables.flaky ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className={cn(
                "transition-all duration-300 ease-in-out",
                visibleTables.flaky ? "max-h-[350px] opacity-100" : "max-h-0 opacity-0 py-0"
              )}>
                <TestResultsList tests={flakyResults} />
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>

      <UploadHistory uploads={uploads} onRemoveUpload={onRemoveUpload} />
    </div>
  );
};
