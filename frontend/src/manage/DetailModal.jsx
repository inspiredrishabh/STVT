import React from "react";
import {
  X,
  User,
  BookOpen,
  Briefcase,
  Phone,
  GraduationCap,
} from "lucide-react";

const DetailModal = ({ candidate, onClose }) => {
  if (!candidate) return null;

  const designation =
    candidate.designation === "Other"
      ? candidate.designationOther
      : candidate.designation;

  // Helper function to get basic information data based on candidate type
  const getBasicInfoData = () => {
    // Date se time hataane wala function
    const formatDate = (dateStr) => {
      if (!dateStr) return "";
      // Agar "T" hai (ISO format) toh split karo
      if (dateStr.includes("T")) {
        return dateStr.split("T")[0];
      }
      // Agar space hai (normal format) toh split karo
      if (dateStr.includes(" ")) {
        return dateStr.split(" ")[0];
      }
      // Nahi toh as is return karo
      return dateStr;
    };
    const basicData = [
      { label: "S.No", value: candidate.serialNo },
      { label: "Gender", value: candidate.sex },
      { label: "Father's Name", value: candidate.fatherName },
      { label: "Mother's Name", value: candidate.motherName },
      { label: "DOB", value: formatDate(candidate.dob) },
      {
        label: "Employee No.",
        value: candidate.ticketNumber || candidate.employeeNumber,
      },
      { label: "Category", value: candidate.category },
      { label: "Nationality", value: candidate.nationality },
      { label: "PWD", value: candidate.pwd },
      {
        label: "Joining Date",
        value: formatDate(candidate.dateOfJoiningStcWtcNonRailway),
      },
      { label: "Sparing Date", value: formatDate(candidate.dateOfSparing) },
    ];

    // Add type of disability if PWD is Yes
    if (candidate.pwd === "Yes" && candidate.typeOfDisability) {
      basicData.push({
        label: "Type of Disability",
        value: candidate.typeOfDisability,
      });
    }

    return basicData;
  };


  // Helper function to get course information data based on candidate type
  const getCourseInfoData = () => {
    const courseData = [
      {
        label: "Ticket No.",
        value:
          candidate.ticketNumber ||
          candidate.ticketNo ||
          candidate.employeeNumber,
      },
      { label: "Batch", value: candidate.batch },
      { label: "Stream", value: candidate.stream },
      { label: "Type", value: candidate.type },
    ];

    // Add type-specific course information
    if (candidate.type === "STC") {
      courseData.push(
        { label: "Module No.", value: candidate.moduleNo },
        // { label: "Module Name", value: candidate.moduleName },
        { label: "Course Duration", value: candidate.courseDuration },
        // { label: "Station Code", value: candidate.stationCode }
      );
    } else if (candidate.type === "WTC") {
      courseData.push(
        { label: "Course Type", value: candidate.courseType },
        { label: "Training Period", value: candidate.trainingPeriod },
        {
          label: "Custom Training Period",
          value: candidate.customTrainingPeriod,
        },
        { label: "Theory Duration", value: candidate.theoryDuration },
        {
          label: "Custom Theory Duration",
          value: candidate.customTheoryDuration,
        },
        { label: "Practical Duration", value: candidate.practicalDuration },
        {
          label: "Custom Practical Duration",
          value: candidate.customPracticalDuration,
        },
        { label: "Course Coordinator", value: candidate.courseCoordinator }
      );
    } else if (candidate.type === "Non Railway") {
      courseData
        .push
        // { label: "Course Type", value: candidate.courseType },
        // { label: "Duration", value: candidate.duration },
        // { label: "Theory", value: candidate.theory },
        // { label: "Practical", value: candidate.practical },
        // { label: "Module No.", value: candidate.moduleNo },
        // { label: "Course Coordinator", value: candidate.courseCoordinator },
        // { label: "Remarks", value: candidate.remarks }
        ();
    }

    return courseData;
  };

  // Helper function to get work information data based on candidate type
  const getWorkInfoData = () => {
    const workData = [
      {
        label: "Designation",
        value: candidate.workInfo || candidate.designation,
      },
      { label: "Unit", value: candidate.unit },
      { label: "Working Under", value: candidate.workingUnder },
    ];

    // Add designation other for WTC if exists
    if (candidate.type === "WTC" && candidate.designationOther) {
      workData.push({
        label: "Designation Other",
        value: candidate.designationOther,
      });
    }

    if (candidate.type === "Non Railway") {
      workData.push(
        { label: "Course Type", value: candidate.courseType }
        // { label: "Duration", value: candidate.duration },
        // { label: "Theory", value: candidate.theory },
        // { label: "Practical", value: candidate.practical }
      );
    } else if (candidate.type === "STC" || candidate.type === "WTC") {
      workData.push(
        { label: "HRMS ID", value: candidate.hrmsId },
        { label: "PF No/NPS/UPS", value: candidate.pfNoNpsUps },
        { label: "Employee Number", value: candidate.employeeNumber },
        { label: "Appt. Mode", value: candidate.modeOfAppointment },
        { label: "Appt. Date", value: candidate.dateOfAppointmentInRailway }
      );
    }

    // Add station code for STC
    // if (candidate.type === "STC") {
    //   workData.push({ label: "Station Code", value: candidate.stationCode });
    // }

    return workData;
  };

  // Helper function to get education information data based on candidate type
  const getEducationInfoData = () => {
    const educationData = [
      { label: "Qualification", value: candidate.highestQualification },
      { label: "Field of Study", value: candidate.fieldOfStudy },
      { label: "Institution", value: candidate.institution },
      { label: "Grade Type", value: candidate.gradeType },
      { label: "Grade/Score", value: candidate.gradeValue },
    ];

    // Add custom field of study for WTC if exists
    if (candidate.type === "WTC" && candidate.customFieldOfStudy) {
      educationData.push({
        label: "Custom Field of Study",
        value: candidate.customFieldOfStudy,
      });
    }

    return educationData;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-4">
            <img
              src={`http://localhost:5000/${candidate.picture}`}
              alt={candidate.name}
              className="w-16 h-16 rounded-2xl object-cover shadow-lg"
            />
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {candidate.name}
              </h3>
              <p className="text-gray-600">{designation}</p>
              <p className="text-sm text-blue-600 font-medium">
                {candidate.type} Candidate
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <InfoSection
              icon={User}
              title="Basic Information"
              data={getBasicInfoData()}
            />
            <InfoSection
              icon={BookOpen}
              title="Course Information"
              data={getCourseInfoData()}
            />
            <InfoSection
              icon={Briefcase}
              title="Work Information"
              data={getWorkInfoData()}
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <InfoSection
              icon={GraduationCap}
              title="Education"
              data={getEducationInfoData()}
            />
            <InfoSection
              icon={Phone}
              title="Contact Information"
              data={[
                { label: "Phone", value: candidate.phoneNumber },
                { label: "Email", value: candidate.email },
                {
                  label: "Emergency Contact",
                  value: candidate.emergencyContactNumber,
                },
                {
                  label: "Permanent Address",
                  value: candidate.permanentAddress,
                  fullWidth: true,
                },
                {
                  label: "Current Address",
                  value: candidate.currentAddress,
                  fullWidth: true,
                },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoSection = ({ title, icon: Icon, data }) => (
  <div className="bg-gray-50 rounded-2xl p-4 h-full">
    <h5 className="font-semibold text-gray-800 flex items-center mb-4">
      <Icon className="h-5 w-5 mr-2 text-blue-500" />
      {title}
    </h5>
    <div className="space-y-3 text-sm">
      {data.map(({ label, value, fullWidth }) => (
        <div
          key={label}
          className={`flex ${
            fullWidth ? "flex-col items-start" : "justify-between items-center"
          }`}
        >
          <span className="font-medium text-gray-600 whitespace-nowrap">
            {label}:
          </span>
          <span className={`text-gray-800 ${!fullWidth && "text-right pl-2"}`}>
            {value || "N/A"}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export default DetailModal;
