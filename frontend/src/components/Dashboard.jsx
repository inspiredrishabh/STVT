import React, { useState, useEffect } from "react";
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
      const total = stc + wtc + nonRailway;
      return {
        success: true,
        data: {
          totalCandidates: total,
          railwayCandidates: stc + wtc,
          nonRailwayCandidates: nonRailway,
          stcCandidates: stc,
          wtcCandidates: wtc,
        },
      };
    } catch {
      return { success: false, data: null };
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

const SimpleBarChart = ({ data, title }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold text-gray-900 text-center">{title}</h3>
    {!data ||
    data.length === 0 ||
    Math.max(...data.map((d) => d.count)) === 0 ? (
      <div className="text-center text-gray-400 py-8">No data available</div>
    ) : (
      <div className="space-y-3">
        {data.map((item, idx) => (
          <div key={idx} className="flex items-center space-x-3">
            <div className="w-16 text-sm font-medium text-gray-700 text-right">
              {item.category}
            </div>
            <div className="flex-1 bg-gray-100 rounded-full h-6 relative">
              <div
                className="h-6 rounded-full flex items-center justify-end pr-2 text-white text-xs font-medium"
                style={{
                  backgroundColor: item.color,
                  width: `${
                    (item.count / Math.max(...data.map((d) => d.count))) * 100
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
);

const SimplePieChart = ({ data, title }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold text-gray-900 text-center">{title}</h3>
    {!data ||
    data.length === 0 ||
    data.reduce((sum, item) => sum + item.count, 0) === 0 ? (
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
              let currentAngle = 0;
              return data.map((item, idx) => {
                const total = data.reduce((sum, i) => sum + i.count, 0);
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
        <div className="space-y-3">
          {data.map((item, idx) => (
            <div key={idx} className="flex items-center space-x-3">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: item.color }}
              ></div>
              <div className="flex-1">
                <div className="text-sm font-medium text-orange-900">
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
);

function Dashboard() {
  const [categoriesData, setCategoriesData] = useState([]);
  const [distributionData, setDistributionData] = useState([]);
  const [overallStats, setOverallStats] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userRole } = useAuth();
  const dashboardAPI = new DashboardAPI();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [cat, dist, stats, acts] = await Promise.all([
        dashboardAPI.getCategoriesData(),
        dashboardAPI.getDistributionData(),
        dashboardAPI.getOverallStats(),
        dashboardAPI.getRecentActivities(),
      ]);
      if (cat.success) setCategoriesData(cat.data);
      if (dist.success) setDistributionData(dist.data);
      if (stats.success) setOverallStats(stats.data);
      if (acts.success) setRecentActivities(acts.data);
    } catch {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
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

  if (loading)
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400"></div>
          <span className="mt-3 text-gray-700 font-semibold">
            Loading dashboard...
          </span>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="bg-white border-2 border-orange-100 rounded-3xl p-6 shadow-lg">
          <div className="flex items-center">
            <div className="text-orange-400 mr-3">⚠️</div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Error Loading Dashboard
              </h3>
              <p className="text-gray-600 mt-1">{error}</p>
              <button
                onClick={loadDashboardData}
                className="mt-3 bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded-xl text-sm transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-9xl mx-auto">
        <div className="bg-white rounded-3xl shadow-lg border-2 border-orange-100 p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Dashboard - Supervisor Training Centre
              </h1>
              <p className="text-gray-600 mt-2">
                Overview of training programs and candidate statistics
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={loadDashboardData}
                className="bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded-xl flex items-center transition-colors"
              >
                <RefreshCw className="mr-2 w-4 h-4" />
                Refresh
              </button>

              {/* Only show Export button for admin or master */}
              {(userRole === "admin" || userRole === "master") && (
                <button
                  onClick={handleExportData}
                  className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl flex items-center transition-colors"
                >
                  <Download className="mr-2 w-4 h-4" />
                  Export
                </button>
              )}
            </div>
          </div>
        </div>

        {overallStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-3xl shadow-lg border-2 border-orange-100 p-6">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Candidates
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {overallStats.totalCandidates}
                </p>
              </div>
            </div>
            {/* Removed Active Courses, Completed, and Training Capacity cards */}
          </div>
        )}

        {overallStats && (
          <div className="bg-white rounded-3xl shadow-lg border-2 border-orange-100 p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Training Categories Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-2xl border-2 border-blue-100">
                <h3 className="text-lg font-semibold text-blue-600">
                  Railway Training
                </h3>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {overallStats.railwayCandidates}
                </p>
                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">STC:</span>
                    <span className="font-medium text-gray-900">
                      {overallStats.stcCandidates}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">WTC:</span>
                    <span className="font-medium text-gray-900">
                      {overallStats.wtcCandidates}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-2xl border-2 border-purple-100">
                <h3 className="text-lg font-semibold text-purple-600">
                  Non-Railway Training
                </h3>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {overallStats.nonRailwayCandidates}
                </p>
                <p className="text-sm text-gray-600 mt-3">
                  General training for non-railway personnel
                </p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-2xl border-2 border-green-100">
                <h3 className="text-lg font-semibold text-green-600">
                  Total Candidates
                </h3>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {overallStats.totalCandidates}
                </p>
                <div className="mt-3">
                  <div className="text-sm text-gray-600">
                    Railway:{" "}
                    {Math.round(
                      (overallStats.railwayCandidates /
                        overallStats.totalCandidates) *
                        100
                    )}
                    %
                  </div>
                  <div className="text-sm text-gray-600">
                    Non-Railway:{" "}
                    {Math.round(
                      (overallStats.nonRailwayCandidates /
                        overallStats.totalCandidates) *
                        100
                    )}
                    %
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-3xl shadow-lg border-2 border-orange-100 p-6">
            <SimpleBarChart
              data={categoriesData}
              title="STC, WTC & Non-Railway Categories"
            />
          </div>
          <div className="bg-white rounded-3xl shadow-lg border-2 border-orange-100 p-6">
            <SimplePieChart
              data={distributionData}
              title="Distribution (Pie Chart)"
            />
          </div>
        </div>
        <div className="bg-white rounded-3xl shadow-lg border-2 border-orange-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Activities
            </h3>
          </div>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start space-x-3 p-3 rounded-2xl hover:bg-orange-50 transition-colors border-l-4"
                style={{
                  borderLeftColor:
                    activity.category === "STC"
                      ? "#FF8D21"
                      : activity.category === "WTC"
                      ? "#FFA652"
                      : activity.category === "Non-Railway"
                      ? "#008080"
                      : "#6b7280",
                }}
              >
                <div className="flex-shrink-0 text-lg">{activity.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {activity.activity}
                    </p>
                    <span
                      className={`px-2 py-1 text-xs rounded-full font-medium ${
                        activity.category === "STC"
                          ? "bg-orange-100 text-orange-700"
                          : activity.category === "WTC"
                          ? "bg-orange-100 text-orange-700"
                          : activity.category === "Non-Railway"
                          ? "bg-teal-100 text-teal-700"
                          : "bg-gray-100 text-gray-700"
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
            ))}
          </div>
        </div>
      </div>
      <div className="bg-cyan-50 text-grey py-8 mt-8 w-full">
        <div className="container mx-auto px-0">
          <div className="text-center space-y-4">
            <p className="text-base font-semibold">
              © 2025 All Rights Reserved.
            </p>
            <p className="text-sm text-grey leading-relaxed px-8">
              Supervisor Training Center, Charbagh, Northern Railways, Ministry
              of Railways, Government of India.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
                    