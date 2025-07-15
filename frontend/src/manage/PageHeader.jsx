import React from 'react';

const PageHeader = ({
  selectedFilters,
  setSelectedFilters,
  isListView
}) => {
  // Function to toggle selected filters
  const toggleFilter = (filter) => {
    if (selectedFilters.includes(filter)) {
      // If filter is already selected, remove it
      setSelectedFilters(selectedFilters.filter(f => f !== filter));
    } else {
      // If filter isn't selected, add it
      setSelectedFilters([...selectedFilters, filter]);
    }
  };

  // Function to check if all filters are selected
  const areAllSelected = () => {
    return selectedFilters.includes('STC') &&
      selectedFilters.includes('WTC') &&
      selectedFilters.includes('Non Railway');
  };

  // Function to toggle all filters
  const toggleAllFilters = () => {
    if (areAllSelected()) {
      // If all are selected, clear all
      setSelectedFilters([]);
    } else {
      // Select all
      setSelectedFilters(['STC', 'WTC', 'Non Railway']);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg border-2 border-orange-100">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1B2A41] mb-1">Manage Candidates</h1>
          <p className="text-gray-600">View, filter, and manage all candidate records.</p>
        </div>

        {/* Filters are only shown in the list view */}
        {isListView && (
          <div className="flex flex-col gap-2">
            {/* Main Filter Categories */}
            <div className="flex items-center bg-white rounded-xl p-1 shadow-inner flex-wrap gap-1">
              <ToggleButton
                isActive={areAllSelected()}
                onClick={toggleAllFilters}
                text="All"
                className="bg-[#FF8D21] hover:bg-[#FFA652]"
              />
              <ToggleButton
                isActive={selectedFilters.includes('STC')}
                onClick={() => toggleFilter('STC')}
                text="STC"
                className="bg-[#008080] hover:bg-[#006666]"
              />
              <ToggleButton
                isActive={selectedFilters.includes('WTC')}
                onClick={() => toggleFilter('WTC')}
                text="WTC"
                className="bg-[#FFA652] hover:bg-[#FF8D21]"
              />
              <ToggleButton
                isActive={selectedFilters.includes('Non Railway')}
                onClick={() => toggleFilter('Non Railway')}
                text="Non Railway"
                className="bg-purple-500 hover:bg-purple-600"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ToggleButton = ({ isActive, onClick, text, className }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm whitespace-nowrap ${isActive
      ? `text-white shadow-md ${className}`
      : 'text-gray-600 hover:text-[#1B2A41] hover:bg-white/80'
      }`}
  >
    {text}
  </button>
);

export default PageHeader;