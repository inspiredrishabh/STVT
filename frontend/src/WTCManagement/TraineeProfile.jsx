import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Edit,
  Eye,
  Users,
  Phone,
  Mail,
  MapPin,
  Calendar,
  GraduationCap,
  Award,
  FileText,
  Plus,
  Settings,
  Hash,
  Download,
  Printer,
  ChevronDown,
} from "lucide-react";

const TraineeProfile = () => {
  const navigate = useNavigate();
  const [trainees, setTrainees] = useState([]);
  const [filteredTrainees, setFilteredTrainees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);

  // Fetch trainees from backend
  useEffect(() => {
    fetchTrainees();
  }, []);

  const fetchTrainees = async () => {
    try {
      setLoading(true);
      // Replace with your actual API endpoint
      const response = await fetch("/api/wtc");
      if (!response.ok) throw new Error("Failed to fetch trainees");
      const data = await response.json();
      const traineeArray = Array.isArray(data.data) ? data.data : [];
      setTrainees(traineeArray);
      setFilteredTrainees(traineeArray);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const formatDateDDMMYYYY = (dateStr) => {
    if (!dateStr) return "Not specified";
    const date = new Date(dateStr);
    if (isNaN(date)) return "Not specified";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Search functionality
  useEffect(() => {
    const filtered = trainees.filter(
      (trainee) =>
        trainee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trainee.ticketNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (trainee.designation &&
          trainee.designation
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        (trainee.designationOther &&
          trainee.designationOther
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        (trainee.unit &&
          trainee.unit.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (trainee.unitOther &&
          trainee.unitOther.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (trainee.moduleNo &&
          trainee.moduleNo.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredTrainees(filtered);
  }, [searchTerm, trainees]);

  // Handle edit trainee - redirect to manage candidate
  const handleEditTrainee = (trainee) => {
    try {
      // Store trainee ID in localStorage for manage candidate page
      localStorage.setItem("editTraineeId", trainee.id);
      localStorage.setItem("editTraineeName", trainee.name);

      // Navigate to manage candidate page
      navigate("/manage-candidate");
    } catch (error) {
      console.error("Error navigating to manage candidate:", error);
    }
  };

  const handleToggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading trainees...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Main Content */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Link
              to="/wtc"
              className="p-2 rounded-md bg-white shadow-sm hover:bg-gray-50"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Trainee Profiles
              </h1>
              <p className="text-sm text-gray-500">
                View, search, and manage trainee records.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigate("/wtc-form")}
              className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Trainee
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6 border border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-grow max-w-xl w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, ticket number, designation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">
                Total Trainees: {filteredTrainees.length}
              </span>
            </div>
          </div>
        </div>

        {/* Trainees Table */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">
              Error: Could not load trainee data. {error}
            </p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="w-12 px-6"></th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Trainee
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Designation & Unit
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTrainees.map((trainee) => (
                  <React.Fragment key={trainee.id}>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleRow(trainee.id)}
                          className="p-1 rounded-full hover:bg-gray-200"
                        >
                          <ChevronDown
                            className={`w-5 h-5 text-gray-500 transition-transform ${expandedRow === trainee.id ? "rotate-180" : ""
                              }`}
                          />
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {trainee.picture ? (
                              <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={`http://${import.meta.env.VITE_BACKEND_IP
                                  }:5000/${trainee.picture}`}
                                alt={trainee.name}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                                {trainee.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {trainee.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              Ticket: {trainee.ticketNo}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="font-medium text-gray-800">
                          {trainee.designation ||
                            trainee.designationOther ||
                            "N/A"}
                        </div>
                        <div>
                          {trainee.unit || trainee.unitOther || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEditTrainee(trainee)}
                            className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-100 rounded-md"
                            title="Manage Trainee"
                          >
                            <Settings className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => navigate(`/wtc/certificate/`)}
                            className="p-2 text-green-600 hover:text-green-900 hover:bg-green-100 rounded-md"
                            title="Generate Certificate"
                          >
                            <FileText className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => navigate("/wtc/Letter/")}
                            className="p-2 text-purple-600 hover:text-purple-900 hover:bg-purple-100 rounded-md"
                            title="Generate Letter"
                          >
                            <Mail className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedRow === trainee.id && (
                      <tr className="bg-gray-50">
                        <td colSpan="4" className="px-6 py-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6 text-sm">
                            {/* Personal Details */}
                            <div className="space-y-2">
                              <h4 className="font-semibold text-gray-800 border-b pb-1 mb-2">
                                Personal Details
                              </h4>
                              <p>
                                <span className="font-medium text-gray-600">
                                  Father's Name:
                                </span>{" "}
                                {trainee.fatherName || "N/A"}
                              </p>
                              <p>
                                <span className="font-medium text-gray-600">
                                  Date of Birth:
                                </span>{" "}
                                {formatDateDDMMYYYY(trainee.dob)}
                              </p>
                              <p>
                                <span className="font-medium text-gray-600">
                                  Sex:
                                </span>{" "}
                                {trainee.sex || "N/A"}
                              </p>
                              <p>
                                <span className="font-medium text-gray-600">
                                  Category:
                                </span>{" "}
                                {trainee.category || "N/A"}
                              </p>
                            </div>

                            {/* Contact Details */}
                            <div className="space-y-2">
                              <h4 className="font-semibold text-gray-800 border-b pb-1 mb-2">
                                Contact Details
                              </h4>
                              <p className="flex items-start">
                                <Phone className="w-4 h-4 mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
                                <span>
                                  {trainee.phoneNumber ||
                                    trainee.phone ||
                                    "Not specified"}
                                </span>
                              </p>
                              <p className="flex items-start">
                                <Mail className="w-4 h-4 mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
                                <span>{trainee.email || "Not specified"}</span>
                              </p>
                              <p className="flex items-start">
                                <MapPin className="w-4 h-4 mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
                                <span>
                                  {trainee.currentAddress || "Not specified"}
                                </span>
                              </p>
                            </div>

                            {/* Course Details */}
                            <div className="space-y-2">
                              <h4 className="font-semibold text-gray-800 border-b pb-1 mb-2">
                                Course Details
                              </h4>
                              <p>
                                <span className="font-medium text-gray-600">
                                  Course:
                                </span>{" "}
                                {trainee.courseType || "N/A"}
                              </p>
                              <p>
                                <span className="font-medium text-gray-600">
                                  Batch:
                                </span>{" "}
                                {trainee.batch || "N/A"}
                              </p>
                              <p>
                                <span className="font-medium text-gray-600">
                                  Joining Date:
                                </span>{" "}
                                {formatDateDDMMYYYY(
                                  trainee.dateOfJoiningStcWtcNonRailway
                                )}
                              </p>
                              <p>
                                <span className="font-medium text-gray-600">
                                  Sparing Date:
                                </span>{" "}
                                {formatDateDDMMYYYY(trainee.dateOfSparing)}
                              </p>
                            </div>

                            {/* Railway Details */}
                            <div className="space-y-2">
                              <h4 className="font-semibold text-gray-800 border-b pb-1 mb-2">
                                Railway Details
                              </h4>
                              <p>
                                <span className="font-medium text-gray-600">
                                  Appointment Mode:
                                </span>{" "}
                                {trainee.modeOfAppointment || "N/A"}
                              </p>
                              <p>
                                <span className="font-medium text-gray-600">
                                  Appointment Date:
                                </span>{" "}
                                {formatDateDDMMYYYY(
                                  trainee.dateOfAppointmentInRailway
                                )}
                              </p>
                            </div>

                            {/* Qualification */}
                            <div className="space-y-2">
                              <h4 className="font-semibold text-gray-800 border-b pb-1 mb-2">
                                Qualification
                              </h4>
                              <p>
                                <span className="font-medium text-gray-600">
                                  Highest Qualification:
                                </span>{" "}
                                {trainee.highestQualification || "N/A"}
                              </p>
                              <p>
                                <span className="font-medium text-gray-600">
                                  Institution:
                                </span>{" "}
                                {trainee.institution || "N/A"}
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredTrainees.length === 0 && !loading && (
            <div className="text-center py-12 px-6">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No trainees found
              </h3>
              <p className="text-sm text-gray-500">
                Try adjusting your search criteria or add a new trainee.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TraineeProfile;
