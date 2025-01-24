"use client";
import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useFormik } from "formik";
import * as Yup from "yup";

type Phase = {
  name: string;
  timeline: string;
  tasks: string[];
  milestones: string[];
};

type Roadmap = {
  phases: Phase[];
};

export default function Home() {
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

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
    onSubmit: async (values) => {
      setIsLoading(true);
      setSubmissionSuccess(false);
      try {
        const payload = {
          appName: values.appName.trim(),
          purpose: values.purpose.trim(),
          features: values.features.filter(f => f.trim() !== ""),
        };

        if (payload.features.length < 3) {
          throw new Error("Please provide at least 3 core features");
        }

        const response = await fetch("/api/roadmap", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
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
    },
  });

  const addFeature = () => {
    if (formik.values.newFeature.trim() && formik.values.features.length < 5) {
      formik.setFieldValue("features", [
        ...formik.values.features,
        formik.values.newFeature.trim(),
      ]);
      formik.setFieldValue("newFeature", "");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-purple-50 relative">
      <Header />
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

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* App Name Field */}
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
                <p className="text-red-600 text-sm mt-1">
                  {formik.errors.appName}
                </p>
              )}
            </div>

            {/* App Purpose Field */}
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
                <p className="text-red-600 text-sm mt-1">
                  {formik.errors.purpose}
                </p>
              )}
            </div>

            {/* Features Field - Updated Contrast */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Core Features (Minimum 3)
              </label>
              
              <div className="mb-3 space-y-2">
                {formik.values.features.map((feature, index) => (
                  <div 
                    key={index} 
                    className="flex items-center bg-blue-50 border border-blue-200 p-2 rounded"
                  >
                    <span className="flex-grow text-blue-900">{feature}</span>
                    <button
                      type="button"
                      onClick={() => formik.setFieldValue(
                        "features",
                        formik.values.features.filter((_, i) => i !== index)
                      )}
                      className="text-blue-600 hover:text-blue-800 ml-2 font-bold"
                      aria-label="Remove feature"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  name="newFeature"
                  type="text"
                  placeholder="Enter a feature (e.g., User Authentication)"
                  className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-gray-900 transition-all"
                  onChange={formik.handleChange}
                  value={formik.values.newFeature}
                  onKeyPress={(e) => e.key === "Enter" && addFeature()}
                />
                <button
                  type="button"
                  onClick={addFeature}
                  className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  disabled={formik.values.features.length >= 5}
                >
                  Add Feature
                </button>
              </div>

              {formik.errors.features && (
                <p className="text-red-600 text-sm mt-1">
                  {formik.errors.features}
                </p>
              )}
              <p className="text-sm text-gray-600 mt-1">
                {5 - formik.values.features.length} features remaining
              </p>
            </div>

            {/* Submit Button */}
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

          {/* Roadmap Display */}
          {roadmap && (
            <div className="mt-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="text-2xl font-semibold text-blue-800 mb-4">
                Your MVP Roadmap
              </h3>
              {roadmap.phases?.length > 0 ? (
                roadmap.phases.map((phase, index) => (
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
                      <div>
                        <h5 className="font-medium mb-2">Key Tasks</h5>
                        <ul className="list-disc ml-6 space-y-1">
                          {phase.tasks?.map((task, taskIndex) => (
                            <li key={taskIndex} className="text-gray-700">
                              {task}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Milestones</h5>
                        <ul className="list-check ml-6 space-y-1">
                          {phase.milestones?.map((milestone, mIndex) => (
                            <li key={mIndex} className="text-gray-700">
                              ✓ {milestone}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-red-600">No roadmap phases found.</p>
              )}
            </div>
          )}
        </div>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
            <div className="flex items-center justify-center space-x-3">
              <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-white"></div>
              <span className="text-white font-semibold text-lg">
                Generating Roadmap...
              </span>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}