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
import { calculateOverallMarks, hasMarksData } from '../utils/marksUtils';

const TraineeProfile = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [trainees, setTrainees] = useState([]);
  const [filteredTrainees, setFilteredTrainees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock data matching FeedMark.jsx candidatesData
  const mockTraineesData = [
    {
      id: 1,
      ticketNo: 'STC2024001',
      name: 'Rahul Kumar',
      designation: 'MSE',
      unit: 'JAT',
      batch: '2024-2025',
      email: 'rahul.kumar@railway.gov.in',
      phone: '9876543210',
      picture: null,
      courseCode: 'MSE-C&W',
      course: {
        moduleNo: 'MSE-C&W',
        duration: '52 Weeks',
        joiningDate: '2024-01-15',
        sparingDate: '2025-01-15'
      },
      lineTraining: {
        status: 'Completed',
        duration: '6 months',
        location: 'JAT Division'
      },
      status: 'Active'
    },
    {
      id: 2,
      ticketNo: 'STC2024002',
      name: 'Priya Sharma',
      designation: 'MSE',
      unit: 'FZD',
      batch: '2024-2025',
      email: 'priya.sharma@railway.gov.in',
      phone: '9876543211',
      picture: null,
      courseCode: 'MSE-D',
      course: {
        moduleNo: 'MSE-D',
        duration: '52 Weeks',
        joiningDate: '2024-02-01',
        sparingDate: '2025-02-01'
      },
      lineTraining: {
        status: 'In Progress',
        duration: '6 months',
        location: 'FZD Division'
      },
      status: 'Active'
    },
    {
      id: 3,
      ticketNo: 'STC2024003',
      name: 'Amit Singh',
      designation: 'MSE',
      unit: 'MB',
      batch: '2024-2025',
      email: 'amit.singh@railway.gov.in',
      phone: '9876543212',
      picture: null,
      courseCode: 'MSE-W',
      course: {
        moduleNo: 'MSE-W',
        duration: '52 Weeks',
        joiningDate: '2024-03-01',
        sparingDate: '2025-03-01'
      },
      lineTraining: {
        status: 'Scheduled',
        duration: '6 months',
        location: 'MB Division'
      },
      status: 'Active'
    },
    {
      id: 4,
      ticketNo: 'STC2024004',
      name: 'Neha Gupta',
      designation: 'MJR',
      unit: 'MB',
      batch: '2024-2025',
      email: 'neha.gupta@railway.gov.in',
      phone: '9876543213',
      picture: null,
      courseCode: 'MJR-C&W',
      course: {
        moduleNo: 'MJR-C&W',
        duration: '52 Weeks',
        joiningDate: '2024-01-15',
        sparingDate: '2025-01-15'
      },
      lineTraining: {
        status: 'Completed',
        duration: '6 months',
        location: 'MB Division'
      },
      status: 'Active'
    },
    {
      id: 5,
      ticketNo: 'STC2024005',
      name: 'Vikash Yadav',
      designation: 'MJR',
      unit: 'FZD',
      batch: '2024-2025',
      email: 'vikash.yadav@railway.gov.in',
      phone: '9876543214',
      picture: null,
      courseCode: 'MJR-D',
      course: {
        moduleNo: 'MJR-D',
        duration: '52 Weeks',
        joiningDate: '2024-02-01',
        sparingDate: '2025-02-01'
      },
      lineTraining: {
        status: 'In Progress',
        duration: '6 months',
        location: 'FZD Division'
      },
      status: 'Active'
    },
    {
      id: 6,
      ticketNo: 'STC2024006',
      name: 'Sunita Devi',
      designation: 'MJR',
      unit: 'JAT',
      batch: '2024-2025',
      email: 'sunita.devi@railway.gov.in',
      phone: '9876543215',
      picture: null,
      courseCode: 'MJR-W',
      course: {
        moduleNo: 'MJR-W',
        duration: '52 Weeks',
        joiningDate: '2024-03-01',
        sparingDate: '2025-03-01'
      },
      lineTraining: {
        status: 'Scheduled',
        duration: '6 months',
        location: 'JAT Division'
      },
      status: 'Active'
    }
  ];

  // Fetch trainees from backend
  useEffect(() => {
    fetchTrainees();
  }, []);

  const fetchTrainees = async () => {
    try {
      setLoading(true);
      // Try to fetch from backend API endpoint
      const response = await fetch('/api/stc/trainees');
      if (!response.ok) throw new Error('Failed to fetch trainees');

      const data = await response.json();
      setTrainees(data);
      setFilteredTrainees(data);
    } catch (err) {
      setError(err.message);
      // Use mock data when API is not available
      console.log('Using mock data - API not available:', err.message);

      // Enhance mock data with calculated marks from marksUtils
      const enhancedMockData = mockTraineesData.map(trainee => {
        const calculatedMarks = hasMarksData(trainee.id)
          ? calculateOverallMarks(trainee.id)
          : { theory: 0, practical: 0, overall: 0 };

        return {
          ...trainee,
          marks: calculatedMarks
        };
      });

      setTrainees(enhancedMockData);
      setFilteredTrainees(enhancedMockData);
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
      // Store trainee ID in localStorage for manage candidate page
      localStorage.setItem('editTraineeId', trainee.id);
      localStorage.setItem('editTraineeName', trainee.name);

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
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {trainee.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{trainee.name}</h3>
                      <p className="text-sm text-gray-500">{trainee.ticketNo}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${trainee.status === 'Active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
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
                    {trainee.designation} - {trainee.unit}
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
                  <p>Module: {trainee.course.moduleNo}</p>
                  <p>Duration: {trainee.course.duration}</p>
                  <p>Joining: {new Date(trainee.course.joiningDate).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="p-4 border-t border-gray-100">
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
                  <Link
                    to={`/stc/feed-marks?traineeId=${trainee.id}&ticketNo=${trainee.ticketNo}&name=${encodeURIComponent(trainee.name)}&courseCode=${trainee.courseCode}&autoSelect=true`}
                    className={`flex items-center justify-center px-3 py-2 text-white rounded-lg transition-colors text-sm ${hasMarksData(trainee.id)
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-orange-500 hover:bg-orange-600'
                      }`}
                  >
                    <FileText className="w-4 h-4 mr-1" />
                    {hasMarksData(trainee.id) ? 'View Marks' : 'Add Marks'}
                  </Link>
                  <button
                    onClick={() => handleLineTraining(trainee)}
                    className="flex items-center justify-center px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm"
                  >
                    <GraduationCap className="w-4 h-4 mr-1" />
                    Training
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
    </div>
  );
};

export default TraineeProfile;