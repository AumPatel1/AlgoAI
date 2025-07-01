import Navbar from "@/components/layout/navbar";
import Hero from "@/components/sections/hero";
import Infrastructure from "@/components/sections/infrastructure";
import Workflow from "@/components/sections/workflow";
import CallExamples from "@/components/sections/call-examples";
import Security from "@/components/sections/security";
import Footer from "@/components/sections/footer";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-[hsl(0,0%,8.2%)] text-white font-inter overflow-x-hidden">
      <Navbar />
      <Hero />
      
      {/* What is Algo Section */}
      <section className="py-24 bg-[hsl(0,0%,5.1%)] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm uppercase tracking-wider text-[hsl(211,10%,64%)] mb-4">
              What is Algo.
            </h2>
            <h3 className="text-5xl md:text-6xl font-bold leading-tight">
              <span className="block">AI phone agents that sound human,</span>
              <span className="block">speak any language, and work 24/7.</span>
            </h3>
          </div>
          
          <div className="max-w-4xl mx-auto text-center mb-12">
            <p className="text-xl text-[hsl(211,10%,64%)] leading-relaxed">
              Algo makes it simple to integrate the latest conversational AI technology into your business. Build 
              the perfect employee to handle sales, scheduling, and all your customer support needs. Algo's AI 
              phone agents sound human, can speak any language, and work 24/7.
            </p>
            <p className="text-xl text-[hsl(211,10%,64%)] mt-6">All for $0.09 a minute.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link href="/signup">
              <Button 
                variant="outline" 
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                Sign up today
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-red-600 text-white hover:bg-red-700">
                Talk to sales →
              </Button>
            </Link>
          </div>
          
          <div className="text-center">
            <Link href="/signup">
              <Button className="bg-red-600 text-white hover:bg-red-700">
                Start for Free →
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      <Infrastructure />
      <Workflow />
      <CallExamples />
      <Security />
      <Footer />
    </div>
  );
}
