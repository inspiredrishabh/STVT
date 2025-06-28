import React, { useEffect, useState, useCallback, useMemo } from "react";

const Professional = ({ formData, onChange }) => {
  const [errors, setErrors] = useState({});

  const handleChange = useCallback(
    (field, value) => {
      onChange(field, value);
      setErrors((prev) => ({ ...prev, [field]: "" }));
    },
    [onChange]
  );

  const validateField = (field, value) => {
    if (!value || value.toString().trim() === "") {
      return "This field is required";
    }

    if (field === "educationStartYear" || field === "additionalQualificationYear") {
      const year = parseInt(value, 10);
      const currentYear = new Date().getFullYear();
      if (isNaN(year) || year < 1970 || year > currentYear) {
        return "Please enter a valid year";
      }
    }

    if (field === "eduCourseDuration") {
      const duration = parseInt(value, 10);
      if (isNaN(duration) || duration < 1 || duration > 6) {
        return "Course duration should be between 1 and 6 years";
      }
    }

    if (field === "gradeValue") {
      if (formData.gradeType?.includes("CGPA")) {
        const g = parseFloat(value);
        if (isNaN(g) || g <= 0 || (formData.gradeType === "CGPA (out of 10)" && g > 10) || (formData.gradeType === "CGPA (out of 4)" && g > 4)) {
          return `Please enter a valid CGPA (${formData.gradeType})`;
        }
      } else if (formData.gradeType === "Percentage") {
        const p = parseFloat(value);
        if (isNaN(p) || p < 0 || p > 100) {
          return "Enter a valid percentage between 0 and 100";
        }
      }
    }

    return "";
  };

  const requiredFields = [
    "dateOfAppointmentInRailway",
    "modeOfAppointment",
    "designation",
    "unit",
    "workingUnder",
    "hrmsId",
    "pfNoNpsUps",
    "employeeNumber",
    "highestQualification",
    "fieldOfStudy",
    "institution",
    "boardType",
    "educationStartYear",
    "eduCourseDuration",
    "modeOfStudy",
    "gradeType",
    "gradeValue",
    "division",
    "hasAdditionalQualification"
  ];

  const validateAllFields = () => {
    const newErrors = {};

    requiredFields.forEach((field) => {
      const value = formData[field];
      const error = validateField(field, value);
      if (error) newErrors[field] = error;
    });

    if (formData.hasAdditionalQualification === "Yes") {
      ["additionalQualificationName", "additionalQualificationOrg", "additionalQualificationYear"].forEach((field) => {
        const error = validateField(field, formData[field]);
        if (error) newErrors[field] = error;
      });
    }

    setErrors(newErrors);
    return {
      isValid: Object.keys(newErrors).length === 0,
      errors: newErrors
    };
  };

  useEffect(() => {
    if (onChange.setValidationFunction) {
      onChange.setValidationFunction(validateAllFields);
    }
  }, [formData]);

  useEffect(() => {
    if (formData.educationStartYear && formData.eduCourseDuration) {
      const startYear = parseInt(formData.educationStartYear, 10);
      const duration = parseInt(formData.eduCourseDuration, 10);
      if (!isNaN(startYear) && !isNaN(duration)) {
        handleChange("yearOfGraduation", (startYear + duration).toString());
      }
    }
  }, [formData.educationStartYear, formData.eduCourseDuration, handleChange]);

  const generateYearOptions = useCallback(
    () => Array.from({ length: 50 }, (_, i) => (new Date().getFullYear() - i).toString()),
    []
  );

  const qualificationOptions = useMemo(() => [
    "", "High School", "Intermediate", "Diploma", "Bachelor's Degree", "Master's Degree", "Ph.D", "Other"
  ], []);

  const boardOptions = useMemo(() => [
    "", "State Board", "CBSE", "ICSE", "State University", "Central University", "Deemed University", "Private University", "Foreign University", "Other"
  ], []);

  const durationOptions = useMemo(() => ["", "1", "2", "3", "4", "5", "6"], []);
  const modeOptions = useMemo(() => ["", "Full-Time", "Part-Time", "Distance Learning", "Online"], []);
  const gradeTypeOptions = useMemo(() => ["", "Percentage", "CGPA (out of 10)", "CGPA (out of 4)", "Grade"], []);
  const divisionOptions = useMemo(() => ["", "First Division", "Second Division", "Third Division", "Distinction", "Pass"], []);

  const professionalFields = [
    { label: "Date of Appointment", field: "dateOfAppointmentInRailway", type: "date" },
    {
      label: "Mode of Appointment",
      field: "modeOfAppointment",
      type: "select",
      options: ["", "RRB", "Promotion Through LDCE", "Promotion Through Seniority", "Other"],
    },
    formData.modeOfAppointment === "Other" && {
      label: "Specify Mode",
      field: "modeOfAppointmentOther",
    },
    {
      label: "Designation",
      field: "designation",
      type: "select",
      options: ["", "ASE", "AJE", "IJE", "RJE", "RCW", "RD", "TS", "LHI", "LHII", "FM", "WT", "DM", "WE", "NDT", "EA", "3DMP", "Other"],
    },
    formData.designation === "Other" && {
      label: "Specify Designation",
      field: "designationOther",
    },
    {
      label: "Unit / Division",
      field: "unit",
      type: "select",
      options: ["", "JAT", "FZD", "MB", "LKO", "DLI", "Other"],
    },
    formData.unit === "Other" && {
      label: "Specify Unit / Division",
      field: "unitOther",
    },
    { label: "Working Under", field: "workingUnder" },
    { label: "HRMS ID", field: "hrmsId" },
    { label: "PF/NPS/UPS No.", field: "pfNoNpsUps" },
    { label: "Employee Number", field: "employeeNumber" },
  ];

  const educationFields = [
    {
      label: "Highest Qualification",
      field: "highestQualification",
      type: "select",
      options: qualificationOptions,
    },
    formData.highestQualification === "Other" && {
      label: "Specify Qualification",
      field: "otherQualification",
    },
    { label: "Field of Study/Specialization", field: "fieldOfStudy" },
    { label: "University/Institution", field: "institution" },
    {
      label: "Board/University Type",
      field: "boardType",
      type: "select",
      options: boardOptions,
    },
    {
      label: "Start Year",
      field: "educationStartYear",
      type: "select",
      options: ["", ...generateYearOptions()],
    },
    {
      label: "Course Duration (years)",
      field: "eduCourseDuration",
      type: "select",
      options: durationOptions,
    },
    {
      label: "Year of Graduation",
      field: "yearOfGraduation",
      disabled: true,
      helpText: "Auto-calculated from start year and duration",
    },
    {
      label: "Mode of Study",
      field: "modeOfStudy",
      type: "select",
      options: modeOptions,
    },
    {
      label: "Grade Type",
      field: "gradeType",
      type: "select",
      options: gradeTypeOptions,
    },
    { label: "Grade/Percentage/CGPA", field: "gradeValue" },
    {
      label: "Division/Class",
      field: "division",
      type: "select",
      options: divisionOptions,
    },
    {
      label: "Additional Qualification?",
      field: "hasAdditionalQualification",
      type: "select",
      options: ["", "Yes", "No"],
    },
    formData.hasAdditionalQualification === "Yes" && {
      label: "Certification Name",
      field: "additionalQualificationName",
    },
    formData.hasAdditionalQualification === "Yes" && {
      label: "Issuing Organization",
      field: "additionalQualificationOrg",
    },
    formData.hasAdditionalQualification === "Yes" && {
      label: "Year of Completion",
      field: "additionalQualificationYear",
      type: "select",
      options: ["", ...generateYearOptions()],
    },
    {
      label: "Thesis/Project Title (if applicable)",
      field: "thesisTitle",
      required: false,
    },
  ];

  const renderFields = (fields) =>
    fields
      .filter(Boolean)
      .map(({ label, field, type = "text", options = [], disabled = false, required = true, helpText }) => (
        <div key={field}>
          <label className="block text-gray-700 font-medium mb-1">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
          {type === "select" ? (
            <select
              value={formData[field] || ""}
              onChange={(e) => handleChange(field, e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              disabled={disabled}
            >
              {options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt || "Select option"}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={type}
              value={formData[field] || ""}
              onChange={(e) => handleChange(field, e.target.value)}
              className={`w-full border border-gray-300 rounded-lg px-4 py-2 ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
              placeholder={`Enter ${label.toLowerCase()}`}
              disabled={disabled}
            />
          )}
          {helpText && <p className="text-xs text-gray-500 mt-1">{helpText}</p>}
          {errors[field] && <p className="text-sm text-red-500 mt-1">{errors[field]}</p>}
        </div>
      ));

  return (
    <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200">
      <div className="flex items-center space-x-3 mb-6">
        <div className="h-12 w-12 flex items-center justify-center bg-indigo-100 text-indigo-600 rounded-full shadow text-lg">
          💼
        </div>
        <h3 className="text-xl font-semibold text-gray-800">Professional Detail</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6 mb-10">
        {renderFields(professionalFields)}
      </div>

      <div className="flex items-center space-x-3 mb-6">
        <div className="h-12 w-12 flex items-center justify-center bg-pink-100 text-pink-600 rounded-full shadow text-lg">
          🎓
        </div>
        <h4 className="text-xl font-semibold text-gray-800">Educational Qualifications</h4>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
        {renderFields(educationFields)}
      </div>
    </div>
  );
};

export default Professional;
