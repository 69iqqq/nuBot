"use client";

import { useEffect, useRef, useState } from "react";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import Greeting from "@/components/Greeting";
import { Cloud } from "@/components/BotCloud";
import { ArrowUpFromDot, Copy } from "lucide-react";
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

  const getGeminiResponse = async (userMessage: string, appendMessage: (chunk: string) => void) => {
    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userMessage }),
      });

      if (!response.body) {
        throw new Error("Response body is empty.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let accumulatedText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulatedText += chunk;

        // Append the new chunk to the AI message
        appendMessage(chunk);
      }

      return accumulatedText;
    } catch (error) {
      console.error("Error streaming AI response:", error);
      return "Error communicating with AI.";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading) return;

    setInput("");
    setIsLoading(true);

    // Create and add user message to state
    const userMessage: Doc<"messages"> = {
      _id: `temp_${Date.now()}`,
      chatId,
      content: trimmedInput,
      role: "user",
      createdAt: Date.now(),
    } as Doc<"messages">;

    setMessages((prev) => [...prev, userMessage]);

    // Create an empty AI message placeholder
    const assistantMessage: Doc<"messages"> = {
      _id: `temp_assistant_${Date.now()}`,
      chatId,
      content: "",
      role: "assistant",
      createdAt: Date.now(),
    } as Doc<"messages">;

    setMessages((prev) => [...prev, assistantMessage]);

    // Function to update AI message content dynamically
    const appendMessage = (chunk: string) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === assistantMessage._id ? { ...msg, content: msg.content + chunk } : msg
        )
      );
    };

    // Start streaming response
    const fullResponse = await getGeminiResponse(trimmedInput, appendMessage);

    // Store final response in Convex
    try {
      const convex = getConvexClient();
      await convex.mutation(api.messages.store, {
        chatId,
        content: trimmedInput,
        role: "user",
      });

      await convex.mutation(api.messages.store, {
        chatId,
        content: fullResponse,
        role: "assistant",
      });
    } catch (error) {
      console.error("Error saving messages:", error);
    }

    setIsLoading(false);
  };

  return (
    <main className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Chat messages container */}
      <section className="flex-1 overflow-y-auto bg-gray-800 p-2 md:p-0">
        <div className="max-w-4xl mx-auto p-4 space-y-3">
          {messages?.length === 0 && <Greeting />}
          {messages?.map((message: Doc<"messages">) => (
            <div key={message._id} className="relative group">
              {message.role === "user" && (
                <span className="text-xs text-gray-400 block mb-3 mt-5">
                  {new Date(message.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              )}
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

      {/* Input field container (always fixed at the bottom) */}
      <footer className="sticky bottom-0 bg-gray-800 p-4 border-t border-gray-700">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative">
          <div className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message nuBot"
              className="flex-1 py-3 px-4 rounded-2xl border border-gray-600 bg-gray-700 text-white placeholder-gray-400 pr-12"
              disabled={isLoading}
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-1.5 rounded-xl h-9 w-9 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white"
            >
              <ArrowUpFromDot />
            </Button>
          </div>
        </form>
      </footer>
    </main>
  );
}
