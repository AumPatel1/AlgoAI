import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export default function Navbar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  return (
    <nav className="fixed top-0 w-full z-50 bg-[hsl(0,0%,8.2%)]/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="text-2xl font-bold">
              <span className="algo-gradient-text">Algo</span>
              <span className="text-white">®</span>
            </div>
          </Link>
          
          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#how-it-works" className="text-[hsl(0,0%,90%)] hover:text-white transition-colors duration-200">
              How It Works
            </a>
            <a href="#resources" className="text-[hsl(0,0%,90%)] hover:text-white transition-colors duration-200">
              Resources
            </a>
            <a href="#enterprise" className="text-[hsl(0,0%,90%)] hover:text-white transition-colors duration-200">
              Enterprise
            </a>
          </div>
          
          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" className="text-[hsl(0,0%,90%)] hover:text-white">
                    Dashboard
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  className="text-[hsl(0,0%,90%)] hover:text-white"
                  onClick={logout}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-[hsl(0,0%,90%)] hover:text-white">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-white text-[hsl(0,0%,8.2%)] hover:bg-[hsl(0,0%,90%)] transition-all duration-200">
                    Talk to sales
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
