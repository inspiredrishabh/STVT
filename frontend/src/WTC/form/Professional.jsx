import React, { useEffect, useState, useCallback, useMemo } from "react";

const Professional = ({ formData, onChange }) => {
  const [errors, setErrors] = useState({});

  // Course type to designation mapping
  const designationMap = useMemo(() => ({
    "Induction Course": [
      "CG Apprentice Technician III",
      "RRB Apprentice Technician III",
      "RRC Assistant Workshop",
      "CG Assistant Workshop",
    ],
    "Promotional Course": ["GDCE App. Tech. III"],
    "Refresher Course": [
      "Refresher Course for Welders",
      "Refresher Course for Artisans",
    ],
    "Special Course": [
      "Special Course on MIG/ MAG Welding & Air Plasma Cutting",
      "Basic Welding Training for Beginners",
      "Pre-selection Coaching for JE Selection",
    ],
  }), []);

  // Designation to unit mapping
  const unitMap = useMemo(() => ({
    "CG Apprentice Technician III": [
      "Dy. CME (Diesel)/ RSW/CB",
      "Dy. CEE /CB",
      "Dy. CEE (W)/AMV",
      "RDSO",
      "LKO Division",
    ],
    "RRB Apprentice Technician III": [
      "Dy. CME (Diesel)/ RSW/CB",
      "Dy. CEE /CB",
      "Dy. CEE (W)/AMV",
    ],
    "RRC Assistant Workshop": ["Dy. CEE /CB", "Dy. CME (Diesel)/ RSW/CB"],
    "CG Assistant Workshop": ["Dy. CEE /CB", "Dy. CME (Diesel)/ RSW/CB"],
    "GDCE App. Tech. III": [
      "Dy. CME (Diesel)/ RSW/CB",
      "Dy. CEE /CB",
      "LKO Division",
    ],
    "Refresher Course for Welders": ["Northern Railway Units & Depot"],
    "Refresher Course for Artisans": ["Northern Railway Units & Depot"],
    "Special Course on MIG/ MAG Welding & Air Plasma Cutting": [
      "Northern Railway Units & Depot",
    ],
    "Basic Welding Training for Beginners": ["Northern Railway Units & Depot"],
    "Pre-selection Coaching for JE Selection": [
      "Dy. CME (Diesel)/ RSW/CB",
      "Dy. CEE /CB",
      "Dy. CEE (W)/AMV",
      "LKO Division",
    ],
  }), []);

  // Designation-Unit specific training period mapping based on PDF data
  const designationUnitTrainingMap = useMemo(() => ({
    // CG Apprentice Technician III
    "CG Apprentice Technician III|Dy. CME (Diesel)/ RSW/CB": ["02 Years", "01 Year", "06 Months"],
    "CG Apprentice Technician III|Dy. CEE /CB": ["02 Years", "01 Year", "06 Months"],
    "CG Apprentice Technician III|Dy. CEE (W)/AMV": ["02 Years", "01 Year", "06 Months"],
    "CG Apprentice Technician III|RDSO": ["02 Years", "01 Year", "06 Months"],
    "CG Apprentice Technician III|LKO Division": ["02 Years", "01 Year", "06 Months"],


    // RRB Apprentice Technician III
    "RRB Apprentice Technician III|Dy. CME (Diesel)/ RSW/CB": ["01 Year", "06 Months"],
    "RRB Apprentice Technician III|Dy. CEE /CB": ["01 Year", "06 Months"],
    "RRB Apprentice Technician III|Dy. CEE (W)/AMV": ["01 Year", "06 Months"],

    // RRC Assistant Workshop
    "RRC Assistant Workshop|Dy. CEE /CB": ["12 Days"],
    "RRC Assistant Workshop|Dy. CME (Diesel)/ RSW/CB": ["78 Days"],

    // CG Assistant Workshop
    "CG Assistant Workshop|Dy. CEE /CB": ["12 Days"],
    "CG Assistant Workshop|Dy. CME (Diesel)/ RSW/CB": ["78 Days"],

    // GDCE App. Tech. III
    "GDCE App. Tech. III|Dy. CME (Diesel)/ RSW/CB": ["06 Months"],
    "GDCE App. Tech. III|Dy. CEE /CB": ["06 Months"],
    "GDCE App. Tech. III|LKO Division": ["06 Months"],

    // Refresher Course for Welders
    "Refresher Course for Welders|Northern Railway Units & Depot": ["03 Weeks"],

    // Refresher Course for Artisans
    "Refresher Course for Artisans|Northern Railway Units & Depot": ["02 Weeks"],

    // Special Course on MIG/MAG Welding & Air Plasma Cutting
    "Special Course on MIG/ MAG Welding & Air Plasma Cutting|Northern Railway Units & Depot": ["01 Week"],

    // Basic Welding Training for Beginners
    "Basic Welding Training for Beginners|Northern Railway Units & Depot": ["04 Weeks"],

    // Pre-selection Coaching for JE Selection
    "Pre-selection Coaching for JE Selection|Dy. CME (Diesel)/ RSW/CB": ["21 Days"],
    "Pre-selection Coaching for JE Selection|Dy. CEE /CB": ["21 Days"],
    "Pre-selection Coaching for JE Selection|Dy. CEE (W)/AMV": ["21 Days"],
    "Pre-selection Coaching for JE Selection|LKO Division": ["21 Days"],
  }), []);


  const designationUnitPeriodToDurations = {
    // CG Apprentice Technician III (Induction Course)
    "CG Apprentice Technician III|Any|02 Years": ["06 Months", "18 Months"],
    "CG Apprentice Technician III|Any|01 Year": ["03 Months", "09 Months"],
    "CG Apprentice Technician III|Any|06 Months": ["03 Months", "03 Months"],

    // RRB Apprentice Technician III
    "RRB Apprentice Technician III|Any|01 Year": ["03 Months", "09 Months"],
    "RRB Apprentice Technician III|Any|06 Months": ["03 Months", "03 Months"],

    // RRC Assistant Workshop
    "RRC Assistant Workshop|Dy. CEE /CB|12 Days": ["12 Days", "00 Days"],
    "RRC Assistant Workshop|Dy. CME (Diesel)/ RSW/CB|78 Days": ["78 Days", "00 Days"],

    // CG Assistant Workshop
    "CG Assistant Workshop|Dy. CEE /CB|12 Days": ["12 Days", "00 Days"],
    "CG Assistant Workshop|Dy. CME (Diesel)/ RSW/CB|78 Days": ["78 Days", "00 Days"],

    // GDCE App. Tech. III (Promotional Course)
    "GDCE App. Tech. III|Any|06 Months": ["01 Month", "05 Months"],

    // Refresher Course for Welders
    "Refresher Course for Welders|Northern Railway Units & Depot|03 Weeks": ["01 Week", "02 Weeks"],

    // Refresher Course for Artisans
    "Refresher Course for Artisans|Northern Railway Units & Depot|02 Weeks": ["02 Weeks", "00 Weeks"],

    // Special Course on MIG/MAG Welding & Air Plasma Cutting
    "Special Course on MIG/ MAG Welding & Air Plasma Cutting|Northern Railway Units & Depot|01 Week": ["01 Week", "00 Weeks"],

    // Basic Welding Training for Beginners
    "Basic Welding Training for Beginners|Northern Railway Units & Depot|04 Weeks": ["1.5 Weeks", "2.5 Weeks"],

    // Pre-selection Coaching for JE Selection
    "Pre-selection Coaching for JE Selection|Dy. CME (Diesel)/ RSW/CB|21 Days": ["21 Days", "00 Days"],
    "Pre-selection Coaching for JE Selection|Dy. CEE /CB|21 Days": ["21 Days", "00 Days"],
    "Pre-selection Coaching for JE Selection|Dy. CEE (W)/AMV|21 Days": ["21 Days", "00 Days"],
    "Pre-selection Coaching for JE Selection|LKO Division|21 Days": ["21 Days", "00 Days"],

    // RRC Act Apprentice 1961
    "RRC Act Apprentice 1961|Any|01 Year": ["01 Week", "51 Weeks"],

    // Act Junior Apprentices
    "Act Junior Apprentices|Any|01 Year": ["04 Weeks", "48 Weeks"],

    // Rail Kaushal Vikas Yojana
    "Rail Kaushal Vikas Yojana - Welder|Any|03 Weeks": ["01 Week", "02 Weeks"],
    "Rail Kaushal Vikas Yojana - Electrician|Any|03 Weeks": ["01 Week", "02 Weeks"],

    // Summer Vocation Training
    "Summer Vocation training|Any|04 Weeks": ["00 Weeks", "04 Weeks"],
    "Summer Vocation training|Any|06 Weeks": ["00 Weeks", "06 Weeks"],
  };


  const handleChange = useCallback(
    (field, value) => {
      onChange(field, value);
      setErrors((prev) => ({ ...prev, [field]: "" }));

      // Clear dependent fields when course type changes
      if (field === "courseType") {
        onChange("designation", "");
        onChange("unit", "");
        onChange("trainingPeriod", "");
        onChange("theoryDuration", "");
        onChange("practicalDuration", "");
        onChange("customTrainingPeriod", "");
        onChange("customTheoryDuration", "");
        onChange("customPracticalDuration", "");
      }

      // Clear unit and training fields when designation changes
      if (field === "designation") {
        onChange("unit", "");
        onChange("trainingPeriod", "");
        onChange("theoryDuration", "");
        onChange("practicalDuration", "");
        onChange("customTrainingPeriod", "");
        onChange("customTheoryDuration", "");
        onChange("customPracticalDuration", "");
      }

      // Clear training fields when unit changes
      if (field === "unit") {
        onChange("trainingPeriod", "");
        onChange("theoryDuration", "");
        onChange("practicalDuration", "");
        onChange("customTrainingPeriod", "");
        onChange("customTheoryDuration", "");
        onChange("customPracticalDuration", "");
      }

      // Auto-fill theory and practical duration when training period changes
      if (field === "trainingPeriod") {
        if (value === "Custom") {
          onChange("theoryDuration", "");
          onChange("practicalDuration", "");
        } else {
          const exactKey = `${formData.designation}|${formData.unit}|${value}`;
          const fallbackKey = `${formData.designation}|Any|${value}`;
          const durations = designationUnitPeriodToDurations[exactKey] || designationUnitPeriodToDurations[fallbackKey];

          console.log('Auto-calculation debug:', {
            designation: formData.designation,
            unit: formData.unit,
            trainingPeriod: value,
            exactKey,
            fallbackKey,
            durations,
            availableKeys: Object.keys(designationUnitPeriodToDurations)
          });

          if (durations) {
            const [theory, practical] = durations;
            onChange("theoryDuration", theory);
            onChange("practicalDuration", practical);
            // Clear custom fields
            onChange("customTrainingPeriod", "");
            onChange("customTheoryDuration", "");
            onChange("customPracticalDuration", "");
          } else {
            // No match found
            onChange("theoryDuration", "");
            onChange("practicalDuration", "");
          }
        }
      }
    },
    [onChange, formData]
  );

  // Enhanced validation with comprehensive type checking
  const validateField = useCallback(
    (field, value) => {
      // Check for empty/null/undefined values
      if (
        value === null ||
        value === undefined ||
        value.toString().trim() === ""
      ) {
        return "This field is required";
      }

      const stringValue = value.toString().trim();

      // String validation for text fields
      if (
        [
          "workingUnder",
          "institution",
          "fieldOfStudy",
          "hrmsId",
          "pfNoNpsUps",
          "employeeNumber",
          "customTrainingPeriod",
          "customTheoryDuration",
          "customPracticalDuration",
        ].includes(field)
      ) {
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
          const decimalPart = stringValue.split(".")[1];
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
          const decimalPart = stringValue.split(".")[1];
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
          const decimalPart = stringValue.split(".")[1];
          if (decimalPart && decimalPart.length > 2) {
            return "Percentage can have maximum 2 decimal places";
          }
        }
      }

      // Date validation
      if (field === "dateOfAppointmentInRailway") {
        const date = new Date(stringValue);
        const currentDate = new Date();
        const minDate = new Date("1950-01-01");

        if (isNaN(date.getTime())) {
          return "Please enter a valid date";
        }
        if (date < minDate || date > currentDate) {
          return "Date must be between 1950 and today";
        }
      }

      return "";
    },
    [formData.gradeType]
  );

  const requiredFields = useMemo(
    () => [
      "dateOfAppointmentInRailway",
      "modeOfAppointment",
      "courseType",
      "designation",
      "unit",
      "trainingPeriod",
      "highestQualification",
      "fieldOfStudy",
      "institution",
      "gradeType",
      "gradeValue",
    ],
    []
  );

  const validateAllFields = useCallback(() => {
    const newErrors = {};

    // Validate all required fields
    requiredFields.forEach((field) => {
      const value = formData[field];
      const error = validateField(field, value);
      if (error) newErrors[field] = error;
    });

    // Validate conditional fields for "Other" selections
    if (
      formData.modeOfAppointment === "Other" &&
      !formData.modeOfAppointmentOther?.trim()
    ) {
      newErrors.modeOfAppointmentOther =
        "Please specify the mode of appointment";
    }

    if (formData.courseType === "Other" && !formData.courseTypeOther?.trim()) {
      newErrors.courseTypeOther = "Please specify the course type";
    }

    if (
      formData.designation === "Other" &&
      !formData.designationOther?.trim()
    ) {
      newErrors.designationOther = "Please specify the designation";
    }

    if (formData.unit === "Other" && !formData.unitOther?.trim()) {
      newErrors.unitOther = "Please specify the unit/division";
    }

    if (
      formData.highestQualification === "Other" &&
      !formData.otherQualification?.trim()
    ) {
      newErrors.otherQualification = "Please specify the qualification";
    }

    // Validate custom training period fields
    if (formData.trainingPeriod === "Custom") {
      if (!formData.customTrainingPeriod?.trim()) {
        newErrors.customTrainingPeriod =
          "Please specify the custom training period";
      }
      if (!formData.customTheoryDuration?.trim()) {
        newErrors.customTheoryDuration =
          "Please specify the custom theory duration";
      }
      if (!formData.customPracticalDuration?.trim()) {
        newErrors.customPracticalDuration =
          "Please specify the custom practical duration";
      }
    }

    setErrors(newErrors);
    return {
      isValid: Object.keys(newErrors).length === 0,
      errors: newErrors,
    };
  }, [formData, requiredFields, validateField]);

  useEffect(() => {
    if (onChange.setValidationFunction) {
      onChange.setValidationFunction(validateAllFields);
    }
  }, [validateAllFields, onChange]);

  // Memoized options for better performance
  const qualificationOptions = useMemo(
    () => [
      "",
      "High School",
      "Intermediate",
      "Diploma",
      "Bachelor's Degree",
      "Master's Degree",
      "Ph.D",
      "Other",
    ],
    []
  );

  const gradeTypeOptions = useMemo(
    () => ["", "Percentage", "CGPA (out of 10)", "CGPA (out of 4)"],
    []
  );

  const appointmentModeOptions = useMemo(
    () => [
      "",
      "RRB",
      "Promotion Through LDCE",
      "Promotion Through Seniority",
      "Other",
    ],
    []
  );

  const courseTypeOptions = useMemo(
    () => [
      "",
      "Induction Course",
      "Promotional Course",
      "Refresher Course",
      "Special Course",
      "Other",
    ],
    []
  );

  // Get designation options based on selected course type
  const designationOptions = useMemo(() => {
    if (!formData.courseType || formData.courseType === "Other") return [""];
    return ["", ...(designationMap[formData.courseType] || []), "Other"];
  }, [designationMap, formData.courseType]);

  // Get unit options based on selected designation
  const unitOptionsForDesignation = useMemo(() => {
    if (!formData.designation || formData.designation === "Other") return [""];
    return ["", ...(unitMap[formData.designation] || []), "Other"];
  }, [formData.designation, unitMap]);

  // Get training period options based on selected designation-unit combination
  const trainingPeriodOptionsForDesignationUnit = useMemo(() => {
    if (!formData.designation || !formData.unit ||
      formData.designation === "Other" || formData.unit === "Other") {
      return [""];
    }

    const key = `${formData.designation}|${formData.unit}`;
    const periods = designationUnitTrainingMap[key] || [];
    return ["", ...periods, "Custom"];
  }, [designationUnitTrainingMap, formData.designation, formData.unit]);

  const professionalFields = useMemo(
    () => [
      {
        label: "Date of Appointment",
        field: "dateOfAppointmentInRailway",
        type: "date",
      },
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
        label: "Course Type",
        field: "courseType",
        type: "select",
        options: courseTypeOptions,
      },
      formData.courseType === "Other" && {
        label: "Specify Course Type",
        field: "courseTypeOther",
      },
      {
        label: "Designation",
        field: "designation",
        type: "select",
        options: designationOptions,
        disabled: !formData.courseType || formData.courseType === "Other",
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
        options: trainingPeriodOptionsForDesignationUnit,
        disabled: !formData.unit || formData.unit === "Other",
      },
      formData.trainingPeriod === "Custom" && {
        label: "Custom Training Period",
        field: "customTrainingPeriod",
        helpText: "e.g., 15 Days, 8 Weeks, 3 Months, etc.",
      },
      formData.trainingPeriod === "Custom" && {
        label: "Custom Theory Duration",
        field: "customTheoryDuration",
        helpText: "e.g., 10 Days, 4 Weeks, 2 Months, etc.",
      },
      formData.trainingPeriod === "Custom" && {
        label: "Custom Practical Duration",
        field: "customPracticalDuration",
        helpText: "e.g., 5 Days, 4 Weeks, 1 Month, etc.",
      },
      {
        label: "Theory Duration",
        field: "theoryDuration",
        disabled: true,
        helpText:
          formData.trainingPeriod === "Custom"
            ? "Use custom theory duration field above"
            : "Auto-calculated from training period",
      },
      {
        label: "Practical Duration",
        field: "practicalDuration",
        disabled: true,
        helpText:
          formData.trainingPeriod === "Custom"
            ? "Use custom practical duration field above"
            : "Auto-calculated from training period",
      },
      { label: "Working Under", field: "workingUnder", required: false },
      { label: "HRMS ID", field: "hrmsId", required: false },
      { label: "PF/NPS/UPS No.", field: "pfNoNpsUps", required: false },
      { label: "Employee Number", field: "employeeNumber", required: false },
    ],
    [
      formData.modeOfAppointment,
      formData.courseType,
      formData.designation,
      formData.unit,
      formData.trainingPeriod,
      appointmentModeOptions,
      courseTypeOptions,
      designationOptions,
      unitOptionsForDesignation,
      trainingPeriodOptionsForDesignationUnit,
    ]
  );

  const educationFields = useMemo(
    () => [
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
      { label: "Field of Study", field: "fieldOfStudy" },
      { label: "Institution", field: "institution" },
      {
        label: "Grade Type",
        field: "gradeType",
        type: "select",
        options: gradeTypeOptions,
      },
      {
        label: "Grade Value",
        field: "gradeValue",
        type: "number",
        step: 0.01,
        helpText:
          formData.gradeType === "CGPA (out of 10)"
            ? "Enter CGPA between 0-10"
            : formData.gradeType === "CGPA (out of 4)"
              ? "Enter CGPA between 0-4"
              : formData.gradeType === "Percentage"
                ? "Enter percentage between 0-100"
                : "",
      },
    ],
    [
      formData.highestQualification,
      formData.gradeType,
      qualificationOptions,
      gradeTypeOptions,
    ]
  );

  const renderFields = useCallback(
    (fields) =>
      fields
        .filter(Boolean)
        .map(
          ({
            label,
            field,
            type = "text",
            options = [],
            disabled = false,
            required = true,
            helpText,
            step,
          }) => (
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
                  step={step}
                />
              )}
              {helpText && (
                <p className="text-xs text-gray-500 mt-1">{helpText}</p>
              )}
              {errors[field] && (
                <p className="text-sm text-red-500 mt-1">{errors[field]}</p>
              )}
            </div>
          )
        ),
    [formData, errors, handleChange]
  );

  return (
    <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200">
      <div className="flex items-center space-x-3 mb-6">
        <div className="h-12 w-12 flex items-center justify-center bg-indigo-100 text-indigo-600 rounded-full shadow text-lg">
          💼
        </div>
        <h3 className="text-xl font-semibold text-gray-800">
          Professional Detail
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6 mb-10">
        {renderFields(professionalFields)}
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
        {renderFields(educationFields)}
      </div>
    </div>
  );
};

export default Professional;