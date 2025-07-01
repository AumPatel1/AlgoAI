import { Phone } from "lucide-react";

export default function PhoneMockup() {
  return (
    <div className="relative mx-auto max-w-md">
      {/* Phone Frame */}
      <div className="relative bg-black rounded-[3rem] p-2 shadow-2xl border border-gray-800">
        <div className="bg-white rounded-[2.5rem] p-6 min-h-[600px] relative overflow-hidden">
          {/* Phone Status Bar */}
          <div className="flex justify-between items-center mb-6 text-black text-sm font-medium">
            <span>9:41</span>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-2 border border-black rounded-sm">
                <div className="w-3 h-1 bg-black rounded-sm"></div>
              </div>
              <div className="w-1 h-1 bg-black rounded-full"></div>
              <div className="w-1 h-1 bg-black rounded-full"></div>
              <div className="w-1 h-1 bg-black rounded-full"></div>
              <div className="w-4 h-2 bg-black rounded-sm"></div>
            </div>
          </div>
          
          {/* Call Interface */}
          <div className="text-center text-black">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center mr-3">
                <Phone className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                <div className="font-semibold">Call Algo's AI</div>
                <div className="text-gray-600 text-sm">Make your customers happy!</div>
              </div>
              <div className="ml-auto text-sm text-gray-600">9:41 AM</div>
            </div>
            
            {/* Phone Number Input */}
            <div className="mb-6">
              <input 
                type="text" 
                placeholder="Enter Phone Number" 
                className="w-full p-4 border border-gray-300 rounded-lg text-center text-lg font-medium bg-gray-50"
                readOnly
              />
            </div>
            
            {/* Call Button */}
            <button className="w-full bg-black text-white py-4 rounded-lg font-semibold text-lg mb-8">
              Let's Talk
            </button>
          </div>
          
          {/* Decorative Background Elements */}
          <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[hsl(25,95%,53%)] via-[hsl(262,83%,70%)] to-[hsl(200,80%,69%)] opacity-10 rounded-b-[2.5rem]"></div>
        </div>
      </div>
    </div>
  );
}
