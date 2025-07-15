import React from 'react';

const ResultsSummary = ({ filteredCount, totalCount, searchTerm, filterBatch, filterBranch }) => {
  const hasActiveFilters = searchTerm || filterBatch || filterBranch;

  return (
    <div className="bg-white rounded-3xl p-4 border-2 border-orange-200 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
          <span className="text-gray-900 font-medium">
            Showing {filteredCount} of {totalCount} candidates
          </span>
        </div>
        {hasActiveFilters && (
          <div className="hidden md:flex items-center space-x-2 text-sm text-gray-700">
            <span>Filters applied:</span>
            {searchTerm && <FilterTag label="Search" value={searchTerm} className="bg-gray-100 text-black" />}
            {filterBatch && <FilterTag label="Batch" value={filterBatch} className="bg-gray-100 text-black" />}
            {filterBranch && <FilterTag label="Branch" value={filterBranch} className="bg-gray-100 text-black" />}
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