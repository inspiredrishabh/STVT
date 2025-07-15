import React, { useEffect, useState, useRef } from "react";

const Contact = ({ formData, onChange, errors = {} }) => {
  const [showEmailSuggestions, setShowEmailSuggestions] = useState(false);
  const [emailSuggestions, setEmailSuggestions] = useState([]);
  const emailInputRef = useRef(null);

  const emailDomains = [
    "gmail.com",
    "yahoo.com",
    "outlook.com",
    "hotmail.com",
    "rediffmail.com",
    "zoho.com",
    "protonmail.com",
    "icloud.com",
    "yandex.com",
    "mail.com"
  ];

  const handleEmailChange = (value) => {
    handleFieldChange("email", value);

    // Check if user typed @ and show suggestions
    if (value.includes("@") && !value.includes(".")) {
      const parts = value.split("@");
      if (parts.length === 2 && parts[1] === "") {
        // User just typed @, show all suggestions
        const suggestions = emailDomains.map(domain => `${parts[0]}@${domain}`);
        setEmailSuggestions(suggestions);
        setShowEmailSuggestions(true);
      } else if (parts.length === 2 && parts[1].length > 0) {
        // User is typing domain, filter suggestions
        const filtered = emailDomains
          .filter(domain => domain.toLowerCase().startsWith(parts[1].toLowerCase()))
          .map(domain => `${parts[0]}@${domain}`);
        setEmailSuggestions(filtered);
        setShowEmailSuggestions(filtered.length > 0);
      }
    } else {
      setShowEmailSuggestions(false);
    }
  };

  const selectEmailSuggestion = (suggestion) => {
    handleFieldChange("email", suggestion);
    setShowEmailSuggestions(false);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emailInputRef.current && !emailInputRef.current.contains(event.target)) {
        setShowEmailSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const validateField = (fieldName, value) => {
    const trimmedValue = value?.toString().trim() || "";

    switch (fieldName) {
      case "permanentAddress":
      case "currentAddress":
        return trimmedValue.length < 5 ? "Address must be at least 5 characters long" : "";
      case "phoneNumber":
      case "emergencyContactNumber":
        return !/^\d{10}$/.test(trimmedValue) ? "Must be 10 digits" : "";
      case "email":
        return !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(trimmedValue) ? "Invalid email format" : "";
      default:
        return "";
    }
  };

  const validateAllFields = () => {
    const requiredFields = ["permanentAddress", "currentAddress", "phoneNumber", "emergencyContactNumber", "email"];
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

  const handleFieldChange = (field, value) => onChange(field, value);
  const handleCopyAddress = () => handleFieldChange("currentAddress", formData.permanentAddress || "");

  const RequiredLabel = ({ children }) => (
    <label className="block text-gray-700 font-medium mb-1">
      {children} <span className="text-red-500">*</span>
    </label>
  );

  return (
    <div className="bg-white rounded-3xl p-8 shadow-lg border-2 border-orange-100">
      <div className="flex items-center space-x-3 mb-6">
        <div className="h-12 w-12 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full shadow text-lg">
          📞
        </div>
        <h3 className="text-xl font-semibold text-gray-800">Contact Details</h3>
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

        {/* Copy Address Button */}
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
          <div className="relative" ref={emailInputRef}>
            <input
              type="email"
              value={formData.email || ""}
              onChange={(e) => handleEmailChange(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              placeholder="Enter email (e.g., username@gmail.com)"
            />

            {/* Email Suggestions Dropdown */}
            {showEmailSuggestions && emailSuggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {emailSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    onClick={() => selectEmailSuggestion(suggestion)}
                  >
                    <div className="flex items-center">
                      <span className="text-sm text-gray-800">{suggestion}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Type your email address. After typing "@", select from suggested domains.
          </p>
          {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
        </div>
      </div>
    </div>
  );
};

export default Contact;
