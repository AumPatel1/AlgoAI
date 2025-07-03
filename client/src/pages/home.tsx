import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function Home() {
  return (
    <div className="bg-[#F9F9F7] text-black">
      <Navbar />
      <main>
        <Hero />
        <WhatIsAlgo />
        <Workflow />
        <CallExamples />
        <Infrastructure />
        <Security />
      </main>
      <Footer />
    </div>
  );
}

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <div className="text-2xl font-bold">
              <span className="algo-gradient-text">AlgoAI</span>
            </div>
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#how-it-works" className="text-white hover:text-gray-300 transition-colors duration-200">
              How It Works
            </a>
            <a href="#resources" className="text-white hover:text-gray-300 transition-colors duration-200">
              Resources
            </a>
            <a href="#enterprise" className="text-white hover:text-gray-300 transition-colors duration-200">
              Enterprise
            </a>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" className="text-white hover:text-gray-300">
                    Dashboard
                  </Button>
                </Link>
                <Button variant="ghost" className="text-white hover:text-gray-300" onClick={logout}>
                  Sign Out
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button variant="ghost" className="text-white hover:text-gray-300">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

const Waveform = () => (
  <div className="absolute top-1/2 left-1/2 w-[150%] h-[150%] -translate-x-1/2 -translate-y-1/2">
    <div
      className="w-full h-full bg-gradient-to-r from-orange-500 via-purple-500 to-red-500"
      style={{
        clipPath: "polygon(0% 45%, 15% 60%, 30% 40%, 45% 55%, 60% 35%, 75% 50%, 90% 30%, 100% 45%, 100% 100%, 0% 100%)"
      }}
    />
  </div>
);

const AlgoAIBG = () => (
  <div className="absolute inset-0 z-0 pointer-events-none">
    <h1 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-200 text-[12rem] md:text-[16rem] lg:text-[20rem] font-black tracking-tighter leading-none opacity-40 select-none">
      ALGOAI
    </h1>
  </div>
);

function Hero() {
  return (
    <section className="relative w-full pt-32 pb-16 text-black overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Waveform />
      </div>
      <div className="container mx-auto px-4 md:px-6 relative z-10 flex flex-col items-center text-center">
        <h2 className="text-xl font-semibold tracking-wide text-gray-700 mb-4">AlgoAi</h2>
        <h1 className="text-5xl font-bold tracking-tighter sm:text-6xl xl:text-7xl/none max-w-4xl">
          Your platform for making ultra-realistic AI Phone Calls
        </h1>
        <div className="mt-32 relative">
          <AlgoAIBG />
          <div className="relative z-20">
            <PhoneMockup />
          </div>
        </div>
      </div>
    </section>
  );
}

function WhatIsAlgo() {
  return (
    <section id="what-is-algo" className="w-full py-12 md:py-24 lg:py-32 bg-black text-white">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-6">
            <h2 className="text-xl font-semibold tracking-wide text-gray-400">What is Algo.</h2>
            <p className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl max-w-4xl mx-auto">
              AI phone agents that sound human, speak any language, and work 24/7.
            </p>
            <p className="max-w-[900px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto">
              Algo makes it simple to integrate the latest conversational AI technology into your business. Build the perfect employee to handle sales, scheduling, and all your customer support needs. Algo's AI phone agents sound human, can speak any language, and work 24/7.
            </p>
          </div>
          <div className="flex justify-center pt-8">
            <Link
              to="/signup"
              className="inline-flex h-12 items-center justify-center rounded-md bg-red-600 text-white px-8 text-sm font-medium shadow transition-colors hover:bg-red-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              Start
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

function PhoneMockup() {
  return (
    <div className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-xl">
      <div className="w-[148px] h-[18px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute"></div>
      <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[124px] rounded-s-lg"></div>
      <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[178px] rounded-s-lg"></div>
      <div className="h-[64px] w-[3px] bg-gray-800 absolute -end-[17px] top-[142px] rounded-e-lg"></div>
      <div className="rounded-[2rem] overflow-hidden w-[272px] h-[572px] bg-white">
        <div className="p-4 bg-gray-50 h-full flex flex-col">
          <div className="flex items-center gap-3 mb-4 shrink-0 mt-6">
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md">A</div>
            <div className="flex-1">
              <div className="text-sm font-bold text-left text-black">Call Algo's AI</div>
              <p className="text-xs text-gray-500 text-left">Make your customers happy!</p>
            </div>
            <div className="text-xs text-gray-400 shrink-0">9:41 AM</div>
          </div>
          
          <div className="space-y-4 overflow-y-auto flex-grow">
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white text-sm font-bold shrink-0">A</div>
              <div className="flex flex-col gap-1 w-full max-w-[80%]">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <span className="text-sm font-semibold text-gray-900">AlgoAI</span>
                </div>
                <div className="flex flex-col leading-1.5 p-3 border-gray-200 bg-gray-200 rounded-e-xl rounded-es-xl">
                  <p className="text-sm font-normal text-gray-900">Hello, thank you for calling. How can I help you today?</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-2.5 justify-end">
              <div className="flex flex-col gap-1 w-full max-w-[80%]">
                <div className="flex items-center space-x-2 rtl:space-x-reverse justify-end">
                  <span className="text-sm font-semibold text-gray-900">Customer</span>
                </div>
                <div className="flex flex-col leading-1.5 p-3 border-gray-200 bg-blue-600 rounded-s-xl rounded-ee-xl">
                  <p className="text-sm font-normal text-white">Hi, I'd like to check the status of my recent order.</p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold shrink-0">C</div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white text-sm font-bold shrink-0">A</div>
              <div className="flex flex-col gap-1 w-full max-w-[80%]">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <span className="text-sm font-semibold text-gray-900">AlgoAI</span>
                </div>
                <div className="flex flex-col leading-1.5 p-3 border-gray-200 bg-gray-200 rounded-e-xl rounded-es-xl">
                  <p className="text-sm font-normal text-gray-900">Of course, I can help with that. Could you please provide me with your order number?</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 shrink-0">
            <Link href="/login">
              <Button className="w-full bg-black text-white hover:bg-gray-800 py-3 rounded-lg shadow-md">
                Let's Talk
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Workflow() {
  const workflowNodes = [
    {
      id: 1,
      position: "absolute top-1/2 left-12 transform -translate-y-1/2",
      color: "bg-pink-700",
      tooltip: "The call begins. Algo greets the customer warmly.",
    },
    {
      id: 2,
      position: "absolute top-1/4 left-1/4 transform -translate-y-1/2",
      color: "bg-orange-700",
      tooltip: "AI identifies the caller's intent: 'I'd like to book an appointment.'",
    },
    {
      id: 3,
      position: "absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
      color: "bg-orange-700",
      tooltip: "Algo checks the calendar for available slots in real-time.",
    },
    {
      id: 4,
      position: "absolute top-1/4 right-1/4 transform -translate-y-1/2",
      color: "bg-orange-700",
      tooltip: "The appointment is confirmed and booked directly into your CRM.",
    },
    {
      id: 5,
      position: "absolute top-3/4 left-1/4 transform -translate-y-1/2",
      color: "bg-purple-700",
      tooltip: "The AI understands the customer needs support for an issue.",
    },
    {
      id: 6,
      position: "absolute top-3/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
      color: "bg-purple-700",
      tooltip: "It pulls up the customer's order history from your database.",
    },
    {
      id: 7,
      position: "absolute top-3/4 right-1/4 transform -translate-y-1/2",
      color: "bg-purple-700",
      tooltip: "A solution is provided, or the call is escalated to a human agent.",
    },
    {
      id: 8,
      position: "absolute top-1/2 right-12 transform -translate-y-1/2",
      color: "bg-teal-700",
      tooltip: "The call is successfully completed, logged, and a summary is generated.",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-5xl font-bold leading-tight mb-8 text-black">
          <span className="block">Book an appointment. Update a CRM.</span>
          <span className="block">Send a text. All in one workflow.</span>
        </h2>
        
        <p className="text-xl text-gray-600 leading-relaxed mb-16 max-w-4xl mx-auto">
          Pathways are the brain of your business. Algo integrate into your existing systems, whether it's a 
          scheduler, ERP, or CRM, so your agents don't just talk, they take action. You map out the 
          conversation and define the decisions your AI makes. Algo does the rest.
        </p>
        
        {/* Workflow Visualization */}
        <TooltipProvider>
          <div className="relative mb-16">
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="relative w-full max-w-4xl">
                {/* Main horizontal line */}
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-500 rounded-full transform -translate-y-1/2"></div>
                
                {/* Branch lines with arrows */}
                <div className="absolute top-1/4 left-1/4 w-1/2 h-1 bg-orange-600 rounded-full">
                  <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[10px] border-l-orange-600" />
                </div>
                <div className="absolute top-3/4 left-1/4 w-1/2 h-1 bg-purple-600 rounded-full">
                  <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[10px] border-l-purple-600" />
                </div>
                
                {/* Nodes */}
                {workflowNodes.map((node) => (
                  <Tooltip key={node.id}>
                    <TooltipTrigger asChild>
                      <div className={`${node.position} w-6 h-6 ${node.color} rounded-full cursor-pointer hover:scale-125 transition-transform duration-300`}></div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{node.tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </div>
          </div>
        </TooltipProvider>
        
        <Link href="/signup">
          <Button className="bg-red-600 text-white hover:bg-red-700 transition-all duration-200">
            Start for Free →
          </Button>
        </Link>
      </div>
    </section>
  );
}

function CallExamples() {
  return (
    <section id="resources" className="py-24 bg-gray-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-5xl font-bold leading-tight mb-16 text-black">
          <span className="block">Algo handles several</span>
          <span className="block">calls. Take a listen.</span>
        </h2>
        
        {/* Call Examples Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Healthcare Example */}
          <div className="bg-blue-950 p-8 rounded-2xl border border-blue-800 shadow-md">
            <div className="text-left space-y-4">
              <p className="text-gray-300">
                <span className="text-white">"Hi, I'm calling about your upcoming appointment."</span>
              </p>
              <p className="text-gray-300">
                "Can you verify your identity, including your address?"
              </p>
              <div className="border-t border-gray-700 pt-4 mt-6">
                <p className="text-sm text-gray-400">
                  Healthcare: <span className="text-white">Karen</span>
                </p>
              </div>
            </div>
          </div>
          
          {/* Logistics Example */}
          <div className="bg-gray-900 p-8 rounded-2xl border border-gray-700 shadow-md">
            <div className="text-left space-y-4 text-white">
              <p>Hey Katie this is Jack.</p>
              <p className="text-orange-500">
                Hey Jack, is this regarding a load drop-off, or uh, something else?
              </p>
              <p>A load drop-off.</p>
              <p className="text-orange-500">Right, and what's your Driver ID?</p>
              <p>1-9-7-4-1-2</p>
              <p className="text-orange-500">
                Uh huh, so 1-9-7-4-1-2, is that correct?
              </p>
              <div className="border-t border-gray-700 pt-4 mt-6">
                <p className="text-sm text-gray-400">
                  Logistics: <span className="text-white">Katie</span>
                </p>
              </div>
            </div>
          </div>
          
          {/* Finance Example */}
          <div className="bg-purple-950 p-8 rounded-2xl border border-purple-800 shadow-md">
            <div className="text-left space-y-4 text-purple-400">
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
              <div className="border-t border-gray-700 pt-4 mt-6">
                <p className="text-sm text-gray-400">
                  Finance: <span className="text-white">Jen</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Infrastructure() {
  return (
    <section id="enterprise" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <h2 className="text-sm uppercase tracking-wider text-gray-500 mb-4">
              How Algo is built.
            </h2>
            <h3 className="text-5xl font-bold leading-tight mb-8 text-black">
              Self-hosted, end-to-end infrastructure.
            </h3>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              Algo provides fully self-hosted, end-to-end infrastructure. That means faster 
              response times, 99.99% uptime, and guaranteed security for your—and your 
              customer's—data. And your marginal call costs? Zero.
            </p>
          </div>
          
          {/* Right Feature Cards */}
          <div className="grid grid-cols-2 gap-4">
            {/* Write custom prompts */}
            <div className="bg-orange-100 p-6 rounded-2xl">
              <div className="text-black">
                <h4 className="font-bold text-lg mb-3">📝 Write custom prompts</h4>
                <p className="text-sm opacity-90">
                  Provide your agent with sample dialogue and relevant details to 
                  personalize interactions with your customers.
                </p>
              </div>
            </div>
            
            {/* Scale usage anytime */}
            <div className="bg-pink-100 p-6 rounded-2xl">
              <div className="text-black">
                <h4 className="font-bold text-lg mb-3">📈 Scale usage anytime</h4>
                <p className="text-sm opacity-90">
                  Auto-scaling infrastructure allows you to handle thousands of calls, any time.
                </p>
              </div>
            </div>
            
            {/* Seamlessly exchange data */}
            <div className="bg-purple-100 p-6 rounded-2xl">
              <div className="text-black">
                <h4 className="font-bold text-lg mb-3">🔄 Seamlessly exchange data</h4>
                <p className="text-sm opacity-90">
                  Dynamic integrations built with our API send your data wherever it needs to go.
                </p>
              </div>
            </div>
            
            {/* Set strict guardrails */}
            <div className="bg-orange-100 p-6 rounded-2xl">
              <div className="text-black">
                <h4 className="font-bold text-lg mb-3">🛡️ Set strict guardrails</h4>
                <p className="text-sm opacity-90">
                  Ensure calls stay on-brand, accurate, and within defined boundaries.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Security() {
  return (
    <section className="py-24 bg-[#F9F9F7] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-sm uppercase tracking-wider text-gray-500 mb-4">
          Algo Security.
        </h2>
        <h3 className="text-5xl font-bold leading-tight mb-8 text-black">
          Own your customer experience end-to-end.
        </h3>
        
        <p className="text-xl text-gray-600 leading-relaxed mb-16 max-w-4xl mx-auto">
          Algo provides end-to-end infrastructure so your customer experience is never reliant on big 
          model providers. That means faster response times, 99.99% uptime and fewer dependencies on 
          external factors. All while driving your marginal call costs to zero.
        </p>
        
        {/* Security Badges Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="bg-orange-100 p-6 rounded-2xl">
            <div className="text-black">
              <h4 className="font-bold text-lg mb-3">🏠 Data In-House</h4>
              <p className="text-sm opacity-90">
                AlgoAI stores and manages your information in-house, reducing external risks and 
                maintaining full control over your data.
              </p>
            </div>
          </div>
          
          <div className="bg-pink-100 p-6 rounded-2xl">
            <div className="text-black">
              <h4 className="font-bold text-lg mb-3">🔒 SOC2 Type II Compliant</h4>
              <p className="text-sm opacity-90">
                AlgoAI follows strict security protocols and regularly monitors its systems to ensure 
                your data remains protected.
              </p>
            </div>
          </div>
          
          <div className="bg-purple-100 p-6 rounded-2xl">
            <div className="text-black">
              <h4 className="font-bold text-lg mb-3">🛡️ GDPR Compliant</h4>
              <p className="text-sm opacity-90">
                AlgoAI follows EU privacy standards, guaranteeing transparency and secure 
                handling of personal information.
              </p>
            </div>
          </div>
          
          <div className="bg-orange-100 p-6 rounded-2xl">
            <div className="text-black">
              <h4 className="font-bold text-lg mb-3">🏥 HIPAA Compliant</h4>
              <p className="text-sm opacity-90">
                Prioritize the security and privacy of sensitive customer data, ensuring full 
                protection throughout your experience.
              </p>
            </div>
          </div>
        </div>
        
        {/* Additional Security Features */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          <div className="bg-purple-100 p-6 rounded-2xl">
            <div className="text-black">
              <h4 className="font-bold text-lg mb-3">🔍 Regular Pen Tests</h4>
              <p className="text-sm opacity-90">AlgoAI simulates cyberattacks to identify vulnerabilities.</p>
            </div>
          </div>
          
          <div className="bg-orange-100 p-6 rounded-2xl">
            <div className="text-black">
              <h4 className="font-bold text-lg mb-3">🧪 Constant Unit Tests</h4>
              <p className="text-sm opacity-90">AlgoAI ensures continuous security through testing.</p>
            </div>
          </div>
          
          <div className="bg-orange-100 p-6 rounded-2xl">
            <div className="text-black">
              <h4 className="font-bold text-lg mb-3">👨‍💼 Expert Implementation</h4>
              <p className="text-sm opacity-90">Professional security implementation and monitoring.</p>
            </div>
          </div>
          
          <div className="bg-pink-100 p-6 rounded-2xl">
            <div className="text-black">
              <h4 className="font-bold text-lg mb-3">🔐 Robust Guardrails</h4>
              <p className="text-sm opacity-90">Multiple layers of protection for your data.</p>
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

function Footer() {
  return (
    <footer className="relative bg-[hsl(0,0%,8.2%)]">
      {/* Colorful Pixel Art Banner */}
      <div className="w-full h-16 relative overflow-hidden">
        <div className="absolute inset-0 flex">
          <div 
            className="flex-1 h-full" 
            style={{
              background: "linear-gradient(90deg, #F97316 0%, #EC4899 10%, #8B5CF6 20%, #3B82F6 30%, #10B981 40%, #F59E0B 50%, #EF4444 60%, #8B5CF6 70%, #06B6D4 80%, #84CC16 90%, #F97316 100%)"
            }}
          ></div>
        </div>
        <div 
          className="absolute inset-0 opacity-80" 
          style={{
            backgroundImage: `
              repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 3px),
              repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 3px)
            `
          }}
        ></div>
      </div>
      
      {/* Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Company Info */}
          <div>
            <div className="text-2xl font-bold mb-4">
              <span className="algo-gradient-text">Algo</span>
              <span className="text-white">®</span>
            </div>
            <p className="text-[hsl(211,10%,64%)] mb-6">AI Phone Calls</p>
            <Link href="/signup">
              <Button className="bg-red-600 text-white hover:bg-red-700 transition-all duration-200">
                Let's Talk →
              </Button>
            </Link>
          </div>
          
          {/* Resources */}
          <div>
            <h4 className="font-semibold text-white mb-6">Resources</h4>
            <ul className="space-y-4 text-[hsl(211,10%,64%)]">
              <li><a href="#resources" className="hover:text-white transition-colors duration-200">Use Cases</a></li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h4 className="font-semibold text-white mb-6">Support</h4>
            <ul className="space-y-4 text-[hsl(211,10%,64%)]">
              <li><a href="tel:3435588325" className="hover:text-white transition-colors duration-200">Contact: 343-558-8325</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
} 