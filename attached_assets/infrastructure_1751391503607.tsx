import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Infrastructure() {
  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <h2 className="text-sm uppercase tracking-wider text-[hsl(211,10%,64%)] mb-4">
              How Algo is built.
            </h2>
            <h3 className="text-5xl font-bold leading-tight mb-8">
              Self-hosted, end-to-end infrastructure.
            </h3>
            <p className="text-xl text-[hsl(211,10%,64%)] leading-relaxed mb-8">
              Algo provides fully self-hosted, end-to-end infrastructure. That means faster 
              response times, 99.99% uptime, and guaranteed security for your—and your 
              customer's—data. And your marginal call costs? Zero.
            </p>
            <Link href="/signup">
              <Button className="bg-red-600 text-white hover:bg-red-700 transition-all duration-200">
                Talk to sales →
              </Button>
            </Link>
          </div>
          
          {/* Right Feature Cards */}
          <div className="grid grid-cols-2 gap-4">
            {/* Write custom prompts */}
            <div className="algo-card-orange p-6 rounded-2xl">
              <div className="text-white">
                <h4 className="font-bold text-lg mb-3">📝 Write custom prompts</h4>
                <p className="text-sm opacity-90">
                  Provide your agent with sample dialogue and relevant details to 
                  personalize interactions with your customers.
                </p>
              </div>
            </div>
            
            {/* Scale usage anytime */}
            <div className="algo-card-pink p-6 rounded-2xl">
              <div className="text-white">
                <h4 className="font-bold text-lg mb-3">📈 Scale usage anytime</h4>
                <p className="text-sm opacity-90">
                  Auto-scaling infrastructure allows you to handle thousands of calls, any time.
                </p>
              </div>
            </div>
            
            {/* Seamlessly exchange data */}
            <div className="algo-card-purple p-6 rounded-2xl">
              <div className="text-white">
                <h4 className="font-bold text-lg mb-3">🔄 Seamlessly exchange data</h4>
                <p className="text-sm opacity-90">
                  Dynamic integrations built with our API send your data wherever it needs to go.
                </p>
              </div>
            </div>
            
            {/* Set strict guardrails */}
            <div className="algo-card-orange p-6 rounded-2xl">
              <div className="text-white">
                <h4 className="font-bold text-lg mb-3">🛡️ Set strict guardrails</h4>
                <p className="text-sm opacity-90">
                  Ensure calls stay on-brand, accurate, and within defined boundaries.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-center mt-16">
        <Link href="/signup">
          <Button className="bg-red-600 text-white hover:bg-red-700 transition-all duration-200">
            Start for Free →
          </Button>
        </Link>
      </div>
    </section>
  );
}
