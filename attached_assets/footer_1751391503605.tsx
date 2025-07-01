import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Footer() {
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
        <div className="grid md:grid-cols-4 gap-12">
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
              <li><a href="#" className="hover:text-white transition-colors duration-200">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200">No Code</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200">Use Cases</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200">Appointment Booking</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200">Financial Intake</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200">Logistics ID Verification</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200">Case Studies</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200">Parade</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200">MonsterRG</a></li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h4 className="font-semibold text-white mb-6">Support</h4>
            <ul className="space-y-4 text-[hsl(211,10%,64%)]">
              <li><a href="#" className="hover:text-white transition-colors duration-200">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200">Terms</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200">Cookie Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200">Algo Sub-processor List</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200">Data Processing Agreement</a></li>
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h4 className="font-semibold text-white mb-6">Company</h4>
            <ul className="space-y-4 text-[hsl(211,10%,64%)]">
              <li><a href="#" className="hover:text-white transition-colors duration-200">Docs</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200">Careers</a></li>
            </ul>
            
            {/* Social Icons */}
            <div className="flex space-x-4 mt-8">
              <a href="#" className="text-[hsl(211,10%,64%)] hover:text-white transition-colors duration-200">
                <i className="fab fa-github text-xl"></i>
              </a>
              <a href="#" className="text-[hsl(211,10%,64%)] hover:text-white transition-colors duration-200">
                <i className="fab fa-twitter text-xl"></i>
              </a>
              <a href="#" className="text-[hsl(211,10%,64%)] hover:text-white transition-colors duration-200">
                <i className="fab fa-linkedin text-xl"></i>
              </a>
            </div>
            
            {/* Copyright */}
            <p className="text-[hsl(211,10%,64%)] text-sm mt-8">Algo.ai, Inc. © 2024</p>
            
            {/* Compliance Badges */}
            <div className="flex space-x-2 mt-4">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold">SOC2</span>
              </div>
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold">HIPAA</span>
              </div>
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold">GDPR</span>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              size="sm"
              className="bg-[hsl(0,0%,8.2%)] border-white/20 text-white hover:bg-white/10 mt-4"
            >
              Cookie Settings
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
