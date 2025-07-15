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
} from "lucide-react";

const TraineeProfile = () => {
  const navigate = useNavigate();
  const [trainees, setTrainees] = useState([]);
  const [filteredTrainees, setFilteredTrainees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Main Content */}
      <div className="w-full px-8 py-8">
        {/* Page Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link
            to="/wtc"
            className="flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-200 group"
          >
            <ArrowLeft className="w-4 h-4 text-gray-600 group-hover:text-gray-800" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              Trainee Profile
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              View and manage trainee profiles
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, ticket number, designation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2 bg-green-50 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-700 font-medium text-xs">
                  {filteredTrainees.length} Trainees
                </span>
              </div>
              <span className="text-sm text-gray-600">
                Total: {filteredTrainees.length}
              </span>
            </div>
          </div>
        </div>

        {/* Trainees Grid */}
        {error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800">
              Demo Mode: Using mock data. {error}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrainees.map((trainee) => (
            <div
              key={trainee.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200"
            >
              {/* Card Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {trainee.picture ? (
                          <img
                            src={`http://${
                              import.meta.env.VITE_BACKEND_IP
                            }:5000/${trainee.picture}`}
                            alt={trainee.name}
                            className="rounded-full w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-white font-bold text-sm">
                            {trainee.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        )}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {trainee.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {trainee.ticketNo}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      trainee.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {trainee.status}
                  </span>
                </div>

                {/* Basic Info */}
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Hash className="w-4 h-4 mr-2" />
                    Ticket: {trainee.ticketNo}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Award className="w-4 h-4 mr-2" />
                    {trainee.designation ||
                      trainee.designationOther ||
                      "Not specified"}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    Unit: {trainee.unit || trainee.unitOther || "Not specified"}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <GraduationCap className="w-4 h-4 mr-2" />
                    {trainee.courseType || "Course"} (
                    {trainee.batch || "Not specified"})
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="w-4 h-4 mr-2" />
                    {trainee.phoneNumber || trainee.phone || "Not specified"}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="w-4 h-4 mr-2" />
                    {trainee.email || "Not specified"}
                  </div>
                </div>

                {/* Course Info */}
                <div className="p-4 bg-gray-50">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Course Details
                  </h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>
                      Joining:{" "}
                      {formatDateDDMMYYYY(
                        trainee.dateOfJoiningStcWtcNonRailway
                      )}
                    </p>
                    <p>Category: {trainee.category || "Not specified"}</p>
                    <p>
                      Date of Sparing :{" "}
                      {formatDateDDMMYYYY(trainee.dateOfSparing)}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-4 border-t border-gray-100">
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleEditTrainee(trainee)}
                      className="flex items-center justify-center px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                    >
                      <Settings className="w-4 h-4 mr-1" />
                      Manage
                    </button>
                    <button
                      onClick={() => navigate(`/wtc/certificate/`)}
                      className="flex items-center justify-center px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                    >
                      <FileText className="w-4 h-4 mr-1" />
                      Certificate
                    </button>
                    <button
                      onClick={() => navigate("/wtc/Letter/")}
                      className="flex items-center justify-center px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm"
                    >
                      <GraduationCap className="w-4 h-4 mr-1" />
                      Letter
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Empty State */}
          {filteredTrainees.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No trainees found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search criteria
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TraineeProfile;
