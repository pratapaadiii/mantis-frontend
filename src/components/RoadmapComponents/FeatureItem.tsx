import React from "react";

type FeatureItemProps = {
  feature: string;
  onRemove: () => void;
};

export function FeatureItem({ feature, onRemove }: FeatureItemProps) {
  return (
    <div className="flex items-center space-x-2">
      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg flex-grow">{feature}</span>
      <button
        type="button"
        onClick={onRemove}
        className="text-red-600 hover:text-red-800"
      >
        ✕
      </button>
    </div>
  );
}