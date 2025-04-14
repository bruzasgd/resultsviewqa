import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TestResultsList } from "@/components/dashboard/TestResultsList";
import { ParsedTestResult } from "@/lib/xmlParser";
import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Users, Filter } from "lucide-react";
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
      <div className="flex justify-between items-center w-full">
        <Tabs defaultValue="recent" className="w-full">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2 gap-2">
            <TabsList className="w-full sm:w-auto grid grid-cols-3 sm:inline-flex bg-blue-100/50 border border-blue-200">
              <TabsTrigger value="recent" className="data-[state=active]:bg-blue-200 data-[state=active]:text-blue-900">Recent Tests</TabsTrigger>
              <TabsTrigger value="failed" className="data-[state=active]:bg-blue-200 data-[state=active]:text-blue-900">Failed Tests</TabsTrigger>
              <TabsTrigger value="flaky" className="data-[state=active]:bg-blue-200 data-[state=active]:text-blue-900">Flaky Tests</TabsTrigger>
            </TabsList>
            
            {availableTeams.length > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Users size={16} className="text-blue-500" />
                  <span>Team Filter:</span>
                </div>
                <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                  <SelectTrigger className="w-[180px] h-9 bg-white border-blue-200">
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

          <TabsContent value="recent" className="mt-3 w-full">
            <Card className="border border-blue-200 w-full h-[350px]">
              <CardHeader className="pb-0 bg-gradient-to-r from-blue-50 to-white">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-slate-800">Recent Test Results</CardTitle>
                    <CardDescription>Latest test executions</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setVisibleTables(prev => ({ ...prev, recent: !prev.recent }))}
                    className="flex items-center gap-1 h-8 hover:bg-blue-100 hover:text-blue-700"
                  >
                    {visibleTables.recent ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className={cn(
                "transition-all duration-300 ease-in-out overflow-hidden px-3 pt-2 w-full",
                visibleTables.recent ? "max-h-[250px] opacity-100" : "max-h-0 opacity-0 py-0"
              )}>
                <div className="w-full overflow-x-auto">
                  <TestResultsList tests={displayedResults} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="failed" className="mt-3">
            <Card className="border border-red-100">
              <CardHeader className="pb-0 bg-gradient-to-r from-red-50 to-white">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-slate-800">Failed Tests</CardTitle>
                    <CardDescription>Tests that did not pass</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setVisibleTables(prev => ({ ...prev, failed: !prev.failed }))}
                    className="flex items-center gap-1 h-8 hover:bg-red-100 hover:text-red-700"
                  >
                    {visibleTables.failed ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className={cn(
                "transition-all duration-300 ease-in-out overflow-hidden px-3 pt-2 w-full",
                visibleTables.failed ? "max-h-[450px] opacity-100" : "max-h-0 opacity-0 py-0"
              )}>
                <div className="w-full overflow-x-auto">
                  <TestResultsList tests={failedResults} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="flaky" className="mt-3">
            <Card className="border border-blue-200">
              <CardHeader className="pb-0 bg-gradient-to-r from-blue-50 to-white">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-slate-800">Flaky Tests</CardTitle>
                    <CardDescription>Tests with inconsistent results</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setVisibleTables(prev => ({ ...prev, flaky: !prev.flaky }))}
                    className="flex items-center gap-1 h-8 hover:bg-blue-100 hover:text-blue-700"
                  >
                    {visibleTables.flaky ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className={cn(
                "transition-all duration-300 ease-in-out overflow-hidden px-3 pt-2 w-full",
                visibleTables.flaky ? "max-h-[450px] opacity-100" : "max-h-0 opacity-0 py-0"
              )}>
                <div className="w-full overflow-x-auto">
                  <TestResultsList tests={flakyResults} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <UploadHistory uploads={uploads} onRemoveUpload={onRemoveUpload} />
    </div>
  );
};
