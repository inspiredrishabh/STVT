import React, { useEffect } from "react";

const Professional = ({ formData, onChange, errors = {} }) => {
  const validateField = (field, value) => {
    const trimmedValue = value?.toString().trim() || "";

    if (!trimmedValue) return "This field is required";

    if (
      [
        "courseType",
        "workingUnder",
        "institution",
        "fieldOfStudy",
        "designation",
        "unitCustodian",
      ].includes(field) &&
      trimmedValue.length < 2
    ) {
      return "Must be at least 2 characters";
    }

    if (field === "gradeValue" && formData.gradeType) {
      const grade = parseFloat(trimmedValue);
      if (
        formData.gradeType === "CGPA (out of 10)" &&
        (isNaN(grade) || grade < 0 || grade > 10)
      ) {
        return "CGPA must be between 0-10";
      }
      if (
        formData.gradeType === "Percentage" &&
        (isNaN(grade) || grade < 0 || grade > 100)
      ) {
        return "Percentage must be between 0-100";
      }
    }

    return "";
  };

  const validateAllFields = () => {
    const requiredFields = [
      "courseType",
      "designation",
      "unitCustodian",
      "duration",
      "workingUnder",
      "highestQualification",
      "fieldOfStudy",
      "institution",
      "gradeType",
      "gradeValue",
    ];

    // Add durationOption as required field for Summer Vacation training
    if (formData.designation === "Summer Vacation training") {
      requiredFields.push("durationOption");
    }

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

  const handleChange = (field, value) => onChange(field, value);

  // Course type and mapping data
  const courseTypeOptions = ["Non Railway", "Custom"];

  const designationOptions = [
    "RRC Act Apprentice 1961",
    "Act Junior Apprentices",
    "Rail Kaushal Vikas Yojana",
    "Summer Vacation training",
  ];

  const unitMapping = {
    "RRC Act Apprentice 1961": ["Dy. CME (Diesel)/ RSW/CB", "Dy. CEE /CB"],
    "Act Junior Apprentices": ["Dy. CME (Diesel)/ RSW/CB", "Dy. CEE /CB"],
    "Rail Kaushal Vikas Yojana": ["Welder", "Electrician"],
    "Summer Vacation training": ["Degree & Diploma Holders"],
  };

  const durationMapping = {
    "RRC Act Apprentice 1961": {
      theory: "01 W",
      practical: "51 W",
      total: "01 Y",
    },
    "Act Junior Apprentices": {
      theory: "04 W",
      practical: "48 W",
      total: "01 Y",
    },
    "Rail Kaushal Vikas Yojana": {
      theory: "01 W",
      practical: "02 W",
      total: "03 W",
    },
    "Summer Vacation training": {
      "4W": {
        theory: "00 W",
        practical: "04 W",
        total: "04 W",
      },
      "6W": {
        theory: "00 W",
        practical: "06 W",
        total: "06 W",
      },
    },
  };

  const getAvailableUnits = () => {
    if (!formData.designation || formData.courseType === "Custom") {
      return [];
    }
    return unitMapping[formData.designation] || [];
  };

  const getDurationInfo = () => {
    if (!formData.designation || formData.courseType === "Custom") {
      return { theory: "", practical: "", total: "" };
    }
    
    if (formData.designation === "Summer Vacation training" && formData.durationOption) {
      return durationMapping[formData.designation][formData.durationOption] || { theory: "", practical: "", total: "" };
    }
    
    return (
      durationMapping[formData.designation] || {
        theory: "",
        practical: "",
        total: "",
      }
    );
  };

  const RequiredLabel = ({ children }) => (
    <label className="block text-gray-700 font-medium mb-1">
      {children} <span className="text-red-500">*</span>
    </label>
  );

  return (
    <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200">
      <div className="flex items-center space-x-3 mb-6">
        <div className="h-12 w-12 flex items-center justify-center bg-indigo-100 text-indigo-600 rounded-full shadow text-lg">
          💼
        </div>
        <h3 className="text-xl font-semibold text-gray-800">
          Professional Details
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6 mb-10">
        <div>
          <RequiredLabel>Course Type</RequiredLabel>
          <select
            value={formData.courseType || ""}
            onChange={(e) => {
              handleChange("courseType", e.target.value);
              // Reset dependent fields when course type changes
              handleChange("designation", "");
              handleChange("unitCustodian", "");
            }}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          >
            <option value="">Select course type</option>
            {courseTypeOptions.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.courseType && (
            <p className="text-sm text-red-500 mt-1">{errors.courseType}</p>
          )}
        </div>

        {formData.courseType === "Custom" && (
          <div>
            <RequiredLabel>Custom Course Type</RequiredLabel>
            <input
              type="text"
              value={formData.customCourseType || ""}
              onChange={(e) => handleChange("customCourseType", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              placeholder="Enter custom course type"
            />
            {errors.customCourseType && (
              <p className="text-sm text-red-500 mt-1">
                {errors.customCourseType}
              </p>
            )}
          </div>
        )}

        <div>
          <RequiredLabel>Designation</RequiredLabel>
          {formData.courseType === "Non Railway" ? (
            <select
              value={formData.designation || ""}
              onChange={(e) => {
                handleChange("designation", e.target.value);
                handleChange("unitCustodian", ""); // Reset unit when designation changes
              }}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            >
              <option value="">Select designation</option>
              {designationOptions.map((designation) => (
                <option key={designation} value={designation}>
                  {designation}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={formData.designation || ""}
              onChange={(e) => handleChange("designation", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              placeholder="Enter designation"
              disabled={!formData.courseType}
            />
          )}
          {errors.designation && (
            <p className="text-sm text-red-500 mt-1">{errors.designation}</p>
          )}
        </div>

        <div>
          <RequiredLabel>Unit/ Custodian/ Other Details</RequiredLabel>
          {formData.courseType === "Non Railway" && formData.designation ? (
            <select
              value={formData.unitCustodian || ""}
              onChange={(e) => handleChange("unitCustodian", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            >
              <option value="">Select unit/custodian</option>
              {getAvailableUnits().map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={formData.unitCustodian || ""}
              onChange={(e) => handleChange("unitCustodian", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              placeholder="Enter unit/custodian details"
              disabled={!formData.courseType}
            />
          )}
          {errors.unitCustodian && (
            <p className="text-sm text-red-500 mt-1">{errors.unitCustodian}</p>
          )}
        </div>

        {formData.designation === "Summer Vacation training" && (
          <div>
            <RequiredLabel>Duration Option</RequiredLabel>
            <select
              value={formData.durationOption || ""}
              onChange={(e) => handleChange("durationOption", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            >
              <option value="">Select duration</option>
              <option value="4W">4 Weeks</option>
              <option value="6W">6 Weeks</option>
            </select>
            {errors.durationOption && (
              <p className="text-sm text-red-500 mt-1">{errors.durationOption}</p>
            )}
          </div>
        )}

        <div>
          <RequiredLabel>Duration</RequiredLabel>
          <input
            type="text"
            value={formData.duration || getDurationInfo().total}
            onChange={(e) => handleChange("duration", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            placeholder="Enter duration"
            readOnly={
              (formData.courseType === "Non Railway" && formData.designation && formData.designation !== "Summer Vacation training") ||
              (formData.designation === "Summer Vacation training" && formData.durationOption)
            }
          />
          {errors.duration && (
            <p className="text-sm text-red-500 mt-1">{errors.duration}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Theory Period
          </label>
          <input
            type="text"
            value={formData.theoryPeriod || getDurationInfo().theory}
            onChange={(e) => handleChange("theoryPeriod", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50"
            placeholder="Auto-filled"
            readOnly={
              (formData.courseType === "Non Railway" && formData.designation && formData.designation !== "Summer Vacation training") ||
              (formData.designation === "Summer Vacation training" && formData.durationOption)
            }
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Practical Period
          </label>
          <input
            type="text"
            value={formData.practicalPeriod || getDurationInfo().practical}
            onChange={(e) => handleChange("practicalPeriod", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50"
            placeholder="Auto-filled"
            readOnly={
              (formData.courseType === "Non Railway" && formData.designation && formData.designation !== "Summer Vacation training") ||
              (formData.designation === "Summer Vacation training" && formData.durationOption)
            }
          />
        </div>

        <div>
          <RequiredLabel>Working Under</RequiredLabel>
          <input
            type="text"
            value={formData.workingUnder || ""}
            onChange={(e) => handleChange("workingUnder", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            placeholder="Enter working under"
          />
          {errors.workingUnder && (
            <p className="text-sm text-red-500 mt-1">{errors.workingUnder}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label className="block text-gray-700 font-medium mb-1">Remark</label>
          <textarea
            value={formData.remark || ""}
            onChange={(e) => handleChange("remark", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            placeholder="Enter remark"
            rows="3"
          />
          {errors.remark && (
            <p className="text-sm text-red-500 mt-1">{errors.remark}</p>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-3 mb-6">
        <div className="h-12 w-12 flex items-center justify-center bg-pink-100 text-pink-600 rounded-full shadow text-lg">
          🎓
        </div>
        <h4 className="text-xl font-semibold text-gray-800">
          Educational Qualifications
        </h4>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
        <div>
          <RequiredLabel>Highest Qualification</RequiredLabel>
          <select
            value={formData.highestQualification || ""}
            onChange={(e) =>
              handleChange("highestQualification", e.target.value)
            }
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          >
            <option value="">Select qualification</option>
            <option value="Diploma">Diploma</option>
            <option value="Bachelor's Degree">Bachelor's Degree</option>
            <option value="Master's Degree">Master's Degree</option>
            <option value="Ph.D">Ph.D</option>
          </select>
          {errors.highestQualification && (
            <p className="text-sm text-red-500 mt-1">
              {errors.highestQualification}
            </p>
          )}
        </div>

        <div>
          <RequiredLabel>Field of Study</RequiredLabel>
          <input
            type="text"
            value={formData.fieldOfStudy || ""}
            onChange={(e) => handleChange("fieldOfStudy", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            placeholder="Enter field of study"
          />
          {errors.fieldOfStudy && (
            <p className="text-sm text-red-500 mt-1">{errors.fieldOfStudy}</p>
          )}
        </div>

        <div>
          <RequiredLabel>Institution</RequiredLabel>
          <input
            type="text"
            value={formData.institution || ""}
            onChange={(e) => handleChange("institution", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            placeholder="Enter institution"
          />
          {errors.institution && (
            <p className="text-sm text-red-500 mt-1">{errors.institution}</p>
          )}
        </div>

        <div>
          <RequiredLabel>Grade Type</RequiredLabel>
          <select
            value={formData.gradeType || ""}
            onChange={(e) => handleChange("gradeType", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          >
            <option value="">Select grade type</option>
            <option value="Percentage">Percentage</option>
            <option value="CGPA (out of 10)">CGPA (out of 10)</option>
            <option value="CGPA (out of 4)">CGPA (out of 4)</option>
          </select>
          {errors.gradeType && (
            <p className="text-sm text-red-500 mt-1">{errors.gradeType}</p>
          )}
        </div>

        <div>
          <RequiredLabel>Grade Value</RequiredLabel>
          <input
            type="number"
            step="0.01"
            value={formData.gradeValue || ""}
            onChange={(e) => handleChange("gradeValue", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            placeholder="Enter grade value"
          />
          {errors.gradeValue && (
            <p className="text-sm text-red-500 mt-1">{errors.gradeValue}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Professional;
