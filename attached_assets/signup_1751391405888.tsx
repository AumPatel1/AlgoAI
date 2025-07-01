import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

export default function Signup() {
  const [, setLocation] = useLocation();
  const { signup } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signup(formData.name, formData.email, formData.password);
      toast({
        title: "Account created!",
        description: "Welcome to Algo AI. You've been automatically signed in.",
      });
      setLocation("/dashboard");
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message || "Unable to create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-[hsl(0,0%,8.2%)] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-[hsl(0,0%,5.1%)] border-white/10">
        <CardHeader className="text-center">
          <div className="text-2xl font-bold mb-2">
            <span className="algo-gradient-text">Algo</span>
            <span className="text-white">®</span>
          </div>
          <CardTitle className="text-white">Create your account</CardTitle>
          <CardDescription className="text-[hsl(211,10%,64%)]">
            Get started with Algo AI today
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">Full Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                className="bg-white/10 border-white/20 text-white placeholder:text-[hsl(211,10%,64%)]"
                placeholder="Enter your full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="bg-white/10 border-white/20 text-white placeholder:text-[hsl(211,10%,64%)]"
                placeholder="Enter your email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="bg-white/10 border-white/20 text-white placeholder:text-[hsl(211,10%,64%)]"
                placeholder="Create a password"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-[hsl(207,90%,54%)] hover:bg-[hsl(207,90%,49%)]"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-[hsl(211,10%,64%)]">
              Already have an account?{" "}
              <Link href="/login" className="text-[hsl(207,90%,54%)] hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
