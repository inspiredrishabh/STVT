import { useState, useRef } from "react";
import Personal from "./Personal";
import Contact from "./Contact";
import Professional from "./Professional";
import Course from "./Course";

const STCMain = () => {
  const [formData, setFormData] = useState({
    // Personal
    picture: null,
    name: "",
    sex: "",
    fatherName: "",
    motherName: "",
    dob: "",
    category: "",
    pwd: "",
    typeOfDisability: "",
    nationality: "Indian", // Default value set to "Indian"
    maritalStatus: "",
    bloodGroup: "", // New field

    // Contact
    currentAddress: "",
    permanentAddress: "",
    phoneNumber: "",
    emergencyContactNumber: "",
    email: "",

    // Professional
    dateOfAppointmentInRailway: "",
    modeOfAppointment: "",
    designation: "",
    unit: "",
    workingUnder: "",
    hrmsId: "",
    pfNoNpsUps: "",
    employeeNumber: "",
    previousWorkExperience: "", // New field

    // Education
    highestQualification: "",
    highestDegree: "", // New field
    fieldOfStudy: "",
    institution: "",
    college: "", // New field
    gradeType: "",
    gradeValue: "",

    // Additional Information
    hobbies: "", // New field
    culturalHobby: "", // New field
    achievement: "", // New field

    batch: "",
    dateOfJoiningStcWtcNonRailway: "",
    dateOfSparing: "",
    moduleNo: "",
    courseDuration: "",
  });

  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const validationFunctions = useRef({});

  const steps = ["Personal", "Contact", "Professional", "Course"];
  const icons = ["👤", "📞", "💼", "📄"];

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const { [field]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const createChangeHandler = (stepKey) => {
    const handler = (field, value) => handleChange(field, value);
    handler.setValidationFunction = (validationFn) => {
      validationFunctions.current[stepKey] = validationFn;
    };
    handler.updateErrors = (validationErrors) => setErrors(validationErrors);
    return handler;
  };

  const changeHandlers = {
    personal: createChangeHandler("personal"),
    contact: createChangeHandler("contact"),
    professional: createChangeHandler("professional"),
    course: createChangeHandler("course"),
  };

  const isStepValid = () => {
    const stepKeys = ["personal", "contact", "professional", "course"];
    const currentKey = stepKeys[step];
    const validationFn = validationFunctions.current[currentKey];

    if (validationFn) {
      const validation = validationFn();
      if (!validation.isValid) {
        setErrors(validation.errors);
        return false;
      }
      setErrors({});
      return true;
    }
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
    if (step > 0) setStep(step - 1); // Fixed the typo: should be step - 1
  };

  const submitToAPI = async (data) => {
    try {
      // Use FormData for file uploads
      const formDataToSend = new FormData();

      // Map all fields - the backend will transform camelCase to snake_case
      Object.entries(data).forEach(([key, value]) => {
        if (key === "picture" && value) {
          formDataToSend.append("image", value); // Backend expects 'image' for file
        } else if (value !== null && value !== undefined && value !== "") {
          // Send as camelCase - backend will transform to snake_case
          formDataToSend.append(key, value);
        }
      });

      const response = await fetch("/api/stc", {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${
            errorData.message || response.statusText
          }`
        );
      }

      const result = await response.json();
      return { success: true, data: result };
    } catch (error) {
      console.error("Submission error:", error);
      return { success: false, error: error.message };
    }
  };

  const handleSubmit = async () => {
    if (!isStepValid()) {
      alert("Please correct all validation errors before submitting.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await submitToAPI(formData);

      if (result.success) {
        alert(result.data.message + " Ticket No: " + result.data.ticketNumber);
        // Reset form or redirect
        // For actual deployment, you might want a more sophisticated clear
        // or confirmation. For now, setting initial state.
        setFormData({
          // Personal
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
          bloodGroup: "",

          // Contact
          currentAddress: "",
          permanentAddress: "",
          phoneNumber: "",
          emergencyContactNumber: "",
          email: "",

          // Professional
          dateOfAppointmentInRailway: "",
          modeOfAppointment: "",
          designation: "",
          unit: "",
          workingUnder: "",
          hrmsId: "",
          pfNoNpsUps: "",
          employeeNumber: "",
          previousWorkExperience: "",

          // Education
          highestQualification: "",
          highestDegree: "",
          fieldOfStudy: "",
          institution: "",
          college: "",
          gradeType: "",
          gradeValue: "",

          // Additional Information
          hobbies: "",
          culturalHobby: "",
          achievement: "",

          batch: "",
          dateOfJoiningStcWtcNonRailway: "",
          dateOfSparing: "",
          moduleNo: "",
          courseDuration: "",
        });
        setStep(0);
      } else {
        alert(`Submission failed: ${result.error}`);
      }
    } catch (error) {
      alert("An unexpected error occurred. Please try again.", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderForm = () => {
    const forms = [
      <Personal
        formData={formData}
        onChange={changeHandlers.personal}
        errors={errors}
      />,
      <Contact
        formData={formData}
        onChange={changeHandlers.contact}
        errors={errors}
      />,
      <Professional
        formData={formData}
        onChange={changeHandlers.professional}
        errors={errors}
      />,
      <Course
        formData={formData}
        onChange={changeHandlers.course}
        errors={errors}
      />,
    ];
    return forms[step];
  };

  return (
    <div className="max-w-6xl mx-auto my-7 px-4 sm:px-6 lg:px-8 bg-white">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          STC Registration
        </h1>
        <div className="h-1 bg-gradient-to-r from-orange-300 to-orange-600 mx-auto rounded-full"></div>
      </div>

      {/* Step Navigation */}
      <div className="flex justify-between items-center mb-8 bg-gray-800 rounded-xl p-4">
        {steps.map((label, index) => (
          <div key={index} className="flex-1 text-center">
            <div
              className={`mx-auto mb-1 h-12 w-12 flex items-center justify-center rounded-full text-white font-bold
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
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* Form */}
      {renderForm()}

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-8 mt-8 border-t border-gray-100">
        {step > 0 ? (
          <button
            type="button"
            onClick={handleBack}
            disabled={isSubmitting}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 disabled:opacity-50"
          >
            ← Back
          </button>
        ) : (
          <div></div>
        )}

        <button
          type="button"
          onClick={step === steps.length - 1 ? handleSubmit : handleNext}
          disabled={isSubmitting}
          className="px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting
            ? "Submitting..."
            : step === steps.length - 1
            ? "Submit"
            : "Save and Next →"}
        </button>
      </div>
    </div>
  );
};

export default STCMain;
