import React, { useState, useRef, useCallback, useMemo } from "react";
import Personal from "./Personal";
import Contact from "./Contact";
import Professional from "./Professional";
import Course from "./Course";

const initialFormData = {
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

  dateOfAppointmentInRailway: "",
  modeOfAppointment: "",
  modeOfAppointmentOther: "",
  courseType: "",
  courseTypeOther: "",
  designation: "",
  designationOther: "",
  unit: "",
  unitOther: "",
  trainingPeriod: "",
  customTrainingPeriod: "",
  theoryDuration: "",
  customTheoryDuration: "",
  practicalDuration: "",
  customPracticalDuration: "",
  workingUnder: "",
  hrmsId: "",
  pfNoNpsUps: "",
  employeeNumber: "",

  highestQualification: "",
  otherQualification: "",
  fieldOfStudy: "",
  customFieldOfStudy: "",
  institution: "",
  gradeType: "",
  gradeValue: "",

  batch: "",
  dateOfJoiningStcWtcNonRailway: "",
  dateOfSparing: "",
};

const WtcMain = () => {
  const [formData, setFormData] = useState(initialFormData);

  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const validationFunctions = useRef({});

  const steps = useMemo(
    () => ["Personal", "Contact", "Professional", "Course"],
    []
  );
  const icons = useMemo(() => ["👤", "📞", "💼", "📄"], []);

  const handleChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prevErrors) => {
      if (prevErrors[field]) {
        const { [field]: _, ...rest } = prevErrors;
        return rest;
      }
      return prevErrors;
    });
  }, []);

  const createChangeHandler = useCallback(
    (stepKey) => {
      const handler = (field, value) => handleChange(field, value);
      handler.setValidationFunction = (validationFn) => {
        validationFunctions.current[stepKey] = validationFn;
      };
      handler.updateErrors = setErrors;
      return handler;
    },
    [handleChange]
  );

  const changeHandlers = useMemo(
    () => ({
      personal: createChangeHandler("personal"),
      contact: createChangeHandler("contact"),
      professional: createChangeHandler("professional"),
      course: createChangeHandler("course"),
    }),
    [createChangeHandler]
  );

  const isStepValid = useCallback(() => {
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
  }, [step]);

  const handleNext = useCallback(() => {
    if (!isStepValid()) {
      alert("Please correct the validation errors before proceeding.");
      return;
    }
    if (step < steps.length - 1) setStep(step + 1);
  }, [isStepValid, step, steps.length]);

  const handleBack = useCallback(() => {
    if (step > 0) setStep(step - 1);
  }, [step]);

  const submitToAPI = useCallback(async (data) => {
    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (key === "picture" && value) {
          // The backend expects the file under the key 'image'
          formDataToSend.append("image", value);
        } else if (value !== null && value !== undefined && value !== "") {
          formDataToSend.append(key, value);
        }
      });

      const response = await fetch("/api/wtc", {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("API submission error:", error);
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        throw new Error(
          "Cannot connect to server. Please ensure the backend is running on port 5000"
        );
      }
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!isStepValid()) {
      alert("Please correct all validation errors before submitting.");
      return;
    }

    try {
      const result = await submitToAPI(formData);
      console.log("Submission successful:", result);
      alert(
        `Registration completed successfully! Ticket Number: ${result.ticketNumber}`
      );

      // Optional: Reset form after successful submission
      setFormData(initialFormData);
      setStep(0);
    } catch (error) {
      console.error("Submission failed:", error);
      alert(`Failed to submit registration: ${error.message}`);
    }
  }, [isStepValid, submitToAPI, formData]);

  const renderForm = useCallback(() => {
    const formComponents = [Personal, Contact, Professional, Course];
    const Component = formComponents[step];
    const handler = Object.values(changeHandlers)[step];

    return <Component formData={formData} onChange={handler} errors={errors} />;
  }, [step, formData, errors, changeHandlers]);

  return (
    <div className="max-w-6xl mx-auto my-7 px-4 sm:px-6 lg:px-8 animate-fadeIn">
      {/* Page Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          WTC Candidate Registration
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-orange-600 mx-auto rounded-full"></div>
      </div>

      {/* Step Navigation Bar */}
      <div className="flex justify-between items-center mb-8 bg-gray-800 rounded-2xl p-4">
        {steps.map((label, index) => (
          <div key={index} className="flex-1 text-center">
            <div
              className={`mx-auto mb-1 h-12 w-12 flex items-center justify-center rounded-full text-white font-bold
              ${step === index
                  ? "bg-orange-500"
                  : step > index
                    ? "bg-green-500"
                    : "bg-gray-500"
                }`}
            >
              {icons[index]}
            </div>
            <p
              className={`text-sm font-semibold ${step === index ? "text-white" : "text-gray-300"
                }`}
            >
              {label} Details
            </p>
          </div>
        ))}
      </div>

      {/* Form */}
      <div className="space-y-8">
        {renderForm()}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-8 mt-8 border-t border-gray-100">
          {step > 0 ? (
            <button
              type="button"
              onClick={handleBack}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300"
              disabled={isSubmitting}
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
            className={`px-6 py-3 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all duration-200 shadow-md ${isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-orange-500 hover:bg-orange-600"
              } text-white`}
          >
            {isSubmitting
              ? "Submitting..."
              : step === steps.length - 1
                ? "Submit Registration"
                : "Save and Next →"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WtcMain;
