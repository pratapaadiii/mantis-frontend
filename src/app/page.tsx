"use client";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Footer from "../components/Footer";

// Types
type Phase = {
  name: string;
  timeline: string;
  tasks: string[];
  milestones: string[];
};

type Roadmap = {
  phases: Phase[];
};

// LoadingOverlay Component
function LoadingOverlay() {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="flex items-center justify-center space-x-3">
        <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-white"></div>
        <span className="text-white font-semibold text-lg">
          Generating Roadmap...
        </span>
      </div>
    </div>
  );
}

// RoadmapDisplay Component
function RoadmapDisplay({ roadmap }: { roadmap: Roadmap }) {
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
        <div key={index} className="mb-6">
          <div className="flex justify-between items-start mb-3">
            <h4 className="text-xl font-medium text-blue-700">
              {phase.name}
            </h4>
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
      ))}
    </div>
  );
}

// FeatureList Component
function FeatureList({ formik }: { formik: any }) {
  const addFeature = () => {
    if (formik.values.newFeature.trim() === "") return;
    if (formik.values.features.length >= 5) {
      alert("Maximum 5 features allowed");
      return;
    }
    formik.setFieldValue("features", [
      ...formik.values.features,
      formik.values.newFeature.trim(),
    ]);
    formik.setFieldValue("newFeature", "");
  };

  const removeFeature = (index: number) => {
    formik.setFieldValue(
      "features",
      formik.values.features.filter((_: any, i: number) => i !== index)
    );
  };

  return (
    <div>
      <label className="block text-gray-700 font-medium mb-2">
        Core Features (3-5)
      </label>
      <div className="space-y-2">
        {formik.values.features.map((feature: string, index: number) => (
          <div key={index} className="flex items-center space-x-2">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg flex-grow">
              {feature}
            </span>
            <button
              type="button"
              onClick={() => removeFeature(index)}
              className="text-red-600 hover:text-red-800"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <div className="mt-2 flex space-x-2">
        <input
          type="text"
          name="newFeature"
          placeholder="Add a new feature"
          className="flex-grow p-3 border border-gray-300 rounded-lg"
          value={formik.values.newFeature}
          onChange={formik.handleChange}
          onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
        />
        <button
          type="button"
          onClick={addFeature}
          className="bg-blue-600 text-white px-4 rounded-lg hover:bg-blue-700"
        >
          Add
        </button>
      </div>
      {formik.errors.features && (
        <p className="text-red-600 text-sm mt-1">{formik.errors.features}</p>
      )}
    </div>
  );
}

// RoadmapForm Component
function RoadmapForm({ 
  onSubmit, 
  isLoading 
}: { 
  onSubmit: (values: { appName: string; purpose: string; features: string[] }) => void;
  isLoading: boolean;
}) {
  const formik = useFormik({
    initialValues: {
      appName: "",
      purpose: "",
      features: [] as string[],
      newFeature: "",
    },
    validationSchema: Yup.object({
      appName: Yup.string()
        .max(50, "App name cannot exceed 50 characters")
        .required("App name is required"),
      purpose: Yup.string()
        .min(20, "Purpose must be at least 20 characters long")
        .required("Purpose is required"),
      features: Yup.array()
        .of(Yup.string().required("Feature cannot be empty"))
        .min(3, "Please add at least 3 core features")
        .max(5, "Maximum 5 features allowed"),
      newFeature: Yup.string().max(30, "Feature name is too long"),
    }),
    onSubmit: (values) => {
      const payload = {
        appName: values.appName.trim(),
        purpose: values.purpose.trim(),
        features: values.features.filter(f => f.trim() !== ""),
      };

      if (payload.features.length < 3) {
        alert("Please provide at least 3 core features");
        return;
      }

      onSubmit(payload);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <div>
        <label className="block text-gray-700 font-medium mb-2">
          App Name
        </label>
        <input
          name="appName"
          type="text"
          placeholder="e.g., Fitness Tracker"
          className={`w-full p-3 border ${
            formik.errors.appName && formik.touched.appName
              ? "border-red-600"
              : "border-gray-300"
          } rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-gray-900 transition-all`}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.appName}
        />
        {formik.errors.appName && formik.touched.appName && (
          <p className="text-red-600 text-sm mt-1">{formik.errors.appName}</p>
        )}
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-2">
          App Purpose
        </label>
        <textarea
          name="purpose"
          placeholder="Describe your app's main purpose and target audience..."
          className={`w-full p-3 border ${
            formik.errors.purpose && formik.touched.purpose
              ? "border-red-600"
              : "border-gray-300"
          } rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-gray-900 transition-all h-32`}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.purpose}
        />
        {formik.errors.purpose && formik.touched.purpose && (
          <p className="text-red-600 text-sm mt-1">{formik.errors.purpose}</p>
        )}
      </div>

      <FeatureList formik={formik} />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
        disabled={isLoading || !formik.isValid}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span className="ml-2">Generating...</span>
          </span>
        ) : (
          "Generate Roadmap"
        )}
      </button>
    </form>
  );
}

// Main Page Component
export default function Home() {
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  const handleRoadmapSubmission = async (formData: {
    appName: string;
    purpose: string;
    features: string[];
  }) => {
    setIsLoading(true);
    setSubmissionSuccess(false);
    
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
      setRoadmap(data);
      setSubmissionSuccess(true);
    } catch (error) {
      alert(error.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-purple-50 relative">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold text-blue-900">MVP Roadmap Generator</h1>
        </div>
      </header>

      <main className="container mx-auto p-6 flex-grow">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-3xl mx-auto relative">
          <h2 className="text-3xl font-bold text-blue-800 mb-6 text-center">
            Let's Build Your MVP!
          </h2>

          {submissionSuccess && (
            <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-4">
              🎉 Your roadmap has been successfully generated!
            </div>
          )}

          <RoadmapForm 
            onSubmit={handleRoadmapSubmission} 
            isLoading={isLoading} 
          />

          {roadmap && <RoadmapDisplay roadmap={roadmap} />}
        </div>

        {isLoading && <LoadingOverlay />}
      </main>
      <Footer />
    </div>
  );
}