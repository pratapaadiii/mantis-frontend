import React from "react";
import ReactMarkdown from "react-markdown";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/cjs/styles/hljs";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  failed?: boolean;
};

type ChatMessageItemProps = {
  message: ChatMessage;
  onRetryMessage: (messageId: string) => void;
};

export function ChatMessageItem({ message, onRetryMessage }: ChatMessageItemProps) {
  const renderContent = (content: string) => {
    if (content.startsWith("```") && content.endsWith("```")) {
      const language = content.split("\n")[0].replace(/```/g, "").trim();
      const code = content.split("\n").slice(1, -1).join("\n");
      return (
        <div className="relative">
          <SyntaxHighlighter language={language} style={atomOneDark} className="p-4 rounded-lg shadow-md">
            {code}
          </SyntaxHighlighter>
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            onClick={() => navigator.clipboard.writeText(code).then(() => alert("Code copied to clipboard!"))}
          >
            📋
          </button>
        </div>
      );
    }
    return <ReactMarkdown className="prose prose-sm">{content}</ReactMarkdown>;
  };

  return (
    <div
      className={`p-3 pb-8 rounded-lg mb-2 relative ${
        message.role === "user" ? "bg-blue-100" : "bg-green-100"
      }`}
    >
      {renderContent(message.content)}
      <div className="absolute bottom-2 right-2 flex space-x-2">
        <span className="text-xs text-gray-500">{message.timestamp}</span>
        {message.role === "user" && message.failed && (
          <button
            onClick={() => onRetryMessage(message.id)}
            className="text-gray-500 hover:text-gray-700"
          >
            🔄
          </button>
        )}
        {message.role === "assistant" && (
          <>
            <button
              onClick={() =>
                navigator.clipboard.writeText(message.content).then(() => alert("Message copied to clipboard!"))
              }
              className="text-gray-500 hover:text-gray-700"
            >
              📋
            </button>
            <button
              onClick={() => {
                if (confirm("Are you sure you want to clear the chat?")) {
                  // Clear chat history logic should be handled by parent
                  alert("Clear chat functionality not implemented here.");
                }
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              🗑️
            </button>
          </>
        )}
      </div>
    </div>
  );
}