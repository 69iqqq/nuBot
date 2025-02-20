import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center relative overflow-hidden text-white">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(circle_at_center,#1a1a1a_0%,#000000_100%)] animate-pulse" />

      <section className="w-full px-6 py-16 mx-auto max-w-6xl sm:px-8 lg:px-12 flex flex-col items-center space-y-12 text-center">
        {/* Hero content */}
        <header className="space-y-6">
          <h1 className="text-6xl font-extrabold tracking-wide sm:text-8xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent animate-glow drop-shadow-lg">
            nuBot
          </h1>
          <p className="max-w-[700px] text-lg text-gray-400 md:text-xl xl:text-2xl">
            Your futuristic AI companion that doesn’t just talk - it takes action.
          </p>
        </header>

        {/* CTA Button */}
        <SignedIn>
          <Link href="/dashboard">
            <button className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-full hover:from-purple-600 hover:to-cyan-400 transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-1">
              Enter nuBot
              <ArrowRight className="ml-2 h-6 w-6 transition-transform group-hover:translate-x-1" />
            </button>
          </Link>
        </SignedIn>

        <SignedOut>
          <SignInButton mode="modal" fallbackRedirectUrl="/dashboard" forceRedirectUrl="/dashboard">
            <button className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-full hover:from-purple-600 hover:to-cyan-400 transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-1">
              Join nuBot
              <ArrowRight className="ml-2 h-6 w-6 transition-transform group-hover:translate-x-1" />
            </button>
          </SignInButton>
        </SignedOut>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16 pt-8 max-w-4xl mx-auto">
          {[
            { title: "Hyper-Speed", description: "Instant, real-time AI execution" },
            { title: "Next-Gen Tech", description: "Built with Next.js 15, Tailwind, Convex, Clerk" },
            { title: "Intelligent", description: "Adaptive, self-learning AI models" },
          ].map(({ title, description }) => (
            <div key={title} className="text-center bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-transform hover:-translate-y-1 border border-gray-700">
              <div className="text-2xl font-semibold text-cyan-400">
                {title}
              </div>
              <div className="text-sm text-gray-400 mt-2">{description}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
 