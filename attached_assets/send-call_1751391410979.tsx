import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/lib/auth";
import { Phone, Clock, Mic } from "lucide-react";

export default function SendCall() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    fromNumber: "+13372704657", // Fixed Twilio number
    toNumber: "",
    prompt: "Hello, this is Algo AI calling. How can I help you today?",
    voice: "Polly.Joanna-Neural",
  });

  const createCallMutation = useMutation({
    mutationFn: async (callData: any) => {
      const token = auth.getToken();
      const response = await fetch("/api/calls", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fromNumber: callData.fromNumber,
          toNumber: callData.toNumber,
          metadata: {
            prompt: callData.prompt,
            voice: callData.voice,
          },
        }),
      });

      if (!response.ok) throw new Error("Failed to create call");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Call initiated!",
        description: "Your AI call has been started successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/calls"] });
      setFormData({
        fromNumber: "+13372704657", // Keep Twilio number
        toNumber: "",
        prompt: "Hello, this is Algo AI calling. How can I help you today?",
        voice: "Polly.Joanna-Neural",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to send call",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCallMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Send AI Call</h1>
          <p className="text-[hsl(211,10%,64%)] mb-4">
            Create and send an AI-powered phone call with custom instructions
          </p>
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-center justify-center text-blue-400 mb-2">
              <Phone className="w-5 h-5 mr-2" />
              <span className="font-semibold">Real Twilio Integration Active</span>
            </div>
            <p className="text-sm text-blue-300">
              This will make actual phone calls using Twilio (+13372704657) with OpenAI-powered conversations
            </p>
          </div>
        </div>

        <Card className="bg-[hsl(0,0%,5.1%)] border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Phone className="w-5 h-5 mr-2" />
              Call Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fromNumber" className="text-white">From Number (Twilio)</Label>
                  <Input
                    id="fromNumber"
                    name="fromNumber"
                    type="tel"
                    value={formData.fromNumber}
                    readOnly
                    className="bg-white/5 border-white/10 text-gray-400 cursor-not-allowed"
                  />
                  <p className="text-xs text-[hsl(211,10%,64%)]">Your verified Twilio phone number</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="toNumber" className="text-white">To Number</Label>
                  <Input
                    id="toNumber"
                    name="toNumber"
                    type="tel"
                    value={formData.toNumber}
                    onChange={handleChange}
                    placeholder="+1 (555) 987-6543"
                    className="bg-white/10 border-white/20 text-white placeholder:text-[hsl(211,10%,64%)]"
                    required
                  />
                  <p className="text-xs text-[hsl(211,10%,64%)]">The phone number to call</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="prompt" className="text-white">AI Instructions</Label>
                <Textarea
                  id="prompt"
                  name="prompt"
                  rows={6}
                  value={formData.prompt}
                  onChange={handleChange}
                  placeholder="Describe what the AI should say and how it should behave during the call. For example: 'You are a friendly customer service representative calling to confirm an appointment. Be polite and professional.'"
                  className="bg-white/10 border-white/20 text-white placeholder:text-[hsl(211,10%,64%)] resize-none"
                  required
                />
                <p className="text-xs text-[hsl(211,10%,64%)]">Provide clear instructions for the AI agent</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="voice" className="text-white">Voice Selection</Label>
                <select
                  id="voice"
                  name="voice"
                  value={formData.voice}
                  onChange={handleChange}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white"
                >
                  <option value="default">Default (Professional)</option>
                  <option value="friendly">Friendly</option>
                  <option value="formal">Formal</option>
                  <option value="casual">Casual</option>
                </select>
                <p className="text-xs text-[hsl(211,10%,64%)]">Choose the tone and style for the AI voice</p>
              </div>

              <div className="pt-4 border-t border-white/10">
                <Button
                  type="submit"
                  disabled={createCallMutation.isPending}
                  className="w-full bg-[hsl(207,90%,54%)] hover:bg-[hsl(207,90%,49%)] text-white font-medium py-3"
                >
                  {createCallMutation.isPending ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Initiating Call...
                    </>
                  ) : (
                    <>
                      <Phone className="w-4 h-4 mr-2" />
                      Send Call Now
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Quick Tips */}
        <Card className="bg-[hsl(0,0%,5.1%)] border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Mic className="w-5 h-5 mr-2" />
              Pro Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-[hsl(207,90%,54%)] rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="text-white font-medium">Be specific with instructions</p>
                <p className="text-sm text-[hsl(211,10%,64%)]">
                  The more detailed your prompt, the better the AI will perform
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-[hsl(207,90%,54%)] rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="text-white font-medium">Include conversation goals</p>
                <p className="text-sm text-[hsl(211,10%,64%)]">
                  Define what you want to achieve: appointment booking, information gathering, etc.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-[hsl(207,90%,54%)] rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="text-white font-medium">Set the right tone</p>
                <p className="text-sm text-[hsl(211,10%,64%)]">
                  Match the voice and style to your brand and the call purpose
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
