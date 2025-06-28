import React, { useState, useEffect } from 'react'
import { ArrowLeft, FileText, User, Search, Printer } from 'lucide-react'
import { Link } from 'react-router-dom'

const Marksheet = () => {
  const [selectedCandidate, setSelectedCandidate] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [candidates, setCandidates] = useState([])
  const [marksheetData, setMarksheetData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Fetch candidates on component mount
  useEffect(() => {
    fetchCandidates()
  }, [])

  // Fetch marksheet data when candidate is selected
  useEffect(() => {
    if (selectedCandidate) {
      fetchMarksheetData(selectedCandidate)
    } else {
      setMarksheetData(null)
    }
  }, [selectedCandidate])

  // API calls
  const fetchCandidates = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/candidates/with-marks')
      if (!response.ok) throw new Error('Failed to fetch candidates')
      const data = await response.json()
      setCandidates(data)
    } catch (err) {
      setError('Failed to load candidates')
      console.error('Error fetching candidates:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchMarksheetData = async (candidateId) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/marksheet/${candidateId}`)
      if (!response.ok) throw new Error('Failed to fetch marksheet data')
      const data = await response.json()
      setMarksheetData(data)
    } catch (err) {
      setError('Failed to load marksheet data')
      console.error('Error fetching marksheet:', err)
    } finally {
      setLoading(false)
    }
  }

  // Filter candidates based on search term
  const filteredCandidates = candidates.filter(candidate => 
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.ticketNo.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Handle search input change
  const handleSearchChange = (value) => {
    setSearchTerm(value)
    setShowDropdown(true)
    
    // Auto-select if exact match found
    const exactMatch = candidates.find(candidate => 
      candidate.ticketNo.toLowerCase() === value.toLowerCase()
    )
    if (exactMatch && value !== '') {
      setSelectedCandidate(exactMatch.id)
      setShowDropdown(false)
    } else if (value === '') {
      setSelectedCandidate('')
    }
  }

  // Handle candidate selection
  const handleCandidateSelect = (candidate) => {
    setSelectedCandidate(candidate.id)
    setSearchTerm(`${candidate.name} (${candidate.ticketNo})`)
    setShowDropdown(false)
  }

  // Print functionality
  const handlePrint = () => {
    const printStyle = document.createElement('style')
    printStyle.textContent = `
      @media print {
        body * { visibility: hidden; }
        .print-only-marksheet, .print-only-marksheet * { visibility: visible; }
        .print-only-marksheet {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
        }
        .marksheet-container {
          transform: scale(0.8);
          transform-origin: top left;
          margin: 0;
          padding: 5mm;
        }
      }
    `
    document.head.appendChild(printStyle)
    window.print()
    setTimeout(() => document.head.removeChild(printStyle), 1000)
  }

  const renderMarksheet = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center h-96 text-center p-8">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
          <p className="text-gray-500 mt-4">Loading...</p>
        </div>
      )
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-96 text-center p-8">
          <FileText size={64} className="text-red-300 mb-4" />
          <h3 className="text-xl font-semibold text-red-600 mb-2">Error</h3>
          <p className="text-red-500">{error}</p>
        </div>
      )
    }

    if (!selectedCandidate) {
      return (
        <div className="flex flex-col items-center justify-center h-96 text-center p-8">
          <User size={64} className="text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Candidate Selected</h3>
          <p className="text-gray-500">Please select a candidate to view their marksheet</p>
        </div>
      )
    }

    if (!marksheetData) {
      return (
        <div className="flex flex-col items-center justify-center h-96 text-center p-8">
          <FileText size={64} className="text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Data Available</h3>
          <p className="text-gray-500">No marksheet data available for selected candidate</p>
        </div>
      )
    }

    return (
      <div className="p-6">
        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mb-6 print:hidden">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            <Printer size={20} />
            Print Marksheet
          </button>
        </div>

        {/* Print-ready marksheet */}
        <div className="print-only-marksheet">
          <div className="bg-white border-2 border-black marksheet-container" style={{width: '210mm', minHeight: '297mm'}}>
            {/* Header */}
            <div className="border-b-2 border-black">
              <div className="flex items-center p-6 bg-white">
                <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mr-6">
                  <span className="text-white font-bold text-xl">IR</span>
                </div>
                <div className="text-center flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">INDIAN RAILWAYS</h1>
                  <p className="text-base text-gray-800 font-semibold">ZONAL RAILWAY TRAINING INSTITUTE</p>
                  <p className="text-sm font-bold text-gray-700 mt-2 tracking-wider">STATEMENT OF MARKS</p>
                </div>
              </div>
            </div>

            {/* Student Information */}
            <div className="border-b-2 border-black">
              <div className="grid grid-cols-3 gap-4 p-6 bg-white">
                <div className="col-span-2 space-y-2">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">Name of Trainee</p>
                      <p className="text-base font-semibold text-black border-b border-black pb-1">{marksheetData.candidate?.name}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">Father's Name</p>
                      <p className="text-base font-semibold text-black border-b border-black pb-1">{marksheetData.fathersName}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">Ticket No.</p>
                      <p className="text-base font-semibold text-black border-b border-black pb-1">{marksheetData.ticketNo}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">Batch</p>
                      <p className="text-base font-semibold text-black border-b border-black pb-1">{marksheetData.candidate?.batch}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">Designation</p>
                      <p className="text-sm text-black border-b border-black pb-1">{marksheetData.candidate?.designation}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">Course</p>
                      <p className="text-base font-semibold text-black border-b border-black pb-1">{marksheetData.course}</p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center items-start">
                  <div className="text-center">
                    <div className="border-2 border-black p-1 bg-white">
                      <img 
                        src={marksheetData.candidate?.photo} 
                        alt={`${marksheetData.candidate?.name} Photo`} 
                        className="w-24 h-28 object-cover grayscale"
                      />
                    </div>
                    <p className="text-xs font-bold text-gray-700 mt-1 uppercase tracking-wide">Trainee Photo</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Marks Table */}
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-white border-2 border-black">
                      <th className="border-2 border-black px-4 py-2 text-left font-bold text-sm text-black">Paper</th>
                      <th className="border-2 border-black px-4 py-2 text-center font-bold text-sm text-black">Subjects</th>
                      <th className="border-2 border-black px-4 py-2 text-center font-bold text-sm text-black">Marks Obtained</th>
                      <th className="border-2 border-black px-4 py-2 text-center font-bold text-sm text-black">Maximum Marks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {marksheetData.sessions && Object.entries(marksheetData.sessions).map(([sessionKey, sessionData]) => (
                      <React.Fragment key={sessionKey}>
                        {/* Session Header */}
                        <tr>
                          <td colSpan="4" className="border-2 border-black px-6 py-3 font-bold text-black text-left text-lg bg-white">
                            {sessionData.sessionName}
                          </td>
                        </tr>
                        
                        {/* Papers */}
                        {sessionData.papers && sessionData.papers.map((paper, paperIndex) => {
                          const isFailure = typeof paper.marksObtained === 'number' && paper.marksObtained < (paper.maxMarks * 0.6)
                          const isEmpty = paper.isEmpty || paper.marksObtained === '-'
                          
                          return (
                            <tr key={paperIndex} className={`${isFailure ? 'bg-red-100 border-red-300' : 'bg-white'} transition-colors`}>
                              <td className="border border-black px-3 py-2 font-semibold text-black text-sm">{paper.paperNo}</td>
                              <td className="border border-black px-3 py-2 text-center text-black text-sm">{paper.subjects}</td>
                              <td className={`border border-black px-3 py-2 text-center font-bold text-sm ${
                                isFailure ? 'text-red-600' : isEmpty ? 'text-gray-500' : 'text-black'
                              }`}>
                                {paper.marksObtained}
                              </td>
                              <td className="border border-black px-3 py-2 text-center font-semibold text-black text-sm">{paper.maxMarks}</td>
                            </tr>
                          )
                        })}
                        
                        {/* Practical */}
                        {sessionData.practical && (() => {
                          const isFailure = typeof sessionData.practical.marksObtained === 'number' && 
                                           sessionData.practical.marksObtained < (sessionData.practical.maxMarks * 0.6)
                          const isEmpty = sessionData.practical.isEmpty || sessionData.practical.marksObtained === '-'
                          
                          return (
                            <tr className={`${isFailure ? 'bg-red-100 border-red-300' : 'bg-white'} transition-colors`}>
                              <td className="border border-black px-3 py-2 font-semibold text-black text-sm">PRACTICAL</td>
                              <td className="border border-black px-3 py-2 text-center text-gray-600 italic text-sm">Hands-on Assessment</td>
                              <td className={`border border-black px-3 py-2 text-center font-bold text-sm ${
                                isFailure ? 'text-red-600' : isEmpty ? 'text-gray-500' : 'text-black'
                              }`}>
                                {sessionData.practical.marksObtained}
                              </td>
                              <td className="border border-black px-3 py-2 text-center font-semibold text-black text-sm">{sessionData.practical.maxMarks}</td>
                            </tr>
                          )
                        })()}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Summary Section */}
            <div className="border-t-2 border-black">
              <div className="grid grid-cols-3 gap-4 p-4 bg-white">
                <div className="text-center border-2 border-black bg-white p-3">
                  <p className="text-xs font-bold text-black uppercase tracking-wider mb-2">Total Marks Obtained</p>
                  <p className="text-2xl font-bold text-black">{marksheetData.total}</p>
                </div>
                <div className="text-center border-2 border-black bg-white p-3">
                  <p className="text-xs font-bold text-black uppercase tracking-wider mb-2">Final Percentage</p>
                  <p className="text-2xl font-bold text-black">{marksheetData.percentage}</p>
                </div>
                <div className="text-center border-2 border-black bg-white p-3">
                  <p className="text-xs font-bold text-black uppercase tracking-wider mb-2">Result Status</p>
                  <p className={`text-xl font-bold ${
                    marksheetData.disclaimer?.includes('failed') ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {marksheetData.disclaimer?.includes('failed') ? 'FAILED' : 'PASSED'}
                  </p>
                </div>
              </div>
            </div>

            {/* Remarks */}
            <div className="border-t-2 border-black bg-white">
              <div className="p-4">
                <h3 className="text-base font-bold text-black mb-3 uppercase tracking-wide">Remarks & Disclaimer</h3>
                <div className="space-y-2">
                  <p className={`font-semibold text-sm ${
                    marksheetData.disclaimer?.includes('failed') ? 'text-red-700' : 'text-green-700'
                  }`}>
                    Status: {marksheetData.disclaimer}
                  </p>
                  <p className="text-black text-sm">
                    <span className="font-semibold">Note:</span> {marksheetData.passingCriteria}
                  </p>
                  <p className="text-xs text-black italic">
                    This is a computer-generated statement of marks. Any discrepancy should be reported to the training department within 7 days of issue.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white p-4">
      {/* Print styles */}
      <style jsx>{`
        @media print {
          body { margin: 0; padding: 0; }
          
          /* Hide everything except the marksheet */
          .print\\:hidden { display: none !important; }
          .print\\:block { display: block !important; }
          
          /* Only show the marksheet container */
          .print-only-marksheet {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            background: white !important;
            z-index: 9999 !important;
          }
          
          /* Ensure the marksheet fits on one page */
          .marksheet-container {
            width: 100% !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 10mm !important;
            box-sizing: border-box !important;
            transform: scale(0.85) !important;
            transform-origin: top left !important;
          }
          
          /* Remove shadows and borders for print */
          .bg-white { background: white !important; }
          .shadow-2xl { box-shadow: none !important; }
          .border-2 { border-width: 1px !important; }
          
          /* Optimize table for print */
          table { page-break-inside: avoid !important; }
          tr { page-break-inside: avoid !important; }
          
          /* Ensure text is readable */
          * { color-adjust: exact !important; -webkit-print-color-adjust: exact !important; }
        }
      `}</style>
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link to="/stc-management" className="flex items-center gap-2 hover:text-orange-800 transition-colors" style={{color: '#ff8128'}}>
              <ArrowLeft size={20} />
              <span className="font-medium">Back to STC Management</span>
            </Link>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <FileText size={20} />
            <span className="font-semibold">Marksheet Management</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Panel - Controls */}
          <div className="lg:col-span-1 space-y-6">
            {/* Candidate Selection */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <User size={20} style={{color: '#ff8128'}} />
                Select Candidate
              </h3>
              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search by name or ticket number..."
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    onFocus={(e) => {
                      setShowDropdown(true)
                      e.target.style.borderColor = '#ff8128'
                    }}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
                    style={{'--tw-ring-color': '#ff8128'}}
                  />
                </div>
                
                {/* Dropdown */}
                {showDropdown && filteredCandidates.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredCandidates.map(candidate => (
                      <div
                        key={candidate.id}
                        onClick={() => handleCandidateSelect(candidate)}
                        className="p-3 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors hover:bg-orange-50"
                      >
                        <div className="font-medium text-gray-800">{candidate.name}</div>
                        <div className="text-sm text-gray-500">{candidate.ticketNo} • {candidate.course}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {selectedCandidate && (
                <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="text-sm font-medium text-orange-700">Selected Candidate:</div>
                  <div className="text-orange-600 font-semibold">
                    {candidates.find(c => c.id === selectedCandidate)?.name} ({candidates.find(c => c.id === selectedCandidate)?.ticketNo})
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Marksheet Display */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[600px]">
              {renderMarksheet()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Marksheet
