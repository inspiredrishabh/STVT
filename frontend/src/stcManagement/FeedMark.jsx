import React, { useState, useEffect } from 'react'
import { ArrowLeft, Save, RotateCcw, CheckCircle, AlertCircle, ClipboardList, Search, X, User } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { mockTraineeMarksData, calculateOverallMarks } from '../utils/marksUtils'

const FeedMark = () => {
  const [searchParams] = useSearchParams()
  
  // Get URL parameters
  const traineeIdFromUrl = searchParams.get('traineeId')
  const traineeNameFromUrl = searchParams.get('name')
  const ticketNoFromUrl = searchParams.get('ticketNo')
  // Mock trainee data with course assignments
  const trainees = [
    { id: 1, name: 'Rahul Sharma', ticketNo: 'ASE00001', course: 'MSE-C' },
    { id: 2, name: 'Priya Singh', ticketNo: 'AJE00001', course: 'MJR-D' },
    { id: 3, name: 'Amit Kumar', ticketNo: 'MSE00001', course: 'MSE-C' },
    { id: 4, name: 'Sneha Patel', ticketNo: 'MJR00001', course: 'MJR-C' },
    { id: 5, name: 'Vikram Singh', ticketNo: 'MSE00002', course: 'MSE-D' },
    { id: 6, name: 'Anita Verma', ticketNo: 'MJI00001', course: 'MJI-C' },
    { id: 7, name: 'Rajesh Kumar', ticketNo: 'MJP00001', course: 'MJP-C' },
    { id: 8, name: 'Sunita Yadav', ticketNo: 'ASE00002', course: 'MSE-W' },
    { id: 9, name: 'Deepak Gupta', ticketNo: 'AJE00002', course: 'MJR-W' },
    { id: 10, name: 'Kavita Sharma', ticketNo: 'MSE00003', course: 'MSE-C' },
    { id: 11, name: 'Manish Agarwal', ticketNo: 'MJR00002', course: 'MJR-D' },
    { id: 12, name: 'Pooja Mishra', ticketNo: 'MJI00002', course: 'MJI-D' },
  ]

  const [selectedCourse, setSelectedCourse] = useState('')
  const [selectedTrainee, setSelectedTrainee] = useState('')
  const [marks, setMarks] = useState({})
  const [savedSessions, setSavedSessions] = useState(new Set())
  const [searchTerm, setSearchTerm] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [filteredTrainees, setFilteredTrainees] = useState(trainees)
  const [supplementStatus, setSupplementStatus] = useState({})

  // Initialize trainee selection from URL parameters
  useEffect(() => {
    if (traineeIdFromUrl) {
      const foundTrainee = trainees.find(t => t.id === parseInt(traineeIdFromUrl))
      if (foundTrainee) {
        setSelectedTrainee(foundTrainee.id)
        setSelectedCourse(foundTrainee.course)
        setSearchTerm(foundTrainee.name)
        setShowDropdown(false)
        
        // Load existing marks data if available
        const existingData = mockTraineeMarksData[foundTrainee.id]
        if (existingData) {
          setMarks(existingData.marks || {})
          setSavedSessions(new Set(existingData.savedSessions || []))
          setSupplementStatus(existingData.supplementStatus || {})
        }
      }
    }
  }, [traineeIdFromUrl])

  // Calculate overall marks from session marks - remove duplicate function since it's imported // Track supplement clearance

  // Filter trainees based on search term
  const filterTrainees = (term) => {
    if (!term) return trainees
    return trainees.filter(trainee => 
      trainee.name.toLowerCase().includes(term.toLowerCase()) ||
      trainee.ticketNo.toLowerCase().includes(term.toLowerCase())
    )
  }

  // Handle search input change
  const handleSearchChange = (value) => {
    setSearchTerm(value)
    setFilteredTrainees(filterTrainees(value))
    setShowDropdown(true)
    
    // If exact match found, auto-select
    const exactMatch = trainees.find(trainee => 
      trainee.ticketNo.toLowerCase() === value.toLowerCase()
    )
    if (exactMatch && value !== '') {
      setSelectedTrainee(exactMatch.id)
      setShowDropdown(false)
    } else if (value === '') {
      setSelectedTrainee('')
    }
  }

  // Handle trainee selection
  const handleTraineeSelect = (trainee) => {
    setSelectedTrainee(trainee.id)
    setSearchTerm(`${trainee.name} (${trainee.ticketNo})`)
    setShowDropdown(false)
    
    // Auto-load existing marks and supplement status if available
    const existingData = mockTraineeMarksData[trainee.id]
    if (existingData) {
      setMarks(existingData.marks || {})
      setSavedSessions(new Set(existingData.savedSessions || []))
      setSupplementStatus(existingData.supplementStatus || {})
      // Auto-select the trainee's course
      setSelectedCourse(existingData.course || trainee.course)
    } else {
      setMarks({})
      setSavedSessions(new Set())
      setSupplementStatus({})
      // Auto-select trainee's assigned course
      setSelectedCourse(trainee.course)
    }
  }

  // Get selected trainee name for display
  const getSelectedTraineeName = () => {
    if (!selectedTrainee) return ''
    const trainee = trainees.find(t => t.id === parseInt(selectedTrainee))
    return trainee ? `${trainee.name} (${trainee.ticketNo})` : ''
  }

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
    },
    'MSE-W': {
      'Session 1': {
        'Paper 1': { maxMarks: 100, subjects: ['MRT-01', 'MRT-06'] },
        'Paper 2': { maxMarks: 100, subjects: ['MRT-02', 'MRT-03', 'MRT-04', 'MRT-05'] },
        'Practical': { maxMarks: 50, subjects: [] }
      },
      'Session 2': {
        'Paper 1': { maxMarks: 75, subjects: ['MRT-07', 'MRT-09'] },
        'Paper 2': { maxMarks: 100, subjects: ['MWT-01'] },
        'Practical': { maxMarks: 50, subjects: [] }
      },
      'Session 3': {
        'Paper 1': { maxMarks: 100, subjects: ['MWT-02'] },
        'Paper 2': { maxMarks: 50, subjects: ['MWT-04'] },
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
    'MJR-C&W': {
      'Session 1': {
        'Paper 1': { maxMarks: 100, subjects: ['MRT-01', 'MRT-06'] },
        'Paper 2': { maxMarks: 100, subjects: ['MRT-02', 'MRT-03', 'MRT-04', 'MRT-05'] },
        'Practical': { maxMarks: 50, subjects: [] }
      },
      'Session 2': {
        'Paper 1': { maxMarks: 75, subjects: ['MRT-07', 'MRT-09', 'MRT-10'] },
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
    'MJR-D': {
      'Session 1': {
        'Paper 1': { maxMarks: 100, subjects: ['MRT-01', 'MRT-06'] },
        'Paper 2': { maxMarks: 100, subjects: ['MRT-02', 'MRT-03', 'MRT-04', 'MRT-05'] },
        'Practical': { maxMarks: 50, subjects: [] }
      },
      'Session 2': {
        'Paper 1': { maxMarks: 75, subjects: ['MRT-07', 'MRT-09', 'MRT-10'] },
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
    },
    'MJR-W': {
      'Session 1': {
        'Paper 1': { maxMarks: 100, subjects: ['MRT-01', 'MRT-06'] },
        'Paper 2': { maxMarks: 100, subjects: ['MRT-02', 'MRT-03', 'MRT-04', 'MRT-05'] },
        'Practical': { maxMarks: 50, subjects: [] }
      },
      'Session 2': {
        'Paper 1': { maxMarks: 75, subjects: ['MRT-07', 'MRT-09', 'MRT-10'] },
        'Paper 2': { maxMarks: 100, subjects: ['MWT-01'] },
        'Practical': { maxMarks: 50, subjects: [] }
      },
      'Session 3': {
        'Paper 1': { maxMarks: 100, subjects: ['MWT-02'] },
        'Paper 2': { maxMarks: 50, subjects: ['MWT-04'] },
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
    'MJI-C&W': {
      'Session 1': {
        'Paper 1': { maxMarks: 100, subjects: ['MRT-01', 'MRT-02'] },
        'Paper 2': { maxMarks: 100, subjects: ['MET-01'] },
        'Paper 3': { maxMarks: 100, subjects: ['MET-02'] },
        'Paper 4': { maxMarks: 100, subjects: ['MET-03'] },
        'Paper 5': { maxMarks: 100, subjects: ['MET-04'] },
        'Paper 6': { maxMarks: 100, subjects: ['MET-05'] },
        'Paper 7': { maxMarks: 100, subjects: ['MET-08'] }
      },
      'Session 2': {
        'Paper 1': { maxMarks: 100, subjects: ['MET-06'] },
        'Paper 2': { maxMarks: 100, subjects: ['MET-07'] },
        'Paper 3': { maxMarks: 100, subjects: ['MET-09'] },
        'Paper 4': { maxMarks: 100, subjects: ['MET-10'] },
        'Paper 5': { maxMarks: 50, subjects: ['MET-11'] },
        'Paper 6': { maxMarks: 25, subjects: ['MRT-08'] },
        'Paper 7': { maxMarks: 50, subjects: ['MRT-11'] },
        'Paper 8': { maxMarks: 50, subjects: ['MRT-13'] }
      },
      'Session 3': {
        'Paper 1': { maxMarks: 125, subjects: ['MRT-06', 'MRT-07', 'MRT-09', 'MRT-14', 'MRT-15'] },
        'Paper 2': { maxMarks: 100, subjects: ['MCT-01'] }
      },
      'Session 4': {
        'Paper 1': { maxMarks: 100, subjects: ['MCT-02/I'] },
        'Paper 2': { maxMarks: 100, subjects: ['MCT-02/II'] },
        'Practical': { maxMarks: 50, subjects: [] },
        'Interview': { maxMarks: 50, subjects: [] }
      }
    },
    'MJI-D': {
      'Session 1': {
        'Paper 1': { maxMarks: 100, subjects: ['MRT-01', 'MRT-02'] },
        'Paper 2': { maxMarks: 100, subjects: ['MET-01'] },
        'Paper 3': { maxMarks: 100, subjects: ['MET-02'] },
        'Paper 4': { maxMarks: 100, subjects: ['MET-03'] },
        'Paper 5': { maxMarks: 100, subjects: ['MET-04'] },
        'Paper 6': { maxMarks: 100, subjects: ['MET-05'] },
        'Paper 7': { maxMarks: 100, subjects: ['MET-08'] }
      },
      'Session 2': {
        'Paper 1': { maxMarks: 100, subjects: ['MET-06'] },
        'Paper 2': { maxMarks: 100, subjects: ['MET-07'] },
        'Paper 3': { maxMarks: 100, subjects: ['MET-09'] },
        'Paper 4': { maxMarks: 100, subjects: ['MET-10'] },
        'Paper 5': { maxMarks: 50, subjects: ['MET-11'] },
        'Paper 6': { maxMarks: 25, subjects: ['MRT-08'] },
        'Paper 7': { maxMarks: 50, subjects: ['MRT-11'] },
        'Paper 8': { maxMarks: 50, subjects: ['MRT-13'] }
      },
      'Session 3': {
        'Paper 1': { maxMarks: 125, subjects: ['MRT-06', 'MRT-07', 'MRT-09', 'MRT-14', 'MRT-15'] },
        'Paper 2': { maxMarks: 100, subjects: ['MDT-01'] }
      },
      'Session 4': {
        'Paper 1': { maxMarks: 100, subjects: ['MDT-03 M/E'] },
        'Paper 2': { maxMarks: 100, subjects: ['MDT-04 M/E'] },
        'Practical': { maxMarks: 50, subjects: [] },
        'Interview': { maxMarks: 50, subjects: [] }
      }
    },
    'MJI-W': {
      'Session 1': {
        'Paper 1': { maxMarks: 100, subjects: ['MRT-01', 'MRT-02'] },
        'Paper 2': { maxMarks: 100, subjects: ['MET-01'] },
        'Paper 3': { maxMarks: 100, subjects: ['MET-02'] },
        'Paper 4': { maxMarks: 100, subjects: ['MET-03'] },
        'Paper 5': { maxMarks: 100, subjects: ['MET-04'] },
        'Paper 6': { maxMarks: 100, subjects: ['MET-05'] },
        'Paper 7': { maxMarks: 100, subjects: ['MET-08'] }
      },
      'Session 2': {
        'Paper 1': { maxMarks: 100, subjects: ['MET-06'] },
        'Paper 2': { maxMarks: 100, subjects: ['MET-07'] },
        'Paper 3': { maxMarks: 100, subjects: ['MET-09'] },
        'Paper 4': { maxMarks: 100, subjects: ['MET-10'] },
        'Paper 5': { maxMarks: 50, subjects: ['MET-11'] },
        'Paper 6': { maxMarks: 25, subjects: ['MRT-08'] },
        'Paper 7': { maxMarks: 50, subjects: ['MRT-10'] },
        'Paper 8': { maxMarks: 50, subjects: ['MRT-13'] }
      },
      'Session 3': {
        'Paper 1': { maxMarks: 125, subjects: ['MRT-06', 'MRT-07', 'MRT-09', 'MRT-14', 'MRT-15'] },
        'Paper 2': { maxMarks: 100, subjects: ['MWT-03/I'] }
      },
      'Session 4': {
        'Paper 1': { maxMarks: 100, subjects: ['MWT-03/II'] },
        'Paper 2': { maxMarks: 100, subjects: ['MWT-04'] },
        'Practical': { maxMarks: 50, subjects: [] },
        'Interview': { maxMarks: 50, subjects: [] }
      }
    },
    'MJP-C&W': {
      'Session 1': {
        'Paper 1': { maxMarks: 150, subjects: ['MRT-14', 'MRT-16', 'MRT-17', 'MRT-18', 'MRT-19'] },
        'Paper 2': { maxMarks: 150, subjects: ['MET-12', 'MET-13', 'MET-14'] },
        'Practical': { maxMarks: 50, subjects: [] }
      },
      'Session 2': {
        'Paper 1': { maxMarks: 100, subjects: ['MCT-03', 'MCT-04'] },
        'Practical': { maxMarks: 50, subjects: [] },
        'Interview': { maxMarks: 50, subjects: [] }
      }
    },
    'MJP-D': {
      'Session 1': {
        'Paper 1': { maxMarks: 150, subjects: ['MRT-14', 'MRT-16', 'MRT-17', 'MRT-18', 'MRT-19'] },
        'Paper 2': { maxMarks: 150, subjects: ['MET-12', 'MET-13', 'MET-14'] },
        'Practical': { maxMarks: 50, subjects: [] }
      },
      'Session 2': {
        'Paper 1': { maxMarks: 100, subjects: ['MDT-05 M/E'] },
        'Practical': { maxMarks: 50, subjects: [] },
        'Interview': { maxMarks: 50, subjects: [] }
      }
    },
    'MJP-W': {
      'Session 1': {
        'Paper 1': { maxMarks: 150, subjects: ['MRT-14', 'MRT-16', 'MRT-17', 'MRT-18', 'MRT-19'] },
        'Paper 2': { maxMarks: 150, subjects: ['MET-12', 'MET-13', 'MET-14'] }
      },
      'Session 2': {
        'Paper 1': { maxMarks: 100, subjects: ['MWT-05'] },
        'Practical': { maxMarks: 50, subjects: [] },
        'Interview': { maxMarks: 50, subjects: [] }
      }
    }
  }

  const handleMarkChange = (sessionName, paperName, value) => {
    const numValue = parseInt(value) || 0
    const maxMarks = courseStructure[selectedCourse]?.[sessionName]?.[paperName]?.maxMarks || 0
    
    if (numValue <= maxMarks) {
      setMarks(prev => ({
        ...prev,
        [`${sessionName}-${paperName}`]: numValue
      }))
      // Remove from saved sessions when marks are modified
      setSavedSessions(prev => {
        const newSet = new Set(prev)
        newSet.delete(sessionName)
        return newSet
      })
    }
  }

  const saveSession = (sessionName) => {
    if (!selectedTrainee || !selectedCourse) {
      alert('Please select both trainee and course')
      return
    }
    
    // Simulate saving to backend
    setSavedSessions(prev => new Set([...prev, sessionName]))
    
    // Here you would typically make an API call to save the marks
    console.log('Saving session:', sessionName, 'for trainee:', selectedTrainee)
  }

  const resetSession = (sessionName) => {
    const sessionKeys = Object.keys(marks).filter(key => key.startsWith(`${sessionName}-`))
    const newMarks = { ...marks }
    sessionKeys.forEach(key => delete newMarks[key])
    setMarks(newMarks)
    setSavedSessions(prev => {
      const newSet = new Set(prev)
      newSet.delete(sessionName)
      return newSet
    })
  }

  const getSessionTotal = (sessionName) => {
    if (!courseStructure[selectedCourse]?.[sessionName]) return { obtained: 0, total: 0 }
    
    const papers = courseStructure[selectedCourse][sessionName]
    let obtained = 0
    let total = 0
    
    Object.entries(papers).forEach(([paperName, paperData]) => {
      const markKey = `${sessionName}-${paperName}`
      obtained += marks[markKey] || 0
      total += paperData.maxMarks
    })
    
    return { obtained, total }
  }

  // Check if a paper is a supplement (less than 60%)
  const isPaperSupplement = (sessionName, paperName) => {
    const markKey = `${sessionName}-${paperName}`
    const currentMark = marks[markKey] || 0
    const maxMarks = courseStructure[selectedCourse]?.[sessionName]?.[paperName]?.maxMarks || 0
    if (!currentMark || !maxMarks) return false
    const percentage = (currentMark / maxMarks) * 100
    return percentage < 60
  }

  // Get all supplement papers for the selected course
  const getSupplementPapers = () => {
    if (!selectedCourse || !courseStructure[selectedCourse]) return []
    
    const supplements = []
    Object.entries(courseStructure[selectedCourse]).forEach(([sessionName, papers]) => {
      Object.entries(papers).forEach(([paperName, paperData]) => {
        if (isPaperSupplement(sessionName, paperName)) {
          const markKey = `${sessionName}-${paperName}`
          const currentMark = marks[markKey] || 0
          const percentage = ((currentMark / paperData.maxMarks) * 100).toFixed(1)
          
          supplements.push({
            sessionName,
            paperName,
            currentMark,
            maxMarks: paperData.maxMarks,
            percentage,
            key: markKey,
            isCleared: supplementStatus[markKey] || false
          })
        }
      })
    })
    return supplements
  }

  // Toggle supplement clearance status
  const toggleSupplementStatus = (supplementKey) => {
    setSupplementStatus(prev => ({
      ...prev,
      [supplementKey]: !prev[supplementKey]
    }))
  }

  const renderMarksForm = () => {
    if (!selectedCourse || !selectedTrainee) return null

    const course = courseStructure[selectedCourse]
    
    return (
      <div className="space-y-8">
        {Object.entries(course).map(([sessionName, papers]) => {
          const sessionTotal = getSessionTotal(sessionName)
          const isSaved = savedSessions.has(sessionName)
          
          return (
            <div key={sessionName} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300">
              <div className="bg-slate-800 px-8 py-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-white">{sessionName}</h3>
                  <div className="flex items-center space-x-6">
                    <span className="text-slate-300 font-medium">
                      Total: <span className="text-white font-semibold">{sessionTotal.obtained}/{sessionTotal.total}</span>
                    </span>
                    {isSaved && (
                      <div className="flex items-center space-x-2 bg-green-600 bg-opacity-90 px-3 py-1.5 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-white" />
                        <span className="text-white font-medium text-sm">Saved</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="p-8">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {Object.entries(papers).map(([paperName, paperData]) => {
                    const markKey = `${sessionName}-${paperName}`
                    const currentMark = marks[markKey] || ''
                    const isOverLimit = currentMark > paperData.maxMarks
                    const isSupplement = currentMark && isPaperSupplement(sessionName, paperName)
                    
                    return (
                      <div key={paperName} className={`space-y-4 p-5 rounded-lg border transition-all duration-200 ${
                        isSupplement 
                          ? 'bg-red-50 border-red-200 hover:bg-red-100 shadow-sm' 
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      }`}>
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-900">
                            {paperName}
                          </label>
                          <div className="flex items-center justify-between">
                            <span className="text-indigo-600 text-sm font-medium">Max: {paperData.maxMarks}</span>
                            {isSupplement && (
                              <span className="px-2 py-1 text-xs bg-red-500 text-white rounded-md font-medium">
                                SUPPLEMENT
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {paperData.subjects.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {paperData.subjects.map((subject, idx) => (
                              <span key={idx} className="inline-block px-2.5 py-1 text-xs bg-indigo-100 text-indigo-700 rounded-md font-medium">
                                {subject}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        <div className="relative">
                          <input
                            type="number"
                            min="0"
                            max={paperData.maxMarks}
                            value={currentMark}
                            onChange={(e) => handleMarkChange(sessionName, paperName, e.target.value)}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-medium text-base transition-all duration-200 ${
                              isOverLimit ? 'border-red-400 bg-red-50 text-red-700' : 'border-gray-300 bg-white'
                            }`}
                            placeholder="Enter marks"
                          />
                          {isOverLimit && (
                            <AlertCircle className="absolute right-3 top-3.5 w-5 h-5 text-red-500" />
                          )}
                        </div>
                        
                        {currentMark && (
                          <div className={`text-sm font-medium px-3 py-2 rounded-lg border ${
                            isSupplement 
                              ? 'text-red-800 bg-red-100 border-red-200' 
                              : 'text-gray-700 bg-white border-gray-200'
                          }`}>
                            <div className="flex items-center justify-between">
                              <span>Percentage:</span>
                              <span className={`font-semibold ${isSupplement ? 'text-red-700' : 'text-indigo-600'}`}>
                                {((currentMark / paperData.maxMarks) * 100).toFixed(1)}%
                              </span>
                            </div>
                            {isSupplement && (
                              <div className="text-xs text-red-600 font-medium mt-1">
                                Below 60% - Supplement Required
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
                
                <div className="mt-8 flex items-center justify-between pt-6 border-t border-gray-200">
                  <div className="text-lg font-semibold text-gray-900">
                    Session Total: <span className="text-indigo-600">{sessionTotal.obtained}/{sessionTotal.total}</span>
                    <span className="text-base text-gray-500 ml-4 font-medium">
                      ({sessionTotal.total > 0 ? ((sessionTotal.obtained / sessionTotal.total) * 100).toFixed(1) : 0}%)
                    </span>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={() => resetSession(sessionName)}
                      className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200 flex items-center space-x-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Reset</span>
                    </button>
                    
                    <button
                      onClick={() => saveSession(sessionName)}
                      disabled={isSaved}
                      className={`px-5 py-2.5 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 flex items-center space-x-2 ${
                        isSaved 
                          ? 'bg-green-600 cursor-not-allowed' 
                          : 'bg-indigo-600 hover:bg-indigo-700'
                      }`}
                    >
                      <Save className="w-4 h-4" />
                      <span>{isSaved ? 'Saved' : 'Save Session'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Professional Header */}
      <div className="bg-white shadow-sm border-b border-gray-100 w-full">
        <div className="w-full px-6 py-5">
          <div className="flex items-center justify-between">
            {/* Left side - Navigation and Title */}
            <div className="flex items-center space-x-6">
              <Link
                to="/stc"
                className="flex items-center justify-center w-9 h-9 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200 group border border-gray-200"
              >
                <ArrowLeft className="w-4 h-4 text-gray-500 group-hover:text-gray-700" />
              </Link>
              <div>
                <div className="flex items-center space-x-3 mb-1">
                  <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
                    <ClipboardList className="w-5 h-5 text-white" />
                  </div>
                  <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
                    Examination Marks Entry
                  </h1>
                </div>
                <p className="text-sm text-gray-500 ml-12">
                  Manage and record trainee examination performance
                </p>
              </div>
            </div>

            {/* Right side - System Status */}
            <div className="hidden lg:flex items-center space-x-6">
              <div className="flex items-center space-x-3 bg-indigo-50 px-4 py-2 rounded-lg border border-indigo-100">
                <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-pulse"></div>
                <span className="text-indigo-700 font-medium text-sm">
                  System Active
                </span>
              </div>
              <div className="text-right border-l border-gray-200 pl-6">
                <div className="text-xs text-gray-400 uppercase tracking-wide font-medium">Current Date</div>
                <div className="text-sm font-medium text-gray-700 mt-0.5">
                  {new Date().toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-6 py-8">
        {/* Professional Selection Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8 max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Trainee Selection & Course Assignment</h2>
            <p className="text-sm text-gray-500">Select a trainee and their corresponding course to begin marks entry</p>
          </div>
          
          <div className="space-y-10">
            {/* Step 1: Enhanced Trainee Selection */}
            <div className="relative">
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-9 h-9 bg-indigo-600 text-white rounded-lg text-sm font-semibold mr-4 shadow-sm">
                  1
                </div>
                <div>
                  <label className="block text-lg font-medium text-gray-900">
                    Select Trainee
                  </label>
                  <p className="text-sm text-gray-500 mt-0.5">Search by name or ticket number</p>
                </div>
                <span className="ml-3 text-red-500 text-lg">*</span>
              </div>
              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={selectedTrainee ? getSelectedTraineeName() : searchTerm}
                    onChange={(e) => {
                      if (!selectedTrainee) {
                        handleSearchChange(e.target.value)
                      }
                    }}
                    onFocus={() => {
                      if (!selectedTrainee) {
                        setShowDropdown(true)
                        setFilteredTrainees(filterTrainees(searchTerm))
                      }
                    }}
                    onBlur={() => {
                      setTimeout(() => setShowDropdown(false), 200)
                    }}
                    placeholder="Type trainee name or ticket number..."
                    className="w-full pl-12 pr-12 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 hover:bg-white transition-all duration-200 text-base"
                  />
                  
                  {selectedTrainee ? (
                    <button
                      onClick={() => {
                        setSelectedTrainee('')
                        setSearchTerm('')
                        setSelectedCourse('')
                        setMarks({})
                        setSavedSessions(new Set())
                        setSupplementStatus({})
                        setShowDropdown(false)
                      }}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  ) : searchTerm && (
                    <button
                      onClick={() => {
                        setSearchTerm('')
                        setFilteredTrainees(trainees)
                      }}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Enhanced Dropdown */}
                {showDropdown && !selectedTrainee && (
                  <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                    {filteredTrainees.length > 0 ? (
                      filteredTrainees.map((trainee) => (
                        <div
                          key={trainee.id}
                          onClick={() => handleTraineeSelect(trainee)}
                          className="px-4 py-3 hover:bg-indigo-50 cursor-pointer border-b border-gray-50 last:border-b-0 transition-colors"
                        >
                          <div className="font-medium text-gray-900">{trainee.name}</div>
                          <div className="text-sm text-gray-500">Ticket: {trainee.ticketNo}</div>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-gray-500 text-center text-sm">
                        No trainees found matching "{searchTerm}"
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {selectedTrainee && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center text-green-800">
                    <CheckCircle className="w-5 h-5 mr-3 text-green-600" />
                    <div className="flex-1">
                      <div className="font-medium">Trainee Selected</div>
                      <div className="text-sm text-green-700">{getSelectedTraineeName()}</div>
                      {mockTraineeMarksData[selectedTrainee] && (
                        <div className="text-xs text-green-600 mt-1 flex items-center">
                          <ClipboardList className="w-3 h-3 mr-1" />
                          Previous marks and supplement status loaded automatically
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Step 2: Enhanced Course Selection */}
            <div className={`transition-all duration-300 ${!selectedTrainee ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
              <div className="flex items-center mb-4">
                <div className={`flex items-center justify-center w-9 h-9 rounded-lg text-sm font-semibold mr-4 shadow-sm ${
                  selectedTrainee ? 'bg-indigo-600 text-white' : 'bg-gray-300 text-gray-500'
                }`}>
                  2
                </div>
                <div>
                  <label className="block text-lg font-medium text-gray-900">
                    Select Course
                  </label>
                  <p className="text-sm text-gray-500 mt-0.5">Choose the examination course</p>
                </div>
                <span className="ml-3 text-red-500 text-lg">*</span>
              </div>
              <select
                value={selectedCourse}
                onChange={(e) => {
                  const newCourse = e.target.value
                  setSelectedCourse(newCourse)
                  
                  // Only clear marks if switching to a different course than the trainee's assigned course
                  if (selectedTrainee) {
                    const traineeData = mockTraineeMarksData[selectedTrainee]
                    const selectedTraineeInfo = trainees.find(t => t.id === selectedTrainee)
                    
                    if (traineeData && newCourse === traineeData.course) {
                      // Switching back to trainee's course - reload their marks
                      setMarks(traineeData.marks || {})
                      setSavedSessions(new Set(traineeData.savedSessions || []))
                      setSupplementStatus(traineeData.supplementStatus || {})
                    } else if (newCourse !== selectedTraineeInfo?.course) {
                      // Switching to a different course - clear marks
                      setMarks({})
                      setSavedSessions(new Set())
                      setSupplementStatus({})
                    }
                  }
                }}
                disabled={!selectedTrainee}
                className={`w-full px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-base ${
                  selectedTrainee 
                    ? 'bg-gray-50 hover:bg-white' 
                    : 'bg-gray-100 cursor-not-allowed'
                }`}
              >
                <option value="">
                  {selectedTrainee ? 'Choose a course...' : 'Please select a trainee first'}
                </option>
                {Object.keys(courseStructure).map(course => (
                  <option key={course} value={course}>{course}</option>
                ))}
              </select>
              
              {selectedCourse && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center text-green-800">
                    <CheckCircle className="w-5 h-5 mr-3 text-green-600" />
                    <div>
                      <div className="font-medium">Course Selected</div>
                      <div className="text-sm text-green-700">{selectedCourse}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Professional Marks Entry Form */}
        {selectedCourse && selectedTrainee ? (
          <div className="max-w-7xl mx-auto">
            {renderMarksForm()}
            
            {/* Professional Supplement Status Section */}
            {getSupplementPapers().length > 0 && (
              <div className="mt-8 bg-white rounded-xl shadow-sm border border-red-200 overflow-hidden">
                <div className="bg-red-600 px-8 py-6">
                  <h3 className="text-xl font-semibold text-white flex items-center">
                    <AlertCircle className="w-5 h-5 mr-3" />
                    Supplement Examination Status
                  </h3>
                  <p className="text-red-100 mt-2 text-sm">
                    Papers scoring below 60% require supplementary examination
                  </p>
                </div>
                
                <div className="p-8">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {getSupplementPapers().map((supplement) => (
                      <div key={supplement.key} className="bg-red-50 border border-red-200 rounded-lg p-5">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 text-sm">{supplement.sessionName}</h4>
                            <p className="text-sm text-gray-600 mt-0.5">{supplement.paperName}</p>
                          </div>
                          <div className="text-right ml-3">
                            <div className="text-sm font-semibold text-red-700">
                              {supplement.currentMark}/{supplement.maxMarks}
                            </div>
                            <div className="text-xs text-red-600 font-medium">
                              {supplement.percentage}%
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">
                              Status:
                            </span>
                            <button
                              onClick={() => toggleSupplementStatus(supplement.key)}
                              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                                supplement.isCleared
                                  ? 'bg-green-600 text-white hover:bg-green-700'
                                  : 'bg-red-600 text-white hover:bg-red-700'
                              }`}
                            >
                              {supplement.isCleared ? 'Cleared' : 'Pending'}
                            </button>
                          </div>
                          
                          {supplement.isCleared && (
                            <div className="flex items-center text-green-700 text-sm bg-green-50 px-3 py-2 rounded-md border border-green-200">
                              <CheckCircle className="w-4 h-4 mr-2" />
                              <span className="font-medium">Supplement cleared</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 p-5 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-start">
                      <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
                      <div className="text-sm text-amber-900">
                        <p className="font-semibold mb-2">Supplement Examination Guidelines:</p>
                        <ul className="list-disc list-inside space-y-1.5 text-sm leading-relaxed">
                          <li>Papers scoring below 60% automatically require supplementary examination</li>
                          <li>Use the status toggle to track supplement completion progress</li>
                          <li>All supplement papers must be cleared for successful course completion</li>
                          <li>Contact administration for supplement examination scheduling</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-20 max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm p-12 border border-gray-200">
              <div className="text-indigo-400 mb-8">
                <div className="w-20 h-20 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <User className="w-10 h-10" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Ready to Begin Marks Entry</h3>
              <div className="text-gray-600 leading-relaxed">
                {!selectedTrainee ? (
                  <p>
                    <span className="font-semibold text-indigo-600">Step 1:</span> Select a trainee from the search field above to get started
                  </p>
                ) : !selectedCourse ? (
                  <div className="space-y-2">
                    <p className="font-semibold text-green-600">✓ Trainee selected successfully</p>
                    <p>
                      <span className="font-semibold text-indigo-600">Step 2:</span> Now choose the examination course to proceed
                    </p>
                  </div>
                ) : (
                  <p className="text-green-600 font-medium">All set! The marks entry interface will load momentarily.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default FeedMark
