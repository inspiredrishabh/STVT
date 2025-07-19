import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  CheckSquare,
  Square,
  Filter,
  X,
  User,
  Award,
} from "lucide-react";

const Certificate = () => {
  const navigate = useNavigate();
  const [trainees, setTrainees] = useState([]);
  const [filteredTrainees, setFilteredTrainees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTrainees, setSelectedTrainees] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    batch: "",
  });
  const [courseType, setCourseType] = useState("induction");

  useEffect(() => {
    fetchTrainees();
    // eslint-disable-next-line
  }, []);

  const fetchTrainees = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/stc");
      if (!response.ok) throw new Error("Failed to fetch trainees");
      const data = await response.json();
      const traineeArray = Array.isArray(data.data) ? data.data : [];
      setTrainees(traineeArray);
      setFilteredTrainees(traineeArray);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Induction and refresher module codes
    const inductionModules = [
      "MSE-C&W", "MSE-D", "MSE-W", "MJR-C&W", "MJR-D", "MJR-W", "MJI-C&W",
      "MJI-D", "MJI-W", "MJP-C&W", "MJP-D", "MJP-W", "ASE", "AJE", "IJE", "RJE"
    ];

    const refresherModules = [
      "RCW", "RD", "TS", "LH-I", "LH-II", "FM", "WT", "DM", "WE", "NDT", "EA", "3DMP"
    ];

    let courseFilteredTrainees = trainees.filter((trainee) => {
      if (courseType === "induction") {
        return inductionModules.includes(trainee.module_no);
      } else {
        return refresherModules.includes(trainee.module_no);
      }
    });

    // Apply search filter
    let result = courseFilteredTrainees;
    if (searchTerm.trim() !== "") {
      result = result.filter(
        (trainee) =>
          trainee.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          trainee.ticket_no?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply batch filter
    if (filters.batch) {
      result = result.filter((trainee) => trainee.batch === filters.batch);
    }

    setFilteredTrainees(result);
    // eslint-disable-next-line
  }, [searchTerm, trainees, filters, courseType]);

  const toggleTraineeSelection = (traineeTicketNo) => {
    setSelectedTrainees((prev) => {
      if (prev.includes(traineeTicketNo)) {
        return prev.filter((id) => id !== traineeTicketNo);
      } else {
        return [...prev, traineeTicketNo];
      }
    });
  };

  const toggleSelectAll = () => {
    if (selectedTrainees.length === filteredTrainees.length) {
      setSelectedTrainees([]);
    } else {
      setSelectedTrainees(filteredTrainees.map((trainee) => trainee.ticket_no));
    }
  };

  const resetFilters = () => {
    setFilters({ batch: "" });
    setSearchTerm("");
  };

  const getUniqueFilterOptions = (field) => {
    return [...new Set(trainees.map((trainee) => trainee[field]))].filter(Boolean);
  };

  const generateBulkCertificates = () => {
    if (selectedTrainees.length === 0) {
      alert("Please select at least one trainee");
      return;
    }
    const selectedTraineeObjects = trainees.filter((trainee) =>
      selectedTrainees.includes(trainee.ticket_no)
    );

    try {
      sessionStorage.setItem(
        "selectedTrainees",
        JSON.stringify(selectedTraineeObjects)
      );
      const traineesParam = encodeURIComponent(
        JSON.stringify(selectedTrainees)
      );
      // If ANY selected trainee has module_no 'Other' or 'Custom', or ticket_no not starting with ASE, AJE, IJE, RSE, use CertificatePreview2
      const isRegular = selectedTraineeObjects.every((trainee) => {
        const ticketNo = trainee.ticket_no ? trainee.ticket_no.toUpperCase() : "";
        const moduleNo = trainee.module_no ? trainee.module_no.toLowerCase() : "";
        return (
          (ticketNo.startsWith("ASE") ||
            ticketNo.startsWith("AJE") ||
            ticketNo.startsWith("IJE") ||
            ticketNo.startsWith("RSE")) &&
          moduleNo !== "other" &&
          moduleNo !== "custom"
        );
      });

      if (isRegular) {
        navigate(`/stc/certificate/preview?trainees=${traineesParam}`);
      } else {
        navigate(`/stc/certificate/preview2?trainees=${traineesParam}`);
      }
    } catch (error) {
      console.error("Error storing trainee data:", error);
      alert("Error preparing certificate data. Please try again.");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200 w-full">
        <div className="w-full px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Left side - Back button and Title */}
            <div className="flex items-center space-x-4">
              <Link
                to="/stc"
                className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200 group"
              >
                <ArrowLeft className="w-4 h-4 text-gray-600 group-hover:text-gray-800" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  Certificate Management
                </h1>
                <p className="text-gray-600 text-sm">
                  Generate training certificates for trainees
                </p>
              </div>
            </div>
            {/* Right side - Status indicator */}
            <div className="hidden md:flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-green-50 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-700 font-medium text-xs">
                  System Active
                </span>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500">Current Date</div>
                <div className="text-xs font-medium text-gray-700">
                  {new Date().toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-gray-100 min-h-screen py-8 px-4">
        <div className="max-w-6xl mx-auto">

          {/* Course Type Toggle */}
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <div className="flex flex-col items-center space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Select Course Type
              </h2>
              <div className="relative bg-gray-200 rounded-full p-1 w-80">
                <div
                  className={`absolute top-1 bottom-1 w-1/2 bg-blue-600 rounded-full transition-transform duration-300 ease-in-out ${
                    courseType === "refresher"
                      ? "transform translate-x-full"
                      : ""
                  }`}
                ></div>
                <div className="relative flex">
                  <button
                    onClick={() => setCourseType("induction")}
                    className={`flex-1 py-3 px-6 text-sm font-medium rounded-full transition-colors duration-200 ${
                      courseType === "induction"
                        ? "text-white"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    Regular Courses
                  </button>
                  <button
                    onClick={() => setCourseType("refresher")}
                    className={`flex-1 py-3 px-6 text-sm font-medium rounded-full transition-colors duration-200 ${
                      courseType === "refresher"
                        ? "text-white"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    Special/Refresher Course
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600 text-center">
                {courseType === "induction"
                  ? "Long-duration training modules (Standard Certificate)"
                  : "Short-duration training modules (Custom Certificate)"}
              </p>
            </div>
          </div>

          {/* Search and Filter Controls */}
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
              {/* Search Box */}
              <div className="relative flex-1">
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Search by name or ticket number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              </div>
              {/* Filter Controls */}
              <div className="flex space-x-2">
                <button
                  onClick={() => setFilterOpen(!filterOpen)}
                  className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  <Filter className="w-4 h-4" />
                  <span>Filter</span>
                </button>
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            {/* Filter Panel */}
            {filterOpen && (
              <div className="bg-gray-50 p-4 rounded-lg mt-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Batch Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Batch
                    </label>
                    <select
                      className="w-full border rounded-md p-2"
                      value={filters.batch}
                      onChange={(e) =>
                        setFilters({ ...filters, batch: e.target.value })
                      }
                    >
                      <option value="">All Batches</option>
                      {getUniqueFilterOptions("batch").map((batch) => (
                        <option key={batch} value={batch}>
                          {batch}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Only batch filter remains */}
                </div>
              </div>
            )}
          </div>

          {/* Bulk Actions Bar */}
          <div className="bg-white shadow rounded-lg p-4 mb-6">
            <div className="flex flex-wrap justify-between items-center gap-4">
              {/* Selection Counter */}
              <div className="flex items-center">
                <button onClick={toggleSelectAll} className="mr-3">
                  {selectedTrainees.length === filteredTrainees.length &&
                  filteredTrainees.length > 0 ? (
                    <CheckSquare className="w-5 h-5 text-blue-600" />
                  ) : (
                    <Square className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                <span className="font-medium">
                  {selectedTrainees.length} of {filteredTrainees.length} selected
                </span>
              </div>
              {/* Bulk Actions */}
              <div className="flex space-x-3">
                <button
                  onClick={generateBulkCertificates}
                  disabled={selectedTrainees.length === 0}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                    selectedTrainees.length > 0
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  } transition-colors`}
                >
                  <Award className="w-4 h-4" />
                  <span>Generate Certificates</span>
                </button>
              </div>
            </div>
          </div>

          {/* Trainees Table */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading trainees...</p>
              </div>
            ) : error ? (
              <div className="p-8 text-center text-red-500">
                <p>Error: {error}</p>
                <button
                  onClick={fetchTrainees}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Retry
                </button>
              </div>
            ) : filteredTrainees.length === 0 ? (
              <div className="p-8 text-center text-gray-600">
                <User className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p>No trainees found matching your search criteria.</p>
                <button
                  onClick={resetFilters}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-4 text-left"></th>
                      <th className="p-4 text-left">Ticket No.</th>
                      <th className="p-4 text-left">Name</th>
                      <th className="p-4 text-left">Designation</th>
                      <th className="p-4 text-left">Batch</th>
                      <th className="p-4 text-left">Module</th>
                      <th className="p-4 text-left">Training Period</th>
                      <th className="p-4 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredTrainees.map((trainee) => {
                      const now = new Date();
                      const today = now.toISOString().split("T")[0];
                      return (
                        <tr
                          key={trainee.ticket_no}
                          className="hover:bg-gray-50"
                        >
                          <td className="p-4">
                            <button
                              onClick={() =>
                                toggleTraineeSelection(trainee.ticket_no)
                              }
                            >
                              {selectedTrainees.includes(trainee.ticket_no) ? (
                                <CheckSquare className="w-5 h-5 text-blue-600" />
                              ) : (
                                <Square className="w-5 h-5 text-gray-400" />
                              )}
                            </button>
                          </td>
                          <td className="p-4 font-medium">
                            {trainee.ticket_no}
                          </td>
                          <td className="p-4">{trainee.name}</td>
                          <td className="p-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                courseType === "induction"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-purple-100 text-purple-800"
                              }`}
                            >
                              {trainee.designation || "N/A"}
                            </span>
                          </td>
                          <td className="p-4">{trainee.batch}</td>
                          <td className="p-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                courseType === "induction"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-orange-100 text-orange-800"
                              }`}
                            >
                              {trainee.module_no}
                            </span>
                          </td>
                          <td className="p-4">
                            {formatDate(
                              trainee.date_of_joining_stc_wtc_non_railway
                            )}{" "}
                            - {formatDate(trainee.date_of_sparing)}
                          </td>
                          <td className="p-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                trainee.date_of_sparing >= today
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {trainee.date_of_sparing >= today
                                ? "Active"
                                : "Inactive"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certificate;
