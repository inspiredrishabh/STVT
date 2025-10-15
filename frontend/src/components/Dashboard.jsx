import React, { useState, useEffect, Fragment } from "react";
import { RefreshCw, Download, ArrowUp } from "lucide-react";
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

      // Helper function to get the best available date from multiple fields
      const getBestDate = (candidate) => {
        return candidate.created_at ||
          candidate.createdAt ||
          candidate.date_of_joining_stc_wtc_non_railway ||
          candidate.dateOfJoiningStcWtcNonRailway ||
          candidate.updated_at ||
          candidate.updatedAt ||
          null;
      };

      if (stcData.success && stcData.data) {
        (Array.isArray(stcData.data) ? stcData.data.slice(0, 3) : []).forEach(
          (c, i) =>
            activities.push({
              id: `stc-${c.id || i}`,
              activity: "STC Trainee updated",
              candidate: `${c.name || "Unknown"} - ${c.ticket_no || "N/A"}`,
              time: this.getTimeAgo(getBestDate(c)),
              icon: "🔵", // Blue circle
              category: "STC",
            })
        );
      }
      if (wtcData.success && wtcData.data) {
        (Array.isArray(wtcData.data) ? wtcData.data.slice(0, 3) : []).forEach(
          (c, i) =>
            activities.push({
              id: `wtc-${c.id || i}`,
              activity: "WTC Trainee updated",
              candidate: `${c.name || "Unknown"} - ${c.ticket_no || "N/A"}`,
              time: this.getTimeAgo(getBestDate(c)),
              icon: "🟢", // Green circle
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
            activity: "Non-Railway Trainee updated",
            candidate: `${c.name || "Unknown"} - ${c.ticket_no || "N/A"}`,
            time: this.getTimeAgo(getBestDate(c)),
            icon: "🟣", // Purple circle
            category: "Non-Railway",
          })
        );
      }

      // Sort activities by most recent first (try to parse dates for proper sorting)
      activities.sort((a, b) => {
        // If both have "ago" in them, keep current order
        if (a.time.includes('ago') && b.time.includes('ago')) return 0;
        // If one has "ago", it's more recent
        if (a.time.includes('ago')) return -1;
        if (b.time.includes('ago')) return 1;
        // Otherwise keep current order
        return 0;
      });

      return { success: true, data: activities.slice(0, 8) };
    } catch {
      return { success: false, data: [] };
    }
  }
  getTimeAgo(dateString) {
    if (!dateString) {
      // If no date provided, show current date and time
      const now = new Date();
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = now.getFullYear();
      const time = now.toLocaleString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kolkata'
      });
      return `${day}/${month}/${year} at ${time}`;
    }

    let date;

    // Handle various date formats
    if (typeof dateString === "string") {
      // Handle SQL datetime format: 2025-07-30 14:30:00
      if (dateString.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)) {
        date = new Date(dateString.replace(" ", "T"));
      }
      // Handle ISO format: 2025-07-30T14:30:00.000Z
      else if (dateString.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)) {
        date = new Date(dateString);
      }
      // Handle timestamp strings
      else if (dateString.match(/^\d+$/)) {
        date = new Date(parseInt(dateString));
      }
      // Try direct parsing
      else {
        date = new Date(dateString);
      }
    } else if (typeof dateString === "number") {
      // Handle timestamp numbers
      date = new Date(dateString);
    } else {
      date = new Date(dateString);
    }

    // If date parsing failed, show current date and time
    if (isNaN(date.getTime())) {
      const now = new Date();
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = now.getFullYear();
      const time = now.toLocaleString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kolkata'
      });
      return `${day}/${month}/${year} at ${time}`;
    }

    // Always show full date and time in DD/MM/YYYY at HH:MM AM/PM format
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const time = date.toLocaleString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata'
    });

    return `${day}/${month}/${year} at ${time}`;
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
      item.sparingOn ||
      ""
    );
  if (type === "wtc")
    return (
      item.date_of_sparing ||
      item.dateOfSparing ||
      item.sparingDate ||
      item.sparing_date ||
      item.sparing_on ||
      item.sparingOn ||
      ""
    );
  if (type === "nonrailway")
    return (
      item.date_of_sparing ||
      item.sparing_on ||
      item.sparingDate ||
      item.dateOfSparing ||
      item.sparing_date ||
      item.sparingOn ||
      ""
    );
  return "";
}

// Utility to get joining date for each type
function getJoiningDate(item, type) {
  if (type === "stc" || type === "wtc")
    return (
      item.date_of_joining_stc_wtc_non_railway ||
      item.dateOfJoiningStcWtcNonRailway ||
      item.date_of_joining ||
      item.dateOfJoining ||
      item.joining_date ||
      item.joiningDate ||
      ""
    );
  if (type === "nonrailway")
    return (
      item.date_of_joining_stc_wtc_non_railway ||
      item.dateOfJoiningStcWtcNonRailway ||
      item.date_of_joining ||
      item.joining_date ||
      item.dateOfJoining ||
      item.joiningDate ||
      ""
    );
  return "";
}



// Utility to check if a trainee is active (consistent filtering logic)
function isActiveTrainee(trainee, type) {
  // Check resignation status
  if (trainee.resignation_status === "yes") {
    return false;
  }

  // Get sparing date for this trainee type
  const dateStr = getSparingDate(trainee, type);
  if (!dateStr) return false;

  // Parse date string (support both yyyy-mm-dd and dd-mm-yyyy)
  let sparingDate = new Date(dateStr);
  if (isNaN(sparingDate)) {
    // Try dd-mm-yyyy format
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      sparingDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
    }
  }

  if (isNaN(sparingDate)) return false;

  sparingDate.setHours(0, 0, 0, 0);

  // Today's date at 00:00:00
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Only include if sparing date is today or in the future (not expired)
  return sparingDate >= today;
}

function Dashboard() {
  const [overallStats, setOverallStats] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
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
      const [stats, acts] = await Promise.all([
        dashboardAPI.getOverallStats(),
        dashboardAPI.getRecentActivities(),
      ]);
      if (stats.success) setOverallStats(stats.data);
      if (acts.success) setRecentActivities(acts.data);
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
  const fetchStatDetails = async (type, value, activeOnly = false) => {
    setStatDetails([]);
    setStatDetailsTitle("");
    setIsModalOpen(true);
    let url = "";
    let title = "";
    if (type === "Railway Trainees") {
      // Show all STC + WTC candidates
      url = "/api/stc";
      title = activeOnly ? "Railway Trainees (STC & WTC)" : "Railway Trainees (STC & WTC)";
    } else if (type === "Non-Railway Trainees") {
      url = "/api/nonrailway";
      title = activeOnly ? "Non-Railway Trainees " : "Non-Railway Trainees";
    } else if (type === "STC") {
      url = "/api/stc";
      title = activeOnly ? "STC Trainees " : "STC Trainees";
    } else if (type === "WTC") {
      url = "/api/wtc";
      title = activeOnly ? "WTC Trainees " : "WTC Trainees";
    } else if (type === "Resigned Trainees") {
      // Fetch both STC and WTC resigned trainees
      title = "Resigned Trainees (STC & WTC)";
      try {
        const [stcRes, wtcRes] = await Promise.all([
          fetch("/api/stc"),
          fetch("/api/wtc"),
        ]);
        const [stcData, wtcData] = await Promise.all([
          stcRes.json(),
          wtcRes.json(),
        ]);
        let candidates = [];
        if (stcData.success && Array.isArray(stcData.data)) {
          const stcResigned = stcData.data
            .filter((c) => c.resignation_status === "yes")
            .map((c) => ({ ...c, _source: "STC" }));
          candidates = candidates.concat(stcResigned);
        }
        if (wtcData.success && Array.isArray(wtcData.data)) {
          const wtcResigned = wtcData.data
            .filter((c) => c.resignation_status === "yes")
            .map((c) => ({ ...c, _source: "WTC" }));
          candidates = candidates.concat(wtcResigned);
        }
        setStatDetailsTitle(title);
        setStatDetails(candidates);
        return;
      } catch {
        setStatDetailsTitle(title);
        setStatDetails([]);
        return;
      }
    } else if (type === "Total Trainees") {
      // Fetch all three and merge
      title = activeOnly ? "All Trainees (STC, WTC, Non-Railway) - Active Only" : "All Trainees (STC, WTC, Non-Railway)";
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
          let stcCandidates = stcData.data.map((c) => ({ ...c, _source: "STC" }));
          if (activeOnly) {
            stcCandidates = stcCandidates.filter(c => isActiveTrainee(c, "stc"));
          }
          candidates = candidates.concat(stcCandidates);
        }
        if (wtcData.success && Array.isArray(wtcData.data)) {
          let wtcCandidates = wtcData.data.map((c) => ({ ...c, _source: "WTC" }));
          if (activeOnly) {
            wtcCandidates = wtcCandidates.filter(c => isActiveTrainee(c, "wtc"));
          }
          candidates = candidates.concat(wtcCandidates);
        }
        if (nonRailwayData.success && Array.isArray(nonRailwayData.data)) {
          let nonRailwayCandidates = nonRailwayData.data.map((c) => ({ ...c, _source: "Non-Railway" }));
          if (activeOnly) {
            nonRailwayCandidates = nonRailwayCandidates.filter(c => isActiveTrainee(c, "nonrailway"));
          }
          candidates = candidates.concat(nonRailwayCandidates);
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
      title = activeOnly ? `Candidates in Unit: ${value} ` : `Candidates in Unit: ${value}`;
    } else if (type === "designation") {
      url = "/api/stc/filter/designation/" + encodeURIComponent(value);
      title = activeOnly ? `Candidates with Designation: ${value} ` : `Candidates with Designation: ${value}`;
    }
    if (!url) return;
    try {
      const res = await fetch(url);
      const data = await res.json();
      let candidates = [];
      if (data.success && Array.isArray(data.data)) {
        candidates = data.data;

        // Apply active filter if needed
        if (activeOnly) {
          // For STC candidates, use "stc" type for filtering
          candidates = candidates.filter(c => isActiveTrainee(c, "stc"));
        }

        // For "Railway Trainees", merge STC and WTC
        if (type === "Railway Trainees") {
          const wtcRes = await fetch("/api/wtc");
          const wtcData = await wtcRes.json();
          if (wtcData.success && Array.isArray(wtcData.data)) {
            let wtcCandidates = wtcData.data.map((c) => ({ ...c, _source: "WTC" }));
            if (activeOnly) {
              wtcCandidates = wtcCandidates.filter(c => isActiveTrainee(c, "wtc"));
            }
            candidates = [
              ...candidates.map((c) => ({ ...c, _source: "STC" })),
              ...wtcCandidates,
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

  const [allTrainees, setAllTrainees] = useState({
    stc: [],
    wtc: [],
    nonrailway: [],
  });
  const [activeSection, setActiveSection] = useState(null);
  const [activeTrainees, setActiveTrainees] = useState([]);
  const [fetchError, setFetchError] = useState(null);

  // Fetch all data for STC, WTC, Non-Railway and parse, handle error
  useEffect(() => {
    loadDashboardData();
    loadLineTrainingStats();
    loadAllTrainees();
  }, [loadDashboardData]);

  const loadAllTrainees = async () => {
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
      setAllTrainees({
        stc: Array.isArray(stcData.data) ? stcData.data : [],
        wtc: Array.isArray(wtcData.data) ? wtcData.data : [],
        nonrailway: Array.isArray(nonRailwayData.data)
          ? nonRailwayData.data
          : [],
      });
    } catch (err) {
      setAllTrainees({ stc: [], wtc: [], nonrailway: [] });
      setFetchError("Failed to fetch trainee data. Please try again." + err);
    }
  };

  // Compute active trainees for each section
  const getActiveTrainees = (type) => {
    const arr = allTrainees[type] || [];
    return arr.filter((item) => isActiveTrainee(item, type));
  };

  // Get ALL trainees (including resigned and expired) for Overall Statistics
  const getAllTrainees = (type) => {
    return allTrainees[type] || [];
  };

  // Get active designation counts for STC trainees only
  const getActiveDesignationCounts = () => {
    const activeSTC = getActiveTrainees("stc");
    const counts = {};
    activeSTC.forEach(trainee => {
      const designation = trainee.designation || "Unknown";
      counts[designation] = (counts[designation] || 0) + 1;
    });
    return counts;
  };

  // Get active distribution data (active trainees only)
  const getActiveDistributionData = () => {
    const stcCount = getActiveTrainees("stc").length;
    const wtcCount = getActiveTrainees("wtc").length;
    const nonRailwayCount = getActiveTrainees("nonrailway").length;
    const total = stcCount + wtcCount + nonRailwayCount;

    if (total === 0) return [];

    return [
      {
        name: "STC",
        count: stcCount,
        value: Math.round((stcCount / total) * 100),
        color: "#e11d48"
      },
      {
        name: "WTC",
        count: wtcCount,
        value: Math.round((wtcCount / total) * 100),
        color: "#059669"
      },
      {
        name: "Non-Railway",
        count: nonRailwayCount,
        value: Math.round((nonRailwayCount / total) * 100),
        color: "#7c3aed"
      }
    ];
  };

  // Get active unit data (active STC trainees only)
  const getActiveUnitsData = () => {
    const activeStcTrainees = getActiveTrainees("stc");
    const unitCounts = {};

    activeStcTrainees.forEach(trainee => {
      const unit = trainee.unit || "Unknown";
      unitCounts[unit] = (unitCounts[unit] || 0) + 1;
    });

    const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#84cc16", "#f97316"];

    return Object.entries(unitCounts)
      .map(([unit, count], idx) => ({
        unit,
        count,
        color: colors[idx % colors.length]
      }))
      .sort((a, b) => b.count - a.count);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="fixed bottom-8 right-8 z-10 h-12 w-12 rounded-full bg-amber-400 hover:bg-amber-300 flex items-center justify-center" >
        <button className="text-3xl font-bold text-gray-900" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <ArrowUp />
        </button>
      </div>
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
          {/* Active Candidates Sections */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Trainees Currently Under Training
            </h2>
            {fetchError && (
              <div className="mb-4 text-red-600 font-semibold">
                {fetchError}
                <button
                  className="ml-4 px-3 py-1 bg-orange-200 rounded text-orange-900"
                  onClick={loadAllTrainees}
                >
                  Retry
                </button>
              </div>
            )}

            {/* Vertical Bar Chart for Active Candidates */}
            <div className="mb-6">
              <div className="flex items-end justify-center space-x-8 h-48 mb-4">
                {(() => {
                  const stcCount = getActiveTrainees("stc").length;
                  const wtcCount = getActiveTrainees("wtc").length;
                  const nonRailwayCount = getActiveTrainees("nonrailway").length;
                  const maxCount = Math.max(stcCount, wtcCount, nonRailwayCount, 1);

                  // Dynamic height calculation for better visibility with small data
                  const getBarHeight = (count) => {
                    if (count === 0) return "8px";
                    if (maxCount <= 3) return `${Math.max(count * 40, 30)}px`; // Small data: 40px per unit
                    if (maxCount <= 10) return `${Math.max((count / maxCount) * 120 + 30, 30)}px`; // Medium data
                    return `${Math.max((count / maxCount) * 140 + 20, 30)}px`; // Large data
                  };

                  return (
                    <>
                      <div
                        className={`flex flex-col items-center cursor-pointer group ${activeSection === "stc"
                          ? "transform scale-105"
                          : ""
                          }`}
                        onClick={() => {
                          setActiveSection("stc");
                          setActiveTrainees(getActiveTrainees("stc"));
                        }}
                        style={{ minWidth: "100px" }}
                      >
                        <div className="relative w-full mb-2 h-40 flex items-end">
                          <div
                            className="w-full bg-blue-600 rounded-t-md transition-all duration-300 hover:bg-blue-700 flex items-end justify-center text-white text-sm font-bold pb-2"
                            style={{
                              height: getBarHeight(stcCount),
                            }}
                          >
                            {stcCount}
                          </div>
                        </div>
                        <div className="text-sm font-medium text-blue-700 text-center leading-tight">
                          STC
                        </div>
                      </div>

                      <div
                        className={`flex flex-col items-center cursor-pointer group ${activeSection === "wtc"
                          ? "transform scale-105"
                          : ""
                          }`}
                        onClick={() => {
                          setActiveSection("wtc");
                          setActiveTrainees(getActiveTrainees("wtc"));
                        }}
                        style={{ minWidth: "100px" }}
                      >
                        <div className="relative w-full mb-2 h-40 flex items-end">
                          <div
                            className="w-full bg-green-600 rounded-t-md transition-all duration-300 hover:bg-green-700 flex items-end justify-center text-white text-sm font-bold pb-2"
                            style={{
                              height: getBarHeight(wtcCount),
                            }}
                          >
                            {wtcCount}
                          </div>
                        </div>
                        <div className="text-sm font-medium text-green-700 text-center leading-tight">
                          WTC
                        </div>
                      </div>

                      <div
                        className={`flex flex-col items-center cursor-pointer group ${activeSection === "nonrailway"
                          ? "transform scale-105"
                          : ""
                          }`}
                        onClick={() => {
                          setActiveSection("nonrailway");
                          setActiveTrainees(getActiveTrainees("nonrailway"));
                        }}
                        style={{ minWidth: "100px" }}
                      >
                        <div className="relative w-full mb-2 h-40 flex items-end">
                          <div
                            className="w-full bg-purple-600 rounded-t-md transition-all duration-300 hover:bg-purple-700 flex items-end justify-center text-white text-sm font-bold pb-2"
                            style={{
                              height: getBarHeight(nonRailwayCount),
                            }}
                          >
                            {nonRailwayCount}
                          </div>
                        </div>
                        <div className="text-sm font-medium text-purple-700 text-center leading-tight">
                          Non-Railway
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mb-4">
              <button
                className={`px-4 py-2 rounded-md font-semibold border-2 transition text-sm ${activeSection === "stc"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-blue-700 border-blue-300 hover:bg-blue-50"
                  }`}
                onClick={() => {
                  if (activeSection === "stc") {
                    setActiveSection(null);
                    setActiveTrainees([]);
                  } else {
                    setActiveSection("stc");
                    setActiveTrainees(getActiveTrainees("stc"));
                  }
                }}
              >
                STC  ({getActiveTrainees("stc").length})
              </button>
              <button
                className={`px-4 py-2 rounded-md font-semibold border-2 transition text-sm ${activeSection === "wtc"
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-white text-green-700 border-green-300 hover:bg-green-50"
                  }`}
                onClick={() => {
                  if (activeSection === "wtc") {
                    setActiveSection(null);
                    setActiveTrainees([]);
                  } else {
                    setActiveSection("wtc");
                    setActiveTrainees(getActiveTrainees("wtc"));
                  }
                }}
              >
                WTC  ({getActiveTrainees("wtc").length})
              </button>
              <button
                className={`px-4 py-2 rounded-md font-semibold border-2 transition text-sm ${activeSection === "nonrailway"
                  ? "bg-purple-600 text-white border-purple-600"
                  : "bg-white text-purple-700 border-purple-300 hover:bg-purple-50"
                  }`}
                onClick={() => {
                  if (activeSection === "nonrailway") {
                    setActiveSection(null);
                    setActiveTrainees([]);
                  } else {
                    setActiveSection("nonrailway");
                    setActiveTrainees(getActiveTrainees("nonrailway"));
                  }



                }}
              >
                Non-Railway  ({getActiveTrainees("nonrailway").length})
              </button>
            </div>
            {activeSection && (
              <div className="relative">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {activeSection === "stc" ? "STC  Trainees" :
                      activeSection === "wtc" ? "WTC  Trainees" :
                        "Non-Railway Trainees"}
                  </h3>
                  <button
                    className="text-gray-500 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md transition text-sm"
                    onClick={() => {
                      setActiveSection(null);
                      setActiveTrainees([]);
                    }}
                    title="Close"
                  >
                    ✕
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
                        <th className="px-3 py-2 border-b text-left font-semibold text-gray-600">Date of Joining</th>
                        <th className="px-3 py-2 border-b text-left font-semibold text-gray-600">Date of Sparing</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeTrainees.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center text-gray-400 py-8">
                            No trainees found.
                          </td>
                        </tr>
                      ) : (
                        activeTrainees.map((c, i) => (
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
                              title={getJoiningDate(c, activeSection)}
                            >
                              {getJoiningDate(c, activeSection)}
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
            )}
          </div>

          {/* Distribution by Percentage - Bar Chart and Pie Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Distribution by Percentage
            </h2>
            <div className="min-h-[400px]">
              {loading ? (
                <SkeletonLoader type="bar" count={3} />
              ) : (() => {
                const activeDistData = getActiveDistributionData();
                return activeDistData.length === 0 ? (
                  <div className="text-center text-gray-400 py-8">No candidates available</div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Vertical Bar Chart */}
                    <div>
                      <div className="flex items-end justify-center space-x-8 h-80">
                        {activeDistData.map((item, idx) => {
                          // Different colors for bar chart
                          const barColors = ["#e11d48", "#059669", "#7c3aed"];
                          const maxCount = Math.max(...activeDistData.map(d => d.count));

                          // Dynamic height calculation for better visibility
                          const getDynamicHeight = (count) => {
                            if (count === 0) return "8px";
                            if (maxCount <= 3) return `${Math.max(count * 50, 40)}px`; // Small data: 50px per unit
                            if (maxCount <= 10) return `${Math.max((count / maxCount) * 220 + 40, 40)}px`; // Medium data
                            return `${Math.max((count / maxCount) * 260 + 30, 40)}px`; // Large data
                          };

                          return (
                            <div
                              key={idx}
                              className={`flex flex-col items-center cursor-pointer group ${selectedStat === item.name
                                ? "transform scale-105"
                                : ""
                                }`}
                              onClick={() => {
                                setSelectedStat(item.name);
                                if (item.name === "Non-Railway") {
                                  fetchStatDetails("Non-Railway Trainees", null, true);
                                } else {
                                  fetchStatDetails(item.name, null, true);
                                }
                              }}
                              style={{ minWidth: "80px", maxWidth: "100px" }}
                            >
                              <div className="relative w-full mb-2 h-80 flex items-end">
                                <div
                                  className="w-full rounded-t-md transition-all duration-300 hover:opacity-80 flex flex-col items-center justify-end text-white text-xs font-medium pb-2"
                                  style={{
                                    backgroundColor: barColors[idx],
                                    height: getDynamicHeight(item.count),
                                  }}
                                >
                                  <div className="font-bold text-sm">{item.value}%</div>
                                  <div className="text-xs">({item.count})</div>
                                </div>
                              </div>
                              <div className="text-sm font-medium text-gray-700 text-center leading-tight">
                                {item.name}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Pie Chart */}
                    <div>
                      <div className="flex items-center justify-center h-80">
                        {(() => {
                          const total = activeDistData.reduce((sum, item) => sum + item.count, 0);
                          const pieColors = ["#f97316", "#06b6d4", "#84cc16"]; // Orange, Cyan, Lime
                          let currentAngle = 0;

                          return (
                            <div className="flex flex-col items-center">
                              <svg width="200" height="200" className="mb-4">
                                {activeDistData.map((item, idx) => {
                                  const angle = (item.count / total) * 360;
                                  const startAngle = currentAngle;
                                  const endAngle = currentAngle + angle;
                                  currentAngle += angle;

                                  const startX = 100 + 80 * Math.cos((startAngle - 90) * Math.PI / 180);
                                  const startY = 100 + 80 * Math.sin((startAngle - 90) * Math.PI / 180);
                                  const endX = 100 + 80 * Math.cos((endAngle - 90) * Math.PI / 180);
                                  const endY = 100 + 80 * Math.sin((endAngle - 90) * Math.PI / 180);

                                  const largeArcFlag = angle > 180 ? 1 : 0;

                                  const pathData = [
                                    `M 100 100`,
                                    `L ${startX} ${startY}`,
                                    `A 80 80 0 ${largeArcFlag} 1 ${endX} ${endY}`,
                                    `Z`
                                  ].join(' ');

                                  return (
                                    <path
                                      key={idx}
                                      d={pathData}
                                      fill={pieColors[idx]}
                                      className="cursor-pointer hover:opacity-80 transition-opacity"
                                      onClick={() => {
                                        setSelectedStat(item.name);
                                        if (item.name === "Non-Railway") {
                                          fetchStatDetails("Non-Railway Trainees", null, true);
                                        } else {
                                          fetchStatDetails(item.name, null, true);
                                        }
                                      }}
                                    />
                                  );
                                })}
                              </svg>

                              {/* Legend */}
                              <div className="space-y-2">
                                {activeDistData.map((item, idx) => (
                                  <div key={idx} className="flex items-center space-x-2">
                                    <div
                                      className="w-4 h-4 rounded"
                                      style={{ backgroundColor: pieColors[idx] }}
                                    ></div>
                                    <span className="text-sm text-gray-700">
                                      {item.name}: {item.value}% ({item.count})
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Designation-wise Stats */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              STC Designation-wise Trainees
            </h2>
            <div className="min-h-[300px]">
              {loading ? (
                <SkeletonLoader type="bar" count={5} />
              ) : allTrainees.stc.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Vertical Bar Chart */}
                  <div>
                    <div className="flex items-end justify-center space-x-4 h-80">
                      {(() => {
                        const activeDesignationCounts = getActiveDesignationCounts();
                        const colors = [
                          "#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6",
                          "#06b6d4", "#84cc16", "#f97316", "#ec4899", "#6b7280"
                        ];

                        // Create horizontally scrollable container
                        return (
                          <div className="overflow-x-auto pb-4" style={{ maxWidth: '100%' }}>
                            <div className="flex space-x-4" style={{ minWidth: 'max-content' }}>
                              {Object.entries(activeDesignationCounts).map(([desig, count], idx) => {
                                const maxCount = Math.max(...Object.values(activeDesignationCounts));

                                // Improved height calculation for better scaling with large numbers
                                const getDynamicHeight = (count) => {
                                  if (count === 0) return "8px";
                                  // Use logarithmic scaling for large counts to prevent excessive height
                                  if (maxCount > 50) {
                                    // Log scaling for large datasets
                                    return `${Math.min(60 + (Math.log10(count) * 100), 240)}px`;
                                  } else if (maxCount > 20) {
                                    // More moderate scaling for medium-large datasets
                                    return `${Math.min(60 + (count / maxCount) * 200, 240)}px`;
                                  } else if (maxCount <= 3) {
                                    // Small data: more height per unit, min 60px
                                    return `${Math.min(Math.max(count * 80, 60), 240)}px`;
                                  } else {
                                    // Medium data
                                    return `${Math.min(Math.max((count / maxCount) * 240 + 40, 60), 240)}px`;
                                  }
                                };

                                return (
                                  <div
                                    key={desig}
                                    className={`flex flex-col items-center cursor-pointer group ${selectedStat === "designation:" + desig ? "transform scale-105" : ""
                                      }`}
                                    onClick={() => {
                                      setSelectedStat("designation:" + desig);
                                      fetchStatDetails("designation", desig, true);
                                    }}
                                    style={{ minWidth: "60px", maxWidth: "80px", flexShrink: 0 }}
                                  >
                                    <div className="relative w-full mb-2 h-80 flex items-end">
                                      <div
                                        className="w-full rounded-t-md transition-all duration-300 hover:opacity-80 flex items-end justify-center text-white text-xs font-medium pb-1"
                                        style={{
                                          backgroundColor: colors[idx % colors.length],
                                          height: getDynamicHeight(count),
                                        }}
                                      >
                                        {count}
                                      </div>
                                    </div>
                                    <div className="text-xs font-medium text-gray-700 text-center leading-tight">
                                      {desig}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Pie Chart */}
                  <div>
                    <div className="flex items-center justify-center h-80">
                      {(() => {
                        const activeDesignationCounts = getActiveDesignationCounts();
                        const designationData = Object.entries(activeDesignationCounts);
                        const total = Object.values(activeDesignationCounts).reduce((sum, count) => sum + count, 0);
                        const colors = [
                          "#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6",
                          "#06b6d4", "#84cc16", "#f97316", "#ec4899", "#6b7280"
                        ];

                        if (total === 0) {
                          return (
                            <div className="text-center text-gray-400 py-8">
                              No STC candidates found
                            </div>
                          );
                        }

                        let currentAngle = 0;

                        return (
                          <div className="flex items-center space-x-8">
                            {/* Pie Chart SVG */}
                            <div className="relative">
                              <svg width="240" height="240" className="transform -rotate-90">
                                <circle
                                  cx="120"
                                  cy="120"
                                  r="100"
                                  fill="none"
                                  stroke="#e5e7eb"
                                  strokeWidth="2"
                                />
                                {designationData.map(([desig, count], idx) => {
                                  const angle = (count / total) * 360;
                                  const x1 = 120 + 100 * Math.cos((currentAngle * Math.PI) / 180);
                                  const y1 = 120 + 100 * Math.sin((currentAngle * Math.PI) / 180);
                                  const x2 = 120 + 100 * Math.cos(((currentAngle + angle) * Math.PI) / 180);
                                  const y2 = 120 + 100 * Math.sin(((currentAngle + angle) * Math.PI) / 180);
                                  const largeArc = angle > 180 ? 1 : 0;

                                  const pathData = [
                                    "M", 120, 120,
                                    "L", x1, y1,
                                    "A", 100, 100, 0, largeArc, 1, x2, y2,
                                    "Z"
                                  ].join(" ");

                                  currentAngle += angle;

                                  return (
                                    <path
                                      key={desig}
                                      d={pathData}
                                      fill={colors[idx % colors.length]}
                                      stroke="white"
                                      strokeWidth="2"
                                      className={`cursor-pointer transition-opacity hover:opacity-80 ${selectedStat === "designation:" + desig ? "opacity-90 stroke-4" : ""
                                        }`}
                                      onClick={() => {
                                        setSelectedStat("designation:" + desig);
                                        fetchStatDetails("designation", desig, true);
                                      }}
                                    />
                                  );
                                })}
                              </svg>
                            </div>

                            {/* Legend */}
                            <div className="space-y-2 max-h-80 overflow-y-auto">
                              {designationData.map(([desig, count], idx) => {
                                const percentage = ((count / total) * 100).toFixed(1);
                                return (
                                  <div
                                    key={desig}
                                    className={`flex items-center space-x-3 cursor-pointer p-2 rounded transition hover:bg-gray-50 ${selectedStat === "designation:" + desig ? "bg-blue-50 ring-2 ring-blue-500" : ""
                                      }`}
                                    onClick={() => {
                                      setSelectedStat("designation:" + desig);
                                      fetchStatDetails("designation", desig, true);
                                    }}
                                  >
                                    <div
                                      className="w-4 h-4 rounded"
                                      style={{ backgroundColor: colors[idx % colors.length] }}
                                    ></div>
                                    <div className="flex-1">
                                      <div className="text-sm font-medium text-gray-800 truncate">
                                        {desig}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {percentage}% ({count})
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-400 py-8">
                  No STC trainees available
                </div>
              )}
            </div>
          </div>

          {/* All Units by Trainee Count */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Unit-wise Trainees
            </h2>
            <div className="min-h-[300px] overflow-x-auto">
              {loading ? (
                <div className="flex items-end justify-center space-x-2 h-80">
                  {Array(8).fill(0).map((_, idx) => (
                    <div key={idx} className="flex flex-col items-center" style={{ minWidth: "60px" }}>
                      <div className="w-full bg-gray-200 rounded-t-md animate-pulse mb-2" style={{ height: `${Math.random() * 60 + 20}%`, minHeight: "40px" }}></div>
                      <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
                    </div>
                  ))}
                </div>
              ) : (() => {
                const activeUnitsData = getActiveUnitsData();
                return activeUnitsData.length === 0 ? (
                  <div className="text-center text-gray-400 py-8">
                    No STC candidates available
                  </div>
                ) : (
                  <div className="flex items-end justify-center space-x-4 h-80 overflow-x-auto pb-4">
                    {activeUnitsData.map((item, idx) => {
                      const maxCount = Math.max(...activeUnitsData.map(d => d.count));

                      // Dynamic height calculation for better visibility
                      const getDynamicHeight = (count) => {
                        if (count === 0) return "8px";
                        if (maxCount <= 3) return `${Math.max(count * 80, 60)}px`; // Small data: 80px per unit, min 60px
                        if (maxCount <= 10) return `${Math.max((count / maxCount) * 280 + 40, 60)}px`; // Medium data
                        return `${Math.max((count / maxCount) * 300 + 30, 60)}px`; // Large data
                      };

                      return (
                        <div
                          key={idx}
                          className={`flex flex-col items-center cursor-pointer group flex-shrink-0 ${selectedStat === "unit:" + item.unit
                            ? "transform scale-105"
                            : ""
                            }`}
                          onClick={() => {
                            setSelectedStat("unit:" + item.unit);
                            fetchStatDetails("unit", item.unit, true); // true for activeOnly
                          }}
                          style={{ minWidth: "60px", maxWidth: "80px" }}
                        >
                          <div className="relative w-full mb-2 h-80 flex items-end">
                            <div
                              className="w-full rounded-t-md transition-all duration-300 hover:opacity-80 flex items-end justify-center text-white text-xs font-medium pb-1"
                              style={{
                                backgroundColor: item.color,
                                height: getDynamicHeight(item.count),
                              }}
                            >
                              {item.count}
                            </div>
                          </div>
                          <div className="text-xs font-medium text-gray-700 text-center leading-tight">
                            {item.unit}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Line Training Stats (by Activity Centre) */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Line training data (Unit-wise)
            </h2>
            <div className="min-h-[300px] overflow-x-auto">
              {loading ? (
                <SkeletonLoader type="bar" count={5} />
              ) : lineTrainingStats.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  No data available
                </div>
              ) : (
                <div className="flex items-end justify-center space-x-4 h-80 overflow-x-auto pb-4">
                  {lineTrainingStats.map((item, idx) => {
                    const maxCount = Math.max(...lineTrainingStats.map(d => d.count));
                    const heightPercent = (item.count / maxCount) * 100;
                    // Different colors for each bar
                    const colors = [
                      "#e11d48", // Rose/Pink
                      "#059669", // Emerald
                      "#7c3aed", // Violet
                      "#dc2626", // Red
                      "#0891b2", // Cyan
                      "#ea580c", // Orange
                      "#65a30d", // Lime
                      "#be185d", // Pink
                      "#0d9488", // Teal
                      "#7c2d12"  // Amber/Brown
                    ];
                    const barColor = colors[idx % colors.length];

                    return (
                      <div
                        key={item.activityCentre}
                        className={`flex flex-col items-center cursor-pointer group flex-shrink-0 ${selectedLineTraining === item.activityCentre
                          ? "transform scale-105"
                          : ""
                          }`}
                        onClick={() => {
                          fetchLineTrainingDetails(item.activityCentre);
                        }}
                        style={{ minWidth: "80px", maxWidth: "100px" }}
                      >
                        <div className="relative w-full mb-2 h-72">
                          <div
                            className="w-full rounded-t-md transition-all duration-300 hover:opacity-80 flex items-end justify-center text-white text-xs font-medium pb-1 absolute bottom-0"
                            style={{
                              backgroundColor: barColor,
                              height: `${Math.max(heightPercent, 8)}%`,
                              minHeight: "25px",
                            }}
                          >
                            {item.count}
                          </div>
                        </div>
                        <div className="text-xs font-medium text-gray-700 text-center leading-tight">
                          {item.activityCentre}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Main Stats - Vertical Bar Charts and Pie Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Overall Statistics (All Trainees)
            </h2>
            <div className="min-h-[400px]">
              {loading ? (
                <SkeletonLoader type="bar" count={4} />
              ) : overallStats ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Vertical Bar Chart */}
                  <div>
                    <div className="flex items-end justify-center space-x-8 h-80">
                      {(() => {
                        const totalAllCount = getAllTrainees("stc").length + getAllTrainees("wtc").length + getAllTrainees("nonrailway").length;
                        const railwayAllCount = getAllTrainees("stc").length + getAllTrainees("wtc").length;
                        const nonRailwayAllCount = getAllTrainees("nonrailway").length;
                        const resignedCount = overallStats.resignedCount || 0;

                        const maxCount = Math.max(totalAllCount, railwayAllCount, nonRailwayAllCount, resignedCount, 1);

                        return (
                          <>
                            <div
                              className={`flex flex-col items-center cursor-pointer group ${selectedStat === "Total Trainees"
                                ? "transform scale-105"
                                : ""
                                }`}
                              onClick={() => {
                                setSelectedStat("Total Trainees");
                                fetchStatDetails("Total Trainees");
                              }}
                              style={{ minWidth: "80px", maxWidth: "120px" }}
                            >
                              <div className="relative w-full mb-2 h-72">
                                <div
                                  className="w-full bg-blue-600 rounded-t-md transition-all duration-300 hover:bg-blue-700 flex items-end justify-center text-white text-sm font-bold pb-2 absolute bottom-0"
                                  style={{
                                    height: `${Math.max((totalAllCount / maxCount) * 100, 10)}%`,
                                    minHeight: "40px",
                                  }}
                                >
                                  {totalAllCount}
                                </div>
                              </div>
                              <div className="text-sm font-medium text-blue-700 text-center leading-tight">
                                Total
                              </div>
                            </div>

                            <div
                              className={`flex flex-col items-center cursor-pointer group ${selectedStat === "Railway Trainees"
                                ? "transform scale-105"
                                : ""
                                }`}
                              onClick={() => {
                                setSelectedStat("Railway Trainees");
                                fetchStatDetails("Railway Trainees");
                              }}
                              style={{ minWidth: "80px", maxWidth: "120px" }}
                            >
                              <div className="relative w-full mb-2 h-72">
                                <div
                                  className="w-full bg-green-600 rounded-t-md transition-all duration-300 hover:bg-green-700 flex items-end justify-center text-white text-sm font-bold pb-2 absolute bottom-0"
                                  style={{
                                    height: `${Math.max((railwayAllCount / maxCount) * 100, 10)}%`,
                                    minHeight: "40px",
                                  }}
                                >
                                  {railwayAllCount}
                                </div>
                              </div>
                              <div className="text-sm font-medium text-green-700 text-center leading-tight">
                                Railway
                              </div>
                            </div>

                            <div
                              className={`flex flex-col items-center cursor-pointer group ${selectedStat === "Non-Railway Trainees"
                                ? "transform scale-105"
                                : ""
                                }`}
                              onClick={() => {
                                setSelectedStat("Non-Railway Trainees");
                                fetchStatDetails("Non-Railway Trainees");
                              }}
                              style={{ minWidth: "80px", maxWidth: "120px" }}
                            >
                              <div className="relative w-full mb-2 h-72">
                                <div
                                  className="w-full bg-purple-600 rounded-t-md transition-all duration-300 hover:bg-purple-700 flex items-end justify-center text-white text-sm font-bold pb-2 absolute bottom-0"
                                  style={{
                                    height: `${Math.max((nonRailwayAllCount / maxCount) * 100, 10)}%`,
                                    minHeight: "40px",
                                  }}
                                >
                                  {nonRailwayAllCount}
                                </div>
                              </div>
                              <div className="text-sm font-medium text-purple-700 text-center leading-tight">
                                Non-Railway
                              </div>
                            </div>

                            <div
                              className={`flex flex-col items-center cursor-pointer group ${selectedStat === "Resigned Trainees"
                                ? "transform scale-105"
                                : ""
                                }`}
                              onClick={() => {
                                setSelectedStat("Resigned Trainees");
                                fetchStatDetails("Resigned Trainees");
                              }}
                              style={{ minWidth: "80px", maxWidth: "120px" }}
                            >
                              <div className="relative w-full mb-2 h-72">
                                <div
                                  className="w-full bg-red-500 rounded-t-md transition-all duration-300 hover:bg-red-600 flex items-end justify-center text-white text-sm font-bold pb-2 absolute bottom-0"
                                  style={{
                                    height: `${Math.max((resignedCount / maxCount) * 100, 10)}%`,
                                    minHeight: "40px",
                                  }}
                                >
                                  {resignedCount}
                                </div>
                              </div>
                              <div className="text-sm font-medium text-gray-700 text-center leading-tight">
                                Resigned Trainees
                              </div>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Pie Chart */}
                  <div>
                    <div className="flex items-center justify-center h-80">
                      {(() => {
                        const railwayAllCount = getAllTrainees("stc").length + getAllTrainees("wtc").length;
                        const nonRailwayAllCount = getAllTrainees("nonrailway").length;

                        const pieData = [
                          { name: "Railway", count: railwayAllCount, color: "#16a34a" },
                          { name: "Non-Railway", count: nonRailwayAllCount, color: "#9333ea" },
                        ];

                        const total = railwayAllCount + nonRailwayAllCount;
                        let currentAngle = 0;

                        return (
                          <div className="flex flex-col items-center">
                            <svg width="200" height="200" className="mb-4">
                              {pieData.map((item, idx) => {
                                if (item.count === 0) return null;
                                const angle = (item.count / total) * 360;
                                const startAngle = currentAngle;
                                const endAngle = currentAngle + angle;
                                currentAngle += angle;

                                const startX = 100 + 80 * Math.cos((startAngle - 90) * Math.PI / 180);
                                const startY = 100 + 80 * Math.sin((startAngle - 90) * Math.PI / 180);
                                const endX = 100 + 80 * Math.cos((endAngle - 90) * Math.PI / 180);
                                const endY = 100 + 80 * Math.sin((endAngle - 90) * Math.PI / 180);

                                const largeArcFlag = angle > 180 ? 1 : 0;

                                const pathData = [
                                  `M 100 100`,
                                  `L ${startX} ${startY}`,
                                  `A 80 80 0 ${largeArcFlag} 1 ${endX} ${endY}`,
                                  `Z`
                                ].join(' ');

                                return (
                                  <path
                                    key={idx}
                                    d={pathData}
                                    fill={item.color}
                                    className="cursor-pointer hover:opacity-80 transition-opacity"
                                    onClick={() => {
                                      if (item.name === "Railway") {
                                        setSelectedStat("Railway Trainees");
                                        fetchStatDetails("Railway Trainees");
                                      } else {
                                        setSelectedStat("Non-Railway Trainees");
                                        fetchStatDetails("Non-Railway Trainees");
                                      }
                                    }}
                                  />
                                );
                              })}
                            </svg>

                            {/* Legend */}
                            <div className="space-y-2">
                              {pieData.map((item, idx) => {
                                const percentage = total > 0 ? Math.round((item.count / total) * 100) : 0;
                                return (
                                  <div key={idx} className="flex items-center space-x-2">
                                    <div
                                      className="w-4 h-4 rounded"
                                      style={{ backgroundColor: item.color }}
                                    ></div>
                                    <span className="text-sm text-gray-700">
                                      {item.name}: {percentage}% ({item.count})
                                    </span>
                                  </div>
                                );
                              })}
                              <div className="mt-2 pt-2 border-t border-gray-200">
                                <span className="text-sm font-semibold text-gray-800">
                                  Total: {total} candidates
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-400 py-8">
                  No stats available
                </div>
              )}
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
                            <th className="px-3 py-2 border-b text-left font-semibold text-gray-600">Date of Joining</th>
                            <th className="px-3 py-2 border-b text-left font-semibold text-gray-600">Date of Sparing</th>
                            {statDetails.some((c) => c._source) && (
                              <th className="px-3 py-2 border-b text-left font-semibold text-gray-600">Type</th>
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
                            <td
                              className="px-3 py-2 text-gray-700 truncate max-w-[120px]"
                              title={getJoiningDate(c, c._source ? c._source.toLowerCase() : "stc")}
                            >
                              {getJoiningDate(c, c._source ? c._source.toLowerCase() : "stc")}
                            </td>
                            <td
                              className="px-3 py-2 text-gray-700 truncate max-w-[120px]"
                              title={getSparingDate(c, c._source ? c._source.toLowerCase() : "stc")}
                            >
                              {getSparingDate(c, c._source ? c._source.toLowerCase() : "stc")}
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
                      <p className="text-xs text-gray-400 mt-1">{activity.time} GMT</p>
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
