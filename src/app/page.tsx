"use client";
import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useFormik } from 'formik';
import * as Yup from 'yup';

// Type definitions for roadmap data
type Phase = {
  name: string;
  timeline: string;
  tasks: string[];
};

type Roadmap = {
  phases: Phase[];
};

// Form validation schema
const validationSchema = Yup.object({
  appName: Yup.string().required('App name is required'),
  purpose: Yup.string().required('Purpose is required'),
  features: Yup.array().min(1, 'Select at least one feature'),
});

export default function Home() {
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      appName: '',
      purpose: '',
      features: [] as string[],
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/roadmap', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'API request failed');
        }

        const data = await response.json();
        setRoadmap(data);
      } catch (error) {
        alert(error.message || 'Failed to generate roadmap');
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto p-4 flex-grow">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Let's Build Your MVP!</h2>
          
          <form onSubmit={formik.handleSubmit}>
            <div className="space-y-4">
              {/* App Name Field */}
              <div>
                <label className="block text-gray-700 mb-2">App Name</label>
                <input
                  name="appName"
                  type="text"
                  placeholder="e.g., Fitness Tracker"
                  className="w-full p-2 border rounded-md"
                  onChange={formik.handleChange}
                  value={formik.values.appName}
                />
                {formik.errors.appName && (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.appName}
                  </p>
                )}
              </div>

              {/* App Purpose Field */}
              <div>
                <label className="block text-gray-700 mb-2">App Purpose</label>
                <textarea
                  name="purpose"
                  placeholder="Describe your app's purpose..."
                  className="w-full p-2 border rounded-md h-24"
                  onChange={formik.handleChange}
                  value={formik.values.purpose}
                />
                {formik.errors.purpose && (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.purpose}
                  </p>
                )}
              </div>

              {/* Features Field */}
              <div>
                <label className="block text-gray-700 mb-2">Key Features</label>
                <select
                  name="features"
                  multiple
                  className="w-full p-2 border rounded-md"
                  onChange={(e) => {
                    const options = e.target.options;
                    const values = [];
                    for (let i = 0; i < options.length; i++) {
                      if (options[i].selected) {
                        values.push(options[i].value);
                      }
                    }
                    formik.setFieldValue('features', values);
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

              {/* Submit Button */}
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                disabled={isLoading}
              >
                {isLoading ? 'Generating...' : 'Generate Roadmap'}
              </button>
            </div>
          </form>

          {/* Loading State */}
          {isLoading && (
            <div className="mt-8 space-y-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          )}

          {/* Roadmap Display */}
          {roadmap && (
            <div className="mt-8 bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Your MVP Roadmap</h3>
              {roadmap.phases?.length > 0 ? (
                roadmap.phases.map((phase, index) => (
                  <div key={index} className="mb-6">
                    <h4 className="text-lg font-medium text-gray-800">
                      {phase.name}
                    </h4>
                    <p className="text-gray-600 mb-2">Timeline: {phase.timeline}</p>
                    <ul className="list-disc ml-6">
                      {phase.tasks?.map((task, taskIndex) => (
                        <li key={taskIndex} className="text-gray-700">
                          {task}
                        </li>
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
      </main>
      <Footer />
    </div>
  );
}