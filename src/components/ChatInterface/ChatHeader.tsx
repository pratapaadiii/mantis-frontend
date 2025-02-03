import React from "react";

type ChatHeaderProps = {
  roadmap: { appName: string };
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
};

export default function ChatHeader({ roadmap, isOpen, setIsOpen }: ChatHeaderProps) {
  return (
    <div
      className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-4 flex justify-between items-center cursor-pointer hover:from-blue-700 hover:to-blue-600 transition-colors"
      onClick={() => setIsOpen(!isOpen)}
    >
      <h3 className="text-lg font-semibold">AI Chat - {roadmap.appName}</h3>
      <span>{isOpen ? "✕" : "💬"}</span>
    </div>
  );
}