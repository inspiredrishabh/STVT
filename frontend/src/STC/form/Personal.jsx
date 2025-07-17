import { useEffect, useCallback } from "react";

const Personal = ({ formData, onChange, errors = {} }) => {
  const validateField = useCallback((fieldName, value) => {
    const trimmedValue = value?.toString().trim() || "";

    switch (fieldName) {
      case "picture":
        if (!value) return "Picture is required";
        if (value && !value.type?.startsWith("image/"))
          return "Please select a valid image file";
        if (value && value.size > 1 * 1024 * 1024)
          return "Image size should be less than 1MB";
        return "";
      case "name":
      case "fatherName":
        if (!trimmedValue)
          return `${fieldName === "name" ? "Name" : "Father's name"
            } is required`;
        if (trimmedValue.length < 2)
          return "Must be at least 2 characters long";
        if (!/^[a-zA-Z\s]+$/.test(trimmedValue))
          return "Should only contain letters and spaces";
        return "";
      case "sex":
        return !["Male", "Female", "Other"].includes(value)
          ? "Please select a valid gender"
          : "";
      case "dob": {
        if (!value) return "Date of birth is required";
        const dobDate = new Date(value);
        const today = new Date();
        const age = today.getFullYear() - dobDate.getFullYear();
        if (dobDate > today) return "Date of birth cannot be in the future";
        if (age < 16) return "Age must be at least 16 years";
        if (age > 100) return "Please enter a valid date of birth";
        return "";
      }
      case "category":
        return !["General", "OBC", "SC", "ST", "EWS"].includes(value)
          ? "Please select a valid category"
          : "";
      case "pwd":
        return !["Yes", "No"].includes(value)
          ? "Please select Yes or No for PWD"
          : "";
      case "typeOfDisability":
        if (formData.pwd === "Yes" && !trimmedValue)
          return "Type of disability is required when PWD is Yes";
        if (formData.pwd === "Yes" && trimmedValue.length < 3)
          return "Please provide more specific details about the disability";
        return "";
      case "nationality":
        if (!trimmedValue) return "Nationality is required";
        if (!/^[a-zA-Z\s]+$/.test(trimmedValue))
          return "Should only contain letters and spaces";
        return "";
      default:
        return "";
    }
  }, [formData]);

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

    // Add conditional required fields
    if (formData.pwd === "Yes") {
      requiredFields.push("typeOfDisability");
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
  }, [formData, validateField]);

  useEffect(() => {
    if (onChange.setValidationFunction) {
      onChange.setValidationFunction(validateAllFields);
    }
  }, [formData, onChange, validateAllFields]);

  const handleFieldChange = (fieldName, value) => onChange(fieldName, value);

  return (
    <div className="bg-white rounded-3xl p-8 shadow-lg border-2 border-orange-100">
      <div className="flex items-center space-x-3 mb-6">
        <div className="h-12 w-12 flex items-center justify-center bg-pink-100 text-pink-600 rounded-full shadow text-lg">
          👤
        </div>
        <h3 className="text-xl font-semibold text-black">
          Personal Details
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
        {/* Picture Upload */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Picture<span className="text-red-500">*</span>
          </label>
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
          {errors.picture && (
            <span className="text-red-500 text-sm mt-1">{errors.picture}</span>
          )}
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
          {errors.name && (
            <span className="text-red-500 text-sm mt-1">{errors.name}</span>
          )}
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
            <option value="Non-binary">Non-binary</option>
            <option value="Transgender">Transgender</option>
            <option value="Gender Fluid">Gender Fluid</option>
            <option value="Agender">Agender</option>
            <option value="Gender Queer">Gender Queer</option>
            <option value="Gender Non-conforming">Gender Non-conforming</option>
            <option value="androgyne">Androgyne</option>
            <option value="aromantic">Aromantic</option>
            <option value="asexual">Asexual</option>
            <option value="bigender">Bigender</option>
            <option value="cisgender_female">Cisgender Female</option>
            <option value="cisgender_male">Cisgender Male</option>
            <option value="demiboy">Demiboy</option>
            <option value="demigirl">Demigirl</option>
            <option value="genderfluid">Genderfluid</option>
            <option value="genderqueer">Genderqueer</option>
            <option value="intersex">Intersex</option>
            <option value="pangender">Pangender</option>
            <option value="polygender">Polygender</option>
            <option value="third_gender">Third Gender</option>
            <option value="transgender_female">Transgender Female</option>
            <option value="transgender_male">Transgender Male</option>
            <option value="two_spirit">Two-Spirit (Cultural Identity)</option>
            <option value="prefer_not_to_say">Prefer not to say</option>
            <option value="Other">Other</option>
          </select>
          {errors.sex && (
            <span className="text-red-500 text-sm mt-1">{errors.sex}</span>
          )}
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
          {errors.fatherName && (
            <span className="text-red-500 text-sm mt-1">
              {errors.fatherName}
            </span>
          )}
        </div>

        {/* Mother's Name (Optional) */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Mother's Name
          </label>
          <input
            type="text"
            value={formData.motherName || ""}
            onChange={(e) => handleFieldChange("motherName", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            placeholder="Enter mother's name"
          />
          {errors.motherName && (
            <span className="text-red-500 text-sm mt-1">
              {errors.motherName}
            </span>
          )}
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
          {errors.dob && (
            <span className="text-red-500 text-sm mt-1">{errors.dob}</span>
          )}
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
          {errors.category && (
            <span className="text-red-500 text-sm mt-1">{errors.category}</span>
          )}
        </div>

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
          {errors.pwd && (
            <span className="text-red-500 text-sm mt-1">{errors.pwd}</span>
          )}
        </div>

        {formData.pwd === "Yes" && (
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Type of Disability <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.typeOfDisability || ""}
              onChange={(e) =>
                handleFieldChange("typeOfDisability", e.target.value)
              }
              className={`w-full border ${errors.typeOfDisability ? "border-red-500" : "border-gray-300"} rounded-lg px-4 py-2`}
              placeholder="Specify disability"
            />
            {errors.typeOfDisability && (
              <span className="text-red-500 text-sm mt-1">
                {errors.typeOfDisability}
              </span>
            )}
          </div>
        )}

        {/* Nationality (default Indian) */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Nationality <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.nationality}
            onChange={(e) => handleFieldChange("nationality", e.target.value)}
            className={`w-full border ${errors.nationality ? "border-red-500" : "border-gray-300"} rounded-lg px-4 py-2`}
            placeholder="Please enter nationality "
          />
          {errors.nationality && (
            <span className="text-red-500 text-sm mt-1">
              {errors.nationality}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Personal;
