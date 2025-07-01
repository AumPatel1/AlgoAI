import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import PhoneMockup from "@/components/ui/phone-mockup";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 pb-16">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-7xl">
          <div className="absolute top-20 left-10 w-32 h-32 bg-[hsl(25,95%,53%)]/20 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-[hsl(262,83%,70%)]/20 rounded-full blur-xl"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-[hsl(200,80%,69%)]/30 rounded-full blur-lg"></div>
        </div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Hero Badge */}
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
          <span className="text-sm text-[hsl(0,0%,90%)]">Meet Algo.</span>
        </div>
        
        {/* Hero Headline */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-8">
          <span className="block">Your platform for making</span>
          <span className="block algo-gradient-text">ultra-realistic AI Phone Calls</span>
        </h1>
        
        {/* Phone Mockup Centerpiece */}
        <div className="mb-12">
          <PhoneMockup />
          
          {/* Floating Company Logos */}
          <div className="absolute -left-20 top-20 hidden lg:block">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <span className="text-sm text-[hsl(0,0%,90%)]">Medallion</span>
            </div>
          </div>
          <div className="absolute -right-20 top-32 hidden lg:block">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <span className="text-sm text-[hsl(0,0%,90%)]">TechFlow</span>
            </div>
          </div>
          <div className="absolute -left-16 bottom-20 hidden lg:block">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <span className="text-sm text-[hsl(0,0%,90%)]">BuildCo</span>
            </div>
          </div>
          <div className="absolute -right-16 bottom-32 hidden lg:block">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <span className="text-sm text-[hsl(0,0%,90%)]">NextGen</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
