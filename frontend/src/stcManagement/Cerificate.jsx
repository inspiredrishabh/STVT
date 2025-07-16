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

  // Fetch trainees from backend
  useEffect(() => {
    fetchTrainees();
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

  // Handle search
  useEffect(() => {
    if (searchTerm.trim() === "") {
      applyFilters(trainees);
    } else {
      const filtered = trainees.filter(
        (trainee) =>
          trainee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          trainee.ticketNo.toLowerCase().includes(searchTerm.toLowerCase())
      );
      applyFilters(filtered);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, trainees, filters]);

  // Apply filters
  const applyFilters = (traineesToFilter) => {
    let result = [...traineesToFilter];

    if (filters.batch) {
      result = result.filter((trainee) => trainee.batch === filters.batch);
    }

    setFilteredTrainees(result);
  };

  // Toggle trainee selection
  const toggleTraineeSelection = (traineeTicketNo) => {
    setSelectedTrainees((prev) => {
      if (prev.includes(traineeTicketNo)) {
        return prev.filter((id) => id !== traineeTicketNo);
      } else {
        return [...prev, traineeTicketNo];
      }
    });
  };

  // Select/Deselect all trainees
  const toggleSelectAll = () => {
    if (selectedTrainees.length === filteredTrainees.length) {
      setSelectedTrainees([]);
    } else {
      setSelectedTrainees(filteredTrainees.map((trainee) => trainee.ticket_no));
    }
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      batch: "",
    });
    setSearchTerm("");
  };

  // Get unique filter options
  const getUniqueFilterOptions = (field) => {
    return [...new Set(trainees.map((trainee) => trainee[field]))];
  };

  // Generate bulk certificates
  const generateBulkCertificates = () => {
    if (selectedTrainees.length === 0) {
      alert("Please select at least one trainee");
      return;
    }

    // Get full trainee objects for the selected ticket numbers
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
      navigate(`/stc/certificate/preview?trainees=${traineesParam}`);
    } catch (error) {
      console.error("Error storing trainee data:", error);
      alert("Error preparing certificate data. Please try again.");
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // No certificate template needed in this file as it's moved to CertificatePreview

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <Link
              to="/stc"
              className="flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4 text-gray-600" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">
              Certificate Management
            </h1>
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
                    <th className="p-4 text-left">Batch</th>
                    <th className="p-4 text-left">Module</th>
                    <th className="p-4 text-left">Training Period</th>
                    <th className="p-4 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredTrainees.map((trainee) => {
                    // Format today's date in ISO format (YYYY-MM-DD) to match the trainee.dateOfSparing format
                    const now = new Date();
                    const today = now.toISOString().split("T")[0]; // Get YYYY-MM-DD format
                    return (
                      <tr key={trainee.ticket_no} className="hover:bg-gray-50">
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
                        <td className="p-4 font-medium">{trainee.ticket_no}</td>
                        <td className="p-4">{trainee.name}</td>
                        <td className="p-4">{trainee.batch}</td>
                        <td className="p-4">{trainee.module_no}</td>
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
  );
};

export default Certificate;
                