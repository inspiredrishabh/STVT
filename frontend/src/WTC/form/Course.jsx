import React, { useEffect, useCallback, useMemo } from "react";

const Course = ({ formData, onChange, errors = {} }) => {
  // Auto-calculate sparing date based on training period from Professional.jsx
  useEffect(() => {
    const {
      dateOfJoiningStcWtcNonRailway,
      trainingPeriod,
      customTrainingPeriod,
    } = formData;
    const periodToUse =
      trainingPeriod === "Custom" ? customTrainingPeriod : trainingPeriod;

    if (dateOfJoiningStcWtcNonRailway && periodToUse) {
      const joining = new Date(dateOfJoiningStcWtcNonRailway);

      // Helper function to parse and extract the numeric value
      const extractNumber = (str) => {
        const match = str.match(/^(\d+(\.\d+)?)/);
        return match ? parseFloat(match[1]) : NaN;
      };

      // Helper function to check if a string contains a term (case insensitive)
      const containsTerm = (str, term) =>
        str.toLowerCase().includes(term.toLowerCase());

      // Parse the training period with improved pattern matching
      if (containsTerm(periodToUse, "Year")) {
        const years = extractNumber(periodToUse);
        if (!isNaN(years)) joining.setFullYear(joining.getFullYear() + years);
      } else if (containsTerm(periodToUse, "Month")) {
        const months = extractNumber(periodToUse);
        if (!isNaN(months)) joining.setMonth(joining.getMonth() + months);
      } else if (containsTerm(periodToUse, "Week")) {
        const weeks = extractNumber(periodToUse);
        if (!isNaN(weeks)) joining.setDate(joining.getDate() + weeks * 7);
      } else if (containsTerm(periodToUse, "Day")) {
        const days = extractNumber(periodToUse);
        if (!isNaN(days)) joining.setDate(joining.getDate() + days);
      } else {
        // If no recognized time unit, try to parse as days
        const possibleDays = extractNumber(periodToUse);
        if (!isNaN(possibleDays))
          joining.setDate(joining.getDate() + possibleDays);
      }

      onChange("dateOfSparing", joining.toISOString().split("T")[0]);
    } else if (!dateOfJoiningStcWtcNonRailway || !periodToUse) {
      onChange("dateOfSparing", "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    formData.dateOfJoiningStcWtcNonRailway,
    formData.trainingPeriod,
    formData.customTrainingPeriod,
  ]); // We need to recalculate when any of these values change

  const validateAllFields = useCallback(() => {
    const requiredFields = ["batch", "dateOfJoiningStcWtcNonRailway"];
    const validationErrors = {};

    requiredFields.forEach((field) => {
      if (
        !formData[field] ||
        (typeof formData[field] === "string" && !formData[field].trim())
      ) {
        validationErrors[field] = "This field is required";
      }
    });

    // Check if we have a valid training period to calculate date of sparing
    if (
      formData.trainingPeriod === "Custom" &&
      (!formData.customTrainingPeriod ||
        formData.customTrainingPeriod.trim() === "")
    ) {
      validationErrors.customTrainingPeriod =
        "Please provide a custom training period to calculate date of sparing";
    }

    return {
      isValid: Object.keys(validationErrors).length === 0,
      errors: validationErrors,
    };
  }, [formData]);


  // Set the validation function to be used by the parent component
  useEffect(() => {
    onChange.setValidationFunction?.(validateAllFields);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validateAllFields]); // Removed onChange from dependencies

  const courseFields = useMemo(
    () => [
      {
        label: "Batch",
        field: "batch",
        type: "select",
        options: ["", "2024-2025", "Other"],
        hasCustom: true,
      },
      {
        label: "Date of Joining at WTC",
        field: "dateOfJoiningStcWtcNonRailway",
        type: "date",
      },
      {
        label: "Date of Sparing",
        field: "dateOfSparing",
        type: "date",
        disabled: true,
        helpText:
          "(Auto-calculated based on Date of Joining + Training Period)",
      },
    ],
    []
  );

  const renderField = useCallback(
    ({
      label,
      field,
      type = "text",
      options = [],
      disabled = false,
      helpText,
      hasCustom = false,
    }) => (
      <div key={field}>
        <label className="block text-gray-700 font-medium mb-1">
          {label} {!disabled && <span className="text-red-500">*</span>}
          {helpText && (
            <span className="text-xs text-gray-500"> {helpText}</span>
          )}
        </label>
        {type === "select" ? (
          <>
            <select
              value={
                formData[field] === "Other" ||
                !options.includes(formData[field])
                  ? "Other"
                  : formData[field]
              }
              onChange={(e) => {
                const value = e.target.value;
                if (hasCustom && value === "Other") {
                  onChange(field, ""); // Clear batch for custom input
                } else {
                  onChange(field, value);
                }
              }}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            >
              {options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt || "Select option"}
                </option>
              ))}
            </select>
            {hasCustom &&
              (formData[field] === "Other" ||
                !options.includes(formData[field]) ||
                formData[field] === "") && (
                <input
                  type="text"
                  placeholder={`Enter custom ${label.toLowerCase()}`}
                  value={formData[field] || ""}
                  onChange={(e) => onChange(field, e.target.value)}
                  className="mt-2 w-full border border-gray-300 rounded-lg px-4 py-2"
                />
              )}
          </>
        ) : (
          <input
            type={type}
            value={formData[field] || ""}
            onChange={(e) => onChange(field, e.target.value)}
            className={`w-full border border-gray-300 rounded-lg px-4 py-2 ${
              disabled ? "bg-gray-50" : ""
            }`}
            placeholder={
              disabled ? "Auto-filled" : `Enter ${label.toLowerCase()}`
            }
            disabled={disabled}
          />
        )}
        {errors[field] && (
          <p className="text-sm text-red-500 mt-1">{errors[field]}</p>
        )}
      </div>
    ),
    [formData, errors, onChange]
  );

  return (
    <div className="bg-white rounded-3xl p-8 shadow-lg border-2 border-orange-100">
      <div className="flex items-center space-x-3 mb-6">
        <div className="h-12 w-12 flex items-center justify-center bg-yellow-100 text-yellow-600 rounded-full shadow text-lg">
          🎓
        </div>
        <h3 className="text-xl font-semibold text-gray-800">Course Detail</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
        {courseFields.map(renderField)}
      </div>
    </div>
  );
};

export default Course;