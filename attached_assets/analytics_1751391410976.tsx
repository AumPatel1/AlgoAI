import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

const callData = [
  { month: "Jan", calls: 120, successful: 108, failed: 12 },
  { month: "Feb", calls: 190, successful: 171, failed: 19 },
  { month: "Mar", calls: 300, successful: 285, failed: 15 },
  { month: "Apr", calls: 500, successful: 475, failed: 25 },
  { month: "May", calls: 420, successful: 397, failed: 23 },
  { month: "Jun", calls: 680, successful: 646, failed: 34 },
];

const statusData = [
  { name: "Completed", value: 1882, color: "hsl(142, 76%, 36%)" },
  { name: "Failed", value: 128, color: "hsl(0, 84%, 60%)" },
  { name: "Pending", value: 45, color: "hsl(48, 96%, 53%)" },
];

const durationData = [
  { time: "00:00", avgDuration: 45 },
  { time: "04:00", avgDuration: 38 },
  { time: "08:00", avgDuration: 62 },
  { time: "12:00", avgDuration: 78 },
  { time: "16:00", avgDuration: 85 },
  { time: "20:00", avgDuration: 52 },
];

export default function Analytics() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Analytics</h1>
          <div className="text-sm text-[hsl(211,10%,64%)]">Last 30 days</div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-[hsl(0,0%,5.1%)] border-white/10">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-white">2,055</div>
              <div className="text-sm text-[hsl(211,10%,64%)]">Total Calls</div>
              <div className="text-xs text-green-400 mt-1">+12.5% from last month</div>
            </CardContent>
          </Card>
          
          <Card className="bg-[hsl(0,0%,5.1%)] border-white/10">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-white">91.6%</div>
              <div className="text-sm text-[hsl(211,10%,64%)]">Success Rate</div>
              <div className="text-xs text-green-400 mt-1">+2.1% from last month</div>
            </CardContent>
          </Card>
          
          <Card className="bg-[hsl(0,0%,5.1%)] border-white/10">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-white">1m 23s</div>
              <div className="text-sm text-[hsl(211,10%,64%)]">Avg Duration</div>
              <div className="text-xs text-red-400 mt-1">-5.2% from last month</div>
            </CardContent>
          </Card>
          
          <Card className="bg-[hsl(0,0%,5.1%)] border-white/10">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-white">$184.95</div>
              <div className="text-sm text-[hsl(211,10%,64%)]">Total Cost</div>
              <div className="text-xs text-green-400 mt-1">-8.3% from last month</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Call Volume Chart */}
          <Card className="bg-[hsl(0,0%,5.1%)] border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Call Volume Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={callData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.6)" />
                  <YAxis stroke="rgba(255,255,255,0.6)" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(0,0%,5.1%)', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: 'white'
                    }} 
                  />
                  <Bar dataKey="successful" fill="hsl(142, 76%, 36%)" name="Successful" />
                  <Bar dataKey="failed" fill="hsl(0, 84%, 60%)" name="Failed" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Call Status Distribution */}
          <Card className="bg-[hsl(0,0%,5.1%)] border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Call Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(0,0%,5.1%)', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: 'white'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center space-x-6 mt-4">
                {statusData.map((entry, index) => (
                  <div key={index} className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: entry.color }}
                    ></div>
                    <span className="text-sm text-[hsl(211,10%,64%)]">
                      {entry.name}: {entry.value}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Average Duration by Time */}
        <Card className="bg-[hsl(0,0%,5.1%)] border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Average Call Duration by Time of Day</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={durationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="time" stroke="rgba(255,255,255,0.6)" />
                <YAxis stroke="rgba(255,255,255,0.6)" label={{ value: 'Duration (seconds)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: 'rgba(255,255,255,0.6)' } }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(0,0%,5.1%)', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'white'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="avgDuration" 
                  stroke="hsl(207,90%,54%)" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(207,90%,54%)', strokeWidth: 2, r: 4 }}
                  name="Avg Duration"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
