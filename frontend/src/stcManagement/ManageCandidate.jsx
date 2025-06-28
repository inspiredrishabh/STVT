


//ye hataunga aur isko stc folder mein rakhunga when somesh ready karega








import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Settings, User, AlertCircle, Clock, Wrench } from 'lucide-react';

const ManageCandidate = () => {
  const [traineeInfo, setTraineeInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get trainee info from localStorage
    const traineeId = localStorage.getItem('editTraineeId');
    const traineeName = localStorage.getItem('editTraineeName');
    
    if (traineeId && traineeName) {
      setTraineeInfo({ id: traineeId, name: traineeName });
    }
    
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="w-full px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/stc/trainee-profile"
                className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200 group"
              >
                <ArrowLeft className="w-4 h-4 text-gray-600 group-hover:text-gray-800" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                    <Settings className="w-5 h-5 text-white" />
                  </div>
                  Manage Candidate
                </h1>
                <p className="text-gray-600 text-sm">
                  {traineeInfo ? `Managing: ${traineeInfo.name}` : 'Comprehensive candidate management'}
                </p>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-orange-50 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                <span className="text-orange-700 font-medium text-xs">Under Development</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full px-8 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Under Development Notice */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Wrench className="w-8 h-8 text-white" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Feature Under Development
            </h2>
            
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              The comprehensive candidate management system is currently being developed. 
              This will include advanced editing capabilities, complete profile management, 
              and integrated data handling from the backend.
            </p>

            <div className="flex items-center justify-center space-x-2 text-orange-600 mb-6">
              <Clock className="w-5 h-5" />
              <span className="font-medium">Expected completion: Coming Soon</span>
            </div>

            {traineeInfo && (
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center space-x-2 text-blue-800">
                  <User className="w-5 h-5" />
                  <span>Selected Trainee: <strong>{traineeInfo.name}</strong></span>
                </div>
                <p className="text-blue-600 text-sm mt-1">
                  ID: {traineeInfo.id}
                </p>
              </div>
            )}
          </div>

          {/* Planned Features */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <AlertCircle className="w-6 h-6 mr-2 text-blue-500" />
              Planned Features
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800">Profile Management</h4>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Complete personal information editing
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Professional details management
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Course and training updates
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Contact information updates
                  </li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800">Advanced Features</h4>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    Real-time backend integration
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    Document upload and management
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    Audit trail and change history
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    Bulk operations support
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/stc/trainee-profile"
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-center"
                >
                  Back to Trainee Profiles
                </Link>
                <Link
                  to="/stc-management"
                  className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium text-center"
                >
                  STC Management Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageCandidate;