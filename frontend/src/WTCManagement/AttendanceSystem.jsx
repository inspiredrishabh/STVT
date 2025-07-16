import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  UserCheck,
  Calendar,
  BookOpen,
  CheckCircle,
  XCircle,
  BarChart3,
  Download,
  Filter,
  Users,
  Award,
  Info
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

  // Get monthly attendance data for a specific candidate
  getMonthlyAttendanceData: async (candidateId) => {
    try {
      const response = await fetch(`/api/monthly-attendance/candidate/${candidateId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch monthly attendance data: ${response.status}`);
      }
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch monthly attendance data');
      }

      return result.data;
    } catch (error) {
      console.error('Error fetching monthly attendance data:', error);
      // Return empty data structure if this is the first time viewing attendance for this trainee
      return {
        candidateDetails: {
          id: candidateId,
          dateOfJoining: null,
          dateOfSparing: null
        },
        monthlyRecords: [],
        statistics: {
          totalMonths: 0,
          totalClasses: 0,
          classesAttended: 0,
          attendancePercentage: 0
        }
      };
    }
  },

  // Get available months for attendance based on joining and sparing dates
  getAttendanceMonths: async (candidateId) => {
    try {
      const response = await fetch(`/api/monthly-attendance/months/${candidateId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch attendance months: ${response.status}`);
      }
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch attendance months');
      }

      return result.data;
    } catch (error) {
      console.error('Error fetching attendance months:', error);
      return { months: [] };
    }
  },

  // Mark monthly attendance for a trainee
  markMonthlyAttendance: async (traineeId, month, totalClasses, classesAttended) => {
    try {
      // Set up the payload for monthly attendance
      const payload = {
        candidateId: traineeId,
        month: month,
        totalClasses: totalClasses,
        classesAttended: classesAttended
      };

      const response = await fetch('/api/monthly-attendance/mark', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to mark monthly attendance: ${errorText}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to mark monthly attendance');
      }

      // Return the updated attendance data
      return result.data;
    } catch (error) {
      console.error('Error marking monthly attendance:', error);
      throw error;
    }
  },

  // Get monthly attendance summary for a batch
  getBatchMonthlyAttendance: async (batch) => {
    try {
      const response = await fetch(`/api/monthly-attendance/summary?batch=${batch}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch batch monthly attendance: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch batch monthly attendance');
      }

      return result.data;
    } catch (error) {
      console.error('Error fetching batch monthly attendance:', error);
      throw error;
    }
  },

  // Bulk mark monthly attendance for multiple trainees
  bulkMarkMonthlyAttendance: async (attendanceData) => {
    try {
      // Transform the data to match the backend API
      const records = attendanceData.map(entry => ({
        candidateId: entry.candidateId,
        month: entry.month,
        totalClasses: entry.totalClasses,
        classesAttended: entry.classesAttended
      }));

      const response = await fetch('/api/monthly-attendance/bulk-mark', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ records })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to bulk mark monthly attendance: ${errorText}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to bulk mark monthly attendance');
      }

      return result;
    } catch (error) {
      console.error('Error bulk marking monthly attendance:', error);
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
  
  // Monthly attendance states
  const [monthlyAttendanceData, setMonthlyAttendanceData] = useState(null);
  const [availableMonths, setAvailableMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [monthlyTotalClasses, setMonthlyTotalClasses] = useState('');
  const [monthlyClassesAttended, setMonthlyClassesAttended] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [attendanceView, setAttendanceView] = useState('monthly-mark'); // 'monthly-mark', 'monthly-summary'
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

  // Load trainee data and attendance information
  const loadTraineeData = useCallback(async (trainee) => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      setTraineeData(trainee);

      // Load monthly attendance data
      const monthlyAttendance = await attendanceAPI.getMonthlyAttendanceData(trainee.id);
      setMonthlyAttendanceData(monthlyAttendance);
      
      // Load available months for attendance
      const monthsData = await attendanceAPI.getAttendanceMonths(trainee.id);
      setAvailableMonths(monthsData.months || []);
      
      // If there are available months, select the first one
      if (monthsData.months && monthsData.months.length > 0) {
        setSelectedMonth(monthsData.months[0]);
      } else {
        setSelectedMonth('');
      }

      setMessage({ type: 'success', text: `Data loaded for: ${trainee.name}` });
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to load trainee data' });
      setTraineeData(null);
      setMonthlyAttendanceData(null);
      setAvailableMonths([]);
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
      setMonthlyAttendanceData(null);
      setAvailableMonths([]);
    } finally {
      setLoading(false);
    }
  }, [ticketNumber, loadTraineeData]);

  const handleTraineeSelect = useCallback(async (traineeId) => {
    if (!traineeId) {
      setTraineeData(null);
      setMonthlyAttendanceData(null);
      setAvailableMonths([]);
      return;
    }

    const trainee = trainees.find(t => t.id === parseInt(traineeId));
    if (trainee) {
      setTicketNumber(trainee.ticketNo);
      await loadTraineeData(trainee);
    }
  }, [trainees, loadTraineeData]);

  // Mark monthly attendance for a trainee
  const markMonthlyAttendance = useCallback(async () => {
    if (!traineeData) {
      setMessage({ type: 'error', text: 'No trainee selected' });
      return;
    }

    if (!selectedMonth) {
      setMessage({ type: 'error', text: 'Please select a month' });
      return;
    }

    const totalClasses = parseInt(monthlyTotalClasses);
    const classesAttended = parseInt(monthlyClassesAttended);

    if (isNaN(totalClasses) || isNaN(classesAttended)) {
      setMessage({ type: 'error', text: 'Please enter valid numbers for total classes and classes attended' });
      return;
    }

    if (classesAttended > totalClasses) {
      setMessage({ type: 'error', text: 'Classes attended cannot exceed total classes' });
      return;
    }

    setLoading(true);
    try {
      const updatedAttendanceData = await attendanceAPI.markMonthlyAttendance(
        traineeData.id,
        selectedMonth,
        totalClasses,
        classesAttended
      );

      setMonthlyAttendanceData(updatedAttendanceData);
      setMessage({ 
        type: 'success', 
        text: `Monthly attendance marked successfully for ${traineeData.name} (${selectedMonth})` 
      });
      
      // Clear form fields
      setMonthlyTotalClasses('');
      setMonthlyClassesAttended('');
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to mark attendance' });
    } finally {
      setLoading(false);
    }
  }, [traineeData, selectedMonth, monthlyTotalClasses, monthlyClassesAttended]);

  const resetForm = useCallback(() => {
    setTicketNumber('');
    setSelectedTrainee('');
    setTraineeData(null);
    setMonthlyAttendanceData(null);
    setAvailableMonths([]);
    setSelectedMonth('');
    setMonthlyTotalClasses('');
    setMonthlyClassesAttended('');
    setMessage({ type: '', text: '' });
  }, []);

  // Format month for display
  const formatMonth = useCallback((monthStr) => {
    if (!monthStr) return '';
    
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  }, []);

  // Generate CSV content for export
  const generateMonthlyCSVContent = useCallback(() => {
    if (!traineeData || !monthlyAttendanceData) return '';
    
    const headers = [
      'Trainee Name',
      'Ticket Number',
      'Designation',
      'Month',
      'Total Classes',
      'Classes Attended',
      'Attendance Percentage'
    ];
    
    let csvContent = headers.join(',') + '\n';
    
    monthlyAttendanceData.monthlyRecords.forEach(record => {
      const row = [
        `"${traineeData.name}"`,
        `"${traineeData.ticketNo}"`,
        `"${traineeData.designation || ''}"`,
        `"${formatMonth(record.month)}"`,
        record.totalClasses,
        record.classesAttended,
        `${record.attendancePercentage}%`
      ];
      
      csvContent += row.join(',') + '\n';
    });
    
    return csvContent;
  }, [traineeData, monthlyAttendanceData, formatMonth]);

  // Calculate remaining days between joining and sparing
  const calculateRemainingDays = useMemo(() => {
    if (!traineeData) return null;
    
    const joiningDate = traineeData.dateOfJoiningStcWtcNonRailway;
    const sparingDate = traineeData.dateOfSparing;
    
    if (!joiningDate || !sparingDate) return null;
    
    const start = new Date(joiningDate);
    const end = new Date(sparingDate);
    const today = new Date();
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;
    
    const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const elapsedDays = Math.ceil((today - start) / (1000 * 60 * 60 * 24));
    const remainingDays = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
    
    return {
      totalDays: totalDays > 0 ? totalDays : 0,
      elapsedDays: elapsedDays > 0 ? elapsedDays : 0,
      remainingDays: remainingDays > 0 ? remainingDays : 0
    };
  }, [traineeData]);

  // Find monthly record by month
  const findMonthlyRecord = useCallback((month) => {
    if (!monthlyAttendanceData || !monthlyAttendanceData.monthlyRecords) return null;
    
    return monthlyAttendanceData.monthlyRecords.find(record => record.month === month);
  }, [monthlyAttendanceData]);

  // Computed values
  // Show all trainees in the list (no batch filter)
  const filteredTrainees = useMemo(() => trainees, [trainees]);



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
                    onClick={() => setAttendanceView('monthly-mark')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${attendanceView === 'monthly-mark'
                      ? 'bg-white text-blue-600 shadow-md'
                      : 'text-gray-600 hover:text-gray-800'
                      }`}
                  >
                    Mark Monthly Attendance
                  </button>
                  <button
                    onClick={() => setAttendanceView('monthly-summary')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${attendanceView === 'monthly-summary'
                      ? 'bg-white text-blue-600 shadow-md'
                      : 'text-gray-600 hover:text-gray-800'
                      }`}
                  >
                    Monthly Summary
                  </button>
                </div>
              </div>

              {/* Trainee Info */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Ticket No</span>
                    <span className="font-semibold">{traineeData.ticketNo}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Name</span>
                    <span className="font-semibold">{traineeData.name}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Designation</span>
                    <span className="font-semibold">{traineeData.designation || 'Not specified'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Date of Joining</span>
                    <span className="font-semibold">{traineeData.dateOfJoiningStcWtcNonRailway || 'Not specified'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Date of Sparing</span>
                    <span className="font-semibold">{traineeData.dateOfSparing || 'Not specified'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Training Period</span>
                    <span className="font-semibold">{traineeData.trainingPeriod || 'Not specified'}</span>
                  </div>
                </div>

                {/* Training Progress Bar */}
                {calculateRemainingDays && (
                  <div className="mt-4">
                    <div className="flex justify-between items-center text-sm mb-1">
                      <span className="text-gray-500">Training Progress</span>
                      <span className="font-medium">
                        {Math.round((calculateRemainingDays.elapsedDays / calculateRemainingDays.totalDays) * 100)}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{
                          width: `${Math.round((calculateRemainingDays.elapsedDays / calculateRemainingDays.totalDays) * 100)}%`
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Days elapsed: {calculateRemainingDays.elapsedDays}</span>
                      <span>Days remaining: {calculateRemainingDays.remainingDays}</span>
                      <span>Total days: {calculateRemainingDays.totalDays}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Monthly Attendance Mark Form */}
              {attendanceView === 'monthly-mark' && (
                <div className="border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Mark Monthly Attendance</h3>
                      <p className="text-gray-600 text-sm">
                        Record classes for a specific month
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Month Selection */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Select Month
                      </label>
                      <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      >
                        <option value="">Select a month...</option>
                        {availableMonths.map(month => (
                          <option key={month} value={month}>
                            {formatMonth(month)}
                          </option>
                        ))}
                      </select>

                      {/* Display Current Month's Data */}
                      {selectedMonth && findMonthlyRecord(selectedMonth) && (
                        <div className="mt-4 bg-blue-50 p-4 rounded-xl border border-blue-100">
                          <h4 className="font-semibold text-blue-800 mb-2">Current Attendance for {formatMonth(selectedMonth)}</h4>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <span className="text-sm text-blue-600">Total Classes</span>
                              <p className="font-semibold">{findMonthlyRecord(selectedMonth).totalClasses || 0}</p>
                            </div>
                            <div>
                              <span className="text-sm text-blue-600">Classes Attended</span>
                              <p className="font-semibold">{findMonthlyRecord(selectedMonth).classesAttended || 0}</p>
                            </div>
                            <div className="col-span-2">
                              <span className="text-sm text-blue-600">Attendance Percentage</span>
                              <p className="font-semibold">{findMonthlyRecord(selectedMonth).attendancePercentage || 0}%</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Attendance Input */}
                    <div className="flex flex-col gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Total Classes in Month
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={monthlyTotalClasses}
                          onChange={(e) => setMonthlyTotalClasses(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="e.g., 22"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Classes Attended in Month
                        </label>
                        <input
                          type="number"
                          min="0"
                          max={monthlyTotalClasses || 999}
                          value={monthlyClassesAttended}
                          onChange={(e) => setMonthlyClassesAttended(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="e.g., 20"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end mt-6">
                    <button
                      onClick={markMonthlyAttendance}
                      disabled={loading || !selectedMonth || !monthlyTotalClasses || !monthlyClassesAttended}
                      className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <CheckCircle className="w-5 h-5" />
                      )}
                      Save Monthly Attendance
                    </button>
                  </div>
                </div>
              )}

              {/* Monthly Attendance Summary */}
              {attendanceView === 'monthly-summary' && (
                <div className="border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                        <BarChart3 className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">Monthly Attendance Summary</h3>
                        <p className="text-gray-600 text-sm">
                          View attendance records by month
                        </p>
                      </div>
                    </div>

                    {/* Export Button */}
                    {monthlyAttendanceData && monthlyAttendanceData.monthlyRecords && monthlyAttendanceData.monthlyRecords.length > 0 && (
                      <button
                        onClick={() => {
                          const csvContent = generateMonthlyCSVContent();
                          const blob = new Blob([csvContent], { type: 'text/csv' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `${traineeData.ticketNo}_monthly_attendance.csv`;
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200"
                      >
                        <Download className="w-4 h-4" />
                        Export CSV
                      </button>
                    )}
                  </div>

                  {/* Overall Stats */}
                  {monthlyAttendanceData && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <div className="text-sm text-gray-500 mb-1">Total Months</div>
                        <div className="text-2xl font-bold">{monthlyAttendanceData.statistics?.totalMonths || 0}</div>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <div className="text-sm text-gray-500 mb-1">Total Classes</div>
                        <div className="text-2xl font-bold">{monthlyAttendanceData.statistics?.totalClasses || 0}</div>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <div className="text-sm text-gray-500 mb-1">Classes Attended</div>
                        <div className="text-2xl font-bold">{monthlyAttendanceData.statistics?.classesAttended || 0}</div>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <div className="text-sm text-gray-500 mb-1">Overall Attendance</div>
                        <div className="text-2xl font-bold">
                          {monthlyAttendanceData.statistics?.attendancePercentage || 0}%
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Monthly Records Table */}
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-xl overflow-hidden">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Classes</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Classes Attended</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance %</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {monthlyAttendanceData && monthlyAttendanceData.monthlyRecords && monthlyAttendanceData.monthlyRecords.length > 0 ? (
                          monthlyAttendanceData.monthlyRecords.map((record) => (
                            <tr key={record.id || record.month} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {formatMonth(record.month)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {record.totalClasses}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {record.classesAttended}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className={`text-sm font-medium rounded-full px-2 py-1 inline-block ${getAttendanceStatusColor(record.attendancePercentage)}`}>
                                  {record.attendancePercentage}%
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                              No monthly attendance records found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
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
