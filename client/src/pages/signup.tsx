import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, UserPlus, Mail, User } from "lucide-react";

export default function Signup() {
  const [, setLocation] = useLocation();
  const { signup, isLoading } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    try {
      await signup({
        name: formData.name,
        email: formData.email,
        username: formData.username,
        password: formData.password,
      });
      toast({
        title: "Account Created",
        description: "Welcome to Algo AI! Your account has been created successfully.",
      });
      setLocation("/dashboard");
    } catch (error: any) {
      toast({
        title: "Signup Failed",
        description: error.message || "Failed to create account",
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
          <p className="text-[hsl(211,10%,64%)] mt-2">Create your account</p>
        </div>

        <Card className="bg-[hsl(0,0%,5.1%)] border-white/10">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white text-center">
              Sign Up
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-[hsl(211,10%,64%)]">
                  Full Name
                </Label>
                <div className="relative mt-2">
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-[hsl(0,0%,8.2%)] border-white/20 text-white placeholder-[hsl(211,10%,64%)] focus:border-[hsl(207,90%,54%)] pl-10"
                    placeholder="Enter your full name"
                    required
                    disabled={isLoading}
                  />
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[hsl(211,10%,64%)]" />
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="text-sm font-medium text-[hsl(211,10%,64%)]">
                  Email Address
                </Label>
                <div className="relative mt-2">
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-[hsl(0,0%,8.2%)] border-white/20 text-white placeholder-[hsl(211,10%,64%)] focus:border-[hsl(207,90%,54%)] pl-10"
                    placeholder="Enter your email"
                    required
                    disabled={isLoading}
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[hsl(211,10%,64%)]" />
                </div>
              </div>

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
                  placeholder="Choose a username"
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
                    placeholder="Create a password"
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

              <div>
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-[hsl(211,10%,64%)]">
                  Confirm Password
                </Label>
                <div className="relative mt-2">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="bg-[hsl(0,0%,8.2%)] border-white/20 text-white placeholder-[hsl(211,10%,64%)] focus:border-[hsl(207,90%,54%)] pr-10"
                    placeholder="Confirm your password"
                    required
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[hsl(211,10%,64%)] hover:text-white"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <UserPlus className="w-4 h-4" />
                    <span>Create Account</span>
                  </div>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-[hsl(211,10%,64%)]">
                Already have an account?{" "}
                <Link href="/login" className="text-[hsl(207,90%,54%)] hover:text-[hsl(207,90%,49%)] font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
