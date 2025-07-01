import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Workflow() {
  return (
    <section className="py-24 bg-[hsl(0,0%,5.1%)] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-5xl font-bold leading-tight mb-8">
          <span className="block">Book an appointment. Update a CRM.</span>
          <span className="block">Send a text. All in one workflow.</span>
        </h2>
        
        <p className="text-xl text-[hsl(211,10%,64%)] leading-relaxed mb-16 max-w-4xl mx-auto">
          Pathways are the brain of your business. We integrate into your existing systems, whether it's a 
          scheduler, ERP, or CRM, so your agents don't just talk, they take action. You map out the 
          conversation and define the decisions your AI makes. Algo does the rest.
        </p>
        
        {/* Workflow Visualization */}
        <div className="relative mb-16">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="relative w-full max-w-4xl">
              {/* Main horizontal line */}
              <div className="absolute top-1/2 left-0 right-0 h-2 bg-white/20 rounded-full transform -translate-y-1/2"></div>
              
              {/* Branch lines */}
              <div className="absolute top-1/4 left-1/4 w-1/2 h-2 algo-card-orange rounded-full"></div>
              <div className="absolute top-3/4 left-1/4 w-1/2 h-2 algo-card-purple rounded-full"></div>
              
              {/* Nodes */}
              <div className="absolute top-1/2 left-12 w-6 h-6 bg-[hsl(25,95%,53%)] rounded-full transform -translate-y-1/2 border-4 border-[hsl(0,0%,8.2%)]"></div>
              <div className="absolute top-1/4 left-1/4 w-6 h-6 bg-[hsl(25,95%,53%)] rounded-full transform -translate-y-1/2 border-4 border-[hsl(0,0%,5.1%)]"></div>
              <div className="absolute top-1/4 right-1/4 w-6 h-6 bg-[hsl(25,95%,53%)] rounded-full transform -translate-y-1/2 border-4 border-[hsl(0,0%,5.1%)]"></div>
              <div className="absolute top-3/4 left-1/4 w-6 h-6 bg-[hsl(262,83%,70%)] rounded-full transform -translate-y-1/2 border-4 border-[hsl(0,0%,5.1%)]"></div>
              <div className="absolute top-3/4 right-1/4 w-6 h-6 bg-[hsl(262,83%,70%)] rounded-full transform -translate-y-1/2 border-4 border-[hsl(0,0%,5.1%)]"></div>
              <div className="absolute top-1/2 right-12 w-6 h-6 bg-[hsl(200,80%,69%)] rounded-full transform -translate-y-1/2 border-4 border-[hsl(0,0%,5.1%)]"></div>
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
