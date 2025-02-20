"use client";

import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useNavigation } from "@/lib/context/navigation";

export default function Header() {
  const { setIsMobileNavOpen } = useNavigation();

  return (
    <header className="border-b border-gray-700 bg-gray-900 backdrop-blur-xl sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileNavOpen(true)}
            className="md:hidden text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="font-semibold bg-gradient-to-r from-gray-400 to-gray-200 bg-clip-text text-transparent">
            nuBot
          </div>
        </div>
        <div className="flex items-center">
          <UserButton
            appearance={{
              elements: {
                avatarBox:
                  "h-8 w-8 ring-2 ring-gray-700 ring-offset-2 rounded-full transition-shadow hover:ring-gray-500",
              },
            }}
          />
        </div>
      </div>
    </header>
  );
}
