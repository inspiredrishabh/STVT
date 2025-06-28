import React from 'react';

const PageHeader = ({
  filterCategory,
  setFilterCategory,
  filterType,
  setFilterType,
  isListView,
  dropdownData
}) => (
  <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-200">
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Manage Candidates</h1>
        <p className="text-gray-600">View, filter, and manage all candidate records.</p>
      </div>

      {/* Filters are only shown in the list view */}
      {isListView && (
        <div className="flex flex-col gap-2">
          {/* Category Filter (Railway/Non Railway) */}
          <div className="flex items-center bg-gray-100 rounded-xl p-1 shadow-inner flex-wrap">
            <ToggleButton
              isActive={filterCategory === "All"}
              onClick={() => {
                setFilterCategory("All");
                setFilterType("All");
              }}
              text="All Candidates"
              className="bg-blue-600 hover:bg-blue-700"
            />
            <ToggleButton
              isActive={filterCategory === "Railway"}
              onClick={() => {
                setFilterCategory("Railway");
                setFilterType("All Railway");
              }}
              text="Railway"
              className="bg-green-600 hover:bg-green-700"
            />
            <ToggleButton
              isActive={filterCategory === "Non Railway"}
              onClick={() => {
                setFilterCategory("Non Railway");
                setFilterType("Non Railway");
              }}
              text="Non Railway"
              className="bg-red-600 hover:bg-red-700"
            />
          </div>

          {/* Sub-Type Filter (STC/WTC) - Only show when Railway is selected */}
          {filterCategory === "Railway" && (
            <div className="flex items-center bg-gray-50 rounded-xl p-1 shadow-inner flex-wrap">
              <ToggleButton
                isActive={filterType === "All Railway"}
                onClick={() => setFilterType("All Railway")}
                text="All Railway"
                className="bg-gray-600 hover:bg-gray-700"
              />
              <ToggleButton
                isActive={filterType === "STC"}
                onClick={() => setFilterType("STC")}
                text="STC"
                className="bg-purple-600 hover:bg-purple-700"
              />
              <ToggleButton
                isActive={filterType === "WTC"}
                onClick={() => setFilterType("WTC")}
                text="WTC"
                className="bg-indigo-600 hover:bg-indigo-700"
              />
            </div>
          )}
        </div>
      )}
    </div>
  </div>
);

const ToggleButton = ({ isActive, onClick, text, className }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm whitespace-nowrap ${isActive
      ? `text-white shadow-md ${className}`
      : 'text-gray-600 hover:text-gray-800 hover:bg-white/80'
      }`}
  >
    {text}
  </button>
);

export default PageHeader;