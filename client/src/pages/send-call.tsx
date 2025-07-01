import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { PhoneCall, Bot, Mic, Globe, Phone } from "lucide-react";
import { useLocation } from "wouter";

export default function SendCall() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    phoneNumber: '',
    aiModel: 'gpt-4o',
    voice: 'alloy',
    objective: ''
  });

  const [callStatus, setCallStatus] = useState<{
    status: 'idle' | 'initiating' | 'ringing' | 'in-progress' | 'completed' | 'failed';
    message?: string;
    callId?: number;
  }>({ status: 'idle' });

  const makeCallMutation = useMutation({
    mutationFn: async (callData: typeof formData) => {
      const response = await apiRequest("POST", "/api/calls", callData);
      return response.json();
    },
    onSuccess: (data) => {
      setCallStatus({ 
        status: 'ringing', 
        message: 'Call initiated successfully', 
        callId: data.call.id 
      });
      
      toast({
        title: "Call Initiated",
        description: `Calling ${formData.phoneNumber}...`,
      });

      queryClient.invalidateQueries({ queryKey: ["/api/calls"] });
      queryClient.invalidateQueries({ queryKey: ["/api/calls/active"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/stats"] });

      // Navigate to call logs to monitor the call
      setTimeout(() => {
        setLocation("/dashboard/call-logs");
      }, 2000);
    },
    onError: (error: any) => {
      setCallStatus({ 
        status: 'failed', 
        message: error.message || 'Failed to initiate call' 
      });
      
      toast({
        title: "Call Failed",
        description: error.message || "Failed to initiate call. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.phoneNumber) {
      toast({
        title: "Invalid Input",
        description: "Please enter a phone number.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.objective) {
      toast({
        title: "Invalid Input", 
        description: "Please enter a call objective.",
        variant: "destructive",
      });
      return;
    }

    setCallStatus({ status: 'initiating' });
    makeCallMutation.mutate(formData);
  };

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Format as +1 (XXX) XXX-XXXX
    if (digits.length >= 10) {
      const countryCode = digits.length === 11 && digits.startsWith('1') ? '1' : '1';
      const areaCode = digits.slice(-10, -7);
      const exchange = digits.slice(-7, -4);
      const number = digits.slice(-4);
      
      return `+${countryCode} (${areaCode}) ${exchange}-${number}`;
    }
    
    return value;
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData({ ...formData, phoneNumber: formatted });
  };

  const getStatusIcon = () => {
    switch (callStatus.status) {
      case 'initiating':
      case 'ringing':
        return <PhoneCall className="w-5 h-5 animate-pulse" />;
      case 'in-progress':
        return <Phone className="w-5 h-5 text-green-400" />;
      case 'completed':
        return <PhoneCall className="w-5 h-5 text-green-400" />;
      case 'failed':
        return <PhoneCall className="w-5 h-5 text-red-400" />;
      default:
        return <PhoneCall className="w-5 h-5" />;
    }
  };

  const getStatusColor = () => {
    switch (callStatus.status) {
      case 'initiating':
      case 'ringing':
        return 'text-blue-400';
      case 'in-progress':
      case 'completed':
        return 'text-green-400';
      case 'failed':
        return 'text-red-400';
      default:
        return 'text-[hsl(211,10%,64%)]';
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Send AI Call</h1>
            <p className="text-[hsl(211,10%,64%)] mt-2">
              Initiate an AI-powered phone call with intelligent conversation handling
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-sm text-green-400">Twilio Connected</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Call Configuration */}
          <Card className="bg-[hsl(0,0%,5.1%)] border-white/10">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-white flex items-center">
                <PhoneCall className="w-5 h-5 mr-2" />
                Call Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Phone Number */}
                <div>
                  <Label htmlFor="phoneNumber" className="text-sm font-medium text-[hsl(211,10%,64%)]">
                    Phone Number
                  </Label>
                  <div className="relative mt-2">
                    <Input
                      id="phoneNumber"
                      type="tel"
                      placeholder="+1 (337) 270-4657"
                      value={formData.phoneNumber}
                      onChange={handlePhoneNumberChange}
                      className="w-full p-4 bg-[hsl(0,0%,8.2%)] border border-white/20 rounded-lg text-white placeholder-[hsl(211,10%,64%)] focus:outline-none focus:border-[hsl(207,90%,54%)] transition-colors"
                      disabled={makeCallMutation.isPending}
                    />
                    <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[hsl(211,10%,64%)]" />
                  </div>
                </div>

                {/* AI Configuration */}
                <div className="space-y-4">
                  <Label className="text-sm font-medium text-[hsl(211,10%,64%)]">
                    AI Assistant Configuration
                  </Label>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="aiModel" className="text-xs text-[hsl(211,10%,64%)]">
                        AI Model
                      </Label>
                      <Select
                        value={formData.aiModel}
                        onValueChange={(value) => setFormData({ ...formData, aiModel: value })}
                        disabled={makeCallMutation.isPending}
                      >
                        <SelectTrigger className="bg-[hsl(0,0%,8.2%)] border-white/20 text-white">
                          <Bot className="w-4 h-4 mr-2" />
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gpt-4o">GPT-4o (Recommended)</SelectItem>
                          <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                          <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="voice" className="text-xs text-[hsl(211,10%,64%)]">
                        Voice
                      </Label>
                      <Select
                        value={formData.voice}
                        onValueChange={(value) => setFormData({ ...formData, voice: value })}
                        disabled={makeCallMutation.isPending}
                      >
                        <SelectTrigger className="bg-[hsl(0,0%,8.2%)] border-white/20 text-white">
                          <Mic className="w-4 h-4 mr-2" />
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="alloy">Alloy (Neutral)</SelectItem>
                          <SelectItem value="echo">Echo (Male)</SelectItem>
                          <SelectItem value="fable">Fable (British)</SelectItem>
                          <SelectItem value="onyx">Onyx (Deep)</SelectItem>
                          <SelectItem value="nova">Nova (Female)</SelectItem>
                          <SelectItem value="shimmer">Shimmer (Soft)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Call Objective */}
                <div>
                  <Label htmlFor="objective" className="text-sm font-medium text-[hsl(211,10%,64%)]">
                    Call Objective
                  </Label>
                  <Textarea
                    id="objective"
                    placeholder="Enter your call objective or script. For example: 'Introduce our AI calling service and schedule a demo with interested prospects.'"
                    value={formData.objective}
                    onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                    rows={4}
                    className="mt-2 w-full p-3 bg-[hsl(0,0%,8.2%)] border border-white/20 rounded-lg text-white placeholder-[hsl(211,10%,64%)] focus:outline-none focus:border-[hsl(207,90%,54%)] resize-none"
                    disabled={makeCallMutation.isPending}
                  />
                </div>

                {/* Call Button */}
                <Button
                  type="submit"
                  disabled={makeCallMutation.isPending || callStatus.status !== 'idle'}
                  className="w-full py-4 bg-gradient-to-r from-[hsl(207,90%,54%)] to-[hsl(271,91%,65%)] hover:from-[hsl(207,90%,49%)] hover:to-[hsl(271,91%,60%)] text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none"
                >
                  <div className="flex items-center justify-center space-x-2">
                    {getStatusIcon()}
                    <span>
                      {makeCallMutation.isPending ? 'Initiating Call...' : 'Start AI Call'}
                    </span>
                  </div>
                </Button>

                {/* Call Status */}
                {callStatus.status !== 'idle' && (
                  <div className="p-3 bg-[hsl(0,0%,8.2%)] rounded-lg border border-white/10">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        callStatus.status === 'ringing' || callStatus.status === 'initiating' 
                          ? 'bg-blue-400 animate-pulse' 
                          : callStatus.status === 'completed' || callStatus.status === 'in-progress'
                          ? 'bg-green-400'
                          : 'bg-red-400'
                      }`}></div>
                      <span className="text-sm text-[hsl(211,10%,64%)]">Call Status:</span>
                      <span className={`text-sm font-medium ${getStatusColor()}`}>
                        {callStatus.status === 'initiating' && 'Initiating...'}
                        {callStatus.status === 'ringing' && 'Ringing...'}
                        {callStatus.status === 'in-progress' && 'In Progress'}
                        {callStatus.status === 'completed' && 'Completed'}
                        {callStatus.status === 'failed' && 'Failed'}
                      </span>
                    </div>
                    {callStatus.message && (
                      <p className="text-xs text-[hsl(211,10%,64%)] mt-1">{callStatus.message}</p>
                    )}
                  </div>
                )}
              </form>
            </CardContent>
          </Card>

          {/* AI Configuration Details */}
          <Card className="bg-[hsl(0,0%,5.1%)] border-white/10">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-white flex items-center">
                <Bot className="w-5 h-5 mr-2" />
                AI Assistant Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Model Info */}
              <div className="p-4 bg-[hsl(0,0%,8.2%)] rounded-lg border border-white/10">
                <h4 className="text-sm font-medium text-white mb-2">Selected Model</h4>
                <div className="flex items-center space-x-2">
                  <Bot className="w-4 h-4 text-[hsl(207,90%,54%)]" />
                  <span className="text-sm text-[hsl(207,90%,54%)]">
                    {formData.aiModel === 'gpt-4o' && 'GPT-4o - Latest & Most Capable'}
                    {formData.aiModel === 'gpt-4-turbo' && 'GPT-4 Turbo - High Performance'}
                    {formData.aiModel === 'gpt-3.5-turbo' && 'GPT-3.5 Turbo - Cost Effective'}
                  </span>
                </div>
              </div>

              {/* Voice Info */}
              <div className="p-4 bg-[hsl(0,0%,8.2%)] rounded-lg border border-white/10">
                <h4 className="text-sm font-medium text-white mb-2">Voice Characteristics</h4>
                <div className="flex items-center space-x-2">
                  <Mic className="w-4 h-4 text-[hsl(271,91%,65%)]" />
                  <span className="text-sm text-[hsl(271,91%,65%)]">
                    {formData.voice === 'alloy' && 'Neutral, professional tone'}
                    {formData.voice === 'echo' && 'Male, clear and articulate'}
                    {formData.voice === 'fable' && 'British accent, sophisticated'}
                    {formData.voice === 'onyx' && 'Deep, authoritative voice'}
                    {formData.voice === 'nova' && 'Female, warm and friendly'}
                    {formData.voice === 'shimmer' && 'Soft, gentle tone'}
                  </span>
                </div>
              </div>

              {/* Objective Preview */}
              {formData.objective && (
                <div className="p-4 bg-[hsl(0,0%,8.2%)] rounded-lg border border-white/10">
                  <h4 className="text-sm font-medium text-white mb-2">Call Objective</h4>
                  <p className="text-sm text-[hsl(211,10%,64%)] leading-relaxed">
                    {formData.objective}
                  </p>
                </div>
              )}

              {/* System Status */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-white">System Status</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[hsl(211,10%,64%)]">Twilio Integration</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-xs text-green-400">Connected</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[hsl(211,10%,64%)]">OpenAI Integration</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-xs text-green-400">Connected</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[hsl(211,10%,64%)]">Webhook Status</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-xs text-green-400">Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
