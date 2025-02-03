"use client";
import { useState, useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader";
import ChatBody from "./ChatBody";
import ChatInput from "./ChatInput";

// Types
type ChatMessage = {
  id: string; // Unique identifier for each message
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  failed?: boolean;
};

type Roadmap = {
  appName: string;
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

  // Use useRef consistently
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
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
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

    if (!retryMessageId) {
      onSendMessage(userMessage);
      setInput("");
    }

    setIsLoading(true);
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
      onSendMessage({ ...userMessage, failed: true }); // Mark message as failed
      alert("Request timed out. Please try again.");
    }, 62000); // 50-second timeout

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

  // Handle retrying a failed message
  const handleRetryMessage = (messageId: string) => {
    handleSendMessage(messageId);
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
        <ChatHeader
          roadmap={roadmap}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />

        {/* Chat Body */}
        {isOpen && (
          <>
            <ChatBody
              messages={messages}
              isLoading={isLoading}
              onRetryMessage={(id) => handleRetryMessage(id)}
              chatBodyRef={chatBodyRef} // Pass the ref to ChatBody
            />
          </>
        )}

        {/* Chat Input */}
        {isOpen && (
          <ChatInput
            input={input}
            setInput={setInput}
            isLoading={isLoading}
            onSendMessage={() => handleSendMessage()}
            textareaRef={textareaRef} // Pass the ref to ChatInput
          />
        )}
      </div>
    </div>
  );
}