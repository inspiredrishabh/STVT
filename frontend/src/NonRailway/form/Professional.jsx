import React, { useEffect, useState, useCallback, useMemo } from "react";

const Professional = ({ formData, onChange }) => {
  const [errors, setErrors] = useState({});

  // Direct designation to unit mapping (removed course type)
  const unitMap = {
    "RRC Act Apprentice 1961": ["Dy. CME (Diesel)/ RSW/CB", "Dy. CEE /CB"],
    "Act Junior Apprentices": ["Dy. CME (Diesel)/ RSW/CB", "Dy. CEE /CB"],
    "Rail Kaushal Vikas Yojana": ["Welder", "Electrician"],
    "Summer Vacation training": ["Degree & Diploma Holders"],
  };

  // Training period mapping
  const trainingMap = {
    "01 Y": ["01 W", "51 W"],
    "02 Y": ["04 W", "48 W"],
    "03 W": ["01 W", "02 W"],
    "06 W": ["00 W", "06 W"],
    "04 W": ["00 W", "04 W"],
  };

  const handleChange = useCallback(
    (field, value) => {
      onChange(field, value);
      setErrors((prev) => ({ ...prev, [field]: "" }));

      // Clear dependent fields when designation changes
      if (field === "designation") {
        onChange("unit", "");
        onChange("trainingPeriod", "");
        onChange("theoryDuration", "");
        onChange("practicalDuration", "");
      }

      // Clear training fields when unit changes
      if (field === "unit") {
        onChange("trainingPeriod", "");
        onChange("theoryDuration", "");
        onChange("practicalDuration", "");
      }

      // Auto-fill theory and practical duration when training period changes
      if (field === "trainingPeriod") {
        if (trainingMap[value]) {
          const [theory, practical] = trainingMap[value];
          onChange("theoryDuration", theory);
          onChange("practicalDuration", practical);
        }
      }
    },
    [onChange]
  );

  // Enhanced validation with comprehensive type checking
  const validateField = useCallback((field, value) => {
    // Check for empty/null/undefined values
    if (value === null || value === undefined || value.toString().trim() === "") {
      return "This field is required";
    }

    const stringValue = value.toString().trim();

    // String validation for text fields
    if (["workingUnder", "institution", "fieldOfStudy", "employeeNumber"].includes(field)) {
      if (stringValue.length < 2) {
        return "Must be at least 2 characters long";
      }
      if (stringValue.length > 100) {
        return "Must not exceed 100 characters";
      }
      // Check for valid characters (letters, numbers, spaces, common punctuation)
      if (!/^[a-zA-Z0-9\s.,'-/()&]+$/.test(stringValue)) {
        return "Contains invalid characters";
      }
    }

    // Year validation
    if (field === "educationStartYear" || field === "additionalQualificationYear") {
      const year = parseInt(stringValue, 10);
      const currentYear = new Date().getFullYear();
      if (isNaN(year)) {
        return "Please enter a valid year";
      }
      if (year < 1970 || year > currentYear) {
        return `Year must be between 1970 and ${currentYear}`;
      }
    }

    // Course duration validation
    if (field === "eduCourseDuration") {
      const duration = parseInt(stringValue, 10);
      if (isNaN(duration)) {
        return "Please enter a valid number";
      }
      if (duration < 1 || duration > 6) {
        return "Course duration must be between 1 and 6 years";
      }
    }

    // Enhanced grade value validation
    if (field === "gradeValue") {
      const gradeType = formData.gradeType;
      if (!gradeType) {
        return "Please select grade type first";
      }

      if (gradeType === "CGPA (out of 10)") {
        const cgpa = parseFloat(stringValue);
        if (isNaN(cgpa)) {
          return "Please enter a valid CGPA";
        }
        if (cgpa < 0 || cgpa > 10) {
          return "CGPA must be between 0 and 10";
        }
        // Check decimal places in the original string to handle cases like "9.999"
        const decimalPart = stringValue.split('.')[1];
        if (decimalPart && decimalPart.length > 2) {
          return "CGPA can have maximum 2 decimal places";
        }
      } else if (gradeType === "CGPA (out of 4)") {
        const cgpa = parseFloat(stringValue);
        if (isNaN(cgpa)) {
          return "Please enter a valid CGPA";
        }
        if (cgpa < 0 || cgpa > 4) {
          return "CGPA must be between 0 and 4";
        }
        // Check decimal places in the original string to handle cases like "3.999"
        const decimalPart = stringValue.split('.')[1];
        if (decimalPart && decimalPart.length > 2) {
          return "CGPA can have maximum 2 decimal places";
        }
      } else if (gradeType === "Percentage") {
        const percentage = parseFloat(stringValue);
        if (isNaN(percentage)) {
          return "Please enter a valid percentage";
        }
        if (percentage < 0 || percentage > 100) {
          return "Percentage must be between 0 and 100";
        }
        // Check decimal places in the original string to handle cases like "99.999"
        const decimalPart = stringValue.split('.')[1];
        if (decimalPart && decimalPart.length > 2) {
          return "Percentage can have maximum 2 decimal places";
        }
      } else if (gradeType === "Grade") {
        if (!/^[A-F][+-]?$|^[O]$/.test(stringValue.toUpperCase())) {
          return "Enter valid grade (A+, A, B+, B, C+, C, D+, D, F, O)";
        }
      }
    }

    // Date validation
    if (field === "dateOfAppointmentInRailway") {
      const date = new Date(stringValue);
      const currentDate = new Date();
      const minDate = new Date('1950-01-01');

      if (isNaN(date.getTime())) {
        return "Please enter a valid date";
      }
      if (date < minDate || date > currentDate) {
        return "Date must be between 1950 and today";
      }
    }

    return "";
  }, [formData.gradeType]);

  const requiredFields = useMemo(() => [
    "dateOfAppointmentInRailway",
    "modeOfAppointment",
    "designation",
    "unit",
    "trainingPeriod",
    "workingUnder",
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
  ], []);

  const validateAllFields = useCallback(() => {
    const newErrors = {};

    // Validate all required fields
    requiredFields.forEach((field) => {
      const value = formData[field];
      const error = validateField(field, value);
      if (error) newErrors[field] = error;
    });

    // Validate conditional fields for "Other" selections
    if (formData.modeOfAppointment === "Other" && !formData.modeOfAppointmentOther?.trim()) {
      newErrors.modeOfAppointmentOther = "Please specify the mode of appointment";
    }

    if (formData.designation === "Other" && !formData.designationOther?.trim()) {
      newErrors.designationOther = "Please specify the designation";
    }

    if (formData.unit === "Other" && !formData.unitOther?.trim()) {
      newErrors.unitOther = "Please specify the unit/division";
    }

    if (formData.highestQualification === "Other" && !formData.otherQualification?.trim()) {
      newErrors.otherQualification = "Please specify the qualification";
    }

    // Validate additional qualification fields
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
  }, [formData, requiredFields, validateField]);

  useEffect(() => {
    if (onChange.setValidationFunction) {
      onChange.setValidationFunction(validateAllFields);
    }
  }, [validateAllFields, onChange]);

  // Auto-calculate graduation year
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
    () => Array.from({ length: 55 }, (_, i) => (new Date().getFullYear() - i).toString()),
    []
  );

  // Memoized options for better performance
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

  const appointmentModeOptions = useMemo(() => ["", "RRB", "Promotion Through LDCE", "Promotion Through Seniority", "Other"], []);

  // Direct designation options (no course type dependency)
  const designationOptions = useMemo(() => [
    "", "RRC Act Apprentice 1961", "Act Junior Apprentices", "Rail Kaushal Vikas Yojana", "Summer Vacation training", "Other"
  ], []);

  // Get unit options based on selected designation
  const unitOptionsForDesignation = useMemo(() => {
    if (!formData.designation || formData.designation === "Other") return [""];
    return ["", ...(unitMap[formData.designation] || []), "Other"];
  }, [formData.designation]);

  // Training period options
  const trainingPeriodOptions = useMemo(() => [
    "", "01 Y", "02 Y", "03 W", "04 W", "06 W"
  ], []);

  const professionalFields = useMemo(() => [
    { label: "Date of Appointment", field: "dateOfAppointmentInRailway", type: "date" },
    {
      label: "Mode of Appointment",
      field: "modeOfAppointment",
      type: "select",
      options: appointmentModeOptions,
    },
    formData.modeOfAppointment === "Other" && {
      label: "Specify Mode",
      field: "modeOfAppointmentOther",
    },
    {
      label: "Designation",
      field: "designation",
      type: "select",
      options: designationOptions,
    },
    formData.designation === "Other" && {
      label: "Specify Designation",
      field: "designationOther",
    },
    {
      label: "Unit / Custodian / Other Details",
      field: "unit",
      type: "select",
      options: unitOptionsForDesignation,
      disabled: !formData.designation || formData.designation === "Other",
    },
    formData.unit === "Other" && {
      label: "Specify Unit / Division",
      field: "unitOther",
    },
    {
      label: "Training Period",
      field: "trainingPeriod",
      type: "select",
      options: trainingPeriodOptions,
      disabled: !formData.unit || formData.unit === "Other",
    },
    {
      label: "Theory Duration",
      field: "theoryDuration",
      disabled: true,
      helpText: "Auto-calculated from training period",
    },
    {
      label: "Practical Duration",
      field: "practicalDuration",
      disabled: true,
      helpText: "Auto-calculated from training period",
    },
    { label: "Working Under", field: "workingUnder" },
    { label: "Employee Number", field: "employeeNumber" },
  ], [
    formData.modeOfAppointment,
    formData.designation,
    formData.unit,
    formData.trainingPeriod,
    appointmentModeOptions,
    designationOptions,
    unitOptionsForDesignation,
    trainingPeriodOptions
  ]);

  const educationFields = useMemo(() => [
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
    {
      label: "Grade/Percentage/CGPA",
      field: "gradeValue",
      helpText: formData.gradeType === "CGPA (out of 10)" ? "Enter CGPA between 0-10" :
        formData.gradeType === "CGPA (out of 4)" ? "Enter CGPA between 0-4" :
          formData.gradeType === "Percentage" ? "Enter percentage between 0-100" :
            formData.gradeType === "Grade" ? "Enter grade (A+, A, B+, B, C+, C, D+, D, F, O)" : ""
    },
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
  ], [formData.highestQualification, formData.hasAdditionalQualification, formData.gradeType, qualificationOptions, boardOptions, durationOptions, modeOptions, gradeTypeOptions, divisionOptions, generateYearOptions]);

  const renderFields = useCallback((fields) =>
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
              className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${errors[field] ? "border-red-500" : "border-gray-300"
                } ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
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
              className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${errors[field] ? "border-red-500" : "border-gray-300"
                } ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
              placeholder={`Enter ${label.toLowerCase()}`}
              disabled={disabled}
            />
          )}
          {helpText && <p className="text-xs text-gray-500 mt-1">{helpText}</p>}
          {errors[field] && <p className="text-sm text-red-500 mt-1">{errors[field]}</p>}
        </div>
      )), [formData, errors, handleChange]);

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