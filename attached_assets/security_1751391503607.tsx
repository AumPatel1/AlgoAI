import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Security() {
  return (
    <section className="py-24 bg-[hsl(0,0%,5.1%)] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-sm uppercase tracking-wider text-[hsl(211,10%,64%)] mb-4">
          Algo Security.
        </h2>
        <h3 className="text-5xl font-bold leading-tight mb-8">
          Own your customer experience end-to-end.
        </h3>
        
        <p className="text-xl text-[hsl(211,10%,64%)] leading-relaxed mb-16 max-w-4xl mx-auto">
          Algo provides end-to-end infrastructure so your customer experience is never reliant on big 
          model providers. That means faster response times, 99.99% uptime and fewer dependencies on 
          external factors. All while driving your marginal call costs to zero.
        </p>
        
        {/* Security Badges Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="algo-card-orange p-6 rounded-2xl">
            <div className="text-white">
              <h4 className="font-bold text-lg mb-3">🏠 Data In-House</h4>
              <p className="text-sm opacity-90">
                We store and manage your information in-house, reducing external risks and 
                maintaining full control over your data.
              </p>
            </div>
          </div>
          
          <div className="algo-card-pink p-6 rounded-2xl">
            <div className="text-white">
              <h4 className="font-bold text-lg mb-3">🔒 SOC2 Type II Compliant</h4>
              <p className="text-sm opacity-90">
                We follow strict security protocols and regularly monitor our systems to ensure 
                your data remains protected.
              </p>
            </div>
          </div>
          
          <div className="algo-card-purple p-6 rounded-2xl">
            <div className="text-white">
              <h4 className="font-bold text-lg mb-3">🛡️ GDPR Compliant</h4>
              <p className="text-sm opacity-90">
                We follow EU privacy standards, guaranteeing transparency and secure 
                handling of personal information.
              </p>
            </div>
          </div>
          
          <div className="algo-card-orange p-6 rounded-2xl">
            <div className="text-white">
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
          <div className="algo-card-purple p-6 rounded-2xl">
            <div className="text-white">
              <h4 className="font-bold text-lg mb-3">🔍 Regular Pen Tests</h4>
              <p className="text-sm opacity-90">We simulate cyberattacks to identify vulnerabilities.</p>
            </div>
          </div>
          
          <div className="algo-card-orange p-6 rounded-2xl">
            <div className="text-white">
              <h4 className="font-bold text-lg mb-3">🧪 Constant Unit Tests</h4>
              <p className="text-sm opacity-90">We ensure continuous security through testing.</p>
            </div>
          </div>
          
          <div className="algo-card-orange p-6 rounded-2xl">
            <div className="text-white">
              <h4 className="font-bold text-lg mb-3">👨‍💼 Expert Implementation</h4>
              <p className="text-sm opacity-90">Professional security implementation and monitoring.</p>
            </div>
          </div>
          
          <div className="algo-card-pink p-6 rounded-2xl">
            <div className="text-white">
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
