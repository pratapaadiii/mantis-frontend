"use client"; // Critical for client components using React hooks

import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  appName: Yup.string().required('App name is required'),
  purpose: Yup.string().required('Purpose is required'),
  features: Yup.array().min(1, 'Select at least one feature'),
});

export default function Home() {
  const formik = useFormik({
    initialValues: {
      appName: '',
      purpose: '',
      features: [],
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  // ADD THE RETURN STATEMENT WITH FORM
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
                  onChange={e => {
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
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Generate Roadmap
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}