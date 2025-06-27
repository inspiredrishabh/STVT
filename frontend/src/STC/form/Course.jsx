import React, { useEffect } from "react";

const Course = ({ formData, onChange }) => {
  const courseModules = {
    "MSE-C": 52,
    "MSE-D": 52,
    "MSE-W": 52,
    "MJR-C": 52,
    "MJR-D": 52,
    "MJR-W": 52,
    "MJI-C": 52,
    "MJI-D": 52,
    "MJ1-W": 52,
    "MJP-C": 13,
    "MJP-D": 13,
    "MJP-W": 13,
    "ASE": 52,
    "AJE": 52,
    "IJE": 52,
    "RJE": 13,
    "RCW": 3,
    "RD": 2,
    "TS": 1,
    "LH-I": 1,
    "LH-II": 1,
    "FM": 1,
    "WT": "3 Days",
    "DM": "3 Days",
    "WE": "3 Days",
    "NDT": "4 Days",
    "EA": "4 Days",
    "3DMP": "3 Days",
  };

  const RequiredLabel = ({ children }) => (
    <label className="block text-gray-700 font-medium mb-1">
      {children} <span className="text-red-500">*</span>
    </label>
  );

  const batchOptions = ["2024-2025", "Other"];
  const moduleOptions = [...Object.keys(courseModules), "Other"];

  // Update courseDuration when moduleNo is a known option
  useEffect(() => {
    if (courseModules[formData.moduleNo]) {
      const duration = courseModules[formData.moduleNo];
      onChange("courseDuration", typeof duration === "number" ? `${duration} Weeks` : duration);
    }
  }, [formData.moduleNo]);

  // Auto-calculate sparing date
  useEffect(() => {
    const joiningDate = formData.dateOfJoiningStcWtcNonRailway;
    const duration = courseModules[formData.moduleNo];
    if (joiningDate && typeof duration === "number") {
      const joining = new Date(joiningDate);
      joining.setDate(joining.getDate() + duration * 7);
      const isoString = joining.toISOString().split("T")[0];
      onChange("dateOfSparing", isoString);
    }
  }, [formData.dateOfJoiningStcWtcNonRailway, formData.moduleNo]);

  return (
    <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200">
      <div className="flex items-center space-x-3 mb-6">
        <div className="h-12 w-12 flex items-center justify-center bg-yellow-100 text-yellow-600 rounded-full shadow text-lg">
          🎓
        </div>
        <h3 className="text-xl font-semibold text-gray-800">Course Detail</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
        {/* Ticket Number */}
        <div>
          <RequiredLabel>Ticket Number</RequiredLabel>
          <input
            type="text"
            value={formData.ticketNo || ""}
            onChange={(e) => onChange("ticketNo", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            placeholder="Enter ticket number"
          />
        </div>

        {/* Batch */}
        <div>
          <RequiredLabel>Batch</RequiredLabel>
          <select
            value={formData.batch || ""}
            onChange={(e) => onChange("batch", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          >
            <option value="">Select batch</option>
            {batchOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          {formData.batch === "Other" && (
            <input
              type="text"
              placeholder="Enter custom batch"
              value={formData.customBatch || ""}
              onChange={(e) => onChange("batch", e.target.value)}
              className="mt-2 w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          )}
        </div>

        {/* Date of Joining */}
        <div>
          <RequiredLabel>Date of Joining at STC</RequiredLabel>
          <input
            type="date"
            value={formData.dateOfJoiningStcWtcNonRailway || ""}
            onChange={(e) => onChange("dateOfJoiningStcWtcNonRailway", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          />
        </div>

        {/* Date of Sparing (Optional) */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Date of Sparing from STC</label>
          <input
            type="date"
            value={formData.dateOfSparing || ""}
            onChange={(e) => onChange("dateOfSparing", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          />
        </div>

        {/* Module Number */}
        <div>
          <RequiredLabel>Module Number</RequiredLabel>
          <select
            value={formData.moduleNo || ""}
            onChange={(e) => onChange("moduleNo", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          >
            <option value="">Select module</option>
            {moduleOptions.map((key) => (
              <option key={key} value={key}>{key}</option>
            ))}
          </select>
          {formData.moduleNo === "Other" && (
            <input
              type="text"
              placeholder="Enter custom module"
              value={formData.customModule || ""}
              onChange={(e) => onChange("moduleNo", e.target.value)}
              className="mt-2 w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          )}
        </div>

        {/* Course Duration */}
        <div>
          <RequiredLabel>Course Duration</RequiredLabel>
          <input
            type="text"
            value={formData.courseDuration || ""}
            onChange={(e) => onChange("courseDuration", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            placeholder="E.g., 3 months"
          />
        </div>
      </div>
    </div>
  );
};

export default Course;
