import React, { useState, useEffect } from "react";
import {
  Search,
  UserCheck,
  BookOpen,
  Save,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  ClipboardList,
  RefreshCw,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

// Course structure definition
const courseStructure = {
  "MSE-C&W": {
    "Session 1": {
      "Paper 1": { maxMarks: 100, subjects: ["MRT-01", "MRT-06"] },
      "Paper 2": {
        maxMarks: 100,
        subjects: ["MRT-02", "MRT-03", "MRT-04", "MRT-05"],
      },
      Practical: { maxMarks: 50, subjects: [] },
    },
    "Session 2": {
      "Paper 1": { maxMarks: 75, subjects: ["MRT-07", "MRT-09"] },
      "Paper 2": { maxMarks: 100, subjects: ["MCT-01"] },
      Practical: { maxMarks: 50, subjects: [] },
    },
    "Session 3": {
      "Paper 1": { maxMarks: 100, subjects: ["MCT-02/I"] },
      "Paper 2": { maxMarks: 50, subjects: ["MCT-02/II"] },
      "Paper 3": { maxMarks: 25, subjects: ["MRT-08"] },
      "Paper 4": { maxMarks: 50, subjects: ["MRT-11"] },
      Practical: { maxMarks: 50, subjects: [] },
    },
    "Session 4": {
      "Paper 1": { maxMarks: 100, subjects: ["MRT-12"] },
      Practical: { maxMarks: 50, subjects: [] },
      Interview: { maxMarks: 100, subjects: [] },
    },
  },
  "MSE-D": {
    "Session 1": {
      "Paper 1": { maxMarks: 100, subjects: ["MRT-01", "MRT-06"] },
      "Paper 2": {
        maxMarks: 100,
        subjects: ["MRT-02", "MRT-03", "MRT-04", "MRT-05"],
      },
      Practical: { maxMarks: 50, subjects: [] },
    },
    "Session 2": {
      "Paper 1": { maxMarks: 75, subjects: ["MRT-07", "MRT-09"] },
      "Paper 2": { maxMarks: 100, subjects: ["MDT-01"] },
      Practical: { maxMarks: 50, subjects: [] },
    },
    "Session 3": {
      "Paper 1": { maxMarks: 100, subjects: ["MDT-02/I"] },
      "Paper 2": { maxMarks: 50, subjects: ["MDT-02/II"] },
      "Paper 3": { maxMarks: 25, subjects: ["MRT-08"] },
      "Paper 4": { maxMarks: 50, subjects: ["MRT-11"] },
      Practical: { maxMarks: 50, subjects: [] },
    },
    "Session 4": {
      "Paper 1": { maxMarks: 100, subjects: ["MRT-12"] },
      Practical: { maxMarks: 50, subjects: [] },
      Interview: { maxMarks: 100, subjects: [] },
    },
  },
  "MSE-W": {
    "Session 1": {
      "Paper 1": { maxMarks: 100, subjects: ["MRT-01", "MRT-06"] },
      "Paper 2": {
        maxMarks: 100,
        subjects: ["MRT-02", "MRT-03", "MRT-04", "MRT-05"],
      },
      Practical: { maxMarks: 50, subjects: [] },
    },
    "Session 2": {
      "Paper 1": { maxMarks: 75, subjects: ["MRT-07", "MRT-09"] },
      "Paper 2": { maxMarks: 100, subjects: ["MWT-01"] },
      Practical: { maxMarks: 50, subjects: [] },
    },
    "Session 3": {
      "Paper 1": { maxMarks: 100, subjects: ["MWT-02"] },
      "Paper 2": { maxMarks: 50, subjects: ["MWT-04"] },
      "Paper 3": { maxMarks: 25, subjects: ["MRT-08"] },
      "Paper 4": { maxMarks: 50, subjects: ["MRT-11"] },
      Practical: { maxMarks: 50, subjects: [] },
    },
    "Session 4": {
      "Paper 1": { maxMarks: 100, subjects: ["MRT-12"] },
      Practical: { maxMarks: 50, subjects: [] },
      Interview: { maxMarks: 100, subjects: [] },
    },
  },
  "MJR-C&W": {
    "Session 1": {
      "Paper 1": { maxMarks: 100, subjects: ["MRT-01", "MRT-06"] },
      "Paper 2": {
        maxMarks: 100,
        subjects: ["MRT-02", "MRT-03", "MRT-04", "MRT-05"],
      },
      Practical: { maxMarks: 50, subjects: [] },
    },
    "Session 2": {
      "Paper 1": { maxMarks: 75, subjects: ["MRT-07", "MRT-09", "MRT-10"] },
      "Paper 2": { maxMarks: 100, subjects: ["MCT-01"] },
      Practical: { maxMarks: 50, subjects: [] },
    },
    "Session 3": {
      "Paper 1": { maxMarks: 100, subjects: ["MCT-02/I"] },
      "Paper 2": { maxMarks: 50, subjects: ["MCT-02/II"] },
      "Paper 3": { maxMarks: 25, subjects: ["MRT-08"] },
      "Paper 4": { maxMarks: 50, subjects: ["MRT-11"] },
      Practical: { maxMarks: 50, subjects: [] },
    },
    "Session 4": {
      "Paper 1": { maxMarks: 100, subjects: ["MRT-12"] },
      Practical: { maxMarks: 50, subjects: [] },
      Interview: { maxMarks: 100, subjects: [] },
    },
  },
  "MJR-D": {
    "Session 1": {
      "Paper 1": { maxMarks: 100, subjects: ["MRT-01", "MRT-06"] },
      "Paper 2": {
        maxMarks: 100,
        subjects: ["MRT-02", "MRT-03", "MRT-04", "MRT-05"],
      },
      Practical: { maxMarks: 50, subjects: [] },
    },
    "Session 2": {
      "Paper 1": { maxMarks: 75, subjects: ["MRT-07", "MRT-09", "MRT-10"] },
      "Paper 2": { maxMarks: 100, subjects: ["MDT-01"] },
      Practical: { maxMarks: 50, subjects: [] },
    },
    "Session 3": {
      "Paper 1": { maxMarks: 100, subjects: ["MDT-02/I"] },
      "Paper 2": { maxMarks: 50, subjects: ["MDT-02/II"] },
      "Paper 3": { maxMarks: 25, subjects: ["MRT-08"] },
      "Paper 4": { maxMarks: 50, subjects: ["MRT-11"] },
      Practical: { maxMarks: 50, subjects: [] },
    },
    "Session 4": {
      "Paper 1": { maxMarks: 100, subjects: ["MRT-12"] },
      Practical: { maxMarks: 50, subjects: [] },
      Interview: { maxMarks: 100, subjects: [] },
    },
  },
  "MJR-W": {
    "Session 1": {
      "Paper 1": { maxMarks: 100, subjects: ["MRT-01", "MRT-06"] },
      "Paper 2": {
        maxMarks: 100,
        subjects: ["MRT-02", "MRT-03", "MRT-04", "MRT-05"],
      },
      Practical: { maxMarks: 50, subjects: [] },
    },
    "Session 2": {
      "Paper 1": { maxMarks: 75, subjects: ["MRT-07", "MRT-09", "MRT-10"] },
      "Paper 2": { maxMarks: 100, subjects: ["MWT-01"] },
      Practical: { maxMarks: 50, subjects: [] },
    },
    "Session 3": {
      "Paper 1": { maxMarks: 100, subjects: ["MWT-02"] },
      "Paper 2": { maxMarks: 50, subjects: ["MWT-04"] },
      "Paper 3": { maxMarks: 25, subjects: ["MRT-08"] },
      "Paper 4": { maxMarks: 50, subjects: ["MRT-11"] },
      Practical: { maxMarks: 50, subjects: [] },
    },
    "Session 4": {
      "Paper 1": { maxMarks: 100, subjects: ["MRT-12"] },
      Practical: { maxMarks: 50, subjects: [] },
      Interview: { maxMarks: 100, subjects: [] },
    },
  },
  "MJI-C&W": {
    "Session 1": {
      "Paper 1": { maxMarks: 100, subjects: ["MRT-01", "MRT-02"] },
      "Paper 2": { maxMarks: 100, subjects: ["MET-01"] },
      "Paper 3": { maxMarks: 100, subjects: ["MET-02"] },
      "Paper 4": { maxMarks: 100, subjects: ["MET-03"] },
      "Paper 5": { maxMarks: 100, subjects: ["MET-04"] },
      "Paper 6": { maxMarks: 100, subjects: ["MET-05"] },
      "Paper 7": { maxMarks: 100, subjects: ["MET-08"] },
    },
    "Session 2": {
      "Paper 1": { maxMarks: 100, subjects: ["MET-06"] },
      "Paper 2": { maxMarks: 100, subjects: ["MET-07"] },
      "Paper 3": { maxMarks: 100, subjects: ["MET-09"] },
      "Paper 4": { maxMarks: 100, subjects: ["MET-10"] },
      "Paper 5": { maxMarks: 50, subjects: ["MET-11"] },
      "Paper 6": { maxMarks: 25, subjects: ["MRT-08"] },
      "Paper 7": { maxMarks: 50, subjects: ["MRT-11"] },
      "Paper 8": { maxMarks: 50, subjects: ["MRT-13"] },
    },
    "Session 3": {
      "Paper 1": {
        maxMarks: 125,
        subjects: ["MRT-06", "MRT-07", "MRT-09", "MRT-14", "MRT-15"],
      },
      "Paper 2": { maxMarks: 100, subjects: ["MCT-01"] },
    },
    "Session 4": {
      "Paper 1": { maxMarks: 100, subjects: ["MCT-02/I"] },
      "Paper 2": { maxMarks: 100, subjects: ["MCT-02/II"] },
      Practical: { maxMarks: 50, subjects: [] },
      Interview: { maxMarks: 50, subjects: [] },
    },
  },
  "MJI-D": {
    "Session 1": {
      "Paper 1": { maxMarks: 100, subjects: ["MRT-01", "MRT-02"] },
      "Paper 2": { maxMarks: 100, subjects: ["MET-01"] },
      "Paper 3": { maxMarks: 100, subjects: ["MET-02"] },
      "Paper 4": { maxMarks: 100, subjects: ["MET-03"] },
      "Paper 5": { maxMarks: 100, subjects: ["MET-04"] },
      "Paper 6": { maxMarks: 100, subjects: ["MET-05"] },
      "Paper 7": { maxMarks: 100, subjects: ["MET-08"] },
    },
    "Session 2": {
      "Paper 1": { maxMarks: 100, subjects: ["MET-06"] },
      "Paper 2": { maxMarks: 100, subjects: ["MET-07"] },
      "Paper 3": { maxMarks: 100, subjects: ["MET-09"] },
      "Paper 4": { maxMarks: 100, subjects: ["MET-10"] },
      "Paper 5": { maxMarks: 50, subjects: ["MET-11"] },
      "Paper 6": { maxMarks: 25, subjects: ["MRT-08"] },
      "Paper 7": { maxMarks: 50, subjects: ["MRT-11"] },
      "Paper 8": { maxMarks: 50, subjects: ["MRT-13"] },
    },
    "Session 3": {
      "Paper 1": {
        maxMarks: 125,
        subjects: ["MRT-06", "MRT-07", "MRT-09", "MRT-14", "MRT-15"],
      },
      "Paper 2": { maxMarks: 100, subjects: ["MDT-01"] },
    },
    "Session 4": {
      "Paper 1": { maxMarks: 100, subjects: ["MDT-03 M/E"] },
      "Paper 2": { maxMarks: 100, subjects: ["MDT-04 M/E"] },
      Practical: { maxMarks: 50, subjects: [] },
      Interview: { maxMarks: 50, subjects: [] },
    },
  },
  "MJI-W": {
    "Session 1": {
      "Paper 1": { maxMarks: 100, subjects: ["MRT-01", "MRT-02"] },
      "Paper 2": { maxMarks: 100, subjects: ["MET-01"] },
      "Paper 3": { maxMarks: 100, subjects: ["MET-02"] },
      "Paper 4": { maxMarks: 100, subjects: ["MET-03"] },
      "Paper 5": { maxMarks: 100, subjects: ["MET-04"] },
      "Paper 6": { maxMarks: 100, subjects: ["MET-05"] },
      "Paper 7": { maxMarks: 100, subjects: ["MET-08"] },
    },
    "Session 2": {
      "Paper 1": { maxMarks: 100, subjects: ["MET-06"] },
      "Paper 2": { maxMarks: 100, subjects: ["MET-07"] },
      "Paper 3": { maxMarks: 100, subjects: ["MET-09"] },
      "Paper 4": { maxMarks: 100, subjects: ["MET-10"] },
      "Paper 5": { maxMarks: 50, subjects: ["MET-11"] },
      "Paper 6": { maxMarks: 25, subjects: ["MRT-08"] },
      "Paper 7": { maxMarks: 50, subjects: ["MRT-10"] },
      "Paper 8": { maxMarks: 50, subjects: ["MRT-13"] },
    },
    "Session 3": {
      "Paper 1": {
        maxMarks: 125,
        subjects: ["MRT-06", "MRT-07", "MRT-09", "MRT-14", "MRT-15"],
      },
      "Paper 2": { maxMarks: 100, subjects: ["MWT-03/I"] },
    },
    "Session 4": {
      "Paper 1": { maxMarks: 100, subjects: ["MWT-03/II"] },
      "Paper 2": { maxMarks: 100, subjects: ["MWT-04"] },
      Practical: { maxMarks: 50, subjects: [] },
      Interview: { maxMarks: 50, subjects: [] },
    },
  },
  "MJP-C&W": {
    "Session 1": {
      "Paper 1": {
        maxMarks: 150,
        subjects: ["MRT-14", "MRT-16", "MRT-17", "MRT-18", "MRT-19"],
      },
      "Paper 2": { maxMarks: 150, subjects: ["MET-12", "MET-13", "MET-14"] },
      Practical: { maxMarks: 50, subjects: [] },
    },
    "Session 2": {
      "Paper 1": { maxMarks: 100, subjects: ["MCT-03", "MCT-04"] },
      Practical: { maxMarks: 50, subjects: [] },
      Interview: { maxMarks: 50, subjects: [] },
    },
  },
  "MJP-D": {
    "Session 1": {
      "Paper 1": {
        maxMarks: 150,
        subjects: ["MRT-14", "MRT-16", "MRT-17", "MRT-18", "MRT-19"],
      },
      "Paper 2": { maxMarks: 150, subjects: ["MET-12", "MET-13", "MET-14"] },
      Practical: { maxMarks: 50, subjects: [] },
    },
    "Session 2": {
      "Paper 1": { maxMarks: 100, subjects: ["MDT-05 M/E"] },
      Practical: { maxMarks: 50, subjects: [] },
      Interview: { maxMarks: 50, subjects: [] },
    },
  },
  "MJP-W": {
    "Session 1": {
      "Paper 1": {
        maxMarks: 150,
        subjects: ["MRT-14", "MRT-16", "MRT-17", "MRT-18", "MRT-19"],
      },
      "Paper 2": { maxMarks: 150, subjects: ["MET-12", "MET-13", "MET-14"] },
    },
    "Session 2": {
      "Paper 1": { maxMarks: 100, subjects: ["MWT-05"] },
      Practical: { maxMarks: 50, subjects: [] },
      Interview: { maxMarks: 50, subjects: [] },
    },
  },
};

// Utility to get raw marks (removes trailing 'C' and any supplementary marks)
const getRawMarks = (paperMarks) => {
  if (typeof paperMarks === "string") {
    const match = paperMarks.match(/^(\d+)C(\d+)?$/);
    if (match) return parseInt(match[1]);
    if (paperMarks.endsWith("C")) return parseInt(paperMarks.slice(0, -1));
  }
  return paperMarks;
};

// Utility to get supplementary marks from "mainMarkCsupMark"
const getSupplementaryParsedMarks = (paperMarks) => {
  if (typeof paperMarks === "string") {
    const match = paperMarks.match(/^(\d+)C(\d+)$/);
    if (match) return parseInt(match[2]);
  }
  return null;
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
      if (!ticketNo || !courseCode) {
        throw new Error(
          `Missing parameters: ticketNo=${ticketNo}, courseCode=${courseCode}`
        );
      }

      // Handle special characters in course code for URL

      const response = await fetch(
        `/api/${courseCode.toLowerCase()}/${ticketNo}`
      );
      if (!response.ok) {
        if (response.status === 404) {
          // No marks found, return empty structure
          return {
            mainMarks: {},
            supplementaryMarks: {},
            practicalCenters: {},
            hasExistingMarks: false,
          };
        }
        throw new Error(`Failed to fetch marks: ${response.statusText}`);
      }

      const dbMarks = await response.json();
      const mainMarks = realAPI.mapDbMarksToNested(
        courseCode,
        dbMarks.data || dbMarks
      );

      // Check if marks actually exist (not all zeros)
      const hasExistingMarks = Object.values(mainMarks).some((session) =>
        Object.values(session).some((mark) => mark && mark > 0)
      );

      // For now, supplementary marks and practical centers are empty
      // You can extend this based on your backend implementation
      const supplementaryMarks = {};
      const practicalCenters = {};

      return {
        mainMarks,
        supplementaryMarks,
        practicalCenters,
        hasExistingMarks,
      };
    } catch (error) {
      console.error("Error fetching marks:", error);
      // Return empty structure if fetch fails
      return {
        mainMarks: {},
        supplementaryMarks: {},
        practicalCenters: {},
        hasExistingMarks: false,
      };
    }
  },

  // Save marks with PUT for updates and POST for new marks
  saveMarks: async (
    ticketNo,
    marks,
    courseCode,
    supplementaryMarks = {},
    practicalCenters = {},
    isEditMode = false
  ) => {
    try {
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
          const value = marks[sessionName]?.[paperName];
          formData[key] = value != null ? value.toString() : "";
          if (paperName !== "Practical" && paperName !== "Interview") {
            paperIndex++;
          }
        }
        sessionIndex++;
      }

      const method = isEditMode ? "PUT" : "POST";
      const response = await fetch(
        `/api/${courseCode.toLowerCase()}${isEditMode ? `/${ticketNo}` : ""}`,
        {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errData.message || response.statusText
          }`
        );
      }

      const result = await response.json();
      return {
        success: true,
        message: isEditMode
          ? "Marks updated successfully!"
          : "Marks saved successfully!",
        data: result,
      };
    } catch (error) {
      console.error("Error saving marks:", error);
      throw error;
    }
  },

  // Clear supplementary status for a specific subject
  clearSubjectSupplementary: async (
    ticketNo,
    session,
    paper,
    courseCode,
    supplementaryMarks
  ) => {
    try {
      const response = await fetch(
        `/api/${courseCode.toLowerCase()}/clear-supplementary`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ticketNo,
            session,
            paper,
            supplementaryMarks,
          }),
        }
      );

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errData.message || response.statusText
          }`
        );
      }

      const result = await response.json();
      return {
        success: true,
        message: `Supplementary status cleared for ${session} - ${paper}. Only main marks will be used for this subject.`,
        data: result,
      };
    } catch (error) {
      console.error("Error clearing supplementary status:", error);
      throw error;
    }
  },
};

const FeedMark = () => {
  const [searchParams] = useSearchParams();
  
  // New paper-centric approach states
  const [selectedModule, setSelectedModule] = useState("");
  const [selectedSession, setSelectedSession] = useState("");
  const [selectedPaper, setSelectedPaper] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [paperMarks, setPaperMarks] = useState({}); // { candidateId: marks }
  const [existingMarks, setExistingMarks] = useState({}); // { candidateId: marks }
  const [paperSupplementaryMarks, setPaperSupplementaryMarks] = useState({}); // { candidateId: suppMarks }
  
  // UI states
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const [candidatesLoading, setCandidatesLoading] = useState(false);
  const [showMarksPanel, setShowMarksPanel] = useState(false);
  const [isEditingPaperMarks, setIsEditingPaperMarks] = useState(false);
  
  // Legacy states for backward compatibility (can be removed later)
  const [ticketNo, setTicketNo] = useState("");
  const [searchMethod, setSearchMethod] = useState("paper"); // Default to new method
  const [selectedCandidate, setSelectedCandidate] = useState("");
  const [candidateData, setCandidateData] = useState(null);
  const [courseCode, setCourseCode] = useState("");
  const [marks, setMarks] = useState({});
  const [supplementaryMarks, setSupplementaryMarks] = useState({});
  const [hasExistingMarks, setHasExistingMarks] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [clearedSupplementary, setClearedSupplementary] = useState({});

  // Auto-search function for URL parameters
  const handleAutoSearch = async (ticketNo) => {
    if (ticketNo.trim() === "") {
      setMessage({ type: "error", text: "Invalid ticket number from URL" });
      return;
    }

    setLoading(true);
    setMessage({ type: "info", text: "Loading Data…" });

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

      const marksData = await realAPI.getExistingMarks(
        ticketNo,
        candidate.module_no
      );
      setMarks(marksData.mainMarks);
      setSupplementaryMarks(marksData.supplementaryMarks);
      setHasExistingMarks(marksData.hasExistingMarks);
      setIsEditMode(false);
      setShowMarksPanel(marksData.hasExistingMarks);

      if (marksData.hasExistingMarks) {
        setMessage({
          type: "success",
          text: `✓ Auto-loaded: ${candidate.name} - Existing marks found. Click "Edit Marks" to modify.`,
        });
      } else {
        setMessage({
          type: "success",
          text: `✓ Auto-loaded: ${candidate.name} - Click "Add Marks" to enter marks`,
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: `Failed to auto-load trainee: ${error.message}`,
      });
      setCandidateData(null);
      setCourseCode("");
      setMarks({});
      setSupplementaryMarks({});
      setHasExistingMarks(false);
      setIsEditMode(false);
      setShowMarksPanel(false);
    } finally {
      setLoading(false);
    }
  };

  // New paper-centric functions
  const loadCandidatesForPaper = async () => {
    if (!selectedModule || !selectedSession || !selectedPaper) return;

    setCandidatesLoading(true);
    setMessage({ type: "info", text: "Loading candidates..." });

    try {
      // Fetch all candidates for the selected module
      const response = await fetch(`/api/stc?module=${selectedModule}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();

      if (result.success) {
        const moduleCandidates = result.data;
        setCandidates(moduleCandidates);

        // Load existing marks for this specific paper for all candidates
        const existingMarksData = {};
        const paperMarksData = {};

        for (const candidate of moduleCandidates) {
          try {
            const marksData = await realAPI.getExistingMarks(
              candidate.ticket_no,
              selectedModule
            );
            const paperMark = marksData.mainMarks[selectedSession]?.[selectedPaper];
            existingMarksData[candidate.id] = paperMark || "";
            paperMarksData[candidate.id] = paperMark || "";
          } catch (error) {
            existingMarksData[candidate.id] = "";
            paperMarksData[candidate.id] = "";
          }
        }

        setExistingMarks(existingMarksData);
        setPaperMarks(paperMarksData);
        setShowMarksPanel(true);
        setIsEditingPaperMarks(true); // Enable editing for new candidates

        setMessage({
          type: "success",
          text: `Loaded ${moduleCandidates.length} candidates for ${selectedModule} - ${selectedSession} - ${selectedPaper}`,
        });
      } else {
        throw new Error(result.message || "Failed to load candidates");
      }
    } catch (error) {
      console.error("Failed to load candidates:", error);
      setMessage({ type: "error", text: error.message });
      setCandidates([]);
      setExistingMarks({});
      setPaperMarks({});
      setShowMarksPanel(false);
    } finally {
      setCandidatesLoading(false);
    }
  };

  // Helper function to extract main marks from combined format (e.g., "88C70" -> 88)
  const getMainMarksOnly = (marks) => {
    if (typeof marks === 'string' && marks.includes('C')) {
      return parseInt(marks.split('C')[0]);
    }
    return marks;
  };

  const handlePaperMarksChange = (candidateId, value) => {
    const numValue = value === "" ? "" : parseInt(value);
    setPaperMarks((prev) => ({
      ...prev,
      [candidateId]: numValue,
    }));
  };

  const handlePaperSupplementaryMarksChange = (candidateId, value) => {
    const numValue = value === "" ? "" : parseInt(value);
    setPaperSupplementaryMarks((prev) => ({
      ...prev,
      [candidateId]: numValue,
    }));
  };

  const savePaperMarks = async () => {
    if (!selectedModule || !selectedSession || !selectedPaper) {
      setMessage({ type: "error", text: "Please select module, session, and paper" });
      return;
    }

    setSaving(true);
    setMessage({ type: "info", text: "Saving marks..." });

    try {
      const savePromises = [];

      for (const candidate of candidates) {
        const newMark = paperMarks[candidate.id];
        if (newMark !== undefined && newMark !== existingMarks[candidate.id]) {
          // Load existing marks for this candidate
          const existingData = await realAPI.getExistingMarks(
            candidate.ticket_no,
            selectedModule
          );

          // Update only the specific paper mark
          const updatedMarks = {
            ...existingData.mainMarks,
            [selectedSession]: {
              ...existingData.mainMarks[selectedSession],
              [selectedPaper]: newMark,
            },
          };

          // Determine if this is an update or new entry
          const isUpdate = existingData.hasExistingMarks;

          savePromises.push(
            realAPI.saveMarks(
              candidate.ticket_no,
              updatedMarks,
              selectedModule,
              existingData.supplementaryMarks,
              {},
              isUpdate
            )
          );
        }
      }

      await Promise.all(savePromises);

      // Update existing marks state and disable editing
      setExistingMarks({ ...paperMarks });
      setIsEditingPaperMarks(false);

      setMessage({
        type: "success",
        text: `Successfully saved marks for ${savePromises.length} candidates`,
      });
    } catch (error) {
      console.error("Error saving paper marks:", error);
      setMessage({
        type: "error",
        text: `Failed to save marks: ${error.message}`,
      });
    } finally {
      setSaving(false);
    }
  };

  const enableEditingPaperMarks = () => {
    setIsEditingPaperMarks(true);
    setMessage({
      type: "info",
      text: "Edit mode enabled. Make changes and click 'Save All Marks' when done.",
    });
  };

  const resetPaperForm = () => {
    setSelectedModule("");
    setSelectedSession("");
    setSelectedPaper("");
    setCandidates([]);
    setPaperMarks({});
    setExistingMarks({});
    setPaperSupplementaryMarks({});
    setShowMarksPanel(false);
    setIsEditingPaperMarks(false);
    setMessage({ type: "", text: "" });
  };

  // Handle URL parameters for auto-selection from TraineeProfile
  useEffect(() => {
    const traineeId = searchParams.get("traineeId");
    const urlTicketNo = searchParams.get("ticketNo");
    const autoSelect = searchParams.get("autoSelect");

    if (autoSelect === "true" && urlTicketNo) {
      // Set the form state immediately for individual candidate view
      setSearchMethod("ticket");
      setTicketNo(urlTicketNo);

      // Clear any existing messages
      setMessage({ type: "", text: "" });

      // Auto-load the candidate data immediately with a small delay to ensure UI updates
      setTimeout(() => {
        handleAutoSearch(urlTicketNo);
      }, 100);
    }
  }, [searchParams]);

  // ---------------   Load candidates from dropdown-------------
  useEffect(() => {
    if (searchMethod === "dropdown") {
      loadCandidates();
    }
  }, [searchMethod]);

  const loadCandidates = async () => {
    setCandidatesLoading(true);
    setMessage("Loading Data ");

    try {
      const response = await fetch("/api/stc");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();

      if (result.success) {
        setCandidates(result.data);
      } else {
        throw new Error(result.message || "The API returned an error.");
      }
    } catch (error) {
      console.error("Failed to load candidates:", error);
      setMessage({ type: "error", text: error.message });
    } finally {
      setCandidatesLoading(false);
    }
  };
  // ---------------   -------------   --------------------

  const handleSearchCandidate = async () => {
    if (!ticketNo.trim()) {
      setMessage({ type: "error", text: "Please enter a ticket number" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch(`/api/stc/${ticketNo}`);
      const result = await response.json();
      const candidate = result.data;
      setCandidateData(candidate);
      setCourseCode(candidate.module_no);
      setTicketNo(candidate.ticket_no);

      // Load existing marks
      const marksData = await realAPI.getExistingMarks(
        ticketNo,
        candidate.module_no
      );
      setMarks(marksData.mainMarks);
      setSupplementaryMarks(marksData.supplementaryMarks);
      setHasExistingMarks(marksData.hasExistingMarks);
      setIsEditMode(false);
      setShowMarksPanel(marksData.hasExistingMarks);

      if (marksData.hasExistingMarks) {
        setMessage({
          type: "success",
          text: `Candidate found: ${candidate.name} - Existing marks found. Click "Edit Marks" to modify.`,
        });
      } else {
        setMessage({
          type: "success",
          text: `Candidate found: ${candidate.name} - Click "Add Marks" to enter marks`,
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: error.message });
      setCandidateData(null);
      setCourseCode("");
      setMarks({});
      setSupplementaryMarks({});
      setHasExistingMarks(false);
      setIsEditMode(false);
      setShowMarksPanel(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCandidateSelect = async (candidateId) => {
    if (!candidateId) {
      setCandidateData(null);
      setCourseCode("");
      setMarks({});
      setHasExistingMarks(false);
      setIsEditMode(false);
      setShowMarksPanel(false);
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const candidate = candidates.find((c) => c.id == parseInt(candidateId));
      if (!candidate) {
        throw new Error("Candidate not found");
      }

      setCandidateData(candidate);
      setCourseCode(candidate.module_no);
      setTicketNo(candidate.ticket_no || candidate.ticketNo);

      // Load existing marks
      const marksData = await realAPI.getExistingMarks(
        candidate.ticket_no || candidate.ticketNo,
        candidate.module_no
      );
      setMarks(marksData.mainMarks);
      setSupplementaryMarks(marksData.supplementaryMarks);
      setHasExistingMarks(marksData.hasExistingMarks);
      setIsEditMode(false);
      setShowMarksPanel(marksData.hasExistingMarks);

      if (marksData.hasExistingMarks) {
        setMessage({
          type: "success",
          text: `Candidate selected: ${candidate.name} - Existing marks found. Click "Edit Marks" to modify.`,
        });
      } else {
        setMessage({
          type: "success",
          text: `Candidate selected: ${candidate.name} - Click "Add Marks" to enter marks`,
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to load candidate data" });
    } finally {
      setLoading(false);
    }
  };

  const handleMarksChange = (session, paper, value) => {
    const numValue = value === "" ? "" : parseInt(value);
    setMarks((prev) => ({
      ...prev,
      [session]: {
        ...prev[session],
        [paper]: numValue,
      },
    }));
  };

  const handleSaveMarks = async () => {
    if (!candidateData) {
      setMessage({ type: "error", text: "No candidate selected" });
      return;
    }

    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const result = await realAPI.saveMarks(
        candidateData.ticket_no,
        marks,
        courseCode,
        supplementaryMarks,
        {}, // Remove practicalCenters parameter
        isEditMode
      );

      setMessage({ type: "success", text: result.message });

      if (isEditMode) {
        setIsEditMode(false);
        setHasExistingMarks(true);
        setShowMarksPanel(true);
      } else {
        setHasExistingMarks(true);
        setShowMarksPanel(true);
      }

      return { success: true, data: result };
    } catch (error) {
      setMessage({
        type: "error",
        text: `Failed to save marks: ${error.message}`,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAddMarks = () => {
    setShowMarksPanel(true);
    setIsEditMode(false);
    setMessage({
      type: "info",
      text: 'Enter marks for all sessions and click "Save Marks" when done.',
    });
  };

  const handleCancelAddMarks = () => {
    setShowMarksPanel(false);
    setIsEditMode(false);
    if (!hasExistingMarks) {
      setMarks({});
      setSupplementaryMarks({});
      // Remove practicalCenters line
    }
    setMessage({ type: "", text: "" });
  };

  const handleSupplementaryMarksChange = (session, paper, value) => {
    const numValue = value === "" ? "" : parseInt(value);
    setSupplementaryMarks((prev) => ({
      ...prev,
      [session]: {
        ...prev[session],
        [paper]: numValue,
      },
    }));
  };

  // Clear supplementary: store as "mainMarkCsupMark"
  const handleClearSubjectSupplementary = async (session, paper) => {
    if (!candidateData) {
      setMessage({ type: "error", text: "No candidate selected" });
      return;
    }
    const supp = supplementaryMarks[session]?.[paper];
    const max = courseStructure[courseCode][session][paper].maxMarks;
    const passing = Math.ceil(max * 0.6);
    if (!supp || supp < passing) {
      setMessage({
        type: "error",
        text: "Supplementary marks must be passing to clear status",
      });
      return;
    }
    if (
      !confirm(
        `Are you sure you want to clear supplementary for ${session} - ${paper}?`
      )
    )
      return;

    // Store as "mainMarkCsupMark"
    const mainMark = getRawMarks(marks[session][paper]);
    const newMark = `${mainMark}C${supp}`;
    const updated = {
      ...marks,
      [session]: { ...marks[session], [paper]: newMark },
    };
    setMarks(updated);

    // Persist
    setSaving(true);
    try {
      const res = await realAPI.saveMarks(
        candidateData.ticket_no,
        updated,
        courseCode,
        supplementaryMarks,
        {},
        true // edit
      );
      setMessage({
        type: "success",
        text: `✓ Cleared supplementary — ${paper} is now ${newMark}`,
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: `Failed to clear supplementary: ${err.message}`,
      });
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setTicketNo("");
    setSelectedCandidate("");
    setCandidateData(null);
    setCourseCode("");
    setMarks({});
    setSupplementaryMarks({});
    setClearedSupplementary({});
    // Remove practicalCenters line
    setHasExistingMarks(false);
    setIsEditMode(false);
    setShowMarksPanel(false);
    setMessage({ type: "", text: "" });
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
        const paperMarks = marks[session]?.[paper] ?? "";
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
            shortfall: passingMarks - paperMarks,
          });
        }
      });
    });

    return failedSubjects;
  };

  const currentCourseStructure = courseCode
    ? courseStructure[courseCode]
    : null;
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
                  Feed Marks - Enhanced
                </h1>
                <p className="text-gray-600 text-sm">
                  Paper-wise bulk entry & individual candidate mark management
                </p>
              </div>
            </div>

            {/* Right side - Status indicator */}
            <div className="hidden md:flex items-center space-x-3">
              {loading && searchParams.get("autoSelect") === "true" ? (
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
                <h2 className="text-xl font-bold text-gray-900">
                  Select Entry Method
                </h2>
                <p className="text-gray-600 text-sm">
                  Choose how you want to enter marks - paper-wise for multiple students or individual candidate
                </p>
              </div>
            </div>

            {/* Search Method Selection */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => {
                  setSearchMethod("paper");
                  resetPaperForm();
                }}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${searchMethod === "paper"
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                📝 Paper-wise Entry (Recommended)
              </button>
              <button
                onClick={() => setSearchMethod("ticket")}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${searchMethod === "ticket"
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                🎫 Search by Ticket Number
              </button>
              <button
                onClick={() => setSearchMethod("dropdown")}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${searchMethod === "dropdown"
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                📋 Select from Dropdown
              </button>
            </div>

            {/* Paper Selection UI */}
            {searchMethod === "paper" && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Paper-wise Mark Entry
                </h3>
                <p className="text-blue-700 text-sm mb-6">
                  Select a specific module, session, and paper to enter marks for all candidates at once.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {/* Module Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Module/Course
                    </label>
                    <select
                      value={selectedModule}
                      onChange={(e) => {
                        setSelectedModule(e.target.value);
                        setSelectedSession("");
                        setSelectedPaper("");
                        setShowMarksPanel(false);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Module...</option>
                      {Object.keys(courseStructure).map((module) => (
                        <option key={module} value={module}>
                          {module}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Session Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Session
                    </label>
                    <select
                      value={selectedSession}
                      onChange={(e) => {
                        setSelectedSession(e.target.value);
                        setSelectedPaper("");
                        setShowMarksPanel(false);
                      }}
                      disabled={!selectedModule}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    >
                      <option value="">Select Session...</option>
                      {selectedModule &&
                        Object.keys(courseStructure[selectedModule]).map((session) => (
                          <option key={session} value={session}>
                            {session}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Paper Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Paper
                    </label>
                    <select
                      value={selectedPaper}
                      onChange={(e) => {
                        setSelectedPaper(e.target.value);
                        setShowMarksPanel(false);
                      }}
                      disabled={!selectedSession}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    >
                      <option value="">Select Paper...</option>
                      {selectedModule &&
                        selectedSession &&
                        Object.keys(courseStructure[selectedModule][selectedSession]).map((paper) => (
                          <option key={paper} value={paper}>
                            {paper} (Max: {courseStructure[selectedModule][selectedSession][paper].maxMarks})
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={loadCandidatesForPaper}
                    disabled={!selectedModule || !selectedSession || !selectedPaper || candidatesLoading}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    {candidatesLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <UserCheck className="w-5 h-5" />
                    )}
                    Load Candidates
                  </button>
                  <button
                    onClick={resetPaperForm}
                    className="px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all duration-200"
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}

            {/* Search Controls - Only for individual candidate methods */}
            {searchMethod !== "paper" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              {searchMethod === "ticket" ? (
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
                    onKeyPress={(e) =>
                      e.key === "Enter" && handleSearchCandidate()
                    }
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
                    {candidates.map((candidate) => (
                      <option key={candidate.id} value={candidate.id}>
                        {candidate.ticket_no || candidate.ticketNo} -{" "}
                        {candidate.name} ({candidate.module_no})
                      </option>
                    ))}
                  </select>
                  {candidatesLoading && (
                    <p className="text-sm text-gray-500 mt-2">
                      Loading candidates...
                    </p>
                  )}
                </div>
              )}

              <div className="flex gap-3">
                {searchMethod === "ticket" && (
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
            )}

            {/* Messages */}
            {message.text && (
              <div
                className={`mt-6 p-4 rounded-xl flex items-center gap-3 ${message.type === "success"
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : message.type === "info"
                      ? "bg-blue-50 text-blue-800 border border-blue-200"
                      : "bg-red-50 text-red-800 border border-red-200"
                  }`}
              >
                {message.type === "success" ? (
                  <CheckCircle className="w-6 h-6" />
                ) : message.type === "info" ? (
                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <AlertCircle className="w-6 h-6" />
                )}
                <span className="font-medium">{message.text}</span>
              </div>
            )}
          </div>

          {/* Paper-wise Marks Entry Table */}
          {searchMethod === "paper" && showMarksPanel && candidates.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Paper Marks Entry
                    </h2>
                    <p className="text-gray-600 text-sm">
                      {selectedModule} - {selectedSession} - {selectedPaper}
                      {selectedModule && selectedSession && selectedPaper && (
                        <span className="font-semibold text-blue-600 ml-2">
                          (Max Marks: {courseStructure[selectedModule][selectedSession][selectedPaper].maxMarks})
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {/* Clear Supplementary Button - shows if any supplementary marks exist */}
                  {Object.keys(paperSupplementaryMarks).length > 0 && (
                    <button
                      onClick={() => {
                        // Clear all passing supplementary marks
                        const passingCandidates = Object.keys(paperSupplementaryMarks).filter(candidateId => {
                          const suppMark = paperSupplementaryMarks[candidateId];
                          const maxMarks = selectedModule && selectedSession && selectedPaper 
                            ? courseStructure[selectedModule][selectedSession][selectedPaper].maxMarks 
                            : 0;
                          const passingMarks = Math.ceil(maxMarks * 0.6);
                          return suppMark >= passingMarks;
                        });
                        
                        if (passingCandidates.length === 0) {
                          setMessage({ type: "error", text: "No passing supplementary marks to clear" });
                          return;
                        }
                        
                        if (confirm(`Clear supplementary status for ${passingCandidates.length} students with passing marks?`)) {
                          passingCandidates.forEach(candidateId => {
                            const mainMark = paperMarks[candidateId];
                            const suppMark = paperSupplementaryMarks[candidateId];
                            const newMark = `${mainMark}C${suppMark}`;
                            setPaperMarks(prev => ({ ...prev, [candidateId]: newMark }));
                          });
                          
                          setPaperSupplementaryMarks(prev => {
                            const updated = { ...prev };
                            passingCandidates.forEach(id => delete updated[id]);
                            return updated;
                          });
                          
                          setMessage({ 
                            type: "success", 
                            text: `✓ Cleared supplementary for ${passingCandidates.length} students` 
                          });
                        }
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all duration-200"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Clear Supplementary
                    </button>
                  )}
                  
                  {/* Edit/Save Button */}
                  {isEditingPaperMarks ? (
                    <button
                      onClick={savePaperMarks}
                      disabled={saving}
                      className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      {saving ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Save className="w-5 h-5" />
                      )}
                      {saving ? "Saving..." : "Save All Marks"}
                    </button>
                  ) : (
                    <button
                      onClick={enableEditingPaperMarks}
                      className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <ClipboardList className="w-5 h-5" />
                      Edit Marks
                    </button>
                  )}
                </div>
              </div>

              {/* Marks Entry Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">
                        S.No
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">
                        Ticket No
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">
                        Name
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-700">
                        Marks
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-700">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {candidates.map((candidate, index) => {
                      const currentMark = paperMarks[candidate.id];
                      const displayMark = getMainMarksOnly(currentMark); // Show only main marks in input
                      const maxMarks = selectedModule && selectedSession && selectedPaper 
                        ? courseStructure[selectedModule][selectedSession][selectedPaper].maxMarks 
                        : 0;
                      const passingMarks = Math.ceil(maxMarks * 0.6);
                      const isOverMax = displayMark > maxMarks;
                      const isPassing = displayMark >= passingMarks;
                      const isFailing = displayMark && displayMark < passingMarks;

                      return (
                        <tr key={candidate.id} className="bg-white hover:bg-gray-50">
                          <td className="border border-gray-300 px-4 py-3 text-center">
                            {index + 1}
                          </td>
                          <td className="border border-gray-300 px-4 py-3 font-medium">
                            {candidate.ticket_no}
                          </td>
                          <td className="border border-gray-300 px-4 py-3">
                            {candidate.name}
                          </td>
                          <td className="border border-gray-300 px-4 py-3 text-center">
                            <input
                              type="number"
                              min="0"
                              max={maxMarks}
                              value={displayMark || ""}
                              onChange={(e) => handlePaperMarksChange(candidate.id, e.target.value)}
                              disabled={!isEditingPaperMarks}
                              className={`w-20 px-2 py-1 border rounded text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                !isEditingPaperMarks 
                                  ? 'bg-gray-100 cursor-not-allowed'
                                  : isOverMax 
                                    ? 'border-red-500 bg-red-50' 
                                    : isPassing 
                                      ? 'border-green-500 bg-green-50'
                                      : isFailing
                                        ? 'border-red-500 bg-red-50'
                                        : 'border-gray-300'
                              }`}
                              placeholder="0"
                            />
                          </td>
                          <td className="border border-gray-300 px-4 py-3 text-center">
                            {(() => {
                              const markValue = paperMarks[candidate.id];
                              
                              // Check if student has cleared supplementary (combined format)
                              if (typeof markValue === 'string' && markValue.includes('C')) {
                                const [mainMark, suppMark] = markValue.split('C');
                                return (
                                  <span className="text-xs font-medium px-2 py-1 rounded bg-blue-100 text-blue-800">
                                    Passed Supplementary with {suppMark} marks
                                  </span>
                                );
                              }
                              
                              // Regular status logic
                              if (isOverMax) {
                                return <span className="text-red-600 text-xs font-medium">Over Max!</span>;
                              } else if (displayMark) {
                                return (
                                  <span className={`text-xs font-medium px-2 py-1 rounded ${
                                    isPassing ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                  }`}>
                                    {isPassing ? 'Pass' : 'Fail'}
                                  </span>
                                );
                              } else {
                                return <span className="text-gray-400 text-xs">-</span>;
                              }
                            })()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Summary Information */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="text-sm font-semibold text-blue-700">Total Candidates</div>
                  <div className="text-2xl font-bold text-blue-900">{candidates.length}</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="text-sm font-semibold text-green-700">Marks Entered</div>
                  <div className="text-2xl font-bold text-green-900">
                    {Object.values(paperMarks).filter(mark => mark !== "").length}
                  </div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <div className="text-sm font-semibold text-red-700">Failed Students</div>
                  <div className="text-2xl font-bold text-red-900">
                    {candidates.filter(c => {
                      const markValue = paperMarks[c.id];
                      
                      // If mark is in combined format, student has been cleared - don't count as failed
                      if (typeof markValue === 'string' && markValue.includes('C')) {
                        return false;
                      }
                      
                      // Check if main marks are below passing
                      const mark = getMainMarksOnly(markValue);
                      const maxMarks = selectedModule && selectedSession && selectedPaper 
                        ? courseStructure[selectedModule][selectedSession][selectedPaper].maxMarks 
                        : 0;
                      const passingMarks = Math.ceil(maxMarks * 0.6);
                      return mark && mark < passingMarks;
                    }).length}
                  </div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <div className="text-sm font-semibold text-purple-700">Max Marks</div>
                  <div className="text-2xl font-bold text-purple-900">
                    {selectedModule && selectedSession && selectedPaper 
                      ? courseStructure[selectedModule][selectedSession][selectedPaper].maxMarks 
                      : '-'}
                  </div>
                </div>
              </div>

              {/* Supplementary Exam Eligibility Section - Same as dropdown method */}
              {(() => {
                const failedCandidates = candidates.filter(c => {
                  const markValue = paperMarks[c.id];
                  
                  // If mark is in combined format (e.g., "55C70"), student has been cleared - don't show
                  if (typeof markValue === 'string' && markValue.includes('C')) {
                    return false;
                  }
                  
                  // Check if main marks are below passing
                  const mark = getMainMarksOnly(markValue);
                  const maxMarks = selectedModule && selectedSession && selectedPaper 
                    ? courseStructure[selectedModule][selectedSession][selectedPaper].maxMarks 
                    : 0;
                  const passingMarks = Math.ceil(maxMarks * 0.6);
                  return mark && mark < passingMarks;
                });

                if (failedCandidates.length === 0) return null;

                return (
                  <div className="mt-8 p-6 bg-red-50 border border-red-200 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <AlertCircle className="w-6 h-6 text-red-600" />
                      <h3 className="text-lg font-bold text-red-800">
                        Supplementary Exam Eligibility
                      </h3>
                    </div>
                    <p className="text-red-700 mb-4 font-medium">
                      The following candidates have scored below 60% in {selectedSession} - {selectedPaper} and are eligible for supplementary examination:
                    </p>
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                      <div className="flex items-start gap-2">
                        <RefreshCw className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                        <div className="text-orange-800 text-sm">
                          <p className="font-semibold mb-2">
                            Process for Clearing Supplementary Status:
                          </p>
                          <ol className="list-decimal list-inside space-y-1 text-xs">
                            <li>
                              Enter supplementary exam marks in the "Record Only" fields below
                            </li>
                            <li>
                              If supplementary marks are ≥60% (passing), the "Clear Supplementary" button will be enabled
                            </li>
                            <li>
                              Click "Clear Supplementary" to use main exam marks for marksheet generation
                            </li>
                            <li>
                              If supplementary marks are still below 60%, student remains in supplementary status
                            </li>
                          </ol>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {failedCandidates.map((candidate) => {
                        const mainMark = getMainMarksOnly(paperMarks[candidate.id]); // Get main marks only
                        const suppMark = paperSupplementaryMarks[candidate.id];
                        const maxMarks = selectedModule && selectedSession && selectedPaper 
                          ? courseStructure[selectedModule][selectedSession][selectedPaper].maxMarks 
                          : 0;
                        const passingMarks = Math.ceil(maxMarks * 0.6);
                        const shortfall = passingMarks - mainMark;
                        const isSuppPassing = suppMark >= passingMarks;

                        return (
                          <div key={candidate.id} className="border border-red-300 rounded-lg p-4 bg-white">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <h4 className="font-semibold text-gray-900">
                                  {candidate.name} ({candidate.ticket_no})
                                </h4>
                                <p className="text-sm text-red-600">
                                  {selectedSession} - {selectedPaper}
                                </p>
                              </div>
                              <div className="text-right">
                                <span className="text-2xl font-bold text-red-600">{mainMark}/{maxMarks}</span>
                                <p className="text-xs text-red-500">Main Exam</p>
                              </div>
                            </div>
                            
                            <div className="bg-gray-50 rounded-lg p-3 mb-3">
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">Required: {passingMarks} (60% of {maxMarks})</span>
                                <span className="text-red-600 font-medium">Shortfall: {shortfall} marks</span>
                              </div>
                            </div>

                            <div className="border-t pt-3">
                              <label className="block text-sm font-medium text-blue-700 mb-2">
                                Supplementary Exam Marks (Record Only)
                              </label>
                              <div className="flex items-center gap-3">
                                <div className="flex-1">
                                  <input
                                    type="number"
                                    min="0"
                                    max={maxMarks}
                                    value={suppMark || ""}
                                    onChange={(e) => handlePaperSupplementaryMarksChange(candidate.id, e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                      suppMark && isSuppPassing 
                                        ? 'border-green-500 bg-green-50' 
                                        : suppMark 
                                          ? 'border-orange-500 bg-orange-50'
                                          : 'border-gray-300'
                                    }`}
                                    placeholder={`0-${maxMarks}`}
                                  />
                                </div>
                                <div className="text-right min-w-[100px]">
                                  {suppMark ? (
                                    <span className={`text-sm font-medium ${
                                      isSuppPassing ? 'text-green-600' : 'text-orange-600'
                                    }`}>
                                      {isSuppPassing ? '✓ Passing' : '✗ Still Failing'}
                                    </span>
                                  ) : (
                                    <span className="text-xs text-gray-500">/100</span>
                                  )}
                                </div>
                                {suppMark && isSuppPassing && (
                                  <button
                                    onClick={() => {
                                      if (confirm(`Clear supplementary for ${candidate.name}? This will combine main and supplementary marks.`)) {
                                        const newMark = `${mainMark}C${suppMark}`;
                                        setPaperMarks(prev => ({ ...prev, [candidate.id]: newMark }));
                                        setPaperSupplementaryMarks(prev => {
                                          const updated = { ...prev };
                                          delete updated[candidate.id];
                                          return updated;
                                        });
                                        setMessage({
                                          type: "success",
                                          text: `✓ Cleared supplementary for ${candidate.name} - Combined as ${newMark}`,
                                        });
                                      }
                                    }}
                                    className="px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                                  >
                                    Clear Supp
                                  </button>
                                )}
                              </div>
                              <p className="text-xs text-blue-600 mt-1">
                                💡 These marks are for record keeping only. Main exam marks will be used in marksheet generation.
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Candidate Information */}
          {candidateData && searchMethod !== "paper" && (
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Candidate Information
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Selected trainee details
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                  <label className="block text-sm font-semibold text-blue-700 mb-1">
                    Ticket Number
                  </label>
                  <p className="text-lg font-bold text-blue-900">
                    {candidateData.ticket_no}
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                  <label className="block text-sm font-semibold text-green-700 mb-1">
                    Name
                  </label>
                  <p className="text-lg font-bold text-green-900">
                    {candidateData.name}
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
                  <label className="block text-sm font-semibold text-purple-700 mb-1">
                    Course Code
                  </label>
                  <p className="text-lg font-bold text-purple-900">
                    {candidateData.module_no}
                  </p>
                </div>
                <div
                  className={`p-4 rounded-xl border ${hasExistingMarks && !isEditMode && !showMarksPanel
                      ? "bg-gray-50 border-gray-200"
                      : hasExistingMarks && !isEditMode && showMarksPanel
                        ? "bg-blue-50 border-blue-200"
                        : isEditMode
                          ? "bg-orange-50 border-orange-200"
                          : showMarksPanel && !hasExistingMarks
                            ? "bg-green-50 border-green-200"
                            : "bg-yellow-50 border-yellow-200"
                    }`}
                >
                  <label
                    className={`block text-sm font-semibold mb-1 ${hasExistingMarks && !isEditMode && !showMarksPanel
                        ? "text-gray-700"
                        : hasExistingMarks && !isEditMode && showMarksPanel
                          ? "text-blue-700"
                          : isEditMode
                            ? "text-orange-700"
                            : showMarksPanel && !hasExistingMarks
                              ? "text-green-700"
                              : "text-yellow-700"
                      }`}
                  >
                    Status
                  </label>
                  <p
                    className={`text-lg font-bold ${hasExistingMarks && !isEditMode && !showMarksPanel
                        ? "text-gray-900"
                        : hasExistingMarks && !isEditMode && showMarksPanel
                          ? "text-blue-900"
                          : isEditMode
                            ? "text-orange-900"
                            : showMarksPanel && !hasExistingMarks
                              ? "text-green-900"
                              : "text-yellow-900"
                      }`}
                  >
                    {hasExistingMarks && !isEditMode && showMarksPanel
                      ? "View Mode"
                      : isEditMode
                        ? "Edit Mode"
                        : showMarksPanel && !hasExistingMarks
                          ? "Entry Mode"
                          : hasExistingMarks
                            ? "Marks Available"
                            : "No Marks"}
                  </p>
                </div>
              </div>

              {/* Action Button for candidates without marks */}
              {candidateData && !hasExistingMarks && !showMarksPanel && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-blue-900">
                        Ready to Add Marks
                      </h3>
                      <p className="text-blue-700 text-sm">
                        No marks found for this candidate. Click the button to
                        start entering marks.
                      </p>
                    </div>
                    <button
                      onClick={handleAddMarks}
                      className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <BookOpen className="w-5 h-5" />
                      Add Marks
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Marks Entry Form - Only for individual candidate methods */}
          {currentCourseStructure && showMarksPanel && searchMethod !== "paper" && (
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {hasExistingMarks && !isEditMode
                        ? "View Marks"
                        : isEditMode
                          ? "Edit Marks"
                          : "Add Marks"}{" "}
                      - {courseCode}
                    </h2>
                    <p className="text-gray-600 text-sm">
                      {hasExistingMarks && !isEditMode
                        ? 'Viewing existing marks - Click "Edit Marks" to modify'
                        : isEditMode
                          ? 'Editing examination marks - Click "Update Marks" to save changes'
                          : 'Adding new examination marks - Fill in all sessions and click "Save Marks"'}
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
                    // Edit mode or adding new marks - show save/update and cancel buttons
                    <>
                      <button
                        onClick={
                          hasExistingMarks
                            ? () => setIsEditMode(false)
                            : handleCancelAddMarks
                        }
                        className="flex items-center gap-2 px-4 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all duration-200"
                      >
                        Cancel
                      </button>
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
                        {saving
                          ? "Saving..."
                          : isEditMode
                            ? "Update Marks"
                            : "Save Marks"}
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-8">
                {Object.entries(currentCourseStructure).map(
                  ([session, papers]) => (
                    <div
                      key={session}
                      className="border border-gray-200 rounded-xl p-6 bg-gray-50"
                    >
                      <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center">
                          <span className="text-white text-xs font-bold">
                            {session.slice(-1)}
                          </span>
                        </div>
                        {session}
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Object.entries(papers).map(([paper, config]) => {
                          const paperMarks = marks[session]?.[paper];
                          const displayMarks = getRawMarks(paperMarks);
                          const displaySupMarks =
                            getSupplementaryParsedMarks(paperMarks);
                          const passingMarks = getPassingMarks(config.maxMarks);
                          const isFailingGrade = shouldShowAsFailed(
                            session,
                            paper,
                            paperMarks,
                            config.maxMarks
                          );
                          const isOverMaxMarks = paperMarks > config.maxMarks;
                          const isCleared = isSupplementaryCleared(
                            session,
                            paper
                          );
                          const isBelowPassing =
                            paperMarks && paperMarks < passingMarks;

                          return (
                            <div
                              key={paper}
                              className={`p-4 rounded-xl border space-y-3 ${isFailingGrade
                                  ? "bg-red-50 border-red-300"
                                  : isCleared && isBelowPassing
                                    ? "bg-yellow-50 border-yellow-300"
                                    : "bg-white border-gray-200"
                                }`}
                            >
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
                                  <p className="text-xs text-gray-600 font-medium mb-1">
                                    Subjects:
                                  </p>
                                  <p className="text-xs text-gray-800">
                                    {config.subjects.join(", ")}
                                  </p>
                                </div>
                              )}

                              {/* Simplified marks input for all papers including practical */}
                              <input
                                type="number"
                                min="0"
                                max={config.maxMarks}
                                value={displayMarks || ""}
                                onChange={(e) =>
                                  handleMarksChange(
                                    session,
                                    paper,
                                    e.target.value
                                  )
                                }
                                placeholder={`Enter marks (0-${config.maxMarks})`}
                                readOnly={hasExistingMarks && !isEditMode}
                                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${hasExistingMarks && !isEditMode
                                    ? "bg-gray-100 cursor-not-allowed text-gray-600"
                                    : isOverMaxMarks
                                      ? "border-red-300 bg-red-50"
                                      : isFailingGrade
                                        ? "border-red-400 bg-red-50"
                                        : isCleared && isBelowPassing
                                          ? "border-yellow-400 bg-yellow-50"
                                          : "border-gray-300"
                                  }`}
                              />

                              {/* Show supplementary marks if present */}
                              {displaySupMarks !== null && (
                                <div className="text-xs text-yellow-700 mt-1">
                                  Supplementary Cleared:{" "}
                                  <span className="font-bold">
                                    {displaySupMarks}
                                  </span>{" "}
                                  / {config.maxMarks}
                                </div>
                              )}

                              {isOverMaxMarks && (
                                <p className="text-xs text-red-600 font-medium">
                                  ⚠️ Marks cannot exceed {config.maxMarks}
                                </p>
                              )}

                              {isCleared &&
                                isBelowPassing &&
                                !isOverMaxMarks && (
                                  <div className="space-y-2">
                                    <p className="text-xs text-yellow-700 font-medium">
                                      ✓ Supplementary status cleared. Main marks
                                      ({paperMarks}) will be used in marksheet.
                                    </p>
                                  </div>
                                )}

                              {isFailingGrade && !isOverMaxMarks && (
                                <div className="space-y-2">
                                  <p className="text-xs text-red-600 font-medium">
                                    ⚠️ Below passing marks ({passingMarks}).
                                    Eligible for supplementary exam.
                                  </p>
                                  {hasSupplementaryMarks(session, paper) && (
                                    <div
                                      className={`text-xs p-2 rounded-lg ${isSupplementaryPassing(
                                        session,
                                        paper,
                                        config.maxMarks
                                      )
                                          ? "bg-green-50 text-green-700 border border-green-200"
                                          : "bg-red-50 text-red-700 border border-red-200"
                                        }`}
                                    >
                                      Supplementary:{" "}
                                      {supplementaryMarks[session][paper]}/
                                      {config.maxMarks} -{" "}
                                      {isSupplementaryPassing(
                                        session,
                                        paper,
                                        config.maxMarks
                                      )
                                        ? "✓ PASSING"
                                        : "✗ STILL FAILING"}
                                    </div>
                                  )}
                                  <button
                                    onClick={() =>
                                      handleClearSubjectSupplementary(
                                        session,
                                        paper
                                      )
                                    }
                                    disabled={
                                      clearing ||
                                      !hasSupplementaryMarks(session, paper) ||
                                      !isSupplementaryPassing(
                                        session,
                                        paper,
                                        config.maxMarks
                                      )
                                    }
                                    className={`w-full flex items-center justify-center gap-2 px-3 py-2 text-white text-xs rounded-lg transition-all duration-200 ${hasSupplementaryMarks(session, paper) &&
                                        isSupplementaryPassing(
                                          session,
                                          paper,
                                          config.maxMarks
                                        )
                                        ? "bg-green-600 hover:bg-green-700"
                                        : "bg-gray-400 cursor-not-allowed"
                                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                                    title={
                                      !hasSupplementaryMarks(session, paper)
                                        ? "Enter supplementary marks first"
                                        : !isSupplementaryPassing(
                                          session,
                                          paper,
                                          config.maxMarks
                                        )
                                          ? "Supplementary marks must be passing to clear status"
                                          : `Clear supplementary status for ${session} - ${paper}`
                                    }
                                  >
                                    {saving ? (
                                      <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                      <RefreshCw className="w-3 h-3" />
                                    )}
                                    {hasSupplementaryMarks(session, paper) &&
                                      isSupplementaryPassing(
                                        session,
                                        paper,
                                        config.maxMarks
                                      )
                                      ? "Clear Supplementary ✓"
                                      : "Clear Supplementary"}
                                  </button>
                                  {!hasSupplementaryMarks(session, paper) && (
                                    <p className="text-xs text-gray-500 text-center">
                                      📝 Enter supplementary marks below to
                                      enable clearing
                                    </p>
                                  )}
                                  {hasSupplementaryMarks(session, paper) &&
                                    !isSupplementaryPassing(
                                      session,
                                      paper,
                                      config.maxMarks
                                    ) && (
                                      <p className="text-xs text-red-500 text-center">
                                        ❌ Supplementary marks still below
                                        passing. Student remains in
                                        supplementary status.
                                      </p>
                                    )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )
                )}
              </div>

              {/* Supplementary Eligibility Message */}
              {failedSubjects.length > 0 && (
                <div className="mt-8 p-6 bg-red-50 border border-red-200 rounded-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                    <h3 className="text-lg font-bold text-red-800">
                      Supplementary Exam Eligibility
                    </h3>
                  </div>
                  <p className="text-red-700 mb-4 font-medium">
                    The candidate has scored below 60% in the following subjects
                    and is eligible for supplementary examination:
                  </p>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                    <div className="flex items-start gap-2">
                      <RefreshCw className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                      <div className="text-orange-800 text-sm">
                        <p className="font-semibold mb-2">
                          Process for Clearing Supplementary Status:
                        </p>
                        <ol className="list-decimal list-inside space-y-1 text-xs">
                          <li>
                            Enter supplementary exam marks in the "Record Only"
                            fields below
                          </li>
                          <li>
                            If supplementary marks are ≥60% (passing), the
                            "Clear Supplementary" button will be enabled
                          </li>
                          <li>
                            Click "Clear Supplementary" to use main exam marks
                            for marksheet generation
                          </li>
                          <li>
                            If supplementary marks are still below 60%, student
                            remains in supplementary status
                          </li>
                        </ol>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {failedSubjects.map((subject, index) => {
                      const mainExamMark = getRawMarks(subject.marks);
                      const supExamMark = getSupplementaryParsedMarks(
                        subject.marks
                      );
                      return (
                        <div
                          key={index}
                          className="bg-white p-4 rounded-lg border border-red-200"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <span className="font-semibold text-red-800">
                                {subject.session} - {subject.paper}
                              </span>
                              <span className="text-xs text-red-600 block">
                                Required: {subject.passingMarks} (60% of{" "}
                                {subject.maxMarks})
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="text-red-600 font-bold">
                                {mainExamMark}/{subject.maxMarks}
                                {supExamMark !== null && (
                                  <span className="text-yellow-700 ml-2">
                                    (Supplementary: {supExamMark}/
                                    {subject.maxMarks})
                                  </span>
                                )}
                              </span>
                              <span className="text-xs text-red-500 block">
                                Main Exam
                              </span>
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
                                  value={
                                    supplementaryMarks[subject.session]?.[
                                    subject.paper
                                    ] || ""
                                  }
                                  onChange={(e) =>
                                    handleSupplementaryMarksChange(
                                      subject.session,
                                      subject.paper,
                                      e.target.value
                                    )
                                  }
                                  readOnly={hasExistingMarks && !isEditMode}
                                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${hasExistingMarks && !isEditMode
                                      ? "bg-gray-100 cursor-not-allowed text-gray-600 border-gray-300"
                                      : "border-blue-300"
                                    }`}
                                  placeholder={`0-${subject.maxMarks}`}
                                />
                              </div>
                              <div className="text-xs text-gray-500 pt-4">
                                /{subject.maxMarks}
                              </div>
                            </div>
                            <p className="text-xs text-blue-600 mt-1">
                              💡 These marks are for record keeping only. Main
                              exam marks will be used in marksheet generation.
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* No candidate selected message */}
          {/* No Data Selected */}
          {!candidateData && !showMarksPanel && !loading && (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-200">
              <div className="w-20 h-20 bg-gray-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                {searchMethod === "paper" ? "Ready for Paper-wise Entry" : "No Candidate Selected"}
              </h3>
              <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
                {searchMethod === "paper" 
                  ? "Select a module, session, and paper above to load all candidates and enter marks efficiently."
                  : "Please search for a candidate using their ticket number or select from the dropdown to begin entering marks."
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedMark;
