import { Buffer } from "buffer";
globalThis.Buffer = Buffer;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BgImage from "../assets/fullsizelogo.png";
import { courseDuration } from "./CourseInfo";
// Format date for display (can be used by both components)
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const CertificatePreview = () => {
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
            const selectedTrainees = traineeArray.filter((trainee) =>
              traineeIds.includes(trainee.id)
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

  // Certificate Template
  const CertificateTemplate = ({ trainee }) => {
    const defaultDuration = courseDuration[trainee.module_no] || "";
    const [editableDuration, setEditableDuration] = useState(defaultDuration);
    // Add editableTicketNo state
    const [editableTicketNo, setEditableTicketNo] = useState(trainee.ticket_no);

    useEffect(() => {
      setEditableDuration(defaultDuration);
      setEditableTicketNo(trainee.ticket_no);
      // eslint-disable-next-line
    }, [trainee]);

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
            padding: "0",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {/* Watermark */}
          <img
            src={BgImage}
            alt="Watermark"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "30%",
              height: "30%",
              transform: "translate(-50%, -50%)",
              opacity: 0.1,
              zIndex: 10,
              pointerEvents: "none",
              objectFit: "contain",
              filter: "blur(0.5px)",
            }}
            draggable={false}
          />
          {/* Header */}
          <div
            className="relative z-10 "
            style={{ padding: "38px 60px 40px 60px" }}
          >
            <div className="flex justify-between items-start">
              <div>
                <img
                  src={BgImage}
                  alt="Logo"
                  style={{
                    width: 100,
                    filter: "drop-shadow(0 2px 6px #aaa)",
                  }}
                />
              </div>
              <div
                className="text-center flex-1"
                style={{ marginLeft: "-25px" }}
              >
                <div
                  style={{
                    fontSize: 36,
                    fontWeight: 700,
                    color: "#17408B",
                    marginBottom: 0,
                    letterSpacing: "1px",
                  }}
                >
                  Supervisors Training Centre
                </div>
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 600,
                    color: "#17408B",
                    marginBottom: 0,
                  }}
                >
                  Northern Railway, Charbagh, Lucknow
                </div>
                <div
                  style={{
                    fontSize: 36,
                    fontWeight: 700,
                    color: "#17408B",
                    margin: "18px 0 0 0",
                    letterSpacing: "2px",
                  }}
                >
                  Certificate
                </div>
              </div>
              <div>
                <div
                  style={{
                    width: 110,
                    height: 130,
                    border: "2.5px solid #222",
                    background: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginLeft: 10,
                    borderRadius: "8px",
                  }}
                >
                  <img
                    src={`http://${import.meta.env.VITE_BACKEND_IP}:5000/${
                      trainee.picture
                    }`}
                    alt={trainee.name}
                    style={{
                      objectFit: "cover",
                      width: "100%",
                      height: "100%",
                      borderRadius: "6px",
                    }}
                  />
                </div>
              </div>
            </div>
            {/* S. No. */}
            <div className="flex justify-between items-center mt-4 mb-2">
              <div style={{ fontWeight: 600, color: "#17408B", fontSize: 20 }}>
                S. No.:{" "}
                <span
                  contentEditable={true}
                  suppressContentEditableWarning={true}
                  style={{
                    textDecoration: "underline",
                    textDecorationStyle: "solid",
                  }}
                >
                  (_________)
                </span>
              </div>
              <div></div>
            </div>
            {/* Main Body */}
            <div
              style={{
                marginTop: 38,
                fontSize: 22,
                color: "#222",
                textAlign: "center",
                lineHeight: 1.7,
                letterSpacing: "0.5px",
              }}
            >
              <div style={{ marginBottom: 16, fontSize: 20 }}>
                This is to certify that
              </div>
              <div>
                <span
                  contentEditable={true}
                  suppressContentEditableWarning={true}
                >
                  Sh./Smt./Km.
                </span>{" "}
                <span
                  style={{ fontWeight: 700 }}
                  contentEditable={true}
                  suppressContentEditableWarning={true}
                >
                  {trainee.name}
                </span>
                , of{" "}
                <span
                  style={{ fontWeight: 700 }}
                  contentEditable={true}
                  suppressContentEditableWarning={true}
                >
                  (_________)
                </span>{" "}
                Division/Workshop
              </div>
              <div style={{ marginTop: 6 }}>
                STC Ticket No.:{" "}
                <span
                  style={{
                    fontWeight: 700,
                    background: "#f3f4f6",
                    padding: "0 7px",
                    borderRadius: 4,
                    fontSize: 20,
                  }}
                  contentEditable={true}
                  suppressContentEditableWarning={true}
                  onBlur={(e) =>
                    setEditableTicketNo(e.currentTarget.textContent)
                  }
                >
                  {editableTicketNo}
                </span>
                , Trade-
                <span
                  style={{ fontWeight: 700 }}
                  contentEditable={true}
                  suppressContentEditableWarning={true}
                >
                  {trainee.module_no || "Workshop"}
                </span>
              </div>
              <div style={{ marginTop: 6 }}>
                has successfully completed the
                <span contentEditable={true}>
                  {" "}
                  Induction/Promotional course{" "}
                </span>
                <br />
                of{" "}
                <span
                  style={{ fontWeight: 700, fontSize: 20 }}
                  contentEditable={true}
                  suppressContentEditableWarning={true}
                  onBlur={(e) =>
                    setEditableDuration(e.currentTarget.textContent)
                  }
                >
                  {editableDuration}
                </span>{" "}
                duration at this Institution.
              </div>
            </div>
            {/* Date and Place */}
            <div
              className="flex flex-col items-start mt-10 mb-15"
              style={{
                fontSize: 19,
                alignItems: "flex-start",
                marginBottom: 0,
              }}
            >
              <div style={{ alignSelf: "flex-start" }}>
                <span style={{ fontWeight: 700 }}>Date:</span>{" "}
                <span
                  contentEditable={true}
                  suppressContentEditableWarning={true}
                >
                  {formatDate(trainee.date_of_sparing) || "10/08/2024"}
                </span>
              </div>
              <div style={{ alignSelf: "flex-start", marginTop: 10 }}>
                <span style={{ fontWeight: 700 }}>Place:</span>{" "}
                <span
                  contentEditable={true}
                  suppressContentEditableWarning={true}
                >
                  Lucknow
                </span>
              </div>
            </div>
            {/* Signatures and Institute Seal - All in one line */}
            <div
              className="flex justify-between items-end mt-12"
              style={{ fontSize: 19, marginTop: 30, marginBottom: 40 }}
            >
              <div className="text-center" style={{ width: 240 }}>
                <span
                  contentEditable={true}
                  suppressContentEditableWarning={true}
                  style={{ fontSize: 17 }}
                >
                  (Naveen Jaiswal)
                </span>
                <div
                  style={{ fontWeight: 700, color: "#17408B", fontSize: 21 }}
                >
                  Course Coordinator
                </div>
              </div>

              <div className="text-center" style={{ width: 240 }}>
                <span
                  contentEditable={true}
                  suppressContentEditableWarning={true}
                  style={{ fontSize: 17 }}
                >
                  (A. N. Siddiqui)
                </span>
                <div
                  style={{ fontWeight: 700, color: "#17408B", fontSize: 21 }}
                >
                  Director
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ background: "#e5e7eb", minHeight: "100vh", padding: "0" }}>
      {/* Back Button (hidden on print) */}
      <button
        onClick={() => navigate(-1)}
        style={{
          position: "fixed",
          top: 20,
          left: 20,
          zIndex: 1000,
          background: "#fff",
          color: "#2563eb",
          border: "1px solid #2563eb",
          borderRadius: "6px",
          padding: "8px 18px",
          fontWeight: 600,
          fontSize: "16px",
          cursor: "pointer",
          boxShadow: "0 2px 8px #0001",
          transition: "background 0.2s",
          display: "block",
        }}
        className="no-print"
      >
        ← Back
      </button>
      {/* Print Button */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          maxWidth: "1200px",
          margin: "0 auto 5px auto",
          paddingRight: "30px",
          paddingTop: "10px",
        }}
      >
        <button
          onClick={() => window.print()}
          style={{
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            padding: "10px 22px",
            fontWeight: 600,
            fontSize: "17px",
            cursor: "pointer",
            boxShadow: "0 2px 8px #0001",
            transition: "background 0.2s",
            marginBottom: "10px",
          }}
        >
          Print Certificates
        </button>
      </div>
      {trainees.length > 0 ? (
        trainees.map((trainee, idx) => (
          <div
            key={trainee.ticket_no}
            className="certificate-preview-outer"
            style={
              idx !== trainees.length - 1
                ? { pageBreakAfter: "always", margin: "5px auto" }
                : { margin: "5px auto" }
            }
          >
            <CertificateTemplate trainee={trainee} />
          </div>
        ))
      ) : (
        <div style={{ textAlign: "center", marginTop: 80, fontSize: 22 }}>
          Loading...
        </div>
      )}
      <style jsx="true">{`
        @media print {
          @page {
            size: landscape;
            margin: 0mm !important;
          }
          html,
          body {
            padding: 0 !important;
            margin: 0 !important;
            background: #fff !important;
            height: 100% !important;
            width: 100% !important;
          }
          body > div {
            padding: 0 !important;
            margin: 0 !important;
          }
          .certificate-preview-outer {
            background: #fff !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            page-break-inside: avoid !important;
          }
          .certificate-preview-outer:not(:first-child) {
            margin-top: 10mm !important;
          }
          .certificate {
            width: 270mm !important;
            min-height: 190mm !important;
            max-height: 200mm !important;
            height: auto !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            margin: 0 auto !important;
            padding: 0 !important;
            transform: scale(0.98) !important;
            transform-origin: center top !important;
          }
          button {
            display: none !important;
          }
          .certificate-preview-outer {
            page-break-after: always;
            break-after: page;
          }
          .certificate-preview-outer:last-child {
            page-break-after: auto;
            break-after: auto;
          }
          .certificate-preview-outer:first-child {
            margin-top: 0 !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default CertificatePreview;
