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
    "Promotional Course": ["GDCE App. Tech. III", "SSC", "JE"],
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
    "SSC": [
      "Dy. CME (Diesel)/ RSW/CB",
      "Dy. CEE /CB",
      "Dy. CEE (W)/AMV",
      "LKO Division",
    ],
    "JE": [
      "Dy. CME (Diesel)/ RSW/CB",
      "Dy. CEE /CB",
      "Dy. CEE (W)/AMV",
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

    // SSC
    "SSC|Dy. CME (Diesel)/ RSW/CB": ["06 Months", "01 Year"],
    "SSC|Dy. CEE /CB": ["06 Months", "01 Year"],
    "SSC|Dy. CEE (W)/AMV": ["06 Months", "01 Year"],
    "SSC|LKO Division": ["06 Months", "01 Year"],

    // JE
    "JE|Dy. CME (Diesel)/ RSW/CB": ["06 Months", "01 Year"],
    "JE|Dy. CEE /CB": ["06 Months", "01 Year"],
    "JE|Dy. CEE (W)/AMV": ["06 Months", "01 Year"],
    "JE|LKO Division": ["06 Months", "01 Year"],

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


  const designationUnitPeriodToDurations = useMemo(() => ({
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

    // SSC (Promotional Course)
    "SSC|Any|06 Months": ["02 Months", "04 Months"],
    "SSC|Any|01 Year": ["04 Months", "08 Months"],

    // JE (Promotional Course)
    "JE|Any|06 Months": ["02 Months", "04 Months"],
    "JE|Any|01 Year": ["04 Months", "08 Months"],

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
  }), []);


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
      }

      // Clear unit and training fields when designation changes
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
        // Check if the value matches a pre-defined option
        const exactKey = `${formData.designation}|${formData.unit}|${value}`;
        const fallbackKey = `${formData.designation}|Any|${value}`;
        const durations = designationUnitPeriodToDurations[exactKey] || designationUnitPeriodToDurations[fallbackKey];

        if (durations) {
          const [theory, practical] = durations;
          onChange("theoryDuration", theory);
          onChange("practicalDuration", practical);
        } else {
          // No match found - user is typing a custom value, clear calculated durations
          onChange("theoryDuration", "");
          onChange("practicalDuration", "");
        }
      }
    },
    [onChange, formData, designationUnitPeriodToDurations]
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

      // Validate training period has required time units (Days, Weeks, Months, Years)
      if (field === "trainingPeriod") {
        // Skip validation for predefined options
        const exactKey = `${formData.designation}|${formData.unit}|${stringValue}`;
        const fallbackKey = `${formData.designation}|Any|${stringValue}`;
        const isPredefinedOption = designationUnitPeriodToDurations[exactKey] || designationUnitPeriodToDurations[fallbackKey];

        if (!isPredefinedOption) {
          if (stringValue.length < 2) {
            return "Must be at least 2 characters long";
          }
          if (stringValue.length > 100) {
            return "Must not exceed 100 characters";
          }

          // Check for valid characters 
          if (!/^[a-zA-Z0-9\s.,'-/()&]+$/.test(stringValue)) {
            return "Contains invalid characters";
          }

          // Check if the duration includes proper time units
          const lowerCaseValue = stringValue.toLowerCase();
          if (!(
            lowerCaseValue.includes("day") ||
            lowerCaseValue.includes("week") ||
            lowerCaseValue.includes("month") ||
            lowerCaseValue.includes("year")
          )) {
            return "Must include time unit (Days, Weeks, Months, or Years)";
          }
        }
      }

      // Validate theory and practical durations if filled manually
      if (["theoryDuration", "practicalDuration"].includes(field)) {
        // Skip validation for auto-calculated values
        const trainingPeriodKey = `${formData.designation}|${formData.unit}|${formData.trainingPeriod}`;
        const fallbackKey = `${formData.designation}|Any|${formData.trainingPeriod}`;
        const isAutoCalculated = designationUnitPeriodToDurations[trainingPeriodKey] || designationUnitPeriodToDurations[fallbackKey];

        if (!isAutoCalculated) {
          if (stringValue.length < 2) {
            return "Must be at least 2 characters long";
          }
          if (stringValue.length > 100) {
            return "Must not exceed 100 characters";
          }

          // Check for valid characters 
          if (!/^[a-zA-Z0-9\s.,'-/()&]+$/.test(stringValue)) {
            return "Contains invalid characters";
          }

          // Check if the duration includes proper time units
          const lowerCaseValue = stringValue.toLowerCase();
          if (!(
            lowerCaseValue.includes("day") ||
            lowerCaseValue.includes("week") ||
            lowerCaseValue.includes("month") ||
            lowerCaseValue.includes("year")
          )) {
            return "Must include time unit (Days, Weeks, Months, or Years)";
          }
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
    [formData, designationUnitPeriodToDurations]
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

    if (formData.gradeType && formData.gradeValue) {
      const gradeValueError = validateField("gradeValue", formData.gradeValue);
      if (gradeValueError) {
        newErrors.gradeValue = gradeValueError;
      }
    }

    // Check if theory and practical durations are required
    const trainingPeriodKey = `${formData.designation}|${formData.unit}|${formData.trainingPeriod}`;
    const fallbackKey = `${formData.designation}|Any|${formData.trainingPeriod}`;
    const isAutoCalculated = designationUnitPeriodToDurations[trainingPeriodKey] || designationUnitPeriodToDurations[fallbackKey];

    if (!isAutoCalculated && formData.trainingPeriod) {
      // For custom training periods, theory and practical durations must be manually entered
      if (!formData.theoryDuration?.trim()) {
        newErrors.theoryDuration = "Please specify the theory duration";
      } else {
        const error = validateField("theoryDuration", formData.theoryDuration);
        if (error) newErrors.theoryDuration = error;
      }

      if (!formData.practicalDuration?.trim()) {
        newErrors.practicalDuration = "Please specify the practical duration";
      } else {
        const error = validateField("practicalDuration", formData.practicalDuration);
        if (error) newErrors.practicalDuration = error;
      }
    }

    setErrors(newErrors);
    return {
      isValid: Object.keys(newErrors).length === 0,
      errors: newErrors,
    };
  }, [formData, requiredFields, validateField, designationUnitPeriodToDurations]);

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

  const getFieldOfStudyOptions = useCallback(() => {
    const qualification = formData.highestQualification;

    switch (qualification) {
      case "Diploma":
        return [
          "",
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
          "",
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
          "",
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
          "",
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
        return ["", "Other"];
    }
  }, [formData.highestQualification]);

  const fieldOfStudyOptions = useMemo(() => getFieldOfStudyOptions(), [getFieldOfStudyOptions]);

  const appointmentModeOptions = useMemo(
    () => [
      "",
      "RRB",
      "CG",
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
    return ["", ...periods];
  }, [designationUnitTrainingMap, formData.designation, formData.unit]);

  const professionalFields = useMemo(
    () => [
      { label: "Date of Appointment", field: "dateOfAppointmentInRailway", type: "date", },
      { label: "Mode of Appointment", field: "modeOfAppointment", type: "text", options: appointmentModeOptions, },
      { label: "Course Type", field: "courseType", type: "text", options: courseTypeOptions, },
      { label: "Designation", field: "designation", type: "text", options: designationOptions, },
      { label: "Unit / Custodian / Other Details", field: "unit", type: "text", options: unitOptionsForDesignation, },
      {
        label: "Training Period",
        field: "trainingPeriod",
        type: "text",
        options: trainingPeriodOptionsForDesignationUnit,
        helpText: "Select from options or enter custom period (e.g., 15 Days, 8 Weeks, 3 Months)"
      },
      {
        label: "Theory Duration",
        field: "theoryDuration",
        disabled: !!designationUnitPeriodToDurations[`${formData.designation}|${formData.unit}|${formData.trainingPeriod}`] ||
          !!designationUnitPeriodToDurations[`${formData.designation}|Any|${formData.trainingPeriod}`],
        helpText: designationUnitPeriodToDurations[`${formData.designation}|${formData.unit}|${formData.trainingPeriod}`] ||
          designationUnitPeriodToDurations[`${formData.designation}|Any|${formData.trainingPeriod}`]
          ? "Auto-calculated from training period"
          : "Enter theory duration (e.g., 10 Days, 4 Weeks, 2 Months)",
      },
      {
        label: "Practical Duration",
        field: "practicalDuration",
        disabled: !!designationUnitPeriodToDurations[`${formData.designation}|${formData.unit}|${formData.trainingPeriod}`] ||
          !!designationUnitPeriodToDurations[`${formData.designation}|Any|${formData.trainingPeriod}`],
        helpText: designationUnitPeriodToDurations[`${formData.designation}|${formData.unit}|${formData.trainingPeriod}`] ||
          designationUnitPeriodToDurations[`${formData.designation}|Any|${formData.trainingPeriod}`]
          ? "Auto-calculated from training period"
          : "Enter practical duration (e.g., 5 Days, 4 Weeks, 1 Month)",
      },
      { label: "Working Under", field: "workingUnder", required: false },
      { label: "HRMS ID", field: "hrmsId", required: false },
      { label: "PF/NPS/UPS No.", field: "pfNoNpsUps", required: false },
      { label: "Employee Number", field: "employeeNumber", required: false },
    ],
    [
      formData,
      appointmentModeOptions,
      courseTypeOptions,
      designationOptions,
      unitOptionsForDesignation,
      trainingPeriodOptionsForDesignationUnit,
      designationUnitPeriodToDurations,
    ]
  );

  const educationFields = useMemo(
    () => [
      {
        label: "Highest Qualification",
        field: "highestQualification",
        type: "text",
        options: qualificationOptions,
      },
      {
        label: "Field of Study",
        field: "fieldOfStudy",
        type: "text",
        options: fieldOfStudyOptions,
      },
      { label: "Institution", field: "institution" },
      {
        label: "Grade Type",
        field: "gradeType",
        type: "select",
        options: gradeTypeOptions,
        required: false,
      },
      {
        label: "Grade Value",
        field: "gradeValue",
        type: "number",
        step: 0.01,
        required: false,
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
      formData.gradeType,
      qualificationOptions,
      fieldOfStudyOptions,
      gradeTypeOptions,
    ]
  );

  // State to track which field's dropdown is visible
  const [visibleDropdown, setVisibleDropdown] = useState(null);

  // Handler for clicking outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (visibleDropdown && !event.target.closest('.combobox-container')) {
        setVisibleDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [visibleDropdown]);

  const renderFields = useCallback(
    (fields) =>
      fields
        .filter(Boolean)
        .map(
          ({ label, field, type = "text", options = [], disabled = false, required = true, helpText, step, }) => (
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
              ) : options && options.length > 0 ? (
                <div className="relative combobox-container">
                  <input
                    type={type}
                    value={formData[field] || ""}
                    onChange={(e) => handleChange(field, e.target.value)}
                    onFocus={() => setVisibleDropdown(field)}
                    className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${errors[field] ? "border-red-500" : "border-gray-300"
                      } ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
                    placeholder={`Enter or select ${label.toLowerCase()}`}
                    disabled={disabled}
                    step={step}
                  />
                  {visibleDropdown === field && options.filter(opt => opt).length > 0 && (
                    <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 shadow-lg max-h-60 overflow-y-auto">
                      {options
                        .filter(opt => opt && (!formData[field] || opt.toLowerCase().includes(formData[field].toLowerCase())))
                        .map((opt) => (
                          <div
                            key={opt}
                            className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                            onClick={() => {
                              handleChange(field, opt);
                              setVisibleDropdown(null);
                            }}
                          >
                            {opt}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
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
    [formData, errors, handleChange, visibleDropdown]
  );

  return (
    <div className="bg-white rounded-3xl p-8 shadow-lg border-2 border-orange-100">
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