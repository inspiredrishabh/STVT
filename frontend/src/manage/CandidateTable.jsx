import React, { useState } from "react";
import {
  Users,
  Eye,
  Edit,
  Trash2,
  Briefcase,
  Zap,
  Save,
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building,
} from "lucide-react";

const CandidateTable = ({ candidates, onViewDetail, onDelete, onUpdate, canEditDelete = true }) => {
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [editImageFile, setEditImageFile] = useState(null);

  if (candidates.length === 0) {
    return <EmptyState />;
  }

  const handleEditClick = (candidate) => {
    // Check permissions before allowing comprehensive edit
    if (!canEditDelete) {
      return; // Do nothing if user doesn't have edit permissions
    }
    // For comprehensive editing, open modal
    setEditFormData({ ...candidate });
    setShowEditModal(true);
  };

  const handleInlineEditClick = (candidate) => {
    // Check permissions before allowing inline edit
    if (!canEditDelete) {
      return; // Do nothing if user doesn't have edit permissions
    }
    // For quick inline editing
    setEditingCandidate(candidate.id);
    setEditFormData({ ...candidate });
  };

  const handleSaveEdit = async () => {
    if (onUpdate) {
      await onUpdate(editingCandidate, editFormData);
    }
    setEditingCandidate(null);
    setEditFormData({});
  };

  const handleModalSave = async () => {
    if (onUpdate && editFormData.id) {
      // If an image file is selected, pass it as 'image'
      let updateData = { ...editFormData };
      if (editImageFile) {
        updateData.image = editImageFile;
      }
      await onUpdate(editFormData.id, updateData);
    }
    setShowEditModal(false);
    setEditFormData({});
    setEditImageFile(null);
  };

  const handleCancelEdit = () => {
    setEditingCandidate(null);
    setEditFormData({});
  };

  const handleModalCancel = () => {
    setShowEditModal(false);
    setEditFormData({});
  };

  const handleInputChange = (field, value) => {
    setEditFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  if (candidates.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
        <TableHeader />
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                {["Candidate", "Course Info", "Work Info", "Actions"].map(
                  (header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {candidates.map((candidate) => (
                <CandidateRow
                  key={candidate.id}
                  candidate={candidate}
                  onViewDetail={onViewDetail}
                  onDelete={onDelete}
                  onEdit={handleEditClick}
                  onInlineEdit={handleInlineEditClick}
                  isEditing={editingCandidate === candidate.id}
                  editFormData={editFormData}
                  onInputChange={handleInputChange}
                  onSaveEdit={handleSaveEdit}
                  onCancelEdit={handleCancelEdit}
                  canEditDelete={canEditDelete}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Comprehensive Edit Modal */}
      {showEditModal && canEditDelete && (
        <EditCandidateModal
          candidate={editFormData}
          onSave={handleModalSave}
          onCancel={handleModalCancel}
          onInputChange={handleInputChange}
          onImageChange={setEditImageFile}
          canEditDelete={canEditDelete}
        />
      )}
    </>
  );
};

const TableHeader = () => (
  <div className="bg-white px-6 py-4 border-b border-gray-200">
    <div className="flex items-center space-x-3">
      <div className="p-2 bg-blue-600 rounded-lg">
        <Users className="h-5 w-5 text-white" />
      </div>
      <h3 className="text-lg font-semibold text-gray-800">
        Candidate Directory
      </h3>
    </div>
  </div>
);

const CandidateRow = ({
  candidate,
  onViewDetail,
  onDelete,
  onEdit,
  onInlineEdit,
  isEditing,
  editFormData,
  onInputChange,
  onSaveEdit,
  onCancelEdit,
  canEditDelete = true,
}) => {
  if (isEditing) {
    return (
      <EditableCandidateRow
        candidate={candidate}
        editFormData={editFormData}
        onInputChange={onInputChange}
        onSaveEdit={onSaveEdit}
        onCancelEdit={onCancelEdit}
        canEditDelete={canEditDelete}
      />
    );
  }

  return (
    <tr className="hover:bg-gray-50 transition-colors duration-200">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-4">
          <img
            src={`http://${import.meta.env.VITE_BACKEND_IP}:5000/${
              candidate.picture
            }`}
            alt={candidate.name}
            className="w-12 h-12 rounded-lg object-cover border border-gray-200"
          />
          <div>
            <div className="text-sm font-bold text-gray-800">
              {candidate.name}
            </div>
            <div className="text-xs text-gray-500">
              Ticket No: {candidate.ticketNumber || candidate.employeeNumber}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-2 text-sm text-gray-800 font-medium">
          <Briefcase className="h-4 w-4 text-green-600" />
          <span>{candidate.stream}</span>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Batch: {candidate.batch}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-2 text-sm text-gray-800 font-medium">
          <Zap className="h-4 w-4 text-purple-600" />
          <span>{candidate.workInfo}</span>
        </div>
        <div className="text-xs text-gray-500 mt-1">Type: {candidate.type}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex space-x-2">
          <ActionButton
            onClick={() => onViewDetail(candidate)}
            icon={Eye}
            className="text-blue-600 hover:bg-blue-100 border-blue-200"
            title="View Details"
          />
          {canEditDelete && (
            <>
              <ActionButton
                onClick={() => onEdit(candidate)}
                icon={Edit}
                className="text-green-600 hover:bg-green-100 border-green-200"
                title="Edit All Details"
              />
              <ActionButton
                onClick={() => onDelete(candidate.id, candidate.name)}
                icon={Trash2}
                className="text-red-600 hover:bg-red-100 border-red-200"
                title="Delete"
              />
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

const EditableCandidateRow = ({
  candidate,
  editFormData,
  onInputChange,
  onSaveEdit,
  onCancelEdit,
  canEditDelete = true,
}) => (
  <tr className="bg-blue-50 border-y-2 border-blue-300">
    <td className="px-6 py-4">
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <User className="h-4 w-4 text-gray-500" />
          <input
            type="text"
            value={editFormData.name || ""}
            onChange={(e) => onInputChange("name", e.target.value)}
            className="text-sm font-semibold bg-white border border-gray-300 rounded-md px-2 py-1 flex-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Full Name"
            disabled={!canEditDelete}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Mail className="h-4 w-4 text-gray-500" />
          <input
            type="email"
            value={editFormData.email || ""}
            onChange={(e) => onInputChange("email", e.target.value)}
            className="text-xs bg-white border border-gray-300 rounded-md px-2 py-1 flex-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Email Address"
            disabled={!canEditDelete}
          />
        </div>
      </div>
    </td>
    <td className="px-6 py-4">
      <div className="space-y-2">
        <input
          type="text"
          value={editFormData.batch || ""}
          onChange={(e) => onInputChange("batch", e.target.value)}
          className="w-full text-sm bg-white border border-gray-300 rounded-md px-2 py-1 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Batch"
          disabled={!canEditDelete}
        />
      </div>
    </td>
    <td className="px-6 py-4">
      <div className="space-y-2">
        <select
          value={editFormData.workInfo || ""}
          onChange={(e) => onInputChange("workInfo", e.target.value)}
          className="w-full text-sm bg-white border border-gray-300 rounded-md px-2 py-1 focus:ring-blue-500 focus:border-blue-500"
          disabled={!canEditDelete}
        >
          <option value="">Select Work Info</option>
          <option value="ASE">ASE</option>
          <option value="AJE">AJE</option>
          <option value="IJE">IJE</option>
          <option value="RJE">RJE</option>
          <option value="RCW">RCW</option>
          <option value="RD">RD</option>
          <option value="TS">TS</option>
          <option value="LHI">LHI</option>
          <option value="LHII">LHII</option>
          <option value="FM">FM</option>
          <option value="WT">WT</option>
          <option value="DM">DM</option>
          <option value="WE">WE</option>
          <option value="NDT">NDT</option>
          <option value="EA">EA</option>
          <option value="3DMP">3DMP</option>
        </select>
        <select
          value={editFormData.type || ""}
          onChange={(e) => {
            // Set both type and category based on selection
            const type = e.target.value;
            onInputChange("type", type);
            // Set category based on type
            if (type === "STC" || type === "WTC") {
              onInputChange("category", "Railway");
            } else if (type === "Non Railway") {
              onInputChange("category", "Non Railway");
            }
          }}
          className="w-full text-xs bg-white border border-gray-300 rounded-md px-2 py-1 focus:ring-blue-500 focus:border-blue-500"
          disabled={!canEditDelete}
        >
          <option value="">Select Type</option>
          <option value="STC">STC</option>
          <option value="WTC">WTC</option>
          <option value="Non Railway">Non Railway</option>
        </select>
      </div>
    </td>
    <td className="px-6 py-4">
      <select
        value={editFormData.status || ""}
        onChange={(e) => onInputChange("status", e.target.value)}
        className="w-full text-sm bg-white border border-gray-300 rounded-md px-2 py-1 focus:ring-blue-500 focus:border-blue-500"
        disabled={!canEditDelete}
      >
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
        <option value="Completed">Completed</option>
        <option value="Suspended">Suspended</option>
      </select>
    </td>
    <td className="px-6 py-4">
      <div className="flex space-x-2">
        {canEditDelete ? (
          <>
            <ActionButton
              onClick={onSaveEdit}
              icon={Save}
              className="text-green-600 hover:bg-green-100 border-green-200"
              title="Save Changes"
            />
            <ActionButton
              onClick={onCancelEdit}
              icon={X}
              className="text-red-600 hover:bg-red-100 border-red-200"
              title="Cancel Edit"
            />
          </>
        ) : (
          <span className="text-sm text-gray-500 px-3 py-2">View Only</span>
        )}
      </div>
    </td>
  </tr>
);

const Badge = ({ text, className }) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}
  >
    {text}
  </span>
);

const ActionButton = ({ onClick, icon: Icon, className, title }) => (
  <button
    onClick={onClick}
    className={`p-2 rounded-lg transition-all duration-200 border ${className}`}
    title={title}
  >
    <Icon className="h-5 w-5" />
  </button>
);

const EmptyState = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200">
    <TableHeader />
    <div className="text-center py-16 px-6">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Users className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-700 mb-2">
        No candidates found
      </h3>
      <p className="text-gray-500 text-sm">
        Try adjusting your search criteria or changing the candidate type.
      </p>
    </div>
  </div>
);

// Helper function to get course-specific fields based on candidate type
const getCourseFields = (candidate) => {
  const commonCourseFields = [
    {
      label: "Stream",
      field: "stream",
      type: "select",
      value: candidate.stream,
      options: ["Railway", "Non Railway"],
    },
    {
      label: "Type",
      field: "type",
      type: "select",
      value: candidate.type,
      options: ["STC", "WTC", "Non Railway"],
    },
    {
      label: "Work Info",
      field: "workInfo",
      type: "select",
      value: candidate.workInfo,
      options: [
        "ASE",
        "AJE",
        "IJE",
        "RJE",
        "RCW",
        "RD",
        "TS",
        "LHI",
        "LHII",
        "FM",
        "WT",
        "DM",
        "WE",
        "NDT",
        "EA",
        "3DMP",
      ],
    },
    { label: "Batch", field: "batch", type: "text", value: candidate.batch },
    {
      label: "Joining Date",
      field: "dateOfJoiningStcWtcNonRailway",
      type: "date",
      value: candidate.dateOfJoiningStcWtcNonRailway,
    },
    {
      label: "Sparing Date",
      field: "dateOfSparing",
      type: "date",
      value: candidate.dateOfSparing,
    },
  ];

  // Add type-specific fields
  if (candidate.type === "STC") {
    return [
      ...commonCourseFields,
      {
        label: "Module No.",
        field: "moduleNo",
        type: "text",
        value: candidate.moduleNo,
      },
      {
        label: "Course Duration",
        field: "courseDuration",
        type: "text",
        value: candidate.courseDuration,
      },
    ];
  } else if (candidate.type === "WTC") {
    return [
      ...commonCourseFields,
      {
        label: "Course Type",
        field: "courseType",
        type: "text",
        value: candidate.courseType,
      },
      {
        label: "Training Period",
        field: "trainingPeriod",
        type: "text",
        value: candidate.trainingPeriod,
      },
      {
        label: "Theory Duration",
        field: "theoryDuration",
        type: "text",
        value: candidate.theoryDuration,
      },
      {
        label: "Practical Duration",
        field: "practicalDuration",
        type: "text",
        value: candidate.practicalDuration,
      },
      {
        label: "Course Coordinator",
        field: "courseCoordinator",
        type: "text",
        value: candidate.courseCoordinator,
      },
    ];
  } else if (candidate.type === "Non Railway") {
    return [
      ...commonCourseFields,
      {
        label: "Course Type",
        field: "courseType",
        type: "text",
        value: candidate.courseType,
      },
      {
        label: "Duration",
        field: "duration",
        type: "text",
        value: candidate.duration,
      },
      {
        label: "Theory",
        field: "theory",
        type: "text",
        value: candidate.theory,
      },
      {
        label: "Practical",
        field: "practical",
        type: "text",
        value: candidate.practical,
      },
      {
        label: "Module No.",
        field: "moduleNo",
        type: "text",
        value: candidate.moduleNo,
      },
      {
        label: "Remarks",
        field: "remarks",
        type: "textarea",
        value: candidate.remarks,
      },
      {
        label: "Course Coordinator",
        field: "courseCoordinator",
        type: "text",
        value: candidate.courseCoordinator,
      },
    ];
  }

  return commonCourseFields;
};

// Helper function to get professional fields based on candidate type
const getProfessionalFields = (candidate) => {
  const commonProfessionalFields = [
    {
      label: "Employee Number",
      field: "employeeNumber",
      type: "text",
      value: candidate.employeeNumber,
    },
    {
      label: "Ticket Number",
      field: "ticketNumber",
      type: "text",
      value: candidate.ticketNumber,
    },
    {
      label: "Designation",
      field: "designation",
      type: "text",
      value: candidate.designation,
    },
    { label: "Unit", field: "unit", type: "text", value: candidate.unit },
    {
      label: "Working Under",
      field: "workingUnder",
      type: "text",
      value: candidate.workingUnder,
    },
  ];

  // Add type-specific professional fields
  if (candidate.type === "STC" || candidate.type === "WTC") {
    const railwayFields = [
      ...commonProfessionalFields,
      {
        label: "HRMS ID",
        field: "hrmsId",
        type: "text",
        value: candidate.hrmsId,
      },
      {
        label: "PF No/NPS/UPS",
        field: "pfNoNpsUps",
        type: "text",
        value: candidate.pfNoNpsUps,
      },
      {
        label: "Appointment Date",
        field: "dateOfAppointmentInRailway",
        type: "date",
        value: candidate.dateOfAppointmentInRailway,
      },
      {
        label: "Mode of Appointment",
        field: "modeOfAppointment",
        type: "text",
        value: candidate.modeOfAppointment,
      },
    ];

    // Add station code specifically for STC candidates
    if (candidate.type === "STC") {
      railwayFields.push({
        label: "Station Code",
        field: "stationCode",
        type: "text",
        value: candidate.stationCode,
      });
    }

    return railwayFields;
  } else if (candidate.type === "Non Railway") {
    return [
      ...commonProfessionalFields,
      {
        label: "Remarks",
        field: "remarks",
        type: "textarea",
        value: candidate.remarks,
      },
    ];
  }

  return commonProfessionalFields;
};

// Helper function to get educational fields based on candidate type
const getEducationalFields = (candidate) => {
  const commonEducationalFields = [
    {
      label: "Highest Qualification",
      field: "highestQualification",
      type: "text",
      value: candidate.highestQualification,
    },
    {
      label: "Field of Study",
      field: "fieldOfStudy",
      type: "text",
      value: candidate.fieldOfStudy,
    },
    {
      label: "Institution",
      field: "institution",
      type: "text",
      value: candidate.institution,
    },
    {
      label: "Grade/Score",
      field: "gradeValue",
      type: "text",
      value: candidate.gradeValue,
    },
  ];

  // Add WTC-specific educational fields
  if (candidate.type === "WTC") {
    return [
      ...commonEducationalFields,
      {
        label: "Custom Field of Study",
        field: "customFieldOfStudy",
        type: "text",
        value: candidate.customFieldOfStudy,
      },
    ];
  }

  return commonEducationalFields;
};

// Comprehensive Edit Modal Component
const EditCandidateModal = ({
  candidate,
  onSave,
  onCancel,
  onInputChange,
  onImageChange,
  canEditDelete = true,
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-gray-300 shadow-xl">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 flex items-center justify-between flex-shrink-0 bg-gray-50">
        <div className="flex items-center space-x-4">
          <Edit className="h-6 w-6 text-blue-600" />
          <div>
            <h3 className="text-xl font-bold text-gray-800">
              Edit Candidate Details
            </h3>
            <p className="text-gray-500 text-sm">
              Update all candidate information
            </p>
          </div>
        </div>
        <button
          onClick={onCancel}
          className="p-2 text-gray-500 hover:text-gray-800 rounded-full hover:bg-gray-200 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Content */}
      <div className="p-8 space-y-8 overflow-y-auto flex-1 bg-gray-50/50">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Personal Information */}
          <EditSection
            title="Personal Information"
            icon={User}
            fields={[
              // --- Add Profile Image field at the top ---
              {
                label: "Profile Image",
                field: "picture",
                type: "file",
                value: candidate.picture,
                onFileChange: onImageChange,
              },
              {
                label: "Full Name",
                field: "name",
                type: "text",
                value: candidate.name,
              },
              {
                label: "Father's Name",
                field: "fatherName",
                type: "text",
                value: candidate.fatherName,
              },
              {
                label: "Mother's Name",
                field: "motherName",
                type: "text",
                value: candidate.motherName,
              },
              {
                label: "Gender",
                field: "sex",
                type: "select",
                value: candidate.sex,
                options: ["Male", "Female", "Other"],
              },
              {
                label: "Date of Birth",
                field: "dob",
                type: "date",
                value: candidate.dob,
              },
              {
                label: "Category",
                field: "category",
                type: "select",
                value: candidate.category,
                options: ["General", "OBC", "SC", "ST", "EWS"],
              },
              {
                label: "Nationality",
                field: "nationality",
                type: "text",
                value: candidate.nationality,
              },
              {
                label: "PWD",
                field: "pwd",
                type: "select",
                value: candidate.pwd,
                options: ["Yes", "No"],
              },
              {
                label: "Type of Disability",
                field: "typeOfDisability",
                type: "text",
                value: candidate.typeOfDisability,
              },
            ]}
            candidate={candidate}
            onInputChange={onInputChange}
          />

          {/* Contact Information */}
          <EditSection
            title="Contact Information"
            icon={Phone}
            fields={[
              {
                label: "Phone Number",
                field: "phoneNumber",
                type: "tel",
                value: candidate.phoneNumber,
              },
              {
                label: "Email Address",
                field: "email",
                type: "email",
                value: candidate.email,
              },
              {
                label: "Emergency Contact",
                field: "emergencyContactNumber",
                type: "tel",
                value: candidate.emergencyContactNumber,
              },
              {
                label: "Current Address",
                field: "currentAddress",
                type: "textarea",
                value: candidate.currentAddress,
              },
              {
                label: "Permanent Address",
                field: "permanentAddress",
                type: "textarea",
                value: candidate.permanentAddress,
              },
            ]}
            candidate={candidate}
            onInputChange={onInputChange}
            canEditDelete={canEditDelete}
          />

          {/* Professional Information */}
          <EditSection
            title="Professional Information"
            icon={Briefcase}
            fields={getProfessionalFields(candidate)}
            candidate={candidate}
            onInputChange={onInputChange}
            canEditDelete={canEditDelete}
          />

          {/* Course Information */}
          <EditSection
            title="Course Information"
            icon={Building}
            fields={getCourseFields(candidate)}
            candidate={candidate}
            onInputChange={onInputChange}
            canEditDelete={canEditDelete}
          />

          {/* Educational Information */}
          <EditSection
            title="Educational Information"
            icon={Calendar}
            fields={getEducationalFields(candidate)}
            candidate={candidate}
            onInputChange={onInputChange}
            canEditDelete={canEditDelete}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 bg-white border-t border-gray-200 flex justify-end space-x-4 flex-shrink-0">
        <button
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors font-medium"
        >
          {canEditDelete ? 'Cancel' : 'Close'}
        </button>
        {canEditDelete && (
          <button
            onClick={onSave}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2 font-medium"
          >
            <Save className="h-4 w-4" />
            <span>Save Changes</span>
          </button>
        )}
      </div>
    </div>
  </div>
);

// Edit Section Component
const EditSection = ({
  title,
  icon: Icon,
  fields,
  candidate,
  onInputChange,
  canEditDelete = true,
}) => {
  // --- Add local state for image file name ---
  const [selectedFileName, setSelectedFileName] = useState("");

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
      <h5 className="font-semibold text-gray-700 flex items-center mb-6 text-base">
        <Icon className="h-5 w-5 mr-3 text-blue-600" />
        {title}
      </h5>
      <div className="space-y-4">
        {fields.map(({ label, field, type, value, options, onFileChange }) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              {label}
            </label>
            {type === "file" ? (
              <div>
                <label
                  htmlFor={`profile-image-input-${field}`}
                  className="block w-full"
                >
                  <span
                    className="block w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-100 text-gray-700 text-sm cursor-pointer transition hover:bg-gray-200"
                    style={{
                      fontFamily: "inherit",
                      fontWeight: 400,
                      textAlign: "left",
                    }}
                  >
                    <span id={`profile-image-input-label-${field}`}>
                      Choose File
                      <span className="ml-2 text-gray-500">
                        {selectedFileName ? selectedFileName : "No file chosen"}
                      </span>
                    </span>
                    <input
                      id={`profile-image-input-${field}`}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (onFileChange) onFileChange(e.target.files[0]);
                        setSelectedFileName(e.target.files[0]?.name || "");
                      }}
                      className="hidden"
                      disabled={!canEditDelete}
                    />
                  </span>
                </label>
                {value && typeof value === "string" && (
                  <img
                    src={`http://${
                      import.meta.env.VITE_BACKEND_IP
                    }:5000/${value}`}
                    alt="Current"
                    className="mt-2 w-16 h-16 rounded object-cover border"
                  />
                )}
              </div>
            ) : type === "select" ? (
              <select
                value={value || ""}
                onChange={(e) => onInputChange(field, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                disabled={!canEditDelete}
              >
                <option value="">Select {label}</option>
                {options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : type === "textarea" ? (
              <textarea
                value={value || ""}
                onChange={(e) => onInputChange(field, e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder={`Enter ${label.toLowerCase()}`}
                disabled={!canEditDelete}
              />
            ) : (
              <input
                type={type}
                value={value || ""}
                onChange={(e) => onInputChange(field, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder={`Enter ${label.toLowerCase()}`}
                disabled={!canEditDelete}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CandidateTable;
