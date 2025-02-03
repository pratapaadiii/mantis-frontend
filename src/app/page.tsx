"use client";
import React, { useState } from "react"; // Removed useEffect since it's unused
import Sidebar from "../components/Sidebar/Sidebar";
import ChatInterface from "../components/ChatInterface/ChatInterface";
import Footer from "../components/Footer";
import {
  RoadmapForm,
  RoadmapDisplay,
  LoadingOverlay,
} from "../components/RoadmapComponents";
import { useRoadmapManager } from "../hooks/useRoadmapManager";

export default function Home() {
  const {
    roadmaps,
    activeRoadmapId,
    chatHistories,
    setChatHistories, // Ensure this is destructured
    addRoadmap,
    deleteRoadmap,
    clearAll,
    setActiveRoadmapId,
  } = useRoadmapManager();

  const [isLoading, setIsLoading] = useState(false);

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
      const newRoadmap = {
        id: Date.now().toString(),
        appName: formData.appName,
        purpose: formData.purpose,
        features: formData.features,
        phases: data.phases,
        timestamp: new Date().toLocaleString(),
      };

      addRoadmap(newRoadmap); // Add the new roadmap to the state
    } catch (error) {
      alert(error.message || "An error occurred");
    } finally {
      setIsLoading(false);
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
        onRoadmapSelect={setActiveRoadmapId}
        onDeleteRoadmap={deleteRoadmap}
        onClearAll={clearAll}
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
                onSendMessage={(message) => {
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

      {/* Footer */}
      <Footer />
    </div>
  );
}