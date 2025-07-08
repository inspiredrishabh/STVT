import  { useState, useEffect } from 'react';
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

// Real API Functions
const realAPI = {
  // Function to map flat DB marks to nested structure using courseStructure
  mapDbMarksToNested: (courseCode, dbMarks) => {
    const structure = courseStructure[courseCode];
    if (!structure) return {};

    const nested = {};
    let sessionIndex = 1;
    for (const [sessionName, papers] of Object.entries(structure)) {
      nested[sessionName] = {};
      let paperIndex = 1;
      for (const [paperName, config] of Object.entries(papers)) {
        let key;
        if (paperName === "Practical") {
          key = `s${sessionIndex}pr_marks`;
        } else if (paperName === "Interview") {
          key = `s${sessionIndex}int_marks`;
        } else {
          key = `s${sessionIndex}p${paperIndex}_marks`;
        }
        nested[sessionName][paperName] = dbMarks[key] ?? 0;
        if (paperName !== "Practical" && paperName !== "Interview") {
          paperIndex++;
        }
      }
      sessionIndex++;
    }
    return nested;
  },

  // Get existing marks for a candidate
  getExistingMarks: async (ticketNo, courseCode) => {
    try {
      console.log('Fetching marks for:', { ticketNo, courseCode }); // Debug log
      if (!ticketNo || !courseCode) {
        throw new Error(`Missing parameters: ticketNo=${ticketNo}, courseCode=${courseCode}`);
      }
      
      // Handle special characters in course code for URL
      
      const response = await fetch(`/api/${courseCode.toLowerCase()}/${ticketNo}`);
      if (!response.ok) {
        if (response.status === 404) {
          // No marks found, return empty structure
          return { mainMarks: {}, supplementaryMarks: {}, practicalCenters: {}, hasExistingMarks: false };
        }
        throw new Error(`Failed to fetch marks: ${response.statusText}`);
      }
      
      const dbMarks = await response.json();
      const mainMarks = realAPI.mapDbMarksToNested(courseCode, dbMarks.data || dbMarks);
      
      // Check if marks actually exist (not all zeros)
      const hasExistingMarks = Object.values(mainMarks).some(session => 
        Object.values(session).some(mark => mark && mark > 0)
      );
      
      // For now, supplementary marks and practical centers are empty
      // You can extend this based on your backend implementation
      const supplementaryMarks = {};
      const practicalCenters = {};

      return { mainMarks, supplementaryMarks, practicalCenters, hasExistingMarks };
    } catch (error) {
      console.error('Error fetching marks:', error);
      // Return empty structure if fetch fails
      return { mainMarks: {}, supplementaryMarks: {}, practicalCenters: {}, hasExistingMarks: false };
    }
  },

  // Save marks with PUT for updates and POST for new marks
  saveMarks: async (ticketNo, marks, courseCode, supplementaryMarks = {}, practicalCenters = {}, isEditMode = false) => {
    try {
      // Build formData using the existing buildFormData function
      const structure = courseStructure[courseCode];
      const formData = { ticket_no: ticketNo };
      
      let sessionIndex = 1;
      for (const [sessionName, papers] of Object.entries(structure)) {
        let paperIndex = 1;
        for (const [paperName, config] of Object.entries(papers)) {
          let key;
          if (paperName === "Practical") {
            key = `s${sessionIndex}pr_marks`;
          } else if (paperName === "Interview") {
            key = `s${sessionIndex}int_marks`;
          } else {
            key = `s${sessionIndex}p${paperIndex}_marks`;
          }
          formData[key] = marks[sessionName]?.[paperName] ?? 0;
          if (paperName !== "Practical" && paperName !== "Interview") {
            paperIndex++;
          }
        }
        sessionIndex++;
      }

      const method = isEditMode ? "PUT" : "POST";
      const response = await fetch(`/api/${courseCode.toLowerCase()}${isEditMode ? `/${ticketNo}` : ''}`, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errData.message || response.statusText}`);
      }

      const result = await response.json();
      return { success: true, message: isEditMode ? 'Marks updated successfully!' : 'Marks saved successfully!', data: result };
    } catch (error) {
      console.error('Error saving marks:', error);
      throw error;
    }
  },

  // Clear supplementary status for a specific subject
  clearSubjectSupplementary: async (ticketNo, session, paper, courseCode, supplementaryMarks) => {
    try {
      const response = await fetch(`/api/${courseCode.toLowerCase()}/clear-supplementary`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticketNo,
          session,
          paper,
          supplementaryMarks
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errData.message || response.statusText}`);
      }

      const result = await response.json();
      return { 
        success: true, 
        message: `Supplementary status cleared for ${session} - ${paper}. Only main marks will be used for this subject.`,
        data: result 
      };
    } catch (error) {
      console.error('Error clearing supplementary status:', error);
      throw error;
    }
  }
};

const FeedMark = () => {

  const [searchParams] = useSearchParams();
  const [ticketNo, setTicketNo] = useState("");
  const [searchMethod, setSearchMethod] = useState('ticket'); // 'ticket' or 'dropdown'
  // const [ticketNo, setticketNo] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [candidateData, setCandidateData] = useState(null);
  const [courseCode, setCourseCode] = useState('');
  const [marks, setMarks] = useState({});
  const [supplementaryMarks, setSupplementaryMarks] = useState({}); // Track supplementary exam marks
  const [clearedSupplementary, setClearedSupplementary] = useState({}); // Track cleared supplementary subjects
  const [practicalCenters, setPracticalCenters] = useState({}); // Track practical centers data
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [candidatesLoading, setCandidatesLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // Track if we're editing existing marks
  const [hasExistingMarks, setHasExistingMarks] = useState(false); // Track if candidate has existing marks

  // Auto-search function for URL parameters
  const handleAutoSearch = async (ticketNo) => {
    if (ticketNo.trim() === "") {
      setMessage({ type: 'error', text: 'Invalid ticket number from URL' });
      return;
    }

    setLoading(true);
    setMessage({ type: 'info', text: 'Auto-loading trainee data...' });

    try {
      const response = await fetch(`/api/stc/${ticketNo}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch candidate with ticket ${ticketNo}`);
      }
      
      const result = await response.json();
      const candidate = result.data;

      setCandidateData(candidate);
      setCourseCode(candidate.module_no);
      setTicketNo(candidate.ticket_no);

      const marksData = await realAPI.getExistingMarks(ticketNo, candidate.module_no);
      setMarks(marksData.mainMarks);
      setSupplementaryMarks(marksData.supplementaryMarks);
      setPracticalCenters(marksData.practicalCenters || {});
      setHasExistingMarks(marksData.hasExistingMarks);
      setIsEditMode(false); // Start in view mode

      if (marksData.hasExistingMarks) {
        setMessage({ type: 'success', text: `✓ Auto-loaded: ${candidate.name} - Existing marks found. Click "Edit Marks" to modify.` });
      } else {
        setMessage({ type: 'success', text: `✓ Auto-loaded: ${candidate.name} - Ready to enter marks` });
      }

    } catch (error) {
      setMessage({ type: 'error', text: `Failed to auto-load trainee: ${error.message}` });
      setCandidateData(null);
      setCourseCode('');
      setMarks({});
      setSupplementaryMarks({});
      setHasExistingMarks(false);
      setIsEditMode(false);
    } finally {
      setLoading(false);
    }

  };

  // Handle URL parameters for auto-selection from TraineeProfile
  useEffect(() => {
    const traineeId = searchParams.get('traineeId');
    const urlTicketNo = searchParams.get('ticketNo');
    const autoSelect = searchParams.get('autoSelect');

    if (autoSelect === 'true' && urlTicketNo) {
      // Set the form state immediately
      setTicketNo(urlTicketNo);
      setSearchMethod('ticket');

      // Clear any existing messages
      setMessage({ type: '', text: '' });

      // Auto-load the candidate data immediately with a small delay to ensure UI updates
      setTimeout(() => {
        handleAutoSearch(urlTicketNo);
      }, 100);
    }
  }, [searchParams]);

  // ---------------   Load candidates from dropdown------------- 
  useEffect(() => {
    if (searchMethod === 'dropdown') {
      loadCandidates();
    }
  }, [searchMethod]);

  const loadCandidates = async () => {
  setCandidatesLoading(true);
  setMessage('Loading Data ');

  try {
    const response = await fetch('/api/stc');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const result = await response.json();

    if (result.success) {
      setCandidates(result.data);
    } else {
      throw new Error(result.message || 'The API returned an error.');
    }

  } catch (error) {
    console.error("Failed to load candidates:", error);
    setMessage({ type: 'error', text: error.message });

  } finally {
    setCandidatesLoading(false);
  }
};
  // ---------------   -------------   --------------------


  const handleSearchCandidate = async () => {
    if (!ticketNo.trim()) {
      setMessage({ type: 'error', text: 'Please enter a ticket number' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // const candidate = await mockAPI.getCandidateByTicket(ticketNo);
      const response = await fetch(`/api/stc/${ticketNo}`);
      const result = await response.json();
      const candidate = result.data;
      setCandidateData(candidate);
      setCourseCode(candidate.module_no);
      setTicketNo(candidate.ticket_no);

      // Load existing marks
      const marksData = await realAPI.getExistingMarks(ticketNo, candidate.module_no);
      setMarks(marksData.mainMarks);
      setSupplementaryMarks(marksData.supplementaryMarks);
      setPracticalCenters(marksData.practicalCenters || {});
      setHasExistingMarks(marksData.hasExistingMarks);
      setIsEditMode(false); // Start in view mode

      if (marksData.hasExistingMarks) {
        setMessage({ type: 'success', text: `Candidate found: ${candidate.name} - Existing marks found. Click "Edit Marks" to modify.` });
      } else {
        setMessage({ type: 'success', text: `Candidate found: ${candidate.name} - Ready to enter marks` });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
      setCandidateData(null);
      setCourseCode('');
      setMarks({});
      setSupplementaryMarks({});
      setHasExistingMarks(false);
      setIsEditMode(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCandidateSelect = async (candidateId) => {
    if (!candidateId) {
      setCandidateData(null);
      setCourseCode('');
      setMarks({});
      setHasExistingMarks(false);
      setIsEditMode(false);
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const candidate = candidates.find(c => c.id == parseInt(candidateId));
      if (!candidate) {
        throw new Error('Candidate not found');
      }

      setCandidateData(candidate);
      setCourseCode(candidate.module_no);
      setTicketNo(candidate.ticket_no || candidate.ticketNo);

      // Load existing marks
      const marksData = await realAPI.getExistingMarks(candidate.ticket_no || candidate.ticketNo, candidate.module_no);
      setMarks(marksData.mainMarks);
      setSupplementaryMarks(marksData.supplementaryMarks);
      setPracticalCenters(marksData.practicalCenters || {});
      setHasExistingMarks(marksData.hasExistingMarks);
      setIsEditMode(false); // Start in view mode

      if (marksData.hasExistingMarks) {
        setMessage({ type: 'success', text: `Candidate selected: ${candidate.name} - Existing marks found. Click "Edit Marks" to modify.` });
      } else {
        setMessage({ type: 'success', text: `Candidate selected: ${candidate.name} - Ready to enter marks` });
      }
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
      const result = await realAPI.saveMarks(
        candidateData.ticket_no, 
        marks, 
        courseCode, 
        supplementaryMarks, 
        practicalCenters,
        isEditMode
      );
      
      setMessage({ type: 'success', text: result.message });
      
      // If we were in edit mode, update the state
      if (isEditMode) {
        setIsEditMode(false);
        setHasExistingMarks(true);
      } else {
        // First time saving marks
        setHasExistingMarks(true);
      }
      
      return { success: true, data: result };
    } catch (error) {
      setMessage({ type: 'error', text: `Failed to save marks: ${error.message}` });
    } finally {
      setSaving(false);
    }
  };

  const handleSupplementaryMarksChange = (session, paper, value) => {
    const numValue = value === '' ? '' : parseInt(value);
    setSupplementaryMarks(prev => ({
      ...prev,
      [session]: {
        ...prev[session],
        [paper]: numValue
      }
    }));
  };

  const handleClearSubjectSupplementary = async (session, paper) => {
    if (!candidateData) {
      setMessage({ type: 'error', text: 'No candidate selected' });
      return;
    }

    // Check if supplementary marks are entered and passing
    const suppMarks = supplementaryMarks[session]?.[paper];
    const paperConfig = currentCourseStructure[session][paper];
    const passingMarks = getPassingMarks(paperConfig.maxMarks);

    if (!suppMarks) {
      setMessage({ type: 'error', text: 'Please enter supplementary exam marks first before clearing supplementary status.' });
      return;
    }

    if (suppMarks < passingMarks) {
      setMessage({ type: 'error', text: `Cannot clear supplementary status. Supplementary marks (${suppMarks}) are still below passing marks (${passingMarks}). Student remains in supplementary status.` });
      return;
    }

    if (!confirm(`Are you sure you want to clear supplementary status for ${session} - ${paper}? 
    
Supplementary marks: ${suppMarks}/${paperConfig.maxMarks} (PASSING ✓)
This will use only main marks for this subject in marksheet generation.`)) {
      return;
    }

    setClearing(true);
    setMessage({ type: '', text: '' });

    try {
      const result = await realAPI.clearSubjectSupplementary(
        candidateData.ticket_no, 
        session, 
        paper, 
        courseCode, 
        supplementaryMarks[session]?.[paper]
      );

      // Mark this subject as cleared from supplementary
      setClearedSupplementary(prev => ({
        ...prev,
        [`${session}_${paper}`]: true
      }));

      setMessage({ type: 'success', text: `${result.message} Supplementary marks: ${suppMarks}/${paperConfig.maxMarks} (PASSED)` });
    } catch (error) {
      setMessage({ type: 'error', text: `Failed to clear supplementary status: ${error.message}` });
    } finally {
      setClearing(false);
    }
  };

  // Practical marks multi-center handlers
  const handlePracticalCentersChange = (session, field, value) => {
    setPracticalCenters(prev => ({
      ...prev,
      [session]: {
        ...prev[session],
        [field]: value,
        centers: field === 'numCenters' ?
          Array.from({ length: value }, (_, i) => prev[session]?.centers?.[i] || { name: '', marks: '', maxMarks: '' }) :
          prev[session]?.centers || []
      }
    }));
  };

  const handlePracticalCenterNameChange = (session, index, name) => {
    setPracticalCenters(prev => {
      const centers = [...(prev[session]?.centers || [])];
      centers[index] = { ...centers[index], name };
      return {
        ...prev,
        [session]: {
          ...prev[session],
          centers
        }
      };
    });
  };

  const handlePracticalCenterMarksChange = (session, index, marks) => {
    const numValue = marks === '' ? '' : parseInt(marks);
    setPracticalCenters(prev => {
      const centers = [...(prev[session]?.centers || [])];
      centers[index] = { ...centers[index], marks: numValue };
      return {
        ...prev,
        [session]: {
          ...prev[session],
          centers
        }
      };
    });

    // Update the main marks with combined result
    const updatedCenters = [...(practicalCenters[session]?.centers || [])];
    updatedCenters[index] = { ...updatedCenters[index], marks: numValue };
    const combinedMarks = updatedCenters.reduce((sum, center) => sum + (center.marks || 0), 0);

    handleMarksChange(session, 'Practical', combinedMarks);
  };

  const handlePracticalCenterMaxMarksChange = (session, index, maxMarks) => {
    const numValue = maxMarks === '' ? '' : parseInt(maxMarks);
    setPracticalCenters(prev => {
      const centers = [...(prev[session]?.centers || [])];
      centers[index] = { ...centers[index], maxMarks: numValue };
      return {
        ...prev,
        [session]: {
          ...prev[session],
          centers
        }
      };
    });
  };

  const getCombinedPracticalMarks = (session) => {
    const centers = practicalCenters[session]?.centers || [];
    return centers.reduce((sum, center) => sum + (center.marks || 0), 0);
  };

  const getCombinedPracticalMaxMarks = (session) => {
    const centers = practicalCenters[session]?.centers || [];
    return centers.reduce((sum, center) => sum + (center.maxMarks || 0), 0);
  };

  const resetForm = () => {
    setTicketNo('');
    setSelectedCandidate('');
    setCandidateData(null);
    setCourseCode('');
    setMarks({});
    setSupplementaryMarks({}); // Reset supplementary marks
    setClearedSupplementary({}); // Reset cleared supplementary status
    setPracticalCenters({}); // Reset practical centers data
    setHasExistingMarks(false); // Reset existing marks status
    setIsEditMode(false); // Reset edit mode
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

  // Check if supplementary marks are passing
  const isSupplementaryPassing = (session, paper, maxMarks) => {
    const suppMarks = supplementaryMarks[session]?.[paper];
    if (!suppMarks) return false;
    const passingMarks = getPassingMarks(maxMarks);
    return suppMarks >= passingMarks;
  };

  // Check if supplementary marks are entered
  const hasSupplementaryMarks = (session, paper) => {
    return supplementaryMarks[session]?.[paper] ? true : false;
  };

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
                    value={ticketNo}
                    onChange={(e) => setTicketNo(e.target.value)}
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
                        {candidate.ticket_no || candidate.ticketNo} - {candidate.name} ({candidate.module_no})
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
                    disabled={loading || !ticketNo}
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

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                  <label className="block text-sm font-semibold text-blue-700 mb-1">Ticket Number</label>
                  <p className="text-lg font-bold text-blue-900">{candidateData.ticket_no}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                  <label className="block text-sm font-semibold text-green-700 mb-1">Name</label>
                  <p className="text-lg font-bold text-green-900">{candidateData.name}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
                  <label className="block text-sm font-semibold text-purple-700 mb-1">Course Code</label>
                  <p className="text-lg font-bold text-purple-900">{candidateData.module_no}</p>
                </div>
                <div className={`p-4 rounded-xl border ${
                  hasExistingMarks && !isEditMode 
                    ? 'bg-gray-50 border-gray-200'
                    : isEditMode 
                    ? 'bg-orange-50 border-orange-200'
                    : 'bg-yellow-50 border-yellow-200'
                }`}>
                  <label className={`block text-sm font-semibold mb-1 ${
                    hasExistingMarks && !isEditMode 
                      ? 'text-gray-700'
                      : isEditMode 
                      ? 'text-orange-700'
                      : 'text-yellow-700'
                  }`}>Status</label>
                  <p className={`text-lg font-bold ${
                    hasExistingMarks && !isEditMode 
                      ? 'text-gray-900'
                      : isEditMode 
                      ? 'text-orange-900'
                      : 'text-yellow-900'
                  }`}>
                    {hasExistingMarks && !isEditMode 
                      ? 'View Mode'
                      : isEditMode 
                      ? 'Edit Mode'
                      : 'Entry Mode'}
                  </p>
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
                    <h2 className="text-xl font-bold text-gray-900">
                      {hasExistingMarks && !isEditMode ? 'View Marks' : isEditMode ? 'Edit Marks' : 'Enter Marks'} - {courseCode}
                    </h2>
                    <p className="text-gray-600 text-sm">
                      {hasExistingMarks && !isEditMode 
                        ? 'Viewing existing marks - Click "Edit Marks" to modify' 
                        : isEditMode 
                        ? 'Editing examination marks - Click "Update Marks" to save changes'
                        : 'Input examination marks for all sessions'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {hasExistingMarks && !isEditMode ? (
                    // View mode - show edit button
                    <button
                      onClick={() => setIsEditMode(true)}
                      className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <Save className="w-5 h-5" />
                      Edit Marks
                    </button>
                  ) : (
                    // Edit mode or no existing marks - show save/update button
                    <>
                      {isEditMode && (
                        <button
                          onClick={() => setIsEditMode(false)}
                          className="flex items-center gap-2 px-4 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all duration-200"
                        >
                          Cancel
                        </button>
                      )}
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
                        {saving ? 'Saving...' : (isEditMode ? 'Update Marks' : 'Save Marks')}
                      </button>
                    </>
                  )}
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

                        // For practical marks, use combined max marks if available
                        const effectiveMaxMarks = paper === 'Practical' && getCombinedPracticalMaxMarks(session) > 0
                          ? getCombinedPracticalMaxMarks(session)
                          : config.maxMarks;

                        const passingMarks = getPassingMarks(effectiveMaxMarks);
                        const isFailingGrade = shouldShowAsFailed(session, paper, paperMarks, effectiveMaxMarks);
                        const isOverMaxMarks = paperMarks > effectiveMaxMarks;
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
                                  Max: {paper === 'Practical' && getCombinedPracticalMaxMarks(session) > 0
                                    ? `${getCombinedPracticalMaxMarks(session)} (Combined)`
                                    : config.maxMarks}
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

                            {paper === 'Practical' ? (
                              // Multi-center practical marks section
                              <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                  <label className="text-sm font-medium text-gray-700">
                                    Number of Centers:
                                  </label>
                                  {practicalCenters[session]?.isCustomNumber ? (
                                    <div className="flex items-center gap-2">
                                      <input
                                        type="number"
                                        min="1"
                                        max="20"
                                        value={practicalCenters[session]?.numCenters || ''}
                                        onChange={(e) => handlePracticalCentersChange(session, 'numCenters', parseInt(e.target.value) || 1)}
                                        readOnly={hasExistingMarks && !isEditMode}
                                        className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-20 ${
                                          hasExistingMarks && !isEditMode 
                                            ? 'bg-gray-100 cursor-not-allowed text-gray-600 border-gray-300' 
                                            : 'border-gray-300'
                                        }`}
                                        placeholder="1-20"
                                      />
                                      <button
                                        onClick={() => handlePracticalCentersChange(session, 'isCustomNumber', false)}
                                        disabled={hasExistingMarks && !isEditMode}
                                        className={`px-2 py-1 text-xs rounded ${
                                          hasExistingMarks && !isEditMode 
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                      >
                                        Back
                                      </button>
                                    </div>
                                  ) : (
                                    <select
                                      value={practicalCenters[session]?.numCenters === 'custom' ? 'custom' : (practicalCenters[session]?.numCenters || 1)}
                                      onChange={(e) => {
                                        if (e.target.value === 'custom') {
                                          handlePracticalCentersChange(session, 'isCustomNumber', true);
                                          handlePracticalCentersChange(session, 'numCenters', 1);
                                        } else {
                                          handlePracticalCentersChange(session, 'numCenters', parseInt(e.target.value));
                                        }
                                      }}
                                      disabled={hasExistingMarks && !isEditMode}
                                      className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                        hasExistingMarks && !isEditMode 
                                          ? 'bg-gray-100 cursor-not-allowed text-gray-600 border-gray-300' 
                                          : 'border-gray-300'
                                      }`}
                                    >
                                      {[1, 2, 3, 4, 5].map(num => (
                                        <option key={num} value={num}>{num}</option>
                                      ))}
                                      <option value="custom">Other (Custom)</option>
                                    </select>
                                  )}
                                </div>

                                {Array.from({ length: practicalCenters[session]?.numCenters || 1 }, (_, index) => (
                                  <div key={index} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                                    <div className="flex items-center gap-3 mb-2">
                                      <span className="text-sm font-medium text-gray-700">Center {index + 1}:</span>
                                      <input
                                        type="text"
                                        value={practicalCenters[session]?.centers?.[index]?.name || ''}
                                        onChange={(e) => handlePracticalCenterNameChange(session, index, e.target.value)}
                                        placeholder="Enter center name"
                                        readOnly={hasExistingMarks && !isEditMode}
                                        className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
                                          hasExistingMarks && !isEditMode 
                                            ? 'bg-gray-100 cursor-not-allowed text-gray-600 border-gray-300' 
                                            : 'border-gray-300'
                                        }`}
                                      />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                      <div>
                                        <label className="block text-xs text-gray-600 mb-1">Marks Obtained:</label>
                                        <input
                                          type="number"
                                          min="0"
                                          value={practicalCenters[session]?.centers?.[index]?.marks || ''}
                                          onChange={(e) => handlePracticalCenterMarksChange(session, index, e.target.value)}
                                          placeholder="Enter marks"
                                          readOnly={hasExistingMarks && !isEditMode}
                                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
                                            hasExistingMarks && !isEditMode 
                                              ? 'bg-gray-100 cursor-not-allowed text-gray-600 border-gray-300' 
                                              : 'border-gray-300'
                                          }`}
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-xs text-gray-600 mb-1">Max Marks:</label>
                                        <input
                                          type="number"
                                          min="1"
                                          value={practicalCenters[session]?.centers?.[index]?.maxMarks || ''}
                                          onChange={(e) => handlePracticalCenterMaxMarksChange(session, index, e.target.value)}
                                          placeholder="Max marks"
                                          readOnly={hasExistingMarks && !isEditMode}
                                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
                                            hasExistingMarks && !isEditMode 
                                              ? 'bg-gray-100 cursor-not-allowed text-gray-600 border-gray-300' 
                                              : 'border-gray-300'
                                          }`}
                                        />
                                      </div>
                                    </div>
                                    {practicalCenters[session]?.centers?.[index]?.marks && practicalCenters[session]?.centers?.[index]?.maxMarks && (
                                      <div className="mt-2 text-xs text-gray-600">
                                        Percentage: {((practicalCenters[session].centers[index].marks / practicalCenters[session].centers[index].maxMarks) * 100).toFixed(1)}%
                                      </div>
                                    )}
                                  </div>
                                ))}

                                {practicalCenters[session]?.centers?.length > 0 && (
                                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="text-sm font-medium text-blue-800">Combined Result:</span>
                                      <span className="text-sm font-bold text-blue-900">
                                        {getCombinedPracticalMarks(session)} / {getCombinedPracticalMaxMarks(session)}
                                      </span>
                                    </div>
                                    <div className="text-xs text-blue-700">
                                      Overall Percentage: {getCombinedPracticalMaxMarks(session) > 0 ? ((getCombinedPracticalMarks(session) / getCombinedPracticalMaxMarks(session)) * 100).toFixed(1) : 0}%
                                    </div>
                                    <div className="text-xs text-blue-700 mt-1">
                                      Status: {getCombinedPracticalMaxMarks(session) > 0 && getCombinedPracticalMarks(session) >= (getCombinedPracticalMaxMarks(session) * 0.6) ? 'PASS' : 'FAIL'}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ) : (
                              // Regular paper marks input
                              <input
                                type="number"
                                min="0"
                                max={config.maxMarks}
                                value={paperMarks || ''}
                                onChange={(e) => handleMarksChange(session, paper, e.target.value)}
                                placeholder={`Enter marks (0-${config.maxMarks})`}
                                readOnly={hasExistingMarks && !isEditMode}
                                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                                  hasExistingMarks && !isEditMode 
                                    ? 'bg-gray-100 cursor-not-allowed text-gray-600' 
                                    : isOverMaxMarks
                                    ? 'border-red-300 bg-red-50'
                                    : isFailingGrade
                                      ? 'border-red-400 bg-red-50'
                                      : isCleared && isBelowPassing
                                        ? 'border-yellow-400 bg-yellow-50'
                                        : 'border-gray-300'
                                  }`}
                              />
                            )}

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
                                {hasSupplementaryMarks(session, paper) && (
                                  <div className={`text-xs p-2 rounded-lg ${isSupplementaryPassing(session, paper, config.maxMarks)
                                    ? 'bg-green-50 text-green-700 border border-green-200'
                                    : 'bg-red-50 text-red-700 border border-red-200'
                                    }`}>
                                    Supplementary: {supplementaryMarks[session][paper]}/{config.maxMarks} - {
                                      isSupplementaryPassing(session, paper, config.maxMarks)
                                        ? '✓ PASSING'
                                        : '✗ STILL FAILING'
                                    }
                                  </div>
                                )}
                                <button
                                  onClick={() => handleClearSubjectSupplementary(session, paper)}
                                  disabled={clearing || !hasSupplementaryMarks(session, paper) || !isSupplementaryPassing(session, paper, config.maxMarks)}
                                  className={`w-full flex items-center justify-center gap-2 px-3 py-2 text-white text-xs rounded-lg transition-all duration-200 ${hasSupplementaryMarks(session, paper) && isSupplementaryPassing(session, paper, config.maxMarks)
                                    ? 'bg-green-600 hover:bg-green-700'
                                    : 'bg-gray-400 cursor-not-allowed'
                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                                  title={
                                    !hasSupplementaryMarks(session, paper)
                                      ? 'Enter supplementary marks first'
                                      : !isSupplementaryPassing(session, paper, config.maxMarks)
                                        ? 'Supplementary marks must be passing to clear status'
                                        : `Clear supplementary status for ${session} - ${paper}`
                                  }
                                >
                                  {clearing ? (
                                    <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                                  ) : (
                                    <RefreshCw className="w-3 h-3" />
                                  )}
                                  {hasSupplementaryMarks(session, paper) && isSupplementaryPassing(session, paper, config.maxMarks)
                                    ? 'Clear Supplementary ✓'
                                    : 'Clear Supplementary'}
                                </button>
                                {!hasSupplementaryMarks(session, paper) && (
                                  <p className="text-xs text-gray-500 text-center">
                                    📝 Enter supplementary marks below to enable clearing
                                  </p>
                                )}
                                {hasSupplementaryMarks(session, paper) && !isSupplementaryPassing(session, paper, config.maxMarks) && (
                                  <p className="text-xs text-red-500 text-center">
                                    ❌ Supplementary marks still below passing. Student remains in supplementary status.
                                  </p>
                                )}
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
                      <div className="text-orange-800 text-sm">
                        <p className="font-semibold mb-2">Process for Clearing Supplementary Status:</p>
                        <ol className="list-decimal list-inside space-y-1 text-xs">
                          <li>Enter supplementary exam marks in the "Record Only" fields below</li>
                          <li>If supplementary marks are ≥60% (passing), the "Clear Supplementary" button will be enabled</li>
                          <li>Click "Clear Supplementary" to use main exam marks for marksheet generation</li>
                          <li>If supplementary marks are still below 60%, student remains in supplementary status</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {failedSubjects.map((subject, index) => (
                      <div key={index} className="bg-white p-4 rounded-lg border border-red-200">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <span className="font-semibold text-red-800">{subject.session} - {subject.paper}</span>
                            <span className="text-xs text-red-600 block">
                              Required: {subject.passingMarks} (60% of {subject.maxMarks})
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-red-600 font-bold">{subject.marks}/{subject.maxMarks}</span>
                            <span className="text-xs text-red-500 block">Main Exam</span>
                          </div>
                        </div>

                        {/* Supplementary Marks Input */}
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="flex items-center gap-3">
                            <div className="flex-1">
                              <label className="block text-xs font-medium text-blue-700 mb-1">
                                Supplementary Exam Marks (Record Only)
                              </label>
                              <input
                                type="number"
                                min="0"
                                max={subject.maxMarks}
                                value={supplementaryMarks[subject.session]?.[subject.paper] || ''}
                                onChange={(e) => handleSupplementaryMarksChange(subject.session, subject.paper, e.target.value)}
                                readOnly={hasExistingMarks && !isEditMode}
                                className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                  hasExistingMarks && !isEditMode 
                                    ? 'bg-gray-100 cursor-not-allowed text-gray-600 border-gray-300' 
                                    : 'border-blue-300'
                                }`}
                                placeholder={`0-${subject.maxMarks}`}
                              />
                            </div>
                            <div className="text-xs text-gray-500 pt-4">
                              /{subject.maxMarks}
                            </div>
                          </div>
                          <p className="text-xs text-blue-600 mt-1">
                            💡 These marks are for record keeping only. Main exam marks will be used in marksheet generation.
                          </p>
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
