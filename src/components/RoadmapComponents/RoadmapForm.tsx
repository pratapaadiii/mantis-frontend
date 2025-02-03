import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FeatureList } from "./FeatureList";

type RoadmapFormProps = {
  onSubmit: (values: { appName: string; purpose: string; features: string[] }) => void;
  isLoading: boolean;
};

export function RoadmapForm({ onSubmit, isLoading }: RoadmapFormProps) {
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
        features: values.features.filter((f) => f.trim() !== ""),
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