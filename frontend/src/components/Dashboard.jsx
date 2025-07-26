import React, { useState, useEffect, Fragment } from "react";
import { RefreshCw, Download } from "lucide-react";
import { useAuth } from "../auth/AuthContext";

class DashboardAPI {
  constructor() {
    this.baseURL = "/api";
  }

  async getStcCandidatesCount() {
    try {
      const response = await fetch(`${this.baseURL}/stc`);
      const data = await response.json();
      return data.success ? data.count || data.data?.length || 0 : 0;
    } catch {
      return 0;
    }
  }
  async getWtcCandidatesCount() {
    try {
      const response = await fetch(`${this.baseURL}/wtc`);
      const data = await response.json();
      return data.success ? data.count || data.data?.length || 0 : 0;
    } catch {
      return 0;
    }
  }
  async getNonRailwayCandidatesCount() {
    try {
      const response = await fetch(`${this.baseURL}/nonrailway`);
      const data = await response.json();
      return data.success ? data.count || data.data?.length || 0 : 0;
    } catch {
      return 0;
    }
  }
  async getCategoriesData() {
    try {
      const [stc, wtc, nonRailway] = await Promise.all([
        this.getStcCandidatesCount(),
        this.getWtcCandidatesCount(),
        this.getNonRailwayCandidatesCount(),
      ]);
      return {
        success: true,
        data: [
          { category: "STC", count: stc, color: "#3b82f6" }, // Blue
          { category: "WTC", count: wtc, color: "#10b981" }, // Green
          { category: "Non-Railway", count: nonRailway, color: "#8b5cf6" }, // Purple
        ],
      };
    } catch {
      return { success: false, data: [] };
    }
  }
  async getDistributionData() {
    try {
      const [stc, wtc, nonRailway] = await Promise.all([
        this.getStcCandidatesCount(),
        this.getWtcCandidatesCount(),
        this.getNonRailwayCandidatesCount(),
      ]);
      const total = stc + wtc + nonRailway;
      if (!total) return { success: true, data: [] };
      return {
        success: true,
        data: [
          {
            name: "STC",
            value: Math.round((stc / total) * 100),
            count: stc,
            color: "#3b82f6", // Blue
          },
          {
            name: "WTC",
            value: Math.round((wtc / total) * 100),
            count: wtc,
            color: "#10b981", // Green
          },
          {
            name: "Non-Railway",
            value: Math.round((nonRailway / total) * 100),
            count: nonRailway,
            color: "#8b5cf6", // Purple
          },
        ],
      };
    } catch {
      return { success: false, data: [] };
    }
  }
  async getOverallStats() {
    try {
      const [stc, wtc, nonRailway] = await Promise.all([
        this.getStcCandidatesCount(),
        this.getWtcCandidatesCount(),
        this.getNonRailwayCandidatesCount(),
      ]);
      // Fetch all STC candidates for more stats
      const stcRes = await fetch(`${this.baseURL}/stc`);
      const stcData = await stcRes.json();
      const stcCandidates =
        stcData.success && Array.isArray(stcData.data) ? stcData.data : [];
      // Designation-wise counts
      const designationCounts = {};
      const batchSet = new Set();
      let resignedCount = 0;
      stcCandidates.forEach((c) => {
        const desig = (c.designation || "").split("-")[0];
        designationCounts[desig] = (designationCounts[desig] || 0) + 1;
        if (c.batch) batchSet.add(c.batch);
        if (c.resignation_status === "yes") resignedCount++;
      });
      return {
        success: true,
        data: {
          totalCandidates: stc + wtc + nonRailway,
          railwayCandidates: stc + wtc,
          nonRailwayCandidates: nonRailway,
          stcCandidates: stc,
          wtcCandidates: wtc,
          designationCounts,
          totalBatches: batchSet.size,
          resignedCount,
        },
      };
    } catch {
      return { success: false, data: null };
    }
  }
  async getAllUnits() {
    try {
      const response = await fetch(`${this.baseURL}/stc`);
      const data = await response.json();
      if (!data.success || !Array.isArray(data.data)) return [];
      const unitCounts = {};
      data.data.forEach((c) => {
        const unit = c.unit || "Unknown";
        unitCounts[unit] = (unitCounts[unit] || 0) + 1;
      });
      // Sort all units by count desc
      return Object.entries(unitCounts)
        .sort((a, b) => b[1] - a[1])
        .map(([unit, count], i) => ({
          unit,
          count,
          color: ["#3b82f6", "#10b981", "#8b5cf6", "#f59e42", "#ef4444"][i % 5],
        }));
    } catch {
      return [];
    }
  }
  async getRecentActivities() {
    try {
      const [stcRes, wtcRes, nonRailwayRes] = await Promise.all([
        fetch(`${this.baseURL}/stc`).catch(() => ({
          json: () => ({ success: false, data: [] }),
        })),
        fetch(`${this.baseURL}/wtc`).catch(() => ({
          json: () => ({ success: false, data: [] }),
        })),
        fetch(`${this.baseURL}/nonrailway`).catch(() => ({
          json: () => ({ success: false, data: [] }),
        })),
      ]);
      const [stcData, wtcData, nonRailwayData] = await Promise.all([
        stcRes.json(),
        wtcRes.json(),
        nonRailwayRes.json(),
      ]);
      const activities = [];
      if (stcData.success && stcData.data) {
        (Array.isArray(stcData.data) ? stcData.data.slice(0, 3) : []).forEach(
          (c, i) =>
            activities.push({
              id: `stc-${c.id || i}`,
              activity: "STC candidate registered",
              candidate: `${c.name || "Unknown"} - ${c.ticket_no || "N/A"}`,
              time: this.getTimeAgo(c.created_at),
              icon: "�", // Blue circle
              category: "STC",
            })
        );
      }
      if (wtcData.success && wtcData.data) {
        (Array.isArray(wtcData.data) ? wtcData.data.slice(0, 3) : []).forEach(
          (c, i) =>
            activities.push({
              id: `wtc-${c.id || i}`,
              activity: "WTC candidate registered",
              candidate: `${c.name || "Unknown"} - ${c.ticket_no || "N/A"}`,
              time: this.getTimeAgo(c.created_at),
              icon: "�", // Green circle
              category: "WTC",
            })
        );
      }
      if (nonRailwayData.success && nonRailwayData.data) {
        (Array.isArray(nonRailwayData.data)
          ? nonRailwayData.data.slice(0, 2)
          : []
        ).forEach((c, i) =>
          activities.push({
            id: `nonrailway-${c.id || i}`,
            activity: "Non-Railway application submitted",
            candidate: `${c.name || "Unknown"} - ${c.ticket_no || "N/A"}`,
            time: this.getTimeAgo(c.created_at),
            icon: "�", // Purple circle
            category: "Non-Railway",
          })
        );
      }
      return { success: true, data: activities.slice(0, 8) };
    } catch {
      return { success: false, data: [] };
    }
  }
  getTimeAgo(dateString) {
    if (!dateString) return "Recently";
    let date;
    if (
      typeof dateString === "string" &&
      dateString.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)
    ) {
      date = new Date(dateString.replace(" ", "T") + "Z");
    } else {
      date = new Date(dateString);
    }
    if (isNaN(date.getTime())) return "Recently";
    const diff = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
    if (diff < 2592000) return `${Math.floor(diff / 86400)} days ago`;
    return date.toLocaleDateString();
  }
}

// Utility: Export array of objects as CSV
// function exportToCSV(data, filename = "export.csv") {
//   if (!data || !data.length) return;
//   const keys = Object.keys(data[0]);
//   const csvRows = [
//     keys.join(","),
//     ...data.map((row) =>
//       keys
//         .map((k) =>
//           ("" + (row[k] ?? ""))
//             .replace(/"/g, '""')
//             .replace(/\n/g, " ")
//             .replace(/\r/g, " ")
//         )
//         .map((v) => `"${v}"`)
//         .join(",")
//     ),
//   ];
//   const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
//   const url = window.URL.createObjectURL(blob);
//   const a = document.createElement("a");
//   a.href = url;
//   a.download = filename;
//   document.body.appendChild(a);
//   a.click();
//   window.URL.revokeObjectURL(url);
//   document.body.removeChild(a);
// }

// Add a SkeletonLoader component for better loading states
const SkeletonLoader = ({ type, count = 1 }) => {
  const items = Array(count).fill(0);

  if (type === "card") {
    return (
      <>
        {items.map((_, idx) => (
          <div key={idx} className="bg-white rounded-md shadow-sm border border-gray-200 p-4 animate-pulse h-[84px]">
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3 mt-4"></div>
          </div>
        ))}
      </>
    );
  }

  if (type === "bar") {
    return (
      <div className="space-y-3 min-h-[300px]">
        {items.map((_, idx) => (
          <div key={idx} className="flex items-center space-x-3">
            <div className="w-24 h-4 bg-gray-200 rounded"></div>
            <div className="flex-1 h-6 bg-gray-200 rounded-full"></div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "table-row") {
    return (
      <>
        {items.map((_, idx) => (
          <tr key={idx} className="border-b">
            <td className="px-3 py-2"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
            <td className="px-3 py-2"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
            <td className="px-3 py-2"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
            <td className="px-3 py-2"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
            <td className="px-3 py-2"><div className="h-4 bg-gray-200 rounded w-28"></div></td>
          </tr>
        ))}
      </>
    );
  }

  return null;
};

// Enhanced SimpleBarChart: supports large data, show top N, scrollable
const SimpleBarChart = ({
  data,
  title,
  onBarClick,
  maxBars = 20,
  showAll: showAllProp,
  isLoading = false
}) => {
  const [showAll, setShowAll] = useState(false);

  // Reserve fixed height for chart container to prevent layout shift
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 text-center">
        {title}
      </h3>
      <div className="min-h-[300px]">
        {isLoading ? (
          <SkeletonLoader type="bar" count={5} />
        ) : !data || data.length === 0 ? (
          <div className="text-center text-gray-400 py-8">No data available</div>
        ) : (
          <>
            <div
              className="space-y-3 overflow-y-auto"
              style={{
                maxHeight: 400,
                height: Math.min(data.length * 40, 400)
              }}
            >
              {(showAll || showAllProp || data.length <= maxBars ? [...data].sort((a, b) => b.count - a.count) : [...data].sort((a, b) => b.count - a.count).slice(0, maxBars)).map((item, idx) => (
                <div
                  key={idx}
                  className={`flex items-center space-x-3 rounded-lg transition hover:bg-orange-50 ${onBarClick ? "cursor-pointer" : ""
                    }`}
                  onClick={onBarClick ? () => onBarClick(item) : undefined}
                  title={item.category}
                >
                  <div className="w-24 text-sm font-medium text-gray-700 text-right truncate">
                    {item.category}
                  </div>
                  <div className="flex-1 bg-gray-100 rounded-full h-6 relative">
                    <div
                      className="h-6 rounded-full flex items-center justify-end pr-2 text-white text-xs font-medium transition-all"
                      style={{
                        backgroundColor: item.color,
                        width: `${(item.count / Math.max(...data.map((d) => d.count), 1)) * 100}%`,
                        minWidth: "40px",
                      }}
                    >
                      {item.count}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {data.length > maxBars && (
              <div className="text-center">
                <button
                  className="text-xs text-orange-600 underline hover:text-orange-800"
                  onClick={() => setShowAll((v) => !v)}
                >
                  {showAll ? "Show Top 20" : `Show All (${data.length})`}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Enhanced SimplePieChart: supports large data, scrollable legend
const SimplePieChart = ({
  data,
  title,
  onLegendClick,
  maxSlices = 20,
  showAll: showAllProp,
  isLoading = false
}) => {
  const [showAll, setShowAll] = useState(false);

  // Reserve fixed height for chart container to prevent layout shift
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 text-center">
        {title}
      </h3>
      <div className="min-h-[300px]">
        {isLoading ? (
          <div className="flex justify-center items-center h-[300px]">
            <div className="w-[200px] h-[200px] rounded-full bg-gray-200 animate-pulse"></div>
          </div>
        ) : !data || data.length === 0 ? (
          <div className="text-center text-gray-400 py-8">No data available</div>
        ) : (
          <div className="flex items-center justify-center space-x-8">
            <div className="relative">
              <svg width="200" height="200" className="transform -rotate-90">
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="2"
                />
                {(() => {
                  const displayData = showAll || showAllProp || data.length <= maxSlices
                    ? [...data].sort((a, b) => b.count - a.count)
                    : [...data].sort((a, b) => b.count - a.count).slice(0, maxSlices);
                  const total = displayData.reduce((sum, i) => sum + i.count, 0) || 1;
                  let currentAngle = 0;

                  return displayData.map((item, idx) => {
                    const angle = (item.count / total) * 360;
                    const startAngle = currentAngle;
                    const endAngle = currentAngle + angle;
                    const x1 = 100 + 80 * Math.cos((startAngle * Math.PI) / 180);
                    const y1 = 100 + 80 * Math.sin((startAngle * Math.PI) / 180);
                    const x2 = 100 + 80 * Math.cos((endAngle * Math.PI) / 180);
                    const y2 = 100 + 80 * Math.sin((endAngle * Math.PI) / 180);
                    const largeArcFlag = angle > 180 ? 1 : 0;
                    const pathData = [
                      `M 100 100`,
                      `L ${x1} ${y1}`,
                      `A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                      `Z`,
                    ].join(" ");
                    currentAngle += angle;
                    return (
                      <path
                        key={idx}
                        d={pathData}
                        fill={item.color}
                        stroke="white"
                        strokeWidth="2"
                      />
                    );
                  });
                })()}
              </svg>
            </div>
            <div
              className="space-y-3 overflow-y-auto"
              style={{
                maxHeight: 300,
                height: Math.min((showAll || showAllProp || data.length <= maxSlices ? data.length : maxSlices) * 30, 300),
                minWidth: 180,
              }}
            >
              {(showAll || showAllProp || data.length <= maxSlices ? [...data].sort((a, b) => b.count - a.count) : [...data].sort((a, b) => b.count - a.count).slice(0, maxSlices)).map((item, idx) => (
                <div
                  key={idx}
                  className={`flex items-center space-x-3 rounded transition hover:bg-orange-50 ${onLegendClick ? "cursor-pointer" : ""
                    }`}
                  onClick={onLegendClick ? () => onLegendClick(item) : undefined}
                  title={item.name}
                >
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <div className="flex-1 truncate">
                    <div className="text-sm font-medium text-orange-900 truncate">
                      {item.name}
                    </div>
                    <div className="text-xs text-orange-500">
                      {item.value}% ({item.count})
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {data && data.length > maxSlices && (
        <div className="text-center">
          <button
            className="text-xs text-orange-600 underline hover:text-orange-800"
            onClick={() => setShowAll((v) => !v)}
          >
            {showAll ? "Show Top 20" : `Show All (${data.length})`}
          </button>
        </div>
      )}
    </div>
  );
};

function StatCard({
  title,
  value,
  color = "border-l-blue-500",
  textColor = "text-gray-700",
  onClick,
  active,
  isLoading = false
}) {
  return (
    <div
      className={`bg-white rounded-md shadow-sm border border-gray-200 p-4 ${onClick ? "cursor-pointer" : ""} transition-all duration-150 flex flex-col justify-between ${color} border-l-4 ${active ? "ring-2 ring-blue-500" : ""} h-[84px]`}
      onClick={onClick}
    >
      <div className={`text-sm font-semibold ${textColor}`}>{title}</div>
      <div className="text-3xl font-bold text-gray-800 mt-2">
        {isLoading ? (
          <div className="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
        ) : (
          value
        )}
      </div>
    </div>
  );
}

// Utility to get sparing date for each type
function getSparingDate(item, type) {
  if (type === "stc")
    return (
      item.date_of_sparing ||
      item.dateOfSparing ||
      item.sparingDate ||
      item.sparing_date ||
      item.sparing_on ||
      ""
    );
  if (type === "wtc")
    return (
      item.date_of_sparing ||
      item.dateOfSparing ||
      item.sparingDate ||
      item.sparing_on ||
      ""
    );
  if (type === "nonrailway")
    return (
      item.date_of_sparing ||
      item.sparing_on ||
      item.sparingDate ||
      item.dateOfSparing ||
      ""
    );
  return "";
}

function Dashboard() {
  const [categoriesData, setCategoriesData] = useState([]);
  const [distributionData, setDistributionData] = useState([]);
  const [overallStats, setOverallStats] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [allUnits, setAllUnits] = useState([]);
  const [selectedStat, setSelectedStat] = useState(null);
  const [statDetails, setStatDetails] = useState([]);
  const [statDetailsTitle, setStatDetailsTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lineTrainingStats, setLineTrainingStats] = useState([]);
  const [selectedLineTraining, setSelectedLineTraining] = useState(null);
  const [lineTrainingDetails, setLineTrainingDetails] = useState([]);
  const [lineTrainingDetailsTitle, setLineTrainingDetailsTitle] = useState("");
  const { userRole } = useAuth();
  const dashboardAPI = React.useMemo(() => new DashboardAPI(), []);

  const loadDashboardData = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [cat, dist, stats, acts, units] = await Promise.all([
        dashboardAPI.getCategoriesData(),
        dashboardAPI.getDistributionData(),
        dashboardAPI.getOverallStats(),
        dashboardAPI.getRecentActivities(),
        dashboardAPI.getAllUnits(),
      ]);
      if (cat.success) setCategoriesData(cat.data);
      if (dist.success) setDistributionData(dist.data);
      if (stats.success) setOverallStats(stats.data);
      if (acts.success) setRecentActivities(acts.data);
      setAllUnits(units);
    } catch {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, [dashboardAPI]);

  useEffect(() => {
    loadDashboardData();
    loadLineTrainingStats();
  }, [loadDashboardData]);

  // Fetch line training stats (robust: handle both activityCentre/activity_centre, ticketNumbers/ticket_no)
  const loadLineTrainingStats = async () => {
    try {
      const res = await fetch("/api/line-trainings");
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        // Defensive: handle both possible keys and fallback
        const stats = {};
        data.data.forEach((prog, idx) => {
          // DEBUG: log each program object
          console.log("Line Training program", idx, prog);
          const key =
            prog.activityCentre ||
            prog.activity_centre ||
            prog.activitycenter ||
            prog.activity_center ||
            "Unknown";
          // Accept ticketNumbers, ticket_no, or ticketNos
          let tickets =
            prog.ticketNumbers ||
            prog.ticket_no ||
            prog.ticketNos ||
            prog.tickets ||
            [];
          if (!Array.isArray(tickets)) {
            // If single string, wrap as array
            tickets = [tickets];
          }
          if (!stats[key]) {
            stats[key] = { activityCentre: key, count: 0, programs: [] };
          }
          stats[key].count += tickets.length;
          // Patch program object to always have ticketNumbers and activityCentre for downstream use
          stats[key].programs.push({
            ...prog,
            ticketNumbers: tickets,
            activityCentre: key,
          });
        });
        setLineTrainingStats(Object.values(stats));
      } else {
        setLineTrainingStats([]);
      }
    } catch (e) {
      console.error("Error fetching line training stats:", e);
      setLineTrainingStats([]);
    }
  };

  const handleExportData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/export-database");
      if (!response.ok) throw new Error("Failed to export database");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `STVT_Database_${new Date()
        .toISOString()
        .slice(0, 10)}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      alert("Database exported successfully!");
    } catch (error) {
      alert(`Failed to export database: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // CSV Export handler for modal (move inside Dashboard)
  // REMOVE this function if not used elsewhere
  // const handleExportCSV = () => {
  //   if (statDetailsTitle && statDetails.length) {
  //     exportToCSV(
  //       statDetails,
  //       `${statDetailsTitle.replace(/\s+/g, "_")}_${new Date()
  //         .toISOString()
  //         .slice(0, 10)}.csv`
  //     );
  //   } else if (lineTrainingDetailsTitle && lineTrainingDetails.length) {
  //     exportToCSV(
  //       lineTrainingDetails,
  //       `${lineTrainingDetailsTitle.replace(/\s+/g, "_")}_${new Date()
  //         .toISOString()
  //         .slice(0, 10)}.csv`
  //     );
  //   }
  // };

  // Helper to fetch details for a stat
  const fetchStatDetails = async (type, value) => {
    setStatDetails([]);
    setStatDetailsTitle("");
    setIsModalOpen(true);
    let url = "";
    let title = "";
    if (type === "Railway Candidates") {
      // Show all STC + WTC candidates
      url = "/api/stc";
      title = "Railway Candidates (STC & WTC)";
    } else if (type === "Non-Railway Candidates") {
      url = "/api/nonrailway";
      title = "Non-Railway Candidates";
    } else if (type === "STC") {
      url = "/api/stc";
      title = "STC Candidates";
    } else if (type === "WTC") {
      url = "/api/wtc";
      title = "WTC Candidates";
    } else if (type === "Resigned Candidates") {
      url = "/api/stc";
      title = "Resigned Candidates (STC)";
    } else if (type === "Total Candidates") {
      // Fetch all three and merge
      title = "All Candidates (STC, WTC, Non-Railway)";
      try {
        const [stcRes, wtcRes, nonRailwayRes] = await Promise.all([
          fetch("/api/stc"),
          fetch("/api/wtc"),
          fetch("/api/nonrailway"),
        ]);
        const [stcData, wtcData, nonRailwayData] = await Promise.all([
          stcRes.json(),
          wtcRes.json(),
          nonRailwayRes.json(),
        ]);
        let candidates = [];
        if (stcData.success && Array.isArray(stcData.data)) {
          candidates = candidates.concat(
            stcData.data.map((c) => ({ ...c, _source: "STC" }))
          );
        }
        if (wtcData.success && Array.isArray(wtcData.data)) {
          candidates = candidates.concat(
            wtcData.data.map((c) => ({ ...c, _source: "WTC" }))
          );
        }
        if (nonRailwayData.success && Array.isArray(nonRailwayData.data)) {
          candidates = candidates.concat(
            nonRailwayData.data.map((c) => ({ ...c, _source: "Non-Railway" }))
          );
        }
        setStatDetailsTitle(title);
        setStatDetails(candidates);
        return;
      } catch {
        setStatDetailsTitle(title);
        setStatDetails([]);
        return;
      }
    } else if (type === "unit") {
      url = "/api/stc/filter/unit/" + encodeURIComponent(value);
      title = `Candidates in Unit: ${value}`;
    } else if (type === "designation") {
      url = "/api/stc/filter/designation/" + encodeURIComponent(value);
      title = `Candidates with Designation: ${value}`;
    }
    if (!url) return;
    try {
      const res = await fetch(url);
      const data = await res.json();
      let candidates = [];
      if (data.success && Array.isArray(data.data)) {
        candidates = data.data;
        // Filter for resigned if needed
        if (type === "Resigned Candidates") {
          candidates = candidates.filter((c) => c.resignation_status === "yes");
        }
        // For "Railway Candidates", merge STC and WTC
        if (type === "Railway Candidates") {
          const wtcRes = await fetch("/api/wtc");
          const wtcData = await wtcRes.json();
          if (wtcData.success && Array.isArray(wtcData.data)) {
            candidates = [
              ...candidates.map((c) => ({ ...c, _source: "STC" })),
              ...wtcData.data.map((c) => ({ ...c, _source: "WTC" })),
            ];
          }
        }
      }
      setStatDetailsTitle(title);
      setStatDetails(candidates);
    } catch {
      setStatDetailsTitle(title);
      setStatDetails([]);
    }
  };

  // Fetch details for a line training activity centre
  const fetchLineTrainingDetails = (activityCentre) => {
    setLineTrainingDetails([]);
    setLineTrainingDetailsTitle("");
    setIsModalOpen(true);
    setSelectedLineTraining(activityCentre);
    // Find all programs for this centre
    const progs =
      lineTrainingStats.find((s) => s.activityCentre === activityCentre)
        ?.programs || [];
    // Flatten all ticket numbers with program info
    const details = [];
    progs.forEach((prog) => {
      (prog.ticketNumbers || []).forEach((ticket_no) => {
        details.push({
          ticket_no,
          activityCentre: prog.activityCentre,
          startDate: prog.startDate,
          endDate: prog.endDate,
          status: prog.status,
        });
      });
    });
    setLineTrainingDetailsTitle(`Line Training Candidates - ${activityCentre}`);
    setLineTrainingDetails(details);
  };

  const [allCandidates, setAllCandidates] = useState({
    stc: [],
    wtc: [],
    nonrailway: [],
  });
  const [activeSection, setActiveSection] = useState(null);
  const [activeCandidates, setActiveCandidates] = useState([]);
  const [fetchError, setFetchError] = useState(null);

  // Fetch all data for STC, WTC, Non-Railway and parse, handle error
  useEffect(() => {
    loadDashboardData();
    loadLineTrainingStats();
    loadAllCandidates();
  }, [loadDashboardData]);

  const loadAllCandidates = async () => {
    setFetchError(null);
    try {
      const [stcRes, wtcRes, nonRailwayRes] = await Promise.all([
        fetch("/api/stc"),
        fetch("/api/wtc"),
        fetch("/api/nonrailway"),
      ]);
      if (!stcRes.ok || !wtcRes.ok || !nonRailwayRes.ok) {
        throw new Error("Failed to fetch one or more candidate datasets");
      }
      const [stcData, wtcData, nonRailwayData] = await Promise.all([
        stcRes.json(),
        wtcRes.json(),
        nonRailwayRes.json(),
      ]);
      setAllCandidates({
        stc: Array.isArray(stcData.data) ? stcData.data : [],
        wtc: Array.isArray(wtcData.data) ? wtcData.data : [],
        nonrailway: Array.isArray(nonRailwayData.data)
          ? nonRailwayData.data
          : [],
      });
    } catch (err) {
      setAllCandidates({ stc: [], wtc: [], nonrailway: [] });
      setFetchError("Failed to fetch candidate data. Please try again." + err);
    }
  };

  // Compute active candidates for each section
  const getActiveCandidates = (type) => {
    const arr = allCandidates[type] || [];
    // Today's date at 00:00:00
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return arr.filter((item) => {
      const dateStr = getSparingDate(item, type);
      if (!dateStr) return false;
      // Parse date string (support both yyyy-mm-dd and dd-mm-yyyy)
      let sparingDate = new Date(dateStr);
      if (isNaN(sparingDate)) {
        // Try dd-mm-yyyy
        const parts = dateStr.split("-");
        if (parts.length === 3) {
          sparingDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
        }
      }
      sparingDate.setHours(0, 0, 0, 0);
      // Only include if sparing date is today or in the future
      return (
        sparingDate >= today &&
        (!item.resignation_status || item.resignation_status !== "yes")
      );
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-20">
        <div className="max-w-9xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Dashboard - Supervisor Training Centre
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Ministry of Railways, Government of India
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={loadDashboardData}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center transition-colors text-sm font-medium"
                disabled={loading}
              >
                <RefreshCw className={`mr-2 w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Loading...' : 'Refresh'}
              </button>
              {(userRole === "admin" || userRole === "master") && (
                <button
                  onClick={handleExportData}
                  className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-md flex items-center transition-colors text-sm font-medium"
                  disabled={loading}
                >
                  <Download className="mr-2 w-4 h-4" />
                  Export Data
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="p-6">
        <div className="max-w-9xl mx-auto">
          {/* Main Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 min-h-[120px]">
            {loading ? (
              <>
                <SkeletonLoader type="card" count={4} />
              </>
            ) : overallStats ? (
              <>
                <StatCard
                  title="Total Candidates"
                  value={overallStats.totalCandidates}
                  onClick={() => {
                    setSelectedStat("Total Candidates");
                    fetchStatDetails("Total Candidates");
                  }}
                  active={selectedStat === "Total Candidates"}
                  color="border-l-blue-500"
                  textColor="text-blue-800"
                />
                <StatCard
                  title="Railway Candidates"
                  value={overallStats.railwayCandidates}
                  onClick={() => {
                    setSelectedStat("Railway Candidates");
                    fetchStatDetails("Railway Candidates");
                  }}
                  active={selectedStat === "Railway Candidates"}
                  color="border-l-green-500"
                  textColor="text-green-800"
                />
                <StatCard
                  title="Non-Railway Candidates"
                  value={overallStats.nonRailwayCandidates}
                  onClick={() => {
                    setSelectedStat("Non-Railway Candidates");
                    fetchStatDetails("Non-Railway Candidates");
                  }}
                  active={selectedStat === "Non-Railway Candidates"}
                  color="border-l-purple-500"
                  textColor="text-purple-800"
                />
                <StatCard
                  title="Resigned Candidates"
                  value={overallStats.resignedCount}
                  onClick={() => {
                    setSelectedStat("Resigned Candidates");
                    fetchStatDetails("Resigned Candidates");
                  }}
                  active={selectedStat === "Resigned Candidates"}
                  color="border-l-red-500"
                  textColor="text-red-800"
                />
              </>
            ) : (
              <div className="col-span-4 text-center py-8 text-gray-500">
                No stats available
              </div>
            )}
          </div>

          {/* Designation-wise Stats */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              STC Designation-wise Candidates
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 min-h-[100px]">
              {loading ? (
                <SkeletonLoader type="card" count={8} />
              ) : overallStats ? (
                <>
                  {Object.entries(overallStats.designationCounts || {}).map(
                    ([desig, count]) => (
                      <StatCard
                        key={desig}
                        title={desig}
                        value={count}
                        color="border-l-gray-400"
                        textColor="text-gray-700"
                        onClick={() => {
                          setSelectedStat("designation:" + desig);
                          fetchStatDetails("designation", desig);
                        }}
                        active={selectedStat === "designation:" + desig}
                      />
                    )
                  )}
                  <StatCard
                    title="Total STC"
                    value={overallStats.stcCandidates}
                    color="border-l-teal-500"
                    textColor="text-teal-800"
                    onClick={() => {
                      setSelectedStat("STC");
                      fetchStatDetails("STC");
                    }}
                    active={selectedStat === "STC"}
                  />
                </>
              ) : (
                <div className="col-span-8 text-center py-8 text-gray-500">
                  No designation stats available
                </div>
              )}
            </div>
          </div>

          {/* Category and Pie Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 min-h-[400px]">
              <SimpleBarChart
                data={categoriesData}
                title="STC, WTC & Non-Railway Categories"
                onBarClick={(item) => {
                  setSelectedStat(item.category);
                  if (item.category === "STC" || item.category === "WTC") {
                    fetchStatDetails(item.category);
                  } else if (item.category === "Non-Railway") {
                    fetchStatDetails("Non-Railway Candidates");
                  }
                }}
                isLoading={loading}
              />
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 min-h-[400px]">
              <SimplePieChart
                data={distributionData}
                title="Distribution (Pie Chart)"
                onLegendClick={(item) => {
                  setSelectedStat(item.name);
                  if (item.name === "Non-Railway") {
                    fetchStatDetails("Non-Railway Candidates");
                  } else {
                    fetchStatDetails(item.name);
                  }
                }}
                isLoading={loading}
              />
            </div>
          </div>

          {/* All Units by Candidate Count */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              All Units by Candidate Count (STC)
            </h2>
            <div className="min-h-[200px]">
              {loading ? (
                <div className="space-y-3">
                  {Array(5).fill(0).map((_, idx) => (
                    <div key={idx} className="flex items-center space-x-3 p-2">
                      <div className="w-32 h-5 bg-gray-200 rounded animate-pulse"></div>
                      <div className="flex-1 h-6 bg-gray-200 rounded-full animate-pulse"></div>
                    </div>
                  ))}
                </div>
              ) : allUnits.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  No data available
                </div>
              ) : (
                <div className="space-y-3">
                  {allUnits.map((item, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center space-x-3 cursor-pointer p-2 rounded-md hover:bg-gray-100 ${selectedStat === "unit:" + item.unit
                        ? "ring-2 ring-blue-500 bg-blue-50"
                        : ""
                        }`}
                      onClick={() => {
                        setSelectedStat("unit:" + item.unit);
                        fetchStatDetails("unit", item.unit);
                      }}
                    >
                      <div className="w-32 text-sm font-medium text-gray-700 text-right">
                        {item.unit}
                      </div>
                      <div className="flex-1 bg-gray-100 rounded-full h-6 relative">
                        <div
                          className="h-6 rounded-full flex items-center justify-end pr-2 text-white text-xs font-medium"
                          style={{
                            backgroundColor: item.color,
                            width: `${(item.count /
                              Math.max(...allUnits.map((d) => d.count))) *
                              100
                              }%`,
                            minWidth: "40px",
                          }}
                        >
                          {item.count}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Line Training Stats (by Activity Centre) */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Line Training Stats (by Activity Centre)
            </h2>
            <div className="min-h-[100px]">
              {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                  <SkeletonLoader type="card" count={8} />
                </div>
              ) : lineTrainingStats.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  No data available
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                  {lineTrainingStats.map((item) => (
                    <StatCard
                      key={item.activityCentre}
                      title={item.activityCentre}
                      value={item.count}
                      color="border-l-cyan-500"
                      textColor="text-cyan-800"
                      onClick={() => {
                        fetchLineTrainingDetails(item.activityCentre);
                      }}
                      active={selectedLineTraining === item.activityCentre}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Active Candidates Sections */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Active Candidates by Category
            </h2>
            {fetchError && (
              <div className="mb-4 text-red-600 font-semibold">
                {fetchError}
                <button
                  className="ml-4 px-3 py-1 bg-orange-200 rounded text-orange-900"
                  onClick={loadAllCandidates}
                >
                  Retry
                </button>
              </div>
            )}
            <div className="flex flex-wrap gap-4 mb-4">
              <button
                className={`px-4 py-2 rounded-md font-semibold border-2 transition text-sm ${activeSection === "stc"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-blue-700 border-blue-300 hover:bg-blue-50"
                  }`}
                onClick={() => {
                  setActiveSection("stc");
                  setActiveCandidates(getActiveCandidates("stc"));
                }}
              >
                STC Active ({getActiveCandidates("stc").length})
              </button>
              <button
                className={`px-4 py-2 rounded-md font-semibold border-2 transition text-sm ${activeSection === "wtc"
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-white text-green-700 border-green-300 hover:bg-green-50"
                  }`}
                onClick={() => {
                  setActiveSection("wtc");
                  setActiveCandidates(getActiveCandidates("wtc"));
                }}
              >
                WTC Active ({getActiveCandidates("wtc").length})
              </button>
              <button
                className={`px-4 py-2 rounded-md font-semibold border-2 transition text-sm ${activeSection === "nonrailway"
                  ? "bg-purple-600 text-white border-purple-600"
                  : "bg-white text-purple-700 border-purple-300 hover:bg-purple-50"
                  }`}
                onClick={() => {
                  setActiveSection("nonrailway");
                  setActiveCandidates(getActiveCandidates("nonrailway"));
                }}
              >
                Non-Railway Active ({getActiveCandidates("nonrailway").length})
              </button>
            </div>
            <div className="overflow-auto border rounded-lg bg-white min-h-[200px]" style={{ maxHeight: "50vh" }}>
              <table className="min-w-full text-xs md:text-sm border-collapse">
                <thead className="sticky top-0 bg-gray-100 z-10">
                  <tr>
                    <th className="px-3 py-2 border-b text-left font-semibold text-gray-600">Ticket No</th>
                    <th className="px-3 py-2 border-b text-left font-semibold text-gray-600">Name</th>
                    <th className="px-3 py-2 border-b text-left font-semibold text-gray-600">Designation</th>
                    <th className="px-3 py-2 border-b text-left font-semibold text-gray-600">Unit</th>
                    <th className="px-3 py-2 border-b text-left font-semibold text-gray-600">Date of Sparing</th>
                  </tr>
                </thead>
                <tbody>
                  {!activeSection ? (
                    <tr>
                      <td colSpan={5} className="text-center text-gray-400 py-8">
                        Select a category to view active candidates.
                      </td>
                    </tr>
                  ) : activeCandidates.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center text-gray-400 py-8">
                        No active candidates found.
                      </td>
                    </tr>
                  ) : (
                    activeCandidates.map((c, i) => (
                      <tr
                        key={c.ticket_no || c.ticketNo || c.id || i}
                        className="hover:bg-gray-50 transition border-b"
                      >
                        <td
                          className="px-3 py-2 text-gray-700 truncate max-w-[120px]"
                          title={c.ticket_no || c.ticketNo || c.id}
                        >
                          {c.ticket_no || c.ticketNo || c.id}
                        </td>
                        <td
                          className="px-3 py-2 text-gray-700 truncate max-w-[160px]"
                          title={c.name}
                        >
                          {c.name}
                        </td>
                        <td
                          className="px-3 py-2 text-gray-700 truncate max-w-[120px]"
                          title={c.designation}
                        >
                          {c.designation}
                        </td>
                        <td
                          className="px-3 py-2 text-gray-700 truncate max-w-[120px]"
                          title={c.unit}
                        >
                          {c.unit}
                        </td>
                        <td
                          className="px-3 py-2 text-gray-700 truncate max-w-[120px]"
                          title={getSparingDate(c, activeSection)}
                        >
                          {getSparingDate(c, activeSection)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Stat Details Modal/Section */}
          {isModalOpen && (statDetailsTitle || lineTrainingDetailsTitle) && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-all"
              style={{ backdropFilter: "blur(3px)" }}
            >
              <div
                className="relative bg-white rounded-lg shadow-xl border border-gray-200 p-6 max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col"
                style={{ minHeight: "50vh" }}
              >
                <div className="flex justify-between items-center mb-4 pb-4 border-b">
                  <h3 className="text-xl font-semibold text-gray-800 truncate max-w-[70vw]">
                    {statDetailsTitle || lineTrainingDetailsTitle}
                  </h3>
                  <div className="flex space-x-2">
                    <button
                      className="text-gray-500 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md transition text-sm"
                      onClick={() => {
                        setStatDetails([]);
                        setStatDetailsTitle("");
                        setSelectedStat(null);
                        setLineTrainingDetails([]);
                        setLineTrainingDetailsTitle("");
                        setSelectedLineTraining(null);
                        setIsModalOpen(false);
                      }}
                      title="Close"
                    >
                      Close
                    </button>
                  </div>
                </div>
                <div
                  className="overflow-auto flex-grow border rounded-lg"
                  style={{ background: "#fff", minHeight: "200px" }}
                >
                  <table className="min-w-full text-xs md:text-sm border-collapse">
                    <thead className="sticky top-0 bg-gray-100 z-10">
                      <tr>
                        <th className="px-3 py-2 border-b text-left font-semibold text-gray-600">Ticket No</th>
                        {statDetailsTitle ? (
                          <>
                            <th className="px-3 py-2 border-b text-left font-semibold text-gray-600">Name</th>
                            <th className="px-3 py-2 border-b text-left font-semibold text-gray-600">Designation</th>
                            <th className="px-3 py-2 border-b text-left font-semibold text-gray-600">Unit</th>
                            {statDetails.some((c) => c._source) && (
                              <th className="px-3 py-2 border-b text-left font-semibold text-gray-600">Source</th>
                            )}
                          </>
                        ) : (
                          <>
                            <th className="px-3 py-2 border-b text-left font-semibold text-gray-600">
                              Activity Centre
                            </th>
                            <th className="px-3 py-2 border-b text-left font-semibold text-gray-600">Start Date</th>
                            <th className="px-3 py-2 border-b text-left font-semibold text-gray-600">End Date</th>
                            <th className="px-3 py-2 border-b text-left font-semibold text-gray-600">Status</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {(statDetailsTitle && statDetails.length === 0) ||
                        (lineTrainingDetailsTitle && lineTrainingDetails.length === 0) ? (
                        <tr>
                          <td colSpan={statDetailsTitle ? (statDetails.some((c) => c._source) ? 5 : 4) : 5} className="text-center text-gray-500 py-8">
                            No details available.
                          </td>
                        </tr>
                      ) : statDetailsTitle ? (
                        statDetails.map((c, i) => (
                          <tr
                            key={c.ticket_no || c.ticketNo || c.id || i}
                            className="hover:bg-gray-50 transition border-b"
                          >
                            <td
                              className="px-3 py-2 text-gray-700 truncate max-w-[120px]"
                              title={c.ticket_no || c.ticketNo || c.id}
                            >
                              {c.ticket_no || c.ticketNo || c.id}
                            </td>
                            <td
                              className="px-3 py-2 text-gray-700 truncate max-w-[160px]"
                              title={c.name}
                            >
                              {c.name}
                            </td>
                            <td
                              className="px-3 py-2 text-gray-700 truncate max-w-[120px]"
                              title={c.designation}
                            >
                              {c.designation}
                            </td>
                            <td
                              className="px-3 py-2 text-gray-700 truncate max-w-[120px]"
                              title={c.unit}
                            >
                              {c.unit}
                            </td>
                            {c._source && (
                              <td
                                className="px-3 py-2 text-gray-700 truncate max-w-[120px]"
                                title={c._source}
                              >
                                {c._source}
                              </td>
                            )}
                          </tr>
                        ))
                      ) : (
                        lineTrainingDetails.map((c, i) => (
                          <tr
                            key={c.ticket_no + i}
                            className="hover:bg-gray-50 transition border-b"
                          >
                            <td
                              className="px-3 py-2 text-gray-700 truncate max-w-[120px]"
                              title={c.ticket_no}
                            >
                              {c.ticket_no}
                            </td>
                            <td
                              className="px-3 py-2 text-gray-700 truncate max-w-[160px]"
                              title={c.activityCentre}
                            >
                              {c.activityCentre}
                            </td>
                            <td
                              className="px-3 py-2 text-gray-700 truncate max-w-[120px]"
                              title={c.startDate}
                            >
                              {c.startDate}
                            </td>
                            <td
                              className="px-3 py-2 text-gray-700 truncate max-w-[120px]"
                              title={c.endDate}
                            >
                              {c.endDate}
                            </td>
                            <td
                              className="px-3 py-2 text-gray-700 truncate max-w-[120px]"
                              title={c.status}
                            >
                              {c.status}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Recent Activities */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Recent Activities
              </h3>
            </div>
            <div className="space-y-3 min-h-[200px]" style={{ maxHeight: "80vh", overflow: "auto" }}>
              {loading ? (
                Array(5).fill(0).map((_, idx) => (
                  <div key={idx} className="flex items-start space-x-4 p-3 rounded border-l-4 border-l-gray-200 animate-pulse">
                    <div className="flex-shrink-0 pt-1">
                      <div className="w-3 h-3 rounded-full bg-gray-200"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <div className="h-4 bg-gray-200 rounded w-36"></div>
                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                      </div>
                      <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                ))
              ) : recentActivities.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  No recent activities to display
                </div>
              ) : (
                recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start space-x-4 p-3 rounded hover:bg-gray-50 transition-colors border-l-4"
                    style={{
                      borderLeftColor:
                        activity.category === "STC"
                          ? "#3b82f6" // Blue
                          : activity.category === "WTC"
                            ? "#10b981" // Green
                            : activity.category === "Non-Railway"
                              ? "#8b5cf6" // Purple
                              : "#6b7280", // Gray
                    }}
                  >
                    <div className="flex-shrink-0 pt-1">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor:
                            activity.category === "STC"
                              ? "#3b82f6"
                              : activity.category === "WTC"
                                ? "#10b981"
                                : activity.category === "Non-Railway"
                                  ? "#8b5cf6"
                                  : "#6b7280",
                        }}
                      ></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {activity.activity}
                        </p>
                        <span
                          className={`px-2 py-0.5 text-xs rounded-full font-medium ${activity.category === "STC"
                            ? "bg-blue-100 text-blue-800"
                            : activity.category === "WTC"
                              ? "bg-green-100 text-green-800"
                              : activity.category === "Non-Railway"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                        >
                          {activity.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {activity.candidate}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
      <footer className="bg-gray-800 text-white py-6 mt-8 w-full">
        <div className="max-w-9xl mx-auto px-6">
          <div className="text-center space-y-2">
            <p className="text-sm font-semibold">
              © 2025 Supervisor Training Center, Northern Railways. All Rights
              Reserved.
            </p>
            <p className="text-xs text-gray-400">
              Ministry of Railways, Government of India.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Dashboard;
