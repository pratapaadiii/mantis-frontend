// Types for Roadmap and Chat Components

// Phase Type
export type Phase = {
    name: string;
    timeline: string;
    tasks: string[];
    milestones: string[];
  };
  
  // Roadmap Type
  export type Roadmap = {
    id?: string; // Optional ID for new roadmaps
    appName: string;
    purpose: string;
    features: string[];
    phases: Phase[];
    timestamp?: string; // Optional timestamp for new roadmaps
  };
  
  // ChatMessage Type
  export type ChatMessage = {
    role: "user" | "assistant";
    content: string;
    timestamp: string;
  };