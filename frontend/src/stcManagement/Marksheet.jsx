import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Search, FileText, Download, Printer, ArrowLeft, GraduationCap, AlertTriangle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import railwayLogo from '../assets/rail.png';

// Course structure definition
const courseStructure = {
  'MSE-C&W': {
    'Session 1': {
      'Paper 1': { maxMarks: 100, subjects: ['MRT-01', 'MRT-06'] },
      'Paper 2': { maxMarks: 100, subjects: ['MRT-02', 'MRT-03', 'MRT-04', 'MRT-05'] },
      'Practical': { maxMarks: 50, subjects: [] }
    },
    'Session 2': {
      'Paper 1': { maxMarks: 75, subjects: ['MRT-07', 'MRT-09'] },
      'Paper 2': { maxMarks: 100, subjects: ['MCT-01'] },
      'Practical': { maxMarks: 50, subjects: [] }
    },
    'Session 3': {
      'Paper 1': { maxMarks: 100, subjects: ['MCT-02/I'] },
      'Paper 2': { maxMarks: 50, subjects: ['MCT-02/II'] },
      'Paper 3': { maxMarks: 25, subjects: ['MRT-08'] },
      'Paper 4': { maxMarks: 50, subjects: ['MRT-11'] },
      'Practical': { maxMarks: 50, subjects: [] }
    },
    'Session 4': {
      'Paper 1': { maxMarks: 100, subjects: ['MRT-12'] },
      'Practical': { maxMarks: 50, subjects: [] },
      'Interview': { maxMarks: 100, subjects: [] }
    }
  },
  'MSE-D': {
    'Session 1': {
      'Paper 1': { maxMarks: 100, subjects: ['MRT-01', 'MRT-06'] },
      'Paper 2': { maxMarks: 100, subjects: ['MRT-02', 'MRT-03', 'MRT-04', 'MRT-05'] },
      'Practical': { maxMarks: 50, subjects: [] }
    },
    'Session 2': {
      'Paper 1': { maxMarks: 75, subjects: ['MRT-07', 'MRT-09'] },
      'Paper 2': { maxMarks: 100, subjects: ['MDT-01'] },
      'Practical': { maxMarks: 50, subjects: [] }
    },
    'Session 3': {
      'Paper 1': { maxMarks: 100, subjects: ['MDT-02/I'] },
      'Paper 2': { maxMarks: 50, subjects: ['MDT-02/II'] },
      'Paper 3': { maxMarks: 25, subjects: ['MRT-08'] },
      'Paper 4': { maxMarks: 50, subjects: ['MRT-11'] },
      'Practical': { maxMarks: 50, subjects: [] }
    },
    'Session 4': {
      'Paper 1': { maxMarks: 100, subjects: ['MRT-12'] },
      'Practical': { maxMarks: 50, subjects: [] },
      'Interview': { maxMarks: 100, subjects: [] }
    }
  }
};

// Simplified API Service for testing
class MarksheetService {
  constructor() {
    this.mockCandidates = [
      {
        id: 1,
        ticketNumber: 'STC2024001',
        name: 'Priya Sharma',
        fatherName: 'Mr. Amit Sharma',
        courseCode: 'MSE-C&W',
        rollNo: 'R002',
        batch: '2023-24',
        post: 'Motor Man',
        stream: 'C&W',
        status: 'active'
      },
      {
        id: 2,
        ticketNumber: 'STC2024002',
        name: 'Rahul Kumar',
        fatherName: 'Mr. Rajesh Kumar',
        courseCode: 'MSE-D',
        rollNo: 'R001',
        batch: '2023-24',
        post: 'Motor Man',
        stream: 'Diesel',
        status: 'active'
      },
      {
        id: 3,
        ticketNumber: 'STC2024003',
        name: 'Amit Singh',
        fatherName: 'Mr. Suresh Singh',
        courseCode: 'MSE-C&W',
        rollNo: 'R003',
        batch: '2023-24',
        post: 'Motor Man',
        stream: 'C&W',
        status: 'active'
      }
    ];

    this.mockMarksData = {
      'STC2024001': {
        'Session 1': { 'Paper 1': 85, 'Paper 2': 78, 'Practical': 45 },
        'Session 2': { 'Paper 1': 65, 'Paper 2': 89, 'Practical': 42 },
        'Session 3': { 'Paper 1': 92, 'Paper 2': 38, 'Paper 3': 22, 'Paper 4': 46, 'Practical': 48 },
        'Session 4': { 'Paper 1': 87, 'Practical': 44, 'Interview': 85 }
      },
      'STC2024002': {
        'Session 1': { 'Paper 1': 92, 'Paper 2': 88, 'Practical': 48 },
        'Session 2': { 'Paper 1': 70, 'Paper 2': 91, 'Practical': 46 },
        'Session 3': { 'Paper 1': 89, 'Paper 2': 45, 'Paper 3': 24, 'Paper 4': 48, 'Practical': 47 },
        'Session 4': { 'Paper 1': 93, 'Practical': 49, 'Interview': 88 }
      },
      'STC2024003': {
        'Session 1': { 'Paper 1': 76, 'Paper 2': 82, 'Practical': 40 },
        'Session 2': { 'Paper 1': 58, 'Paper 2': 85, 'Practical': 43 },
        'Session 3': { 'Paper 1': 88, 'Paper 2': 42, 'Paper 3': 20, 'Paper 4': 44, 'Practical': 45 },
        'Session 4': { 'Paper 1': 79, 'Practical': 41, 'Interview': 82 }
      }
    };
  }

  delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getCandidates() {
    await this.delay(400);
    return {
      success: true,
      data: this.mockCandidates
    };
  }

  async getCandidateByTicket(ticketNumber) {
    await this.delay(200);
    const candidate = this.mockCandidates.find(c => c.ticketNumber === ticketNumber);
    if (!candidate) {
      throw new Error(`Candidate with ticket number ${ticketNumber} not found`);
    }
    return {
      success: true,
      data: candidate
    };
  }

  async getMarksheetData(ticketNumber) {
    await this.delay(300);
    const data = this.mockMarksData[ticketNumber];
    if (!data) {
      throw new Error(`No marksheet data found for ticket number ${ticketNumber}`);
    }
    return {
      success: true,
      data
    };
  }

  async getFailedSubjects(ticketNumber) {
    await this.delay(250);
    const candidate = this.mockCandidates.find(c => c.ticketNumber === ticketNumber);
    const marksheet = this.mockMarksData[ticketNumber];
    const structure = courseStructure[candidate.courseCode];

    const failedSubjects = [];
    const passingPercentage = 60;

    Object.entries(structure).forEach(([session, papers]) => {
      Object.entries(papers).forEach(([paper, config]) => {
        const paperMarks = marksheet[session]?.[paper];
        const passingMarks = Math.ceil(config.maxMarks * (passingPercentage / 100));

        if (paperMarks !== undefined && paperMarks < passingMarks) {
          failedSubjects.push({
            session,
            paper,
            subjects: config.subjects,
            obtainedMarks: paperMarks,
            maxMarks: config.maxMarks,
            passingMarks,
            percentage: ((paperMarks / config.maxMarks) * 100).toFixed(1),
            shortfall: passingMarks - paperMarks
          });
        }
      });
    });

    return {
      success: true,
      data: failedSubjects
    };
  }

  async validateMarksheetData(ticketNumber) {
    await this.delay(200);
    return {
      success: true,
      data: {
        valid: true,
        errors: [],
        warnings: []
      }
    };
  }

  async exportMarksheetPDF(ticketNumber, options = {}) {
    await this.delay(500);
    const fileName = `Marksheet_${ticketNumber}_${options.sessionWise ? 'Sessional' : 'Complete'}_${new Date().toISOString().split('T')[0]}.pdf`;
    return {
      success: true,
      message: 'PDF export initiated successfully',
      data: {
        fileName,
        downloadUrl: `/downloads/${fileName}`
      }
    };
  }
}

// Create service instance
const marksheetService = new MarksheetService();

const Marksheet = () => {
  // State management - optimized
  const [searchMethod, setSearchMethod] = useState('ticket');
  const [ticketNumber, setTicketNumber] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [candidateData, setCandidateData] = useState(null);
  const [marksheetData, setMarksheetData] = useState({});
  const [failedSubjects, setFailedSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [viewMode, setViewMode] = useState('complete');
  const [selectedSession, setSelectedSession] = useState('all');
  const marksheetRef = useRef();

  // Optimized handlers with useCallback
  const loadCandidates = useCallback(async () => {
    setLoading(true);
    try {
      const result = await marksheetService.getCandidates();
      setCandidates(result.data || []);
    } catch (error) {
      console.error('Failed to load candidates:', error);
      setMessage({ type: 'error', text: 'Failed to load candidates' });
    } finally {
      setLoading(false);
    }
  }, []);

  const loadCandidateData = useCallback(async (candidate) => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Validate candidate first
      const validation = await marksheetService.validateMarksheetData(candidate.ticketNumber);
      if (!validation.data.valid) {
        throw new Error(validation.data.errors.join(', '));
      }

      setCandidateData(candidate);

      // Load marksheet data
      const marks = await marksheetService.getMarksheetData(candidate.ticketNumber);
      setMarksheetData(marks.data);

      // Load failed subjects
      const failed = await marksheetService.getFailedSubjects(candidate.ticketNumber);
      setFailedSubjects(failed.data);

      setMessage({ type: 'success', text: `Marksheet loaded for: ${candidate.name}` });
    } catch (error) {
      console.error('Failed to load candidate data:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to load candidate data' });
      setCandidateData(null);
      setMarksheetData({});
      setFailedSubjects([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const resetForm = useCallback(() => {
    setTicketNumber('');
    setSelectedCandidate('');
    setCandidateData(null);
    setMarksheetData({});
    setFailedSubjects([]);
    setMessage({ type: '', text: '' });
    setSelectedSession('all');
  }, []);

  // Load candidates for dropdown
  useEffect(() => {
    if (searchMethod === 'dropdown') {
      loadCandidates();
    }
  }, [searchMethod, loadCandidates]);

  const handleSearchCandidate = useCallback(async () => {
    if (!ticketNumber.trim()) {
      setMessage({ type: 'error', text: 'Please enter a ticket number' });
      return;
    }

    try {
      const result = await marksheetService.getCandidateByTicket(ticketNumber);
      await loadCandidateData(result.data);
    } catch (error) {
      console.error('Failed to search candidate:', error);
      setMessage({ type: 'error', text: error.message });
      setCandidateData(null);
      setMarksheetData({});
      setFailedSubjects([]);
    }
  }, [ticketNumber, loadCandidateData]);

  const handleCandidateSelect = useCallback(async (candidateId) => {
    if (!candidateId) {
      setCandidateData(null);
      setMarksheetData({});
      setFailedSubjects([]);
      return;
    }

    const candidate = candidates.find(c => c.id === parseInt(candidateId));
    if (candidate) {
      setTicketNumber(candidate.ticketNumber);
      await loadCandidateData(candidate);
    }
  }, [candidates, loadCandidateData]);

  const handlePrintMarksheet = useCallback(() => {
    if (!marksheetRef.current || !candidateData) {
      setMessage({ type: 'error', text: 'No marksheet data available for printing' });
      return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      setMessage({ type: 'error', text: 'Unable to open print window. Please check popup settings.' });
      return;
    }

    const printContent = marksheetRef.current.cloneNode(true);

    // Apply print-specific styles to ensure consistent output
    printContent.style.cssText = `
      background: white !important;
      color: black !important;
      font-family: 'Times New Roman', serif !important;
      font-size: 14px !important;
      line-height: 1.4 !important;
      width: 100% !important;
      padding: 20px !important;
      margin: 0 !important;
      box-sizing: border-box !important;
      box-shadow: none !important;
      border-radius: 0 !important;
      border: none !important;
    `;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Marksheet - ${candidateData.name} (${candidateData.ticketNumber})</title>
          <style>
            @page {
              size: A4;
              margin: 15mm;
            }
            @media print {
              * {
                -webkit-print-color-adjust: exact !important;
                color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              body {
                margin: 0 !important;
                padding: 0 !important;
                background: white !important;
                font-family: 'Times New Roman', serif !important;
                font-size: 14px !important;
                line-height: 1.4 !important;
                color: black !important;
              }
              .no-print {
                display: none !important;
              }
              table {
                border-collapse: collapse !important;
                page-break-inside: auto !important;
              }
              tr {
                page-break-inside: avoid !important;
                page-break-after: auto !important;
              }
              thead {
                display: table-header-group !important;
              }
              tfoot {
                display: table-footer-group !important;
              }
            }
            body {
              margin: 0;
              padding: 0;
              background: white;
              font-family: 'Times New Roman', serif;
              font-size: 14px;
              line-height: 1.4;
              color: black;
            }
          </style>
        </head>
        <body>
          ${printContent.outerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    // Wait for images to load, then print
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 1000);
  }, [candidateData]);

  const handleExportPDF = async () => {
    if (!marksheetRef.current || !candidateData) {
      setMessage({ type: 'error', text: 'No marksheet data available for export' });
      return;
    }

    setGenerating(true);
    setMessage({ type: '', text: '' });

    try {
      // Call backend API first for logging/analytics
      const result = await marksheetService.exportMarksheetPDF(
        candidateData.ticketNumber,
        { sessionWise: viewMode === 'sessionWise' }
      );

      // Clone the element and add print-specific styling for better PDF output
      const element = marksheetRef.current;
      const clonedElement = element.cloneNode(true);

      // Apply print-specific styles to the clone
      clonedElement.style.cssText = `
        background: white !important;
        color: black !important;
        font-family: 'Times New Roman', serif !important;
        font-size: 14px !important;
        line-height: 1.4 !important;
        width: 210mm !important;
        padding: 15mm !important;
        margin: 0 !important;
        box-sizing: border-box !important;
      `;

      // Create a temporary container
      const container = document.createElement('div');
      container.style.cssText = `
        position: fixed;
        top: -9999px;
        left: -9999px;
        width: 210mm;
        background: white;
        font-family: 'Times New Roman', serif;
      `;
      container.appendChild(clonedElement);
      document.body.appendChild(container);

      // Generate canvas with high quality settings
      const canvas = await html2canvas(clonedElement, {
        scale: 3, // Higher scale for better quality
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        imageTimeout: 30000,
        removeContainer: false,
        foreignObjectRendering: true,
        width: 794, // A4 width in pixels at 96 DPI
        height: 1123, // A4 height in pixels at 96 DPI
        windowWidth: 794,
        windowHeight: 1123,
        scrollX: 0,
        scrollY: 0,
        ignoreElements: (element) => {
          // Ignore any non-essential elements
          return element.classList?.contains('no-print') || false;
        }
      });

      // Clean up temporary container
      document.body.removeChild(container);

      // Create PDF with exact A4 dimensions
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      // Calculate dimensions to fit A4 page with margins
      const pageWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const margin = 10; // 10mm margin
      const contentWidth = pageWidth - (2 * margin);
      const contentHeight = pageHeight - (2 * margin);

      // Calculate scaling to fit content
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(contentWidth / (imgWidth * 0.264583), contentHeight / (imgHeight * 0.264583));

      const finalWidth = imgWidth * 0.264583 * ratio;
      const finalHeight = imgHeight * 0.264583 * ratio;

      // Center the content on the page
      const x = (pageWidth - finalWidth) / 2;
      const y = margin;

      // Add image to PDF
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      pdf.addImage(imgData, 'JPEG', x, y, finalWidth, finalHeight, undefined, 'FAST');

      // Save the PDF
      const fileName = result.data?.fileName || `Marksheet_${candidateData.ticketNumber}_${viewMode === 'sessionWise' ? 'Sessional' : 'Complete'}_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);

      setMessage({ type: 'success', text: 'PDF exported successfully!' });
    } catch (error) {
      console.error('PDF Export Error:', error);
      setMessage({ type: 'error', text: 'Failed to export PDF. Please try again.' });
    } finally {
      setGenerating(false);
    }
  };

  // Helper functions with useMemo for optimization
  const calculateTotalMarks = useMemo(() => {
    if (!marksheetData || !candidateData) return { total: 0, maxTotal: 0 };

    const structure = courseStructure[candidateData.courseCode];
    let total = 0;
    let maxTotal = 0;

    Object.entries(structure).forEach(([session, papers]) => {
      if (selectedSession === 'all' || selectedSession === session) {
        Object.entries(papers).forEach(([paper, config]) => {
          const marks = marksheetData[session]?.[paper] || 0;
          total += marks;
          maxTotal += config.maxMarks;
        });
      }
    });

    return { total, maxTotal };
  }, [marksheetData, candidateData, selectedSession]);

  const getPassingMarks = useCallback((maxMarks) => Math.ceil(maxMarks * 0.6), []);

  // Computed values with useMemo
  const currentCourseStructure = useMemo(() =>
    candidateData ? courseStructure[candidateData.courseCode] : null,
    [candidateData]
  );

  const { total, maxTotal } = calculateTotalMarks;
  const percentage = useMemo(() =>
    maxTotal > 0 ? ((total / maxTotal) * 100).toFixed(2) : 0,
    [total, maxTotal]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200 w-full">
        <div className="w-full px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/stc-management"
                className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200 group"
              >
                <ArrowLeft className="w-4 h-4 text-gray-600 group-hover:text-gray-800" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  Generate Marksheet
                </h1>
                <p className="text-gray-600 text-sm">
                  View and generate trainee marksheets
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
              <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                <Search className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Search Candidate</h2>
                <p className="text-gray-600 text-sm">Find trainee to generate marksheet</p>
              </div>
            </div>

            {/* Search Method Selection */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setSearchMethod('ticket')}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${searchMethod === 'ticket'
                  ? 'bg-orange-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                Search by Ticket Number
              </button>
              <button
                onClick={() => setSearchMethod('dropdown')}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${searchMethod === 'dropdown'
                  ? 'bg-orange-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                Select from Dropdown
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
                    placeholder="Enter ticket number (e.g., STC2024001)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearchCandidate()}
                  />
                </div>
              ) : (
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Select Candidate
                  </label>
                  <select
                    value={selectedCandidate}
                    onChange={(e) => {
                      setSelectedCandidate(e.target.value);
                      handleCandidateSelect(e.target.value);
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    disabled={loading}
                  >
                    <option value="">Select a candidate...</option>
                    {candidates.map(candidate => (
                      <option key={candidate.id} value={candidate.id}>
                        {candidate.ticketNumber} - {candidate.name} ({candidate.courseCode})
                      </option>
                    ))}
                  </select>
                  {loading && searchMethod === 'dropdown' && (
                    <p className="text-sm text-gray-500 mt-2">Loading candidates...</p>
                  )}
                </div>
              )}

              <div className="flex gap-3">
                {searchMethod === 'ticket' && (
                  <button
                    onClick={handleSearchCandidate}
                    disabled={loading || !ticketNumber.trim()}
                    className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
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
                  <AlertTriangle className="w-6 h-6" />
                )}
                <span className="font-medium">{message.text}</span>
              </div>
            )}
          </div>

          {/* Marksheet Controls */}
          {candidateData && (
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Marksheet Options</h2>
                    <p className="text-gray-600 text-sm">Choose view mode and generate marksheet</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handlePrintMarksheet}
                    className="flex items-center gap-2 px-4 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <Printer className="w-5 h-5" />
                    Print
                  </button>
                  <button
                    onClick={handleExportPDF}
                    disabled={generating || !candidateData}
                    className="flex items-center gap-2 px-4 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    {generating ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Download className="w-5 h-5" />
                    )}
                    {generating ? 'Exporting...' : 'Export PDF'}
                  </button>
                </div>
              </div>

              {/* View Mode Selection */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    View Mode
                  </label>
                  <select
                    value={viewMode}
                    onChange={(e) => setViewMode(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="complete">Complete Marksheet (Annual)</option>
                    <option value="sessionWise">Sessional Marksheet</option>
                  </select>
                </div>

                {viewMode === 'sessionWise' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Select Session
                    </label>
                    <select
                      value={selectedSession}
                      onChange={(e) => setSelectedSession(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="all">All Sessions</option>
                      {currentCourseStructure && Object.keys(currentCourseStructure).map(session => (
                        <option key={session} value={session}>{session}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="flex items-end">
                  <div className="bg-orange-50 p-4 rounded-xl border border-orange-200 w-full">
                    <p className="text-sm font-semibold text-orange-700">Total Marks</p>
                    <p className="text-2xl font-bold text-orange-900">{total}/{maxTotal}</p>
                    <p className="text-sm text-orange-600">{percentage}%</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Marksheet Display */}
          {candidateData && (
            <div
              ref={marksheetRef}
              style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e5e7eb',
                padding: '24px',
                marginBottom: '32px',
                fontFamily: 'Times New Roman, serif',
                fontSize: '14px',
                lineHeight: '1.4',
                color: 'black'
              }}
            >
              {/* Header - Exact format from image */}
              <div style={{
                borderBottom: '2px solid #6b7280',
                paddingBottom: '16px',
                marginBottom: '24px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                  position: 'relative',
                  width: '100%'
                }}>
                  {/* Railway Logo */}
                  <div style={{
                    position: 'absolute',
                    left: '0',
                    width: '100px',
                    height: '100px',
                    backgroundColor: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: '0',
                    padding: '4px'
                  }}>
                    <img
                      src={railwayLogo}
                      alt="Indian Railways Logo"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div style={{
                      textAlign: 'center',
                      display: 'none',
                      flexDirection: 'column',
                      fontSize: '10px',
                      fontWeight: 'bold'
                    }}>
                      <div>INDIAN</div>
                      <div>RAILWAYS</div>
                      <div>LOGO</div>
                    </div>
                  </div>

                  {/* Header text - Centered */}
                  <div style={{
                    textAlign: 'center',
                    flex: '1',
                    paddingLeft: '100px',
                    paddingRight: '100px'
                  }}>
                    <h1 style={{
                      fontSize: '18px',
                      fontWeight: 'bold',
                      color: 'black',
                      margin: '0 0 4px 0'
                    }}>INDIAN RAILWAYS</h1>
                    <h2 style={{
                      fontSize: '13px',
                      fontWeight: '600',
                      color: 'black',
                      margin: '0 0 4px 0'
                    }}>ZONAL RAILWAY TRAINING INSTITUTE</h2>
                    <h3 style={{
                      fontSize: '15px',
                      fontWeight: 'bold',
                      color: 'black',
                      margin: '8px 0 4px 0'
                    }}>STATEMENT OF MARKS</h3>
                    {viewMode === 'sessionWise' && selectedSession !== 'all' && (
                      <h4 style={{
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#374151',
                        margin: '2px 0 0 0'
                      }}>({selectedSession} - Sessional)</h4>
                    )}
                    {viewMode === 'complete' && (
                      <h4 style={{
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#374151',
                        margin: '2px 0 0 0'
                      }}>(Complete/Annual)</h4>
                    )}
                  </div>
                </div>
              </div>

              {/* Candidate Information - Exact format from image */}
              <div style={{ marginBottom: '24px' }}>
                <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0' }}>
                  <tbody>
                    <tr>
                      <td style={{
                        padding: '4px 0',
                        fontWeight: '600',
                        color: 'black',
                        fontSize: '14px'
                      }}>Name: {candidateData.name}</td>
                      <td style={{
                        padding: '4px 0',
                        fontWeight: '600',
                        color: 'black',
                        textAlign: 'right',
                        fontSize: '14px'
                      }}>Father's Name: {candidateData.fatherName}</td>
                    </tr>
                    <tr>
                      <td style={{
                        padding: '4px 0',
                        fontWeight: '600',
                        color: 'black',
                        fontSize: '14px'
                      }}>Batch: {candidateData.batch}</td>
                      <td style={{
                        padding: '4px 0',
                        fontWeight: '600',
                        color: 'black',
                        textAlign: 'right',
                        fontSize: '14px'
                      }}>Roll No: {candidateData.rollNo}</td>
                    </tr>
                    <tr>
                      <td style={{
                        padding: '4px 0',
                        fontWeight: '600',
                        color: 'black',
                        fontSize: '14px'
                      }}>Post: {candidateData.post}</td>
                      <td style={{
                        padding: '4px 0',
                        fontWeight: '600',
                        color: 'black',
                        textAlign: 'right',
                        fontSize: '14px'
                      }}>Module: {candidateData.courseCode}</td>
                    </tr>
                    <tr>
                      <td style={{
                        padding: '4px 0',
                        fontWeight: '600',
                        color: 'black',
                        fontSize: '14px'
                      }}>Stream: {candidateData.stream}</td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Marks Table */}
              {currentCourseStructure && (
                <div style={{ marginBottom: '32px' }}>
                  <table style={{
                    width: '100%',
                    border: '2px solid black',
                    borderCollapse: 'collapse'
                  }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f3f4f6' }}>
                        <th style={{
                          border: '1px solid black',
                          padding: '8px 12px',
                          fontSize: '13px',
                          fontWeight: 'bold',
                          color: 'black',
                          textAlign: 'center'
                        }}>Session</th>
                        <th style={{
                          border: '1px solid black',
                          padding: '8px 12px',
                          fontSize: '13px',
                          fontWeight: 'bold',
                          color: 'black',
                          textAlign: 'center'
                        }}>Paper</th>
                        <th style={{
                          border: '1px solid black',
                          padding: '8px 12px',
                          fontSize: '13px',
                          fontWeight: 'bold',
                          color: 'black',
                          textAlign: 'center'
                        }}>Subjects</th>
                        <th style={{
                          border: '1px solid black',
                          padding: '8px 12px',
                          fontSize: '13px',
                          fontWeight: 'bold',
                          color: 'black',
                          textAlign: 'center'
                        }}>Max Marks</th>
                        <th style={{
                          border: '1px solid black',
                          padding: '8px 12px',
                          fontSize: '13px',
                          fontWeight: 'bold',
                          color: 'black',
                          textAlign: 'center'
                        }}>Obtained</th>
                        <th style={{
                          border: '1px solid black',
                          padding: '8px 12px',
                          fontSize: '13px',
                          fontWeight: 'bold',
                          color: 'black',
                          textAlign: 'center'
                        }}>%</th>
                        <th style={{
                          border: '1px solid black',
                          padding: '8px 12px',
                          fontSize: '13px',
                          fontWeight: 'bold',
                          color: 'black',
                          textAlign: 'center'
                        }}>Result</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(currentCourseStructure).map(([session, papers]) => {
                        if (viewMode === 'sessionWise' && selectedSession !== 'all' && selectedSession !== session) {
                          return null;
                        }

                        return Object.entries(papers).map(([paper, config], paperIndex) => {
                          const marks = marksheetData[session]?.[paper] || 0;
                          const percentage = ((marks / config.maxMarks) * 100).toFixed(1);
                          const passingMarks = getPassingMarks(config.maxMarks);
                          const isPassed = marks >= passingMarks;

                          return (
                            <tr key={`${session}-${paper}`} style={{
                              backgroundColor: !isPassed ? '#fef2f2' : 'white'
                            }}>
                              {paperIndex === 0 && (
                                <td style={{
                                  border: '1px solid black',
                                  padding: '8px 12px',
                                  fontWeight: '600',
                                  color: 'black',
                                  textAlign: 'center',
                                  verticalAlign: 'top',
                                  fontSize: '13px'
                                }} rowSpan={Object.keys(papers).length}>
                                  {session}
                                </td>
                              )}
                              <td style={{
                                border: '1px solid black',
                                padding: '8px 12px',
                                fontSize: '13px',
                                color: 'black'
                              }}>{paper}</td>
                              <td style={{
                                border: '1px solid black',
                                padding: '8px 12px',
                                fontSize: '11px',
                                color: 'black',
                                textAlign: 'center'
                              }}>
                                {config.subjects.length > 0 ? config.subjects.join(', ') : '-'}
                              </td>
                              <td style={{
                                border: '1px solid black',
                                padding: '8px 12px',
                                fontSize: '13px',
                                fontWeight: '600',
                                color: 'black',
                                textAlign: 'center'
                              }}>
                                {config.maxMarks}
                              </td>
                              <td style={{
                                border: '1px solid black',
                                padding: '8px 12px',
                                fontSize: '13px',
                                fontWeight: 'bold',
                                textAlign: 'center',
                                color: !isPassed ? '#dc2626' : 'black'
                              }}>
                                {marks}
                              </td>
                              <td style={{
                                border: '1px solid black',
                                padding: '8px 12px',
                                fontSize: '13px',
                                textAlign: 'center',
                                color: !isPassed ? '#dc2626' : 'black'
                              }}>
                                {percentage}%
                              </td>
                              <td style={{
                                border: '1px solid black',
                                padding: '8px 12px',
                                fontSize: '13px',
                                fontWeight: '600',
                                textAlign: 'center',
                                color: !isPassed ? '#dc2626' : '#16a34a'
                              }}>
                                {isPassed ? 'PASS' : 'FAIL'}
                              </td>
                            </tr>
                          );
                        });
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Summary Section - Exact format from image */}
              <div style={{
                marginBottom: '32px',
                border: '2px solid #d1d5db',
                backgroundColor: '#f9fafb'
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  borderRight: '0'
                }}>
                  <div style={{
                    padding: '16px',
                    textAlign: 'center',
                    borderRight: '2px solid #d1d5db'
                  }}>
                    <h3 style={{
                      fontSize: '13px',
                      fontWeight: 'bold',
                      color: 'black',
                      margin: '0 0 4px 0'
                    }}>TOTAL MARKS</h3>
                    <p style={{
                      fontSize: '20px',
                      fontWeight: 'bold',
                      color: 'black',
                      margin: '0'
                    }}>{total}/{maxTotal}</p>
                  </div>
                  <div style={{
                    padding: '16px',
                    textAlign: 'center'
                  }}>
                    <h3 style={{
                      fontSize: '13px',
                      fontWeight: 'bold',
                      color: 'black',
                      margin: '0 0 4px 0'
                    }}>FINAL PERCENTAGE</h3>
                    <p style={{
                      fontSize: '20px',
                      fontWeight: 'bold',
                      color: 'black',
                      margin: '0'
                    }}>{percentage}%</p>
                  </div>
                </div>

                {/* Failed Subjects Disclaimer - Exact format from image */}
                {failedSubjects.length > 0 && (
                  <div style={{
                    borderTop: '2px solid #d1d5db',
                    padding: '16px',
                    textAlign: 'center'
                  }}>
                    <p style={{
                      color: '#dc2626',
                      fontWeight: 'bold',
                      fontSize: '13px',
                      margin: '0 0 4px 0'
                    }}>
                      Disclaimer: Candidate has failed in subject(s): {' '}
                      {failedSubjects.map(subject =>
                        subject.subjects.length > 0 ? subject.subjects.join(', ') : `${subject.session} - ${subject.paper}`
                      ).join(', ')}
                    </p>
                    <p style={{
                      color: '#dc2626',
                      fontSize: '11px',
                      margin: '0'
                    }}>
                      Passing criteria: 60% or above required in each subject.
                    </p>
                  </div>
                )}
              </div>

              {/* Footer - Exact format from image */}
              <div style={{
                borderTop: '2px solid #6b7280',
                paddingTop: '24px'
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '32px'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{
                      fontWeight: '600',
                      color: 'black',
                      fontSize: '13px',
                      margin: '0'
                    }}>Senior Lecturer (IC)</p>
                    <div style={{ height: '48px', marginTop: '32px' }}></div>
                    <div style={{
                      borderTop: '2px solid black',
                      width: '128px',
                      margin: '0 auto'
                    }}></div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{
                      fontWeight: '600',
                      color: 'black',
                      fontSize: '13px',
                      margin: '0'
                    }}>Director</p>
                    <div style={{ height: '48px', marginTop: '32px' }}></div>
                    <div style={{
                      borderTop: '2px solid black',
                      width: '128px',
                      margin: '0 auto'
                    }}></div>
                    <p style={{
                      fontSize: '11px',
                      color: '#6b7280',
                      fontStyle: 'italic',
                      marginTop: '8px',
                      margin: '8px 0 0 0'
                    }}>
                      Date of Generation: {new Date().toLocaleDateString("en-IN")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* No candidate selected message */}
          {!candidateData && !loading && (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-200">
              <div className="w-20 h-20 bg-gray-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FileText className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">No Candidate Selected</h3>
              <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
                Please search for a candidate using their ticket number or select from the dropdown to view their marksheet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Marksheet;