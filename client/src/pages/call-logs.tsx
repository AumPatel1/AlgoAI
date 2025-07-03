import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Phone, 
  PhoneCall, 
  Search,
  Filter,
  Download,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Bot,
  User,
  Play
} from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

export default function CallLogs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: callsData, isLoading } = useQuery({
    queryKey: ["/api/calls"],
    refetchInterval: 5000, // Refresh every 5 seconds for active calls
  });

  const { data: activeCallsData } = useQuery({
    queryKey: ["/api/calls/active"],
    refetchInterval: 2000, // More frequent refresh for active calls
  });

  const calls = callsData?.calls || [];
  const activeCalls = activeCallsData?.calls || [];

  const filteredCalls = calls.filter((call: any) => {
    const matchesSearch = call.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         call.objective?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || call.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'failed':
      case 'busy':
      case 'no-answer':
        return <XCircle className="w-4 h-4 text-red-400" />;
      case 'in-progress':
      case 'ringing':
        return <AlertCircle className="w-4 h-4 text-blue-400 animate-pulse" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-400/20 text-green-400 border-green-400/30">Completed</Badge>;
      case 'failed':
        return <Badge className="bg-red-400/20 text-red-400 border-red-400/30">Failed</Badge>;
      case 'busy':
        return <Badge className="bg-orange-400/20 text-orange-400 border-orange-400/30">Busy</Badge>;
      case 'no-answer':
        return <Badge className="bg-yellow-400/20 text-yellow-400 border-yellow-400/30">No Answer</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-400/20 text-blue-400 border-blue-400/30 animate-pulse">In Progress</Badge>;
      case 'ringing':
        return <Badge className="bg-purple-400/20 text-purple-400 border-purple-400/30 animate-pulse">Ringing</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDuration = (seconds: number) => {
    if (!seconds || seconds === 0) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getCreditsUsed = (call: any) => {
    // Simple calculation based on duration (1 credit per minute)
    if (call.status === 'completed' && call.duration) {
      return Math.ceil(call.duration / 60);
    }
    return 0;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Call Logs</h1>
            <p className="text-[hsl(211,10%,64%)] mt-2">
              Monitor and review all your AI-powered phone calls
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" className="border-[hsl(271,91%,65%)] bg-[hsl(271,91%,65%)]/10 text-[hsl(271,91%,65%)] hover:bg-[hsl(271,91%,65%)]/20 hover:border-[hsl(271,91%,60%)]">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Active Calls Alert */}
        {activeCalls.length > 0 && (
          <Card className="bg-[hsl(207,90%,54%)]/10 border-[hsl(207,90%,54%)]/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-[hsl(207,90%,54%)] rounded-full animate-pulse"></div>
                  <span className="text-[hsl(207,90%,54%)] font-medium">
                    {activeCalls.length} active call{activeCalls.length > 1 ? 's' : ''} in progress
                  </span>
                </div>
                <div className="flex space-x-2">
                  {activeCalls.map((call: any) => (
                    <Badge key={call.id} className="bg-[hsl(207,90%,54%)]/20 text-[hsl(207,90%,54%)]">
                      {call.phoneNumber}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <Card className="bg-[hsl(0,0%,5.1%)] border-white/10">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[hsl(211,10%,64%)]" />
                <Input
                  placeholder="Search by phone number or objective..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-[hsl(0,0%,8.2%)] border-white/20 text-white placeholder-[hsl(211,10%,64%)]"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-[hsl(211,10%,64%)]" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 bg-[hsl(0,0%,8.2%)] border border-white/20 rounded-lg text-white focus:outline-none focus:border-[hsl(207,90%,54%)]"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="in-progress">In Progress</option>
                  <option value="ringing">Ringing</option>
                  <option value="failed">Failed</option>
                  <option value="busy">Busy</option>
                  <option value="no-answer">No Answer</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Calls Table */}
        <Card className="bg-[hsl(0,0%,5.1%)] border-white/10">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-white">
              Call History ({filteredCalls.length} calls)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[hsl(207,90%,54%)] mx-auto"></div>
                <p className="text-[hsl(211,10%,64%)] mt-2">Loading calls...</p>
              </div>
            ) : filteredCalls.length === 0 ? (
              <div className="text-center py-8">
                <Phone className="w-12 h-12 text-[hsl(211,10%,64%)] mx-auto mb-4" />
                <p className="text-[hsl(211,10%,64%)]">
                  {searchTerm || statusFilter !== "all" 
                    ? "No calls match your search criteria"
                    : "No calls found. Start your first AI call!"
                  }
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10">
                      <TableHead className="text-[hsl(211,10%,64%)]">Phone Number</TableHead>
                      <TableHead className="text-[hsl(211,10%,64%)]">Duration</TableHead>
                      <TableHead className="text-[hsl(211,10%,64%)]">Status</TableHead>
                      <TableHead className="text-[hsl(211,10%,64%)]">AI Model</TableHead>
                      <TableHead className="text-[hsl(211,10%,64%)]">Voice</TableHead>
                      <TableHead className="text-[hsl(211,10%,64%)]">Credits</TableHead>
                      <TableHead className="text-[hsl(211,10%,64%)]">Started</TableHead>
                      <TableHead className="text-[hsl(211,10%,64%)]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCalls.map((call: any) => (
                      <TableRow key={call.id} className="border-white/5 hover:bg-white/5">
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            {getStatusIcon(call.status)}
                            <div>
                              <div className="font-medium text-white">{call.phoneNumber}</div>
                              {call.objective && (
                                <div className="text-xs text-[hsl(211,10%,64%)] truncate max-w-32">
                                  {call.objective}
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-[hsl(211,10%,64%)]">
                          {formatDuration(call.duration)}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(call.status)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Bot className="w-3 h-3 text-[hsl(207,90%,54%)]" />
                            <span className="text-sm text-[hsl(211,10%,64%)]">{call.aiModel}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <PhoneCall className="w-3 h-3 text-[hsl(271,91%,65%)]" />
                            <span className="text-sm text-[hsl(211,10%,64%)] capitalize">{call.voice}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-[hsl(24,100%,58%)]">
                            {getCreditsUsed(call)}
                          </span>
                        </TableCell>
                        <TableCell className="text-[hsl(211,10%,64%)]">
                          <div className="text-sm">
                            {format(new Date(call.startedAt), 'MMM dd, yyyy')}
                          </div>
                          <div className="text-xs text-[hsl(211,10%,64%)]">
                            {format(new Date(call.startedAt), 'HH:mm')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {call.conversation && call.conversation.length > 0 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-[hsl(207,90%,54%)] hover:text-[hsl(207,90%,49%)] p-1"
                                title="View Conversation"
                              >
                                <Play className="w-3 h-3" />
                              </Button>
                            )}
                            {(call.status === 'in-progress' || call.status === 'ringing') && (
                              <Badge className="bg-blue-400/20 text-blue-400 text-xs px-2 py-1">
                                LIVE
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
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
