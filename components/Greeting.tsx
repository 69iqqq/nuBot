"use client";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function Greeting() {
  return (
    <div className="flex flex-col items-center justify-center h-full mt-3 px-2 text-gray-300 text-center ">
      <h2 className="text-lg font-bold bg-gradient-to-r from-gray-400 to-gray-600 bg-clip-text text-transparent mb-2">
        Starting of Legendary conversation with nuBot 🚀
      </h2>
      <div className="bg-gray-800 rounded-md shadow-sm ring-1 ring-gray-700 px-2 py-3 max-w-[220px] w-full">
        <h2 className="text-sm font-semibold text-gray-100 mb-1">Welcome to nuBot! 🤖</h2>
        <ul className="list-disc list-inside text-gray-400 text-left text-[11px] space-y-1">
          <li><strong>Markdown:</strong> **bold**, *italic*, `code`</li>
          <li><strong>AI Replies:</strong> Live, streaming responses</li>
          <li><strong>Code Format:</strong> Syntax highlighting</li>
        </ul>
        <div className="mt-2 max-w-full overflow-x-auto rounded-md">
          <SyntaxHighlighter language="javascript" style={oneDark} className="rounded-md text-[10px]">
            {"console.log(\"Keep Growing!\");"}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
}
