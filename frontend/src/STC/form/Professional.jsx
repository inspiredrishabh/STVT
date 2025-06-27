import React, { useEffect, useState } from "react";

const Professional = ({ formData, onChange }) => {
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    onChange(field, value);
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateField = (field, value) => {
    if (!value || value.trim() === "") {
      return "This field is required";
    }
    return "";
  };

  useEffect(() => {
    if (formData.educationStartYear && formData.eduCourseDuration) {
      const startYear = parseInt(formData.educationStartYear, 10);
      const duration = parseInt(formData.eduCourseDuration, 10);
      if (!isNaN(startYear) && !isNaN(duration)) {
        handleChange("yearOfGraduation", (startYear + duration).toString());
      }
    }
  }, [formData.educationStartYear, formData.eduCourseDuration]);

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
  ];

  const validateAll = () => {
    const newErrors = {};
    requiredFields.forEach((field) => {
      const value = formData[field];
      const error = validateField(field, value);
      if (error) newErrors[field] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const professionalFields = [
    { label: "Date of Appointment", field: "dateOfAppointmentInRailway", type: "date" },
    {
      label: "Mode of Appointment",
      field: "modeOfAppointment",
      type: "select",
      options: [
        "",
        "RRB",
        "Promotion Through LDCE",
        "Promotion Through Seniority",
        "Other",
      ],
    },
    formData.modeOfAppointment === "Other" && {
      label: "Specify Mode",
      field: "modeOfAppointmentOther",
    },
    { label: "Designation", field: "designation" },
    { label: "Unit / Division", field: "unit" },
    { label: "Working Under", field: "workingUnder" },
    { label: "HRMS ID", field: "hrmsId" },
    { label: "PF/NPS/UPS No.", field: "pfNoNpsUps" },
    { label: "Employee Number", field: "employeeNumber" },
  ];

  const educationFields = [
    { label: "Highest Qualification", field: "highestQualification" },
    formData.highestQualification === "Other" && {
      label: "Specify Qualification",
      field: "otherQualification",
    },
    { label: "Field of Study", field: "fieldOfStudy" },
    { label: "Institution", field: "institution" },
    { label: "Board/University Type", field: "boardType" },
    { label: "Start Year", field: "educationStartYear" },
    { label: "Course Duration (years)", field: "eduCourseDuration" },
    {
      label: "Year of Graduation",
      field: "yearOfGraduation",
      disabled: true,
    },
    { label: "Mode of Study", field: "modeOfStudy" },
    { label: "Grade Type", field: "gradeType" },
    { label: "Grade/Percentage/CGPA", field: "gradeValue" },
    { label: "Division", field: "division" },
  ];

  const renderFields = (fields) =>
    fields
      .filter(Boolean)
      .map(({ label, field, type = "text", options = [], disabled = false }) => (
        <div key={field}>
          <label className="block text-gray-700 font-medium mb-1">
            {label} <span className="text-red-500">*</span>
          </label>
          {type === "select" ? (
            <select
              value={formData[field] || ""}
              onChange={(e) => handleChange(field, e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
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
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              placeholder={`Enter ${label.toLowerCase()}`}
              disabled={disabled}
            />
          )}
          {errors[field] && (
            <p className="text-sm text-red-500 mt-1">{errors[field]}</p>
          )}
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

      {/* Professional Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6 mb-10">
        {renderFields(professionalFields)}
      </div>

      <h4 className="text-lg font-semibold text-gray-800 mb-4">Educational Qualifications</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
        {renderFields(educationFields)}
      </div>
    </div>
  );
};

export default Professional;
