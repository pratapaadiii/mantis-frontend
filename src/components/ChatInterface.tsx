"use client";
import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import JumpToLatestButton from "../components/JumpToLatestButton";

// Types
type ChatMessage = {
  id: string; // Unique identifier for each message
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  failed?: boolean;
};

type ChatInterfaceProps = {
  roadmap: Roadmap; // The active roadmap
  messages: ChatMessage[]; // Chat history for the active roadmap
  onSendMessage: (message: ChatMessage) => void; // Function to send a new message
};

export default function ChatInterface({ roadmap, messages, onSendMessage }: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const chatBodyRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea as content grows
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [input]);

  // Scroll to the bottom when new messages are added
  const scrollToBottom = () => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = async (retryMessageId?: string) => {
    const messageContent = retryMessageId
      ? messages.find((msg) => msg.id === retryMessageId)?.content.trim()
      : input.trim();

    if (!messageContent) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: messageContent,
      timestamp: new Date().toLocaleTimeString(),
      failed: false,
    };

    // Add the user's message to the chat history if it's not a retry
    if (!retryMessageId) {
      onSendMessage(userMessage);
      setInput("");
    }

    setIsLoading(true);
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
      onSendMessage({ ...userMessage, failed: true }); // Mark message as failed
      alert("Request timed out. Please try again.");
    }, 50000); // 50-second timeout

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
        id: Date.now().toString(),
        role: "assistant",
        content: data.message,
        timestamp: new Date().toLocaleTimeString(),
      };
      onSendMessage(assistantMessage); // Add the assistant's response to the chat history
    } catch (error) {
      onSendMessage({ ...userMessage, failed: true }); // Mark message as failed
      alert(error.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

    // Handle pressing Enter key to send a message
    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    };

  // Handle retrying a failed message
  const handleRetryMessage = (messageId: string) => {
    handleSendMessage(messageId);
  };

  // Render syntax-highlighted code blocks or markdown content
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
          <h3 className="text-lg font-semibold">AI Chat - {roadmap.appName}</h3>
          <span>{isOpen ? "✕" : "💬"}</span>
        </div>

        {/* Chat Body */}
        {isOpen && (
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
                      onClick={() => handleRetryMessage(msg.id)}
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
                            onSendMessage([]); // Clear chat history
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
            {isLoading && (
              <div className="flex space-x-1 justify-center mt-4">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-300"></div>
              </div>
            )}
            {/* Jump to Latest Button */}
            <JumpToLatestButton chatBodyRef={chatBodyRef} />
          </div>
        )}

        {/* Chat Input */}
        {isOpen && (
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-grow p-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none min-h-[40px] max-h-[150px] overflow-y-auto"
                placeholder="Ask a question..."
                disabled={isLoading}
                rows={1}
              />
              <button
                onClick={() => handleSendMessage()}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 rounded-xl shadow-md hover:from-blue-600 hover:to-blue-700 h-[40px]"
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