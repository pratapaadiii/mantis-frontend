"use client";

import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/cjs/styles/hljs";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  failed?: boolean;
};

export default function ChatInterface({ roadmap }: { roadmap: Roadmap }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const chatBodyRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = async (retryMessage?: ChatMessage) => {
    const messageContent = retryMessage ? retryMessage.content : input.trim();
    if (!messageContent) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: messageContent,
      timestamp: new Date().toLocaleTimeString(),
      failed: false,
    };
    setMessages((prev) => [...prev, userMessage]);
    if (!retryMessage) setInput("");
    setIsLoading(true);

    const timeoutId = setTimeout(() => {
      setIsLoading(false);
      setMessages((prev) =>
        prev.map((msg) =>
          msg === userMessage ? { ...msg, failed: true } : msg
        )
      );
      alert("Request timed out. Please try again.");
    }, 50000);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roadmap,
          messages: [...messages, userMessage],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      clearTimeout(timeoutId);
      const data = await response.json();
      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: data.message,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setHasNewMessage(true);
    } catch (error) {
      setMessages((prev) =>
        prev.map((msg) => (msg === userMessage ? { ...msg, failed: true } : msg))
      );
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetryMessage = (message: ChatMessage) => {
    handleSendMessage(message);
  };

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content).then(() => {
      alert("Message copied to clipboard!");
    });
  };

  const handleClearChat = () => {
    setMessages([]);
    setHasNewMessage(false);
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
            className="p-4 rounded-code shadow-code"
          >
            {code}
          </SyntaxHighlighter>
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            onClick={() => handleCopyMessage(code)}
          >
            📋
          </button>
        </div>
      );
    }
    return <ReactMarkdown className="prose prose-sm">{content}</ReactMarkdown>;
  };

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!isOpen && hasNewMessage) {
      alert("You have a new message!");
      setHasNewMessage(false);
    }
  }, [hasNewMessage, isOpen]);

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${
        isOpen ? "w-96 h-[500px]" : "w-20 h-20"
      }`}
    >
      <div
        className={`bg-white rounded-lg shadow-lg flex flex-col h-full overflow-hidden ${
          isOpen ? "border border-gray-200" : ""
        }`}
      >
        {/* Chat Header */}
        <div
          className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-4 flex justify-between items-center cursor-pointer hover:from-blue-700 hover:to-blue-600 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          <h3 className="text-lg font-semibold">AI Chat</h3>
          <div className="flex items-center">
            {hasNewMessage && !isOpen && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full mr-2">
                New
              </span>
            )}
            <span>{isOpen ? "✕" : "💬"}</span>
          </div>
        </div>

        {/* Chat Body */}
        {isOpen && (
          <div ref={chatBodyRef} className="flex-1 p-4 overflow-y-auto">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-3 pb-8 rounded-lg mb-2 relative ${
                  msg.role === "user" ? "bg-blue-100" : "bg-green-100"
                }`}
              >
                {renderContent(msg.content)}
                <div className="absolute bottom-2 right-2 flex space-x-2">
                  <span className="text-xs text-gray-500">
                    {msg.timestamp}
                  </span>
                  {msg.role === "user" && msg.failed && (
                    <button
                      onClick={() => handleRetryMessage(msg)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      🔄
                    </button>
                  )}
                  {msg.role === "assistant" && (
                    <>
                      <button
                        onClick={() => handleCopyMessage(msg.content)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        📋
                      </button>
                      <button
                        onClick={handleClearChat}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        🗑️
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-dot-animation"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-dot-animation delay-200"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-dot-animation delay-400"></div>
              </div>
            )}
          </div>
        )}

        {/* Chat Input */}
        {isOpen && (
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-grow p-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                placeholder="Ask a question..."
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 rounded-xl shadow-md hover:from-blue-600 hover:to-blue-700"
                disabled={isLoading}
              >
                {isLoading ? "..." : "Send"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}