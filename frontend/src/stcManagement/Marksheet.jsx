import React, { useState, useEffect, useRef } from 'react';
import { Search, FileText, Download, Printer, ArrowLeft, GraduationCap, Award, AlertTriangle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

// Course structure definition (same as FeedMark)
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

// Mock API Functions with Backend Endpoints
const marksheetAPI = {
  // Sample candidates data
  candidatesData: [
    {
      id: 1,
      ticketNumber: 'STC2024001',
      name: 'Rahul Kumar',
      fatherName: 'Mr. Rajesh Kumar',
      courseCode: 'MSE-C&W',
      rollNo: 'R001',
      batch: '2023-24',
      post: 'Motor Man',
      stream: 'C&W'
    },
    {
      id: 2,
      ticketNumber: 'STC2024002',
      name: 'Priya Sharma',
      fatherName: 'Mr. Amit Sharma',
      courseCode: 'MSE-D',
      rollNo: 'R002',
      batch: '2023-24',
      post: 'Motor Man',
      stream: 'Diesel'
    },
    {
      id: 3,
      ticketNumber: 'STC2024003',
      name: 'Amit Singh',
      fatherName: 'Mr. Suresh Singh',
      courseCode: 'MSE-W',
      rollNo: 'R003',
      batch: '2023-24',
      post: 'Motor Man',
      stream: 'WAG'
    },
    {
      id: 4,
      ticketNumber: 'STC2024004',
      name: 'Neha Gupta',
      fatherName: 'Mr. Vinod Gupta',
      courseCode: 'MJR-C&W',
      rollNo: 'R004',
      batch: '2023-24',
      post: 'Junior Engineer',
      stream: 'C&W'
    },
    {
      id: 5,
      ticketNumber: 'STC2024005',
      name: 'Vikash Yadav',
      fatherName: 'Mr. Ram Yadav',
      courseCode: 'MJI-C&W',
      rollNo: 'R005',
      batch: '2023-24',
      post: 'Junior Engineer',
      stream: 'C&W'
    }
  ],

  // Simulate API delay
  delay: (ms = 300) => new Promise(resolve => setTimeout(resolve, ms)),

  // Backend Endpoint: GET /api/candidates
  getCandidates: async () => {
    await marksheetAPI.delay(500);
    return marksheetAPI.candidatesData;
  },

  // Backend Endpoint: GET /api/candidates/:ticketNumber
  getCandidateByTicket: async (ticketNumber) => {
    await marksheetAPI.delay();
    const candidate = marksheetAPI.candidatesData.find(c => c.ticketNumber === ticketNumber);
    if (!candidate) {
      throw new Error('Candidate not found');
    }
    return candidate;
  },

  // Backend Endpoint: GET /api/marksheet/:ticketNumber
  getMarksheetData: async (ticketNumber) => {
    await marksheetAPI.delay(800);
    // Mock comprehensive marks data
    const mockMarks = {
      'STC2024001': { // Rahul Kumar - MSE-C&W
        'Session 1': { 'Paper 1': 85, 'Paper 2': 78, 'Practical': 45 },
        'Session 2': { 'Paper 1': 65, 'Paper 2': 89, 'Practical': 42 },
        'Session 3': { 'Paper 1': 92, 'Paper 2': 38, 'Paper 3': 22, 'Paper 4': 46, 'Practical': 48 },
        'Session 4': { 'Paper 1': 87, 'Practical': 44, 'Interview': 85 }
      },
      'STC2024002': { // Priya Sharma - MSE-D
        'Session 1': { 'Paper 1': 92, 'Paper 2': 88, 'Practical': 48 },
        'Session 2': { 'Paper 1': 70, 'Paper 2': 91, 'Practical': 46 },
        'Session 3': { 'Paper 1': 89, 'Paper 2': 45, 'Paper 3': 24, 'Paper 4': 48, 'Practical': 47 },
        'Session 4': { 'Paper 1': 93, 'Practical': 49, 'Interview': 88 }
      },
      'STC2024003': { // Amit Singh - MSE-W
        'Session 1': { 'Paper 1': 76, 'Paper 2': 82, 'Practical': 40 },
        'Session 2': { 'Paper 1': 58, 'Paper 2': 85, 'Practical': 43 },
        'Session 3': { 'Paper 1': 88, 'Paper 2': 42, 'Paper 3': 20, 'Paper 4': 44, 'Practical': 45 },
        'Session 4': { 'Paper 1': 79, 'Practical': 41, 'Interview': 82 }
      },
      'STC2024004': { // Neha Gupta - MJR-C&W
        'Session 1': { 'Paper 1': 88, 'Paper 2': 85, 'Practical': 47 },
        'Session 2': { 'Paper 1': 72, 'Paper 2': 90, 'Practical': 45 },
        'Session 3': { 'Paper 1': 91, 'Paper 2': 44, 'Paper 3': 23, 'Paper 4': 47, 'Practical': 46 },
        'Session 4': { 'Paper 1': 89, 'Practical': 48, 'Interview': 87 }
      },
      'STC2024005': { // Vikash Yadav - MJI-C&W
        'Session 1': { 'Paper 1': 82, 'Paper 2': 79, 'Paper 3': 85, 'Paper 4': 88, 'Paper 5': 76, 'Paper 6': 91, 'Paper 7': 83 },
        'Session 2': { 'Paper 1': 87, 'Paper 2': 84, 'Paper 3': 89, 'Paper 4': 92, 'Paper 5': 44, 'Paper 6': 22, 'Paper 7': 46, 'Paper 8': 43 },
        'Session 3': { 'Paper 1': 118, 'Paper 2': 85 },
        'Session 4': { 'Paper 1': 88, 'Paper 2': 91, 'Practical': 47, 'Interview': 44 }
      }
    };

    return mockMarks[ticketNumber] || {};
  },

  // Backend Endpoint: GET /api/marksheet/:ticketNumber/failed-subjects
  getFailedSubjects: async (ticketNumber) => {
    await marksheetAPI.delay();
    const marks = await marksheetAPI.getMarksheetData(ticketNumber);
    const candidate = await marksheetAPI.getCandidateByTicket(ticketNumber);
    const structure = courseStructure[candidate.courseCode];
    const failedSubjects = [];

    if (structure && marks) {
      Object.entries(structure).forEach(([session, papers]) => {
        Object.entries(papers).forEach(([paper, config]) => {
          const paperMarks = marks[session]?.[paper];
          const passingMarks = Math.ceil(config.maxMarks * 0.6);
          if (paperMarks && paperMarks < passingMarks) {
            failedSubjects.push({
              session,
              paper,
              marks: paperMarks,
              maxMarks: config.maxMarks,
              passingMarks,
              subjects: config.subjects
            });
          }
        });
      });
    }

    return failedSubjects;
  },

  // Backend Endpoint: POST /api/marksheet/:ticketNumber/generate
  generateMarksheet: async (ticketNumber, sessionWise = false) => {
    await marksheetAPI.delay(1200);
    console.log('Generating marksheet for:', ticketNumber, 'Session-wise:', sessionWise);
    return {
      success: true,
      message: 'Marksheet generated successfully',
      downloadUrl: `/api/marksheet/download/${ticketNumber}?sessionWise=${sessionWise}`
    };
  }
};

const Marksheet = () => {
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

  // Load candidates for dropdown
  useEffect(() => {
    if (searchMethod === 'dropdown') {
      loadCandidates();
    }
  }, [searchMethod]);

  const loadCandidates = async () => {
    setLoading(true);
    try {
      const candidatesList = await marksheetAPI.getCandidates();
      setCandidates(candidatesList);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load candidates' });
    } finally {
      setLoading(false);
    }
  };

  const loadCandidateData = async (candidate) => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      setCandidateData(candidate);

      // Load marksheet data
      const marks = await marksheetAPI.getMarksheetData(candidate.ticketNumber);
      setMarksheetData(marks);

      // Load failed subjects
      const failed = await marksheetAPI.getFailedSubjects(candidate.ticketNumber);
      setFailedSubjects(failed);

      setMessage({ type: 'success', text: `Marksheet loaded for: ${candidate.name}` });
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to load candidate data' });
      setCandidateData(null);
      setMarksheetData({});
      setFailedSubjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchCandidate = async () => {
    if (!ticketNumber.trim()) {
      setMessage({ type: 'error', text: 'Please enter a ticket number' });
      return;
    }

    try {
      const candidate = await marksheetAPI.getCandidateByTicket(ticketNumber);
      await loadCandidateData(candidate);
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
      setCandidateData(null);
      setMarksheetData({});
      setFailedSubjects([]);
    }
  };

  const handleCandidateSelect = async (candidateId) => {
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
  };

  const handleGenerateMarksheet = async (sessionWise = false) => {
    if (!candidateData) {
      setMessage({ type: 'error', text: 'No candidate selected' });
      return;
    }

    setGenerating(true);
    setMessage({ type: '', text: '' });

    try {
      const result = await marksheetAPI.generateMarksheet(candidateData.ticketNumber, sessionWise);
      setMessage({ type: 'success', text: result.message });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to generate marksheet' });
    } finally {
      setGenerating(false);
    }
  };

  const handlePrintMarksheet = () => {
    if (marksheetRef.current) {
      const printContent = marksheetRef.current;
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>Marksheet - ${candidateData?.name}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              th, td { border: 1px solid #333; padding: 8px; text-align: center; }
              th { background-color: #f5f5f5; }
              .header { text-align: center; margin-bottom: 30px; }
              .candidate-info { margin: 20px 0; }
              .failed-subjects { color: red; font-weight: bold; }
              @media print { body { margin: 0; } }
            </style>
          </head>
          <body>
            ${printContent.innerHTML}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const resetForm = () => {
    setTicketNumber('');
    setSelectedCandidate('');
    setCandidateData(null);
    setMarksheetData({});
    setFailedSubjects([]);
    setMessage({ type: '', text: '' });
    setSelectedSession('all');
  };

  // Helper functions
  const calculateTotalMarks = () => {
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
  };

  const getPassingMarks = (maxMarks) => Math.ceil(maxMarks * 0.6);

  // Computed values
  const currentCourseStructure = candidateData ? courseStructure[candidateData.courseCode] : null;
  const { total, maxTotal } = calculateTotalMarks();
  const percentage = maxTotal > 0 ? ((total / maxTotal) * 100).toFixed(2) : 0;

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
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
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
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
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
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
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
                    onClick={() => handleGenerateMarksheet(viewMode === 'sessionWise')}
                    disabled={generating}
                    className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    {generating ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Download className="w-5 h-5" />
                    )}
                    {generating ? 'Generating...' : 'Generate PDF'}
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="complete">Complete Marksheet</option>
                    <option value="sessionWise">Session-wise View</option>
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="all">All Sessions</option>
                      {currentCourseStructure && Object.keys(currentCourseStructure).map(session => (
                        <option key={session} value={session}>{session}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="flex items-end">
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 w-full">
                    <p className="text-sm font-semibold text-blue-700">Total Marks</p>
                    <p className="text-2xl font-bold text-blue-900">{total}/{maxTotal}</p>
                    <p className="text-sm text-blue-600">{percentage}%</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Marksheet Display */}
          {candidateData && (
            <div ref={marksheetRef} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
              {/* Header */}
              <div className="text-center mb-8 border-b border-gray-300 pb-6">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">INDIAN RAILWAYS</h1>
                    <p className="text-lg text-gray-600">ZONAL RAILWAY TRAINING INSTITUTE</p>
                    <p className="text-xl font-semibold text-gray-800">STATEMENT OF MARKS</p>
                  </div>
                </div>
              </div>

              {/* Candidate Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-700">Name:</span>
                    <span className="text-gray-900">{candidateData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-700">Batch:</span>
                    <span className="text-gray-900">{candidateData.batch}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-700">Post:</span>
                    <span className="text-gray-900">{candidateData.post}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-700">Stream:</span>
                    <span className="text-gray-900">{candidateData.stream}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-700">Father's Name:</span>
                    <span className="text-gray-900">{candidateData.fatherName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-700">Roll No:</span>
                    <span className="text-gray-900">{candidateData.rollNo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-700">Module:</span>
                    <span className="text-gray-900">{candidateData.courseCode}</span>
                  </div>
                </div>
              </div>

              {/* Marks Table */}
              {currentCourseStructure && (
                <div className="overflow-x-auto mb-8">
                  <table className="w-full border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Session</th>
                        <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Paper</th>
                        <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Subjects</th>
                        <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Max Marks</th>
                        <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Obtained Marks</th>
                        <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Percentage</th>
                        <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Result</th>
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
                            <tr key={`${session}-${paper}`} className={!isPassed ? 'bg-red-50' : ''}>
                              {paperIndex === 0 && (
                                <td
                                  className="border border-gray-300 px-4 py-3 font-medium text-gray-800"
                                  rowSpan={Object.keys(papers).length}
                                >
                                  {session}
                                </td>
                              )}
                              <td className="border border-gray-300 px-4 py-3">{paper}</td>
                              <td className="border border-gray-300 px-4 py-3 text-center text-sm">
                                {config.subjects.length > 0 ? config.subjects.join(', ') : '-'}
                              </td>
                              <td className="border border-gray-300 px-4 py-3 text-center font-medium">
                                {config.maxMarks}
                              </td>
                              <td className={`border border-gray-300 px-4 py-3 text-center font-bold ${!isPassed ? 'text-red-600' : 'text-green-600'
                                }`}>
                                {marks}
                              </td>
                              <td className={`border border-gray-300 px-4 py-3 text-center ${!isPassed ? 'text-red-600' : 'text-green-600'
                                }`}>
                                {percentage}%
                              </td>
                              <td className={`border border-gray-300 px-4 py-3 text-center font-medium ${!isPassed ? 'text-red-600' : 'text-green-600'
                                }`}>
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

              {/* Summary */}
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">TOTAL MARKS</h3>
                    <p className="text-3xl font-bold text-blue-600">{total}/{maxTotal}</p>
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">FINAL PERCENTAGE</h3>
                    <p className="text-3xl font-bold text-green-600">{percentage}%</p>
                  </div>
                </div>

                {/* Failed Subjects Disclaimer */}
                {failedSubjects.length > 0 && (
                  <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      <span className="font-bold text-red-800">Disclaimer: Candidate has failed in subject(s):</span>
                    </div>
                    <p className="text-red-700 font-medium">
                      {failedSubjects.map(subject =>
                        subject.subjects.length > 0 ? subject.subjects.join(', ') : `${subject.session} - ${subject.paper}`
                      ).join(', ')}
                    </p>
                    <p className="text-red-600 text-sm mt-2">
                      Passing criteria: 60% or above required in each subject.
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-gray-300 pt-6">
                <div className="grid grid-cols-3 gap-8 text-center">
                  <div>
                    <p className="font-semibold text-gray-800">Checked By</p>
                    <div className="h-16 border-b border-gray-300 mt-8"></div>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Principal / Director</p>
                    <div className="h-16 border-b border-gray-300 mt-8"></div>
                    <p className="text-sm text-gray-600 italic mt-2">
                      Date of Generation: {new Date().toLocaleDateString("en-IN")}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Prepared By</p>
                    <div className="h-16 border-b border-gray-300 mt-8"></div>
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

