import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  BarChart3, 
  Phone, 
  PhoneCall, 
  GitBranch, 
  Users, 
  Settings, 
  CreditCard, 
  Hash, 
  Mic, 
  Brain, 
  MessageSquare, 
  Globe, 
  Server, 
  Plus, 
  FileText,
  LogOut
} from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
}

const sidebarItems = [
  { icon: Home, label: "Home", href: "/dashboard" },
  { icon: BarChart3, label: "Analytics", href: "/dashboard/analytics" },
  { icon: Phone, label: "Call Logs", href: "/dashboard/call-logs" },
  { icon: PhoneCall, label: "Send Call", href: "/dashboard/send-call" },
  { icon: GitBranch, label: "Conversational Pathways", href: "/dashboard/pathways" },
  { icon: Settings, label: "Tools", href: "/dashboard/tools" },
  { icon: CreditCard, label: "Billing & Credits", href: "/dashboard/billing" },
  { icon: Mic, label: "Voices", href: "/dashboard/voices" },
  { icon: Server, label: "Infrastructure", href: "/dashboard/infrastructure" },
  { icon: Plus, label: "Add Ons", href: "/dashboard/addons" },
  { icon: FileText, label: "Documentation", href: "/dashboard/docs" },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-[hsl(0,0%,8.2%)] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(0,0%,8.2%)] text-white">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-[hsl(0,0%,5.1%)] border-r border-white/10 min-h-screen flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-white/10">
            <div className="text-2xl font-bold">
              <span className="algo-gradient-text">Algo</span>
              <span className="text-white">®</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href;
              
              return (
                <Link key={item.href} href={item.href}>
                  <div className={`flex items-center px-3 py-2 rounded-lg transition-colors duration-200 ${
                    isActive 
                      ? "bg-[hsl(207,90%,54%)] text-white" 
                      : "text-[hsl(211,10%,64%)] hover:text-white hover:bg-white/10"
                  }`}>
                    <Icon className="w-5 h-5 mr-3" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* User Info */}
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-white">{user.name}</div>
                <div className="text-xs text-[hsl(211,10%,64%)]">{user.credits} credits</div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-[hsl(211,10%,64%)] hover:text-white"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-[hsl(0,0%,5.1%)] p-6 border-b border-white/10">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-white">Dashboard</h1>
              <div className="flex space-x-4">
                <Link href="/dashboard/send-call">
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    Send Call
                  </Button>
                </Link>
                <Link href="/dashboard/pathways">
                  <Button className="bg-[hsl(207,90%,54%)] hover:bg-[hsl(207,90%,49%)]">
                    Build Pathway
                  </Button>
                </Link>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
