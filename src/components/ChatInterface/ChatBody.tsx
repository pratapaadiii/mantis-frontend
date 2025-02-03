import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import JumpToLatestButton from "./JumpToLatestButton"; // Import the component

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  failed?: boolean;
};

type ChatBodyProps = {
  messages: ChatMessage[];
  isLoading: boolean;
  onRetryMessage: (id: string) => void;
  chatBodyRef: React.RefObject<HTMLDivElement>;
};

const renderContent = (content: string) => {
  if (content.startsWith("```") && content.endsWith("```")) {
    const language = content.split("\n")[0].replace(/```/g, "").trim();
    const code = content.split("\n").slice(1, -1).join("\n");
    return (
      <div className="relative">
        <SyntaxHighlighter
          language={language}
          style={atomOneDark}
          className="p-4 rounded-lg shadow-md"
        >
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

export default function ChatBody({ messages, isLoading, onRetryMessage, chatBodyRef }: ChatBodyProps) {
  const [showJumpButton, setShowJumpButton] = useState(false);

  useEffect(() => {
    const chatBody = chatBodyRef.current;
    if (!chatBody) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = chatBody;
      const isAtBottom = scrollHeight - scrollTop === clientHeight;
      setShowJumpButton(!isAtBottom);
    };

    chatBody.addEventListener("scroll", handleScroll);
    return () => chatBody.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div ref={chatBodyRef} className="flex-1 p-4 overflow-y-auto relative">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`p-3 pb-8 rounded-lg mb-2 relative ${
            msg.role === "user" ? "bg-blue-100" : "bg-green-100"
          }`}
        >
          {renderContent(msg.content)}
          <div className="absolute bottom-2 right-2 flex space-x-2">
            <span className="text-xs text-gray-500">{msg.timestamp}</span>
            {msg.role === "user" && msg.failed && (
              <button
                onClick={() => onRetryMessage(msg.id)}
                className="text-gray-500 hover:text-gray-700"
              >
                🔄
              </button>
            )}
            {msg.role === "assistant" && (
              <>
                <button
                  onClick={() => navigator.clipboard.writeText(msg.content).then(() => alert("Message copied to clipboard!"))}
                  className="text-gray-500 hover:text-gray-700"
                >
                  📋
                </button>
                <button
                  onClick={() => {
                    if (confirm("Are you sure you want to clear the chat?")) {
                      onRetryMessage(""); // Clear chat history
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
      ))}

      {/* Render the JumpToLatestButton */}
      {messages.length > 0 && showJumpButton && (
        <JumpToLatestButton chatBodyRef={chatBodyRef} />
      )}

      {isLoading && (
        <div className="flex space-x-1 justify-center mt-4">
          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150"></div>
          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-300"></div>
        </div>
      )}
    </div>
  );
}