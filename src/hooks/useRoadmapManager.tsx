import { useState, useEffect } from "react";

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

export function useRoadmapManager() {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [activeRoadmapId, setActiveRoadmapId] = useState<string | null>(null);
  const [chatHistories, setChatHistories] = useState<Record<string, ChatMessage[]>>({});

  // Load from localStorage
  useEffect(() => {
    const savedRoadmaps = localStorage.getItem("roadmaps");
    const savedChatHistories = localStorage.getItem("chatHistories");
    if (savedRoadmaps) setRoadmaps(JSON.parse(savedRoadmaps));
    if (savedChatHistories) setChatHistories(JSON.parse(savedChatHistories));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("roadmaps", JSON.stringify(roadmaps));
    localStorage.setItem("chatHistories", JSON.stringify(chatHistories));
  }, [roadmaps, chatHistories]);

  const addRoadmap = (newRoadmap: Roadmap) => {
    setRoadmaps((prev) => [...prev, newRoadmap]);
    setActiveRoadmapId(newRoadmap.id);
    setChatHistories((prev) => ({ ...prev, [newRoadmap.id]: [] }));
  };

  const deleteRoadmap = (id: string) => {
    setRoadmaps((prev) => prev.filter((r) => r.id !== id));
    setChatHistories((prev) => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
    if (activeRoadmapId === id) setActiveRoadmapId(null);
  };

  const clearAll = () => {
    setRoadmaps([]);
    setChatHistories({});
    setActiveRoadmapId(null);
  };

  return {
    roadmaps,
    activeRoadmapId,
    chatHistories,
    setChatHistories, // Ensure this is returned
    addRoadmap,
    deleteRoadmap,
    clearAll,
    setActiveRoadmapId,
  };
}