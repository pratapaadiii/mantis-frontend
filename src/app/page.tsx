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
      customFeature: "", // New field for custom features
    },
    validationSchema: Yup.object({
      appName: Yup.string()
        .max(50, "App name cannot exceed 50 characters")
        .required("App name is required"),
      purpose: Yup.string()
        .min(20, "Purpose must be at least 20 characters long")
        .required("Purpose is required"),
      features: Yup.array().min(1, "Select at least one feature"),
      customFeature: Yup.string().max(30, "Feature name is too long"),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      setSubmissionSuccess(false);
      try {
        const response = await fetch("/api/roadmap", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "API request failed");
        }

        const data = await response.json();
        setRoadmap(data);
        setSubmissionSuccess(true);
      } catch (error) {
        alert(error.message || "Failed to generate roadmap");
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-purple-50 relative">
      <Header />
      <main className="container mx-auto p-6 flex-grow">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-3xl mx-auto relative">
          <h2 className="text-3xl font-bold text-blue-800 mb-6 text-center">
            Let's Build Your MVP!
          </h2>

          {/* Success Feedback */}
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
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition-all`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.appName}
              />
              {formik.errors.appName && formik.touched.appName && (
                <p className="text-red-500 text-sm mt-1">
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
                placeholder="Describe your app's purpose..."
                className={`w-full p-3 border ${
                  formik.errors.purpose && formik.touched.purpose
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition-all h-32`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.purpose}
              />
              {formik.errors.purpose && formik.touched.purpose && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.purpose}
                </p>
              )}
            </div>

            {/* Features Field */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Key Features
              </label>
              <select
                name="features"
                multiple
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition-all"
                onChange={(e) => {
                  const options = e.target.options;
                  const values = [];
                  for (let i = 0; i < options.length; i++) {
                    if (options[i].selected) {
                      values.push(options[i].value);
                    }
                  }
                  formik.setFieldValue("features", values);
                }}
              >
                <option value="user-auth">User Authentication</option>
                <option value="payments">Payment Gateway</option>
                <option value="social">Social Sharing</option>
              </select>
              {formik.errors.features && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.features}
                </p>
              )}
            </div>

            {/* Custom Feature Field */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Add a Custom Feature
              </label>
              <input
                name="customFeature"
                type="text"
                placeholder="e.g., AI Recommendations"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition-all"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.customFeature}
              />
              {formik.errors.customFeature && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.customFeature}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={isLoading}
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
                    <h4 className="text-xl font-medium text-blue-700 mb-2">
                      {phase.name}
                    </h4>
                    <p className="text-gray-600 mb-2">
                      Timeline: {phase.timeline}
                    </p>
                    <ul className="list-disc ml-6 text-gray-700">
                      {phase.tasks?.map((task, taskIndex) => (
                        <li key={taskIndex}>{task}</li>
                      ))}
                    </ul>
                  </div>
                ))
              ) : (
                <p className="text-red-500">No roadmap phases found.</p>
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
