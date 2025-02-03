import React, { useState } from "react";
import { PhaseDisplay } from "./PhaseDisplay";

type Phase = {
  name: string;
  timeline: string;
  tasks: string[];
  milestones: string[];
};

type Roadmap = {
  phases: Phase[];
};

type RoadmapDisplayProps = {
  roadmap: Roadmap;
};

export function RoadmapDisplay({ roadmap }: RoadmapDisplayProps) {
  const [isCopied, setIsCopied] = useState(false);

  const copyRoadmapToClipboard = () => {
    const roadmapText = roadmap.phases
      .map((phase) => {
        return `**${phase.name}** (${phase.timeline})\n` +
          `- Key Tasks:\n${phase.tasks.map((task) => `  • ${task}`).join("\n")}\n` +
          `- Milestones:\n${phase.milestones.map((milestone) => `  ✓ ${milestone}`).join("\n")}`;
      })
      .join("\n\n");

    navigator.clipboard
      .writeText(roadmapText)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
      })
      .catch(() => {
        alert("Failed to copy roadmap to clipboard.");
      });
  };

  if (!roadmap.phases?.length) {
    return <p className="text-red-600">No roadmap phases found.</p>;
  }

  return (
    <div className="mt-8 bg-gray-50 p-6 rounded-lg border border-gray-200 relative">
      <button
        onClick={copyRoadmapToClipboard}
        className="absolute top-4 right-4 p-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-all"
        title="Copy Roadmap"
      >
        {isCopied ? (
          <span className="text-green-600">✓ Copied!</span>
        ) : (
          <span>📋</span>
        )}
      </button>

      <h3 className="text-2xl font-semibold text-blue-800 mb-4">
        Your MVP Roadmap
      </h3>
      {roadmap.phases.map((phase, index) => (
        <PhaseDisplay key={index} phase={phase} />
      ))}
    </div>
  );
}