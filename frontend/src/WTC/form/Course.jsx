import React, { useEffect, useCallback, useMemo } from "react";

const Course = ({ formData, onChange, errors = {} }) => {
  const courseModules = useMemo(
    () => ({
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
      ASE: 52,
      AJE: 52,
      IJE: 52,
      RJE: 13,
      RCW: 3,
      RD: 2,
      TS: 1,
      "LH-I": 1,
      "LH-II": 1,
      FM: 1,
      WT: "3 Days",
      DM: "3 Days",
      WE: "3 Days",
      NDT: "4 Days",
      EA: "4 Days",
      "3DMP": "3 Days",
    }),
    []
  );

  const moduleOptions = useMemo(
    () => [...Object.keys(courseModules), "Other"],
    [courseModules]
  );

  // Auto-calculate course duration
  useEffect(() => {
    const duration = courseModules[formData.moduleNo];
    if (duration) {
      onChange(
        "courseDuration",
        typeof duration === "number" ? `${duration} Weeks` : duration
      );
    } else if (!formData.moduleNo) {
      onChange("courseDuration", "");
    }
  }, [formData.moduleNo, courseModules, onChange]);

  // Auto-calculate sparing date
  useEffect(() => {
    const { dateOfJoiningStcWtcNonRailway, moduleNo } = formData;
    const duration = courseModules[moduleNo];

    if (dateOfJoiningStcWtcNonRailway && duration && moduleNo) {
      const joining = new Date(dateOfJoiningStcWtcNonRailway);

      if (typeof duration === "number") {
        joining.setDate(joining.getDate() + duration * 7);
      } else if (duration.includes("Days")) {
        const days = parseInt(duration.split(" ")[0]);
        if (!isNaN(days)) joining.setDate(joining.getDate() + days);
      }

      onChange("dateOfSparing", joining.toISOString().split("T")[0]);
    } else if (!dateOfJoiningStcWtcNonRailway || !moduleNo) {
      onChange("dateOfSparing", "");
    }
  }, [
    formData.dateOfJoiningStcWtcNonRailway,
    formData.moduleNo,
    courseModules,
    onChange,
  ]);

  const validateAllFields = useCallback(() => {
    const requiredFields = [
      "ticketNo",
      "batch",
      "dateOfJoiningStcWtcNonRailway",
      "moduleNo",
      "courseDuration",
    ];
    const validationErrors = {};

    requiredFields.forEach((field) => {
      if (
        !formData[field] ||
        (typeof formData[field] === "string" && !formData[field].trim())
      ) {
        validationErrors[field] = "This field is required";
      }
    });

    return {
      isValid: Object.keys(validationErrors).length === 0,
      errors: validationErrors,
    };
  }, [formData]);

  useEffect(() => {
    onChange.setValidationFunction?.(validateAllFields);
  }, [validateAllFields, onChange]);

  const courseFields = useMemo(
    () => [
      { label: "Ticket Number", field: "ticketNo" },
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
        label: "Module Number",
        field: "moduleNo",
        type: "select",
        options: ["", ...moduleOptions],
        hasCustom: true,
      },
      {
        label: "Date of Sparing",
        field: "dateOfSparing",
        type: "date",
        disabled: true,
        helpText: "(Auto-calculated)",
      },
      {
        label: "Course Duration",
        field: "courseDuration",
        disabled: true,
        helpText: "Auto-filled",
      },
    ],
    [moduleOptions]
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
              value={formData[field] || ""}
              onChange={(e) => onChange(field, e.target.value)}
              className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 bg-white shadow-sm hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 appearance-none cursor-pointer"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: 'right 0.75rem center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1.5em 1.5em'
              }}
            >
              {options.map((opt, index) => (
                <option
                  key={opt}
                  value={opt}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: index === 0 && !opt ? '#f8f9fa' : 'white',
                    color: index === 0 && !opt ? '#6c757d' : '#374151'
                  }}
                >
                  {opt || "Select option"}
                </option>
              ))}
            </select>
            {hasCustom && formData[field] === "Other" && (
              <input
                type="text"
                placeholder={`Enter custom ${label.toLowerCase()}`}
                value={
                  formData[
                  `custom${field.charAt(0).toUpperCase() + field.slice(1)}`
                  ] || ""
                }
                onChange={(e) =>
                  onChange(
                    `custom${field.charAt(0).toUpperCase() + field.slice(1)}`,
                    e.target.value
                  )
                }
                className="mt-2 w-full border-2 border-gray-300 rounded-xl px-4 py-3 bg-white shadow-sm hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              />
            )}
          </>
        ) : (
          <input
            type={type}
            value={formData[field] || ""}
            onChange={(e) => onChange(field, e.target.value)}
            className={`w-full border-2 border-gray-300 rounded-xl px-4 py-3 shadow-sm hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 ${disabled ? "bg-gray-50" : "bg-white"
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
    <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200">
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
