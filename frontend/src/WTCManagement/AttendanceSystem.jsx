import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  UserCheck,
  Calendar,
  Clock,
  BookOpen,
  Wrench,
  CheckCircle,
  XCircle,
  BarChart3,
  Download,
  Filter,
  Users,
  Award
} from 'lucide-react';

// Real API Functions connected to Backend Endpoints
const attendanceAPI = {
  // Get all trainees - uses the WTC API endpoint
  getAllTrainees: async () => {
    try {
      const response = await fetch('/api/wtc');
      if (!response.ok) {
        throw new Error(`Failed to fetch trainees: ${response.status}`);
      }
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error fetching trainees:', error);
      throw error;
    }
  },

  // Get a trainee by ticket number
  getTraineeByTicket: async (ticketNo) => {
    try {
      const response = await fetch(`/api/wtc?ticketNo=${ticketNo}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch trainee: ${response.status}`);
      }
      const result = await response.json();
      if (result.data && result.data.length > 0) {
        return result.data[0];
      }
      throw new Error('Trainee not found');
    } catch (error) {
      console.error('Error fetching trainee:', error);
      throw error;
    }
  },

  // Get attendance data for a specific candidate
  getAttendanceData: async (candidateId) => {
    try {
      const response = await fetch(`/api/attendance/candidate/${candidateId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch attendance data: ${response.status}`);
      }
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch attendance data');
      }

      // Transform the data to match the format expected by the frontend
      const attendanceData = {
        statistics: {
          totalClasses: result.data.statistics?.totalClasses || 0,
          classesAttended: result.data.statistics?.classesAttended || 0,
          attendancePercentage: result.data.statistics?.attendancePercentage || 0
        },
        attendanceRecords: result.data.attendanceRecords.map(record => ({
          totalClasses: record.totalClasses || 0,
          classesAttended: record.classesAttended || 0
        }))
      };

      return attendanceData;
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      // Return empty data structure if this is the first time viewing attendance for this trainee
      return {
        statistics: {
          totalClasses: 0,
          classesAttended: 0,
          attendancePercentage: 0
        },
        attendanceRecords: []
      };
    }
  },

  // Mark attendance for a trainee
  markAttendance: async (traineeId, totalClasses, classesAttended) => {
    try {
      // Set up the payload for classes attended
      const payload = {
        candidateId: traineeId,
        totalClasses: totalClasses,
        classesAttended: classesAttended
      };


      const response = await fetch('/api/attendance/mark', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to mark attendance: ${errorText}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to mark attendance');
      }

      // The API now returns updated attendance data directly
      if (result.data && result.data.attendanceRecords) {
        // Transform the data to match the format expected by the frontend
        return {
          statistics: {
            totalClasses: result.data.statistics?.totalClasses || 0,
            classesAttended: result.data.statistics?.classesAttended || 0,
            attendancePercentage: result.data.statistics?.attendancePercentage || 0
          },
          attendanceRecords: result.data.attendanceRecords.map(record => ({
            totalClasses: record.totalClasses || 0,
            classesAttended: record.classesAttended || 0
          }))
        };
      } else {
        // Fallback to fetching attendance if not included in response
        return attendanceAPI.getAttendanceData(traineeId);
      }
    } catch (error) {
      console.error('Error marking attendance:', error);
      throw error;
    }
  },

  // Get attendance summary for a batch
  getBatchAttendance: async (batch) => {
    try {
      const response = await fetch(`/api/attendance/summary?batch=${batch}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch batch attendance: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch batch attendance');
      }

      return result.data;
    } catch (error) {
      console.error('Error fetching batch attendance:', error);
      throw error;
    }
  },

  // Bulk mark attendance for multiple trainees
  bulkMarkAttendance: async (attendanceData) => {
    try {
      // Transform the data to match the backend API
      const records = attendanceData.map(entry => {
        const record = {
          candidateId: entry.candidateId,
          date: entry.date
        };

        if (entry.attendanceType === 'theory') {
          record.theoryStatus = entry.status;
        } else if (entry.attendanceType === 'practical') {
          record.practicalStatus = entry.status;
        } else if (entry.attendanceType === 'classes') {
          record.totalClasses = entry.totalClasses;
          record.classesAttended = entry.classesAttended;
        }

        return record;
      });

      const response = await fetch('/api/attendance/bulk-mark', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ records })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to bulk mark attendance: ${errorText}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to bulk mark attendance');
      }

      return result;
    } catch (error) {
      console.error('Error bulk marking attendance:', error);
      throw error;
    }
  }
};

const AttendanceSystem = () => {
  // State management
  const [searchMethod, setSearchMethod] = useState('ticket');
  const [ticketNumber, setTicketNumber] = useState('');
  const [selectedTrainee, setSelectedTrainee] = useState('');
  const [trainees, setTrainees] = useState([]);
  const [traineeData, setTraineeData] = useState(null);
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [attendanceView, setAttendanceView] = useState('mark'); // 'mark', 'summary', 'records'
  // Removed batch filter state
  const [exporting, setExporting] = useState(false);

  // Load trainees for dropdown
  const loadTrainees = useCallback(async () => {
    setLoading(true);
    try {
      const traineesList = await attendanceAPI.getAllTrainees();
      setTrainees(traineesList);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load trainees ', error: error.message });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (searchMethod === 'dropdown') {
      loadTrainees();
    }
  }, [searchMethod, loadTrainees]);


  const loadTraineeData = useCallback(async (trainee) => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      setTraineeData(trainee);

      // Load attendance data
      const attendance = await attendanceAPI.getAttendanceData(trainee.id);
      setAttendanceData(attendance);

      setMessage({ type: 'success', text: `Data loaded for: ${trainee.name}` });
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to load trainee data' });
      setTraineeData(null);
      setAttendanceData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearchTrainee = useCallback(async () => {
    if (!ticketNumber.trim()) {
      setMessage({ type: 'error', text: 'Please enter a ticket number' });
      return;
    }

    try {
      setLoading(true);
      const trainee = await attendanceAPI.getTraineeByTicket(ticketNumber);
      await loadTraineeData(trainee);
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
      setTraineeData(null);
      setAttendanceData(null);
    } finally {
      setLoading(false);
    }
  }, [ticketNumber, loadTraineeData]);

  const handleTraineeSelect = useCallback(async (traineeId) => {
    if (!traineeId) {
      setTraineeData(null);
      setAttendanceData(null);
      return;
    }

    const trainee = trainees.find(t => t.id === parseInt(traineeId));
    if (trainee) {
      setTicketNumber(trainee.ticketNo);
      await loadTraineeData(trainee);
    }
  }, [trainees, loadTraineeData]);

  const markAttendance = useCallback(async (totalClasses, classesAttended) => {
    if (!traineeData) {
      setMessage({ type: 'error', text: 'No trainee selected' });
      return;
    }

    setLoading(true);
    try {
      // Call the API to mark attendance
      const updatedAttendance = await attendanceAPI.markAttendance(
        traineeData.id,
        totalClasses,
        classesAttended
      );

      console.log('Updated attendance:', updatedAttendance);

      // Update the local state with new attendance data
      setAttendanceData(updatedAttendance);

      setMessage({
        type: 'success',
        text: `Class attendance updated successfully`
      });
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to mark attendance' });
    } finally {
      setLoading(false);
    }
  }, [traineeData]);

  const resetForm = useCallback(() => {
    setTicketNumber('');
    setSelectedTrainee('');
    setTraineeData(null);
    setAttendanceData(null);
    setMessage({ type: '', text: '' });
  }, []);

  const generateCSVContent = useCallback(() => {
    if (!traineeData || !attendanceData) return '';

    const headers = [
      'Trainee Name',
      'Ticket Number',
      'Designation',
      'Total Classes',
      'Classes Attended',
      'Attendance Percentage'
    ];

    let csvContent = headers.join(',') + '\n';

    // Add trainee info and attendance records
    if (attendanceData.attendanceRecords && attendanceData.attendanceRecords.length > 0) {
      const record = attendanceData.attendanceRecords[0];
      const percentage = record.totalClasses > 0 ? Math.round((record.classesAttended / record.totalClasses) * 100) : 0;

      const row = [
        `"${traineeData.name}"`,
        `"${traineeData.ticketNo}"`,
        `"${traineeData.designation}"`,
        `"${record.totalClasses || 0}"`,
        `"${record.classesAttended || 0}"`,
        `"${percentage}%"`
      ];
      csvContent += row.join(',') + '\n';
    } else {
      // If no records, add a row with trainee info and no attendance data
      const row = [
        `"${traineeData.name}"`,
        `"${traineeData.ticketNo}"`,
        `"${traineeData.designation}"`,
        '"0"',
        '"0"',
        '"0%"'
      ];
      csvContent += row.join(',') + '\n';
    }





    // Add summary statistics
    csvContent += '\n';
    csvContent += 'ATTENDANCE SUMMARY\n';
    csvContent += `Attendance Percentage,${attendanceData.statistics?.attendancePercentage || 0}%\n`;
    csvContent += `Total Classes,${attendanceData.statistics?.totalClasses || 0}\n`;
    csvContent += `Classes Attended,${attendanceData.statistics?.classesAttended || 0}\n`;
    csvContent += `Export Date,"${new Date().toLocaleDateString('en-IN')}"\n`;

    return csvContent;
  }, [traineeData, attendanceData]);
  const handleExportReport = useCallback(async () => {
    if (!traineeData) {
      setMessage({ type: 'error', text: 'No trainee selected for export' });
      return;
    }

    setExporting(true);
    setMessage({ type: '', text: '' });

    try {
      // Generate CSV content
      const csvContent = generateCSVContent();

      // Create and download the file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      link.setAttribute('href', url);
      link.setAttribute('download', `Attendance_Report_${traineeData.ticketNo}_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);

      setMessage({
        type: 'success',
        text: `Attendance report exported successfully for ${traineeData.name}`
      });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to export attendance report' });
      console.error('Export error:', error);
    } finally {
      setExporting(false);
    }
  }, [traineeData, generateCSVContent]);


  // Computed values
  // Show all trainees in the list (no batch filter)
  const filteredTrainees = useMemo(() => trainees, [trainees]);

  const attendanceStats = useMemo(() => {
    if (!attendanceData) return null;

    const records = attendanceData.attendanceRecords || [];
    return {
      totalClasses: attendanceData.statistics?.totalClasses || 0,
      classesAttended: attendanceData.statistics?.classesAttended || 0,
      attendancePercentage: attendanceData.statistics?.attendancePercentage || 0,
      totalRecords: records.length
    };
  }, [attendanceData]);

  const getAttendanceStatusColor = (percentage) => {
    if (percentage >= 75) return 'text-green-600 bg-green-100';
    if (percentage >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200 w-full">
        <div className="w-full px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/wtc" className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200 group">
                <ArrowLeft className="w-4 h-4 text-gray-600 group-hover:text-gray-800" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <UserCheck className="w-5 h-5 text-white" />
                  </div>
                  Attendance System
                </h1>
                <p className="text-gray-600 text-sm">
                  Mark and track trainee attendance
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-green-50 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-700 font-medium text-xs">System Active</span>
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
      <div className="w-full px-8 py-8">
        <div className="max-w-9xl mx-auto">
          {/* Search Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Search className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Search Trainee</h2>
                <p className="text-gray-600 text-sm">Find trainee to mark attendance</p>
              </div>
            </div>

            {/* Search Method Selection */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setSearchMethod('ticket')}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${searchMethod === 'ticket'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                Search by Ticket Number
              </button>
              <button
                onClick={() => setSearchMethod('dropdown')}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${searchMethod === 'dropdown'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                Select from List
              </button>
            </div>

            {/* Search Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              {searchMethod === 'ticket' ? (
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Ticket Number
                  </label>
                  <input
                    type="text"
                    value={ticketNumber}
                    onChange={(e) => setTicketNumber(e.target.value)}
                    placeholder="Enter ticket number (e.g., WTC/24/001)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearchTrainee()}
                  />
                </div>
              ) : (
                <div className="md:col-span-2">
                  {/* Removed batch filter dropdown */}

                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Select Trainee
                  </label>
                  <select
                    value={selectedTrainee}
                    onChange={(e) => {
                      setSelectedTrainee(e.target.value);
                      handleTraineeSelect(e.target.value);
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    disabled={loading}
                  >
                    <option value="">Select a trainee...</option>
                    {filteredTrainees.map(trainee => (
                      <option key={trainee.id} value={trainee.id}>
                        {trainee.ticketNo} - {trainee.name} ({trainee.trade})
                      </option>
                    ))}
                  </select>
                  {/* No batch filter message */}
                </div>
              )}

              <div className="flex gap-3">
                {searchMethod === 'ticket' && (
                  <button
                    onClick={handleSearchTrainee}
                    disabled={loading || !ticketNumber.trim()}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Search className="w-5 h-5" />
                    )}
                    Search
                  </button>
                )}
                <button
                  onClick={resetForm}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Messages */}
            {message.text && (
              <div className={`mt-6 p-4 rounded-xl flex items-center gap-3 ${message.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                {message.type === 'success' ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  <XCircle className="w-6 h-6" />
                )}
                <span className="font-medium">{message.text}</span>
              </div>
            )}
          </div>

          {/* Attendance Management */}
          {traineeData && (
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Attendance Management</h2>
                    <p className="text-gray-600 text-sm">Mark attendance for {traineeData.name}</p>
                  </div>
                </div>

                {/* View Toggle */}
                <div className="flex bg-gray-100 rounded-xl p-1">
                  <button
                    onClick={() => setAttendanceView('mark')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${attendanceView === 'mark'
                      ? 'bg-white text-blue-600 shadow-md'
                      : 'text-gray-600 hover:text-gray-800'
                      }`}
                  >
                    Mark Attendance
                  </button>
                  <button
                    onClick={() => setAttendanceView('summary')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${attendanceView === 'summary'
                      ? 'bg-white text-blue-600 shadow-md'
                      : 'text-gray-600 hover:text-gray-800'
                      }`}
                  >
                    Summary
                  </button>
                  <button
                    onClick={() => setAttendanceView('records')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${attendanceView === 'records'
                      ? 'bg-white text-blue-600 shadow-md'
                      : 'text-gray-600 hover:text-gray-800'
                      }`}
                  >
                    Records
                  </button>
                </div>
              </div>

              {/* Trainee Info */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Trainee Name</p>
                    <p className="font-semibold text-gray-900">{traineeData.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Ticket Number</p>
                    <p className="font-semibold text-gray-900">{traineeData.ticketNo}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Trade</p>
                    <p className="font-semibold text-gray-900">{traineeData.trade}</p>
                  </div>
                </div>
              </div>

              {/* Mark Attendance View */}
              {attendanceView === 'mark' && (
                <div className="space-y-6">
                  {/* Total Classes & Attendance */}
                  <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                    <div className="flex items-center gap-3 mb-4">
                      <Award className="w-6 h-6 text-purple-600" />
                      <h3 className="text-lg font-semibold text-purple-900">Total Classes & Attendance</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Total No. of Classes</label>
                        <input
                          type="number"
                          min="0"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          id="totalClasses"
                          placeholder="Enter total number of classes"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Classes Attended</label>
                        <input
                          type="number"
                          min="0"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          id="classesAttended"
                          placeholder="Enter number of classes attended"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <button
                          onClick={() => {
                            const totalClasses = parseInt(document.getElementById('totalClasses').value) || 0;
                            const classesAttended = parseInt(document.getElementById('classesAttended').value) || 0;
                            markAttendance(totalClasses, classesAttended);
                          }}
                          disabled={loading}
                          className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-all duration-200"
                        >
                          <Award className="w-5 h-5" />
                          Save Class Attendance
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Display saved attendance records below */}
                  {attendanceData && attendanceData.attendanceRecords && attendanceData.attendanceRecords.length > 0 && (
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 mt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Attendance Data</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Total Classes</p>
                          <p className="font-semibold text-gray-900">{attendanceData.attendanceRecords[0].totalClasses || 0}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Classes Attended</p>
                          <p className="font-semibold text-gray-900">{attendanceData.attendanceRecords[0].classesAttended || 0}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Attendance Percentage</p>
                          <p className="font-semibold text-gray-900">
                            {attendanceData.statistics?.attendancePercentage || 0}%
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Summary View */}
              {attendanceView === 'summary' && attendanceStats && (
                <div className="space-y-6">
                  {/* Attendance Statistics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-green-50 rounded-xl p-6 border border-green-200 md:col-span-3">
                      <div className="flex items-center gap-3 mb-3">
                        <Award className="w-6 h-6 text-green-600" />
                        <h3 className="text-lg font-semibold text-green-900">Class Attendance</h3>
                      </div>
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        {attendanceStats.attendancePercentage || 0}%
                      </div>
                      <div className="text-sm text-green-700">
                        {attendanceStats.classesAttended || 0} / {attendanceStats.totalClasses || 0} classes
                      </div>
                      <div className={`mt-3 px-3 py-1 rounded-full text-xs font-medium ${getAttendanceStatusColor(attendanceStats.attendancePercentage || 0)}`}>
                        {(attendanceStats.attendancePercentage || 0) >= 75 ? 'Excellent' :
                          (attendanceStats.attendancePercentage || 0) >= 60 ? 'Average' : 'Poor'}
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Class Attendance</span>
                        <span className="text-sm text-gray-600">{attendanceStats.attendancePercentage || 0}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-green-600 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${attendanceStats.attendancePercentage || 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Records View */}
              {attendanceView === 'records' && attendanceData && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">Attendance Records</h3>
                    <button
                      onClick={handleExportReport}
                      disabled={exporting}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {exporting ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                      {exporting ? 'Exporting...' : 'Export Report'}
                    </button>
                  </div>


                  {attendanceData.attendanceRecords && attendanceData.attendanceRecords.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse bg-white rounded-xl shadow-sm">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="border border-gray-200 px-4 py-3 text-center font-semibold text-gray-700">Total Classes</th>
                            <th className="border border-gray-200 px-4 py-3 text-center font-semibold text-gray-700">Classes Attended</th>
                            <th className="border border-gray-200 px-4 py-3 text-center font-semibold text-gray-700">Attendance Percentage</th>
                          </tr>
                        </thead>
                        <tbody>
                          {attendanceData.attendanceRecords?.map((record, index) => {
                            const percentage = record.totalClasses > 0 ? Math.round((record.classesAttended / record.totalClasses) * 100) : 0;
                            return (
                              <tr key={index} className="hover:bg-gray-50">
                                <td className="border border-gray-200 px-4 py-3 text-center font-medium text-gray-900">
                                  {record.totalClasses || 0}
                                </td>
                                <td className="border border-gray-200 px-4 py-3 text-center">
                                  {record.classesAttended || 0}
                                </td>
                                <td className="border border-gray-200 px-4 py-3 text-center">
                                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getAttendanceStatusColor(percentage)}`}>
                                    {percentage}%
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No attendance records found</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* No trainee selected message */}
          {!traineeData && !loading && (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-200">
              <div className="w-20 h-20 bg-gray-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">No Trainee Selected</h3>
              <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
                Please search for a trainee using their ticket number or select from the list to manage their attendance.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceSystem;
