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

// Mock API Functions with Backend Endpoints
const attendanceAPI = {
  // Mock trainee data - This should come from a real trainee database
  traineesData: [
    {
      id: 1,
      ticketNo: 'WTC/24/001',
      name: 'Rahul Sharma',
      trade: 'CG Apprentice Technician III',
      batch: '2024-2025',
      moduleNo: 'ASE',
      moduleDescription: 'Advanced Service Engineering',
      from: '2024-01-15',
      to: '2025-01-14',
      status: 'Active',
      totalTheoryDays: 120,
      totalPracticalDays: 80
    },
    {
      id: 2,
      ticketNo: 'WTC/24/002',
      name: 'Priya Singh',
      trade: 'RRB Apprentice Technician III',
      batch: '2024-2025',
      moduleNo: 'AJE',
      moduleDescription: 'Advanced Junior Engineering',
      from: '2024-02-01',
      to: '2025-01-31',
      status: 'Active',
      totalTheoryDays: 110,
      totalPracticalDays: 90
    },
    {
      id: 3,
      ticketNo: 'WTC/24/003',
      name: 'Amit Kumar',
      trade: 'CG Apprentice Technician III',
      batch: '2024-2025',
      moduleNo: 'ASE',
      moduleDescription: 'Advanced Service Engineering',
      from: '2024-01-20',
      to: '2024-07-19',
      status: 'Active',
      totalTheoryDays: 100,
      totalPracticalDays: 70
    },
    {
      id: 4,
      ticketNo: 'WTC/24/004',
      name: 'Anjali Verma',
      trade: 'RRB Apprentice Technician III',
      batch: '2024-2025',
      moduleNo: 'AJE',
      moduleDescription: 'Advanced Junior Engineering',
      from: '2024-03-01',
      to: '2025-02-28',
      status: 'Active',
      totalTheoryDays: 105,
      totalPracticalDays: 85
    }
  ],

  // Mock attendance data
  attendanceData: {
    'WTC/24/001': {
      theoryAttendance: 95,
      practicalAttendance: 72,
      totalTheoryDays: 120,
      totalPracticalDays: 80,
      attendanceRecords: [
        { date: '2024-06-25', theory: 'present', practical: 'present' },
        { date: '2024-06-26', theory: 'present', practical: 'absent' },
        { date: '2024-06-27', theory: 'absent', practical: 'present' },
        { date: '2024-06-28', theory: 'present', practical: 'present' },
        { date: '2024-06-29', theory: 'present', practical: 'present' }
      ]
    },
    'WTC/24/002': {
      theoryAttendance: 88,
      practicalAttendance: 82,
      totalTheoryDays: 110,
      totalPracticalDays: 90,
      attendanceRecords: [
        { date: '2024-06-25', theory: 'present', practical: 'present' },
        { date: '2024-06-26', theory: 'present', practical: 'present' },
        { date: '2024-06-27', theory: 'present', practical: 'absent' },
        { date: '2024-06-28', theory: 'absent', practical: 'present' },
        { date: '2024-06-29', theory: 'present', practical: 'present' }
      ]
    }
  },

  // Simulate API delay
  delay: (ms = 500) => new Promise(resolve => setTimeout(resolve, ms)),

  // Backend Endpoint: GET /api/attendance/trainees
  getAllTrainees: async () => {
    await attendanceAPI.delay(600);
    return attendanceAPI.traineesData;
  },

  // Backend Endpoint: GET /api/attendance/trainee/:ticketNo
  getTraineeByTicket: async (ticketNo) => {
    await attendanceAPI.delay(400);
    const trainee = attendanceAPI.traineesData.find(t => t.ticketNo === ticketNo);
    if (!trainee) {
      throw new Error('Trainee not found');
    }
    return trainee;
  },

  // Backend Endpoint: GET /api/attendance/:ticketNo
  getAttendanceData: async (ticketNo) => {
    await attendanceAPI.delay(500);
    const attendance = attendanceAPI.attendanceData[ticketNo];
    if (!attendance) {
      // Return default structure for new trainees
      return {
        theoryAttendance: 0,
        practicalAttendance: 0,
        totalTheoryDays: 0,
        totalPracticalDays: 0,
        attendanceRecords: []
      };
    }
    return attendance;
  },

  // Backend Endpoint: POST /api/attendance/mark
  markAttendance: async (ticketNo, date, attendanceType, status) => {
    await attendanceAPI.delay(300);
    console.log('Marking attendance:', { ticketNo, date, attendanceType, status });

    // Get trainee data
    const trainee = attendanceAPI.traineesData.find(t => t.ticketNo === ticketNo);
    if (!trainee) {
      throw new Error('Trainee not found');
    }

    // Update mock data
    if (!attendanceAPI.attendanceData[ticketNo]) {
      attendanceAPI.attendanceData[ticketNo] = {
        theoryAttendance: 0,
        practicalAttendance: 0,
        totalTheoryDays: 1,
        totalPracticalDays: 1,
        attendanceRecords: []
      };
    }

    const attendance = attendanceAPI.attendanceData[ticketNo];

    // Find existing record for the date or create new one
    let existingRecord = attendance.attendanceRecords.find(r => r.date === date);
    if (!existingRecord) {
      existingRecord = { date, theory: 'absent', practical: 'absent' };
      attendance.attendanceRecords.push(existingRecord);
    }

    // Update the specific attendance type
    existingRecord[attendanceType] = status;

    // Recalculate attendance percentages
    const theoryPresent = attendance.attendanceRecords.filter(r => r.theory === 'present').length;
    const practicalPresent = attendance.attendanceRecords.filter(r => r.practical === 'present').length;
    const totalRecords = attendance.attendanceRecords.length;

    attendance.theoryAttendance = totalRecords > 0 ? Math.round((theoryPresent / totalRecords) * 100) : 0;
    attendance.practicalAttendance = totalRecords > 0 ? Math.round((practicalPresent / totalRecords) * 100) : 0;

    return {
      success: true,
      message: 'Attendance marked successfully',
      updatedAttendance: attendance
    };
  },

  // Backend Endpoint: GET /api/attendance/summary/:ticketNo
  getAttendanceSummary: async (ticketNo) => {
    await attendanceAPI.delay(300);
    const trainee = await attendanceAPI.getTraineeByTicket(ticketNo);
    const attendance = await attendanceAPI.getAttendanceData(ticketNo);

    const summary = {
      trainee,
      attendance,
      statistics: {
        theoryPercentage: attendance.theoryAttendance,
        practicalPercentage: attendance.practicalAttendance,
        overallPercentage: Math.round((attendance.theoryAttendance + attendance.practicalAttendance) / 2),
        totalDaysAttended: attendance.attendanceRecords.length,
        theoryDaysPresent: attendance.attendanceRecords.filter(r => r.theory === 'present').length,
        practicalDaysPresent: attendance.attendanceRecords.filter(r => r.practical === 'present').length
      },
      status: {
        theoryStatus: attendance.theoryAttendance >= 75 ? 'Good' : attendance.theoryAttendance >= 60 ? 'Average' : 'Poor',
        practicalStatus: attendance.practicalAttendance >= 75 ? 'Good' : attendance.practicalAttendance >= 60 ? 'Average' : 'Poor'
      }
    };

    return summary;
  },

  // Backend Endpoint: GET /api/attendance/batch/:batchName
  getBatchAttendance: async (batchName) => {
    await attendanceAPI.delay(800);
    const batchTrainees = attendanceAPI.traineesData.filter(t => t.batch === batchName);

    const batchSummary = await Promise.all(
      batchTrainees.map(async (trainee) => {
        const attendance = await attendanceAPI.getAttendanceData(trainee.ticketNo);
        return {
          ...trainee,
          attendance: {
            theoryPercentage: attendance.theoryAttendance,
            practicalPercentage: attendance.practicalAttendance,
            overallPercentage: Math.round((attendance.theoryAttendance + attendance.practicalAttendance) / 2)
          }
        };
      })
    );

    return batchSummary;
  },

  // Backend Endpoint: POST /api/attendance/bulk-mark
  bulkMarkAttendance: async (attendanceData) => {
    await attendanceAPI.delay(1000);
    console.log('Bulk marking attendance:', attendanceData);

    const results = [];
    for (const entry of attendanceData) {
      try {
        const result = await attendanceAPI.markAttendance(
          entry.ticketNo,
          entry.date,
          entry.attendanceType,
          entry.status
        );
        results.push({ ...entry, success: true });
      } catch (error) {
        results.push({ ...entry, success: false, error: error.message });
      }
    }

    return {
      success: true,
      message: `Bulk attendance marked for ${results.filter(r => r.success).length} entries`,
      results
    };
  },

  // Backend Endpoint: GET /api/attendance/export/:ticketNo
  exportAttendanceReport: async (ticketNo, format = 'pdf') => {
    await attendanceAPI.delay(1200);
    console.log('Exporting attendance report:', { ticketNo, format });

    return {
      success: true,
      message: 'Attendance report generated successfully',
      downloadUrl: `/api/attendance/download/${ticketNo}.${format}`,
      fileName: `Attendance_Report_${ticketNo}.${format}`
    };
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
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceView, setAttendanceView] = useState('mark'); // 'mark', 'summary', 'records'
  const [filterBatch, setFilterBatch] = useState('');

  // Load trainees for dropdown
  useEffect(() => {
    if (searchMethod === 'dropdown') {
      loadTrainees();
    }
  }, [searchMethod]);

  const loadTrainees = useCallback(async () => {
    setLoading(true);
    try {
      const traineesList = await attendanceAPI.getAllTrainees();
      setTrainees(traineesList);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load trainees' });
    } finally {
      setLoading(false);
    }
  }, []);

  const loadTraineeData = useCallback(async (trainee) => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      setTraineeData(trainee);

      // Load attendance data
      const attendance = await attendanceAPI.getAttendanceData(trainee.ticketNo);
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
      const trainee = await attendanceAPI.getTraineeByTicket(ticketNumber);
      await loadTraineeData(trainee);
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
      setTraineeData(null);
      setAttendanceData(null);
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

  const markAttendance = useCallback(async (attendanceType, status) => {
    if (!traineeData) {
      setMessage({ type: 'error', text: 'No trainee selected' });
      return;
    }

    setLoading(true);
    try {
      const result = await attendanceAPI.markAttendance(
        traineeData.ticketNo,
        selectedDate,
        attendanceType,
        status
      );

      setAttendanceData(result.updatedAttendance);
      setMessage({
        type: 'success',
        text: `${attendanceType} attendance marked as ${status} for ${selectedDate}`
      });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to mark attendance' });
    } finally {
      setLoading(false);
    }
  }, [traineeData, selectedDate]);

  const resetForm = useCallback(() => {
    setTicketNumber('');
    setSelectedTrainee('');
    setTraineeData(null);
    setAttendanceData(null);
    setMessage({ type: '', text: '' });
    setSelectedDate(new Date().toISOString().split('T')[0]);
  }, []);

  // Computed values
  const filteredTrainees = useMemo(() => {
    if (!filterBatch) return trainees;
    return trainees.filter(t => t.batch === filterBatch);
  }, [trainees, filterBatch]);

  const attendanceStats = useMemo(() => {
    if (!attendanceData) return null;

    return {
      theoryPercentage: attendanceData.theoryAttendance,
      practicalPercentage: attendanceData.practicalAttendance,
      overallPercentage: Math.round((attendanceData.theoryAttendance + attendanceData.practicalAttendance) / 2),
      totalRecords: attendanceData.attendanceRecords.length,
      theoryPresent: attendanceData.attendanceRecords.filter(r => r.theory === 'present').length,
      practicalPresent: attendanceData.attendanceRecords.filter(r => r.practical === 'present').length
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
              <Link to="/wtc-management" className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200 group">
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
        <div className="max-w-7xl mx-auto">
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
                  {filterBatch && (
                    <p className="text-sm text-gray-500 mt-2">
                      Filtered by batch: {filterBatch}
                    </p>
                  )}
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
                  {/* Date Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Select Date
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      max={new Date().toISOString().split('T')[0]}
                      className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  {/* Attendance Marking */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Theory Attendance */}
                    <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                      <div className="flex items-center gap-3 mb-4">
                        <BookOpen className="w-6 h-6 text-blue-600" />
                        <h3 className="text-lg font-semibold text-blue-900">Theory Attendance</h3>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => markAttendance('theory', 'present')}
                          disabled={loading}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-all duration-200"
                        >
                          <CheckCircle className="w-5 h-5" />
                          Present
                        </button>
                        <button
                          onClick={() => markAttendance('theory', 'absent')}
                          disabled={loading}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-all duration-200"
                        >
                          <XCircle className="w-5 h-5" />
                          Absent
                        </button>
                      </div>
                    </div>

                    {/* Practical Attendance */}
                    <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
                      <div className="flex items-center gap-3 mb-4">
                        <Wrench className="w-6 h-6 text-orange-600" />
                        <h3 className="text-lg font-semibold text-orange-900">Practical Attendance</h3>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => markAttendance('practical', 'present')}
                          disabled={loading}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-all duration-200"
                        >
                          <CheckCircle className="w-5 h-5" />
                          Present
                        </button>
                        <button
                          onClick={() => markAttendance('practical', 'absent')}
                          disabled={loading}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-all duration-200"
                        >
                          <XCircle className="w-5 h-5" />
                          Absent
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Summary View */}
              {attendanceView === 'summary' && attendanceStats && (
                <div className="space-y-6">
                  {/* Attendance Statistics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                      <div className="flex items-center gap-3 mb-3">
                        <BookOpen className="w-6 h-6 text-blue-600" />
                        <h3 className="text-lg font-semibold text-blue-900">Theory</h3>
                      </div>
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        {attendanceStats.theoryPercentage}%
                      </div>
                      <div className="text-sm text-blue-700">
                        {attendanceStats.theoryPresent} / {attendanceStats.totalRecords} days
                      </div>
                      <div className={`mt-3 px-3 py-1 rounded-full text-xs font-medium ${getAttendanceStatusColor(attendanceStats.theoryPercentage)}`}>
                        {attendanceStats.theoryPercentage >= 75 ? 'Excellent' :
                          attendanceStats.theoryPercentage >= 60 ? 'Average' : 'Poor'}
                      </div>
                    </div>

                    <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
                      <div className="flex items-center gap-3 mb-3">
                        <Wrench className="w-6 h-6 text-orange-600" />
                        <h3 className="text-lg font-semibold text-orange-900">Practical</h3>
                      </div>
                      <div className="text-3xl font-bold text-orange-600 mb-2">
                        {attendanceStats.practicalPercentage}%
                      </div>
                      <div className="text-sm text-orange-700">
                        {attendanceStats.practicalPresent} / {attendanceStats.totalRecords} days
                      </div>
                      <div className={`mt-3 px-3 py-1 rounded-full text-xs font-medium ${getAttendanceStatusColor(attendanceStats.practicalPercentage)}`}>
                        {attendanceStats.practicalPercentage >= 75 ? 'Excellent' :
                          attendanceStats.practicalPercentage >= 60 ? 'Average' : 'Poor'}
                      </div>
                    </div>

                    <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                      <div className="flex items-center gap-3 mb-3">
                        <BarChart3 className="w-6 h-6 text-purple-600" />
                        <h3 className="text-lg font-semibold text-purple-900">Overall</h3>
                      </div>
                      <div className="text-3xl font-bold text-purple-600 mb-2">
                        {attendanceStats.overallPercentage}%
                      </div>
                      <div className="text-sm text-purple-700">
                        Combined Average
                      </div>
                      <div className={`mt-3 px-3 py-1 rounded-full text-xs font-medium ${getAttendanceStatusColor(attendanceStats.overallPercentage)}`}>
                        {attendanceStats.overallPercentage >= 75 ? 'Excellent' :
                          attendanceStats.overallPercentage >= 60 ? 'Average' : 'Poor'}
                      </div>
                    </div>
                  </div>

                  {/* Progress Bars */}
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Theory Attendance</span>
                        <span className="text-sm text-gray-600">{attendanceStats.theoryPercentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${attendanceStats.theoryPercentage}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Practical Attendance</span>
                        <span className="text-sm text-gray-600">{attendanceStats.practicalPercentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-orange-600 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${attendanceStats.practicalPercentage}%` }}
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
                      onClick={() => attendanceAPI.exportAttendanceReport(traineeData.ticketNo)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Export Report
                    </button>
                  </div>

                  {attendanceData.attendanceRecords.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse bg-white rounded-xl shadow-sm">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">Date</th>
                            <th className="border border-gray-200 px-4 py-3 text-center font-semibold text-gray-700">Theory</th>
                            <th className="border border-gray-200 px-4 py-3 text-center font-semibold text-gray-700">Practical</th>
                          </tr>
                        </thead>
                        <tbody>
                          {attendanceData.attendanceRecords.slice(-10).reverse().map((record, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="border border-gray-200 px-4 py-3 font-medium text-gray-900">
                                {new Date(record.date).toLocaleDateString('en-IN')}
                              </td>
                              <td className="border border-gray-200 px-4 py-3 text-center">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${record.theory === 'present'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                                  }`}>
                                  {record.theory === 'present' ? 'Present' : 'Absent'}
                                </span>
                              </td>
                              <td className="border border-gray-200 px-4 py-3 text-center">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${record.practical === 'present'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                                  }`}>
                                  {record.practical === 'present' ? 'Present' : 'Absent'}
                                </span>
                              </td>
                            </tr>
                          ))}
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
