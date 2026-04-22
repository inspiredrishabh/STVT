import { useEffect, useState, useRef, useCallback } from "react";

const Professional = ({ formData, onChange, errors = {} }) => {
  const validateField = useCallback(
    (field, value) => {
      const trimmed = value?.toString().trim() || "";

      if (!trimmed) {
        if (field === "gradeType") return "Please select grade type";
        if (field === "gradeValue") return "Grade value is required";
        if (field === "highestDegree") return "Highest degree is required";
        if (field === "college") return "College name is required";
        return "This field is required";
      }

      const min2Fields = [
        "workingUnder",
        "institution",
        "fieldOfStudy",
        "customFieldOfStudy",
        "modeOfAppointmentOther",
      ];
      if (min2Fields.includes(field) && trimmed.length < 2) {
        return "Must be at least 2 characters";
      }

      if (field === "gradeValue") {
        const num = parseFloat(trimmed);
        switch (formData.gradeType) {
          case "CGPA (out of 10)":
            if (isNaN(num) || num < 0 || num > 10)
              return "CGPA must be between 0 and 10";
            break;
          case "CGPA (out of 4)":
            if (isNaN(num) || num < 0 || num > 4)
              return "CGPA must be between 0 and 4";
            break;
          case "Percentage":
            if (isNaN(num) || num < 0 || num > 100)
              return "Percentage must be between 0 and 100";
            break;
        }
      }

      return "";
    },
    [formData]
  );

  const validateAllFields = useCallback(() => {
    const required = [
      "dateOfAppointmentInRailway",
      "modeOfAppointment",
      "designation",
      "unit",
      "highestQualification",
      "highestDegree",
      "fieldOfStudy",
      "institution",
      "college",
      "gradeType",
      "gradeValue",
    ];

    const errs = {};
    required.forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) errs[field] = error;
    });

    return { isValid: Object.keys(errs).length === 0, errors: errs };
  }, [formData, validateField]);

  useEffect(() => {
    if (onChange.setValidationFunction) {
      onChange.setValidationFunction(validateAllFields);
    }
  }, [formData, onChange, validateAllFields]);

  const handleChange = (field, value) => onChange(field, value);

  const RequiredLabel = ({ children }) => (
    <label className="block text-gray-700 font-medium mb-1">
      {children} <span className="text-red-500">*</span>
    </label>
  );

  const OptionalLabel = ({ children }) => (
    <label className="block text-gray-700 font-medium mb-1">{children}</label>
  );

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
          "Information Technology",
        ];
      case "Bachelor's Degree":
        return [
          "B.Tech - Mechanical Engineering",
          "B.Tech - Electrical Engineering",
          "B.Tech - Civil Engineering",
          "B.Tech - Electronics & Communication",
          "B.Tech - Computer Science",
          "B.Tech - Information Technology",
          "B.Tech - Railway Engineering",
          "B.E - Mechanical Engineering",
          "B.E - Electrical Engineering",
          "B.E - Civil Engineering",
          "B.Sc - Physics",
          "B.Sc - Mathematics",
          "B.Sc - Chemistry",
          "B.Sc - Computer Science",
          "B.Sc - Information Technology",
          "BCA - Computer Applications",
          "BA - Arts",
          "BA - Economics",
          "BA - English",
          "BA - History",
          "BBA - Business Administration",
          "B.Com - Commerce",
          "B.Com - Accounting",
        ];
      case "Master's Degree":
        return [
          "M.Tech - Mechanical Engineering",
          "M.Tech - Electrical Engineering",
          "M.Tech - Civil Engineering",
          "M.Tech - Electronics & Communication",
          "M.Tech - Computer Science",
          "M.Tech - Information Technology",
          "M.Tech - Railway Engineering",
          "M.E - Mechanical Engineering",
          "M.E - Electrical Engineering",
          "M.E - Civil Engineering",
          "M.Sc - Physics",
          "M.Sc - Mathematics",
          "M.Sc - Chemistry",
          "M.Sc - Computer Science",
          "M.Sc - Information Technology",
          "MCA - Computer Applications",
          "MBA - Business Administration",
          "MBA - Finance",
          "MBA - Marketing",
          "MBA - Human Resources",
          "M.Com - Commerce",
          "M.Com - Accounting",
          "MA - Arts",
          "MA - Economics",
          "MA - English",
          "MA - History",
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
          "Ph.D - Economics",
          "Ph.D - Commerce",
        ];
      default:
        return [];
    }
  };

  const getHighestDegreeOptions = () => {
    switch (formData.highestQualification) {
      case "Diploma":
        return ["Diploma", "Diploma (Honors)", "Advanced Diploma"];
      case "Bachelor's Degree":
        return [
          "B.Tech",
          "B.E",
          "B.Sc",
          "BCA",
          "BA",
          "BBA",
          "B.Com",
          "B.Arch",
          "BDS",
          "MBBS",
        ];
      case "Master's Degree":
        return [
          "M.Tech",
          "M.E",
          "M.Sc",
          "MCA",
          "MA",
          "MBA",
          "M.Com",
          "M.Arch",
          "MDS",
          "MD",
        ];
      case "Ph.D":
        return ["Ph.D", "D.Sc", "D.Litt"];
      default:
        return [];
    }
  };

  const ComboBox = ({ value, onChange, options, placeholder, className }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState(value || "");
    const dropdownRef = useRef(null);

    useEffect(() => {
      setInputValue(value || "");
    }, [value]);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target)
        ) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleInputChange = (e) => {
      setInputValue(e.target.value);
    };

    const handleOptionClick = (option) => {
      setInputValue(option);
      onChange(option);
      setIsOpen(false);
    };

    const handleBlur = () => {
      onChange(inputValue);
    };

    const filteredOptions = options.filter((option) =>
      option.toLowerCase().includes(inputValue.toLowerCase())
    );

    return (
      <div className="relative" ref={dropdownRef}>
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(true)}
            onBlur={handleBlur}
            className={className}
            placeholder={placeholder}
          />
          <div
            className="absolute inset-y-0 right-0 flex items-center px-2 cursor-pointer"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg
              className="w-4 h-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
              />
            </svg>
          </div>
        </div>

        {isOpen && filteredOptions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            {filteredOptions.map((option, index) => (
              <div
                key={index}
                className="px-4 py-2 cursor-pointer hover:bg-orange-50"
                onMouseDown={() => handleOptionClick(option)}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-orange-100">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
        <div>
          <RequiredLabel>Date of Appointment</RequiredLabel>
          <input
            type="date"
            value={formData.dateOfAppointmentInRailway || ""}
            onChange={(e) =>
              handleChange("dateOfAppointmentInRailway", e.target.value)
            }
            className="w-full border-gray-300 rounded-lg px-4 py-2 border"
          />
          {errors.dateOfAppointmentInRailway && (
            <p className="text-sm text-red-500 mt-1">
              {errors.dateOfAppointmentInRailway}
            </p>
          )}
        </div>

        <div>
          <RequiredLabel>Mode of Appointment</RequiredLabel>
          <ComboBox
            value={formData.modeOfAppointment || ""}
            onChange={(value) => handleChange("modeOfAppointment", value)}
            options={[
              "RRB",
              "CG",
              "RRC",
              "Promotion Through LDCE",
              "Promotion Through Seniority",
            ]}
            placeholder="Select or type mode"
            className="w-full border-gray-300 rounded-lg px-4 py-2 border"
          />
          {errors.modeOfAppointment && (
            <p className="text-sm text-red-500 mt-1">
              {errors.modeOfAppointment}
            </p>
          )}
        </div>

        <div>
          <RequiredLabel>Designation</RequiredLabel>
          <ComboBox
            value={formData.designation || ""}
            onChange={(value) => handleChange("designation", value)}
            options={["ASE", "AJE", "IJE", "RJE", "SSE", "JE"]}
            placeholder="Select or type designation"
            className="w-full border-gray-300 rounded-lg px-4 py-2 border"
          />
          {errors.designation && (
            <p className="text-sm text-red-500 mt-1">{errors.designation}</p>
          )}
        </div>

        <div>
          <RequiredLabel>Unit / Division</RequiredLabel>
          <ComboBox
            value={formData.unit || ""}
            onChange={(value) => handleChange("unit", value)}
            options={[
              "ASRW",
              "RCNK",
              "KLKW",
              "JUDW",
              "CBW",
              "AMW",
              "JAT",
              "FZR",
              "DLI",
              "UMB",
              "MB",
              "LKO",
              "HQ",
              "Rly. Board",
            ]}
            placeholder="Select or type unit"
            className="w-full border-gray-300 rounded-lg px-4 py-2 border"
          />
          {errors.unit && (
            <p className="text-sm text-red-500 mt-1">{errors.unit}</p>
          )}
        </div>

        <div>
          <OptionalLabel>Working Under</OptionalLabel>
          <input
            type="text"
            value={formData.workingUnder || ""}
            onChange={(e) => handleChange("workingUnder", e.target.value)}
            className="w-full border-gray-300 rounded-lg px-4 py-2 border"
            placeholder="Enter working under"
          />
        </div>

        <div>
          <OptionalLabel>HRMS ID</OptionalLabel>
          <input
            type="text"
            value={formData.hrmsId || ""}
            onChange={(e) => handleChange("hrmsId", e.target.value)}
            className="w-full border-gray-300 rounded-lg px-4 py-2 border"
            placeholder="Enter HRMS ID"
          />
        </div>

        <div>
          <OptionalLabel>PF/NPS/UPS No.</OptionalLabel>
          <input
            type="text"
            value={formData.pfNoNpsUps || ""}
            onChange={(e) => handleChange("pfNoNpsUps", e.target.value)}
            className="w-full border-gray-300 rounded-lg px-4 py-2 border"
            placeholder="Enter PF/NPS/UPS number"
          />
        </div>

        <div>
          <OptionalLabel>Employee Number</OptionalLabel>
          <input
            type="text"
            value={formData.employeeNumber || ""}
            onChange={(e) => handleChange("employeeNumber", e.target.value)}
            className="w-full border-gray-300 rounded-lg px-4 py-2 border"
            placeholder="Enter employee number"
          />
        </div>
      </div>

      <div className="mt-6">
        <OptionalLabel>Previous Work Experience</OptionalLabel>
        <textarea
          rows="3"
          value={formData.previousWorkExperience || ""}
          onChange={(e) =>
            handleChange("previousWorkExperience", e.target.value)
          }
          className="w-full border-gray-300 rounded-lg px-4 py-2 border"
          placeholder="Enter previous work experience (if any)"
        />
      </div>

      <div className="mt-10">
        <div className="flex items-center space-x-3 mb-6">
          <div className="h-12 w-12 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full shadow text-lg">
            🎓
          </div>
          <h3 className="text-xl font-semibold text-black">
            Educational Qualifications
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
          <div>
            <RequiredLabel>Highest Qualification</RequiredLabel>
            <ComboBox
              value={formData.highestQualification || ""}
              onChange={(value) => {
                handleChange("highestQualification", value);
                handleChange("highestDegree", "");
                handleChange("fieldOfStudy", "");
              }}
              options={[
                "Diploma",
                "Bachelor's Degree",
                "Master's Degree",
                "Ph.D",
              ]}
              placeholder="Select or type qualification"
              className="w-full border-gray-300 rounded-lg px-4 py-2 border"
            />
            {errors.highestQualification && (
              <p className="text-sm text-red-500 mt-1">
                {errors.highestQualification}
              </p>
            )}
          </div>

          <div>
            <RequiredLabel>Highest Degree</RequiredLabel>
            <ComboBox
              value={formData.highestDegree || ""}
              onChange={(value) => handleChange("highestDegree", value)}
              options={getHighestDegreeOptions()}
              placeholder="Select or type degree (e.g., B.Tech, MBA)"
              className="w-full border-gray-300 rounded-lg px-4 py-2 border"
            />
            {errors.highestDegree && (
              <p className="text-sm text-red-500 mt-1">
                {errors.highestDegree}
              </p>
            )}
          </div>

          <div>
            <RequiredLabel>Field of Study</RequiredLabel>
            <ComboBox
              value={formData.fieldOfStudy || ""}
              onChange={(value) => handleChange("fieldOfStudy", value)}
              options={getFieldOfStudyOptions()}
              placeholder="Select or type field of study"
              className="w-full border-gray-300 rounded-lg px-4 py-2 border"
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
              className="w-full border-gray-300 rounded-lg px-4 py-2 border"
              placeholder="Enter institution"
            />
            {errors.institution && (
              <p className="text-sm text-red-500 mt-1">{errors.institution}</p>
            )}
          </div>

          <div>
            <RequiredLabel>College</RequiredLabel>
            <input
              type="text"
              value={formData.college || ""}
              onChange={(e) => handleChange("college", e.target.value)}
              className="w-full border-gray-300 rounded-lg px-4 py-2 border"
              placeholder="Enter college name"
            />
            {errors.college && (
              <p className="text-sm text-red-500 mt-1">{errors.college}</p>
            )}
          </div>

          <div>
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
      </div>
    </div>
  );
};

export default Professional;
