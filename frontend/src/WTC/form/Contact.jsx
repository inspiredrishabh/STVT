import React, { useEffect, useCallback, useMemo } from "react";

const Contact = ({ formData, onChange, errors = {} }) => {
  const validateField = useCallback((fieldName, value) => {
    const validations = {
      permanentAddress: (v) =>
        !v || v.trim().length < 5
          ? "Address must be at least 5 characters long"
          : "",
      currentAddress: (v) =>
        !v || v.trim().length < 5
          ? "Address must be at least 5 characters long"
          : "",
      phoneNumber: (v) =>
        !v || !/^\d{10}$/.test(v.trim())
          ? "Phone number must be 10 digits"
          : "",
      emergencyContactNumber: (v) =>
        !v || !/^\d{10}$/.test(v.trim())
          ? "Emergency contact must be 10 digits"
          : "",
      email: (v) =>
        !v || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v.trim())
          ? "Please enter a valid email address"
          : "",
    };
    return validations[fieldName]?.(value) || "";
  }, []);

  const validateAllFields = useCallback(() => {
    const requiredFields = [
      "permanentAddress",
      "currentAddress",
      "phoneNumber",
      "emergencyContactNumber",
      "email",
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
  }, [formData, validateField]);

  useEffect(() => {
    onChange.setValidationFunction?.(validateAllFields);
  }, [validateAllFields, onChange]);

  const handleCopyAddress = useCallback(() => {
    onChange("currentAddress", formData.permanentAddress || "");
  }, [onChange, formData.permanentAddress]);

  const contactFields = useMemo(
    () => [
      {
        label: "Permanent Address",
        field: "permanentAddress",
        type: "textarea",
        colSpan: 2,
      },
      {
        label: "Current Address",
        field: "currentAddress",
        type: "textarea",
        colSpan: 2,
        copyButton: true,
      },
      { label: "Phone Number (WhatsApp)", field: "phoneNumber", type: "tel" },
      {
        label: "Emergency Contact Number",
        field: "emergencyContactNumber",
        type: "tel",
      },
      { label: "Email", field: "email", type: "email", colSpan: 2 },
    ],
    []
  );

  const renderField = useCallback(
    ({ label, field, type = "text", colSpan = 1, copyButton = false }) => (
      <div key={field} className={colSpan === 2 ? "sm:col-span-2" : ""}>
        <label className="block text-gray-700 font-medium mb-1">
          {label} <span className="text-red-500">*</span>
        </label>
        {copyButton && (
          <button
            type="button"
            onClick={handleCopyAddress}
            className="mb-2 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition text-sm text-gray-800"
          >
            Same as Permanent Address
          </button>
        )}
        {type === "textarea" ? (
          <textarea
            rows="3"
            value={formData[field] || ""}
            onChange={(e) => onChange(field, e.target.value)}
            placeholder={`Enter ${label.toLowerCase()}`}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          />
        ) : (
          <input
            type={type}
            value={formData[field] || ""}
            onChange={(e) => onChange(field, e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            placeholder={`Enter ${label.toLowerCase()}`}
          />
        )}
        {errors[field] && (
          <span className="text-red-500 text-sm">{errors[field]}</span>
        )}
      </div>
    ),
    [formData, errors, onChange, handleCopyAddress]
  );

  return (
    <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200">
      <div className="flex items-center space-x-3 mb-6">
        <div className="h-12 w-12 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full shadow text-lg">
          📞
        </div>
        <h3 className="text-xl font-semibold text-gray-800">Contact Detail</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
        {contactFields.map(renderField)}
      </div>
    </div>
  );
};

export default Contact;
