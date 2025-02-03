import React from "react";

type SidebarProps = {
  roadmaps: Array<{ id: string; appName: string; timestamp: string }>;
  activeRoadmapId: string | null;
  onRoadmapSelect: (id: string) => void;
  onDeleteRoadmap: (id: string) => void;
  onClearAll: () => void;
  onCreateNew: () => void; // Function to create a new roadmap
};

const Sidebar: React.FC<SidebarProps> = ({
  roadmaps,
  activeRoadmapId,
  onRoadmapSelect,
  onDeleteRoadmap,
  onClearAll,
  onCreateNew,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  return (
    <div
      className={`fixed top-0 left-0 h-screen bg-gray-800 text-white shadow-lg z-50 transition-all duration-300 ${
        isSidebarOpen ? "w-64" : "w-16"
      }`}
    >
      {/* Header */}
      <div
        className="flex justify-between items-center p-4 border-b border-gray-700 cursor-pointer"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <h2 className={`text-lg font-semibold ${!isSidebarOpen && "hidden"}`}>
          Your Roadmaps
        </h2>
        <button className="text-gray-400 hover:text-white">
          {isSidebarOpen ? "←" : "→"}
        </button>
      </div>

      {/* Roadmap List */}
      <div className="p-4 overflow-y-auto">
        {roadmaps.length > 0 ? (
          roadmaps.map((roadmap) => (
            <div
              key={roadmap.id}
              className={`p-2 rounded-md cursor-pointer ${
                activeRoadmapId === roadmap.id ? "bg-gray-700" : "hover:bg-gray-600"
              }`}
              onClick={() => onRoadmapSelect(roadmap.id)}
            >
              <div className={`font-medium ${!isSidebarOpen && "hidden"}`}>
                {roadmap.appName}
              </div>
              <div
                className={`text-xs text-gray-400 ${
                  !isSidebarOpen && "hidden"
                }`}
              >
                {roadmap.timestamp}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No roadmaps yet.</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="p-4 border-t border-gray-700">
        <button
          className="w-full bg-blue-600 text-white py-2 rounded-md mb-2"
          onClick={onCreateNew} // Trigger the "Create New Roadmap" action
        >
          Create New Roadmap
        </button>
        <button
          className="w-full bg-red-600 text-white py-2 rounded-md"
          onClick={onClearAll}
        >
          Clear All
        </button>
      </div>
    </div>
  );
};

export default Sidebar;