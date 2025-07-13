import React, { useState, useEffect } from 'react';
import { Users, BarChart2, Briefcase, Zap } from 'lucide-react';

const StatsCards = ({ candidates = [], filterType = 'All', filterCategory = 'All', mockAPI }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      if (!mockAPI) {
        console.log('StatsCards: No mockAPI provided, using local stats');
        return;
      }

      setLoading(true);
      try {
        // Pass the filter parameters to get appropriate statistics
        const response = await mockAPI.getStats({
          category: filterCategory,
          type: filterType
        });

        if (response.success) {
          setStats(response.data);
        } else {
          console.log('StatsCards: API call succeeded but response.success is false');
        }
      } catch (error) {
        console.error('StatsCards: Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [filterCategory, filterType, mockAPI, candidates]);

  // Dynamic title prefix based on the selected filter - with fallback handling
  const titlePrefix = (filterType && filterType !== 'All') ? `${filterType} ` : '';

  // Fallback to local calculation if API stats are not available
  const localStats = [
    {
      title: `${titlePrefix}Total Candidates`,
      value: candidates.length,
      icon: Users,
      iconBgColor: "bg-blue-100",
      iconTextColor: "text-blue-600",
    },
    {
      title: "Distinct Batches",
      value: [...new Set(candidates.map(c => c.batch))].length,
      icon: BarChart2,
      iconBgColor: "bg-green-100",
      iconTextColor: "text-green-600",
    },
    {
      title: "Top Work Info",
      value: getTopWorkInfo(candidates) || 'N/A',
      icon: Briefcase,
      iconBgColor: "bg-orange-100",
      iconTextColor: "text-orange-600",
    },
    {
      title: "Available Streams",
      value: [...new Set(candidates.map(c => c.stream))].length,
      icon: Zap,
      iconBgColor: "bg-purple-100",
      iconTextColor: "text-purple-600",
    },
  ];

  // Use API stats if available, otherwise fallback to local calculation
  const displayStats = stats ? [
    {
      title: `${titlePrefix}Total Candidates`,
      value: stats.totalCandidates,
      icon: Users,
      iconBgColor: "bg-blue-100",
      iconTextColor: "text-blue-600",
    },
    {
      title: "Active Candidates",
      value: stats.activeCandidates,
      icon: BarChart2,
      iconBgColor: "bg-green-100",
      iconTextColor: "text-green-600",
    },
    {
      title: "Top Work Info",
      value: getTopWorkInfoFromDistribution(stats.workInfoDistribution) || 'N/A',
      icon: Briefcase,
      iconBgColor: "bg-orange-100",
      iconTextColor: "text-orange-600",
    },
    {
      title: "Distinct Batches",
      value: stats.distinctBatches,
      icon: Zap,
      iconBgColor: "bg-purple-100",
      iconTextColor: "text-purple-600",
    },
  ] : localStats;

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-3xl p-6 shadow-md border border-gray-200 animate-pulse">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-200 rounded-2xl"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {displayStats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, iconBgColor, iconTextColor }) => (
  <div className="bg-white rounded-3xl p-6 shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200 flex items-center space-x-4">
    <div className={`flex-shrink-0 p-4 ${iconBgColor} rounded-2xl shadow-sm`}>
      <Icon className={`h-6 w-6 ${iconTextColor}`} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-gray-600 mb-1 truncate">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

// Helper function for local calculation
function getTopWorkInfo(candidates) {
  if (!candidates || candidates.length === 0) return null;

  const workInfoCount = {};
  candidates.forEach(candidate => {
    const workInfo = candidate.workInfo;
    workInfoCount[workInfo] = (workInfoCount[workInfo] || 0) + 1;
  });

  return Object.keys(workInfoCount).reduce((a, b) =>
    workInfoCount[a] > workInfoCount[b] ? a : b
  );
}

// Helper function for API stats
function getTopWorkInfoFromDistribution(distribution) {
  if (!distribution || Object.keys(distribution).length === 0) return null;

  return Object.keys(distribution).reduce((a, b) =>
    distribution[a] > distribution[b] ? a : b
  );
}

export default StatsCards;