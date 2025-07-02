import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import SendCall from "@/pages/send-call";
import CallLogs from "@/pages/call-logs";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import Home from "@/pages/home";
import ComingSoon from "@/pages/coming-soon";
import Pathways from "@/pages/pathways";
import PathwayEditor from "@/pages/pathway-editor";
import Documentation from "@/pages/documentation";
import { useEffect } from "react";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      setLocation("/login");
    }
  }, [user, isLoading, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[hsl(0,0%,3.9%)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[hsl(207,90%,54%)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <Component />;
}

function PublicRoute({ component: Component, restricted = false }: { component: React.ComponentType, restricted?: boolean }) {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && user && restricted) {
      setLocation("/dashboard");
    }
  }, [user, isLoading, setLocation, restricted]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[hsl(0,0%,3.9%)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[hsl(207,90%,54%)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => <PublicRoute component={Home} />} />
      <Route path="/dashboard" component={() => <ProtectedRoute component={Dashboard} />} />
      <Route path="/dashboard/send-call" component={() => <ProtectedRoute component={SendCall} />} />
      <Route path="/dashboard/call-logs" component={() => <ProtectedRoute component={CallLogs} />} />
      <Route path="/dashboard/analytics" component={() => <ProtectedRoute component={ComingSoon} />} />
      <Route path="/dashboard/pathways" component={() => <ProtectedRoute component={Pathways} />} />
      <Route path="/dashboard/pathways/new" component={() => <ProtectedRoute component={PathwayEditor} />} />
      <Route path="/dashboard/pathways/edit/:id" component={() => <ProtectedRoute component={PathwayEditor} />} />
      <Route path="/dashboard/tools" component={() => <ProtectedRoute component={ComingSoon} />} />
      <Route path="/dashboard/billing" component={() => <ProtectedRoute component={ComingSoon} />} />
      <Route path="/dashboard/voices" component={() => <ProtectedRoute component={ComingSoon} />} />
      <Route path="/dashboard/infrastructure" component={() => <ProtectedRoute component={ComingSoon} />} />
      <Route path="/dashboard/addons" component={() => <ProtectedRoute component={ComingSoon} />} />
      <Route path="/dashboard/docs" component={() => <ProtectedRoute component={Documentation} />} />
      <Route path="/login" component={() => <PublicRoute component={Login} restricted />} />
      <Route path="/signup" component={() => <PublicRoute component={Signup} restricted />} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
