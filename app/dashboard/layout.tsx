"use client";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { NavigationProvider } from "@/lib/context/navigation";
import { Authenticated } from "convex/react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NavigationProvider>
      <div className="flex flex-col h-screen">
        {/* Header at the top */}
        <Header />

        <div className="flex flex-1 overflow-hidden">
          <Authenticated>
            {/* Sidebar below the Header and beside the main content */}
            <Sidebar />
          </Authenticated>

          {/* Main content */}
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </NavigationProvider>
  );
}
