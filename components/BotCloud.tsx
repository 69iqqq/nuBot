"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@clerk/nextjs";
import { BotIcon, Copy } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"; // Supports tables, strikethrough, etc.
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useState } from "react";

interface CloudProps {
  content: string;
  isUser?: boolean;
}

export function Cloud({ content, isUser }: CloudProps) {
  const { user } = useUser();
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} px-4 py-3`}>
      <div
        className={`relative rounded-3xl px-6 py-4 ${isUser
          ? "max-w-[90%] md:max-w-[75%] lg:max-w-[65%] xl:max-w-[55%] bg-blue-600 text-white rounded-br-none ring-blue-700"
          : "w-[75vw] md:w-[65vw] lg:w-[65vw] xl:w-[55vw] bg-gray-800 text-gray-200 rounded-bl-none ring-gray-700"
          }`}
      >
        <div className="whitespace-pre-wrap text-[16px] md:text-[17px] leading-relaxed">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                const language = match ? match[1] : "";
                return !inline && match ? (
                  <div className="relative w-[75vw] md:w-[65vw] lg:w-[65vw] xl:w-[55vw] overflow-auto mx-auto">
                    <div className="flex justify-between items-center bg-gray-900 text-gray-200 px-4 py-2 rounded-t-lg">
                      <span className="text-sm font-medium">{language}</span>
                      <div className="flex gap-2">
                        <button onClick={() => setShowLineNumbers(!showLineNumbers)} className="text-sm hover:text-white">
                          {showLineNumbers ? "Hide Line Numbers" : "Show Line Numbers"}
                        </button>
                        <button onClick={() => handleCopy(String(children))} className="flex items-center gap-1 text-sm hover:text-white">
                          <Copy className="h-4 w-4" /> {copied ? "Copied!" : "Copy"}
                        </button>
                      </div>
                    </div>
                    <SyntaxHighlighter
                      style={oneDark}
                      language={language}
                      PreTag="div"
                      showLineNumbers={showLineNumbers}
                      className="rounded-b-lg overflow-hidden p-4"
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  </div>
                ) : (
                  <code
                    className="bg-gray-700 text-white px-2 py-1 rounded"
                    {...props}
                  >
                    {children}
                  </code>
                );
              },
            }}
          >
            {content}
          </ReactMarkdown>
        </div>

        {/* Adjusted avatar placement */}
        <div
          className={`absolute -bottom-4 ${isUser ? "-right-4" : "-left-4"}`}
        >
          <div
            className={`w-10 h-10 rounded-full border-2 ${isUser ? "bg-gray-900 border-gray-600" : "bg-blue-600 border-gray-900"
              } flex items-center justify-center shadow-md`}
          >
            {isUser ? (
              <Avatar className="h-9 w-9">
                <AvatarImage src={user?.imageUrl} />
                <AvatarFallback>
                  {user?.firstName?.charAt(0)}
                  {user?.lastName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            ) : (
              <BotIcon className="h-6 w-6 text-white" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
