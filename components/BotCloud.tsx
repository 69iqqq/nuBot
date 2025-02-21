"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@clerk/nextjs";
import { BotIcon } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"; // Supports tables, strikethrough, etc.
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CloudProps {
  content: string;
  isUser?: boolean;
}

export function Cloud({ content, isUser }: CloudProps) {
  const { user } = useUser();

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`relative rounded-2xl px-4 py-2.5 max-w-[85%] md:max-w-[70%] lg:max-w-[60%] shadow-sm  ${isUser
          ? "bg-blue-600 text-white rounded-br-none ring-blue-700"
          : "bg-gray-800 text-gray-200 rounded-bl-none ring-gray-700"
          }`}
      >
        <div className="whitespace-pre-wrap text-[15px] leading-relaxed">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                return !inline && match ? (
                  <div className="w-[80vw] md:w-[70vw] lg:w-[60vw] overflow-auto mx-auto">
                    <SyntaxHighlighter
                      style={oneDark}
                      language={match[1]}
                      PreTag="div"
                      className="rounded-lg overflow-hidden p-3"
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  </div>
                ) : (
                  <code
                    className="bg-gray-700 text-white px-1 py-0.5 rounded"
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
          className={`absolute -bottom-3 ${isUser ? "-right-3" : "-left-3"}`}
        >
          <div
            className={`w-8 h-8 rounded-full border-2 ${isUser ? "bg-gray-900 border-gray-600" : "bg-blue-600 border-gray-900"
              } flex items-center justify-center shadow-sm`}
          >
            {isUser ? (
              <Avatar className="h-7 w-7">
                <AvatarImage src={user?.imageUrl} />
                <AvatarFallback>
                  {user?.firstName?.charAt(0)}
                  {user?.lastName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            ) : (
              <BotIcon className="h-5 w-5 text-white" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
