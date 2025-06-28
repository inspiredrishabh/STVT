import React from 'react';
import { X, User, BookOpen, Briefcase, Phone, GraduationCap } from 'lucide-react';

const DetailModal = ({ candidate, onClose }) => {
  if (!candidate) return null;

  const designation = candidate.designation === 'Other' ? candidate.designationOther : candidate.designation;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-4">
            <img src={candidate.picture} alt={candidate.name} className="w-16 h-16 rounded-2xl object-cover shadow-lg" />
            <div>
              <h3 className="text-xl font-bold text-gray-900">{candidate.name}</h3>
              <p className="text-gray-600">{designation}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <InfoSection icon={User} title="Basic Information" data={[
              { label: "S.No", value: candidate.serialNo },
              { label: "Gender", value: candidate.sex },
              { label: "Father's Name", value: candidate.fatherName },
              { label: "DOB", value: candidate.dob },
              { label: "Employee No.", value: candidate.ticketNumber || candidate.employeeNumber },
              { label: "Category", value: candidate.category },
              { label: "Joining Date", value: candidate.dateOfJoiningStcWtcNonRailway },
              { label: "Sparing Date", value: candidate.dateOfSparing },
            ]} />
            <InfoSection icon={BookOpen} title="Course Information" data={[
              { label: "Ticket No.", value: candidate.ticketNumber || candidate.ticketNo || candidate.employeeNumber },
              { label: "Batch", value: candidate.batch },
              { label: "Stream", value: candidate.stream },
              { label: "Module No.", value: candidate.moduleNo },
              { label: "Module Name", value: candidate.moduleName },
              { label: "Duration", value: candidate.courseDuration },
            ]} />
            <InfoSection icon={Briefcase} title="Work Information" data={[
              { label: "Unit", value: candidate.unit },
              { label: "Working Under", value: candidate.workingUnder },
              { label: "Station Code", value: candidate.stationCode },
              { label: "Appt. Mode", value: candidate.modeOfAppointment },
              { label: "Appt. Date", value: candidate.dateOfAppointmentInRailway },
            ]} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <InfoSection icon={GraduationCap} title="Education" data={[
              { label: "Qualification", value: candidate.highestQualification },
              { label: "Field of Study", value: candidate.fieldOfStudy },
              { label: "Institution", value: candidate.institution },
              { label: "Graduation Year", value: candidate.yearOfGraduation },
              { label: "Grade/Score", value: candidate.gradeValue },
            ]} />
            <InfoSection icon={Phone} title="Contact Information" data={[
              { label: "Phone", value: candidate.phoneNumber },
              { label: "Email", value: candidate.email },
              { label: "Emergency Contact", value: candidate.emergencyContactNumber },
              { label: "Permanent Address", value: candidate.permanentAddress, fullWidth: true },
              { label: "Current Address", value: candidate.currentAddress, fullWidth: true },
            ]} />
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
        <div key={label} className={`flex ${fullWidth ? 'flex-col items-start' : 'justify-between items-center'}`}>
          <span className="font-medium text-gray-600 whitespace-nowrap">{label}:</span>
          <span className={`text-gray-800 ${!fullWidth && 'text-right pl-2'}`}>{value || 'N/A'}</span>
        </div>
      ))}
    </div>
  </div>
);

export default DetailModal;