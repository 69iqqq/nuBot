"use client";

import { useEffect, useRef, useState } from "react";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import Greeting from "@/components/Greeting";
import { Cloud } from "@/components/BotCloud";
import { ArrowRight, Copy } from "lucide-react";
import { getConvexClient } from "@/lib/convex";
import { api } from "@/convex/_generated/api";

interface ChatInterfaceProps {
  chatId: Id<"chats">;
  initialMessages: Doc<"messages">[];
}

export default function ChatInterface({
  chatId,
  initialMessages,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Doc<"messages">[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const copyToClipboard = (messageId: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(messageId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getGeminiResponse = async (userMessage: string) => {
    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userMessage }),
      });

      const data = await response.json();
      console.log("💬 AI Response:", data);

      if (data.candidates && data.candidates.length > 0) {
        return data.candidates[0].content.parts[0].text;
      } else {
        return "No response from AI.";
      }
    } catch (error) {
      console.error("Error getting AI response:", error);
      return "Error communicating with AI.";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading) return;

    setInput("");
    setIsLoading(true);

    const userMessage: Doc<"messages"> = {
      _id: `temp_${Date.now()}`,
      chatId,
      content: trimmedInput,
      role: "user",
      createdAt: Date.now(),
    } as Doc<"messages">;

    setMessages((prev) => [...prev, userMessage]);

    const aiResponse = await getGeminiResponse(trimmedInput);

    const assistantMessage: Doc<"messages"> = {
      _id: `temp_assistant_${Date.now()}`,
      chatId,
      content: aiResponse,
      role: "assistant",
      createdAt: Date.now(),
    } as Doc<"messages">;

    setMessages((prev) => [...prev, assistantMessage]);

    try {
      const convex = getConvexClient();
      await convex.mutation(api.messages.store, {
        chatId,
        content: trimmedInput,
        role: "user",
      });

      await convex.mutation(api.messages.store, {
        chatId,
        content: aiResponse,
        role: "assistant",
      });
    } catch (error) {
      console.error("Error saving messages:", error);
    }

    setIsLoading(false);
  };

  return (
    <main className="flex flex-col h-[calc(100vh-theme(spacing.14))] bg-gray-900 text-white">
      <section className="flex-1 overflow-y-auto bg-gray-800 p-2 md:p-0">
        <div className="max-w-4xl mx-auto p-4 space-y-3">
          {messages?.length === 0 && <Greeting />}

          {messages?.map((message: Doc<"messages">) => (
            <div key={message._id} className="relative group">
              <Cloud content={message.content} isUser={message.role === "user"} />

              {message.role === "assistant" && (
                <button
                  onClick={() => copyToClipboard(message._id, message.content)}
                  className="absolute top-2 right-2 p-1 rounded-md bg-gray-700 hover:bg-gray-600 transition-opacity opacity-0 group-hover:opacity-100"
                >
                  {copiedId === message._id ? (
                    <span className="text-xs text-green-400">Copied!</span>
                  ) : (
                    <Copy className="h-4 w-4 text-gray-300" />
                  )}
                </button>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start animate-in fade-in-0">
              <div className="rounded-2xl px-4 py-3 bg-gray-700 text-gray-300 rounded-bl-none shadow-sm">
                <div className="flex items-center gap-1.5">
                  {[0.3, 0.15, 0].map((delay, i) => (
                    <div
                      key={i}
                      className="h-1.5 w-1.5 rounded-full bg-gray-400 animate-bounce"
                      style={{ animationDelay: `-${delay}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </section>

      <footer className=" border-gray-700 bg-gray-800 p-4">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative">
          <div className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message AI Agent..."
              className="flex-1 py-3 px-4 rounded-2xl border border-gray-600 bg-gray-700 text-white placeholder-gray-400 pr-12"
              disabled={isLoading}
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-1.5 rounded-xl h-9 w-9 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white"
            >
              <ArrowRight />
            </Button>
          </div>
        </form>
      </footer>
    </main>
  );
}
