import React, { useEffect } from "react";

const Contact = ({ formData, onChange, errors = {}, onSubmit }) => {
  // Validation logic
  const validateField = (fieldName, value) => {
    let error = "";

    switch (fieldName) {
      case "permanentAddress":
      case "currentAddress":
        if (!value || value.trim().length < 5) {
          error = "Address must be at least 5 characters long";
        }
        break;

      case "phoneNumber":
        if (!value || !/^\d{10}$/.test(value.trim())) {
          error = "Phone number must be 10 digits";
        }
        break;

      case "emergencyContactNumber":
        if (!value || !/^\d{10}$/.test(value.trim())) {
          error = "Emergency contact must be 10 digits";
        }
        break;

      case "email":
        if (!value || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value.trim())) {
          error = "Please enter a valid email address";
        }
        break;

      default:
        break;
    }

    return error;
  };

  // Validate all fields
  const validateAllFields = () => {
    const validationErrors = {};
    const requiredFields = [
      "permanentAddress",
      "currentAddress",
      "phoneNumber",
      "emergencyContactNumber",
      "email"
    ];

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

  const handleFieldChange = (field, value) => {
    onChange(field, value);
  };

  const handleCopyAddress = () => {
    handleFieldChange("currentAddress", formData.permanentAddress || "");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = validateAllFields();

    if (!validation.isValid) {
      if (onChange.updateErrors) onChange.updateErrors(validation.errors);
      return false;
    }

    if (onSubmit) {
      const isValid = onSubmit(formData);
      return isValid !== false;
    }

    return true;
  };

  const RequiredLabel = ({ children }) => (
    <label className="block text-gray-700 font-medium mb-1">
      {children} <span className="text-red-500">*</span>
    </label>
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200"
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="h-12 w-12 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full shadow text-lg">
          📞
        </div>
        <h3 className="text-xl font-semibold text-gray-800">Contact Detail</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
        {/* Permanent Address */}
        <div className="sm:col-span-2">
          <RequiredLabel>Permanent Address</RequiredLabel>
          <textarea
            rows="3"
            value={formData.permanentAddress || ""}
            onChange={(e) => handleFieldChange("permanentAddress", e.target.value)}
            placeholder="Enter permanent address"
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          />
          {errors.permanentAddress && <span className="text-red-500 text-sm">{errors.permanentAddress}</span>}
        </div>

        {/* Same as Permanent Address */}
        <div className="sm:col-span-2">
          <button
            type="button"
            onClick={handleCopyAddress}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition text-sm text-gray-800"
          >
            Same as Permanent Address
          </button>
        </div>

        {/* Current Address */}
        <div className="sm:col-span-2">
          <RequiredLabel>Current Address</RequiredLabel>
          <textarea
            rows="3"
            value={formData.currentAddress || ""}
            onChange={(e) => handleFieldChange("currentAddress", e.target.value)}
            placeholder="Enter current address"
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          />
          {errors.currentAddress && <span className="text-red-500 text-sm">{errors.currentAddress}</span>}
        </div>

        {/* Phone Number */}
        <div>
          <RequiredLabel>Phone Number (WhatsApp)</RequiredLabel>
          <input
            type="tel"
            value={formData.phoneNumber || ""}
            onChange={(e) => handleFieldChange("phoneNumber", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            placeholder="Enter WhatsApp number"
          />
          {errors.phoneNumber && <span className="text-red-500 text-sm">{errors.phoneNumber}</span>}
        </div>

        {/* Emergency Contact */}
        <div>
          <RequiredLabel>Emergency Contact Number</RequiredLabel>
          <input
            type="tel"
            value={formData.emergencyContactNumber || ""}
            onChange={(e) => handleFieldChange("emergencyContactNumber", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            placeholder="Enter emergency number"
          />
          {errors.emergencyContactNumber && <span className="text-red-500 text-sm">{errors.emergencyContactNumber}</span>}
        </div>

        {/* Email */}
        <div className="sm:col-span-2">
          <RequiredLabel>Email</RequiredLabel>
          <input
            type="email"
            value={formData.email || ""}
            onChange={(e) => handleFieldChange("email", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            placeholder="Enter email"
          />
          {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
        </div>
      </div>
    </form>
  );
};

export default Contact;
