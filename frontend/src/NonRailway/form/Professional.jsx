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
        "customFieldOfStudy",
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
    ];

    // Add durationOption as required field for Summer Vacation training
    if (formData.designation === "Summer Vacation training") {
      requiredFields.push("durationOption");
    }

    // Add customFieldOfStudy to required fields if "Other" is selected
    if (formData.fieldOfStudy === "Other") {
      requiredFields.push("customFieldOfStudy");
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

  const getFieldOfStudyOptions = () => {
    const qualification = formData.highestQualification;

    switch (qualification) {
      case "Diploma":
        return [
          "Mechanical Engineering",
          "Electrical Engineering",
          "Civil Engineering",
          "Electronics Engineering",
          "Computer Engineering",
          "Automobile Engineering",
          "Railway Engineering",
          "Other"
        ];
      case "Bachelor's Degree":
        return [
          "B.Tech - Mechanical Engineering",
          "B.Tech - Electrical Engineering",
          "B.Tech - Civil Engineering",
          "B.Tech - Electronics & Communication",
          "B.Tech - Computer Science",
          "B.Tech - Railway Engineering",
          "B.E - Mechanical Engineering",
          "B.E - Electrical Engineering",
          "B.E - Civil Engineering",
          "BCA - Computer Applications",
          "B.Sc - Physics",
          "B.Sc - Mathematics",
          "B.Sc - Chemistry",
          "B.Com - Commerce",
          "Other"
        ];
      case "Master's Degree":
        return [
          "M.Tech - Mechanical Engineering",
          "M.Tech - Electrical Engineering",
          "M.Tech - Civil Engineering",
          "M.Tech - Electronics & Communication",
          "M.Tech - Computer Science",
          "M.Tech - Railway Engineering",
          "M.E - Mechanical Engineering",
          "M.E - Electrical Engineering",
          "M.E - Civil Engineering",
          "MCA - Computer Applications",
          "M.Sc - Physics",
          "M.Sc - Mathematics",
          "M.Sc - Chemistry",
          "MBA - Business Administration",
          "M.Com - Commerce",
          "Other"
        ];
      case "Ph.D":
        return [
          "Ph.D - Mechanical Engineering",
          "Ph.D - Electrical Engineering",
          "Ph.D - Civil Engineering",
          "Ph.D - Electronics & Communication",
          "Ph.D - Computer Science",
          "Ph.D - Railway Engineering",
          "Ph.D - Physics",
          "Ph.D - Mathematics",
          "Ph.D - Chemistry",
          "Ph.D - Management",
          "Other"
        ];
      default:
        return ["Other"];
    }
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

  const OptionalLabel = ({ children }) => (
    <label className="block text-gray-700 font-medium mb-1">
      {children}
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
            className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 bg-white shadow-sm hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 appearance-none cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: 'right 0.75rem center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '1.5em 1.5em'
            }}
          >
            <option value="" style={{ padding: '8px 12px', backgroundColor: '#f8f9fa', color: '#6c757d' }}>Select course type</option>
            {courseTypeOptions.map((type) => (
              <option key={type} value={type} style={{ padding: '8px 12px', backgroundColor: 'white', color: '#374151' }}>
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
              className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 bg-white shadow-sm hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
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
              className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 bg-white shadow-sm hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 appearance-none cursor-pointer"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: 'right 0.75rem center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1.5em 1.5em'
              }}
            >
              <option value="" style={{ padding: '8px 12px', backgroundColor: '#f8f9fa', color: '#6c757d' }}>Select designation</option>
              {designationOptions.map((designation) => (
                <option key={designation} value={designation} style={{ padding: '8px 12px', backgroundColor: 'white', color: '#374151' }}>
                  {designation}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={formData.designation || ""}
              onChange={(e) => handleChange("designation", e.target.value)}
              className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 bg-white shadow-sm hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
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
              className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 bg-white shadow-sm hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 appearance-none cursor-pointer"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: 'right 0.75rem center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1.5em 1.5em'
              }}
            >
              <option value="" style={{ padding: '8px 12px', backgroundColor: '#f8f9fa', color: '#6c757d' }}>Select unit/custodian</option>
              {getAvailableUnits().map((unit) => (
                <option key={unit} value={unit} style={{ padding: '8px 12px', backgroundColor: 'white', color: '#374151' }}>
                  {unit}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={formData.unitCustodian || ""}
              onChange={(e) => handleChange("unitCustodian", e.target.value)}
              className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 bg-white shadow-sm hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
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
              className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 bg-white shadow-sm hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 appearance-none cursor-pointer"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: 'right 0.75rem center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1.5em 1.5em'
              }}
            >
              <option value="" style={{ padding: '8px 12px', backgroundColor: '#f8f9fa', color: '#6c757d' }}>Select duration</option>
              <option value="4W" style={{ padding: '8px 12px', backgroundColor: 'white', color: '#374151' }}>4 Weeks</option>
              <option value="6W" style={{ padding: '8px 12px', backgroundColor: 'white', color: '#374151' }}>6 Weeks</option>
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
            className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 bg-white shadow-sm hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
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
            className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 bg-gray-50 shadow-sm hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
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
            className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 bg-gray-50 shadow-sm hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
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
            className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 bg-white shadow-sm hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
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
            className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 bg-white shadow-sm hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
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
            className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 bg-white shadow-sm hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 appearance-none cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: 'right 0.75rem center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '1.5em 1.5em'
            }}
          >
            <option value="" style={{ padding: '8px 12px', backgroundColor: '#f8f9fa', color: '#6c757d' }}>Select qualification</option>
            <option value="Diploma" style={{ padding: '8px 12px', backgroundColor: 'white', color: '#374151' }}>Diploma</option>
            <option value="Bachelor's Degree" style={{ padding: '8px 12px', backgroundColor: 'white', color: '#374151' }}>Bachelor's Degree</option>
            <option value="Master's Degree" style={{ padding: '8px 12px', backgroundColor: 'white', color: '#374151' }}>Master's Degree</option>
            <option value="Ph.D" style={{ padding: '8px 12px', backgroundColor: 'white', color: '#374151' }}>Ph.D</option>
          </select>
          {errors.highestQualification && (
            <p className="text-sm text-red-500 mt-1">
              {errors.highestQualification}
            </p>
          )}
        </div>

        <div>
          <RequiredLabel>Field of Study</RequiredLabel>
          <select
            value={formData.fieldOfStudy || ""}
            onChange={(e) => handleChange("fieldOfStudy", e.target.value)}
            className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 bg-white shadow-sm hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 appearance-none cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: 'right 0.75rem center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '1.5em 1.5em'
            }}
          >
            <option value="" style={{ padding: '8px 12px', backgroundColor: '#f8f9fa', color: '#6c757d' }}>Select field of study</option>
            {getFieldOfStudyOptions().map((option) => (
              <option key={option} value={option} style={{ padding: '8px 12px', backgroundColor: 'white', color: '#374151' }}>
                {option}
              </option>
            ))}
          </select>
          {errors.fieldOfStudy && (
            <p className="text-sm text-red-500 mt-1">{errors.fieldOfStudy}</p>
          )}
        </div>

        {formData.fieldOfStudy === "Other" && (
          <div>
            <RequiredLabel>Custom Field of Study</RequiredLabel>
            <input
              type="text"
              value={formData.customFieldOfStudy || ""}
              onChange={(e) => handleChange("customFieldOfStudy", e.target.value)}
              className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 bg-white shadow-sm hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              placeholder="Enter custom field of study"
            />
            {errors.customFieldOfStudy && (
              <p className="text-sm text-red-500 mt-1">{errors.customFieldOfStudy}</p>
            )}
          </div>
        )}

        <div>
          <RequiredLabel>Institution</RequiredLabel>
          <input
            type="text"
            value={formData.institution || ""}
            onChange={(e) => handleChange("institution", e.target.value)}
            className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 bg-white shadow-sm hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
            placeholder="Enter institution"
          />
          {errors.institution && (
            <p className="text-sm text-red-500 mt-1">{errors.institution}</p>
          )}
        </div>

        <div>
          <OptionalLabel>Grade Type</OptionalLabel>
          <select
            value={formData.gradeType || ""}
            onChange={(e) => handleChange("gradeType", e.target.value)}
            className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 bg-white shadow-sm hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 appearance-none cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: 'right 0.75rem center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '1.5em 1.5em'
            }}
          >
            <option value="" style={{ padding: '8px 12px', backgroundColor: '#f8f9fa', color: '#6c757d' }}>Select grade type</option>
            <option value="Percentage" style={{ padding: '8px 12px', backgroundColor: 'white', color: '#374151' }}>Percentage</option>
            <option value="CGPA (out of 10)" style={{ padding: '8px 12px', backgroundColor: 'white', color: '#374151' }}>CGPA (out of 10)</option>
            <option value="CGPA (out of 4)" style={{ padding: '8px 12px', backgroundColor: 'white', color: '#374151' }}>CGPA (out of 4)</option>
          </select>
          {errors.gradeType && (
            <p className="text-sm text-red-500 mt-1">{errors.gradeType}</p>
          )}
        </div>

        <div>
          <OptionalLabel>Grade Value</OptionalLabel>
          <input
            type="number"
            step="0.01"
            value={formData.gradeValue || ""}
            onChange={(e) => handleChange("gradeValue", e.target.value)}
            className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 bg-white shadow-sm hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
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
