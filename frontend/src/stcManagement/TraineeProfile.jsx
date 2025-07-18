import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Users,
  Phone,
  Mail,
  Calendar,
  GraduationCap,
  Award,
  FileText,
  Settings,
  Hash,
  ChevronDown,
  ChevronUp,
  User,
  Home,
  Briefcase,
} from "lucide-react";
// import { calculateOverallMarks, hasMarksData } from '../utils/marksUtils';

const DetailItem = ({ label, value }) => (
  <div className="text-sm">
    <span className="text-gray-500">{label}: </span>
    <span className="font-medium text-gray-800">{value || "N/A"}</span>
  </div>
);

const TraineeProfile = () => {
  const navigate = useNavigate();
  const [trainees, setTrainees] = useState([]);
  const [filteredTrainees, setFilteredTrainees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedTraineeId, setExpandedTraineeId] = useState(null);
  const [showResignationModal, setShowResignationModal] = useState(false);
  const [selectedTraineeForResignation, setSelectedTraineeForResignation] =
    useState(null);
  const [resignationData, setResignationData] = useState({
    date: "",
    reason: "",
  });
  const [submittingResignation, setSubmittingResignation] = useState(false);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [selectedTraineeForSession, setSelectedTraineeForSession] = useState(
    null
  );
  const [sessionData, setSessionData] = useState({
    session1: { start: null, end: null },
    session2: { start: null, end: null },
    session3: { start: null, end: null },
    session4: { start: null, end: null },
  });
  const [requiredSessions, setRequiredSessions] = useState(4);

  const courseStructure = {
    "MSE-C&W": {
      moduleName: "Mechanical Supervisor Electrical - Carriage & Wagon",
      sessions: {
        "Session 1": {},
        "Session 2": {},
        "Session 3": {},
        "Session 4": {},
      },
    },
    "MSE-D": {
      moduleName: "Mechanical Supervisor Electrical - Diesel",
      sessions: {
        "Session 1": {},
        "Session 2": {},
        "Session 3": {},
        "Session 4": {},
      },
    },
    "MSE-W": {
      moduleName: "Mechanical Supervisor Electrical - Workshop",
      sessions: {
        "Session 1": {},
        "Session 2": {},
        "Session 3": {},
        "Session 4": {},
      },
    },
    "MJR-C&W": {
      moduleName: "Mechanical Junior Engineer - Carriage & Wagon",
      sessions: {
        "Session 1": {},
        "Session 2": {},
        "Session 3": {},
        "Session 4": {},
      },
    },
    "MJR-D": {
      moduleName: "Mechanical Junior Engineer - Diesel",
      sessions: {
        "Session 1": {},
        "Session 2": {},
        "Session 3": {},
        "Session 4": {},
      },
    },
    "MJR-W": {
      moduleName: "Mechanical Junior Engineer - Workshop",
      sessions: {
        "Session 1": {},
        "Session 2": {},
        "Session 3": {},
        "Session 4": {},
      },
    },
    "MJI-C&W": {
      moduleName: "Mechanical Junior Instructor - Carriage & Wagon",
      sessions: {
        "Session 1": {},
        "Session 2": {},
        "Session 3": {},
        "Session 4": {},
      },
    },
    "MJI-D": {
      moduleName: "Mechanical Junior Instructor - Diesel",
      sessions: {
        "Session 1": {},
        "Session 2": {},
        "Session 3": {},
        "Session 4": {},
      },
    },
    "MJI-W": {
      moduleName: "Mechanical Junior Instructor - Workshop",
      sessions: {
        "Session 1": {},
        "Session 2": {},
        "Session 3": {},
        "Session 4": {},
      },
    },
    "MJP-C&W": {
      moduleName: "Mechanical Junior Programmer - Carriage & Wagon",
      sessions: {
        "Session 1": {},
        "Session 2": {},
      },
    },
    "MJP-D": {
      moduleName: "Mechanical Junior Programmer - Diesel",
      sessions: {
        "Session 1": {},
        "Session 2": {},
      },
    },
    "MJP-W": {
      moduleName: "Mechanical Junior Programmer - Workshop",
      sessions: {
        "Session 1": {},
        "Session 2": {},
      },
    },
  };

  // Fetch trainees from backend
  useEffect(() => {
    fetchTrainees();
  }, []);

  const formatDateDDMMYYYY = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    if (isNaN(date)) return "N/A";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Backend API endpoints
  const API_BASE = "/api/stc";

  // API Functions
  const resignTrainee = async (traineeTicketNo) => {
    const response = await fetch(`${API_BASE}/${traineeTicketNo}/resign`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  };

  const fetchTrainees = async () => {
    try {
      setLoading(true);
      // Try to fetch from backend API endpoint
      const response = await fetch("/api/stc");
      if (!response.ok) throw new Error("Failed to fetch trainees");
      const data = await response.json();

      const TraineeArray = Array.isArray(data.data)
        ? data.data.map((trainee) => ({
          ...trainee,
          // Map resignation_status to status for UI consistency
          status:
            trainee.resignation_status === "yes" ? "Resigned" : "Active",
          // Keep original data for ticket number consistency
          ticketNo: trainee.ticket_no,
          ticketNumber: trainee.ticket_no,
        }))
        : [];

      console.log("Fetched trainees:", TraineeArray);

      setTrainees(TraineeArray);
      setFilteredTrainees(TraineeArray);
    } catch (err) {
      setError(err.message);
      console.log("API not available:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // Search functionality
  useEffect(() => {
    const filtered = trainees.filter(
      (trainee) =>
        trainee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trainee.ticketNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trainee.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trainee.unit.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTrainees(filtered);
  }, [searchTerm, trainees]);

  const handleToggleExpand = (traineeId) => {
    setExpandedTraineeId(expandedTraineeId === traineeId ? null : traineeId);
  };

  // Handle edit trainee - redirect to manage candidate
  const handleEditTrainee = (trainee) => {
    try {
      // Store trainee information in localStorage for manage candidate page
      localStorage.setItem("editTraineeId", trainee.id);
      localStorage.setItem("editTraineeName", trainee.name);
      localStorage.setItem("editTraineeTicket", trainee.ticketNo);
      localStorage.setItem("editTraineeDesignation", trainee.designation);

      console.log(
        `Navigating to manage candidate for: ${trainee.name} (${trainee.ticketNo})`
      );

      // Navigate to manage candidate page
      navigate("/manage-candidate");
    } catch (error) {
      console.error("Error navigating to manage candidate:", error);
    }
  };

  // Handle line training - redirect with trainee info
  const handleLineTraining = (trainee) => {
    try {
      // Navigate to line training page with trainee data
      navigate(
        `/stc/line-training?traineeId=${trainee.id}&ticketNo=${trainee.ticketNo
        }&name=${encodeURIComponent(trainee.name)}`
      );
    } catch (error) {
      console.error("Error navigating to line training:", error);
    }
  };

  // Handle resignation
  const handleResignation = (trainee) => {
    setSelectedTraineeForResignation(trainee);
    setResignationData({ date: "", reason: "" });
    setShowResignationModal(true);
  };

  const handleResignationSubmit = async () => {
    if (!resignationData.date || !resignationData.reason.trim()) {
      alert("Please provide both resignation date and reason");
      return;
    }

    setSubmittingResignation(true);

    try {
      // Call resignation API with ticket number
      const response = await fetch(
        `${API_BASE}/${selectedTraineeForResignation.ticket_no ||
        selectedTraineeForResignation.ticketNo
        }/resign`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            resignation_date: resignationData.date,
            resignation_reason: resignationData.reason,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Update local state
      const updatedTrainees = trainees.map((trainee) =>
        trainee.id === selectedTraineeForResignation.id
          ? {
            ...trainee,
            status: "Resigned",
            resignation_status: "yes",
          }
          : trainee
      );

      setTrainees(updatedTrainees);
      setFilteredTrainees(
        updatedTrainees.filter(
          (trainee) =>
            trainee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            trainee.ticketNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            trainee.designation
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            trainee.unit.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );

      setShowResignationModal(false);
      setSelectedTraineeForResignation(null);
      setResignationData({ date: "", reason: "" });

      alert(
        `${selectedTraineeForResignation.name} has been marked as resigned successfully.`
      );
    } catch (error) {
      console.error("Error processing resignation:", error);
      alert(
        "Failed to process resignation. This is a demo - in production, this would save to the database."
      );

      // For demo purposes, still update the UI
      const updatedTrainees = trainees.map((trainee) =>
        trainee.id === selectedTraineeForResignation.id
          ? {
            ...trainee,
            status: "Resigned",
            resignation_status: "yes",
          }
          : trainee
      );

      setTrainees(updatedTrainees);
      setFilteredTrainees(
        updatedTrainees.filter(
          (trainee) =>
            trainee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            trainee.ticketNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            trainee.designation
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            trainee.unit.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );

      setShowResignationModal(false);
      setSelectedTraineeForResignation(null);
      setResignationData({ date: "", reason: "" });
    } finally {
      setSubmittingResignation(false);
    }
  };

  const closeResignationModal = () => {
    setShowResignationModal(false);
    setSelectedTraineeForResignation(null);
    setResignationData({ date: "", reason: "" });
  };

  const verifyModuleAndGetSessions = (trainee) => {
    // Extract module number and clean it up
    const moduleNo = trainee.module_no?.toString().trim().toUpperCase();
    if (!moduleNo) {
      throw new Error("Module number is required");
    }

    // Direct mapping if the module number matches exactly
    if (courseStructure[moduleNo]) {
      return {
        designation: moduleNo,
        moduleInfo: courseStructure[moduleNo],
        sessions: Object.keys(courseStructure[moduleNo].sessions).length
      };
    }

    // If not direct match, try the detailed module mapping
    const moduleMap = {
      // MSE modules
      "MSE-CW-01": "MSE-C&W",
      "MSE-CW-02": "MSE-C&W",
      "MSE-D-01": "MSE-D",
      "MSE-D-02": "MSE-D",
      "MSE-W-01": "MSE-W",
      "MSE-W-02": "MSE-W",

      // MJR modules
      "MJR-CW-01": "MJR-C&W",
      "MJR-CW-02": "MJR-C&W",
      "MJR-D-01": "MJR-D",
      "MJR-D-02": "MJR-D",
      "MJR-W-01": "MJR-W",
      "MJR-W-02": "MJR-W",

      // MJI modules
      "MJI-CW-01": "MJI-C&W",
      "MJI-CW-02": "MJI-C&W",
      "MJI-D-01": "MJI-D",
      "MJI-D-02": "MJI-D",
      "MJI-W-01": "MJI-W",
      "MJI-W-02": "MJI-W",

      // MJP modules
      "MJP-CW-01": "MJP-C&W",
      "MJP-D-01": "MJP-D",
      "MJP-W-01": "MJP-W",
    };

    // Find the matching designation
    const designation = moduleMap[moduleNo];
    if (!designation) {
      throw new Error(`Invalid module number: ${moduleNo}`);
    }

    // Get course structure for the designation
    const moduleInfo = courseStructure[designation];
    if (!moduleInfo) {
      throw new Error(`Course structure not found for designation: ${designation}`);
    }

    return {
      designation,
      moduleInfo,
      sessions: Object.keys(moduleInfo.sessions).length,
    };
  };

  const handleSessionManagement = async (trainee) => {
    try {
      // First verify the module number and get session info
      const { moduleInfo, sessions } = verifyModuleAndGetSessions(trainee);

      const response = await fetch(`/api/stc/${trainee.ticketNo}/sessions`);
      if (!response.ok) throw new Error("Failed to fetch session data");
      const data = await response.json();

      setSessionData(data.data.sessionData);
      setRequiredSessions(sessions);
      setSelectedTraineeForSession({
        ...trainee,
        moduleInfo,
      });
      setShowSessionModal(true);
    } catch (error) {
      console.error("Error in session management:", error);
      alert(error.message || "Failed to manage sessions");
    }
  };

  const handleSessionUpdate = async () => {
    try {
      const response = await fetch(
        `/api/stc/${selectedTraineeForSession.ticketNo}/sessions`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sessionData }),
        }
      );

      if (!response.ok) throw new Error("Failed to update session data");

      alert("Session dates updated successfully");
      setShowSessionModal(false);
      fetchTrainees(); // Refresh the trainee list
    } catch (error) {
      console.error("Error updating session data:", error);
      alert("Failed to update session data");
    }
  };

  const renderSessionModal = () => {
    if (!showSessionModal || !selectedTraineeForSession) return null;

    const moduleInfo = selectedTraineeForSession.moduleInfo;
    if (!moduleInfo) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
          <div className="flex items-center justify-between mb-6 pb-4 border-b">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                Session Management
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {moduleInfo.moduleName}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Module: {selectedTraineeForSession.module_no}
              </p>
            </div>
            <button
              onClick={() => setShowSessionModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                {selectedTraineeForSession.picture ? (
                  <img
                    src={`http://${import.meta.env.VITE_BACKEND_IP}:5000/${selectedTraineeForSession.picture}`}
                    alt={selectedTraineeForSession.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {selectedTraineeForSession.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {selectedTraineeForSession.name}
                </h3>
                <p className="text-sm text-gray-600">
                  Ticket No: {selectedTraineeForSession.ticketNo}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {Object.keys(moduleInfo.sessions).map((sessionKey) => {
              const sessionNum = sessionKey.split(" ")[1];
              return (
                <div key={sessionKey} className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-lg text-gray-900 mb-4">
                    {sessionKey}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={sessionData[`session${sessionNum}`]?.start || ""}
                        onChange={(e) =>
                          setSessionData((prev) => ({
                            ...prev,
                            [`session${sessionNum}`]: {
                              ...prev[`session${sessionNum}`],
                              start: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={sessionData[`session${sessionNum}`]?.end || ""}
                        onChange={(e) =>
                          setSessionData((prev) => ({
                            ...prev,
                            [`session${sessionNum}`]: {
                              ...prev[`session${sessionNum}`],
                              end: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end gap-4 mt-6 pt-4 border-t">
            <button
              onClick={() => setShowSessionModal(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSessionUpdate}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Save Sessions
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700">Loading trainees...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white shadow-sm rounded-lg mb-8 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/stc-management"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-200 group"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-gray-800" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Trainee Profiles
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                  View and manage trainee profiles
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium">
              <Users className="w-5 h-5" />
              <span>
                {filteredTrainees.length} Trainee
                {filteredTrainees.length !== 1 && "s"} Found
              </span>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8 border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, ticket number, designation, or unit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Trainees List */}
        {error && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded-md">
            <p className="font-bold">Demo Mode</p>
            <p>Using mock data. {error}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Header Row */}
          <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b font-semibold text-sm text-gray-600">
            <div className="col-span-5">TRAINEE</div>
            <div className="col-span-4">DESIGNATION & UNIT</div>
            <div className="col-span-3">ACTIONS</div>
          </div>

          {/* Trainees List */}
          <div className="divide-y divide-gray-200">
            {filteredTrainees.map((trainee) => {
              const isExpanded = expandedTraineeId === trainee.id;
              return (
                <div key={trainee.id} className="transition-all duration-300">
                  {/* Always visible part */}
                  <div className="grid grid-cols-12 gap-4 p-4 items-center">
                    <div className="col-span-12 md:col-span-5 flex items-center space-x-4">
                      <button
                        className="p-1 rounded-full hover:bg-gray-100"
                        onClick={() => handleToggleExpand(trainee.id)}
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-gray-600" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-600" />
                        )}
                      </button>
                      {trainee.picture ? (
                        <img
                          src={`http://${import.meta.env.VITE_BACKEND_IP}:5000/${trainee.picture}`}
                          alt={trainee.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {trainee.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {trainee.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Ticket: {trainee.ticketNo}
                        </p>
                      </div>
                    </div>
                    <div className="col-span-12 md:col-span-4 text-sm text-gray-700">
                      <p className="font-medium">{trainee.designation}</p>
                      <p className="text-gray-500">{trainee.unit}</p>
                    </div>
                    <div className="col-span-12 md:col-span-3">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        <button
                          onClick={() => handleEditTrainee(trainee)}
                          className="flex items-center justify-center px-2 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-xs font-medium"
                          title="Manage Profile"
                        >
                          <Settings className="w-4 h-4 mr-1" />
                          Manage
                        </button>
                        <Link
                          to={`/stc/feed-marks?traineeId=${trainee.id}&ticketNo=${trainee.ticketNo
                            }&name=${encodeURIComponent(
                              trainee.name
                            )}&courseCode=${trainee.courseCode
                            }&autoSelect=true`}
                          className="flex items-center justify-center px-2 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-xs font-medium"
                          title="View/Add Marks"
                        >
                          <FileText className="w-4 h-4 mr-1" />
                          Marks
                        </Link>
                        <button
                          onClick={() => handleSessionManagement(trainee)}
                          className="flex items-center justify-center px-2 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-xs font-medium"
                          title="Manage Sessions"
                        >
                          <Calendar className="w-4 h-4 mr-1" />
                          Sessions
                        </button>
                        <button
                          onClick={() => handleLineTraining(trainee)}
                          className="flex items-center justify-center px-2 py-1.5 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-xs font-medium"
                          title="Line Training"
                        >
                          <GraduationCap className="w-4 h-4 mr-1" />
                          Training
                        </button>
                        <button
                          onClick={() => handleResignation(trainee)}
                          disabled={trainee.status === "Resigned"}
                          className={`flex items-center justify-center px-2 py-1.5 rounded-md transition-colors text-xs font-medium ${trainee.status === "Resigned"
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-red-600 text-white hover:bg-red-700"
                            }`}
                          title={
                            trainee.status === "Resigned" ? "Resigned" : "Resign"
                          }
                        >
                          <Users className="w-4 h-4 mr-1" />
                          {trainee.status === "Resigned" ? "Resigned" : "Resign"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expandable part */}
                  {isExpanded && (
                    <div className="bg-gray-50 p-5 border-t border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Column 1 */}
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold text-gray-700 mb-2 border-b pb-1">
                              Personal Details
                            </h4>
                            <div className="space-y-1">
                              <DetailItem
                                label="Father's Name"
                                value={trainee.father_name}
                              />
                              <DetailItem
                                label="Date of Birth"
                                value={formatDateDDMMYYYY(trainee.dob)}
                              />
                              <DetailItem label="Sex" value={trainee.sex} />
                              <DetailItem
                                label="Category"
                                value={trainee.category}
                              />
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-700 mb-2 border-b pb-1">
                              Railway Details
                            </h4>
                            <div className="space-y-1">
                              <DetailItem
                                label="Appointment Mode"
                                value={trainee.mode_of_appointment}
                              />
                              <DetailItem
                                label="Appointment Date"
                                value={formatDateDDMMYYYY(
                                  trainee.date_of_appointment_in_railway
                                )}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Column 2 */}
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold text-gray-700 mb-2 border-b pb-1">
                              Contact Details
                            </h4>
                            <div className="space-y-1">
                              <DetailItem
                                label="Phone"
                                value={trainee.phone_number}
                              />
                              <DetailItem label="Email" value={trainee.email} />
                              <DetailItem
                                label="Address"
                                value={trainee.permanent_address}
                              />
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-700 mb-2 border-b pb-1">
                              Qualification
                            </h4>
                            <div className="space-y-1">
                              <DetailItem
                                label="Highest Qualification"
                                value={trainee.highest_qualification}
                              />
                              <DetailItem
                                label="Institution"
                                value={trainee.institution}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Column 3 */}
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold text-gray-700 mb-2 border-b pb-1">
                              Course Details
                            </h4>
                            <div className="space-y-1">
                              <DetailItem
                                label="Course"
                                value={trainee.module_no}
                              />
                              <DetailItem
                                label="Batch"
                                value={trainee.batch}
                              />
                              <DetailItem
                                label="Joining Date"
                                value={formatDateDDMMYYYY(
                                  trainee.date_of_joining_stc_wtc_non_railway
                                )}
                              />
                              <DetailItem
                                label="Sparing Date"
                                value={formatDateDDMMYYYY(
                                  trainee.date_of_sparing
                                )}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Session Timeline */}
                      <div className="mt-6">
                        <h4 className="font-semibold text-gray-700 mb-2 border-b pb-1">
                          Session Timeline
                        </h4>
                        <div className="space-y-2">
                          {(() => {
                            const sessionCount =
                              trainee.designation?.startsWith("MJP-") ||
                                trainee.module_no?.includes("MJP")
                                ? 2
                                : 4;

                            const sessions = Array.from(
                              { length: sessionCount },
                              (_, i) => {
                                const sessionNum = i + 1;
                                const startDate =
                                  trainee[`session${sessionNum}start`];
                                const endDate =
                                  trainee[`session${sessionNum}end`];

                                if (!startDate && !endDate) return null;

                                return (
                                  <div
                                    key={sessionNum}
                                    className="text-xs bg-white rounded-md p-2 border"
                                  >
                                    <p className="text-indigo-700 font-bold mb-1">
                                      Session {sessionNum}
                                    </p>
                                    <div className="grid grid-cols-2 gap-2 text-gray-600">
                                      <p>
                                        Start: {formatDateDDMMYYYY(startDate)}
                                      </p>
                                      <p>End: {formatDateDDMMYYYY(endDate)}</p>
                                    </div>
                                  </div>
                                );
                              }
                            ).filter(Boolean);

                            if (sessions.length === 0) {
                              return (
                                <p className="text-sm text-gray-500">
                                  No session dates set.
                                </p>
                              );
                            }
                            return (
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                                {sessions}
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Empty State */}
        {filteredTrainees.length === 0 && !loading && (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm border">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No Trainees Found
            </h3>
            <p className="text-gray-500">
              Your search did not match any trainee profiles.
            </p>
          </div>
        )}
      </div>

      {/* Resignation Modal */}
      {showResignationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-6 pb-4 border-b">
              <h3 className="text-xl font-semibold text-gray-900">
                Process Resignation
              </h3>
              <button
                onClick={closeResignationModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {selectedTraineeForResignation && (
              <div className="mb-6">
                <div className="flex items-center space-x-3 p-3 bg-gray-100 rounded-lg border">
                  {selectedTraineeForResignation.picture ? (
                    <img
                      src={`http://${import.meta.env.VITE_BACKEND_IP}:5000/${selectedTraineeForResignation.picture}`}
                      alt={selectedTraineeForResignation.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-base">
                        {selectedTraineeForResignation.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-800">
                      {selectedTraineeForResignation.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Ticket No: {selectedTraineeForResignation.ticketNo}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="resignationDate"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Resignation Date <span className="text-red-500">*</span>
                </label>
                <input
                  id="resignationDate"
                  type="date"
                  value={resignationData.date}
                  onChange={(e) =>
                    setResignationData((prev) => ({
                      ...prev,
                      date: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  max={new Date().toISOString().split("T")[0]}
                />
              </div>

              <div>
                <label
                  htmlFor="resignationReason"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Reason for Resignation <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="resignationReason"
                  value={resignationData.reason}
                  onChange={(e) =>
                    setResignationData((prev) => ({
                      ...prev,
                      reason: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="4"
                  placeholder="Enter the reason for resignation..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-8 pt-4 border-t">
              <button
                onClick={closeResignationModal}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleResignationSubmit}
                disabled={
                  submittingResignation ||
                  !resignationData.date ||
                  !resignationData.reason.trim()
                }
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {submittingResignation
                  ? "Processing..."
                  : "Confirm Resignation"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Session Management Modal */}
      {renderSessionModal()}
    </div>
  );
};
export default TraineeProfile;
