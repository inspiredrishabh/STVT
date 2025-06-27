import React, { useState } from "react";
import Personal from "./Personal";
import Contact from "./Contact";
import Professional from "./Professional";
import Course from "./Course";

const STCMain = () => {
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
    employeeNo: "",
    hrmsId: "",
    pfNo: "",
    dateOfAppointment: "",
    modeOfAppointment: "",
    designation: "",
    unitDiv: "",
    workingUnder: "",
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
    ticketNo: "",
    batch: "",
    dateOfJoiningStcWtcNonRailway: "",
    dateOfSparing: "",
    moduleNo: "",
    courseDuration: "",
  });

  const [step, setStep] = useState(0);
  const steps = ["Personal", "Contact", "Professional", "Course"];
  const icons = ["👤", "📞", "💼", "📄"];

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const requiredFields = {
    0: ["name", "sex", "fatherName", "dob", "category", "nationality"],
    1: ["currentAddress", "permanentAddress", "phoneNumber", "emergencyContactNumber", "email"],
    2: ["dateOfAppointment", "modeOfAppointment", "designation", "unitDiv", "workingUnder", "employeeNo", "hrmsId", "pfNo"],
    3: ["ticketNo", "batch", "dateOfJoiningStcWtcNonRailway", "moduleNo", "courseDuration"]
  };

  const isStepValid = () => {
    return requiredFields[step].every((field) => {
      const value = formData[field];
      if (typeof value === "string") return value.trim() !== "";
      if (typeof value === "object" && value !== null) return true;
      return !!value;
    });
  };

  const handleNext = () => {
    if (!isStepValid()) {
      alert("Please fill in all required fields before proceeding.");
      return;
    }
    if (step < steps.length - 1) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleSubmit = () => {
    if (!isStepValid()) {
      alert("Please fill in all required fields before submitting.");
      return;
    }
    console.log("Final Submitted Data:", formData);
    alert("All details saved successfully.");
  };

  const renderForm = () => {
    switch (step) {
      case 0:
        return <Personal formData={formData} onChange={handleChange} />;
      case 1:
        return <Contact formData={formData} onChange={handleChange} />;
      case 2:
        return <Professional formData={formData} onChange={handleChange} />;
      case 3:
        return <Course formData={formData} onChange={handleChange} />;
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
              ${step === index ? "bg-orange-500" : step > index ? "bg-green-500" : "bg-gray-500"}`}>
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
            className="px-6 py-3 bg-pink-500 text-white rounded-xl hover:bg-pink-700 focus:outline-none focus:ring-4 focus:ring-pink-200 transition-all duration-200 shadow-md"
          >
            {step === steps.length - 1 ? "Save All Details" : "Save and Next →"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default STCMain;
