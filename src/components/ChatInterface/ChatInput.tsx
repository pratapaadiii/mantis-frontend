import React, { useRef } from "react";

type ChatInputProps = {
  input: string;
  setInput: (value: string) => void;
  isLoading: boolean;
  onSendMessage: () => void;
};

export default function ChatInput({ input, setInput, isLoading, onSendMessage }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
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
          onClick={onSendMessage}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 rounded-xl shadow-md hover:from-blue-600 hover:to-blue-700 h-[40px]"
          disabled={isLoading}
        >
          {isLoading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}