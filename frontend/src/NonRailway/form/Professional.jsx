import { useEffect, useState, useCallback } from "react";

const Professional = ({ formData, onChange, errors, durationInfo }) => {
  const [localErrors, setLocalErrors] = useState({});
  const [showCourseTypeOptions, setShowCourseTypeOptions] = useState(false);
  const [showFieldOptions, setShowFieldOptions] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validateField = useCallback(
    (field, value) => {
      const trimmedValue = value?.toString().trim() || "";

      // For optional fields (gradeType, gradeValue), allow empty values
      if ((field === "gradeType" || field === "gradeValue") && !trimmedValue) {
        return "";
      }

      if (!trimmedValue) return "This field is required";

      if (
        [
          "courseType",
          "workingUnder",
          "institution",
          "fieldOfStudy",
          "designation",
          "unitCustodian",
        ].includes(field) &&
        trimmedValue.length < 2
      ) {
        return "Must be at least 2 characters";
      }

      // Date validation for joining and sparing dates
      if (
        field === "dateOfJoiningStcWtcNonRailway" ||
        field === "dateOfSparing"
      ) {
        const selectedDate = new Date(trimmedValue);
        if (isNaN(selectedDate.getTime())) {
          return "Please enter a valid date";
        }
      }

      if (field === "gradeValue" && formData.gradeType && trimmedValue) {
        const grade = parseFloat(trimmedValue);
        if (
          formData.gradeType === "CGPA (out of 10)" &&
          (isNaN(grade) || grade < 0 || grade > 10)
        ) {
          return "CGPA must be between 0-10";
        }
        if (
          formData.gradeType === "CGPA (out of 4)" &&
          (isNaN(grade) || grade < 0 || grade > 4)
        ) {
          return "CGPA must be between 0-4";
        }
        if (
          formData.gradeType === "Percentage" &&
          (isNaN(grade) || grade < 0 || grade > 100)
        ) {
          return "Percentage must be between 0-100";
        }
      }

      return "";
    },
    [formData.gradeType]
  );

  const validateAllFields = useCallback(
    (data = formData) => {
      const requiredFields = [
        "courseType",
        "designation",
        "unitCustodian",
        // "duration",
        "workingUnder",
        "highestQualification",
        "fieldOfStudy",
        "institution",
        // "gradeType",
      ];

      if (data.designation === "Summer Vacation training") {
        requiredFields.push("durationOption");
      }

      const validationErrors = {};
      requiredFields.forEach((field) => {
        const error = validateField(field, data[field]);
        if (error) validationErrors[field] = error;
      });

      setLocalErrors(validationErrors); // Set errors when validation runs

      return {
        isValid: Object.keys(validationErrors).length === 0,
        errors: validationErrors,
      };
    },
    [formData, validateField]
  );

  // Validate and update errors on every change
  const handleChange = (field, value) => {
    const newFormData = { ...formData, [field]: value };
    onChange(field, value);
    if (submitted) {
      validateAllFields(newFormData);
    }
  };

  const getFieldOfStudyOptions = () => {
    const qualification = formData.highestQualification;

    switch (qualification) {
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
        ];
      default:
        return [];
    }
  };

  const triggerValidation = () => {
    setSubmitted(true);
    return validateAllFields();
  };

  useEffect(() => {
    if (onChange.setValidationFunction) {
      onChange.setValidationFunction(triggerValidation);
    }
  }, [formData, onChange, triggerValidation]);

  // Course type and mapping data
  const courseTypeOptions = ["Non Railway"];

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

  const getAvailableUnits = () => {
    if (!formData.designation || formData.courseType === "Custom") {
      return [];
    }
    return unitMapping[formData.designation] || [];
  };

  const RequiredLabel = ({ children }) => (
    <label className="block text-gray-700 font-medium mb-1">
      {children} <span className="text-red-500">*</span>
    </label>
  );

  const OptionalLabel = ({ children }) => (
    <label className="block text-gray-700 font-medium mb-1">{children}</label>
  );

  // Helper to parse duration string like "01 Y", "03 W"
  const parseDuration = (durationStr) => {
    if (!durationStr) return { years: 0, weeks: 0 };
    const match = durationStr.match(/(\d+)\s*([YyWw])/);
    if (!match) return { years: 0, weeks: 0 };
    const value = parseInt(match[1], 10);
    const unit = match[2].toUpperCase();
    if (unit === "Y") return { years: value, weeks: 0 };
    if (unit === "W") return { years: 0, weeks: value };
    return { years: 0, weeks: 0 };
  };

  // Calculate sparing date based on joining date and duration
  useEffect(() => {
    const joiningDate = formData.dateOfJoiningStcWtcNonRailway;
    // Prefer formData.duration, fallback to durationInfo.total
    const durationStr = formData.duration || durationInfo.total;
    if (joiningDate && durationStr) {
      const { years, weeks } = parseDuration(durationStr);
      const date = new Date(joiningDate);
      if (!isNaN(date.getTime())) {
        if (years) date.setFullYear(date.getFullYear() + years);
        if (weeks) date.setDate(date.getDate() + weeks * 7);
        // Format as yyyy-mm-dd
        const pad = (n) => n.toString().padStart(2, "0");
        const sparingDate = `${date.getFullYear()}-${pad(
          date.getMonth() + 1
        )}-${pad(date.getDate())}`;
        if (formData.dateOfSparing !== sparingDate) {
          onChange("dateOfSparing", sparingDate);
        }
      }
    }
    // Only auto-update if user hasn't manually set sparing date
    // eslint-disable-next-line
  }, [
    formData.dateOfJoiningStcWtcNonRailway,
    formData.duration,
    durationInfo.total,
  ]);

  return (
    <div className="bg-white rounded-3xl p-8 shadow-lg border-2 border-orange-100">
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
          <div className="relative">
            <input
              type="text"
              value={formData.courseType || ""}
              onChange={(e) => {
                handleChange("courseType", e.target.value);
                // Reset dependent fields when course type changes
                handleChange("designation", "");
                handleChange("unitCustodian", "");
              }}
              onFocus={() => setShowCourseTypeOptions(true)}
              onBlur={() =>
                setTimeout(() => setShowCourseTypeOptions(false), 200)
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              placeholder="Select or type course type"
            />
            {showCourseTypeOptions && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                {courseTypeOptions.map((type) => (
                  <div
                    key={type}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onMouseDown={(e) => {
                      e.preventDefault(); // Prevent onBlur from firing before click
                      handleChange("courseType", type);
                      handleChange("designation", "");
                      handleChange("unitCustodian", "");
                      setShowCourseTypeOptions(false);
                    }}
                  >
                    {type}
                  </div>
                ))}
              </div>
            )}
          </div>
          {localErrors.courseType && (
            <p className="text-sm text-red-500 mt-1">
              {localErrors.courseType}
            </p>
          )}
        </div>

        <div>
          <RequiredLabel>Designation</RequiredLabel>
          {formData.courseType === "Non Railway" ? (
            <select
              value={formData.designation || ""}
              onChange={(e) => {
                handleChange("designation", e.target.value);
                handleChange("unitCustodian", ""); // Reset unit when designation changes
              }}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            >
              <option value="">Select designation</option>
              {designationOptions.map((designation) => (
                <option key={designation} value={designation}>
                  {designation}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={formData.designation || ""}
              onChange={(e) => handleChange("designation", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              placeholder="Enter designation"
              disabled={!formData.courseType}
            />
          )}
          {localErrors.designation && (
            <p className="text-sm text-red-500 mt-1">
              {localErrors.designation}
            </p>
          )}
        </div>

        <div>
          <RequiredLabel>Unit/ Custodian/ Other Details</RequiredLabel>
          {formData.courseType === "Non Railway" && formData.designation ? (
            <select
              value={formData.unitCustodian || ""}
              onChange={(e) => handleChange("unitCustodian", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            >
              <option value="">Select unit/custodian</option>
              {getAvailableUnits().map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={formData.unitCustodian || ""}
              onChange={(e) => handleChange("unitCustodian", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              placeholder="Enter unit/custodian details"
              disabled={!formData.courseType}
            />
          )}
          {localErrors.unitCustodian && (
            <p className="text-sm text-red-500 mt-1">
              {localErrors.unitCustodian}
            </p>
          )}
        </div>

        {formData.designation === "Summer Vacation training" && (
          <div>
            <RequiredLabel>Duration Option</RequiredLabel>
            <select
              value={formData.durationOption || ""}
              onChange={(e) => handleChange("durationOption", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            >
              <option value="">Select duration</option>
              <option value="4W">4 Weeks</option>
              <option value="6W">6 Weeks</option>
            </select>
            {localErrors.durationOption && (
              <p className="text-sm text-red-500 mt-1">
                {localErrors.durationOption}
              </p>
            )}
          </div>
        )}

        <div>
          <RequiredLabel>Duration</RequiredLabel>
          <input
            type="text"
            value={formData.duration || durationInfo.total}
            onChange={(e) => handleChange("duration", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            placeholder="Enter duration"
            readOnly={
              (formData.courseType === "Non Railway" &&
                formData.designation &&
                formData.designation !== "Summer Vacation training") ||
              (formData.designation === "Summer Vacation training" &&
                formData.durationOption)
            }
          />
          {localErrors.duration && (
            <p className="text-sm text-red-500 mt-1">{localErrors.duration}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Theory Period
          </label>
          <input
            type="text"
            value={formData.theoryPeriod || durationInfo.theory}
            onChange={(e) => handleChange("theoryPeriod", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50"
            placeholder="Auto-filled"
            readOnly={
              (formData.courseType === "Non Railway" &&
                formData.designation &&
                formData.designation !== "Summer Vacation training") ||
              (formData.designation === "Summer Vacation training" &&
                formData.durationOption)
            }
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Practical Period
          </label>
          <input
            type="text"
            value={formData.practicalPeriod || durationInfo.practical}
            onChange={(e) => handleChange("practicalPeriod", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50"
            placeholder="Auto-filled"
            readOnly={
              (formData.courseType === "Non Railway" &&
                formData.designation &&
                formData.designation !== "Summer Vacation training") ||
              (formData.designation === "Summer Vacation training" &&
                formData.durationOption)
            }
          />
        </div>

        <div>
          <label>Date of Joining</label>
          <input
            type="date"
            value={formData.dateOfJoiningStcWtcNonRailway || ""}
            onChange={(e) =>
              handleChange("dateOfJoiningStcWtcNonRailway", e.target.value)
            }
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          />
          {localErrors.dateOfJoiningStcWtcNonRailway && (
            <p className="text-sm text-red-500 mt-1">
              {localErrors.dateOfJoiningStcWtcNonRailway}
            </p>
          )}
        </div>

        <div>
          <label>Date of Sparing</label>
          <input
            type="date"
            value={formData.dateOfSparing || ""}
            onChange={(e) => handleChange("dateOfSparing", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            // --- Start of changed code ---
            // Make sparing date read-only if auto-calculated
            readOnly={Boolean(
              formData.dateOfJoiningStcWtcNonRailway &&
                (formData.duration || durationInfo.total)
            )}
            // --- End of changed code ---
          />
          {localErrors.dateOfSparing && (
            <p className="text-sm text-red-500 mt-1">
              {localErrors.dateOfSparing}
            </p>
          )}
        </div>

        <div>
          <RequiredLabel>Working Under</RequiredLabel>
          <input
            type="text"
            value={formData.workingUnder || ""}
            onChange={(e) => handleChange("workingUnder", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            placeholder="Enter working under"
          />
          {localErrors.workingUnder && (
            <p className="text-sm text-red-500 mt-1">
              {localErrors.workingUnder}
            </p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label className="block text-gray-700 font-medium mb-1">Remark</label>
          <textarea
            value={formData.remark || ""}
            onChange={(e) => handleChange("remark", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            placeholder="Enter remark"
            rows="3"
          />
          {localErrors.remark && (
            <p className="text-sm text-red-500 mt-1">{localErrors.remark}</p>
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
            onChange={(e) => {
              handleChange("highestQualification", e.target.value);
              // Reset field of study when qualification changes
              handleChange("fieldOfStudy", "");
            }}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          >
            <option value="">Select qualification</option>
            <option value="Diploma">Diploma</option>
            <option value="Bachelor's Degree">Bachelor's Degree</option>
            <option value="Master's Degree">Master's Degree</option>
            <option value="Ph.D">Ph.D</option>
          </select>
          {localErrors.highestQualification && (
            <p className="text-sm text-red-500 mt-1">
              {localErrors.highestQualification}
            </p>
          )}
        </div>

        <div>
          <RequiredLabel>Field of Study</RequiredLabel>
          <div className="relative">
            <input
              type="text"
              value={formData.fieldOfStudy || ""}
              onChange={(e) => handleChange("fieldOfStudy", e.target.value)}
              onFocus={() => setShowFieldOptions(true)}
              onBlur={() => setTimeout(() => setShowFieldOptions(false), 200)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              placeholder="Select or type field of study"
              disabled={!formData.highestQualification}
            />
            {showFieldOptions && formData.highestQualification && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {getFieldOfStudyOptions().map((option) => (
                  <div
                    key={option}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleChange("fieldOfStudy", option);
                      setShowFieldOptions(false);
                    }}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
          {localErrors.fieldOfStudy && (
            <p className="text-sm text-red-500 mt-1">
              {localErrors.fieldOfStudy}
            </p>
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
          {localErrors.institution && (
            <p className="text-sm text-red-500 mt-1">
              {localErrors.institution}
            </p>
          )}
        </div>

        <div>
          <OptionalLabel>Grade Type</OptionalLabel>
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
          {localErrors.gradeType && (
            <p className="text-sm text-red-500 mt-1">{localErrors.gradeType}</p>
          )}
        </div>

        <div>
          <OptionalLabel>Grade Value</OptionalLabel>
          <input
            type="number"
            // step="0.01"
            value={formData.gradeValue || ""}
            onChange={(e) => handleChange("gradeValue", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            placeholder="Enter grade value"
          />
          {localErrors.gradeValue && (
            <p className="text-sm text-red-500 mt-1">
              {localErrors.gradeValue}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Professional;
