import React, { useState, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Clock, Plus, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * ActivityPanel Component
 * 
 * Displays recent candidate activity and provides quick access to add new candidates.
 * Integrates with mock API for activity data and provides real-time updates.
 * 
 * @param {Object} props - Component props
 * @param {Array} props.candidates - Array of candidate objects
 * @param {Function} props.onAddNew - Callback function for adding new candidates
 * @param {Object} props.mockAPI - Mock API instance for data operations
 */
const ActivityPanel = ({ candidates = [], onAddNew, mockAPI }) => {
  const navigate = useNavigate();
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Memoized recent candidates sorted by joining date
  const recentCandidates = useMemo(() => {
    if (!candidates.length) return [];

    try {
      return [...candidates]
        .sort((a, b) => {
          const dateA = new Date(a.dateOfJoiningStcWtcNonRailway || 0);
          const dateB = new Date(b.dateOfJoiningStcWtcNonRailway || 0);
          return dateB - dateA;
        })
        .slice(0, 5);
    } catch (err) {
      console.error('Error processing candidates:', err);
      return [];
    }
  }, [candidates]);

  // Memoized active candidate count for performance
  const activeCount = useMemo(() =>
    candidates.filter(candidate => candidate.status === 'Active').length,
    [candidates]
  );

  // Fetch recent activity from mock API
  const fetchRecentActivity = useCallback(async () => {
    if (!mockAPI || !recentCandidates.length) return;

    setLoading(true);
    setError(null);

    try {
      // Simulate API delay for realistic behavior
      await new Promise(resolve => setTimeout(resolve, 200));

      // Transform candidate data into activity format
      const activity = recentCandidates.map(candidate => ({
        id: candidate.id,
        type: 'join',
        candidate,
        timestamp: candidate.dateOfJoiningStcWtcNonRailway,
        description: `${candidate.name} joined as ${candidate.workInfo}`
      }));

      setRecentActivity(activity);
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      setError('Failed to load recent activity');
      setRecentActivity([]);
    } finally {
      setLoading(false);
    }
  }, [mockAPI, recentCandidates]);

  // Effect to fetch activity when dependencies change
  useEffect(() => {
    fetchRecentActivity();
  }, [fetchRecentActivity]);

  // Handle add new candidate button click
  const handleAddNewClick = useCallback(() => {
    try {
      if (onAddNew) {
        onAddNew();
      } else {
        navigate('/add-candidate');
      }
    } catch (err) {
      console.error('Error handling add new click:', err);
    }
  }, [onAddNew, navigate]);

  return (
    <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-200 h-full flex flex-col">
      {/* Add New Candidate Button */}
      <AddCandidateButton onClick={handleAddNewClick} />

      {/* Recent Activity Header */}
      <ActivityHeader />

      {/* Activity Content */}
      <div className="flex-1 min-h-0">
        {error ? (
          <ErrorState error={error} onRetry={fetchRecentActivity} />
        ) : loading ? (
          <MemoizedLoadingSkeleton />
        ) : recentActivity.length > 0 ? (
          <ActivityList activities={recentActivity} />
        ) : (
          <MemoizedEmptyState />
        )}
      </div>

      {/* Activity Summary */}
      {candidates.length > 0 && (
        <MemoizedActivitySummary
          total={candidates.length}
          active={activeCount}
        />
      )}
    </div>
  );
};

/**
 * Loading Skeleton Component
 * Provides visual feedback during data loading
 */
const LoadingSkeleton = () => (
  <div className="space-y-4" role="status" aria-label="Loading recent activity">
    {Array.from({ length: 5 }, (_, index) => (
      <div key={index} className="flex items-center space-x-4 p-3 animate-pulse">
        {/* Avatar skeleton */}
        <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0" />

        {/* Content skeleton */}
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
          <div className="h-3 bg-gray-200 rounded w-1/3" />
        </div>

        {/* Badge skeleton */}
        <div className="w-16 h-6 bg-gray-200 rounded-full flex-shrink-0" />
      </div>
    ))}
    <span className="sr-only">Loading activity data...</span>
  </div>
);

/**
 * Error State Component
 * Displays when there's an error loading activity data
 */
const ErrorState = ({ error, onRetry }) => (
  <div className="flex-1 flex items-center justify-center py-8">
    <div className="text-center max-w-sm">
      <div className="mx-auto mb-4 p-3 bg-red-100 rounded-full w-fit">
        <Activity className="h-8 w-8 text-red-500" />
      </div>
      <h4 className="text-sm font-medium text-gray-800 mb-2">
        Unable to Load Activity
      </h4>
      <p className="text-xs text-gray-500 mb-4 leading-relaxed">
        {error || 'Something went wrong while loading recent activity.'}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  </div>
);

/**
 * Empty State Component
 * Displays when no activity data is available
 */
const EmptyState = () => (
  <div className="flex-1 flex items-center justify-center py-8">
    <div className="text-center max-w-sm">
      <div className="mx-auto mb-4 p-3 bg-gray-100 rounded-full w-fit">
        <Clock className="h-8 w-8 text-gray-400" />
      </div>
      <h4 className="text-sm font-medium text-gray-800 mb-2">
        No Recent Activity
      </h4>
      <p className="text-xs text-gray-500 leading-relaxed">
        When candidates join or update their information, their activity will appear here.
      </p>
    </div>
  </div>
);

/**
 * Activity List Component
 * Renders the list of recent activities with proper accessibility
 * 
 * @param {Array} activities - Array of activity objects to display
 */
const ActivityList = ({ activities }) => {
  if (!activities || activities.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <ul
        className="space-y-2"
        role="list"
        aria-label="Recent candidate activities"
      >
        {activities.map((activity, index) => (
          <MemoizedActivityItem
            key={activity.id || index}
            activity={activity}
          />
        ))}
      </ul>
    </div>
  );
};

/**
 * Add Candidate Button Component
 */
const AddCandidateButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-pink-600 text-white rounded-xl hover:bg-pink-700 transition-all duration-200 shadow-lg mb-6"
    type="button"
    aria-label="Add new candidate"
  >
    <Plus className="h-5 w-5" />
    <span className="font-semibold">Add New Candidate</span>
  </button>
);

/**
 * Activity Header Component
 */
const ActivityHeader = () => (
  <div className="flex items-center space-x-3 mb-4">
    <div className="p-2 bg-blue-100 rounded-xl">
      <Activity className="h-5 w-5 text-blue-600" />
    </div>
    <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
  </div>
);

/**
 * Activity Item Component
 * 
 * @param {Object} activity - Activity object containing candidate data
 */
const ActivityItem = ({ activity }) => {
  const { candidate, timestamp } = activity;

  // Ensure candidate data exists
  if (!candidate) {
    return null;
  }

  // Get stream-specific styling
  const getStreamBadgeClass = (stream) => {
    switch (stream?.toLowerCase()) {
      case 'railway':
        return 'bg-blue-100 text-blue-800';
      case 'non-railway':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format date with fallback
  const formatDate = (date) => {
    try {
      return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return 'Date unavailable';
    }
  };

  const streamBadgeClass = getStreamBadgeClass(candidate.stream);

  return (
    <li
      className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-150"
      role="listitem"
    >
      {/* Candidate Avatar */}
      <div className="flex-shrink-0">
        {candidate.picture ? (
          <img
            src={candidate.picture}
            alt={`${candidate.name}'s profile`}
            className="w-10 h-10 rounded-full object-cover border border-gray-200"
            loading="lazy"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div
          className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold"
          style={{ display: candidate.picture ? 'none' : 'flex' }}
        >
          {candidate.name?.charAt(0)?.toUpperCase() || '?'}
        </div>
      </div>

      {/* Candidate Details */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-800 text-sm truncate" title={candidate.name}>
          {candidate.name || 'Unknown Candidate'}
        </p>
        <p className="text-xs text-gray-500 truncate" title={candidate.workInfo}>
          {candidate.workInfo ? `Joined as ${candidate.workInfo}` : 'Work info unavailable'}
        </p>
        <p className="text-xs text-gray-400">
          {formatDate(timestamp)}
        </p>
      </div>

      {/* Stream Badge */}
      <div className="flex-shrink-0">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${streamBadgeClass}`}>
          {candidate.stream || 'N/A'}
        </span>
      </div>
    </li>
  );
};

/**
 * Activity Summary Component
 * Displays summary statistics for candidates
 * 
 * @param {number} total - Total number of candidates
 * @param {number} active - Number of active candidates
 */
const ActivitySummary = ({ total, active }) => {
  const inactiveCount = total - active;
  const activePercentage = total > 0 ? Math.round((active / total) * 100) : 0;

  return (
    <div className="mt-6 pt-4 border-t border-gray-200">
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="p-2">
          <p className="text-xl font-bold text-gray-900" title={`${total} total candidates`}>
            {total.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 font-medium">Total</p>
        </div>
        <div className="p-2">
          <p className="text-xl font-bold text-green-600" title={`${active} active candidates`}>
            {active.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 font-medium">Active</p>
        </div>
        <div className="p-2">
          <p className="text-xl font-bold text-gray-500" title={`${activePercentage}% active rate`}>
            {activePercentage}%
          </p>
          <p className="text-xs text-gray-500 font-medium">Rate</p>
        </div>
      </div>
    </div>
  );
};

// PropTypes for type checking
ActivityPanel.propTypes = {
  candidates: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      workInfo: PropTypes.string,
      dateOfJoiningStcWtcNonRailway: PropTypes.string,
      status: PropTypes.string,
      stream: PropTypes.string,
      picture: PropTypes.string,
    })
  ),
  onAddNew: PropTypes.func,
  mockAPI: PropTypes.object,
};

ActivityPanel.defaultProps = {
  candidates: [],
  onAddNew: null,
  mockAPI: null,
};

// Memoize sub-components for better performance
const MemoizedActivityItem = React.memo(ActivityItem);
const MemoizedLoadingSkeleton = React.memo(LoadingSkeleton);
const MemoizedEmptyState = React.memo(EmptyState);
const MemoizedActivitySummary = React.memo(ActivitySummary);

export default ActivityPanel;