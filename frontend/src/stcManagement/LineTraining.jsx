import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  GraduationCap,
  Plus,
  Search,
  Calendar,
  MapPin,
  Users,
  Save,
  Edit2,
  Trash2,
  Eye,
  AlertCircle,
  CheckCircle,
  Clock,
  X,
  User,
  TrendingUp,
  Target,
  Award,
} from "lucide-react";

const LineTraining = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [trainees, setTrainees] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [selectedTickets, setSelectedTickets] = useState([]);
  const [isAddMode, setIsAddMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTraineeInfo, setSelectedTraineeInfo] = useState(null);
  const [saving, setSaving] = useState(false);

  // Modal states
  const [viewModal, setViewModal] = useState({ isOpen: false, training: null });
  const [editModal, setEditModal] = useState({ isOpen: false, training: null });
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    training: null,
  });

  const [formData, setFormData] = useState({
    activityCentre: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  const [formErrors, setFormErrors] = useState({});

  // Status update function
  const updateTrainingStatus = async (training, newStatus) => {
    try {
      const response = await fetch(
        `/api/line-trainings/${training.id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (response.ok) {
        // Update local state
        setTrainings((prev) =>
          prev.map((t) =>
            t.id === training.id ? { ...t, status: newStatus } : t
          )
        );
        alert(`Training status updated to ${newStatus}`);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert(`Error updating status: ${error.message}`);
    }
  };

  // Date validation function
  const validateDates = (startDate, endDate) => {
    const errors = {};
    const today = new Date().toISOString().split("T")[0];

    if (startDate && endDate) {
      if (new Date(startDate) >= new Date(endDate)) {
        errors.endDate = "End date must be after start date";
      }
    }

    return errors;
  };

  // Function to determine status based on start date
  const determineStatus = (startDate) => {
    const today = new Date().toISOString().split("T")[0];
    return new Date(startDate) <= new Date(today) ? "In Progress" : "Scheduled";
  };

  // Handle form data changes with validation
  const handleFormDataChange = (field, value) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);

    // Clear previous errors for this field
    setFormErrors((prev) => ({ ...prev, [field]: "" }));

    // Validate dates if start or end date changed
    if (field === "startDate" || field === "endDate") {
      const dateErrors = validateDates(
        field === "startDate" ? value : formData.startDate,
        field === "endDate" ? value : formData.endDate
      );
      setFormErrors((prev) => ({ ...prev, ...dateErrors }));
    }
  };

  // Check if coming from trainee profile
  const urlParams = new URLSearchParams(location.search);
  const preselectedTraineeId = urlParams.get("traineeId");
  const preselectedTicketNo = urlParams.get("ticketNo");
  const preselectedName = urlParams.get("name");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch STC candidates (trainees)
      const traineeResponse = await fetch("/api/stc");
      if (traineeResponse.ok) {
        const traineeData = await traineeResponse.json();
        setTrainees(traineeData.data || traineeData);

        // If coming from trainee profile, preselect the trainee
        if (preselectedTraineeId && preselectedTicketNo) {
          const candidates = traineeData.data || traineeData; // Use the already parsed data
          const selectedTrainee = candidates.find(
            (t) =>
              t.id.toString() === preselectedTraineeId ||
              t.ticket_no === preselectedTicketNo
          );
          if (selectedTrainee) {
            setSelectedTickets([selectedTrainee.ticket_no]);
            setSelectedTraineeInfo({
              id: preselectedTraineeId,
              ticketNo: selectedTrainee.ticket_no,
              name: decodeURIComponent(preselectedName || selectedTrainee.name),
              designation: selectedTrainee.designation,
              unit: selectedTrainee.unit,
            });
            setIsAddMode(true);
          }
        }
      } else {
        throw new Error("Failed to fetch trainees");
      }

      // Fetch line trainings
      const trainingResponse = await fetch("/api/line-trainings");
      if (trainingResponse.ok) {
        const trainingData = await trainingResponse.json();
        setTrainings(trainingData.data || trainingData);
      } else {
        throw new Error("Failed to fetch line trainings");
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTicketSelection = (ticketNo) => {
    setSelectedTickets((prev) =>
      prev.includes(ticketNo)
        ? prev.filter((t) => t !== ticketNo)
        : [...prev, ticketNo]
    );
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    if (selectedTickets.length === 0) {
      alert("Please select at least one trainee");
      setSaving(false);
      return;
    }

    // Validate dates before submission
    const dateErrors = validateDates(formData.startDate, formData.endDate);
    if (Object.keys(dateErrors).length > 0) {
      setFormErrors(dateErrors);
      alert("Please fix the date validation errors before submitting");
      setSaving(false);
      return;
    }

    // Determine status based on start date
    const status = determineStatus(formData.startDate);

    const trainingData = {
      ...formData,
      ticketNumbers: selectedTickets,
      status: status,
    };

    try {
      const response = await fetch("/api/line-trainings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(trainingData),
      });

      if (response.ok) {
        const result = await response.json();
        const newTraining = result.data || result;
        setTrainings((prev) => [...prev, newTraining]);

        // Reset form
        setFormData({
          activityCentre: "",
          startDate: "",
          endDate: "",
          description: "",
        });
        setFormErrors({});
        setSelectedTickets([]);
        setSelectedTraineeInfo(null);
        setIsAddMode(false);

        alert(
          `Line training ${
            status === "In Progress" ? "started" : "scheduled"
          } successfully!`
        );
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create training");
      }
    } catch (error) {
      console.error("Error creating training:", error);
      alert(`Error scheduling training: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Scheduled":
        return "bg-yellow-100 text-yellow-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      case "On Hold":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="w-4 h-4" />;
      case "In Progress":
        return <Clock className="w-4 h-4" />;
      case "Scheduled":
        return <Calendar className="w-4 h-4" />;
      case "Cancelled":
        return <X className="w-4 h-4" />;
      case "On Hold":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const filteredTrainees = Array.isArray(trainees)
    ? trainees.filter(
        (trainee) =>
          trainee &&
          (trainee.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            trainee.ticket_no
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            trainee.designation
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()))
      )
    : [];

  // Calculate stats function
  const calculateStats = () => {
    // Defensive check: ensure trainings is an array
    if (!Array.isArray(trainings) || trainings.length === 0) {
      return {
        totalPrograms: 0,
        activePrograms: 0,
        completedPrograms: 0,
        scheduledPrograms: 0,
        totalTraineesInTraining: 0,
        uniqueTraineesCount: 0,
        completionRate: 0,
      };
    }

    const totalPrograms = trainings.length;
    const activePrograms = trainings.filter(
      (t) => t && t.status === "In Progress"
    ).length;
    const completedPrograms = trainings.filter(
      (t) => t && t.status === "Completed"
    ).length;
    const scheduledPrograms = trainings.filter(
      (t) => t && t.status === "Scheduled"
    ).length;
    const cancelledPrograms = trainings.filter(
      (t) => t && t.status === "Cancelled"
    ).length;
    const onHoldPrograms = trainings.filter(
      (t) => t && t.status === "On Hold"
    ).length;

    const totalTraineesInTraining = trainings.reduce((acc, training) => {
      if (!training || !Array.isArray(training.ticketNumbers)) {
        return acc;
      }
      return acc + training.ticketNumbers.length;
    }, 0);

    const uniqueTrainees = new Set();
    trainings.forEach((training) => {
      if (training && Array.isArray(training.ticketNumbers)) {
        training.ticketNumbers.forEach((ticket) => {
          if (ticket) uniqueTrainees.add(ticket);
        });
      }
    });

    const completionRate =
      totalPrograms > 0
        ? Math.round((completedPrograms / totalPrograms) * 100)
        : 0;

    return {
      totalPrograms,
      activePrograms,
      completedPrograms,
      scheduledPrograms,
      cancelledPrograms,
      onHoldPrograms,
      totalTraineesInTraining,
      uniqueTraineesCount: uniqueTrainees.size,
      completionRate,
    };
  };

  const stats = calculateStats();

  // Modal handlers
  const handleView = (training) => {
    setViewModal({ isOpen: true, training });
  };

  const handleEdit = (training) => {
    setEditModal({ isOpen: true, training });
    setFormData({
      activityCentre: training.activityCentre,
      startDate: training.startDate,
      endDate: training.endDate,
      description: training.description || "",
    });
    setFormErrors({});
    setSelectedTickets(training.ticketNumbers);
  };

  const handleDelete = (training) => {
    setDeleteModal({ isOpen: true, training });
  };

  const confirmDelete = async () => {
    const trainingToDelete = deleteModal.training;

    try {
      const response = await fetch(
        `/api/line-trainings/${trainingToDelete.id}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (response.ok) {
        // Remove from state
        setTrainings((prev) =>
          prev.filter((t) => t.id !== trainingToDelete.id)
        );
        alert("Training program deleted successfully!");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete training");
      }
    } catch (error) {
      console.error("Error deleting training:", error);
      alert(`Error deleting training: ${error.message}`);
    }

    setDeleteModal({ isOpen: false, training: null });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    if (selectedTickets.length === 0) {
      alert("Please select at least one trainee");
      setSaving(false);
      return;
    }

    // Validate dates before submission
    const dateErrors = validateDates(formData.startDate, formData.endDate);
    if (Object.keys(dateErrors).length > 0) {
      setFormErrors(dateErrors);
      alert("Please fix the date validation errors before submitting");
      setSaving(false);
      return;
    }

    // Determine status based on start date
    const status = determineStatus(formData.startDate);

    const updatedTraining = {
      ...formData,
      ticketNumbers: selectedTickets,
      status: status,
    };

    try {
      const response = await fetch(
        `/api/line-trainings/${editModal.training.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(updatedTraining),
        }
      );

      if (response.ok) {
        const result = await response.json();
        const updated = result.data || result;

        // Update in state
        setTrainings((prev) =>
          prev.map((t) =>
            t.id === editModal.training.id
              ? { ...editModal.training, ...updated }
              : t
          )
        );
        alert("Training program updated successfully!");

        setEditModal({ isOpen: false, training: null });
        setSelectedTickets([]);
        setFormErrors({});
        setFormData({
          activityCentre: "",
          startDate: "",
          endDate: "",
          description: "",
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update training");
      }
    } catch (error) {
      console.error("Error updating training:", error);
      alert(`Error updating training: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading line training data...</p>
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
            to="/stc/trainee-profile"
            className="flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-200 group"
          >
            <ArrowLeft className="w-4 h-4 text-gray-600 group-hover:text-gray-800" />
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-10 h-10 -r bg-purple-500 hover:bg-purple-600 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              Line Training
              {selectedTraineeInfo && (
                <span className="text-lg font-normal text-gray-600">
                  - {selectedTraineeInfo.name}
                </span>
              )}
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              {selectedTraineeInfo
                ? `Managing line training for ${selectedTraineeInfo.ticketNo} (${selectedTraineeInfo.designation} - ${selectedTraineeInfo.unit})`
                : "Manage line training schedules and assignments"}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                setIsAddMode(!isAddMode);
                if (!isAddMode && !selectedTraineeInfo) {
                  setSelectedTickets([]);
                }
              }}
              className="flex items-center space-x-2 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
            >
              {isAddMode ? (
                <X className="w-4 h-4" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              <span>{isAddMode ? "Cancel" : "Add Training"}</span>
            </button>
            <div className="flex items-center space-x-2 bg-purple-50 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span className="text-purple-700 font-medium text-xs">
                {trainings.length} Active Programs
              </span>
            </div>
          </div>
        </div>

        {/* Selected Trainee Info Banner */}
        {selectedTraineeInfo && (
          <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12  bg-purple-500 hover:bg-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-purple-900">
                    Selected Trainee: {selectedTraineeInfo.name}
                  </h3>
                  <p className="text-purple-700">
                    {selectedTraineeInfo.ticketNo} •{" "}
                    {selectedTraineeInfo.designation} •{" "}
                    {selectedTraineeInfo.unit}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedTraineeInfo(null);
                  setSelectedTickets([]);
                  setIsAddMode(false);
                  navigate("/stc/line-training");
                }}
                className="text-purple-600 hover:text-purple-800 p-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">
              Error: {error}. Please check your connection and try again.
            </p>
          </div>
        )}

        {/* Add Training Form */}
        {isAddMode && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Plus className="w-6 h-6 mr-2 text-purple-500" />
              Schedule New Line Training
              {selectedTraineeInfo && (
                <span className="ml-2 text-base font-normal text-gray-600">
                  for {selectedTraineeInfo.name}
                </span>
              )}
            </h2>

            <form onSubmit={handleFormSubmit} className="space-y-6">
              {/* Trainee Selection - Only show if no specific trainee selected */}
              {!selectedTraineeInfo && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select Trainees <span className="text-red-500">*</span>
                  </label>

                  {/* Search Bar */}
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search trainees by name, ticket number..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  {/* Selected Tickets Display */}
                  {selectedTickets.length > 0 && (
                    <div className="mb-4 p-3 bg-purple-50 rounded-lg">
                      <p className="text-sm text-purple-700 mb-2">
                        Selected Trainees ({selectedTickets.length}):
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selectedTickets.map((ticket) => {
                          const trainee = trainees.find(
                            (t) => t.ticket_no === ticket
                          );
                          return (
                            <span
                              key={ticket}
                              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                            >
                              {ticket} - {trainee?.name}
                              <button
                                type="button"
                                onClick={() => handleTicketSelection(ticket)}
                                className="ml-2 text-purple-600 hover:text-purple-800"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Trainee Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-4">
                    {filteredTrainees.map((trainee) => (
                      <div
                        key={trainee.id}
                        onClick={() => handleTicketSelection(trainee.ticket_no)}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedTickets.includes(trainee.ticket_no)
                            ? "border-purple-500 bg-purple-50"
                            : "border-gray-200 hover:border-purple-300"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">
                              {trainee.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {trainee.ticket_no}
                            </p>
                            <p className="text-sm text-gray-500">
                              {trainee.designation} - {trainee.unit}
                            </p>
                          </div>
                          <div
                            className={`w-4 h-4 rounded border-2 ${
                              selectedTickets.includes(trainee.ticket_no)
                                ? "bg-purple-500 border-purple-500"
                                : "border-gray-300"
                            }`}
                          >
                            {selectedTickets.includes(trainee.ticket_no) && (
                              <CheckCircle className="w-4 h-4 text-white" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Training Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Activity Centre <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.activityCentre}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        activityCentre: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., JAT Diesel Shed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) =>
                      handleFormDataChange("startDate", e.target.value)
                    }
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      formErrors.startDate
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {formErrors.startDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.startDate}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) =>
                      handleFormDataChange("endDate", e.target.value)
                    }
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      formErrors.endDate ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {formErrors.endDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.endDate}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    rows="3"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Brief description of the training program"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddMode(false);
                    if (!selectedTraineeInfo) {
                      setSelectedTickets([]);
                    }
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? "Scheduling..." : "Schedule Training"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Programs
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalPrograms}
                </p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  All time
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-500 hover:bg-blue-600 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Active Programs
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.activePrograms}
                </p>
                <p className="text-xs text-blue-600 flex items-center mt-1">
                  <Clock className="w-3 h-3 mr-1" />
                  In progress
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500 hover:bg-green-600 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Trainees Enrolled
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats.uniqueTraineesCount}
                </p>
                <p className="text-xs text-purple-600 flex items-center mt-1">
                  <Users className="w-3 h-3 mr-1" />
                  Unique trainees
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-500 hover:bg-purple-600 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Completion Rate
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.completionRate}%
                </p>
                <p className="text-xs text-gray-500 flex items-center mt-1">
                  <Target className="w-3 h-3 mr-1" />
                  {stats.completedPrograms} completed
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-500 hover:bg-orange-600 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Training Overview
            </h3>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
                <span className="text-gray-600">
                  Scheduled ({stats.scheduledPrograms})
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-gray-600">
                  In Progress ({stats.activePrograms})
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-gray-600">
                  Completed ({stats.completedPrograms})
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalTraineesInTraining}
              </p>
              <p className="text-sm text-gray-600">Total Training Slots</p>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <p className="text-2xl font-bold text-gray-900">
                {Array.isArray(trainings)
                  ? new Set(
                      trainings
                        .filter((t) => t && t.activityCentre)
                        .map((t) => t.activityCentre)
                    ).size
                  : 0}
              </p>
              <p className="text-sm text-gray-600">Active Centres</p>
            </div>
          </div>
        </div>

        {/* Training List */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <GraduationCap className="w-6 h-6 mr-2 text-purple-500" />
            {selectedTraineeInfo
              ? `Line Training Programs for ${selectedTraineeInfo.name}`
              : "Active Line Training Programs"}
          </h2>

          {!Array.isArray(trainings) || trainings.length === 0 ? (
            <div className="text-center py-12">
              <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No training programs found
              </h3>
              <p className="text-gray-500">
                Start by adding a new line training program
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {Array.isArray(trainings) &&
                trainings.map((training) => (
                  <div
                    key={training.id}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {training.activityCentre || "Unknown Centre"}
                          </h3>

                          {/* Status Dropdown */}
                          <div className="relative">
                            <select
                              value={training.status || "Scheduled"}
                              onChange={(e) =>
                                updateTrainingStatus(training, e.target.value)
                              }
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border-0 focus:ring-2 focus:ring-purple-500 ${getStatusColor(
                                training.status || "Scheduled"
                              )}`}
                            >
                              <option value="Scheduled">📅 Scheduled</option>
                              <option value="In Progress">
                                🔄 In Progress
                              </option>
                              <option value="Completed">✅ Completed</option>
                              <option value="Cancelled">❌ Cancelled</option>
                              <option value="On Hold">⏸️ On Hold</option>
                            </select>
                          </div>
                        </div>
                        <p className="text-gray-600 mb-3">
                          {training.description || "No description available"}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center text-gray-600">
                            <Calendar className="w-4 h-4 mr-2" />
                            {training.startDate
                              ? new Date(
                                  training.startDate
                                ).toLocaleDateString()
                              : "TBD"}{" "}
                            -{" "}
                            {training.endDate
                              ? new Date(training.endDate).toLocaleDateString()
                              : "TBD"}
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Users className="w-4 h-4 mr-2" />
                            {Array.isArray(training.ticketNumbers)
                              ? training.ticketNumbers.length
                              : 0}{" "}
                            Trainee(s)
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => handleView(training)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(training)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Edit Training"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(training)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Training"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Trainee Tags */}
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(training.ticketNumbers) &&
                        training.ticketNumbers.map((ticketNo) => {
                          const trainee = Array.isArray(trainees)
                            ? trainees.find(
                                (t) => t && t.ticket_no === ticketNo
                              )
                            : null;
                          return (
                            <span
                              key={ticketNo}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                            >
                              {ticketNo} {trainee && `- ${trainee.name}`}
                            </span>
                          );
                        })}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* View Modal */}
        {viewModal.isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center">
                    <Eye className="w-6 h-6 mr-2 text-blue-500" />
                    Training Details
                  </h3>
                  <button
                    onClick={() =>
                      setViewModal({ isOpen: false, training: null })
                    }
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Activity Centre
                    </label>
                    <p className="text-gray-900 font-medium">
                      {viewModal.training?.activityCentre}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <p className="text-gray-900">
                      {new Date(
                        viewModal.training?.startDate
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <p className="text-gray-900">
                      {new Date(
                        viewModal.training?.endDate
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        viewModal.training?.status
                      )}`}
                    >
                      {getStatusIcon(viewModal.training?.status)}
                      <span className="ml-1">{viewModal.training?.status}</span>
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                    {viewModal.training?.description ||
                      "No description provided"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assigned Trainees (
                    {viewModal.training?.ticketNumbers?.length || 0})
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {viewModal.training?.ticketNumbers?.map((ticketNo) => {
                      const trainee = Array.isArray(trainees)
                        ? trainees.find((t) => t && t.ticket_no === ticketNo)
                        : null;
                      return (
                        <span
                          key={ticketNo}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800"
                        >
                          {ticketNo} {trainee && `- ${trainee.name}`}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editModal.isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center">
                    <Edit2 className="w-6 h-6 mr-2 text-green-500" />
                    Edit Training Program
                  </h3>
                  <button
                    onClick={() => {
                      setEditModal({ isOpen: false, training: null });
                      setSelectedTickets([]);
                      setFormData({
                        activityCentre: "",
                        startDate: "",
                        endDate: "",
                        parentUnit: "",
                        supervisor: "",
                        description: "",
                      });
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleEditSubmit} className="p-6 space-y-6">
                {/* Trainee Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select Trainees <span className="text-red-500">*</span>
                  </label>

                  {/* Selected Tickets Display */}
                  {selectedTickets.length > 0 && (
                    <div className="mb-4 p-3 bg-purple-50 rounded-lg">
                      <p className="text-sm text-purple-700 mb-2">
                        Selected Trainees ({selectedTickets.length}):
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selectedTickets.map((ticket) => {
                          const trainee = trainees.find(
                            (t) => t.ticket_no === ticket
                          );
                          return (
                            <span
                              key={ticket}
                              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                            >
                              {ticket} - {trainee?.name}
                              <button
                                type="button"
                                onClick={() => handleTicketSelection(ticket)}
                                className="ml-2 text-purple-600 hover:text-purple-800"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Trainee Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-4">
                    {trainees.map((trainee) => (
                      <div
                        key={trainee.id}
                        onClick={() => handleTicketSelection(trainee.ticket_no)}
                        className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedTickets.includes(trainee.ticket_no)
                            ? "border-purple-500 bg-purple-50"
                            : "border-gray-200 hover:border-purple-300"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900 text-sm">
                              {trainee.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {trainee.ticket_no}
                            </p>
                            <p className="text-xs text-gray-500">
                              {trainee.designation} - {trainee.unit}
                            </p>
                          </div>
                          <div
                            className={`w-4 h-4 rounded border-2 ${
                              selectedTickets.includes(trainee.ticket_no)
                                ? "bg-purple-500 border-purple-500"
                                : "border-gray-300"
                            }`}
                          >
                            {selectedTickets.includes(trainee.ticket_no) && (
                              <CheckCircle className="w-4 h-4 text-white" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Training Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Activity Centre <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.activityCentre}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          activityCentre: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.startDate}
                      onChange={(e) =>
                        handleFormDataChange("startDate", e.target.value)
                      }
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                        formErrors.startDate
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {formErrors.startDate && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.startDate}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.endDate}
                      onChange={(e) =>
                        handleFormDataChange("endDate", e.target.value)
                      }
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                        formErrors.endDate
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {formErrors.endDate && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.endDate}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      rows="3"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setEditModal({ isOpen: false, training: null });
                      setSelectedTickets([]);
                      setFormData({
                        activityCentre: "",
                        startDate: "",
                        endDate: "",
                        description: "",
                      });
                    }}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? "Updating..." : "Update Training"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteModal.isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
                  Delete Training Program
                </h3>
                <p className="text-gray-600 text-center mb-6">
                  Are you sure you want to delete the training program at{" "}
                  <strong>{deleteModal.training?.activityCentre}</strong>? This
                  action cannot be undone.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() =>
                      setDeleteModal({ isOpen: false, training: null })
                    }
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LineTraining;
