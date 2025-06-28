import React, { useEffect, useState } from "react";

const Course = ({ formData, onChange, errors = {}, onSubmit }) => {
  const [ticketCounter, setTicketCounter] = useState({
    ASE: 1, AJE: 1, IJE: 1, RJE: 1, RCW: 1, RD: 1,
    TS: 1, LHI: 1, LHII: 1, FM: 1, WT: 1, DM: 1,
    WE: 1, NDT: 1, EA: 1, "3DMP": 1
  });

  const courseModules = {
    "MSE-C": 52, "MSE-D": 52, "MSE-W": 52, "MJR-C": 52, "MJR-D": 52, "MJR-W": 52,
    "MJI-C": 52, "MJI-D": 52, "MJ1-W": 52, "MJP-C": 13, "MJP-D": 13, "MJP-W": 13,
    "ASE": 52, "AJE": 52, "IJE": 52, "RJE": 13, "RCW": 3, "RD": 2, "TS": 1,
    "LH-I": 1, "LH-II": 1, "FM": 1, "WT": "3 Days", "DM": "3 Days", "WE": "3 Days",
    "NDT": "4 Days", "EA": "4 Days", "3DMP": "3 Days",
  };

  const RequiredLabel = ({ children }) => (
    <label className="block text-gray-700 font-medium mb-1">
      {children} <span className="text-red-500">*</span>
    </label>
  );

  const batchOptions = ["2024-2025", "Other"];
  const moduleOptions = [...Object.keys(courseModules), "Other"];

  const generateTicketNumber = (designation) => {
    if (!designation || !ticketCounter[designation]) return "";
    const counter = ticketCounter[designation].toString().padStart(5, '0');
    return `${designation}${counter}`;
  };

  useEffect(() => {
    const designation = formData.designation;
    if (designation && ticketCounter[designation] && !formData.ticketNo) {
      const ticketNumber = generateTicketNumber(designation);
      onChange("ticketNo", ticketNumber);
      setTicketCounter(prev => ({
        ...prev,
        [designation]: prev[designation] + 1
      }));
    }
  }, [formData.designation]);

  useEffect(() => {
    if (courseModules[formData.moduleNo]) {
      const duration = courseModules[formData.moduleNo];
      onChange("courseDuration", typeof duration === "number" ? `${duration} Weeks` : duration);
    } else if (formData.moduleNo === "") {
      // Clear course duration when no module is selected
      onChange("courseDuration", "");
    }
  }, [formData.moduleNo]);

  useEffect(() => {
    const joiningDate = formData.dateOfJoiningStcWtcNonRailway;
    const moduleNo = formData.moduleNo;
    const duration = courseModules[moduleNo];

    if (joiningDate && duration && moduleNo !== "") {
      const joining = new Date(joiningDate);

      if (typeof duration === "number") {
        // For week-based durations
        joining.setDate(joining.getDate() + duration * 7);
      } else if (typeof duration === "string" && duration.includes("Days")) {
        // For day-based durations (e.g., "3 Days", "4 Days")
        const days = parseInt(duration.split(" ")[0]);
        if (!isNaN(days)) {
          joining.setDate(joining.getDate() + days);
        }
      }

      const isoString = joining.toISOString().split("T")[0];
      onChange("dateOfSparing", isoString);
    } else if (!joiningDate || !moduleNo || moduleNo === "") {
      // Clear date of sparing when required fields are empty
      onChange("dateOfSparing", "");
    }
  }, [formData.dateOfJoiningStcWtcNonRailway, formData.moduleNo]);

  const handleTicketChange = (value) => onChange("ticketNo", value);

  const generateNewTicket = () => {
    const designation = formData.designation;
    if (designation && ticketCounter[designation]) {
      const ticketNumber = generateTicketNumber(designation);
      onChange("ticketNo", ticketNumber);
      setTicketCounter(prev => ({
        ...prev,
        [designation]: prev[designation] + 1
      }));
    }
  };

  const validateField = (field, value) => {
    if (!value || (typeof value === "string" && value.trim() === "")) {
      return "This field is required";
    }
    return "";
  };

  const validateAllFields = () => {
    const requiredFields = ["ticketNo", "batch", "dateOfJoiningStcWtcNonRailway", "moduleNo", "courseDuration"];
    const validationErrors = {};

    requiredFields.forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) validationErrors[field] = error;
    });

    return {
      isValid: Object.keys(validationErrors).length === 0,
      errors: validationErrors,
    };
  };

  useEffect(() => {
    if (onChange.setValidationFunction) {
      onChange.setValidationFunction(validateAllFields);
    }
  }, [formData]);

  return (
    <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200">
      <div className="flex items-center space-x-3 mb-6">
        <div className="h-12 w-12 flex items-center justify-center bg-yellow-100 text-yellow-600 rounded-full shadow text-lg">
          🎓
        </div>
        <h3 className="text-xl font-semibold text-gray-800">Course Detail</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
        <div>
          <RequiredLabel>Ticket Number</RequiredLabel>
          <div className="flex gap-2">
            <input
              type="text"
              value={formData.ticketNo || ""}
              onChange={(e) => handleTicketChange(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
              placeholder="Auto-generated based on designation"
              readOnly={!formData.designation || !ticketCounter[formData.designation]}
            />
            {formData.designation && ticketCounter[formData.designation] && (
              <button
                type="button"
                onClick={generateNewTicket}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
              >
                🔄
              </button>
            )}
          </div>
          {errors.ticketNo && <p className="text-sm text-red-500 mt-1">{errors.ticketNo}</p>}
        </div>

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
              onChange={(e) => onChange("customBatch", e.target.value)}
              className="mt-2 w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          )}
          {errors.batch && <p className="text-sm text-red-500 mt-1">{errors.batch}</p>}
        </div>

        <div>
          <RequiredLabel>Date of Joining at STC</RequiredLabel>
          <input
            type="date"
            value={formData.dateOfJoiningStcWtcNonRailway || ""}
            onChange={(e) => onChange("dateOfJoiningStcWtcNonRailway", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          />
          {errors.dateOfJoiningStcWtcNonRailway && (
            <p className="text-sm text-red-500 mt-1">{errors.dateOfJoiningStcWtcNonRailway}</p>
          )}
        </div>

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
              onChange={(e) => onChange("customModule", e.target.value)}
              className="mt-2 w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          )}
          {errors.moduleNo && <p className="text-sm text-red-500 mt-1">{errors.moduleNo}</p>}
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Date of Sparing <span className="text-xs text-gray-500">(Auto-calculated)</span>
          </label>
          <input
            type="date"
            value={formData.dateOfSparing || ""}
            onChange={(e) => onChange("dateOfSparing", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50"
          />
        </div>

        <div>
          <RequiredLabel>Course Duration</RequiredLabel>
          <input
            type="text"
            value={formData.courseDuration || ""}
            onChange={(e) => onChange("courseDuration", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50"
            placeholder="Auto-filled"
          />
          {errors.courseDuration && <p className="text-sm text-red-500 mt-1">{errors.courseDuration}</p>}
        </div>
      </div>
    </div>
  );
};

export default Course;
