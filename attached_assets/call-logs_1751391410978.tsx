import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Download, Filter } from "lucide-react";
import { auth } from "@/lib/auth";
import { useState } from "react";

export default function CallLogs() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: calls, isLoading } = useQuery({
    queryKey: ["/api/calls"],
    queryFn: async () => {
      const token = auth.getToken();
      const response = await fetch("/api/calls", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch calls");
      return response.json();
    },
  });

  const filteredCalls = calls?.filter((call: any) =>
    call.fromNumber.includes(searchTerm) ||
    call.toNumber.includes(searchTerm) ||
    call.status.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'failed':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      default:
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
    }
  };

  const formatDuration = (seconds: number) => {
    if (!seconds) return '-';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Call Logs</h1>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Search and Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[hsl(211,10%,64%)]" />
              <Input
                placeholder="Search by phone number or status..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-[hsl(211,10%,64%)]"
              />
            </div>
          </div>
          <div className="flex items-center justify-center lg:justify-end">
            <div className="text-center lg:text-right">
              <div className="text-2xl font-bold text-white">
                {calls?.length || 0}
              </div>
              <div className="text-sm text-[hsl(211,10%,64%)]">Total Calls</div>
            </div>
          </div>
        </div>

        {/* Call Logs Table */}
        <Card className="bg-[hsl(0,0%,5.1%)] border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Call History</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12">
                <div className="text-[hsl(211,10%,64%)]">Loading call logs...</div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10">
                      <TableHead className="text-[hsl(211,10%,64%)]">FROM</TableHead>
                      <TableHead className="text-[hsl(211,10%,64%)]">TO</TableHead>
                      <TableHead className="text-[hsl(211,10%,64%)]">DURATION</TableHead>
                      <TableHead className="text-[hsl(211,10%,64%)]">STATUS</TableHead>
                      <TableHead className="text-[hsl(211,10%,64%)]">CREATED</TableHead>
                      <TableHead className="text-[hsl(211,10%,64%)]">CALL ID</TableHead>
                      <TableHead className="text-[hsl(211,10%,64%)]">ACTIONS</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCalls.length > 0 ? (
                      filteredCalls.map((call: any) => (
                        <TableRow key={call.id} className="border-white/10 hover:bg-white/5">
                          <TableCell className="font-mono text-white">{call.fromNumber}</TableCell>
                          <TableCell className="font-mono text-white">{call.toNumber}</TableCell>
                          <TableCell className="text-white">{formatDuration(call.duration)}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getStatusColor(call.status)}>
                              {call.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-[hsl(211,10%,64%)]">
                            {formatDate(call.createdAt)}
                          </TableCell>
                          <TableCell>
                            <button className="text-[hsl(207,90%,54%)] hover:underline font-mono">
                              #{call.id}
                            </button>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-[hsl(211,10%,64%)] hover:text-white"
                              >
                                View
                              </Button>
                              {call.transcript && (
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="text-[hsl(211,10%,64%)] hover:text-white"
                                >
                                  Transcript
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-12">
                          <div className="text-[hsl(211,10%,64%)]">
                            {searchTerm ? "No calls match your search" : "No calls found"}
                          </div>
                          {!searchTerm && (
                            <div className="text-sm text-[hsl(211,10%,64%)] mt-2">
                              Start by sending your first call!
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
