import React, { useState, useRef } from "react";
import Personal from "./Personal";
import Contact from "./Contact";
import Professional from "./Professional";
import Course from "./Course";

const WtcMain = () => {
  const [formData, setFormData] = useState({
    picture: null,
    name: "",
    sex: "",
    fatherName: "",
    motherName: "",
    dob: "",
    category: "",
    pwd: "",
    typeOfDisability: "",
    nationality: "INDIAN",
    maritalStatus: "",
    currentAddress: "",
    permanentAddress: "",
    phoneNumber: "",
    emergencyContactNumber: "",
    email: "",
    // Professional fields with correct names
    dateOfAppointmentInRailway: "",
    modeOfAppointment: "",
    designation: "",
    unit: "",
    workingUnder: "",
    hrmsId: "",
    pfNoNpsUps: "",
    employeeNumber: "",
    // Educational fields
    highestQualification: "",
    otherQualification: "",
    fieldOfStudy: "",
    institution: "",
    boardType: "",
    educationStartYear: "",
    eduCourseDuration: "",
    yearOfGraduation: "",
    modeOfStudy: "",
    gradeType: "",
    gradeValue: "",
    division: "",
    hasAdditionalQualification: "",
    additionalQualificationName: "",
    additionalQualificationOrg: "",
    additionalQualificationYear: "",
    thesisTitle: "",
    // Course fields
    ticketNo: "",
    batch: "",
    dateOfJoiningStcWtcNonRailway: "",
    dateOfSparing: "",
    moduleNo: "",
    courseDuration: "",
  });

  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const validationFunctions = useRef({});

  const steps = ["Personal", "Contact", "Professional", "Course"];
  const icons = ["👤", "📞", "💼", "📄"];

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

  const personalChangeHandler = createChangeHandler('personal');
  const contactChangeHandler = createChangeHandler('contact');
  const professionalChangeHandler = createChangeHandler('professional');
  const courseChangeHandler = createChangeHandler('course');

  const isStepValid = () => {
    const stepKeys = ["personal", "contact", "professional", "course"];
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

  const handleSubmit = () => {
    if (!isStepValid()) {
      alert("Please correct all validation errors before submitting.");
      return;
    }
    console.log("Final Submitted Data:", formData);
    alert("All details saved successfully.");
  };

  const renderForm = () => {
    switch (step) {
      case 0:
        return <Personal formData={formData} onChange={personalChangeHandler} errors={errors} />;
      case 1:
        return <Contact formData={formData} onChange={contactChangeHandler} errors={errors} />;
      case 2:
        return <Professional formData={formData} onChange={professionalChangeHandler} errors={errors} />;
      case 3:
        return <Course formData={formData} onChange={courseChangeHandler} errors={errors} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto my-7 px-4 sm:px-6 lg:px-8 animate-fadeIn">
      {/* Step Navigation Bar */}
      <div className="flex justify-between items-center mb-8 bg-gray-800 rounded-2xl p-4">
        {steps.map((label, index) => (
          <div key={index} className="flex-1 text-center">
            <div className={`mx-auto mb-1 h-12 w-12 flex items-center justify-center rounded-full text-white font-bold
              ${step === index ? "bg-blue-500" : step > index ? "bg-green-500" : "bg-gray-500"}`}>
              {icons[index]}
            </div>
            <p className={`text-sm font-semibold ${step === index ? "text-white" : "text-gray-300"}`}>
              {label} Details
            </p>
          </div>
        ))}
      </div>

      {/* Unified Form Handler */}
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
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300"
            >
              ← Back
            </button>
          ) : (
            <div></div>
          )}

          <button
            type="submit"
            className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all duration-200 shadow-md"
          >
            {step === steps.length - 1 ? "Save All Details" : "Save and Next →"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default WtcMain;