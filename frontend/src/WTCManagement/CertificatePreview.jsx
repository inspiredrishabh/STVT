import React, { useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Download, Printer } from 'lucide-react';
import html2pdf from 'html2pdf.js';

const CertificatePreview = () => {
  const location = useLocation();
  const certificateRef = useRef(null);
  const queryParams = new URLSearchParams(location.search);

  // Get trainee data from URL params
  const traineeId = queryParams.get('traineeId');
  const ticketNo = queryParams.get('ticketNo');
  const traineeName = queryParams.get('name');
  const trade = queryParams.get('trade');
  const fromDate = queryParams.get('from') ? new Date(queryParams.get('from')) : null;
  const toDate = queryParams.get('to') ? new Date(queryParams.get('to')) : null;

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

  // Calculate duration in weeks
  const calculateDuration = () => {
    if (!fromDate || !toDate) return 'N/A';

    const diffTime = Math.abs(toDate - fromDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.ceil(diffDays / 7);

    return `${diffWeeks} Weeks`;
  };

  // Export to PDF
  const exportToPdf = () => {
    const element = certificateRef.current;
    const opt = {
      margin: [10, 10, 10, 10],
      filename: `Certificate_${ticketNo}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header with back button and actions */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <Link
              to="/wtc/certificate"
              className="flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4 text-gray-600" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">Certificate Preview</h1>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={exportToPdf}
              className="flex items-center space-x-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export as PDF</span>
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center space-x-2 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* Certificate Container */}
        <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
          <div ref={certificateRef} className="certificate">
            <div className="certificate border-4 border-double border-gray-800 p-8 bg-white">
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold uppercase">Workshop Training Center</h1>
                <h2 className="text-xl font-bold uppercase">Northern Railway - Charbagh, Lucknow</h2>
                <div className="text-lg mt-2">Certificate of Completion</div>
              </div>

              <div className="text-center mb-8">
                <p className="text-lg">This is to certify that</p>
                <p className="text-xl font-bold mt-2">{traineeName}</p>
                <p className="text-lg mt-2">Ticket No: {ticketNo}</p>
                <p className="text-lg mt-2">has successfully completed</p>
                <p className="text-xl font-bold mt-2">{trade}</p>
                <p className="text-lg">Module</p>
                <p className="text-lg mt-2">from</p>
                <p className="text-lg font-semibold mt-1">
                  {formatDate(fromDate)} to {formatDate(toDate)}
                </p>
                <p className="text-lg mt-2">Duration: {calculateDuration()}</p>
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
        </div>
      </div>

      {/* Add CSS for PDF printing */}
      <style jsx="true">{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    .certificate, .certificate * {
                        visibility: visible;
                    }
                    .certificate {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        padding: 40px;
                    }
                }
            `}</style>
    </div>
  );
};

export default CertificatePreview;