import React from 'react';

const PageHeader = ({
  selectedFilters,
  setSelectedFilters,
  isListView,
  dropdownData
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

  // Function to select all filters
  const selectAllFilters = () => {
    setSelectedFilters(['STC', 'WTC', 'Non Railway']);
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-200">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Manage Candidates</h1>
          <p className="text-gray-600">View, filter, and manage all candidate records.</p>
        </div>

        {/* Filters are only shown in the list view */}
        {isListView && (
          <div className="flex flex-col gap-2">
            {/* Main Filter Categories */}
            <div className="flex items-center bg-gray-100 rounded-xl p-1 shadow-inner flex-wrap gap-1">
              <ToggleButton
                isActive={areAllSelected()}
                onClick={selectAllFilters}
                text="All"
                className="bg-blue-600 hover:bg-blue-700"
              />
              <ToggleButton
                isActive={selectedFilters.includes('STC')}
                onClick={() => toggleFilter('STC')}
                text="STC"
                className="bg-purple-600 hover:bg-purple-700"
              />
              <ToggleButton
                isActive={selectedFilters.includes('WTC')}
                onClick={() => toggleFilter('WTC')}
                text="WTC"
                className="bg-indigo-600 hover:bg-indigo-700"
              />
              <ToggleButton
                isActive={selectedFilters.includes('Non Railway')}
                onClick={() => toggleFilter('Non Railway')}
                text="Non Railway"
                className="bg-red-600 hover:bg-red-700"
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
      : 'text-gray-600 hover:text-gray-800 hover:bg-white/80'
      }`}
  >
    {text}
  </button>
);

export default PageHeader;