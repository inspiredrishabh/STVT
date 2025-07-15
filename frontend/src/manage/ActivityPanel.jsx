import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Clock, Activity } from "lucide-react";
import PropTypes from "prop-types";

/**
 * ActivityPanel
 *
 * Shows the 5 most recent “join” events for a list of candidates,
 * plus a little summary at the bottom.
 *
 * @param {Object[]} candidates
 */

const ActivityPanel = ({ candidates }) => {
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 1) pick the 5 newest join dates
  const recentCandidates = useMemo(() => {
    return [...candidates]
      .sort(
        (a, b) =>
          new Date(b.dateOfJoiningStcWtcNonRailway) -
          new Date(a.dateOfJoiningStcWtcNonRailway)
      )
      .slice(0, 5);
  }, [candidates]);

  // 2) pull out “Active” count
  const activeCount = useMemo(
    () => candidates.filter((c) => c.status === "Active").length,
    [candidates]
  );

  // 3) build our “activity” list from those 5
  const fetchRecentActivity = useCallback(() => {
    setLoading(true);
    setError(null);

    try {
      const activity = recentCandidates.map((cand) => ({
        id: cand.id,
        timestamp: cand.dateOfJoiningStcWtcNonRailway,
        description: `${cand.name} joined as ${cand.workInfo || cand.designation
          }`,
        candidate: cand,
      }));
      setRecentActivity(activity);
    } catch {
      setError("Could not load activity.");
      setRecentActivity([]);
    } finally {
      setLoading(false);
    }
  }, [recentCandidates]);

  useEffect(() => {
    fetchRecentActivity();
  }, [fetchRecentActivity]);

  return (
    <div className="flex flex-col bg-white rounded-3xl p-6 shadow-lg border-2 border-orange-100 h-full">
      <Header />

      <div className="flex-1 overflow-auto">
        {error ? (
          <ErrorState message={error} onRetry={fetchRecentActivity} />
        ) : loading ? (
          <LoadingSkeleton />
        ) : recentActivity.length > 0 ? (
          <ActivityList activities={recentActivity} />
        ) : (
          <EmptyState />
        )}
      </div>

      {candidates.length > 0 && (
        <Summary total={candidates.length} active={activeCount} />
      )}
    </div>
  );
};

ActivityPanel.propTypes = {
  candidates: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      dateOfJoiningStcWtcNonRailway: PropTypes.string,
      workInfo: PropTypes.string,
      designation: PropTypes.string,
      status: PropTypes.string,
      stream: PropTypes.string,
      picture: PropTypes.string,
    })
  ).isRequired,
};

// —————————————————————————————————————————————————————————————————————

const Header = () => (
  <div className="flex items-center mb-4 space-x-3">
    <div className="p-2 bg-[#FF8D21] rounded-xl">
      <Activity className="w-5 h-5 text-white" />
    </div>
    <h3 className="text-lg font-semibold text-[#1B2A41]">Recent Activity</h3>
  </div>
);

const LoadingSkeleton = () => (
  <div role="status" aria-label="Loading recent activity" className="space-y-4">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="flex items-center animate-pulse space-x-4 p-3">
        <div className="w-10 h-10 bg-[#FFA652] rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-[#FFA652] rounded w-3/4" />
          <div className="h-3 bg-[#FFA652] rounded w-1/2" />
          <div className="h-3 bg-[#FFA652] rounded w-1/3" />
        </div>
      </div>
    ))}
  </div>
);

const ErrorState = ({ message, onRetry }) => (
  <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
    <div className="p-3 mb-4 bg-red-100 rounded-full">
      <Activity className="w-8 h-8 text-red-500" />
    </div>
    <h4 className="text-[#1B2A41] font-medium mb-2">Unable to Load Activity</h4>
    <p className="text-gray-600 text-sm mb-4">{message}</p>
    <button
      onClick={onRetry}
      className="px-3 py-1.5 text-xs font-medium text-white bg-[#FF8D21] rounded hover:bg-[#FFA652] transition-colors"
    >
      Try Again
    </button>
  </div>
);

const EmptyState = () => (
  <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
    <div className="p-3 mb-4 bg-[#FFA652] rounded-full">
      <Clock className="w-8 h-8 text-white" />
    </div>
    <h4 className="text-[#1B2A41] font-medium mb-2">No Recent Activity</h4>
    <p className="text-gray-600 text-sm">
      Candidate join events will appear here as they happen.
    </p>
  </div>
);

const ActivityList = ({ activities }) => (
  <ul
    role="list"
    aria-label="Recent candidate activities"
    className="space-y-2"
  >
    {activities.map((act) => (
      <ActivityItem key={act.id} activity={act} />
    ))}
  </ul>
);

const ActivityItem = ({ activity }) => {
  const { candidate, description, timestamp } = activity;
  const dateStr = new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const badgeColors = {
    railway: "bg-[#008080] text-white",
    "non-railway": "bg-green-500 text-white",
  };
  const badgeClass =
    badgeColors[candidate.stream?.toLowerCase()] || "bg-[#FFA652] text-white";

  return (
    <li className="flex items-center p-3 hover:bg-white/50 rounded-lg transition-colors">
      {/* Avatar */}
      <div className="flex-shrink-0 mr-3">
        {
          <div className="w-10 h-10 bg-[#FF8D21] rounded-full flex items-center justify-center font-semibold text-white">
            {candidate.name?.[0]?.toUpperCase() || "?"}
          </div>
        }
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-semibold text-[#1B2A41] truncate"
          title={candidate.name}
        >
          {candidate.name}
        </p>
        <p className="text-xs text-gray-600 truncate" title={description}>
          {description}
        </p>
        <p className="text-xs text-gray-500">{dateStr}</p>
      </div>

      {/* Stream badge */}
      <span
        className={`ml-4 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${badgeClass}`}
      >
        {candidate.stream || "N/A"}
      </span>
    </li>
  );
};

const Summary = ({ total, active }) => {
  const rate = total > 0 ? Math.round((active / total) * 100) : 0;
  return (
    <div className="mt-6 pt-4 border-t border-orange-100">
      <div className="grid grid-cols-3 text-center gap-4">
        <Stat label="Total" value={total.toLocaleString()} />
        <Stat label="Active" value={active.toLocaleString()} highlight />
        <Stat label="Rate" value={`${rate}%`} />
      </div>
    </div>
  );
};

const Stat = ({ label, value, highlight }) => (
  <div>
    <p
      className={`text-xl font-bold ${highlight ? "text-[#008080]" : "text-[#1B2A41]"
        }`}
      title={`${value} ${label.toLowerCase()}`}
    >
      {value}
    </p>
    <p className="text-xs text-gray-600">{label}</p>
  </div>
);

export default ActivityPanel;
