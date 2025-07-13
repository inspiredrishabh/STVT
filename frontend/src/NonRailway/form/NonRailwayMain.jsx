import React, { useState, useRef } from "react";
import Personal from "./Personal";
import Contact from "./Contact";
import Professional from "./Professional";

const NonRailwayMain = () => {
  const [formData, setFormData] = useState({
    // Personal fields
    picture: null,
    name: "",
    sex: "",
    fatherName: "",
    motherName: "",
    dob: "",
    category: "",
    pwd: "",
    typeOfDisability: "",
    nationality: "Indian",
    // Contact fields
    currentAddress: "",
    permanentAddress: "",
    phoneNumber: "",
    emergencyContactNumber: "",
    email: "",
    // Professional fields
    courseType: "",
    customCourseType: "",
    designation: "",
    unitCustodian: "",
    duration: "",
    durationOption: "",
    theoryPeriod: "",
    practicalPeriod: "",
    workingUnder: "",
    remark: "",
    // Educational fields
    highestQualification: "",
    fieldOfStudy: "",
    customFieldOfStudy: "",
    institution: "",
    gradeType: "",
    gradeValue: "",
  });

  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const validationFunctions = useRef({});

  const steps = ["Personal", "Contact", "Professional"];
  const icons = ["👤", "📞", "💼"];

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when field is changed
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Create enhanced change handlers for each step
  const createChangeHandler = (stepKey) => {
    const handler = (field, value) => handleChange(field, value);

    handler.setValidationFunction = (validationFn) => {
      validationFunctions.current[stepKey] = validationFn;
    };

    handler.updateErrors = (validationErrors) => {
      setErrors(validationErrors);
    };

    return handler;
  };

  const personalChangeHandler = createChangeHandler("personal");
  const contactChangeHandler = createChangeHandler("contact");
  const professionalChangeHandler = createChangeHandler("professional");

  const isStepValid = () => {
    const stepKeys = ["personal", "contact", "professional"];
    const currentKey = stepKeys[step];

    if (validationFunctions.current[currentKey]) {
      const validation = validationFunctions.current[currentKey]();
      if (!validation.isValid) {
        setErrors(validation.errors);
        return false;
      }
      setErrors({}); // Clear errors if validation passes
      return true;
    }

    // Fallback basic validation if no validation function is registered
    console.warn(`No validation function registered for step: ${currentKey}`);
    return true;
  };

  const handleNext = () => {
    if (!isStepValid()) {
      alert("Please correct the validation errors before proceeding.");
      return;
    }
    if (step < steps.length - 1) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const prepareFormDataForSubmission = () => {
    const submissionData = new FormData();

    // Field mapping from frontend to backend
    const fieldMapping = {
      // Personal fields
      picture: "picture",
      name: "name",
      sex: "sex",
      fatherName: "father_name",
      motherName: "mother_name",
      dob: "dob",
      category: "category",
      pwd: "pwd",
      typeOfDisability: "type_of_disability",
      nationality: "nationality",
      // Contact fields
      currentAddress: "current_address",
      permanentAddress: "permanent_address",
      phoneNumber: "phone_number",
      emergencyContactNumber: "emergency_contact_number",
      email: "email",
      // Professional fields
      courseType: "course_type",
      customCourseType: "course_type", // Use custom course type if provided
      designation: "designation",
      unitCustodian: "unit",
      duration: "duration",
      theoryPeriod: "theory",
      practicalPeriod: "practical",
      workingUnder: "working_under",
      remark: "remarks",
      // Educational fields
      highestQualification: "highest_qualification",
      fieldOfStudy: "field_of_study",
      institution: "institution",
      gradeType: "grade_type",
      gradeValue: "grade_value",
    };

    // Add all form fields with proper mapping
    Object.keys(formData).forEach((key) => {
      if (key === "picture" && formData[key]) {
        submissionData.append("image", formData[key]); // Backend expects 'image' field
      } else if (formData[key] !== null && formData[key] !== "") {
        const backendKey = fieldMapping[key];
        if (backendKey) {
          // Special handling for course type - use custom if available, otherwise use courseType
          if (key === "courseType" && formData.customCourseType) {
            submissionData.append(backendKey, formData.customCourseType);
          } else if (key === "fieldOfStudy" && formData.customFieldOfStudy) {
            // Use custom field of study if available, otherwise use selected field
            submissionData.append(backendKey, formData.customFieldOfStudy);
          } else if (key !== "customCourseType" && key !== "customFieldOfStudy") {
            submissionData.append(backendKey, formData[key]);
          }
        }
      }
    });

    return submissionData;
  };

  const handleSubmit = async () => {
    if (!isStepValid()) {
      alert("Please correct all validation errors before submitting.");
      return;
    }

    setIsLoading(true);

    try {
      const submissionData = prepareFormDataForSubmission();

      const response = await fetch(`/api/nonrailway`, {
        method: "POST",
        body: submissionData,
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Error response data:", errorData);
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();
      console.log("Submission result:", result);
      
      // Show success message with ticket number
      const ticketNumber = result.data?.ticket_no || "Generated";
      alert(
        `Registration completed successfully! Your ticket number: ${ticketNumber}`
      );

      // Reset form after successful submission
      setFormData({
        picture: null,
        name: "",
        sex: "",
        fatherName: "",
        motherName: "",
        dob: "",
        category: "",
        pwd: "",
        typeOfDisability: "",
        nationality: "Indian",
        currentAddress: "",
        permanentAddress: "",
        phoneNumber: "",
        emergencyContactNumber: "",
        email: "",
        courseType: "",
        customCourseType: "",
        designation: "",
        unitCustodian: "",
        duration: "",
        durationOption: "",
        theoryPeriod: "",
        practicalPeriod: "",
        workingUnder: "",
        remark: "",
        highestQualification: "",
        fieldOfStudy: "",
        customFieldOfStudy: "",
        institution: "",
        gradeType: "",
        gradeValue: "",
      });
      setStep(0);
      setErrors({});
    } catch (error) {
      console.error("Submission error:", error);
      alert(`Registration failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const renderForm = () => {
    switch (step) {
      case 0:
        return (
          <Personal
            formData={formData}
            onChange={personalChangeHandler}
            errors={errors}
          />
        );
      case 1:
        return (
          <Contact
            formData={formData}
            onChange={contactChangeHandler}
            errors={errors}
          />
        );
      case 2:
        return (
          <Professional
            formData={formData}
            onChange={professionalChangeHandler}
            errors={errors}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto my-7 px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Non-Railway Candidate Registration
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-orange-500 mx-auto rounded-full"></div>
      </div>

      {/* Step Navigation Bar */}
      <div className="flex justify-between items-center mb-8 bg-gray-800 rounded-2xl p-4">
        {steps.map((label, index) => (
          <div key={index} className="flex-1 text-center">
            <div
              className={`mx-auto mb-1 h-12 w-12 flex items-center justify-center rounded-full text-white font-bold transition-colors duration-200
              ${
                step === index
                  ? "bg-orange-500"
                  : step > index
                  ? "bg-green-500"
                  : "bg-gray-500"
              }`}
            >
              {icons[index]}
            </div>
            <p
              className={`text-sm font-semibold ${
                step === index ? "text-white" : "text-gray-300"
              }`}
            >
              {label} Details
            </p>
          </div>
        ))}
      </div>

      {/* Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          step === steps.length - 1 ? handleSubmit() : handleNext();
        }}
        className="space-y-8"
      >
        {renderForm()}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-8 mt-8 border-t border-gray-100">
          {step > 0 ? (
            <button
              type="button"
              onClick={handleBack}
              disabled={isLoading}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 disabled:opacity-50 transition-colors"
            >
              ← Back
            </button>
          ) : (
            <div></div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-pink-500 text-white rounded-xl hover:bg-pink-700 disabled:opacity-50 flex items-center transition-colors"
          >
            {isLoading && (
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )}
            {isLoading
              ? "Submitting..."
              : step === steps.length - 1
              ? "Submit Registration"
              : "Save and Next →"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NonRailwayMain;
