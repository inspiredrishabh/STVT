import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import {
  Search,
  FileText,
  // Download,
  Printer,
  ArrowLeft,
  GraduationCap,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
import railwayLogo from "../assets/rail.png";
import northLogo from "../assets/north.jpeg";

// Subject code to name mapping
const subjectMapping = {
  "MRT-01": "Railway Organization & Management",
  "MRT-02": "Role of Mechanical Dept.",
  "MRT-03": "Rolling Stock Theory- Carriage",
  "MRT-04": "Rolling Stock Theory - Wagon",
  "MRT-05":
    "Rolling Stock Theory - Diesel Loco, DEMU, SPART, Train Sets: MEMU/ EMU",
  "MRT-06": "Industrial Safety, First aid & Firefighting",
  "MRT-07": "Tender & Contract",
  "MRT-08": "Accident & Disaster management",
  "MRT-09": "Managerial Skills",
  "MRT-10": "Welding & Non-Destructive Testing",
  "MRT-11": "Train operations with signaling",
  "MRT-12": "Integrated Course at IRIMEE",
  "MRT-13": "Introduction to Rolling Stock",
  "MRT-14": "Computer Awareness",
  "MRT-15": "Technical English",
  "MRT-16": "Industrial Safety, First Aid & Fire Fighting",
  "MRT-17": "Accident & Disaster Management",
  "MRT-18": "Supervisory Skills",
  "MRT-19": "Technical English",
  "MET-01": "Applied Mechanics",
  "MET-02": "Hydraulics",
  "MET-03": "Manufacturing Process",
  "MET-04": "Engineering Drawing",
  "MET-05": "Electrical Engineering",
  "MET-06": "Strength of Material",
  "MET-07": "Heat Engine & Thermodynamics",
  "MET-08": "Theory of Machines",
  "MET-09": "Material Science",
  "MET-10": "Machine Design & Drawing",
  "MET-11": "Industrial Engineering",
  "MET-12": "Manufacturing Process",
  "MET-13": "Industrial Engineering",
  "MET-14": "Engineering Drawing",
  "MCT-01": "C & W Theory - 01",
  "MCT-02": "C & W Theory - 02",
  "MCT-03": "C & W Theory - 03",
  "MCT-04": "C & W Theory - 04",
  "MDT-01": "Diesel Locomotive Theory (Common) - 01",
  "MDT-02 M": "Diesel Locomotive Theory (Mechanical) – 02 M",
  "MDT-02 E": "Diesel Locomotive Theory (Electrical) – 02 E",
  "MDT-03 M": "Diesel Locomotive Theory (Mechanical) – 03 M",
  "MDT-04 M": "Diesel Locomotive Theory (Mechanical) – 04 M",
  "MDT-03 E": "Diesel Locomotive Theory (Electrical) – 03 E",
  "MDT-04 E": "Diesel Locomotive Theory (Electrical) – 04 E",
  "MDT-05 M": "Diesel Locomotive Theory (Mechanical) – 05 M",
  "MDT-05 E": "Diesel Locomotive Theory (Electrical) – 05 E",
  "MWT-01": "Workshop Theory - 01",
  "MWT-02": "Workshop Theory - 02",
  "MWT-03": "Workshop Theory - 03",
  "MWT-04": "Workshop Trade Theory - 04",
  "MWT-05": "Workshop Theory - 05",
};

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

// Add this utility function before the MarksheetService class
const getRawMarks = (paperMarks) => {
  if (typeof paperMarks === "string") {
    const match = paperMarks.match(/^(\d+)C/);
    if (match) return parseInt(match[1]);
    if (paperMarks.endsWith("C")) return parseInt(paperMarks.slice(0, -1));
  }
  return paperMarks;
};

// Utility to get supplementary marks from "mainMarkCsupMark"
const getSupplementaryParsedMarks = (paperMarks) => {
  if (typeof paperMarks === "string") {
    // Looks for strings like "45C12" → main 45, sup 12
    const match = paperMarks.match(/^(\d+)C(\d+)$/);
    if (match) {
      return parseInt(match[2], 10);
    }
  }
  return 0;
};

// Helper to compute 60% passing marks
const getPassingMarks = (maxMarks) => Math.ceil(maxMarks * 0.6);

// Real API Service for STC Marksheets
class MarksheetService {
  constructor() {
    this.baseURL = "/api";
  }

  // Map course codes to API endpoints
  getCourseApiEndpoint(courseCode) {
    const mapping = {
      "MSE-C&W": "mse-c&w",
      "MSE-D": "mse-d",
      "MSE-W": "mse-w",
      "MJR-C&W": "mjr-c&w",
      "MJR-D": "mjr-d",
      "MJR-W": "mjr-w",
      "MJI-C&W": "mji-c&w",
      "MJI-D": "mji-d",
      "MJI-W": "mji-w",
      "MJP-C&W": "mjp-c&w",
      "MJP-D": "mjp-d",
      "MJP-W": "mjp-w",
    };
    return mapping[courseCode];
  }

  async getCandidates() {
    try {
      const response = await fetch(`${this.baseURL}/stc`);
      if (!response.ok) {
        throw new Error("Failed to fetch candidates");
      }
      const result = await response.json();
      return {
        success: true,
        data: result.data || [],
      };
    } catch (error) {
      console.error("Error fetching candidates:", error);
      throw error;
    }
  }

  async getCandidateByTicket(ticketNumber) {
    try {
      const response = await fetch(`${this.baseURL}/stc/${ticketNumber}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(
            `Candidate with ticket number ${ticketNumber} not found`
          );
        }
        throw new Error("Failed to fetch candidate");
      }
      const result = await response.json();
      return {
        success: true,
        data: result.data,
      };
    } catch (error) {
      console.error("Error fetching candidate:", error);
      throw error;
    }
  }

  async getMarksheetData(ticketNumber, courseCode) {
    try {
      const apiEndpoint = this.getCourseApiEndpoint(courseCode);
      if (!apiEndpoint) {
        throw new Error(`Unsupported course code: ${courseCode}`);
      }

      const response = await fetch(
        `${this.baseURL}/${apiEndpoint}/${ticketNumber}`
      );
      if (!response.ok) {
        if (response.status === 404) {
          // No marks found - return empty structure indicating no marks yet
          return {
            success: true,
            data: null,
            message: "No marks added yet",
          };
        }
        throw new Error("Failed to fetch marksheet data");
      }

      const result = await response.json();

      // Transform the backend data structure to match the frontend expectations
      const transformedData = this.transformMarksData(result.data, courseCode);

      return {
        success: true,
        data: transformedData,
      };
    } catch (error) {
      console.error("Error fetching marksheet data:", error);
      throw error;
    }
  }

  // Transform backend marks data to frontend format
  transformMarksData(backendData, courseCode) {
    if (!backendData) return null;

    const structure = courseStructure[courseCode];
    if (!structure) return null;

    const transformedData = {};

    // Initialize the structure
    Object.keys(structure).forEach((session) => {
      transformedData[session] = {};
      Object.keys(structure[session]).forEach((paper) => {
        transformedData[session][paper] = 0;
      });
    });

    // Create dynamic field mapping based on course structure
    let sessionIndex = 1;
    let paperIndex = 1;

    Object.entries(structure).forEach(([session, papers]) => {
      paperIndex = 1;
      Object.entries(papers).forEach(([paper, config]) => {
        let backendField;

        if (paper === "Practical") {
          backendField = `s${sessionIndex}pr_marks`;
        } else if (paper === "Interview") {
          backendField = `s${sessionIndex}int_marks`;
        } else {
          backendField = `s${sessionIndex}p${paperIndex}_marks`;
        }

        // Fill in the actual marks if the field exists
        if (backendData[backendField] !== undefined) {
          transformedData[session][paper] = backendData[backendField] || 0;
        }

        if (paper !== "Practical" && paper !== "Interview") {
          paperIndex++;
        }
      });
      sessionIndex++;
    });

    return transformedData;
  }

  async getFailedSubjects(ticketNumber, courseCode, marksheetData) {
    if (!marksheetData || !courseCode) {
      return { success: true, data: [] };
    }

    const structure = courseStructure[courseCode];
    if (!structure) {
      return { success: true, data: [] };
    }

    const failedSubjects = [];
    const passingPercentage = 60;

    Object.entries(structure).forEach(([session, papers]) => {
      Object.entries(papers).forEach(([paper, config]) => {
        const paperMarks = marksheetData[session]?.[paper];
        const rawMarks = getRawMarks(paperMarks); // Use the standalone function
        const passingMarks = Math.ceil(
          config.maxMarks * (passingPercentage / 100)
        );
        const isCleared =
          typeof paperMarks === "string" && paperMarks.endsWith("C");

        // Only include in failed subjects if raw marks are below passing AND not cleared
        if (rawMarks !== undefined && rawMarks < passingMarks && !isCleared) {
          failedSubjects.push({
            session,
            paper,
            subjects: config.subjects,
            obtainedMarks: rawMarks,
            maxMarks: config.maxMarks,
            passingMarks,
            percentage: ((rawMarks / config.maxMarks) * 100).toFixed(1),
            shortfall: passingMarks - rawMarks,
          });
        }
      });
    });

    return {
      success: true,
      data: failedSubjects,
    };
  }

  async validateMarksheetData(ticketNumber) {
    return {
      success: true,
      data: {
        valid: true,
        errors: [],
        warnings: [],
      },
    };
  }

  async exportMarksheetPDF(ticketNumber, options = {}) {
    const fileName = `Marksheet_${ticketNumber}_${
      options.sessionWise ? "Sessional" : "Complete"
    }_${new Date().toISOString().split("T")[0]}.pdf`;
    return {
      success: true,
      message: "PDF export initiated successfully",
      data: {
        fileName,
        downloadUrl: `/downloads/${fileName}`,
      },
    };
  }
}

// Create service instance
const marksheetService = new MarksheetService();

const Marksheet = () => {
  // State management - optimized
  // const supplyMarks = getSupplementaryParsedMarks(paperMarks);
  const [searchMethod, setSearchMethod] = useState("ticket");
  const [ticketNumber, setTicketNumber] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [candidateData, setCandidateData] = useState(null);
  const [courseCode, setCourseCode] = useState(null);
  const [marksheetData, setMarksheetData] = useState({});
  const [failedSubjects, setFailedSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [viewMode, setViewMode] = useState("complete");
  const [selectedSession, setSelectedSession] = useState("all");
  const marksheetRef = useRef();

  // Helper function to determine course code from module_no or designation
  const determineCourseCode = useCallback((moduleNo, designation) => {
    console.log("Determining course code from:", { moduleNo, designation });

    // First check if module_no directly matches our course structure
    if (moduleNo && courseStructure[moduleNo.toUpperCase()]) {
      console.log(
        "Found direct match in courseStructure:",
        moduleNo.toUpperCase()
      );
      return moduleNo.toUpperCase();
    }

    // Check if module_no contains recognizable patterns
    if (moduleNo) {
      const moduleUpper = moduleNo.toUpperCase();

      // MSE patterns
      if (moduleUpper.includes("MSE") && moduleUpper.includes("C&W")) {
        return "MSE-C&W";
      }
      if (moduleUpper.includes("MSE") && moduleUpper.includes("D")) {
        return "MSE-D";
      }
      if (moduleUpper.includes("MSE") && moduleUpper.includes("W")) {
        return "MSE-W";
      }

      // MJR patterns
      if (moduleUpper.includes("MJR") && moduleUpper.includes("C&W")) {
        return "MJR-C&W";
      }
      if (moduleUpper.includes("MJR") && moduleUpper.includes("D")) {
        return "MJR-D";
      }
      if (moduleUpper.includes("MJR") && moduleUpper.includes("W")) {
        return "MJR-W";
      }

      // MJI patterns
      if (moduleUpper.includes("MJI") && moduleUpper.includes("C&W")) {
        return "MJI-C&W";
      }
      if (moduleUpper.includes("MJI") && moduleUpper.includes("D")) {
        return "MJI-D";
      }
      if (moduleUpper.includes("MJI") && moduleUpper.includes("W")) {
        return "MJI-W";
      }

      // MJP patterns
      if (moduleUpper.includes("MJP") && moduleUpper.includes("C&W")) {
        return "MJP-C&W";
      }
      if (moduleUpper.includes("MJP") && moduleUpper.includes("D")) {
        return "MJP-D";
      }
      if (moduleUpper.includes("MJP") && moduleUpper.includes("W")) {
        return "MJP-W";
      }
    }

    // If no pattern matches, return null to indicate unsupported course
    console.log("No course code pattern matched for:", {
      moduleNo,
      designation,
    });
    return null;
  }, []);

  // Load candidates for dropdown
  const loadCandidates = useCallback(async () => {
    setLoading(true);
    try {
      const result = await marksheetService.getCandidates();
      setCandidates(result.data || []);
    } catch (error) {
      console.error("Failed to load candidates:", error);
      setMessage({ type: "error", text: "Failed to load candidates" });
    } finally {
      setLoading(false);
    }
  }, []);

  // Load candidate data and marks
  const loadCandidateData = useCallback(
    async (candidate) => {
      setLoading(true);
      setMessage({ type: "", text: "" });

      try {
        // Validate candidate first
        const validation = await marksheetService.validateMarksheetData(
          candidate.ticket_no
        );
        if (!validation.data.valid) {
          throw new Error(validation.data.errors.join(", "));
        }

        // Determine course code from module_no or use a mapping
        const detectedCourseCode = determineCourseCode(
          candidate.module_no,
          candidate.designation
        );
        console.log(
          "Detected course code:",
          detectedCourseCode,
          "for candidate:",
          candidate.name
        );

        if (!detectedCourseCode) {
          throw new Error(
            `Unsupported course module: ${candidate.module_no}. Please contact system administrator.`
          );
        }

        // Set the course code state
        setCourseCode(detectedCourseCode);

        // Create enhanced candidate object with course code
        const enhancedCandidate = {
          ...candidate,
          ticketNumber: candidate.ticket_no,
          fatherName: candidate.father_name,
          courseCode: detectedCourseCode,
        };

        setCandidateData(enhancedCandidate);

        // Load marksheet data using course code
        const marks = await marksheetService.getMarksheetData(
          candidate.ticket_no,
          detectedCourseCode
        );

        if (marks.data === null) {
          // No marks added yet
          setMarksheetData(null);
          setFailedSubjects([]);
          setMessage({
            type: "info",
            text: `Candidate loaded: ${candidate.name}. Course: ${detectedCourseCode}. No marks added yet.`,
          });
        } else {
          setMarksheetData(marks.data);

          // Load failed subjects
          const failed = await marksheetService.getFailedSubjects(
            candidate.ticket_no,
            detectedCourseCode,
            marks.data
          );
          setFailedSubjects(failed.data);

          setMessage({
            type: "success",
            text: `Marksheet loaded for: ${candidate.name} (Course: ${detectedCourseCode})`,
          });
        }
      } catch (error) {
        console.error("Failed to load candidate data:", error);
        setMessage({
          type: "error",
          text: error.message || "Failed to load candidate data",
        });
        setCandidateData(null);
        setCourseCode(null);
        setMarksheetData({});
        setFailedSubjects([]);
      } finally {
        setLoading(false);
      }
    },
    [determineCourseCode]
  );

  const resetForm = useCallback(() => {
    setTicketNumber("");
    setSelectedCandidate("");
    setCandidateData(null);
    setCourseCode(null);
    setMarksheetData({});
    setFailedSubjects([]);
    setMessage({ type: "", text: "" });
    setSelectedSession("all");
  }, []);

  // Load candidates for dropdown
  useEffect(() => {
    if (searchMethod === "dropdown") {
      loadCandidates();
    }
  }, [searchMethod, loadCandidates]);

  const handleSearchCandidate = useCallback(async () => {
    if (!ticketNumber.trim()) {
      setMessage({ type: "error", text: "Please enter a ticket number" });
      return;
    }

    try {
      const result = await marksheetService.getCandidateByTicket(ticketNumber);
      await loadCandidateData(result.data);
    } catch (error) {
      console.error("Failed to search candidate:", error);
      setMessage({ type: "error", text: error.message });
      setCandidateData(null);
      setCourseCode(null);
      setMarksheetData({});
      setFailedSubjects([]);
    }
  }, [ticketNumber, loadCandidateData]);

  const handleCandidateSelect = useCallback(
    async (candidateId) => {
      if (!candidateId) {
        setCandidateData(null);
        setCourseCode(null);
        setMarksheetData({});
        setFailedSubjects([]);
        return;
      }

      const candidate = candidates.find((c) => c.id === parseInt(candidateId));
      if (candidate) {
        setTicketNumber(candidate.ticket_no);
        await loadCandidateData(candidate);
      }
    },
    [candidates, loadCandidateData]
  );

  const handlePrintMarksheet = useCallback(() => {
    if (!marksheetRef.current || !candidateData) {
      setMessage({
        type: "error",
        text: "No marksheet data available for printing",
      });
      return;
    }

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      setMessage({
        type: "error",
        text: "Unable to open print window. Please check popup settings.",
      });
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
          <title>Marksheet - ${candidateData.name} (${
      candidateData.ticketNumber || candidateData.ticket_no
    })</title>
          <style>
            @page {
              size: A4;
              margin: 8mm;
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

//  const handleExportPDF = useCallback(async () => {
//   if (!marksheetRef.current) {
//     setMessage({ type: "error", text: "No marksheet to export." });
//     return;
//   }
//   setGenerating(true);

//   try {
//     // 1) Render DOM node to canvas
//     const canvas = await html2canvas(marksheetRef.current, {
//       scale: 2,
//       useCORS: true,
//       allowTaint: true,
//       backgroundColor: "#ffffff",
//     });

//     // 2) Prepare image data for the PDF
//     const imgData = canvas.toDataURL("image/jpeg", 1.0);
//     const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
//     const pageWidth = pdf.internal.pageSize.getWidth();
//     const pageHeight = pdf.internal.pageSize.getHeight();

//     // 3) Calculate the rendered image dimensions
//     const imgWidth = pageWidth;
//     const imgHeight = (canvas.height * pageWidth) / canvas.width;

//     // 4) Add first page
//     let heightLeft = imgHeight;
//     let position = 0;
//     pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
//     heightLeft -= pageHeight;

//     // 5) Add additional pages if the content overflows
//     while (heightLeft > 0) {
//       position = position - pageHeight;
//       pdf.addPage();
//       pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
//       heightLeft -= pageHeight;
//     }

//     // 6) Save the file
//     const filename = `Marksheet_${candidateData.ticketNumber || candidateData.ticket_no}.pdf`;
//     pdf.save(filename);

//     setMessage({ type: "success", text: "PDF exported successfully!" });
//   } catch (err) {
//     console.error("PDF export failed:", err);
//     setMessage({
//       type: "error",
//       text: "Failed to export PDF. Check console for details.",
//     });
//   } finally {
//     setGenerating(false);
//   }
// }, [candidateData]);


  // Helper functions with useMemo for optimization
  const calculateTotalMarks = useMemo(() => {
    if (
      !marksheetData ||
      !candidateData ||
      !courseCode ||
      marksheetData === null
    )
      return { total: 0, maxTotal: 0 };

    const structure = courseStructure[courseCode];
    if (!structure) {
      console.log("No course structure found for:", courseCode);
      return { total: 0, maxTotal: 0 };
    }

    let total = 0;
    let maxTotal = 0;

    Object.entries(structure).forEach(([session, papers]) => {
      if (selectedSession === "all" || selectedSession === session) {
        Object.entries(papers).forEach(([paper, config]) => {
          const paperMarks = marksheetData[session]?.[paper];
          const rawMarks = getRawMarks(paperMarks) || 0; // Use the standalone function
          total += rawMarks;
          maxTotal += config.maxMarks;
        });
      }
    });

    return { total, maxTotal };
  }, [marksheetData, candidateData, courseCode, selectedSession]);

  // Computed values with useMemo
  const currentCourseStructure = useMemo(
    () => (courseCode ? courseStructure[courseCode] : null),
    [courseCode]
  );

  const { total, maxTotal } = calculateTotalMarks;
  const percentage = useMemo(
    () => (maxTotal > 0 ? ((total / maxTotal) * 100).toFixed(2) : 0),
    [total, maxTotal]
  );

  // Helper function to check if supplementary is cleared
  const isSupplementaryCleared = useCallback((paperMarks) => {
    return typeof paperMarks === "string" && paperMarks.endsWith("C");
  }, []);

  // Helper function to check if paper should be treated as passed
  const isPaperPassed = useCallback(
    (paperMarks, maxMarks) => {
      const rawMarks = getRawMarks(paperMarks) || 0; // Use the standalone function
      const passingMarks = Math.ceil(maxMarks * 0.6);

      // Paper is passed if either:
      // 1. Raw marks are above passing threshold, OR
      // 2. Supplementary is cleared (ends with "C")
      return rawMarks >= passingMarks || isSupplementaryCleared(paperMarks);
    },
    [isSupplementaryCleared]
  );

  // Render each session/paper row
  const renderRows = useCallback(
    (session, papers) => {
      return Object.entries(papers).map(([paper, config], idx) => {
        const paperMarks = marksheetData[session]?.[paper] ?? "";
        const supplyMarks = getSupplementaryParsedMarks(paperMarks);
        const str = paperMarks.toString();
        const isCleared = str.includes("C"); // "C" present anywhere
        const rawMarks = getRawMarks(paperMarks) || 0;
        const percentage = ((rawMarks / config.maxMarks) * 100).toFixed(1);
        const passingMarks = getPassingMarks(config.maxMarks);
        const isPassed = isCleared || rawMarks >= passingMarks;

        return (
          <tr
            key={`${session}-${paper}`}
            style={{ backgroundColor: isPassed ? "white" : "#fef2f2" }}
          >
            {idx === 0 && (
              <td
                rowSpan={Object.keys(papers).length}
                style={{
                  border: "1px solid black",
                  padding: "4px 6px",
                  fontWeight: "600",
                  color: "black",
                  textAlign: "center",
                  verticalAlign: "top",
                  fontSize: "11px",
                }}
              >
                {session}
              </td>
            )}
            <td
              style={{
                border: "1px solid black",
                padding: "4px 6px",
                fontSize: "11px",
                color: "black",
              }}
            >
              {paper}
            </td>
            <td
              style={{
                border: "1px solid black",
                padding: "4px 6px",
                fontSize: "9px",
                color: "black",
                textAlign: "left",
              }}
            >
              {config.subjects.length > 0
                ? config.subjects.map((code, idx) => {
                    const subjectName = subjectMapping[code] || "";
                    return (
                      <span key={code}>
                        <span style={{ fontWeight: "bold" }}>{code}</span>
                        {subjectName ? ` – ${subjectName}` : ""}
                        {idx < config.subjects.length - 1 && ", "}
                      </span>
                    );
                  })
                : "-"}
            </td>

            <td
              style={{
                border: "1px solid black",
                padding: "4px 6px",
                fontSize: "11px",
                fontWeight: "600",
                color: "black",
                textAlign: "center",
              }}
            >
              {config.maxMarks}
            </td>
            <td
              style={{
                border: "1px solid black",
                padding: "4px 6px",
                fontSize: "11px",
                fontWeight: "bold",
                textAlign: "center",
                color: !isPassed ? "#dc2626" : "black",
              }}
            >
              {rawMarks}
            </td>
            <td
              style={{
                border: "1px solid black",
                padding: "4px 6px",
                fontSize: "11px",
                textAlign: "center",
                color: !isPassed ? "#dc2626" : "black",
              }}
            >
              {percentage}%
            </td>
            <td
              style={{
                border: "1px solid black",
                padding: "4px 6px",
                fontSize: "10px",
                fontWeight: "600",
                textAlign: "center",
                color: !isPassed ? "#dc2626" : "#16a34a",
              }}
            >
              {isCleared
                ? `PASSED IN SUPPLEMENTARY WITH MARKS : ${supplyMarks}`
                : isPassed
                ? "PASS"
                : "FAIL"}
            </td>
          </tr>
        );
      });
    },
    [marksheetData]
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
                <span className="text-green-700 font-medium text-xs">
                  System Active
                </span>
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
        <div className="max-w-9xl mx-auto">
          {/* Search Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                <Search className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Search Candidate
                </h2>
                <p className="text-gray-600 text-sm">
                  Find trainee to generate marksheet
                </p>
              </div>
            </div>

            {/* Search Method Selection */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setSearchMethod("ticket")}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  searchMethod === "ticket"
                    ? "bg-orange-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Search by Ticket Number
              </button>
              <button
                onClick={() => setSearchMethod("dropdown")}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  searchMethod === "dropdown"
                    ? "bg-orange-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Select from Dropdown
              </button>
            </div>

            {/* Search Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              {searchMethod === "ticket" ? (
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    disabled={loading}
                  >
                    <option value="">Select a candidate...</option>
                    {candidates.map((candidate) => (
                      <option key={candidate.id} value={candidate.id}>
                        {candidate.ticket_no} - {candidate.name} (
                        {determineCourseCode(
                          candidate.module_no,
                          candidate.designation
                        )}
                        )
                      </option>
                    ))}
                  </select>
                  {loading && searchMethod === "dropdown" && (
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
              <div
                className={`mt-6 p-4 rounded-xl flex items-center gap-3 ${
                  message.type === "success"
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : message.type === "info"
                    ? "bg-blue-50 text-blue-800 border border-blue-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                {message.type === "success" ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  <AlertTriangle className="w-6 h-6" />
                )}
                <span className="font-medium">{message.text}</span>
              </div>
            )}

            {/* Debug Section - Show raw candidate data */}
            {candidateData && (
              <div className="mt-6 p-4 rounded-xl bg-gray-50 border border-gray-200">
                <p className="text-xs font-mono text-gray-600 mb-2">
                  Debug Info:
                </p>
                <p className="text-xs text-gray-700">
                  Module No: "{candidateData.module_no}"
                </p>
                <p className="text-xs text-gray-700">
                  Designation: "{candidateData.designation}"
                </p>
                <p className="text-xs text-gray-700">
                  Detected Course: "{courseCode}"
                </p>
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
                    <h2 className="text-xl font-bold text-gray-900">
                      Marksheet Options
                    </h2>
                    <p className="text-gray-600 text-sm">
                      Choose view mode and generate marksheet
                    </p>
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
                  {/* <button
                    onClick={handleExportPDF}
                    disabled={generating || !candidateData}
                    className="flex items-center gap-2 px-4 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    {generating ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Download className="w-5 h-5" />
                    )}
                    {generating ? "Exporting..." : "Export PDF"}
                  </button> */}
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
                    <option value="complete">Final Marksheet</option>
                    <option value="sessionWise">Sessional Marksheet</option>
                  </select>
                </div>

                {viewMode === "sessionWise" && (
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
                      {currentCourseStructure &&
                        Object.keys(currentCourseStructure).map((session) => (
                          <option key={session} value={session}>
                            {session}
                          </option>
                        ))}
                    </select>
                  </div>
                )}

                <div className="flex items-end">
                  <div className="bg-orange-50 p-4 rounded-xl border border-orange-200 w-full">
                    <p className="text-sm font-semibold text-orange-700">
                      Total Marks
                    </p>
                    <p className="text-2xl font-bold text-orange-900">
                      {total}/{maxTotal}
                    </p>
                    <p className="text-sm text-orange-600">{percentage}%</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* No Marks Display */}
          {candidateData && marksheetData === null && (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-200 mb-8">
              <div className="w-20 h-20 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                No Marks Added Yet
              </h3>
              <p className="text-gray-600 max-w-md mx-auto leading-relaxed mb-4">
                The candidate <strong>{candidateData.name}</strong> (Ticket:{" "}
                {candidateData.ticketNumber}) has been registered but no marks
                have been entered yet.
              </p>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 max-w-md mx-auto">
                <p className="text-sm text-gray-700">
                  <strong>Course:</strong>{" "}
                  {courseCode || candidateData.courseCode}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Module No:</strong>{" "}
                  {candidateData.module_no || "Not specified"}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Designation:</strong> {candidateData.designation}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Batch:</strong> {candidateData.batch}
                </p>
              </div>
            </div>
          )}

          {/* Marksheet Display */}
          {candidateData && marksheetData && (
            <div
              ref={marksheetRef}
              style={{
                backgroundColor: "white",
                borderRadius: "16px",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                border: "1px solid #e5e7eb",
                padding: "16px",
                marginBottom: "32px",
                fontFamily: "Times New Roman, serif",
                fontSize: "12px",
                lineHeight: "1.2",
                color: "black",
              }}
            >
              {/* Header - Compact format */}
              <div
                style={{
                  borderBottom: "2px solid #6b7280",
                  paddingBottom: "12px",
                  marginBottom: "16px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "center",
                    position: "relative",
                    width: "100%",
                  }}
                >
                  {/* Railway Logo - Smaller */}
                  <div
                    style={{
                      position: "absolute",
                      left: "0",
                      width: "84px",
                      height: "84px",
                      backgroundColor: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: "0",
                      padding: "2px",
                    }}
                  >
                    <img
                      src={railwayLogo}
                      alt="Indian Railways Logo"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                    <div
                      style={{
                        textAlign: "center",
                        display: "none",
                        flexDirection: "column",
                        fontSize: "8px",
                        fontWeight: "bold",
                      }}
                    >
                      <div>INDIAN</div>
                      <div>RAILWAYS</div>
                      <div>LOGO</div>
                    </div>
                  </div>

                  {/* North Logo - Same size and position as Railway Logo */}
                  <div
                    style={{
                      position: "absolute",
                      right: "0",
                      width: "84px",
                      height: "84px",
                      backgroundColor: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: "0",
                      padding: "2px",
                    }}
                  >
                    <img
                      src={northLogo}
                      alt="Northern Railway Logo"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                    <div
                      style={{
                        textAlign: "center",
                        display: "none",
                        flexDirection: "column",
                        fontSize: "8px",
                        fontWeight: "bold",
                      }}
                    >
                      <div>NORTHERN</div>
                      <div>RAILWAY</div>
                      <div>LOGO</div>
                    </div>
                  </div>

                  {/* Header text - Centered and Compact */}
                  <div
                    style={{
                      textAlign: "center",
                      flex: "1",
                      paddingLeft: "80px",
                      paddingRight: "80px",
                    }}
                  >
                    <h1
                      style={{
                        fontSize: "18px",
                        fontWeight: "bold",
                        color: "black",
                        margin: "0 0 2px 0",
                      }}
                    >
                      NORTHERN RAILWAY
                    </h1>
                    <h2
                      style={{
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "black",
                        margin: "0 0 1px 0",
                      }}
                    >
                      SUPERVISOR TRAINING CENTRE
                    </h2>
                    <h2
                      style={{
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "black",
                        margin: "0 0 1px 0",
                      }}
                    >
                      CHARBAGH, LUCKNOW
                    </h2>
                    <h3
                      style={{
                        fontSize: "12px",
                        fontWeight: "bold",
                        color: "black",
                        margin: "6px 0 2px 0",
                      }}
                    >
                      STATEMENT OF MARKS
                    </h3>
                    {viewMode === "sessionWise" &&
                      selectedSession !== "all" && (
                        <h4
                          style={{
                            fontSize: "10px",
                            fontWeight: "600",
                            color: "#374151",
                            margin: "1px 0 0 0",
                          }}
                        >
                          (Sessional Marksheet - {selectedSession})
                        </h4>
                      )}
                    {viewMode === "complete" && (
                      <h4
                        style={{
                          fontSize: "10px",
                          fontWeight: "600",
                          color: "black",
                          margin: "1px 0 0 0",
                        }}
                      >
                        (Final Marksheet)
                      </h4>
                    )}
                  </div>
                </div>
              </div>

              {/* Candidate Information - Compact */}
              <div style={{ marginBottom: "16px" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "separate",
                    borderSpacing: "0",
                  }}
                >
                  <tbody>
                    <tr>
                      <td
                        style={{
                          padding: "2px 0",
                          color: "black",
                          fontSize: "12px",
                        }}
                      >
                        <span style={{ fontWeight: 600 }}>Name:</span>{" "}
                        <span style={{ fontWeight: 400 }}>
                          {candidateData.name}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "2px 0",
                          color: "black",
                          textAlign: "right",
                          fontSize: "12px",
                        }}
                      >
                        <span style={{ fontWeight: 600 }}>Father's Name:</span>{" "}
                        <span style={{ fontWeight: 400 }}>
                          {candidateData.fatherName ||
                            candidateData.father_name}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          padding: "2px 0",
                          color: "black",
                          fontSize: "12px",
                        }}
                      >
                        <span style={{ fontWeight: 600 }}>Batch:</span>{" "}
                        <span style={{ fontWeight: 400 }}>
                          {candidateData.batch}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "2px 0",
                          color: "black",
                          textAlign: "right",
                          fontSize: "12px",
                        }}
                      >
                        <span style={{ fontWeight: 600 }}>Ticket No:</span>{" "}
                        <span style={{ fontWeight: 400 }}>
                          {candidateData.ticketNumber ||
                            candidateData.ticket_no}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          padding: "2px 0",
                          color: "black",
                          fontSize: "12px",
                        }}
                      >
                        <span style={{ fontWeight: 600 }}>Post:</span>{" "}
                        <span style={{ fontWeight: 400 }}>
                          {candidateData.designation}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "2px 0",
                          color: "black",
                          textAlign: "right",
                          fontSize: "12px",
                        }}
                      >
                        <span style={{ fontWeight: 600 }}>Module:</span>{" "}
                        <span style={{ fontWeight: 400 }}>
                          {candidateData.courseCode}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          padding: "2px 0",
                          color: "black",
                          fontSize: "12px",
                        }}
                      >
                        <span style={{ fontWeight: 600 }}>Unit:</span>{" "}
                        <span style={{ fontWeight: 400 }}>
                          {candidateData.unit}
                        </span>
                      </td>
                      <td />
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Marks Table - Compact */}
              {currentCourseStructure && (
                <div style={{ marginBottom: "20px" }}>
                  <table
                    style={{
                      width: "100%",
                      border: "2px solid black",
                      borderCollapse: "collapse",
                    }}
                  >
                    <thead>
                      <tr style={{ backgroundColor: "#f3f4f6" }}>
                        <th
                          style={{
                            border: "1px solid black",
                            padding: "4px 6px",
                            fontSize: "11px",
                            fontWeight: "bold",
                            color: "black",
                            textAlign: "center",
                          }}
                        >
                          Session
                        </th>
                        <th
                          style={{
                            border: "1px solid black",
                            padding: "4px 6px",
                            fontSize: "11px",
                            fontWeight: "bold",
                            color: "black",
                            textAlign: "center",
                          }}
                        >
                          Paper
                        </th>
                        <th
                          style={{
                            border: "1px solid black",
                            padding: "4px 6px",
                            fontSize: "11px",
                            fontWeight: "bold",
                            color: "black",
                            textAlign: "center",
                          }}
                        >
                          Subjects
                        </th>
                        <th
                          style={{
                            border: "1px solid black",
                            padding: "4px 6px",
                            fontSize: "11px",
                            fontWeight: "bold",
                            color: "black",
                            textAlign: "center",
                          }}
                        >
                          Max Marks
                        </th>
                        <th
                          style={{
                            border: "1px solid black",
                            padding: "4px 6px",
                            fontSize: "11px",
                            fontWeight: "bold",
                            color: "black",
                            textAlign: "center",
                          }}
                        >
                          Marks Obtained
                        </th>
                        <th
                          style={{
                            border: "1px solid black",
                            padding: "4px 6px",
                            fontSize: "11px",
                            fontWeight: "bold",
                            color: "black",
                            textAlign: "center",
                          }}
                        >
                          Percentage (%)
                        </th>
                        <th
                          style={{
                            border: "1px solid black",
                            padding: "4px 6px",
                            fontSize: "11px",
                            fontWeight: "bold",
                            color: "black",
                            textAlign: "center",
                          }}
                        >
                          Remark
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentCourseStructure &&
                        Object.entries(currentCourseStructure).flatMap(
                          ([session, papers]) => {
                            if (
                              viewMode === "sessionWise" &&
                              selectedSession !== "all" &&
                              selectedSession !== session
                            )
                              return [];
                            return renderRows(session, papers);
                          }
                        )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Summary Section - Compact */}
              <div
                style={{
                  marginBottom: "20px",
                  border: "2px solid #d1d5db",
                  backgroundColor: "#f9fafb",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    borderRight: "0",
                  }}
                >
                  <div
                    style={{
                      padding: "10px",
                      textAlign: "center",
                      borderRight: "2px solid #d1d5db",
                    }}
                  >
                    <h3
                      style={{
                        fontSize: "11px",
                        fontWeight: "bold",
                        color: "black",
                        margin: "0 0 2px 0",
                      }}
                    >
                      TOTAL MARKS
                    </h3>
                    <p
                      style={{
                        fontSize: "16px",
                        fontWeight: "bold",
                        color: "black",
                        margin: "0",
                      }}
                    >
                      {total}/{maxTotal}
                    </p>
                  </div>
                  <div
                    style={{
                      padding: "10px",
                      textAlign: "center",
                    }}
                  >
                    <h3
                      style={{
                        fontSize: "11px",
                        fontWeight: "bold",
                        color: "black",
                        margin: "0 0 2px 0",
                      }}
                    >
                      FINAL PERCENTAGE
                    </h3>
                    <p
                      style={{
                        fontSize: "16px",
                        fontWeight: "bold",
                        color: "black",
                        margin: "0",
                      }}
                    >
                      {percentage}%
                    </p>
                  </div>
                </div>

                {/* Failed Subjects Disclaimer - Only show when relevant */}
                {(() => {
                  // Filter failed subjects for current view
                  const relevantFailed = failedSubjects.filter((subject) =>
                    viewMode === "sessionWise" && selectedSession !== "all"
                      ? subject.session === selectedSession
                      : true
                  );
                  // If there are failed subjects, check if any are not cleared

                  const hasUncleared = relevantFailed.some((subject) => {
                    const marks =
                      marksheetData?.[subject.session]?.[subject.paper];
                    // "C" present anywhere means cleared
                    return !(typeof marks === "string" && marks.includes("C"));
                  });
                  if (relevantFailed.length > 0 && hasUncleared) {
                    return (
                      <div
                        style={{
                          borderTop: "2px solid #d1d5db",
                          padding: "16px",
                          textAlign: "center",
                        }}
                      >
                        <p
                          style={{
                            color: "#dc2626",
                            fontWeight: "bold",
                            fontSize: "13px",
                            margin: "0 0 4px 0",
                          }}
                        >
                          Remark : Candidate has failed in subject(s):{" "}
                          {relevantFailed
                            .filter((subject) => {
                              const marks =
                                marksheetData?.[subject.session]?.[
                                  subject.paper
                                ];
                              // "C" present anywhere means cleared
                              return !(
                                typeof marks === "string" && marks.includes("C")
                              );
                            })
                            .map((subject) =>
                              subject.subjects.length > 0
                                ? subject.subjects.join(", ")
                                : `${subject.session} - ${subject.paper}`
                            )
                            .join(", ")}
                        </p>
                        <p
                          style={{
                            color: "#dc2626",
                            fontSize: "11px",
                            margin: "0",
                          }}
                        >
                          Passing criteria: 60% or above required in each
                          subject.
                        </p>
                      </div>
                    );
                  }
                  // If all failed subjects are cleared, show nothing
                  return null;
                })()}
              </div>

              {/* Footer - Compact */}
              <div
                style={{
                  borderTop: "2px solid #6b7280",
                  paddingTop: "16px",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "20px",
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    <p
                      style={{
                        fontWeight: "600",
                        color: "black",
                        fontSize: "11px",
                        margin: "0",
                      }}
                    >
                      Senior Lecturer (IC)
                    </p>
                    <div style={{ height: "30px", marginTop: "20px" }}></div>
                    <div
                      style={{
                        borderTop: "2px solid black",
                        width: "100px",
                        margin: "0 auto",
                      }}
                    ></div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <p
                      style={{
                        fontWeight: "600",
                        color: "black",
                        fontSize: "11px",
                        margin: "0",
                      }}
                    >
                      Director
                    </p>
                    <div style={{ height: "30px", marginTop: "20px" }}></div>
                    <div
                      style={{
                        borderTop: "2px solid black",
                        width: "100px",
                        margin: "0 auto",
                      }}
                    ></div>
                    <p
                      style={{
                        fontSize: "9px",
                        color: "#6b7280",
                        fontStyle: "italic",
                        marginTop: "4px",
                        margin: "4px 0 0 0",
                      }}
                    >
                      Date of Generation:{" "}
                      {new Date().toLocaleDateString("en-IN")}
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
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                No Candidate Selected
              </h3>
              <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
                Please search for a candidate using their ticket number or
                select from the dropdown to view their marksheet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Marksheet;
