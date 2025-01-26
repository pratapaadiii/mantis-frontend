// mantis-frontend/src/components/ChatInterface.tsx
"use client";
import { useState } from "react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatInterface({ roadmap }: { roadmap: Roadmap }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // State to control chat visibility

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

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

      const data = await response.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.message }]);
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
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
          className="bg-blue-600 text-white p-4 flex justify-between items-center cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <h3 className="text-lg font-semibold">AI Chat</h3>
          <span>{isOpen ? "✕" : "💬"}</span>
        </div>

        {/* Chat Body */}
        {isOpen && (
          <div className="flex-1 p-4 overflow-y-auto">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg mb-2 ${
                  msg.role === "user" ? "bg-blue-100" : "bg-green-100"
                }`}
              >
                <p className="text-gray-800">{msg.content}</p>
              </div>
            ))}
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
                className="flex-grow p-2 border border-gray-300 rounded-lg"
                placeholder="Ask a question..."
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                className="bg-blue-600 text-white px-4 rounded-lg hover:bg-blue-700"
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