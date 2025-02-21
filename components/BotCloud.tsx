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
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} px-4 py-3`}>
      <div
        className={`relative rounded-3xl px-6 py-4 max-w-[90%] md:max-w-[75%] lg:max-w-[65%] xl:max-w-[55%]  ${isUser
          ? "bg-blue-600 text-white rounded-br-none ring-blue-700"
          : "bg-gray-800 text-gray-200 rounded-bl-none ring-gray-700"
          }`}
      >
        <div className="whitespace-pre-wrap text-[16px] md:text-[17px] leading-relaxed">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                return !inline && match ? (
                  <div className="w-[75vw] md:w-[65vw] lg:w-[65vw] xl:w-[55vw] overflow-auto mx-auto">
                    <SyntaxHighlighter
                      style={oneDark}
                      language={match[1]}
                      PreTag="div"
                      className="rounded-lg overflow-hidden p-4"
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
