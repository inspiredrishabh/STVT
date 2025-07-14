import React, { useEffect } from "react";

const Professional = ({ formData, onChange, errors = {} }) => {
  // Validate a single field value
  const validateField = (field, value) => {
    const trimmed = value?.toString().trim() || "";

    // Required
    if (!trimmed) {
      if (field === "gradeType") return "Please select grade type";
      if (field === "gradeValue") return "Grade value is required";
      return "This field is required";
    }

    // Min length for certain text inputs
    const min2Fields = [
      "workingUnder",
      "institution",
      "fieldOfStudy",
      "customFieldOfStudy",
      "modeOfAppointmentOther"
    ];
    if (min2Fields.includes(field) && trimmed.length < 2) {
      return "Must be at least 2 characters";
    }

    // Numeric range for gradeValue
    if (field === "gradeValue") {
      const num = parseFloat(trimmed);
      switch (formData.gradeType) {
        case "CGPA (out of 10)":
          if (isNaN(num) || num < 0 || num > 10) {
            return "CGPA must be between 0 and 10";
          }
          break;
        case "CGPA (out of 4)":
          if (isNaN(num) || num < 0 || num > 4) {
            return "CGPA must be between 0 and 4";
          }
          break;
        case "Percentage":
          if (isNaN(num) || num < 0 || num > 100) {
            return "Percentage must be between 0 and 100";
          }
          break;
        default:
          break;
      }
    }

    return "";
  };

  // Validate all required fields and return an errors object
  const validateAllFields = () => {
    const required = [
      "dateOfAppointmentInRailway",
      "modeOfAppointment",
      "designation",
      "unit",
      "highestQualification",
      "fieldOfStudy",
      "institution",
      "gradeType",
      "gradeValue"
    ];
    if (formData.modeOfAppointment === "Other") {
      required.push("modeOfAppointmentOther");
    }
    if (formData.fieldOfStudy === "Other") {
      required.push("customFieldOfStudy");
    }

    const errs = {};
    required.forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) errs[field] = error;
    });

    return { isValid: Object.keys(errs).length === 0, errors: errs };
  };

  // Expose the overall validator to parent
  useEffect(() => {
    if (onChange.setValidationFunction) {
      onChange.setValidationFunction(validateAllFields);
    }
  }, [formData]);

  const handleChange = (field, value) => onChange(field, value);

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

  // Field of study options based on qualification
  const getFieldOfStudyOptions = () => {
    switch (formData.highestQualification) {
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

  return (
    <div className="bg-white rounded-3xl p-8 shadow-lg border-2 border-orange-100">
      {/* Date of Appointment */}
      <div className="mb-6">
        <RequiredLabel>Date of Appointment</RequiredLabel>
        <input
          type="date"
          value={formData.dateOfAppointmentInRailway || ""}
          onChange={(e) => handleChange("dateOfAppointmentInRailway", e.target.value)}
          className="w-full border-gray-300 rounded-lg px-4 py-2 border"
        />
        {errors.dateOfAppointmentInRailway && (
          <p className="text-sm text-red-500 mt-1">{errors.dateOfAppointmentInRailway}</p>
        )}
      </div>

      {/* Mode of Appointment */}
      <div className="mb-6">
        <RequiredLabel>Mode of Appointment</RequiredLabel>
        <select
          value={formData.modeOfAppointment || ""}
          onChange={(e) => handleChange("modeOfAppointment", e.target.value)}
          className="w-full border-gray-300 rounded-lg px-4 py-2 border"
        >
          <option value="">Select mode</option>
          <option value="RRB">RRB</option>
          <option value="CG">CG</option>
          <option value="RRC">RRC</option>
          <option value="Promotion Through LDCE">Promotion Through LDCE</option>
          <option value="Promotion Through Seniority">Promotion Through Seniority</option>
          <option value="Other">Other</option>
        </select>
        {errors.modeOfAppointment && (
          <p className="text-sm text-red-500 mt-1">{errors.modeOfAppointment}</p>
        )}
      </div>

      {/* Specify Other Mode */}
      {formData.modeOfAppointment === "Other" && (
        <div className="mb-6">
          <RequiredLabel>Specify Mode of Appointment</RequiredLabel>
          <input
            type="text"
            value={formData.modeOfAppointmentOther || ""}
            onChange={(e) => handleChange("modeOfAppointmentOther", e.target.value)}
            className="w-full border-gray-300 rounded-lg px-4 py-2 border"
            placeholder="Enter mode"
          />
          {errors.modeOfAppointmentOther && (
            <p className="text-sm text-red-500 mt-1">{errors.modeOfAppointmentOther}</p>
          )}
        </div>
      )}

      {/* Designation */}
      <div className="mb-6">
        <RequiredLabel>Designation</RequiredLabel>
        <select
          value={formData.designation || ""}
          onChange={(e) => handleChange("designation", e.target.value)}
          className="w-full border-gray-300 rounded-lg px-4 py-2 border"
        >
          <option value="">Select designation</option>
          <option value="ASE">ASE</option>
          <option value="AJE">AJE</option>
          <option value="IJE">IJE</option>
          <option value="RJE">RJE</option>
          <option value="SSE">SSE</option>
          <option value="JE">JE</option>
          <option value="Other">Other</option>
        </select>
        {errors.designation && (
          <p className="text-sm text-red-500 mt-1">{errors.designation}</p>
        )}
      </div>

      {/* Unit/Division */}
      <div className="mb-6">
        <RequiredLabel>Unit / Division</RequiredLabel>
        <select
          value={formData.unit || ""}
          onChange={(e) => handleChange("unit", e.target.value)}
          className="w-full border-gray-300 rounded-lg px-4 py-2 border"
        >
          <option value="">Select unit</option>
          <option value="ASRW">ASRW</option>
          <option value="RCNK">RCNK</option>
          <option value="KLKW">KLKW</option>
          <option value="JUDW">JUDW</option>
          <option value="CBW">CBW</option>
          <option value="AMW">AMW</option>
          <option value="JAT">JAT</option>
          <option value="FZR">FZR</option>
          <option value="DLI">DLI</option>
          <option value="UMB">UMB</option>
          <option value="MB">MB</option>
          <option value="LKO">LKO</option>
          <option value="HQ">HQ</option>
          <option value="Rly_Board">Rly. Board</option>
          <option value="Other">Other</option>
        </select>
        {errors.unit && (
          <p className="text-sm text-red-500 mt-1">{errors.unit}</p>
        )}
      </div>

      {/* Optional Text Inputs */}
      <div className="mb-6">
        <OptionalLabel>Working Under</OptionalLabel>
        <input
          type="text"
          value={formData.workingUnder || ""}
          onChange={(e) => handleChange("workingUnder", e.target.value)}
          className="w-full border-gray-300 rounded-lg px-4 py-2 border"
          placeholder="Enter working under"
        />
        {errors.workingUnder && (
          <p className="text-sm text-red-500 mt-1">{errors.workingUnder}</p>
        )}
      </div>

      <div className="mb-6">
        <OptionalLabel>HRMS ID</OptionalLabel>
        <input
          type="text"
          value={formData.hrmsId || ""}
          onChange={(e) => handleChange("hrmsId", e.target.value)}
          className="w-full border-gray-300 rounded-lg px-4 py-2 border"
          placeholder="Enter HRMS ID"
        />
        {errors.hrmsId && (
          <p className="text-sm text-red-500 mt-1">{errors.hrmsId}</p>
        )}
      </div>

      <div className="mb-6">
        <OptionalLabel>PF/NPS/UPS No.</OptionalLabel>
        <input
          type="text"
          value={formData.pfNoNpsUps || ""}
          onChange={(e) => handleChange("pfNoNpsUps", e.target.value)}
          className="w-full border-gray-300 rounded-lg px-4 py-2 border"
          placeholder="Enter PF/NPS/UPS number"
        />
        {errors.pfNoNpsUps && (
          <p className="text-sm text-red-500 mt-1">{errors.pfNoNpsUps}</p>
        )}
      </div>

      <div className="mb-6">
        <OptionalLabel>Employee Number</OptionalLabel>
        <input
          type="text"
          value={formData.employeeNumber || ""}
          onChange={(e) => handleChange("employeeNumber", e.target.value)}
          className="w-full border-gray-300 rounded-lg px-4 py-2 border"
          placeholder="Enter employee number"
        />
        {errors.employeeNumber && (
          <p className="text-sm text-red-500 mt-1">{errors.employeeNumber}</p>
        )}
      </div>

      {/* Educational Qualifications */}
      <div className="mt-10 mb-6">
        <RequiredLabel>Highest Qualification</RequiredLabel>
        <select
          value={formData.highestQualification || ""}
          onChange={(e) => handleChange("highestQualification", e.target.value)}
          className="w-full border-gray-300 rounded-lg px-4 py-2 border"
        >
          <option value="">Select qualification</option>
          <option value="Diploma">Diploma</option>
          <option value="Bachelor's Degree">Bachelor's Degree</option>
          <option value="Master's Degree">Master's Degree</option>
          <option value="Ph.D">Ph.D</option>
        </select>
        {errors.highestQualification && (
          <p className="text-sm text-red-500 mt-1">{errors.highestQualification}</p>
        )}
      </div>

      <div className="mb-6">
        <RequiredLabel>Field of Study</RequiredLabel>
        <select
          value={formData.fieldOfStudy || ""}
          onChange={(e) => handleChange("fieldOfStudy", e.target.value)}
          className="w-full border-gray-300 rounded-lg px-4 py-2 border"
        >
          <option value="">Select field of study</option>
          {getFieldOfStudyOptions().map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        {errors.fieldOfStudy && (
          <p className="text-sm text-red-500 mt-1">{errors.fieldOfStudy}</p>
        )}
      </div>

      {formData.fieldOfStudy === "Other" && (
        <div className="mb-6">
          <RequiredLabel>Custom Field of Study</RequiredLabel>
          <input
            type="text"
            value={formData.customFieldOfStudy || ""}
            onChange={(e) => handleChange("customFieldOfStudy", e.target.value)}
            className="w-full border-gray-300 rounded-lg px-4 py-2 border"
            placeholder="Enter custom field of study"
          />
          {errors.customFieldOfStudy && (
            <p className="text-sm text-red-500 mt-1">{errors.customFieldOfStudy}</p>
          )}
        </div>
      )}

      <div className="mb-6">
        <RequiredLabel>Institution</RequiredLabel>
        <input
          type="text"
          value={formData.institution || ""}
          onChange={(e) => handleChange("institution", e.target.value)}
          className="w-full border-gray-300 rounded-lg px-4 py-2 border"
          placeholder="Enter institution"
        />
        {errors.institution && (
          <p className="text-sm text-red-500 mt-1">{errors.institution}</p>
        )}
      </div>

      {/* Grade Type & Value */}
      <div className="mb-6">
        <RequiredLabel>Grade Type</RequiredLabel>
        <select
          value={formData.gradeType || ""}
          onChange={(e) => handleChange("gradeType", e.target.value)}
          className="w-full border-gray-300 rounded-lg px-4 py-2 border"
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
          value={formData.gradeValue || ""}
          onChange={(e) => handleChange("gradeValue", e.target.value)}
          className="w-full border-gray-300 rounded-lg px-4 py-2 border"
          placeholder="Enter grade value"
        />
        {errors.gradeValue && (
          <p className="text-sm text-red-500 mt-1">{errors.gradeValue}</p>
        )}
      </div>
    </div>
  );
};

export default Professional;
