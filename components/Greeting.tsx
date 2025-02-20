"use client";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function Greeting() {
  return (
    <div className="flex flex-col items-center justify-center h-full mt-10 text-gray-200">
      <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-6">
        Your Legendary Conversation with nuBot Begins Now! 🚀
      </h2>
      <div className="bg-gray-800 rounded-2xl shadow-sm ring-1 ring-inset ring-gray-700 px-6 py-5 max-w-lg w-full">
        <h2 className="text-xl font-semibold text-gray-100 mb-2">
          Welcome to nuBot! 🤖✨
        </h2>
        <ul className="list-disc list-inside text-gray-400 text-left space-y-2">
          <li><strong>Markdown Support:</strong> Format messages with **bold**, *italic*, and `code`.</li>
          <li><strong>Streaming Responses:</strong> Get real-time AI-generated content without delays.</li>
          <li><strong>Onedark Code Blocks:</strong> Experience beautifully styled syntax highlighting.</li>
        </ul>
        <SyntaxHighlighter language="javascript" style={oneDark} className="rounded-md mt-4">
          {"console.log(\"Comparison Is The Theif of Joy\");"}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
