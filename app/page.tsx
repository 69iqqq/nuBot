import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center relative overflow-hidden text-white">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-gradient-to-b from-gray-800 via-gray-900 to-black animate-pulse" />

      <section className="w-full px-6 py-16 mx-auto max-w-6xl sm:px-8 lg:px-12 flex flex-col items-center space-y-12 text-center">
        {/* Hero content */}
        <header className="space-y-6">
          <h1 className="text-6xl font-extrabold tracking-wide sm:text-8xl bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500 bg-clip-text text-transparent animate-glow drop-shadow-lg">
            nuBot
          </h1>
          <p className="max-w-[700px] text-lg text-gray-300 md:text-xl xl:text-2xl">
            Your futuristic AI companion that doesn’t just talk - it takes action.
          </p>
        </header>

        {/* CTA Button */}
        <SignedIn>
          <Link href="/dashboard">
            <button className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-gray-600 to-gray-700 rounded-full hover:from-gray-500 hover:to-gray-400 transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-1">
              Enter nuBot
              <ArrowRight className="ml-2 h-6 w-6 transition-transform group-hover:translate-x-1" />
            </button>
          </Link>
        </SignedIn>

        <SignedOut>
          <SignInButton mode="modal" fallbackRedirectUrl="/dashboard" forceRedirectUrl="/dashboard">
            <button className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-gray-600 to-gray-700 rounded-full hover:from-gray-500 hover:to-gray-400 transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-1">
              Join nuBot
              <ArrowRight className="ml-2 h-6 w-6 transition-transform group-hover:translate-x-1" />
            </button>
          </SignInButton>
        </SignedOut>

        {/* Features grid */}
      </section>
    </main>
  );
}
