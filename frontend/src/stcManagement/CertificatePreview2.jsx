import { Buffer } from "buffer";
globalThis.Buffer = Buffer;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import railwayLogo from "../assets/rail.png";
import BgImage from "../assets/fullsizelogo.png";

// Format date for display
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const CertificatePreview2 = () => {
  const navigate = useNavigate();
  const [trainees, setTrainees] = useState([]);

  // Load selected trainees from sessionStorage or URL params
  useEffect(() => {
    try {
      const storedTrainees = sessionStorage.getItem("selectedTrainees");
      if (storedTrainees) {
        setTrainees(JSON.parse(storedTrainees));
        return;
      }

      const queryParams = new URLSearchParams(window.location.search);
      const traineeIdsParam = queryParams.get("trainees");
      if (traineeIdsParam) {
        const traineeIds = JSON.parse(decodeURIComponent(traineeIdsParam));
        fetch("/api/stc")
          .then((response) => {
            if (!response.ok) throw new Error("Failed to fetch trainees");
            return response.json();
          })
          .then((data) => {
            const traineeArray = Array.isArray(data.data) ? data.data : [];
            // Fix: Filter by ticket_no instead of id since Certificate.jsx passes ticket_no values
            const selectedTrainees = traineeArray.filter((trainee) =>
              traineeIds.includes(trainee.ticket_no)
            );
            if (selectedTrainees.length > 0) {
              setTrainees(selectedTrainees);
            } else {
              throw new Error("No matching trainees found");
            }
          })
          .catch((err) => {
            console.error("Error fetching trainee data:", err);
            navigate("/stc/certificate");
          });
        return;
      }

      navigate("/stc/certificate");
    } catch (err) {
      console.error("Error loading trainee data:", err);
      navigate("/stc/certificate");
    }

    return () => {
      sessionStorage.removeItem("selectedTrainees");
    };
  }, [navigate]);

  // Course structure mapping for training duration
  const courseStructure = {
    "MSE-C&W": "Trainset Maintenance",
    "MSE-D": "Diesel Locomotive Maintenance", 
    "MSE-W": "Workshop Training",
    "MJR-C&W": "Carriage & Wagon Maintenance",
    "MJR-D": "Diesel Locomotive Maintenance",
    "MJR-W": "Workshop Training",
    "MJI-C&W": "Carriage & Wagon Engineering",
    "MJI-D": "Diesel Engineering",
    "MJI-W": "Workshop Engineering",
    "MJP-C&W": "Carriage & Wagon Promotion",
    "MJP-D": "Diesel Promotion",
    "MJP-W": "Workshop Promotion",
    ASE: "Assistant Section Engineer",
    AJE: "Assistant Junior Engineer",
    IJE: "Inspector Junior Engineer",
    RJE: "Refresher Junior Engineer",
    RCW: "Refresher Carriage & Wagon",
    RD: "Refresher Diesel",
    TS: "Technical Seminar",
    "LH-I": "Locomotive Handling Level I",
    "LH-II": "Locomotive Handling Level II",
    FM: "Fire Management",
    WT: "Welding Technology",
    DM: "Disaster Management",
    WE: "Work Environment",
    NDT: "Non-Destructive Testing",
    EA: "Environmental Awareness",
    "3DMP": "3D Modeling and Printing",
  };

  // Certificate Template
  const CertificateTemplate = ({ trainee }) => {
    const defaultCourse = courseStructure[trainee.module_no] || "Trainset Maintenance";
    const [editableCourse, setEditableCourse] = useState(defaultCourse);
    const [editableSerialNo, setEditableSerialNo] = useState("TRAINSET/01/07/2025");
    const [editableName, setEditableName] = useState(trainee.name || "");
    const [editableDesignation, setEditableDesignation] = useState(trainee.designation || "SSE");
    const [editableEmployeeNo, setEditableEmployeeNo] = useState(trainee.employee_id || "50320130857");
    const [editableDivision, setEditableDivision] = useState("DLI DIVISION");
    const [editableFromDate, setEditableFromDate] = useState("07/07/2025");
    const [editableToDate, setEditableToDate] = useState("12/07/2025");
    const [editableDate, setEditableDate] = useState(formatDate(new Date()));
    const [editablePlace, setEditablePlace] = useState("Lucknow");
    const [editableCoordinator, setEditableCoordinator] = useState("Naveen Jaiswal");
    const [editableDirector, setEditableDirector] = useState("A.N. Siddiqui");

    useEffect(() => {
      setEditableCourse(defaultCourse);
      setEditableName(trainee.name || "");
      setEditableDesignation(trainee.designation || "SSE");
      setEditableEmployeeNo(trainee.employee_id || "50320130857");
    }, [trainee, defaultCourse]);

    return (
      <div className="certificate-preview-outer ">
        <div
          className="certificate border-double border-4 border-black bg-white relative overflow-hidden shadow-xl"
          style={{
            fontFamily: "Times New Roman, serif",
            width: "950px",
            minHeight: "670px",
            margin: "4px auto",
            background: "#fff",
            borderRadius: "18px",
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.18)",
            position: "relative",
            padding: "40px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {/* Double border effect - Remove this as we're using CSS classes */}
          
          {/* Watermark - Railway Logo */}
          <img
            src={BgImage}
            alt="Watermark"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "92%",
              height: "92%",
              transform: "translate(-50%, -50%)",
              opacity: 0.07,
              zIndex: 0,
              pointerEvents: "none",
              objectFit: "contain",
              filter: "blur(0.5px)",
            }}
            draggable={false}
          />

          {/* Content Container */}
          <div style={{ position: "relative", zIndex: 1, height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "20px" }}>
            
            {/* Header Section */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "20px", padding: "10px 15px" }}>
              
              {/* Railway Logo */}
              <div style={{ flex: "0 0 120px", marginLeft: "10px" }}>
                <img
                  src={railwayLogo}
                  alt="Railway Logo"
                  style={{
                    width: "120px",
                    height: "120px",
                    objectFit: "contain",
                  }}
                />
              </div>

              {/* Center Content */}
              <div style={{ flex: "1", textAlign: "center", padding: "0 30px" }}>
                <h1 style={{
                  fontSize: "31px",
                  fontWeight: "bold",
                  color: "#1e40af",
                  margin: "0 0 5px 0",
                  letterSpacing: "1px"
                }}>
                  Supervisors Training Centre
                </h1>
                <h2 style={{
                  fontSize: "20px",
                  fontWeight: "600",
                  color: "#1e40af", 
                  margin: "0 0 15px 0"
                }}>
                  Northern Railway, Charbagh, Lucknow
                </h2>
                <h1 style={{
                  fontSize: "35px",
                  fontWeight: "bold",
                  color: "#1e40af",
                  margin: "0",
                  letterSpacing: "2px"
                }}>
                  Certificate
                </h1>
              </div>

              {/* Photo */}
              <div style={{ flex: "0 0 120px", marginRight: "10px" }}>
                <div
                  style={{
                    width: "120px",
                    height: "140px",
                    border: "2px solid #000",
                    background: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "4px",
                  }}
                >
                  <img
                    src={`http://${import.meta.env.VITE_BACKEND_IP}:5000/${trainee.picture}`}
                    alt={trainee.name}
                    style={{
                      objectFit: "cover",
                      width: "100%",
                      height: "100%",
                      borderRadius: "2px",
                    }}
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.parentNode.innerHTML = `<div style="display: flex; align-items: center; justify-content: center; height: 100%; font-size: 12px; color: #666;">Photo</div>`;
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Serial Number */}
            <div style={{ marginBottom: "15px", paddingLeft: "15px" }}>
              <span style={{ fontSize: "18px", fontWeight: "600", color: "#1e40af" }}>
                S. No.: 
                <span
                  contentEditable={true}
                  suppressContentEditableWarning={true}
                  style={{ textDecoration: "none", marginLeft: "5px" }}
                  onBlur={(e) => setEditableSerialNo(e.currentTarget.textContent)}
                >
                  {editableSerialNo}
                </span>
              </span>
            </div>

            {/* Main Certificate Text */}
            <div style={{ flex: "1", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 25px" }}>
              <div style={{ 
                fontSize: "20.6px", 
                lineHeight: "1.8", 
                textAlign: "center",
                marginBottom: "20px"
              }}>
                <p style={{ margin: "0 0 15px 0" }}>
                  This is to certify that{" "}
                  <span style={{ fontWeight: "bold", fontSize: "22.7px" }}>
                    <span 
                      contentEditable={true}
                      suppressContentEditableWarning={true}
                      onBlur={(e) => setEditableName(e.currentTarget.textContent)}
                    >
                      {editableName}
                    </span>
                  </span>
                </p>
                
                <div style={{ margin: "15px 0" }}>
                  <span>
                    Designation{" "}
                    <span
                      contentEditable={true}
                      suppressContentEditableWarning={true}
                      style={{ 
                        borderBottom: "1px solid #000", 
                        minWidth: "150px", 
                        display: "inline-block",
                        textAlign: "center",
                        fontWeight: "bold"
                      }}
                      onBlur={(e) => setEditableDesignation(e.currentTarget.textContent)}
                    >
                      {editableDesignation}
                    </span>
                    , Employee No.{" "}
                    <span
                      contentEditable={true}
                      suppressContentEditableWarning={true}
                      style={{ 
                        borderBottom: "1px solid #000", 
                        minWidth: "120px", 
                        display: "inline-block",
                        textAlign: "center",
                        fontWeight: "bold"
                      }}
                      onBlur={(e) => setEditableEmployeeNo(e.currentTarget.textContent)}
                    >
                      {editableEmployeeNo}
                    </span>
                    {" "}of
                  </span>
                </div>

                <div style={{ margin: "15px 0" }}>
                  <span
                    contentEditable={true}
                    suppressContentEditableWarning={true}
                    style={{ 
                      borderBottom: "1px solid #000", 
                      minWidth: "200px", 
                      display: "inline-block",
                      textAlign: "center",
                      fontWeight: "bold"
                    }}
                    onBlur={(e) => setEditableDivision(e.currentTarget.textContent)}
                  >
                    {editableDivision}
                  </span>
                  {" "}has successfully completed the{" "}
                  <span
                    contentEditable={true}
                    suppressContentEditableWarning={true}
                    style={{ fontWeight: "bold" }}
                    onBlur={(e) => setEditableCourse(e.currentTarget.textContent)}
                  >
                    {editableCourse}
                  </span>
                  {" "}at this
                </div>

                <p style={{ margin: "15px 0 0 0" }}>
                  institution from{" "}
                  <span
                    contentEditable={true}
                    suppressContentEditableWarning={true}
                    style={{ 
                      borderBottom: "1px solid #000", 
                      minWidth: "100px", 
                      display: "inline-block",
                      textAlign: "center",
                      fontWeight: "bold"
                    }}
                    onBlur={(e) => setEditableFromDate(e.currentTarget.textContent)}
                  >
                    {editableFromDate}
                  </span>
                  {" "}to{" "}
                  <span
                    contentEditable={true}
                    suppressContentEditableWarning={true}
                    style={{ 
                      borderBottom: "1px solid #000", 
                      minWidth: "100px", 
                      display: "inline-block",
                      textAlign: "center",
                      fontWeight: "bold"
                    }}
                    onBlur={(e) => setEditableToDate(e.currentTarget.textContent)}
                  >
                    {editableToDate}
                  </span>
                  {" "}.
                </p>
              </div>
            </div>

            {/* Footer Section */}
            <div style={{ padding: "0 15px 10px 15px" }}>
              {/* Date and Place */}
              <div style={{ marginBottom: "50px" }}>
                <div style={{ fontSize: "18px", fontWeight: "600", color: "#1e40af", marginBottom: "10px" }}>
                  Date: 
                  <span
                    contentEditable={true}
                    suppressContentEditableWarning={true}
                    style={{ marginLeft: "5px", fontWeight: "normal", color: "#000" }}
                    onBlur={(e) => setEditableDate(e.currentTarget.textContent)}
                  >
                    {editableDate}
                  </span>
                </div>
                <div style={{ fontSize: "18px", fontWeight: "600", color: "#1e40af", marginBottom: "80px" }}>
                  Place: 
                  <span
                    contentEditable={true}
                    suppressContentEditableWarning={true}
                    style={{ marginLeft: "5px", fontWeight: "normal", color: "#000" }}
                    onBlur={(e) => setEditablePlace(e.currentTarget.textContent)}
                  >
                    {editablePlace}
                  </span>
                </div>
              </div>

              {/* Signatures */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end" }}>
                
                {/* Course Coordinator */}
                <div style={{ textAlign: "center", width: "200px" }}>
                  <div style={{ 
                    fontSize: "18px", 
                    fontWeight: "600", 
                    color: "#1e40af",
                    marginBottom: "5px"
                  }}>
                    (
                    <span
                      contentEditable={true}
                      suppressContentEditableWarning={true}
                      onBlur={(e) => setEditableCoordinator(e.currentTarget.textContent)}
                    >
                      {editableCoordinator}
                    </span>
                    )
                  </div>
                  <div style={{ 
                    fontSize: "18px", 
                    fontWeight: "600", 
                    color: "#1e40af"
                  }}>
                    Course Coordinator
                  </div>
                </div>

                {/* Institute Seal */}
                <div style={{ textAlign: "center", flex: "1" }}>
                  <div style={{ 
                    fontSize: "18px", 
                    fontWeight: "600", 
                    color: "#000",
                    marginBottom: "5px"
                  }}>
                    Institute Seal
                  </div>
                  <div style={{ 
                    fontSize: "13px", 
                    fontStyle: "italic",
                    color: "#666"
                  }}>
                    The certificate is valid with Institute Seal only.
                  </div>
                </div>

                {/* Director */}
                <div style={{ textAlign: "center", width: "200px" }}>
                  <div style={{ 
                    fontSize: "18px", 
                    fontWeight: "600", 
                    color: "#1e40af",
                    marginBottom: "5px"
                  }}>
                    (
                    <span
                      contentEditable={true}
                      suppressContentEditableWarning={true}
                      onBlur={(e) => setEditableDirector(e.currentTarget.textContent)}
                    >
                      {editableDirector}
                    </span>
                    )
                  </div>
                  <div style={{ 
                    fontSize: "18px", 
                    fontWeight: "600", 
                    color: "#1e40af"
                  }}>
                    Director
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ background: "#e5e7eb", minHeight: "100vh", padding: "20px 0" }}>
      
      {/* Print Button */}
      <div style={{
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        maxWidth: "1200px",
        margin: "0 auto 20px auto",
        paddingRight: "30px",
      }}>
        <button
          onClick={() => window.print()}
          style={{
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            padding: "12px 24px",
            fontWeight: 600,
            fontSize: "16px",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            transition: "background 0.2s",
          }}
          onMouseOver={(e) => e.target.style.background = "#1d4ed8"}
          onMouseOut={(e) => e.target.style.background = "#2563eb"}
        >
          Print Certificates
        </button>
      </div>

      {/* Certificates */}
      {trainees.length > 0 ? (
        trainees.map((trainee) => (
          <div
            key={trainee.ticket_no}
            className={
              trainees.length > 1
                ? "certificate-preview-outer certificate-preview-outer-margin"
                : "certificate-preview-outer"
            }
          >
            <CertificateTemplate trainee={trainee} />
          </div>
        ))
      ) : (
        <div style={{ textAlign: "center", marginTop: "80px", fontSize: "22px" }}>
          Loading...
        </div>
      )}

      {/* Print Styles */}
      <style jsx="true">{`
        @media print {
          @page {
            size: landscape;
            margin-top: 0mm;
            margin-bottom: 0mm;
            margin-left: 0mm;
            margin-right: 0mm;
          }
          html,
          body {
            padding: 0 !important;
            margin: 0 !important;
            background: #fff !important;
            height: 100% !important;
            width: 100% !important;
          }
          .certificate-preview-outer {
            background: #fff !important;
            box-shadow: none !important;
            padding: 0 !important;
          }
          .certificate-preview-outer:not(:last-child) {
            page-break-after: always;
            break-after: page;
          }
          .certificate-preview-outer:last-child {
            page-break-after: avoid;
            break-after: avoid;
          }
          .certificate {
            width: 270mm !important;
            min-height: 200mm !important;
            max-height: 210mm !important;
            height: auto !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            margin: 0 auto !important;
            padding: 0 !important;
          }
          button {
            display: none !important;
          }
          ${trainees.length > 1
            ? `.certificate-preview-outer.certificate-preview-outer-margin {
                  margin: 40px !important;
                }`
            : ""}
        }
      `}</style>
    </div>
  );
};

export default CertificatePreview2;
