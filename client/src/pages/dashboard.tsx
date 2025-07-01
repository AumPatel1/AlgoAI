import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Phone, 
  PhoneCall, 
  TrendingUp, 
  CreditCard, 
  Bot, 
  User,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";

export default function Dashboard() {
  const { data: statsData } = useQuery({
    queryKey: ["/api/analytics/stats"],
  });

  const { data: callsData } = useQuery({
    queryKey: ["/api/calls"],
  });

  const { data: activeCallsData } = useQuery({
    queryKey: ["/api/calls/active"],
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  const stats = statsData || { totalCalls: 0, activeCalls: 0, successRate: 0, creditsUsed: 0 };
  const recentCalls = callsData?.calls?.slice(0, 5) || [];
  const activeCalls = activeCallsData?.calls || [];

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
        return <AlertCircle className="w-4 h-4 text-blue-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-400/20 text-green-400">Completed</Badge>;
      case 'failed':
        return <Badge variant="destructive" className="bg-red-400/20 text-red-400">Failed</Badge>;
      case 'in-progress':
        return <Badge variant="default" className="bg-blue-400/20 text-blue-400">In Progress</Badge>;
      case 'ringing':
        return <Badge variant="default" className="bg-yellow-400/20 text-yellow-400">Ringing</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-[hsl(0,0%,5.1%)] border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[hsl(211,10%,64%)] text-sm">Total Calls</p>
                  <p className="text-2xl font-bold text-white">{stats.totalCalls}</p>
                </div>
                <div className="w-12 h-12 bg-[hsl(207,90%,54%)]/20 rounded-lg flex items-center justify-center">
                  <Phone className="w-6 h-6 text-[hsl(207,90%,54%)]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[hsl(0,0%,5.1%)] border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[hsl(211,10%,64%)] text-sm">Active Calls</p>
                  <p className="text-2xl font-bold text-green-400">{stats.activeCalls}</p>
                </div>
                <div className="w-12 h-12 bg-green-400/20 rounded-lg flex items-center justify-center">
                  <PhoneCall className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[hsl(0,0%,5.1%)] border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[hsl(211,10%,64%)] text-sm">Success Rate</p>
                  <p className="text-2xl font-bold text-[hsl(271,91%,65%)]">{stats.successRate}%</p>
                </div>
                <div className="w-12 h-12 bg-[hsl(271,91%,65%)]/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-[hsl(271,91%,65%)]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[hsl(0,0%,5.1%)] border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[hsl(211,10%,64%)] text-sm">Credits Used</p>
                  <p className="text-2xl font-bold text-[hsl(24,100%,58%)]">{stats.creditsUsed}</p>
                </div>
                <div className="w-12 h-12 bg-[hsl(24,100%,58%)]/20 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-[hsl(24,100%,58%)]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Calls Alert */}
        {activeCalls.length > 0 && (
          <Card className="bg-[hsl(207,90%,54%)]/10 border-[hsl(207,90%,54%)]/20">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-[hsl(207,90%,54%)] rounded-full animate-pulse"></div>
                <span className="text-[hsl(207,90%,54%)] font-medium">
                  {activeCalls.length} active call{activeCalls.length > 1 ? 's' : ''} in progress
                </span>
                <Link href="/dashboard/call-logs">
                  <Button variant="outline" size="sm" className="border-[hsl(207,90%,54%)] text-[hsl(207,90%,54%)]">
                    Monitor
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-[hsl(0,0%,5.1%)] border-white/10">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/dashboard/send-call">
                <Button className="w-full bg-gradient-to-r from-[hsl(207,90%,54%)] to-[hsl(271,91%,65%)] hover:from-[hsl(207,90%,49%)] hover:to-[hsl(271,91%,60%)] text-white">
                  <PhoneCall className="w-5 h-5 mr-2" />
                  Start New Call
                </Button>
              </Link>
              <Link href="/dashboard/call-logs">
                <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                  <Phone className="w-5 h-5 mr-2" />
                  View Call History
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Integration Status */}
          <Card className="bg-[hsl(0,0%,5.1%)] border-white/10">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-white">System Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm text-white">Twilio Integration</span>
                </div>
                <span className="text-sm text-green-400">Connected</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm text-white">OpenAI Integration</span>
                </div>
                <span className="text-sm text-green-400">Connected</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm text-white">Webhook Status</span>
                </div>
                <span className="text-sm text-green-400">Active</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Calls */}
        <Card className="bg-[hsl(0,0%,5.1%)] border-white/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold text-white">Recent Calls</CardTitle>
              <Link href="/dashboard/call-logs">
                <Button variant="ghost" className="text-[hsl(207,90%,54%)] hover:text-[hsl(207,90%,49%)]">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentCalls.length === 0 ? (
              <div className="text-center py-8">
                <Phone className="w-12 h-12 text-[hsl(211,10%,64%)] mx-auto mb-4" />
                <p className="text-[hsl(211,10%,64%)]">No calls yet. Start your first AI call!</p>
                <Link href="/dashboard/send-call">
                  <Button className="mt-4 bg-[hsl(207,90%,54%)] hover:bg-[hsl(207,90%,49%)]">
                    Make Your First Call
                  </Button>
                </Link>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10">
                    <TableHead className="text-[hsl(211,10%,64%)]">Phone Number</TableHead>
                    <TableHead className="text-[hsl(211,10%,64%)]">Duration</TableHead>
                    <TableHead className="text-[hsl(211,10%,64%)]">Status</TableHead>
                    <TableHead className="text-[hsl(211,10%,64%)]">AI Model</TableHead>
                    <TableHead className="text-[hsl(211,10%,64%)]">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentCalls.map((call: any) => (
                    <TableRow key={call.id} className="border-white/5 hover:bg-white/5">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(call.status)}
                          <span className="font-medium text-white">{call.phoneNumber}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-[hsl(211,10%,64%)]">
                        {call.duration ? formatDuration(call.duration) : '0:00'}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(call.status)}
                      </TableCell>
                      <TableCell className="text-[hsl(211,10%,64%)]">{call.aiModel}</TableCell>
                      <TableCell className="text-[hsl(211,10%,64%)]">
                        {format(new Date(call.startedAt), 'MMM dd, HH:mm')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
