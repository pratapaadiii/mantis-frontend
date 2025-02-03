import React from "react";

export function LoadingOverlay() {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="flex items-center justify-center space-x-3">
        <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-white"></div>
        <span className="text-white font-semibold text-lg">Generating Roadmap...</span>
      </div>
    </div>
  );
}