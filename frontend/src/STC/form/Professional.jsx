import React, { useEffect } from "react";

const Professional = ({ formData, onChange, errors = {} }) => {
  const validateField = (field, value) => {
    const trimmedValue = value?.toString().trim() || "";

    if (!trimmedValue) return "This field is required";

    if (
      ["workingUnder", "institution", "fieldOfStudy"].includes(field) &&
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
      "dateOfAppointmentInRailway",
      "modeOfAppointment",
      "designation",
      "unit",
      "highestQualification",
      "fieldOfStudy",
      "institution",
      "gradeType",
      "gradeValue",
    ];

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
          <RequiredLabel>Date of Appointment</RequiredLabel>
          <input
            type="date"
            value={formData.dateOfAppointmentInRailway || ""}
            onChange={(e) =>
              handleChange("dateOfAppointmentInRailway", e.target.value)
            }
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          />
          {errors.dateOfAppointmentInRailway && (
            <p className="text-sm text-red-500 mt-1">
              {errors.dateOfAppointmentInRailway}
            </p>
          )}
        </div>

        <div>
          <RequiredLabel>Mode of Appointment</RequiredLabel>
          <select
            value={formData.modeOfAppointment || ""}
            onChange={(e) => handleChange("modeOfAppointment", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          >
            <option value="">Select mode</option>
            <option value="RRB">RRB</option>
            <option value="Promotion Through LDCE">
              Promotion Through LDCE
            </option>
            <option value="Promotion Through Seniority">
              Promotion Through Seniority
            </option>
            <option value="Other">Other</option>
          </select>
          {errors.modeOfAppointment && (
            <p className="text-sm text-red-500 mt-1">
              {errors.modeOfAppointment}
            </p>
          )}
        </div>

        <div>
          <RequiredLabel>Designation</RequiredLabel>
          <select
            value={formData.designation || ""}
            onChange={(e) => handleChange("designation", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          >
            <option value="">Select designation</option>
            <option value="ASE">ASE</option>
            <option value="AJE">AJE</option>
            <option value="IJE">IJE</option>
            <option value="RJE">RJE</option>
            <option value="Other">Other</option>
          </select>
          {errors.designation && (
            <p className="text-sm text-red-500 mt-1">{errors.designation}</p>
          )}
        </div>

        <div>
          <RequiredLabel>Unit / Division</RequiredLabel>
          <select
            value={formData.unit || ""}
            onChange={(e) => handleChange("unit", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          >
            <option value="">Select unit</option>
            <option value="JAT">JAT</option>
            <option value="FZD">FZD</option>
            <option value="MB">MB</option>
            <option value="LKO">LKO</option>
            <option value="DLI">DLI</option>
            <option value="Other">Other</option>
          </select>
          {errors.unit && (
            <p className="text-sm text-red-500 mt-1">{errors.unit}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Working Under
          </label>
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

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            HRMS ID
          </label>
          <input
            type="text"
            value={formData.hrmsId || ""}
            onChange={(e) => handleChange("hrmsId", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            placeholder="Enter HRMS ID"
          />
          {errors.hrmsId && (
            <p className="text-sm text-red-500 mt-1">{errors.hrmsId}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            PF/NPS/UPS No.
          </label>
          <input
            type="text"
            value={formData.pfNoNpsUps || ""}
            onChange={(e) => handleChange("pfNoNpsUps", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            placeholder="Enter PF/NPS/UPS number"
          />
          {errors.pfNoNpsUps && (
            <p className="text-sm text-red-500 mt-1">{errors.pfNoNpsUps}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Employee Number
          </label>
          <input
            type="text"
            value={formData.employeeNumber || ""}
            onChange={(e) => handleChange("employeeNumber", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            placeholder="Enter employee number"
          />
          {errors.employeeNumber && (
            <p className="text-sm text-red-500 mt-1">{errors.employeeNumber}</p>
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
