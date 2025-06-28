import React, { useState } from 'react'
import { ArrowLeft, FileText, User, Search } from 'lucide-react'
import { Link } from 'react-router-dom'

const Marksheet = () => {
  const [viewType, setViewType] = useState('overall')
  const [selectedCandidate, setSelectedCandidate] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [filteredCandidates, setFilteredCandidates] = useState([])

  // Mock data for candidates from FeedMark.jsx
  const candidates = [
    { id: 1, name: 'Rahul Sharma', ticketNo: 'ASE00001', designation: 'Assistant Signal Engineer', batch: 'MSE', stream: 'Coach and Wagon(C&W)', course: 'MSE-C&W', photo: '/api/placeholder/100/120' },
    { id: 2, name: 'Priya Singh', ticketNo: 'AJE00001', designation: 'Assistant Junior Engineer', batch: 'MJR', stream: 'Diesel(D)', course: 'MJR-D', photo: '/api/placeholder/100/120' },
    { id: 3, name: 'Amit Kumar', ticketNo: 'MSE00001', designation: 'Mechanical Supervisor Engineer', batch: 'MSE', stream: 'Coach and Wagon(C&W)', course: 'MSE-C&W', photo: '/api/placeholder/100/120' },
    { id: 4, name: 'Sneha Patel', ticketNo: 'MJR00001', designation: 'Mechanical Junior Engineer', batch: 'MJR', stream: 'Coach and Wagon(C&W)', course: 'MJR-C&W', photo: '/api/placeholder/100/120' },
    { id: 5, name: 'Vikram Singh', ticketNo: 'MSE00002', designation: 'Mechanical Supervisor Engineer', batch: 'MSE', stream: 'Diesel(D)', course: 'MSE-D', photo: '/api/placeholder/100/120' },
    { id: 6, name: 'Anita Verma', ticketNo: 'MJI00001', designation: 'Mechanical Junior Inspector', batch: 'MJI', stream: 'Coach and Wagon(C&W)', course: 'MJI-C&W', photo: '/api/placeholder/100/120' },
    { id: 7, name: 'Rajesh Kumar', ticketNo: 'MJP00001', designation: 'Mechanical Junior Programmer', batch: 'MJP', stream: 'W(Workshop)', course: 'MJP-W', photo: '/api/placeholder/100/120' },
    { id: 8, name: 'Sunita Yadav', ticketNo: 'ASE00002', designation: 'Assistant Signal Engineer', batch: 'MSE', stream: 'W(Workshop)', course: 'MSE-W', photo: '/api/placeholder/100/120' },
    { id: 9, name: 'Deepak Gupta', ticketNo: 'AJE00002', designation: 'Assistant Junior Engineer', batch: 'MJR', stream: 'W(Workshop)', course: 'MJR-W', photo: '/api/placeholder/100/120' },
    { id: 10, name: 'Kavita Sharma', ticketNo: 'MSE00003', designation: 'Mechanical Supervisor Engineer', batch: 'MSE', stream: 'Coach and Wagon(C&W)', course: 'MSE-C&W', photo: '/api/placeholder/100/120' },
    { id: 11, name: 'Manish Agarwal', ticketNo: 'MJR00002', designation: 'Mechanical Junior Engineer', batch: 'MJR', stream: 'Diesel(D)', course: 'MJR-D', photo: '/api/placeholder/100/120' },
    { id: 12, name: 'Pooja Mishra', ticketNo: 'MJI00002', designation: 'Mechanical Junior Inspector', batch: 'MJI', stream: 'Diesel(D)', course: 'MJI-D', photo: '/api/placeholder/100/120' },
  ]

  // Filter candidates based on search term
  const filterCandidates = (term) => {
    if (!term) return candidates
    return candidates.filter(candidate => 
      candidate.name.toLowerCase().includes(term.toLowerCase()) ||
      candidate.ticketNo.toLowerCase().includes(term.toLowerCase())
    )
  }

  // Handle search input change
  const handleSearchChange = (value) => {
    setSearchTerm(value)
    setFilteredCandidates(filterCandidates(value))
    setShowDropdown(true)
    
    // If exact match found, auto-select
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

  // Get selected candidate name for display
  const getSelectedCandidateName = () => {
    if (!selectedCandidate) return ''
    const candidate = candidates.find(c => c.id === parseInt(selectedCandidate))
    return candidate ? `${candidate.name} (${candidate.ticketNo})` : ''
  }

  // Mock marksheet data structure based on FeedMark structure
  const mockMarksheetData = {
    1: { // Rahul Sharma
      candidate: candidates[0],
      fathersName: 'Mr. Rajesh Sharma',
      ticketNo: 'ASE00001',
      course: 'MSE-C&W',
      sessions: {
        session1: {
          theory: [
            { code: 'MRT-01', marksObtained: 75, maxMarks: 100 },
            { code: 'MRT-06', marksObtained: 82, maxMarks: 100 },
            { code: 'MRT-02', marksObtained: 68, maxMarks: 100 },
            { code: 'MRT-03', marksObtained: 72, maxMarks: 100 },
            { code: 'MRT-04', marksObtained: 79, maxMarks: 100 },
            { code: 'MRT-05', marksObtained: 74, maxMarks: 100 },
          ],
          practical: [
            { code: 'PRAC-1', marksObtained: 45, maxMarks: 50 },
          ]
        },
        session2: {
          theory: [
            { code: 'MRT-07', marksObtained: 55, maxMarks: 75 },
            { code: 'MRT-09', marksObtained: 65, maxMarks: 75 },
            { code: 'MCT-01', marksObtained: 78, maxMarks: 100 },
          ],
          practical: [
            { code: 'PRAC-2', marksObtained: 42, maxMarks: 50 },
          ]
        },
        session3: {
          theory: [
            { code: 'MCT-02/I', marksObtained: 85, maxMarks: 100 },
            { code: 'MCT-02/II', marksObtained: 35, maxMarks: 50 },
            { code: 'MRT-08', marksObtained: 20, maxMarks: 25 },
            { code: 'MRT-11', marksObtained: 42, maxMarks: 50 },
          ],
          practical: [
            { code: 'PRAC-3', marksObtained: 46, maxMarks: 50 },
          ]
        },
        session4: {
          theory: [
            { code: 'MRT-12', marksObtained: 88, maxMarks: 100 },
          ],
          practical: [
            { code: 'PRAC-4', marksObtained: 47, maxMarks: 50 },
          ],
          interview: [
            { code: 'INT-1', marksObtained: 85, maxMarks: 100 },
          ]
        }
      },
      totalMarks: '1103/1400',
      finalPercentage: '78.79%',
      disclaimer: 'Candidate has failed in subject(s): MCT-02/II, MRT-11',
      passingCriteria: 'Passing criteria: 60% or above required in each subject.'
    },
    2: { // Priya Singh
      candidate: candidates[1],
      fathersName: 'Mr. Suresh Singh',
      ticketNo: 'AJE00001',
      course: 'MJR-D',
      sessions: {
        session1: {
          theory: [
            { code: 'MRT-01', marksObtained: 88, maxMarks: 100 },
            { code: 'MRT-06', marksObtained: 92, maxMarks: 100 },
            { code: 'MRT-02', marksObtained: 85, maxMarks: 100 },
            { code: 'MRT-03', marksObtained: 78, maxMarks: 100 },
            { code: 'MRT-04', marksObtained: 82, maxMarks: 100 },
            { code: 'MRT-05', marksObtained: 79, maxMarks: 100 },
          ],
          practical: [
            { code: 'PRAC-1', marksObtained: 47, maxMarks: 50 },
          ]
        },
        session2: {
          theory: [
            { code: 'MRT-07', marksObtained: 65, maxMarks: 75 },
            { code: 'MRT-09', marksObtained: 58, maxMarks: 75 },
            { code: 'MDT-01', marksObtained: 72, maxMarks: 100 },
          ],
          practical: [
            { code: 'PRAC-2', marksObtained: 35, maxMarks: 50 },
          ]
        }
      },
      totalMarks: '951/1200',
      finalPercentage: '79.25%',
      disclaimer: 'Candidate has failed in subject(s): PRAC-2',
      passingCriteria: 'Passing criteria: 60% or above required in each subject.'
    }
  }

  const renderOverallMarksheet = () => {
    if (!selectedCandidate) {
      return (
        <div className="flex flex-col items-center justify-center h-96 text-center p-8">
          <User size={64} className="text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Candidate Selected</h3>
          <p className="text-gray-500">Please select a candidate to view their marksheet</p>
        </div>
      )
    }

    const candidateData = mockMarksheetData[parseInt(selectedCandidate)]
    if (!candidateData) {
      return (
        <div className="flex flex-col items-center justify-center h-96 text-center p-8">
          <FileText size={64} className="text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Data Available</h3>
          <p className="text-gray-500">No marksheet data available for selected candidate</p>
        </div>
      )
    }

    const candidate = candidateData.candidate
    
    return (
      <div className="p-6">
        {/* Print-ready marksheet */}
        <div className="bg-white border border-gray-300 max-w-4xl mx-auto shadow-lg">
          {/* Header */}
          <div className="flex items-center p-6 border-b border-gray-300">
            <img src="/api/placeholder/80/80" alt="Indian Railways Logo" className="w-20 h-20 mr-6" />
            <div className="text-center flex-1">
              <h1 className="text-2xl font-bold text-gray-800">INDIAN RAILWAYS</h1>
              <p className="text-base text-gray-600">ZONAL RAILWAY TRAINING INSTITUTE</p>
              <p className="text-base font-semibold text-gray-700 mt-1">STATEMENT OF MARKS</p>
            </div>
          </div>

          {/* Student Info */}
          <div className="grid grid-cols-3 gap-6 p-6 border-b border-gray-300 text-sm bg-gray-50">
            <div className="space-y-2">
              <p><span className="font-semibold text-gray-700">Name:</span> <span className="text-gray-800">{candidate?.name}</span></p>
              <p><span className="font-semibold text-gray-700">Batch:</span> <span className="text-gray-800">{candidate?.batch}</span></p>
              <p><span className="font-semibold text-gray-700">Designation:</span> <span className="text-gray-800">{candidate?.designation}</span></p>
              <p><span className="font-semibold text-gray-700">Stream:</span> <span className="text-gray-800">{candidate?.stream}</span></p>
            </div>
            <div className="space-y-2">
              <p><span className="font-semibold text-gray-700">Father's Name:</span> <span className="text-gray-800">{candidateData.fathersName}</span></p>
              <p><span className="font-semibold text-gray-700">Ticket No:</span> <span className="text-gray-800">{candidateData.ticketNo}</span></p>
              <p><span className="font-semibold text-gray-700">Course:</span> <span className="text-gray-800">{candidateData.course}</span></p>
            </div>
            <div className="flex justify-center">
              <div className="text-center">
                <img 
                  src={candidate?.photo} 
                  alt={`${candidate?.name} Photo`} 
                  className="w-24 h-28 object-cover border-2 border-gray-300 rounded mb-2 shadow-sm"
                />
                <p className="text-xs text-gray-600 font-medium">Candidate Photo</p>
              </div>
            </div>
          </div>

          {/* Marks Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{backgroundColor: '#ff8128'}} className="text-white">
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">SUBJECT CODE</th>
                  <th className="border border-gray-300 px-4 py-3 font-semibold">MARKS OBTAINED</th>
                  <th className="border border-gray-300 px-4 py-3 font-semibold">MAXIMUM MARKS</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(candidateData.sessions).map(([sessionKey, sessionData], sessionIndex) => (
                  <React.Fragment key={sessionKey}>
                    {/* Session Header */}
                    <tr style={{backgroundColor: '#ff8128', opacity: 0.2}} className="bg-opacity-20">
                      <td colSpan="3" className="border border-gray-300 px-4 py-2 font-bold" style={{color: '#ff8128'}}>
                        Session {sessionIndex + 1}
                      </td>
                    </tr>
                    
                    {/* Theory Section */}
                    {sessionData.theory && sessionData.theory.length > 0 && (
                      <>
                        <tr className="bg-gray-100">
                          <td colSpan="3" className="border border-gray-300 px-4 py-2 font-semibold text-gray-700">THEORY</td>
                        </tr>
                        {sessionData.theory.map((subject, index) => (
                          <tr key={index} className={`${subject.marksObtained < (subject.maxMarks * 0.6) ? 'bg-red-50' : 'bg-white'} hover:bg-gray-50 transition-colors`}>
                            <td className="border border-gray-300 px-4 py-2 font-medium text-gray-800">{subject.code}</td>
                            <td className="border border-gray-300 px-4 py-2 text-center font-semibold">{subject.marksObtained}</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">{subject.maxMarks}</td>
                          </tr>
                        ))}
                      </>
                    )}
                    
                    {/* Practical Section */}
                    {sessionData.practical && sessionData.practical.length > 0 && (
                      <>
                        <tr className="bg-gray-100">
                          <td colSpan="3" className="border border-gray-300 px-4 py-2 font-semibold text-gray-700">PRACTICAL</td>
                        </tr>
                        {sessionData.practical.map((subject, index) => (
                          <tr key={index} className={`${subject.marksObtained < (subject.maxMarks * 0.6) ? 'bg-red-50' : 'bg-white'} hover:bg-gray-50 transition-colors`}>
                            <td className="border border-gray-300 px-4 py-2 font-medium text-gray-800">{subject.code}</td>
                            <td className="border border-gray-300 px-4 py-2 text-center font-semibold">{subject.marksObtained}</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">{subject.maxMarks}</td>
                          </tr>
                        ))}
                      </>
                    )}
                    
                    {/* Interview Section */}
                    {sessionData.interview && sessionData.interview.length > 0 && (
                      <>
                        <tr className="bg-gray-100">
                          <td colSpan="3" className="border border-gray-300 px-4 py-2 font-semibold text-gray-700">INTERVIEW</td>
                        </tr>
                        {sessionData.interview.map((subject, index) => (
                          <tr key={index} className={`${subject.marksObtained < (subject.maxMarks * 0.6) ? 'bg-red-50' : 'bg-white'} hover:bg-gray-50 transition-colors`}>
                            <td className="border border-gray-300 px-4 py-2 font-medium text-gray-800">{subject.code}</td>
                            <td className="border border-gray-300 px-4 py-2 text-center font-semibold">{subject.marksObtained}</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">{subject.maxMarks}</td>
                          </tr>
                        ))}
                      </>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-2 gap-6 p-6 border-t border-gray-300" style={{backgroundColor: '#ff8128', opacity: 0.1}}>
            <div className="text-center">
              <p className="font-semibold text-gray-700 mb-2">TOTAL MARKS</p>
              <p className="text-2xl font-bold" style={{color: '#ff8128'}}>{candidateData.totalMarks}</p>
            </div>
            <div className="text-center">
              <p className="font-semibold text-gray-700 mb-2">FINAL PERCENTAGE</p>
              <p className="text-2xl font-bold text-green-600">{candidateData.finalPercentage}</p>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="p-6 border-t border-gray-300 text-center bg-yellow-50">
            <p className="text-red-600 font-semibold mb-2">
              Disclaimer: {candidateData.disclaimer}
            </p>
            <p className="text-gray-600">
              {candidateData.passingCriteria}
            </p>
          </div>

          {/* Footer */}
          <div className="grid grid-cols-3 gap-6 p-6 border-t border-gray-300 text-center bg-gray-50">
            <div>
              <p className="font-semibold text-gray-700 mb-3">Checked by</p>
              <div className="h-12 border-b border-gray-400"></div>
            </div>
            <div>
              <p className="font-semibold text-gray-700 mb-1">Principal / Director</p>
              <p className="text-sm text-gray-600 mb-2">Govt. of Chandigarh : 25/06/2023</p>
              <div className="h-8 border-b border-gray-400"></div>
            </div>
            <div>
              <p className="font-semibold text-gray-700 mb-3">Prepared by</p>
              <div className="h-12 border-b border-gray-400"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 p-4">
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
            {/* View Type Selection */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FileText size={20} style={{color: '#ff8128'}} />
                Marksheet Type
              </h3>
              <div className="space-y-3">
                <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    value="overall"
                    checked={viewType === 'overall'}
                    onChange={(e) => setViewType(e.target.value)}
                    className="mr-3"
                    style={{accentColor: '#ff8128'}}
                  />
                  <span className="font-medium text-gray-700">Overall Marksheet</span>
                </label>
                <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    value="session-wise"
                    checked={viewType === 'session-wise'}
                    onChange={(e) => setViewType(e.target.value)}
                    className="mr-3"
                    style={{accentColor: '#ff8128'}}
                  />
                  <span className="font-medium text-gray-700">Session-wise Marksheet</span>
                </label>
              </div>
            </div>

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
                        className="p-3 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                        style={{'&:hover': {backgroundColor: '#ff8128', opacity: 0.1}}}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#ff812820'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                      >
                        <div className="font-medium text-gray-800">{candidate.name}</div>
                        <div className="text-sm text-gray-500">{candidate.ticketNo} • {candidate.course}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {selectedCandidate && (
                <div className="mt-4 p-3 rounded-lg" style={{backgroundColor: '#ff8128', opacity: 0.1}}>
                  <div className="text-sm font-medium" style={{color: '#ff8128'}}>Selected Candidate:</div>
                  <div style={{color: '#ff8128', opacity: 0.8}}>{getSelectedCandidateName()}</div>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Marksheet Display */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[600px]">
              {viewType === 'session-wise' ? (
                <div className="flex flex-col items-center justify-center h-96 text-center p-8">
                  <FileText size={64} className="text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">Session-wise Marksheet</h3>
                  <p className="text-gray-500">This feature will be implemented in the future.</p>
                </div>
              ) : (
                renderOverallMarksheet()
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Marksheet
