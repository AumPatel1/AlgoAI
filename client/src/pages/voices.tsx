import DashboardLayout from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, Volume2, User, Globe, Heart, Zap } from "lucide-react";

const voices = [
  {
    id: "alloy",
    name: "Alloy",
    type: "Neutral",
    description: "Neutral, professional tone",
    characteristics: "Clear and professional voice suitable for business calls and formal interactions",
    icon: Volume2,
    accent: "hsl(207,90%,54%)",
    gender: "Neutral",
    bestFor: "Business calls, professional interactions, customer service"
  },
  {
    id: "echo",
    name: "Echo",
    type: "Male",
    description: "Male, clear and articulate",
    characteristics: "Strong masculine voice with excellent clarity and articulation",
    icon: User,
    accent: "hsl(142,76%,36%)",
    gender: "Male",
    bestFor: "Sales calls, confident presentations, authority-based conversations"
  },
  {
    id: "fable",
    name: "Fable",
    type: "British",
    description: "British accent, sophisticated",
    characteristics: "Elegant British accent that conveys sophistication and trustworthiness",
    icon: Globe,
    accent: "hsl(262,83%,58%)",
    gender: "Male",
    bestFor: "Premium services, educational content, sophisticated brand representation"
  },
  {
    id: "onyx",
    name: "Onyx",
    type: "Deep",
    description: "Deep, authoritative voice",
    characteristics: "Rich, deep tone that commands attention and conveys authority",
    icon: Zap,
    accent: "hsl(0,0%,20%)",
    gender: "Male",
    bestFor: "Leadership communications, serious announcements, executive-level calls"
  },
  {
    id: "nova",
    name: "Nova",
    type: "Female",
    description: "Female, warm and friendly",
    characteristics: "Warm, approachable feminine voice perfect for customer engagement",
    icon: Heart,
    accent: "hsl(326,78%,68%)",
    gender: "Female",
    bestFor: "Customer support, friendly outreach, healthcare communications"
  },
  {
    id: "shimmer",
    name: "Shimmer",
    type: "Soft",
    description: "Soft, gentle tone",
    characteristics: "Gentle and soothing voice that creates a calming, trustworthy atmosphere",
    icon: Heart,
    accent: "hsl(280,67%,75%)",
    gender: "Female",
    bestFor: "Wellness calls, sensitive topics, empathetic communications"
  }
];

export default function Voices() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Voice Options</h1>
          <p className="text-[hsl(211,10%,64%)] mt-2">
            Choose from our selection of AI voices to match your brand and communication style
          </p>
        </div>

        {/* Voice Overview */}
        <Card className="bg-[hsl(0,0%,5.1%)] border-white/10">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-white flex items-center">
              <Mic className="w-6 h-6 mr-3 text-[hsl(207,90%,54%)]" />
              Available Voice Options
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[hsl(211,10%,64%)] mb-6">
              All voices are powered by advanced AI technology and optimized for natural phone conversations. 
              Choose the voice that best represents your brand and resonates with your audience.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {voices.map((voice) => {
                const IconComponent = voice.icon;
                return (
                  <Card key={voice.id} className="bg-[hsl(0,0%,8.2%)] border-white/10 hover:border-white/20 transition-colors">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: `${voice.accent}20`, border: `1px solid ${voice.accent}30` }}
                          >
                            <IconComponent 
                              className="w-5 h-5" 
                              style={{ color: voice.accent }}
                            />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-white">{voice.name}</h3>
                            <Badge 
                              variant="outline" 
                              className="text-xs mt-1"
                              style={{ 
                                borderColor: voice.accent + '40',
                                color: voice.accent,
                                backgroundColor: voice.accent + '10'
                              }}
                            >
                              {voice.type}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0 space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-white mb-2">Description</h4>
                        <p className="text-sm text-[hsl(211,10%,64%)]">{voice.description}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-white mb-2">Characteristics</h4>
                        <p className="text-sm text-[hsl(211,10%,64%)]">{voice.characteristics}</p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-white mb-2">Gender</h4>
                        <Badge variant="secondary" className="text-xs">
                          {voice.gender}
                        </Badge>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-white mb-2">Best For</h4>
                        <p className="text-xs text-[hsl(211,10%,64%)]">{voice.bestFor}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Voice Selection Tips */}
        <Card className="bg-[hsl(0,0%,5.1%)] border-white/10">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-white">
              Choosing the Right Voice
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-[hsl(207,90%,54%)]/10 rounded-lg border border-[hsl(207,90%,54%)]/20">
                  <h4 className="text-sm font-medium text-white mb-2">For Business & Professional</h4>
                  <p className="text-sm text-[hsl(211,10%,64%)]">
                    <strong>Alloy</strong> and <strong>Echo</strong> work best for professional settings, 
                    sales calls, and formal business communications.
                  </p>
                </div>
                
                <div className="p-4 bg-[hsl(326,78%,68%)]/10 rounded-lg border border-[hsl(326,78%,68%)]/20">
                  <h4 className="text-sm font-medium text-white mb-2">For Customer Support</h4>
                  <p className="text-sm text-[hsl(211,10%,64%)]">
                    <strong>Nova</strong> and <strong>Shimmer</strong> are ideal for customer service, 
                    support calls, and empathetic communications.
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-[hsl(262,83%,58%)]/10 rounded-lg border border-[hsl(262,83%,58%)]/20">
                  <h4 className="text-sm font-medium text-white mb-2">For Premium Brands</h4>
                  <p className="text-sm text-[hsl(211,10%,64%)]">
                    <strong>Fable</strong> with its British accent conveys sophistication and 
                    is perfect for luxury brands and premium services.
                  </p>
                </div>
                
                <div className="p-4 bg-[hsl(0,0%,20%)]/10 rounded-lg border border-[hsl(0,0%,20%)]/20">
                  <h4 className="text-sm font-medium text-white mb-2">For Authority & Leadership</h4>
                  <p className="text-sm text-[hsl(211,10%,64%)]">
                    <strong>Onyx</strong> delivers authority and gravitas, perfect for 
                    executive communications and important announcements.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technical Information */}
        <Card className="bg-[hsl(0,0%,5.1%)] border-white/10">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-white">
              Technical Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-white mb-3">Voice Technology</h4>
                <ul className="space-y-2 text-sm text-[hsl(211,10%,64%)]">
                  <li>• AI-powered natural speech synthesis</li>
                  <li>• Optimized for phone call quality</li>
                  <li>• Real-time conversation capabilities</li>
                  <li>• Consistent voice characteristics</li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-white mb-3">Quality Standards</h4>
                <ul className="space-y-2 text-sm text-[hsl(211,10%,64%)]">
                  <li>• High-definition audio output</li>
                  <li>• Natural conversation flow</li>
                  <li>• Emotional expressiveness</li>
                  <li>• Professional pronunciation</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
} 