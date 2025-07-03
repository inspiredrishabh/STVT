import React, { useEffect } from "react";

const Professional = ({ formData, onChange, errors = {} }) => {
  const validateField = (field, value) => {
    const trimmedValue = value?.toString().trim() || "";

    if (!trimmedValue) return "This field is required";

    if (
      ["workingUnder", "institution", "fieldOfStudy", "customFieldOfStudy", "modeOfAppointmentOther"].includes(field) &&
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
    ];

    // Add customFieldOfStudy to required fields if "Other" is selected
    if (formData.fieldOfStudy === "Other") {
      requiredFields.push("customFieldOfStudy");
    }

    // Add modeOfAppointmentOther to required fields if "Other" is selected
    if (formData.modeOfAppointment === "Other") {
      requiredFields.push("modeOfAppointmentOther");
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
          <RequiredLabel>Date of Appointment</RequiredLabel>
          <input
            type="date"
            value={formData.dateOfAppointmentInRailway || ""}
            onChange={(e) =>
              handleChange("dateOfAppointmentInRailway", e.target.value)
            }
            className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 bg-white shadow-sm hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
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
            className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 bg-white shadow-sm hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 appearance-none cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: 'right 0.75rem center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '1.5em 1.5em'
            }}
          >
            <option value="" style={{ padding: '8px 12px', backgroundColor: '#f8f9fa', color: '#6c757d' }}>Select mode</option>
            <option value="RRB" style={{ padding: '8px 12px', backgroundColor: 'white', color: '#374151' }}>RRB</option>
            <option value="CG" style={{ padding: '8px 12px', backgroundColor: 'white', color: '#374151' }}>CG</option>
            <option value="Promotion Through LDCE" style={{ padding: '8px 12px', backgroundColor: 'white', color: '#374151' }}>
              Promotion Through LDCE
            </option>
            <option value="Promotion Through Seniority" style={{ padding: '8px 12px', backgroundColor: 'white', color: '#374151' }}>
              Promotion Through Seniority
            </option>
            <option value="Other" style={{ padding: '8px 12px', backgroundColor: 'white', color: '#374151' }}>Other</option>
          </select>
          {errors.modeOfAppointment && (
            <p className="text-sm text-red-500 mt-1">
              {errors.modeOfAppointment}
            </p>
          )}
        </div>

        {formData.modeOfAppointment === "Other" && (
          <div>
            <RequiredLabel>Specify Mode of Appointment</RequiredLabel>
            <input
              type="text"
              value={formData.modeOfAppointmentOther || ""}
              onChange={(e) => handleChange("modeOfAppointmentOther", e.target.value)}
              className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 bg-white shadow-sm hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              placeholder="Enter mode of appointment"
            />
            {errors.modeOfAppointmentOther && (
              <p className="text-sm text-red-500 mt-1">{errors.modeOfAppointmentOther}</p>
            )}
          </div>
        )}

        <div>
          <RequiredLabel>Designation</RequiredLabel>
          <select
            value={formData.designation || ""}
            onChange={(e) => handleChange("designation", e.target.value)}
            className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 bg-white shadow-sm hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 appearance-none cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: 'right 0.75rem center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '1.5em 1.5em'
            }}
          >
            <option value="" style={{ padding: '8px 12px', backgroundColor: '#f8f9fa', color: '#6c757d' }}>Select designation</option>
            <option value="ASE" style={{ padding: '8px 12px', backgroundColor: 'white', color: '#374151' }}>ASE</option>
            <option value="AJE" style={{ padding: '8px 12px', backgroundColor: 'white', color: '#374151' }}>AJE</option>
            <option value="IJE" style={{ padding: '8px 12px', backgroundColor: 'white', color: '#374151' }}>IJE</option>
            <option value="RJE" style={{ padding: '8px 12px', backgroundColor: 'white', color: '#374151' }}>RJE</option>
            <option value="SSC" style={{ padding: '8px 12px', backgroundColor: 'white', color: '#374151' }}>SSC</option>
            <option value="JE" style={{ padding: '8px 12px', backgroundColor: 'white', color: '#374151' }}>JE</option>
            <option value="Other" style={{ padding: '8px 12px', backgroundColor: 'white', color: '#374151' }}>Other</option>
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
            className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 bg-white shadow-sm hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 appearance-none cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: 'right 0.75rem center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '1.5em 1.5em'
            }}
          >
            <option value="" style={{ padding: '8px 12px', backgroundColor: '#f8f9fa', color: '#6c757d' }}>Select unit</option>
            <option value="AMVW" style={{ padding: '8px 12px', backgroundColor: 'white', color: '#374151' }}>AMVW</option>
            <option value="ASRW" style={{ padding: '8px 12px', backgroundColor: 'white', color: '#374151' }}>ASRW</option>
            <option value="CVW" style={{ padding: '8px 12px', backgroundColor: 'white', color: '#374151' }}>CVW</option>
            <option value="DLI" style={{ padding: '8px 12px', backgroundColor: 'white', color: '#374151' }}>DLI</option>
            <option value="DLIW" style={{ padding: '8px 12px', backgroundColor: 'white', color: '#374151' }}>DLIW</option>
            <option value="FZR" style={{ padding: '8px 12px', backgroundColor: 'white', color: '#374151' }}>FZR</option>
            <option value="FZRW" style={{ padding: '8px 12px', backgroundColor: 'white', color: '#374151' }}>FZRW</option>
            <option value="JAT" style={{ padding: '8px 12px', backgroundColor: 'white', color: '#374151' }}>JAT</option>
            <option value="JATW" style={{ padding: '8px 12px', backgroundColor: 'white', color: '#374151' }}>JATW</option>
            <option value="JUDW" style={{ padding: '8px 12px', backgroundColor: 'white', color: '#374151' }}>JUDW</option>
            <option value="KLKW" style={{ padding: '8px 12px', backgroundColor: 'white', color: '#374151' }}>KLKW</option>
            <option value="LKO" style={{ padding: '8px 12px', backgroundColor: 'white', color: '#374151' }}>LKO</option>
            <option value="LKOW" style={{ padding: '8px 12px', backgroundColor: 'white', color: '#374151' }}>LKOW</option>
            <option value="MB" style={{ padding: '8px 12px', backgroundColor: 'white', color: '#374151' }}>MB</option>
            <option value="MBW" style={{ padding: '8px 12px', backgroundColor: 'white', color: '#374151' }}>MBW</option>
            <option value="RCNKW" style={{ padding: '8px 12px', backgroundColor: 'white', color: '#374151' }}>RCNKW</option>
            <option value="UMBW" style={{ padding: '8px 12px', backgroundColor: 'white', color: '#374151' }}>UMBW</option>
            <option value="Other" style={{ padding: '8px 12px', backgroundColor: 'white', color: '#374151' }}>Other</option>
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
            className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 bg-white shadow-sm hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
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
            className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 bg-white shadow-sm hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
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
            className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 bg-white shadow-sm hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
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
            className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 bg-white shadow-sm hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
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
