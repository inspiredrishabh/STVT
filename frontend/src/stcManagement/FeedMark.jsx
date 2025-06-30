import React, { useState, useEffect } from 'react';
import { Search, UserCheck, BookOpen, Save, AlertCircle, CheckCircle, ArrowLeft, ClipboardList, RefreshCw } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

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
};

// Mock API Functions
const mockAPI = {
  // Sample candidates data
  candidatesData: [
    { id: 1, ticketNumber: 'STC2024001', name: 'Rahul Kumar', courseCode: 'MSE-C&W' },
    { id: 2, ticketNumber: 'STC2024002', name: 'Priya Sharma', courseCode: 'MSE-D' },
    { id: 3, ticketNumber: 'STC2024003', name: 'Amit Singh', courseCode: 'MSE-W' },
    { id: 4, ticketNumber: 'STC2024004', name: 'Neha Gupta', courseCode: 'MJR-C&W' },
    { id: 5, ticketNumber: 'STC2024005', name: 'Vikash Yadav', courseCode: 'MJR-D' },
    { id: 6, ticketNumber: 'STC2024006', name: 'Sunita Devi', courseCode: 'MJR-W' },
    { id: 7, ticketNumber: 'STC2024007', name: 'Abhijeet Malik', courseCode: 'MJI-C&W' },
    { id: 8, ticketNumber: 'STC2024008', name: 'Anjali Kumari', courseCode: 'MJI-D' },
    { id: 9, ticketNumber: 'STC2024009', name: 'Manoj Kumar', courseCode: 'MJI-W' },
    { id: 10, ticketNumber: 'STC2024010', name: 'Pooja Singh', courseCode: 'MJP-C&W' },
    { id: 11, ticketNumber: 'STC2024011', name: 'Sandeep Kumar', courseCode: 'MJP-D' },
    { id: 12, ticketNumber: 'STC2024012', name: 'Kavita Sharma', courseCode: 'MJP-W' }
  ],

  // Simulate API delay
  delay: (ms = 300) => new Promise(resolve => setTimeout(resolve, ms)),

  // Get all candidates for dropdown
  getCandidates: async () => {
    await mockAPI.delay(500);
    return mockAPI.candidatesData;
  },

  // Get candidate by ticket number
  getCandidateByTicket: async (ticketNumber) => {
    await mockAPI.delay();
    const candidate = mockAPI.candidatesData.find(c => c.ticketNumber === ticketNumber);
    if (!candidate) {
      throw new Error('Candidate not found');
    }
    return candidate;
  },

  // Get existing marks for a candidate
  getExistingMarks: async (ticketNumber) => {
    await mockAPI.delay();
    // Mock existing marks data with some failed subjects for demonstration
    return {
      'Session 1': {
        'Paper 1': 85,
        'Paper 2': 78,
        'Practical': 25 // This will be below 60% of 50 (which is 30)
      },
      'Session 2': {
        'Paper 1': 40, // This will be below 60% of 75 (which is 45)
        'Paper 2': 89
      }
    };
  },

  // Save marks
  saveMarks: async (ticketNumber, marks) => {
    await mockAPI.delay(800);
    console.log('Saving marks for:', ticketNumber, marks);
    return { success: true, message: 'Marks saved successfully' };
  },

  // Clear supplementary status for a specific subject
  clearSubjectSupplementary: async (ticketNumber, session, paper) => {
    await mockAPI.delay(600);
    console.log('Clearing supplementary status for:', ticketNumber, session, paper);
    return { success: true, message: `Supplementary status cleared for ${session} - ${paper}. Only main marks will be used for this subject.` };
  }
};

const FeedMark = () => {
  const [searchParams] = useSearchParams();
  const [searchMethod, setSearchMethod] = useState('ticket'); // 'ticket' or 'dropdown'
  const [ticketNumber, setTicketNumber] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [candidateData, setCandidateData] = useState(null);
  const [courseCode, setCourseCode] = useState('');
  const [marks, setMarks] = useState({});
  const [clearedSupplementary, setClearedSupplementary] = useState({}); // Track cleared supplementary subjects
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [candidatesLoading, setCandidatesLoading] = useState(false);

  // Auto-search function for URL parameters
  const handleAutoSearch = async (ticketNo) => {
    if (!ticketNo.trim()) {
      setMessage({ type: 'error', text: 'Invalid ticket number from URL' });
      return;
    }

    setLoading(true);
    setMessage({ type: 'info', text: 'Auto-loading trainee data...' });

    try {
      const candidate = await mockAPI.getCandidateByTicket(ticketNo);
      setCandidateData(candidate);
      setCourseCode(candidate.courseCode);

      // Load existing marks
      const existingMarks = await mockAPI.getExistingMarks(ticketNo);
      setMarks(existingMarks);

      setMessage({ type: 'success', text: `✓ Auto-loaded: ${candidate.name} - Marks ready for viewing/editing` });
    } catch (error) {
      setMessage({ type: 'error', text: `Failed to auto-load trainee: ${error.message}` });
      setCandidateData(null);
      setCourseCode('');
      setMarks({});
    } finally {
      setLoading(false);
    }
  };

  // Handle URL parameters for auto-selection from TraineeProfile
  useEffect(() => {
    const traineeId = searchParams.get('traineeId');
    const ticketNo = searchParams.get('ticketNo');
    const autoSelect = searchParams.get('autoSelect');

    if (autoSelect === 'true' && ticketNo) {
      // Set the form state immediately
      setTicketNumber(ticketNo);
      setSearchMethod('ticket');

      // Clear any existing messages
      setMessage({ type: '', text: '' });

      // Auto-load the candidate data immediately with a small delay to ensure UI updates
      setTimeout(() => {
        handleAutoSearch(ticketNo);
      }, 100);
    }
  }, [searchParams]);

  // Load candidates for dropdown
  useEffect(() => {
    if (searchMethod === 'dropdown') {
      loadCandidates();
    }
  }, [searchMethod]);

  const loadCandidates = async () => {
    setCandidatesLoading(true);
    try {
      const candidatesList = await mockAPI.getCandidates();
      setCandidates(candidatesList);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load candidates' });
    } finally {
      setCandidatesLoading(false);
    }
  };

  const handleSearchCandidate = async () => {
    if (!ticketNumber.trim()) {
      setMessage({ type: 'error', text: 'Please enter a ticket number' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const candidate = await mockAPI.getCandidateByTicket(ticketNumber);
      setCandidateData(candidate);
      setCourseCode(candidate.courseCode);

      // Load existing marks
      const existingMarks = await mockAPI.getExistingMarks(ticketNumber);
      setMarks(existingMarks);

      setMessage({ type: 'success', text: `Candidate found: ${candidate.name}` });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
      setCandidateData(null);
      setCourseCode('');
      setMarks({});
    } finally {
      setLoading(false);
    }
  };

  const handleCandidateSelect = async (candidateId) => {
    if (!candidateId) {
      setCandidateData(null);
      setCourseCode('');
      setMarks({});
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const candidate = candidates.find(c => c.id === parseInt(candidateId));
      if (!candidate) {
        throw new Error('Candidate not found');
      }

      setCandidateData(candidate);
      setCourseCode(candidate.courseCode);
      setTicketNumber(candidate.ticketNumber);

      // Load existing marks
      const existingMarks = await mockAPI.getExistingMarks(candidate.ticketNumber);
      setMarks(existingMarks);

      setMessage({ type: 'success', text: `Candidate selected: ${candidate.name}` });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load candidate data' });
    } finally {
      setLoading(false);
    }
  };

  const handleMarksChange = (session, paper, value) => {
    const numValue = value === '' ? '' : parseInt(value);
    setMarks(prev => ({
      ...prev,
      [session]: {
        ...prev[session],
        [paper]: numValue
      }
    }));
  };

  const handleSaveMarks = async () => {
    if (!candidateData) {
      setMessage({ type: 'error', text: 'No candidate selected' });
      return;
    }

    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      await mockAPI.saveMarks(candidateData.ticketNumber, marks);
      setMessage({ type: 'success', text: 'Marks saved successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save marks' });
    } finally {
      setSaving(false);
    }
  };

  const handleClearSubjectSupplementary = async (session, paper) => {
    if (!candidateData) {
      setMessage({ type: 'error', text: 'No candidate selected' });
      return;
    }

    if (!confirm(`Are you sure you want to clear supplementary status for ${session} - ${paper}? This will use only main marks for this subject in marksheet generation.`)) {
      return;
    }

    setClearing(true);
    setMessage({ type: '', text: '' });

    try {
      const result = await mockAPI.clearSubjectSupplementary(candidateData.ticketNumber, session, paper);

      // Mark this subject as cleared from supplementary
      setClearedSupplementary(prev => ({
        ...prev,
        [`${session}_${paper}`]: true
      }));

      setMessage({ type: 'success', text: result.message });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to clear supplementary status' });
    } finally {
      setClearing(false);
    }
  };

  const resetForm = () => {
    setTicketNumber('');
    setSelectedCandidate('');
    setCandidateData(null);
    setCourseCode('');
    setMarks({});
    setClearedSupplementary({}); // Reset cleared supplementary status
    setMessage({ type: '', text: '' });
  };

  // Helper function to check if marks are below 60% (supplementary eligible)
  const isSupplementaryEligible = (paperMarks, maxMarks) => {
    if (!paperMarks || !maxMarks) return false;
    const passingMarks = Math.ceil(maxMarks * 0.6); // 60% of max marks
    return paperMarks < passingMarks;
  };

  // Check if a subject's supplementary status has been cleared
  const isSupplementaryCleared = (session, paper) => {
    return clearedSupplementary[`${session}_${paper}`] === true;
  };

  // Check if a subject should show as failed (below passing marks and not cleared)
  const shouldShowAsFailed = (session, paper, paperMarks, maxMarks) => {
    const isEligible = isSupplementaryEligible(paperMarks, maxMarks);
    const isCleared = isSupplementaryCleared(session, paper);
    return isEligible && !isCleared;
  };

  // Get passing marks (60% of max marks)
  const getPassingMarks = (maxMarks) => Math.ceil(maxMarks * 0.6);

  // Get all failed subjects for supplementary message
  const getFailedSubjects = () => {
    const failedSubjects = [];
    if (!currentCourseStructure || !marks) return failedSubjects;

    Object.entries(currentCourseStructure).forEach(([session, papers]) => {
      Object.entries(papers).forEach(([paper, config]) => {
        const paperMarks = marks[session]?.[paper];
        const passingMarks = getPassingMarks(config.maxMarks);
        const isCleared = isSupplementaryCleared(session, paper);

        // Only include in failed subjects if below passing marks AND not cleared
        if (paperMarks && paperMarks < passingMarks && !isCleared) {
          failedSubjects.push({
            session,
            paper,
            marks: paperMarks,
            maxMarks: config.maxMarks,
            passingMarks,
            shortfall: passingMarks - paperMarks
          });
        }
      });
    });

    return failedSubjects;
  };

  const currentCourseStructure = courseCode ? courseStructure[courseCode] : null;
  const failedSubjects = getFailedSubjects();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Header */}
      <div className="bg-white shadow-lg border-b border-gray-200 w-full">
        <div className="w-full px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Left side - Back button and Title */}
            <div className="flex items-center space-x-4">
              <Link
                to="/stc-management"
                className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200 group"
              >
                <ArrowLeft className="w-4 h-4 text-gray-600 group-hover:text-gray-800" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <ClipboardList className="w-5 h-5 text-white" />
                  </div>
                  Feed Marks
                </h1>
                <p className="text-gray-600 text-sm">
                  Input and manage trainee examination marks
                </p>
              </div>
            </div>

            {/* Right side - Status indicator */}
            <div className="hidden md:flex items-center space-x-3">
              {loading && searchParams.get('autoSelect') === 'true' ? (
                <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-full">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-spin"></div>
                  <span className="text-blue-700 font-medium text-xs">
                    Auto-Loading...
                  </span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 bg-green-50 px-3 py-1 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-700 font-medium text-xs">
                    System Active
                  </span>
                </div>
              )}
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
        <div className="max-w-6xl mx-auto">
          {/* Search Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Search className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Search Candidate</h2>
                <p className="text-gray-600 text-sm">Find trainee by ticket number or select from list</p>
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    disabled={candidatesLoading}
                  >
                    <option value="">Select a candidate...</option>
                    {candidates.map(candidate => (
                      <option key={candidate.id} value={candidate.id}>
                        {candidate.ticketNumber} - {candidate.name} ({candidate.courseCode})
                      </option>
                    ))}
                  </select>
                  {candidatesLoading && (
                    <p className="text-sm text-gray-500 mt-2">Loading candidates...</p>
                  )}
                </div>
              )}

              <div className="flex gap-3">
                {searchMethod === 'ticket' && (
                  <button
                    onClick={handleSearchCandidate}
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
                : message.type === 'info'
                  ? 'bg-blue-50 text-blue-800 border border-blue-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                {message.type === 'success' ? (
                  <CheckCircle className="w-6 h-6" />
                ) : message.type === 'info' ? (
                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <AlertCircle className="w-6 h-6" />
                )}
                <span className="font-medium">{message.text}</span>
              </div>
            )}
          </div>

          {/* Candidate Information */}
          {candidateData && (
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Candidate Information</h2>
                  <p className="text-gray-600 text-sm">Selected trainee details</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                  <label className="block text-sm font-semibold text-blue-700 mb-1">Ticket Number</label>
                  <p className="text-lg font-bold text-blue-900">{candidateData.ticketNumber}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                  <label className="block text-sm font-semibold text-green-700 mb-1">Name</label>
                  <p className="text-lg font-bold text-green-900">{candidateData.name}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
                  <label className="block text-sm font-semibold text-purple-700 mb-1">Course Code</label>
                  <p className="text-lg font-bold text-purple-900">{candidateData.courseCode}</p>
                </div>
              </div>
            </div>
          )}

          {/* Marks Entry Form */}
          {currentCourseStructure && (
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Enter Marks - {courseCode}</h2>
                    <p className="text-gray-600 text-sm">Input examination marks for all sessions</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleSaveMarks}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    {saving ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Save className="w-5 h-5" />
                    )}
                    {saving ? 'Saving...' : 'Save Marks'}
                  </button>
                </div>
              </div>

              <div className="space-y-8">
                {Object.entries(currentCourseStructure).map(([session, papers]) => (
                  <div key={session} className="border border-gray-200 rounded-xl p-6 bg-gray-50">
                    <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{session.slice(-1)}</span>
                      </div>
                      {session}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {Object.entries(papers).map(([paper, config]) => {
                        const paperMarks = marks[session]?.[paper];
                        const passingMarks = getPassingMarks(config.maxMarks);
                        const isFailingGrade = shouldShowAsFailed(session, paper, paperMarks, config.maxMarks);
                        const isOverMaxMarks = paperMarks > config.maxMarks;
                        const isCleared = isSupplementaryCleared(session, paper);
                        const isBelowPassing = paperMarks && paperMarks < passingMarks;

                        return (
                          <div key={paper} className={`p-4 rounded-xl border space-y-3 ${isFailingGrade ? 'bg-red-50 border-red-300' :
                            isCleared && isBelowPassing ? 'bg-yellow-50 border-yellow-300' :
                              'bg-white border-gray-200'
                            }`}>
                            <div className="flex items-center justify-between">
                              <label className="block text-sm font-semibold text-gray-800">
                                {paper}
                                {isCleared && isBelowPassing && (
                                  <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                                    Supplementary Cleared
                                  </span>
                                )}
                              </label>
                              <div className="text-right">
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                                  Max: {config.maxMarks}
                                </span>
                                <span className="text-xs text-gray-500 block mt-1">
                                  Pass: {passingMarks} (60%)
                                </span>
                              </div>
                            </div>

                            {config.subjects.length > 0 && (
                              <div className="bg-gray-50 p-2 rounded-lg">
                                <p className="text-xs text-gray-600 font-medium mb-1">Subjects:</p>
                                <p className="text-xs text-gray-800">{config.subjects.join(', ')}</p>
                              </div>
                            )}

                            <input
                              type="number"
                              min="0"
                              max={config.maxMarks}
                              value={paperMarks || ''}
                              onChange={(e) => handleMarksChange(session, paper, e.target.value)}
                              placeholder={`Enter marks (0-${config.maxMarks})`}
                              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${isOverMaxMarks
                                ? 'border-red-300 bg-red-50'
                                : isFailingGrade
                                  ? 'border-red-400 bg-red-50'
                                  : isCleared && isBelowPassing
                                    ? 'border-yellow-400 bg-yellow-50'
                                    : 'border-gray-300'
                                }`}
                            />

                            {isOverMaxMarks && (
                              <p className="text-xs text-red-600 font-medium">
                                ⚠️ Marks cannot exceed {config.maxMarks}
                              </p>
                            )}

                            {isCleared && isBelowPassing && !isOverMaxMarks && (
                              <div className="space-y-2">
                                <p className="text-xs text-yellow-700 font-medium">
                                  ✓ Supplementary status cleared. Main marks ({paperMarks}) will be used in marksheet.
                                </p>
                              </div>
                            )}

                            {isFailingGrade && !isOverMaxMarks && (
                              <div className="space-y-2">
                                <p className="text-xs text-red-600 font-medium">
                                  ⚠️ Below passing marks ({passingMarks}). Eligible for supplementary exam.
                                </p>
                                <button
                                  onClick={() => handleClearSubjectSupplementary(session, paper)}
                                  disabled={clearing}
                                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-orange-600 text-white text-xs rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                  title={`Clear supplementary status for ${session} - ${paper}`}
                                >
                                  {clearing ? (
                                    <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                                  ) : (
                                    <RefreshCw className="w-3 h-3" />
                                  )}
                                  Clear Supplementary
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Supplementary Eligibility Message */}
              {failedSubjects.length > 0 && (
                <div className="mt-8 p-6 bg-red-50 border border-red-200 rounded-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                    <h3 className="text-lg font-bold text-red-800">Supplementary Exam Eligibility</h3>
                  </div>
                  <p className="text-red-700 mb-4 font-medium">
                    The candidate has scored below 60% in the following subjects and is eligible for supplementary examination:
                  </p>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                    <div className="flex items-start gap-2">
                      <RefreshCw className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                      <p className="text-orange-800 text-sm">
                        <strong>Note:</strong> Use the "Clear Supplementary" button on each failed subject to remove supplementary status and use only main marks for that subject in marksheet generation.
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {failedSubjects.map((subject, index) => (
                      <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg border border-red-200">
                        <div>
                          <span className="font-semibold text-red-800">{subject.session} - {subject.paper}</span>
                          <span className="text-xs text-red-600 block">
                            Required: {subject.passingMarks} (60% of {subject.maxMarks})
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-red-600 font-bold">{subject.marks}/{subject.maxMarks}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* No candidate selected message */}
          {!candidateData && !loading && (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-200">
              <div className="w-20 h-20 bg-gray-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">No Candidate Selected</h3>
              <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
                Please search for a candidate using their ticket number or select from the dropdown to begin entering marks.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedMark;
