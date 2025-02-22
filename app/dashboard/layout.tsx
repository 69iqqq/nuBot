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
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar taking full height */}
        <Authenticated>
          <Sidebar />
        </Authenticated>

        {/* Main content section */}
        <div className="flex flex-col flex-1">
          {/* Header inside main content (not above sidebar) */}
          <Header />

          {/* Content area */}
          <main className="flex-1 overflow-y-auto ring-gray-700">{children}</main>
        </div>
      </div>
    </NavigationProvider>
  );
}
