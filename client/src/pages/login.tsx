import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, LogIn } from "lucide-react";

export default function Login() {
  const [, setLocation] = useLocation();
  const { login, isLoading } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login(formData.username, formData.password);
      toast({
        title: "Login Successful",
        description: "Welcome back to Algo AI!",
      });
      setLocation("/dashboard");
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[hsl(0,0%,8.2%)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/">
            <div className="text-4xl font-bold cursor-pointer">
              <span className="algo-gradient-text">Algo</span>
              <span className="text-white">®</span>
            </div>
          </Link>
          <p className="text-[hsl(211,10%,64%)] mt-2">Sign in to your account</p>
        </div>

        <Card className="bg-[hsl(0,0%,5.1%)] border-white/10">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white text-center">
              Sign In
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="username" className="text-sm font-medium text-[hsl(211,10%,64%)]">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="mt-2 bg-[hsl(0,0%,8.2%)] border-white/20 text-white placeholder-[hsl(211,10%,64%)] focus:border-[hsl(207,90%,54%)]"
                  placeholder="Enter your username"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-sm font-medium text-[hsl(211,10%,64%)]">
                  Password
                </Label>
                <div className="relative mt-2">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="bg-[hsl(0,0%,8.2%)] border-white/20 text-white placeholder-[hsl(211,10%,64%)] focus:border-[hsl(207,90%,54%)] pr-10"
                    placeholder="Enter your password"
                    required
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[hsl(211,10%,64%)] hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[hsl(207,90%,54%)] to-[hsl(271,91%,65%)] hover:from-[hsl(207,90%,49%)] hover:to-[hsl(271,91%,60%)] text-white font-semibold py-3"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Signing In...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <LogIn className="w-4 h-4" />
                    <span>Sign In</span>
                  </div>
                )}
              </Button>
            </form>



            <div className="mt-6 text-center">
              <p className="text-sm text-[hsl(211,10%,64%)]">
                Don't have an account?{" "}
                <Link href="/signup" className="text-[hsl(207,90%,54%)] hover:text-[hsl(207,90%,49%)] font-medium">
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
