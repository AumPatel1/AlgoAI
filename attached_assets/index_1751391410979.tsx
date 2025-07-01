import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { auth } from "@/lib/auth";

// Mock data for the chart
const chartData = [
  { name: "Jan", calls: 120 },
  { name: "Feb", calls: 190 },
  { name: "Mar", calls: 300 },
  { name: "Apr", calls: 500 },
  { name: "May", calls: 420 },
  { name: "Jun", calls: 680 },
];

export default function Dashboard() {
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

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Main Widget - US Map Placeholder */}
        <Card className="bg-[hsl(0,0%,5.1%)] border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Call Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gradient-to-br from-[hsl(200,80%,69%)]/20 via-[hsl(262,83%,70%)]/20 to-[hsl(25,95%,53%)]/20 rounded-lg flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-4xl mb-2">🗺️</div>
                <p className="text-[hsl(211,10%,64%)]">United States Call Visualization</p>
                <p className="text-sm text-[hsl(211,10%,64%)] mt-1">Interactive map coming soon</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Call Volume Chart */}
          <div className="lg:col-span-2">
            <Card className="bg-[hsl(0,0%,5.1%)] border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Call Volume Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.6)" />
                    <YAxis stroke="rgba(255,255,255,0.6)" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(0,0%,5.1%)', 
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        color: 'white'
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="calls" 
                      stroke="hsl(207,90%,54%)" 
                      strokeWidth={3}
                      dot={{ fill: 'hsl(207,90%,54%)', strokeWidth: 2, r: 4 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions Panel */}
          <div>
            <Card className="bg-[hsl(0,0%,5.1%)] border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-white/5 rounded-lg border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                  <div className="font-medium text-white">Conversational Pathways</div>
                  <div className="text-sm text-[hsl(211,10%,64%)]">Build AI conversation flows</div>
                </div>
                <div className="p-3 bg-white/5 rounded-lg border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                  <div className="font-medium text-white">Send Phone Call</div>
                  <div className="text-sm text-[hsl(211,10%,64%)]">Make an AI call now</div>
                </div>
                <div className="p-3 bg-white/5 rounded-lg border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                  <div className="font-medium text-white">Send Bulk Calls</div>
                  <div className="text-sm text-[hsl(211,10%,64%)]">Batch call processing</div>
                </div>
                <div className="p-3 bg-white/5 rounded-lg border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                  <div className="font-medium text-white">Buy Phone Number</div>
                  <div className="text-sm text-[hsl(211,10%,64%)]">Get a new number</div>
                </div>
                <div className="p-3 bg-white/5 rounded-lg border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                  <div className="font-medium text-white">Voices & Voice Cloning</div>
                  <div className="text-sm text-[hsl(211,10%,64%)]">Customize AI voices</div>
                </div>
                <div className="p-3 bg-white/5 rounded-lg border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                  <div className="font-medium text-white">Billing & Credits</div>
                  <div className="text-sm text-[hsl(211,10%,64%)]">Manage your account</div>
                </div>
                <div className="p-3 bg-white/5 rounded-lg border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                  <div className="font-medium text-white">Algo University</div>
                  <div className="text-sm text-[hsl(211,10%,64%)]">Learn and documentation</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call Log Table */}
        <Card className="bg-[hsl(0,0%,5.1%)] border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Recent Call Logs</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-[hsl(211,10%,64%)]">Loading calls...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10">
                    <TableHead className="text-[hsl(211,10%,64%)]">FROM</TableHead>
                    <TableHead className="text-[hsl(211,10%,64%)]">TO</TableHead>
                    <TableHead className="text-[hsl(211,10%,64%)]">DURATION</TableHead>
                    <TableHead className="text-[hsl(211,10%,64%)]">STATUS</TableHead>
                    <TableHead className="text-[hsl(211,10%,64%)]">CREATED</TableHead>
                    <TableHead className="text-[hsl(211,10%,64%)]">CALL ID</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {calls && calls.length > 0 ? (
                    calls.slice(0, 10).map((call: any) => (
                      <TableRow key={call.id} className="border-white/10">
                        <TableCell className="text-white">{call.fromNumber}</TableCell>
                        <TableCell className="text-white">{call.toNumber}</TableCell>
                        <TableCell className="text-white">
                          {call.duration ? `${Math.floor(call.duration / 60)}:${(call.duration % 60).toString().padStart(2, '0')}` : '-'}
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            call.status === 'completed' 
                              ? 'bg-green-500/20 text-green-400' 
                              : call.status === 'failed'
                              ? 'bg-red-500/20 text-red-400'
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {call.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-[hsl(211,10%,64%)]">
                          {new Date(call.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <button className="text-[hsl(207,90%,54%)] hover:underline">
                            #{call.id}
                          </button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-[hsl(211,10%,64%)]">
                        No calls yet. Start by sending your first call!
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
