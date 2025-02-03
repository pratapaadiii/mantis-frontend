import React from "react";

type FeatureListProps = {
  formik: any;
};

export function FeatureList({ formik }: FeatureListProps) {
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
          onKeyPress={(e) =>
            e.key === "Enter" && (e.preventDefault(), addFeature())
          }
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