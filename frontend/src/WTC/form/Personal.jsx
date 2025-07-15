import React, { useCallback, useMemo, useState, useEffect } from "react";

const Personal = ({ formData, onChange, errors = {} }) => {
  const [imageValidationInProgress, setImageValidationInProgress] = useState(false);
  const [imageValidationError, setImageValidationError] = useState("");

  // Function to get image dimensions
  const getImageDimensions = (file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve({ width: img.width, height: img.height });
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = URL.createObjectURL(file);
    });
  };

  // Handle file change separately to validate dimensions
  const handleFileChange = async (file) => {
    setImageValidationInProgress(true);
    setImageValidationError("");

    try {
      if (!file) {
        setImageValidationError("Picture is required");
      } else if (!file.type?.startsWith("image/")) {
        setImageValidationError("Please select a valid image file");
      } else if (file.size > 1024 * 1024) {
        setImageValidationError("Image size should be less than 1MB");
      } else {
        // Check dimensions
        const dimensions = await getImageDimensions(file);
        if (dimensions.height <= dimensions.width) {
          setImageValidationError("Image height must be greater than width (portrait orientation)");
        } else if (dimensions.height > dimensions.width * 1.5) {
          setImageValidationError("Image height should not be greater than 1.5 times the width");
        } else {
          // Valid image
          onChange("picture", file);
        }
      }
    } catch (error) {
      setImageValidationError("Unable to validate image dimensions");
    } finally {
      setImageValidationInProgress(false);
    }
  };

  const validateField = useCallback(
    (fieldName, value) => {
      const validations = {
        picture: (v) => {
          if (!v) return "Picture is required";
          // Basic validations only - dimensions are validated separately
          if (!v.type?.startsWith("image/"))
            return "Please select a valid image file";
          if (v.size > 1024 * 1024) return "Image size should be less than 1MB";
          return imageValidationError || "";
        },
        name: (v) => validateName(v, "Name"),
        fatherName: (v) => validateName(v, "Father's name"),
        motherName: (v) => (v ? validateName(v, "Mother's name", false) : ""),
        sex: (v) =>
          !v
            ? "Gender is required"
            : !["Male", "Female", "Other"].includes(v)
              ? "Please select a valid gender"
              : "",
        dob: (v) => {
          if (!v) return "Date of birth is required";
          const dobDate = new Date(v);
          const today = new Date();
          const age = today.getFullYear() - dobDate.getFullYear();
          if (dobDate > today) return "Date of birth cannot be in the future";
          if (age < 16) return "Age must be at least 16 years";
          if (age > 100) return "Please enter a valid date of birth";
          return "";
        },
        category: (v) =>
          !v
            ? "Category is required"
            : !["General", "OBC", "SC", "ST", "EWS"].includes(v)
              ? "Please select a valid category"
              : "",
        pwd: (v) =>
          !v
            ? "PWD selection is required"
            : !["Yes", "No"].includes(v)
              ? "Please select Yes or No for PWD"
              : "",
        typeOfDisability: (v) => {
          if (formData.pwd === "Yes" && (!v || !v.trim()))
            return "Type of disability is required when PWD is Yes";
          if (v && v.trim() && v.trim().length < 3)
            return "Type of disability must be at least 3 characters long";
          return "";
        },
        nationality: (v) => validateName(v, "Nationality"),
      };

      return validations[fieldName]?.(value) || "";
    },
    [formData.pwd, imageValidationError]
  );

  const validateName = (value, fieldLabel, required = true) => {
    if (!value || !value.trim()) return required ? `${fieldLabel} is required` : "";
    if (value.trim().length < 2) return `${fieldLabel} must be at least 2 characters long`;
    if (!/^[a-zA-Z\s]+$/.test(value.trim())) return `${fieldLabel} should only contain letters and spaces`;
    return "";
  };

  const validateAllFields = useCallback(() => {
    const requiredFields = [
      "picture",
      "name",
      "sex",
      "fatherName",
      "dob",
      "category",
      "pwd",
      "nationality",
    ];
    const optionalFields = ["motherName", "typeOfDisability"];
    const validationErrors = {};

    [...requiredFields, ...optionalFields.filter((field) => formData[field])].forEach(
      (field) => {
        const error = validateField(field, formData[field]);
        if (error) validationErrors[field] = error;
      }
    );

    return {
      isValid: Object.keys(validationErrors).length === 0,
      errors: validationErrors,
    };
  }, [formData, validateField]);

  React.useEffect(() => {
    onChange.setValidationFunction?.(validateAllFields);
  }, [validateAllFields, onChange]);

  const formFields = useMemo(
    () => [
      { label: "Picture", field: "picture", type: "file", required: true },
      { label: "Name", field: "name", required: true },
      {
        label: "Gender",
        field: "sex",
        type: "select",
        options: ["", "Male", "Female", "Other"],
        required: true,
      },
      { label: "Father's Name", field: "fatherName", required: true },
      { label: "Mother's Name", field: "motherName" },
      { label: "Date of Birth", field: "dob", type: "date", required: true },
      {
        label: "Category",
        field: "category",
        type: "select",
        options: ["", "General", "OBC", "SC", "ST", "EWS"],
        required: true,
      },
      {
        label: "PWD (Yes/No)",
        field: "pwd",
        type: "select",
        options: ["", "Yes", "No"],
        required: true,
      },
      ...(formData.pwd === "Yes"
        ? [{ label: "Type of Disability", field: "typeOfDisability" }]
        : []),
      {
        label: "Nationality",
        field: "nationality",
        defaultValue: "Indian",
        required: true,
      },
    ],
    [formData.pwd]
  );

  const renderField = useCallback(
    ({ label, field, type = "text", options = [], required = false, defaultValue }) => (
      <div key={field}>
        <label className="block text-gray-700 font-medium mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {type === "file" ? (
          <div className="flex items-center w-full border border-gray-300 rounded-lg px-4 py-2 bg-white">
            <label htmlFor="pictureUpload" className="bg-gray-200 text-gray-700 px-4 py-1 rounded cursor-pointer text-sm mr-4">
              {imageValidationInProgress ? "Processing..." : "Choose File"}
            </label>
            <input
              id="pictureUpload"
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e.target.files[0])}
              className="hidden"
              disabled={imageValidationInProgress}
            />
            <span className="text-gray-500 text-sm truncate">
              {formData[field] ? formData[field].name : "No file chosen, Image must be portrait with height not exceeding 1.5x width"}
            </span>
          </div>
        ) : type === "select" ? (
          <select
            value={formData[field] || ""}
            onChange={(e) => onChange(field, e.target.value)}
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
            value={formData[field] || defaultValue || ""}
            onChange={(e) => onChange(field, e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            placeholder={`Enter ${label.toLowerCase()}`}
          />
        )}
        {errors[field] && (
          <span className="text-red-500 text-sm mt-1">{errors[field]}</span>
        )}
      </div>
    ),
    [formData, errors, onChange]
  );

  return (
    <div className="bg-white rounded-3xl p-8 shadow-lg border-2 border-orange-100">
      <div className="flex items-center space-x-3 mb-6">
        <div className="h-12 w-12 flex items-center justify-center bg-pink-100 text-pink-600 rounded-full shadow text-lg">
          👤
        </div>
        <h3 className="text-xl font-semibold text-gray-800">Personal Detail</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
        {formFields.map(renderField)}
      </div>
    </div>
  );
};

export default Personal;
