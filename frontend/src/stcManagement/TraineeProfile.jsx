import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
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
  CheckCircle
} from 'lucide-react';
// import { calculateOverallMarks, hasMarksData } from '../utils/marksUtils';

const TraineeProfile = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [trainees, setTrainees] = useState([]);
  const [filteredTrainees, setFilteredTrainees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showResignationModal, setShowResignationModal] = useState(false);
  const [selectedTraineeForResignation, setSelectedTraineeForResignation] = useState(null);
  const [resignationData, setResignationData] = useState({
    date: '',
    reason: ''
  });
  const [submittingResignation, setSubmittingResignation] = useState(false);

  // Fetch trainees from backend
  useEffect(() => {
    fetchTrainees();
  }, []);

  // Backend API endpoints
  const API_BASE = '/api/stc';

  const apiCall = async (endpoint, options = {}) => {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API call failed for ${endpoint}:`, error);
      throw error;
    }
  };

  // API Functions
  const resignTrainee = async (traineeId, resignationDate, reason) => {
    return await apiCall('/trainees/resign', {
      method: 'POST',
      body: JSON.stringify({
        traineeId,
        resignationDate,
        reason,
        processedBy: 'Admin', // This would come from auth context in real app
        processedAt: new Date().toISOString()
      })
    });
  };

  const getTraineeResignationHistory = async (traineeId) => {
    return await apiCall(`/trainees/${traineeId}/resignation-history`);
  };

  const updateTraineeStatus = async (traineeId, status, metadata = {}) => {
    return await apiCall('/trainees/status', {
      method: 'PUT',
      body: JSON.stringify({
        traineeId,
        status,
        metadata,
        updatedBy: 'Admin',
        updatedAt: new Date().toISOString()
      })
    });
  };

  const fetchTrainees = async () => {
    try {
      setLoading(true);
      // Try to fetch from backend API endpoint
      const response = await fetch('/api/stc');
      if (!response.ok) throw new Error('Failed to fetch trainees');
      const data = await response.json();

      const TraineeArray = Array.isArray(data.data) ? data.data : [];
      console.log('Fetched trainees:', TraineeArray);

      setTrainees(TraineeArray);
      setFilteredTrainees(TraineeArray);
    } catch (err) {
      setError(err.message);
      console.log('API not available:', err.message);
    } finally {
      setLoading(false);
    }
  };

  // Search functionality
  useEffect(() => {
    const filtered = trainees.filter(trainee =>
      trainee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trainee.ticketNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trainee.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trainee.unit.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTrainees(filtered);
  }, [searchTerm, trainees]);

  // Handle edit trainee - redirect to manage candidate
  const handleEditTrainee = (trainee) => {
    try {
      // Store trainee information in localStorage for manage candidate page
      localStorage.setItem('editTraineeId', trainee.id);
      localStorage.setItem('editTraineeName', trainee.name);
      localStorage.setItem('editTraineeTicket', trainee.ticketNo);
      localStorage.setItem('editTraineeDesignation', trainee.designation);

      console.log(`Navigating to manage candidate for: ${trainee.name} (${trainee.ticketNo})`);

      // Navigate to manage candidate page
      navigate('/manage-candidate');
    } catch (error) {
      console.error('Error navigating to manage candidate:', error);
    }
  };

  // Handle line training - redirect with trainee info
  const handleLineTraining = (trainee) => {
    try {
      // Navigate to line training page with trainee data
      navigate(`/stc/line-training?traineeId=${trainee.id}&ticketNo=${trainee.ticketNo}&name=${encodeURIComponent(trainee.name)}`);
    } catch (error) {
      console.error('Error navigating to line training:', error);
    }
  };

  // Handle resignation
  const handleResignation = (trainee) => {
    setSelectedTraineeForResignation(trainee);
    setResignationData({ date: '', reason: '' });
    setShowResignationModal(true);
  };

  const handleResignationSubmit = async () => {
    if (!resignationData.date || !resignationData.reason.trim()) {
      alert('Please provide both resignation date and reason');
      return;
    }

    setSubmittingResignation(true);

    try {
      // Call resignation API
      await resignTrainee(
        selectedTraineeForResignation.id,
        resignationData.date,
        resignationData.reason.trim()
      );

      // Update local state
      const updatedTrainees = trainees.map(trainee =>
        trainee.id === selectedTraineeForResignation.id
          ? {
            ...trainee,
            status: 'Resigned',
            resignationDate: resignationData.date,
            resignationReason: resignationData.reason.trim()
          }
          : trainee
      );

      setTrainees(updatedTrainees);
      setFilteredTrainees(updatedTrainees.filter(trainee =>
        trainee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trainee.ticketNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trainee.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trainee.unit.toLowerCase().includes(searchTerm.toLowerCase())
      ));

      setShowResignationModal(false);
      setSelectedTraineeForResignation(null);
      setResignationData({ date: '', reason: '' });

      alert(`${selectedTraineeForResignation.name} has been marked as resigned successfully.`);
    } catch (error) {
      console.error('Error processing resignation:', error);
      alert('Failed to process resignation. This is a demo - in production, this would save to the database.');

      // For demo purposes, still update the UI
      const updatedTrainees = trainees.map(trainee =>
        trainee.id === selectedTraineeForResignation.id
          ? {
            ...trainee,
            status: 'Resigned',
            resignationDate: resignationData.date,
            resignationReason: resignationData.reason.trim()
          }
          : trainee
      );

      setTrainees(updatedTrainees);
      setFilteredTrainees(updatedTrainees.filter(trainee =>
        trainee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trainee.ticketNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trainee.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trainee.unit.toLowerCase().includes(searchTerm.toLowerCase())
      ));

      setShowResignationModal(false);
      setSelectedTraineeForResignation(null);
      setResignationData({ date: '', reason: '' });
    } finally {
      setSubmittingResignation(false);
    }
  };

  const closeResignationModal = () => {
    setShowResignationModal(false);
    setSelectedTraineeForResignation(null);
    setResignationData({ date: '', reason: '' });
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
              <span className="text-sm text-gray-600">Total: {filteredTrainees.length}</span>
            </div>
          </div>
        </div>

        {/* Trainees Grid */}
        {error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800">Demo Mode: Using mock data. {error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrainees.map((trainee) => (
            <div key={trainee.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200">
              {/* Card Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {trainee.picture ? (
                      <div className="relative">
                        <img
                          src={trainee.picture}
                          alt={trainee.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-blue-200 shadow-md"
                          onError={(e) => {
                            // Hide the image and show fallback
                            e.target.style.display = 'none';
                            const fallback = e.target.parentNode.querySelector('.fallback-avatar');
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                        <div className="fallback-avatar w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center absolute top-0 left-0" style={{ display: 'none' }}>
                          <span className="text-white font-bold text-sm">
                            {trainee.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
                        <span className="text-white font-bold text-sm">
                          {trainee.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900">{trainee.name}</h3>
                      <p className="text-sm text-gray-500">{trainee.ticketNo}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${trainee.status === 'Active'
                    ? 'bg-green-100 text-green-800'
                    : trainee.status === 'Resigned'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                    }`}>
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
                    {trainee.courseCode} - {trainee.unit}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <GraduationCap className="w-4 h-4 mr-2" />
                    Batch: {trainee.batch}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="w-4 h-4 mr-2" />
                    {trainee.phone}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="w-4 h-4 mr-2" />
                    {trainee.email}
                  </div>
                </div>
              </div>

              {/* Course Info */}
              <div className="p-4 bg-gray-50">
                <h4 className="font-medium text-gray-900 mb-2">Course Details</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>Module: {trainee.moduleNo}</p>
                  <p>Duration: {trainee.duration}</p>
                  <p>Joining: {new Date(trainee.joiningDate).toLocaleDateString()}</p>
                  <p>Sparing: {new Date(trainee.sparingDate).toLocaleDateString()}</p>
                  <p>Coordinator: {trainee.coordinator}</p>
                </div>
              </div>

              {/* Stats */}
              {/* <div className="p-4 border-t border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Academic Performance</span>
                  {hasMarksData(trainee.id) ? (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full flex items-center">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Live Data
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      No Data
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className={`text-lg font-bold ${hasMarksData(trainee.id) ? 'text-blue-600' : 'text-gray-400'}`}>
                      {trainee.marks.theory}%
                    </div>
                    <div className="text-xs text-gray-500">Theory</div>
                  </div>
                  <div>
                    <div className={`text-lg font-bold ${hasMarksData(trainee.id) ? 'text-green-600' : 'text-gray-400'}`}>
                      {trainee.marks.practical}%
                    </div>
                    <div className="text-xs text-gray-500">Practical</div>
                  </div>
                  <div>
                    <div className={`text-lg font-bold ${hasMarksData(trainee.id) ? 'text-purple-600' : 'text-gray-400'}`}>
                      {trainee.marks.overall}%
                    </div>
                    <div className="text-xs text-gray-500">Overall</div>
                  </div>
                </div>
              </div> */}

              {/* Actions */}
              <div className="p-4 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <button
                    onClick={() => handleEditTrainee(trainee)}
                    className="flex items-center justify-center px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                  >
                    <Settings className="w-4 h-4 mr-1" />
                    Manage
                  </button>
                  <Link
                    to={`/stc/feed-marks?traineeId=${trainee.id}&ticketNo=${trainee.ticketNo}&name=${encodeURIComponent(trainee.name)}&courseCode=${trainee.courseCode}&autoSelect=true`}
                    className={`flex items-center justify-center px-3 py-2 text-white rounded-lg transition-colors text-sm ${trainee.id
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-orange-500 hover:bg-orange-600'
                      }`}
                  >
                    <FileText className="w-4 h-4 mr-1" />
                    {trainee.id ? 'View Marks' : 'Add Marks'}
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleLineTraining(trainee)}
                    className="flex items-center justify-center px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm"
                  >
                    <GraduationCap className="w-4 h-4 mr-1" />
                    Training
                  </button>
                  <button
                    onClick={() => handleResignation(trainee)}
                    disabled={trainee.status === 'Resigned'}
                    className={`flex items-center justify-center px-3 py-2 rounded-lg transition-colors text-sm ${trainee.status === 'Resigned'
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-red-500 text-white hover:bg-red-600'
                      }`}
                  >
                    <Users className="w-4 h-4 mr-1" />
                    {trainee.status === 'Resigned' ? 'Resigned' : 'Resign'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTrainees.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No trainees found</h3>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </div>
        )}
      </div>

      {/* Resignation Modal */}
      {showResignationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Process Resignation</h3>
              <button
                onClick={closeResignationModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {selectedTraineeForResignation && (
              <div className="mb-6">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  {selectedTraineeForResignation.picture ? (
                    <img
                      src={selectedTraineeForResignation.picture}
                      alt={selectedTraineeForResignation.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {selectedTraineeForResignation.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{selectedTraineeForResignation.name}</p>
                    <p className="text-sm text-gray-500">{selectedTraineeForResignation.ticketNo}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resignation Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={resignationData.date}
                  onChange={(e) => setResignationData(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Resignation <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={resignationData.reason}
                  onChange={(e) => setResignationData(prev => ({ ...prev, reason: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="4"
                  placeholder="Enter the reason for resignation..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={closeResignationModal}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleResignationSubmit}
                disabled={submittingResignation || !resignationData.date || !resignationData.reason.trim()}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submittingResignation ? 'Processing...' : 'Confirm Resignation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TraineeProfile;