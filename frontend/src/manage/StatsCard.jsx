import React, { useState, useEffect } from 'react';
import { Users, BarChart2, Briefcase, Zap } from 'lucide-react';

const StatsCards = ({ candidates, selectedFilters }) => {
  // Calculate stats directly from the filtered candidates
  const stats = {
    totalCandidates: candidates.length,
    activeCandidates: candidates.filter(c => c.status === 'Active').length,
    stcCandidates: candidates.filter(c => c.type === 'STC').length,
    wtcCandidates: candidates.filter(c => c.type === 'WTC').length,
    nonRailwayCandidates: candidates.filter(c => c.type === 'Non Railway').length,
    distinctBatches: [...new Set(candidates.map(c => c.batch))].length,
    distinctStreams: [...new Set(candidates.map(c => c.stream))].length,
    workInfoDistribution: getWorkInfoDistribution(candidates)
  };

  // Dynamic title prefix based on the selected filter
  const getFilterTitle = () => {
    if (selectedFilters.length === 1) {
      return selectedFilters[0];
    } else if (selectedFilters.length === 2) {
      return selectedFilters.join(' + ');
    } else if (selectedFilters.length === 3) {
      return 'All';
    }
    return 'All';
  };

  const titlePrefix = getFilterTitle() === 'All' ? '' : `${getFilterTitle()} `;

  const displayStats = [
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
  ];

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

// Helper function for work info distribution
function getWorkInfoDistribution(candidates) {
  if (!candidates || candidates.length === 0) return {};

  const distribution = {};
  candidates.forEach(candidate => {
    const workInfo = candidate.workInfo;
    distribution[workInfo] = (distribution[workInfo] || 0) + 1;
  });
  return distribution;
}

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