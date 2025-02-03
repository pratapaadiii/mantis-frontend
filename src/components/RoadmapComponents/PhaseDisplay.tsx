import React from "react";

type Phase = {
  name: string;
  timeline: string;
  tasks: string[];
  milestones: string[];
};

type PhaseDisplayProps = {
  phase: Phase;
};

export function PhaseDisplay({ phase }: PhaseDisplayProps) {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-start mb-3">
        <h4 className="text-xl font-medium text-blue-700">{phase.name}</h4>
        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
          {phase.timeline}
        </span>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {/* Key Tasks Section */}
        <div>
          <h5 className="font-medium mb-2 text-blue-600">Key Tasks</h5>
          <ul className="list-disc ml-6 space-y-1">
            {phase.tasks?.map((task, taskIndex) => (
              <li key={taskIndex} className="text-gray-800">
                {task}
              </li>
            ))}
          </ul>
        </div>

        {/* Milestones Section */}
        <div>
          <h5 className="font-medium mb-2 text-green-600">Milestones</h5>
          <ul className="list-check ml-6 space-y-1">
            {phase.milestones?.map((milestone, mIndex) => (
              <li key={mIndex} className="text-gray-800">
                <span className="text-green-600 mr-2">✓</span>
                {milestone}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}