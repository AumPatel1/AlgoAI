import DashboardLayout from "@/components/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Construction } from "lucide-react";

export default function ComingSoon() {
  return (
    <DashboardLayout>
      <div className="flex-1 flex items-center justify-center">
        <Card className="w-full max-w-md bg-[hsl(0,0%,5.1%)] border-white/10">
          <CardContent className="p-10 text-center">
            <Construction className="w-16 h-16 mx-auto text-[hsl(207,90%,54%)] mb-6" />
            <h1 className="text-3xl font-bold text-white mb-2">
              Coming Soon!
            </h1>
            <p className="text-[hsl(211,10%,64%)]">
              This page is under construction. We're working hard to bring you this feature.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
} 