'use client';
import { BotIcon } from "lucide-react";
import { useEffect } from "react";

export default function DashboardPage() {
  useEffect(() => {
    document.documentElement.classList.add("overflow-hidden");
    document.body.classList.add("overflow-hidden");

    return () => {
      document.documentElement.classList.remove("overflow-hidden");
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 text-white">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-gray-800 to-gray-700/50"></div>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#333_1px,transparent_1px),linear-gradient(to_bottom,#333_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

      {/* Centered Message */}
      <div className="relative max-w-md w-full p-8 text-center bg-gray-800/60 backdrop-blur-sm shadow-sm ring-1 ring-gray-700/50 rounded-2xl">
        <div className="bg-gradient-to-b from-gray-700 to-gray-800 rounded-xl p-4 inline-flex">
          <BotIcon className="w-11 h-12 text-gray-300" />
        </div>
        <h3 className="text-2xl font-semibold bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent">
          Welcome to the nuBot
        </h3>
        <p className="text-gray-400 max-w-md mx-auto">
          Start a new conversation or select an existing chat from the sidebar. nuBot is ready to help with any task.
        </p>
        <div className="pt-1 flex justify-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-0.5">
            <div className="w-1 h-2 rounded-full bg-blue-400"></div>
            Markdown support
          </div>
          <div className="flex items-center gap-0.5">
            <div className="w-1 h-2 rounded-full bg-green-400"></div>
            Streaming responses
          </div>
          <div className="flex items-center gap-0.5">
            <div className="w-1 h-2 rounded-full bg-purple-400"></div>
            Code with syntax highlighting
          </div>
        </div>
      </div>
    </div>
  );
}
