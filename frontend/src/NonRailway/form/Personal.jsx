import React from "react";

const Personal = ({ formData, onChange, errors = {}, onSubmit }) => {
  // Validation function for all fields
  const validateField = (fieldName, value) => {
    let error = "";

    switch (fieldName) {
      case "picture":
        if (!value) {
          error = "Picture is required";
        } else if (value && !value.type?.startsWith("image/")) {
          error = "Please select a valid image file";
        } else if (value && value.size > 5 * 1024 * 1024) { // 5MB limit
          error = "Image size should be less than 5MB";
        }
        break;

      case "name":
        if (!value || value.trim() === "") {
          error = "Name is required";
        } else if (value.trim().length < 2) {
          error = "Name must be at least 2 characters long";
        } else if (!/^[a-zA-Z\s]+$/.test(value.trim())) {
          error = "Name should only contain letters and spaces";
        }
        break;

      case "sex":
        if (!value) {
          error = "Gender is required";
        } else if (!["Male", "Female", "Other"].includes(value)) {
          error = "Please select a valid gender";
        }
        break;

      case "fatherName":
        if (!value || value.trim() === "") {
          error = "Father's name is required";
        } else if (value.trim().length < 2) {
          error = "Father's name must be at least 2 characters long";
        } else if (!/^[a-zA-Z\s]+$/.test(value.trim())) {
          error = "Father's name should only contain letters and spaces";
        }
        break;

      case "motherName":
        if (value && value.trim() !== "") {
          if (value.trim().length < 2) {
            error = "Mother's name must be at least 2 characters long";
          } else if (!/^[a-zA-Z\s]+$/.test(value.trim())) {
            error = "Mother's name should only contain letters and spaces";
          }
        }
        break;

      case "dob":
        if (!value) {
          error = "Date of birth is required";
        } else {
          const dobDate = new Date(value);
          const today = new Date();
          const age = today.getFullYear() - dobDate.getFullYear();
          const monthDiff = today.getMonth() - dobDate.getMonth();

          if (dobDate > today) {
            error = "Date of birth cannot be in the future";
          } else if (age < 16 || (age === 16 && monthDiff < 0)) {
            error = "Age must be at least 16 years";
          } else if (age > 100) {
            error = "Please enter a valid date of birth";
          }
        }
        break;

      case "category":
        if (!value) {
          error = "Category is required";
        } else if (!["General", "OBC", "SC", "ST", "EWS"].includes(value)) {
          error = "Please select a valid category";
        }
        break;

      case "pwd":
        if (!value) {
          error = "PWD selection is required";
        } else if (!["Yes", "No"].includes(value)) {
          error = "Please select Yes or No for PWD";
        }
        break;

      case "typeOfDisability":
        if (formData.pwd === "Yes" && (!value || value.trim() === "")) {
          error = "Type of disability is required when PWD is Yes";
        } else if (value && value.trim() !== "" && value.trim().length < 3) {
          error = "Type of disability must be at least 3 characters long";
        }
        break;

      case "nationality":
        if (!value || value.trim() === "") {
          error = "Nationality is required";
        } else if (value.trim().length < 2) {
          error = "Nationality must be at least 2 characters long";
        } else if (!/^[a-zA-Z\s]+$/.test(value.trim())) {
          error = "Nationality should only contain letters and spaces";
        }
        break;

      case "maritalStatus":
        if (value && !["Single", "Married", "Divorced", "Widowed"].includes(value)) {
          error = "Please select a valid marital status";
        }
        break;

      default:
        break;
    }

    return error;
  };

  // Enhanced onChange handler with validation
  const handleFieldChange = (fieldName, value) => {
    // Call the original onChange
    onChange(fieldName, value);
  };

  // Add a function to validate all fields and return validation status
  const validateAllFields = () => {
    const validationErrors = {};
    const requiredFields = ["picture", "name", "sex", "fatherName", "dob", "category", "pwd", "nationality"];

    requiredFields.forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        validationErrors[field] = error;
      }
    });

    // Validate optional fields if they have values
    ["motherName", "typeOfDisability", "maritalStatus"].forEach(field => {
      if (formData[field]) {
        const error = validateField(field, formData[field]);
        if (error) {
          validationErrors[field] = error;
        }
      }
    });

    return {
      isValid: Object.keys(validationErrors).length === 0,
      errors: validationErrors
    };
  };

  // Export validation function for parent component
  React.useEffect(() => {
    if (onChange.setValidationFunction) {
      onChange.setValidationFunction(validateAllFields);
    }
  }, [formData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const validation = validateAllFields();

    // If there are validation errors, don't submit
    if (!validation.isValid) {
      console.log("Validation errors:", validation.errors);
      // Update errors in parent component
      if (onChange.updateErrors) {
        onChange.updateErrors(validation.errors);
      }
      return false; // Prevent form submission
    }

    if (onSubmit) {
      const isValid = onSubmit(formData);
      return isValid !== false; // Allow submission unless explicitly returned false
    }
    return true;
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200">
        <div className="flex items-center space-x-3 mb-6">
          <div className="h-12 w-12 flex items-center justify-center bg-pink-100 text-pink-600 rounded-full shadow text-lg">
            👤
          </div>
          <h3 className="text-xl font-semibold text-gray-800">Personal Detail</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
          {/* Picture Upload */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Picture<span className="text-red-500">*</span></label>
            <div className="flex items-center w-full border border-gray-300 rounded-lg px-4 py-2 bg-white">
              <label
                htmlFor="pictureUpload"
                className="bg-gray-200 text-gray-700 px-4 py-1 rounded cursor-pointer text-sm mr-4"
              >
                Choose File
              </label>
              <input
                id="pictureUpload"
                type="file"
                accept="image/*"
                onChange={(e) => handleFieldChange("picture", e.target.files[0])}
                className="hidden"
              />
              <span className="text-gray-500 text-sm truncate">
                {formData.picture ? formData.picture.name : "No file chosen"}
              </span>
            </div>
            {errors.picture && <span className="text-red-500 text-sm mt-1">{errors.picture}</span>}
          </div>

          {/* Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name || ""}
              onChange={(e) => handleFieldChange("name", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              placeholder="Enter full name"
            />
            {errors.name && <span className="text-red-500 text-sm mt-1">{errors.name}</span>}
          </div>

          {/* Gender */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Gender <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.sex || ""}
              onChange={(e) => handleFieldChange("sex", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.sex && <span className="text-red-500 text-sm mt-1">{errors.sex}</span>}
          </div>

          {/* Father's Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Father's Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.fatherName || ""}
              onChange={(e) => handleFieldChange("fatherName", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              placeholder="Enter father's name"
            />
            {errors.fatherName && <span className="text-red-500 text-sm mt-1">{errors.fatherName}</span>}
          </div>

          {/* Mother's Name (Optional) */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Mother's Name</label>
            <input
              type="text"
              value={formData.motherName || ""}
              onChange={(e) => handleFieldChange("motherName", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              placeholder="Enter mother's name"
            />
            {errors.motherName && <span className="text-red-500 text-sm mt-1">{errors.motherName}</span>}
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.dob || ""}
              onChange={(e) => handleFieldChange("dob", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
            {errors.dob && <span className="text-red-500 text-sm mt-1">{errors.dob}</span>}
          </div>

          {/* Category */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.category || ""}
              onChange={(e) => handleFieldChange("category", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            >
              <option value="">Select category</option>
              <option value="General">General</option>
              <option value="OBC">OBC</option>
              <option value="SC">SC</option>
              <option value="ST">ST</option>
              <option value="EWS">EWS</option>
            </select>
            {errors.category && <span className="text-red-500 text-sm mt-1">{errors.category}</span>}
          </div>

          {/* PWD (Yes/No) */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              PWD (Yes/No) <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.pwd || ""}
              onChange={(e) => handleFieldChange("pwd", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
            {errors.pwd && <span className="text-red-500 text-sm mt-1">{errors.pwd}</span>}
          </div>

          {/* Type of Disability */}
          {formData.pwd === "Yes" && (
            <div>
              <label className="block text-gray-700 font-medium mb-1">Type of Disability</label>
              <input
                type="text"
                value={formData.typeOfDisability || ""}
                onChange={(e) => handleFieldChange("typeOfDisability", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                placeholder="Specify disability"
              />
              {errors.typeOfDisability && <span className="text-red-500 text-sm mt-1">{errors.typeOfDisability}</span>}
            </div>
          )}

          {/* Nationality (default Indian) */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Nationality <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.nationality || "Indian"}
              onChange={(e) => handleFieldChange("nationality", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              placeholder="Enter nationality"
            />
            {errors.nationality && <span className="text-red-500 text-sm mt-1">{errors.nationality}</span>}
          </div>

          {/* Marital Status (Optional) */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Marital Status</label>
            <select
              value={formData.maritalStatus || ""}
              onChange={(e) => handleFieldChange("maritalStatus", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            >
              <option value="">Select status</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Divorced">Divorced</option>
              <option value="Widowed">Widowed</option>
            </select>
            {errors.maritalStatus && <span className="text-red-500 text-sm mt-1">{errors.maritalStatus}</span>}
          </div>
        </div>
      </div>
    </form>
  );
};

export default Personal;