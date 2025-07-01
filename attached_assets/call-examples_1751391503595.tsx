import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function CallExamples() {
  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-5xl font-bold leading-tight mb-16">
          <span className="block">Every day, Algo handles millions</span>
          <span className="block">of calls. Take a listen.</span>
        </h2>
        
        {/* Call Examples Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Healthcare Example */}
          <div className="bg-[hsl(0,0%,5.1%)] p-8 rounded-2xl border border-white/10">
            <div className="text-left space-y-4">
              <p className="text-[hsl(211,10%,64%)]">
                <span className="text-white">"Hi, I'm calling about your upcoming appointment."</span>
              </p>
              <p className="text-[hsl(211,10%,64%)]">
                "Can you verify your identity, including your address?"
              </p>
              <div className="border-t border-white/10 pt-4 mt-6">
                <p className="text-sm text-[hsl(211,10%,64%)]">
                  Healthcare: <span className="text-white">Karen</span>
                </p>
              </div>
            </div>
          </div>
          
          {/* Logistics Example */}
          <div className="bg-[hsl(0,0%,5.1%)] p-8 rounded-2xl border border-white/10">
            <div className="text-left space-y-4">
              <p className="text-white">Hey Katie this is Jack.</p>
              <p className="text-[hsl(25,95%,53%)]">
                Hey Jack, is this regarding a load drop-off, or uh, something else?
              </p>
              <p className="text-white">A load drop-off.</p>
              <p className="text-[hsl(25,95%,53%)]">Right, and what's your Driver ID?</p>
              <p className="text-white">1-9-7-4-1-2</p>
              <p className="text-[hsl(25,95%,53%)]">
                Uh huh, so 1-9-7-4-1-2, is that correct?
              </p>
              <div className="border-t border-white/10 pt-4 mt-6">
                <p className="text-sm text-[hsl(211,10%,64%)]">
                  Logistics: <span className="text-white">Katie</span>
                </p>
              </div>
            </div>
          </div>
          
          {/* Finance Example */}
          <div className="bg-[hsl(0,0%,5.1%)] p-8 rounded-2xl border border-white/10">
            <div className="text-left space-y-4 text-red-400">
              <p>
                Hey Greg, I'm Jen with Financial. I reached out to you regarding your application along. All right?
              </p>
              <div className="text-white">
                <p>Okay, sounds good.</p>
              </div>
              <p>So, real quick, just to get started here, what's your last name?</p>
              <div className="text-white">
                <p>Smith.</p>
              </div>
              <p>Mhm, and could you tell me what you'll be...</p>
              <div className="border-t border-white/10 pt-4 mt-6">
                <p className="text-sm text-[hsl(211,10%,64%)]">
                  Finance: <span className="text-white">Jen</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <Link href="/signup">
          <Button className="bg-red-600 text-white hover:bg-red-700 transition-all duration-200">
            Start for Free →
          </Button>
        </Link>
      </div>
    </section>
  );
}
