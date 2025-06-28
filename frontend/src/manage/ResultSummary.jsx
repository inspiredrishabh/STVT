import React from 'react';

const ResultsSummary = ({ filteredCount, totalCount, searchTerm, filterBatch, filterBranch }) => {
  const hasActiveFilters = searchTerm || filterBatch || filterBranch;

  return (
    <div className="bg-white rounded-3xl p-4 border border-gray-200 shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
          <span className="text-gray-700 font-medium">
            Showing {filteredCount} of {totalCount} candidates
          </span>
        </div>
        {hasActiveFilters && (
          <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
            <span>Filters applied:</span>
            {searchTerm && <FilterTag label="Search" value={searchTerm} className="bg-blue-100 text-blue-800" />}
            {filterBatch && <FilterTag label="Batch" value={filterBatch} className="bg-green-100 text-green-800" />}
            {filterBranch && <FilterTag label="Branch" value={filterBranch} className="bg-purple-100 text-purple-800" />}
          </div>
        )}
      </div>
    </div>
  );
};

const FilterTag = ({ label, value, className }) => (
  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
    {label}: <span className="font-semibold">{value}</span>
  </span>
);

export default ResultsSummary;