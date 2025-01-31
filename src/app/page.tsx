"use client";
import React, { useState, useEffect } from "react"; // Add useEffect here
import Sidebar from "../components/Sidebar";
import ChatInterface from "../components/ChatInterface";
import Footer from "../components/Footer";
import {
  RoadmapForm,
  RoadmapDisplay,
  LoadingOverlay,
} from "../components/RoadmapComponents";

// Types
type Phase = {
  name: string;
  timeline: string;
  tasks: string[];
  milestones: string[];
};

type Roadmap = {
  id: string;
  appName: string;
  purpose: string;
  features: string[];
  phases: Phase[];
  timestamp: string;
};

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
};

export default function Home() {
  // State Management
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [activeRoadmapId, setActiveRoadmapId] = useState<string | null>(null);
  const [chatHistories, setChatHistories] = useState<Record<string, ChatMessage[]>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Load roadmaps and chat histories from localStorage on component mount
  useEffect(() => {
    const savedRoadmaps = localStorage.getItem("roadmaps");
    const savedChatHistories = localStorage.getItem("chatHistories");

    if (savedRoadmaps) setRoadmaps(JSON.parse(savedRoadmaps));
    if (savedChatHistories) setChatHistories(JSON.parse(savedChatHistories));
  }, []);

  // Save roadmaps and chat histories to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("roadmaps", JSON.stringify(roadmaps));
    localStorage.setItem("chatHistories", JSON.stringify(chatHistories));
  }, [roadmaps, chatHistories]);

  // Handle generating a new roadmap
  const handleRoadmapSubmission = async (formData: {
    appName: string;
    purpose: string;
    features: string[];
  }) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate roadmap");
      }

      const data = await response.json();
      const newRoadmap: Roadmap = {
        id: Date.now().toString(),
        appName: formData.appName,
        purpose: formData.purpose,
        features: formData.features,
        phases: data.phases,
        timestamp: new Date().toLocaleString(),
      };

      setRoadmaps((prev) => [...prev, newRoadmap]);
      setActiveRoadmapId(newRoadmap.id);
      setChatHistories((prev) => ({ ...prev, [newRoadmap.id]: [] }));
    } catch (error) {
      alert(error.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle selecting a roadmap
  const handleRoadmapSelect = (id: string) => {
    setActiveRoadmapId(id);
  };

  // Handle deleting a roadmap
  const handleDeleteRoadmap = (id: string) => {
    setRoadmaps((prev) => prev.filter((r) => r.id !== id));
    setChatHistories((prev) => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
    if (activeRoadmapId === id) setActiveRoadmapId(null);
  };

  // Handle clearing all roadmaps
  const handleClearAll = () => {
    if (confirm("Are you sure you want to clear all roadmaps?")) {
      setRoadmaps([]);
      setChatHistories({});
      setActiveRoadmapId(null);
    }
  };

  // Get active roadmap and its chat history
  const activeRoadmap = roadmaps.find((r) => r.id === activeRoadmapId);
  const activeChatHistory = chatHistories[activeRoadmapId || ""] || [];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-purple-50 relative">
      {/* Sidebar */}
      <Sidebar
        roadmaps={roadmaps.map((r) => ({
          id: r.id,
          appName: r.appName,
          timestamp: r.timestamp,
        }))}
        activeRoadmapId={activeRoadmapId}
        onRoadmapSelect={handleRoadmapSelect}
        onDeleteRoadmap={handleDeleteRoadmap}
        onClearAll={handleClearAll}
        onCreateNew={() => setActiveRoadmapId(null)}
      />

      {/* Main Content */}
      <main className="container mx-auto p-6 flex-grow ml-64">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-3xl mx-auto relative">
          {!activeRoadmapId && (
            <RoadmapForm onSubmit={handleRoadmapSubmission} isLoading={isLoading} />
          )}

          {activeRoadmap && (
            <>
              <RoadmapDisplay roadmap={{ phases: activeRoadmap.phases }} />
              <ChatInterface
                roadmap={activeRoadmap}
                messages={activeChatHistory}
                onSendMessage={(message: ChatMessage) => {
                  setChatHistories((prev) => ({
                    ...prev,
                    [activeRoadmapId!]: [...(prev[activeRoadmapId!] || []), message],
                  }));
                }}
              />
            </>
          )}
        </div>
      </main>

      {/* Loading Overlay */}
      {isLoading && <LoadingOverlay />}

      <Footer />
    </div>
  );
}