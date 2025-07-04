import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Download, Printer, Search, Check, CheckSquare, Square, Filter, X, User, Users, Award, FileText
} from 'lucide-react';
import html2pdf from 'html2pdf.js';

const Certificate = () => {
  const navigate = useNavigate();
  const certificateRef = useRef(null);
  const [trainees, setTrainees] = useState([]);
  const [filteredTrainees, setFilteredTrainees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTrainees, setSelectedTrainees] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    batch: '',
    moduleNo: '',
    status: '',
  });
  const [view, setView] = useState('trainees'); // 'trainees', 'certificates'

  // Fetch trainees from backend
  useEffect(() => {
    fetchTrainees();
  }, []);

  const fetchTrainees = async () => {
    try {
      setLoading(true);
      // Replace with your actual API endpoint
      // const response = await fetch('/api/trainees');
      // if (!response.ok) throw new Error('Failed to fetch trainees');
      // const data = await response.json();

      // Mock data for development
      const mockData = [
        {
          id: 1,
          name: 'Rahul Sharma',
          gender: 'Male',
          dateOfBirth: '1995-06-15',
          fatherName: 'Suresh Sharma',
          ticketNo: 'WTC/24/001',
          courseType: 'Induction Course',
          designation: 'CG Apprentice Technician III',
          unit: 'Dy. CEE /CB',
          batch: '2024-2025',
          moduleNo: 'ASE',
          moduleDescription: 'Advanced Service Engineering',
          duration: '52 Weeks',
          dateOfJoiningStcWtcNonRailway: '2024-01-15',
          dateOfSparingFromStcWtcNonRailway: '2025-01-14',
          status: 'Active'
        },
        {
          id: 2,
          name: 'Priya Singh',
          gender: 'Female',
          dateOfBirth: '1997-03-22',
          fatherName: 'Rajesh Singh',
          ticketNo: 'WTC/24/002',
          courseType: 'Induction Course',
          designation: 'RRB Apprentice Technician III',
          unit: 'Dy. CEE /CB',
          batch: '2024-2025',
          moduleNo: 'AJE',
          moduleDescription: 'Advanced Junior Engineering',
          duration: '52 Weeks',
          dateOfJoiningStcWtcNonRailway: '2024-02-01',
          dateOfSparingFromStcWtcNonRailway: '2025-01-31',
          status: 'Active'
        },
        {
          id: 3,
          name: 'Amit Kumar',
          gender: 'Male',
          dateOfBirth: '1996-11-10',
          fatherName: 'Ramesh Kumar',
          ticketNo: 'WTC/24/003',
          courseType: 'Refresher Course',
          designation: 'CG Apprentice Technician III',
          unit: 'Dy. CEE /CB',
          batch: '2024-2025',
          moduleNo: 'ASE',
          moduleDescription: 'Advanced Service Engineering',
          duration: '26 Weeks',
          dateOfJoiningStcWtcNonRailway: '2024-01-20',
          dateOfSparingFromStcWtcNonRailway: '2024-07-19',
          status: 'Active'
        },
      ];

      setTrainees(mockData);
      setFilteredTrainees(mockData);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Handle search
  useEffect(() => {
    if (searchTerm.trim() === '') {
      applyFilters(trainees);
    } else {
      const filtered = trainees.filter(trainee =>
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
      result = result.filter(trainee => trainee.batch === filters.batch);
    }

    if (filters.moduleNo) {
      result = result.filter(trainee => trainee.moduleNo === filters.moduleNo);
    }

    if (filters.status) {
      result = result.filter(trainee => trainee.status === filters.status);
    }

    setFilteredTrainees(result);
  };

  // Toggle trainee selection
  const toggleTraineeSelection = (traineeId) => {
    setSelectedTrainees(prev => {
      if (prev.includes(traineeId)) {
        return prev.filter(id => id !== traineeId);
      } else {
        return [...prev, traineeId];
      }
    });
  };

  // Select/Deselect all trainees
  const toggleSelectAll = () => {
    if (selectedTrainees.length === filteredTrainees.length) {
      setSelectedTrainees([]);
    } else {
      setSelectedTrainees(filteredTrainees.map(trainee => trainee.id));
    }
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      batch: '',
      moduleNo: '',
      status: '',
    });
    setSearchTerm('');
  };

  // Get unique filter options
  const getUniqueFilterOptions = (field) => {
    return [...new Set(trainees.map(trainee => trainee[field]))];
  };

  // Generate individual certificate
  const generateCertificate = (traineeId) => {
    const trainee = trainees.find(t => t.id === traineeId);
    if (!trainee) return;

    navigate(`/wtc/certificate/preview?traineeId=${traineeId}&name=${encodeURIComponent(trainee.name)}&ticketNo=${trainee.ticketNo}&trade=${encodeURIComponent(trainee.designation)}&from=${trainee.dateOfJoiningStcWtcNonRailway}&to=${trainee.dateOfSparingFromStcWtcNonRailway}`);
  };

  // Generate bulk certificates
  const generateBulkCertificates = () => {
    if (selectedTrainees.length === 0) {
      alert('Please select at least one trainee');
      return;
    }
    setView('certificates');
  };

  // Export all certificates to PDF
  const exportAllToPdf = () => {
    const element = certificateRef.current;
    const opt = {
      margin: [10, 10, 10, 10],
      filename: `WTC_Certificates_Bulk_${new Date().toISOString().slice(0, 10)}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Individual Certificate Component
  const CertificateTemplate = ({ trainee }) => {
    return (
      <div className="certificate-container mb-8 page-break-after">
        <div className="certificate border-4 border-double border-gray-800 p-8 bg-white">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold uppercase">Workshop Training Center</h1>
            <h2 className="text-xl font-bold uppercase">Northern Railway - Charbagh, Lucknow</h2>
            <div className="text-lg mt-2">Certificate of Completion</div>
          </div>

          <div className="text-center mb-8">
            <p className="text-lg">This is to certify that</p>
            <p className="text-xl font-bold mt-2">{trainee.name}</p>
            <p className="text-lg mt-2">Ticket No: {trainee.ticketNo}</p>
            <p className="text-lg">has successfully completed</p>
            <p className="text-xl font-bold mt-2">{trainee.moduleDescription}</p>
            <p className="text-lg">({trainee.moduleNo})</p>
            <p className="text-lg mt-2">from</p>
            <p className="text-lg font-semibold mt-1">
              {formatDate(trainee.dateOfJoiningStcWtcNonRailway)} to {formatDate(trainee.dateOfSparingFromStcWtcNonRailway)}
            </p>
            <p className="text-lg mt-2">Duration: {trainee.duration}</p>
          </div>

          <div className="flex justify-between mt-16">
            <div className="text-center">
              <div className="border-t border-black pt-2 w-32 mx-auto">
                <p className="font-semibold">Date</p>
                <p>{new Date().toLocaleDateString('en-IN')}</p>
              </div>
            </div>
            <div className="text-center">
              <div className="border-t border-black pt-2 w-32 mx-auto">
                <p className="font-semibold">WTC Director</p>
                <p>Northern Railway</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <Link
              to="/wtc-management"
              className="flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4 text-gray-600" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">
              {view === 'trainees' ? 'Certificate Management' : 'Bulk Certificates Preview'}
            </h1>
          </div>

          {view === 'certificates' && (
            <div className="flex space-x-3">
              <button
                onClick={() => setView('trainees')}
                className="flex items-center space-x-2 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Selection</span>
              </button>

              <button
                onClick={exportAllToPdf}
                className="flex items-center space-x-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export All as PDF</span>
              </button>

              <button
                onClick={() => window.print()}
                className="flex items-center space-x-2 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Print All</span>
              </button>
            </div>
          )}
        </div>

        {/* Trainees Selection View */}
        {view === 'trainees' && (
          <>
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">Batch</label>
                      <select
                        className="w-full border rounded-md p-2"
                        value={filters.batch}
                        onChange={(e) => setFilters({ ...filters, batch: e.target.value })}
                      >
                        <option value="">All Batches</option>
                        {getUniqueFilterOptions('batch').map(batch => (
                          <option key={batch} value={batch}>{batch}</option>
                        ))}
                      </select>
                    </div>

                    {/* Module Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Module</label>
                      <select
                        className="w-full border rounded-md p-2"
                        value={filters.moduleNo}
                        onChange={(e) => setFilters({ ...filters, moduleNo: e.target.value })}
                      >
                        <option value="">All Modules</option>
                        {getUniqueFilterOptions('moduleNo').map(module => (
                          <option key={module} value={module}>{module}</option>
                        ))}
                      </select>
                    </div>

                    {/* Status Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select
                        className="w-full border rounded-md p-2"
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                      >
                        <option value="">All Statuses</option>
                        {getUniqueFilterOptions('status').map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bulk Actions Bar */}
            <div className="bg-white shadow rounded-lg p-4 mb-6">
              <div className="flex flex-wrap justify-between items-center gap-4">
                {/* Selection Counter */}
                <div className="flex items-center">
                  <button
                    onClick={toggleSelectAll}
                    className="mr-3"
                  >
                    {selectedTrainees.length === filteredTrainees.length && filteredTrainees.length > 0 ? (
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
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${selectedTrainees.length > 0
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
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
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredTrainees.map((trainee) => (
                        <tr key={trainee.id} className="hover:bg-gray-50">
                          <td className="p-4">
                            <button onClick={() => toggleTraineeSelection(trainee.id)}>
                              {selectedTrainees.includes(trainee.id) ? (
                                <CheckSquare className="w-5 h-5 text-blue-600" />
                              ) : (
                                <Square className="w-5 h-5 text-gray-400" />
                              )}
                            </button>
                          </td>
                          <td className="p-4 font-medium">{trainee.ticketNo}</td>
                          <td className="p-4">{trainee.name}</td>
                          <td className="p-4">{trainee.batch}</td>
                          <td className="p-4">{trainee.moduleNo} - {trainee.moduleDescription}</td>
                          <td className="p-4">
                            {formatDate(trainee.dateOfJoiningStcWtcNonRailway)} - {formatDate(trainee.dateOfSparingFromStcWtcNonRailway)}
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${trainee.status === 'Active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                              }`}>
                              {trainee.status}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex justify-center space-x-2">
                              <button
                                onClick={() => generateCertificate(trainee.id)}
                                className="p-1 rounded-full hover:bg-blue-100 text-blue-600"
                                title="Generate Certificate"
                              >
                                <Award className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* Bulk Certificates View */}
        {view === 'certificates' && (
          <div ref={certificateRef} className="certificates-container">
            {selectedTrainees.map(traineeId => {
              const trainee = trainees.find(t => t.id === traineeId);
              return trainee ? (
                <CertificateTemplate key={trainee.id} trainee={trainee} />
              ) : null;
            })}
          </div>
        )}
      </div>

      {/* Add CSS for PDF printing */}
      <style jsx="true">{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    .certificates-container, .certificates-container * {
                        visibility: visible;
                    }
                    .certificates-container {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        padding: 20px;
                    }
                    .page-break-after {
                        page-break-after: always;
                    }
                    .certificate {
                        height: 270mm;
                        width: 190mm;
                        margin: 0 auto;
                        padding: 20mm;
                    }
                }
            `}</style>
    </div>
  );
};

export default Certificate;