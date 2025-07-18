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
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Manage Candidates</h1>
          <p className="text-gray-500 text-sm">View, filter, and manage all candidate records.</p>
        </div>

        {/* Filters are only shown in the list view */}
        {isListView && (
          <div className="flex flex-col gap-2">
            {/* Main Filter Categories */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1 flex-wrap gap-1">
              <ToggleButton
                isActive={areAllSelected()}
                onClick={toggleAllFilters}
                text="All"
                activeClassName="bg-blue-600 text-white"
              />
              <ToggleButton
                isActive={selectedFilters.includes('STC')}
                onClick={() => toggleFilter('STC')}
                text="STC"
                activeClassName="bg-blue-500 text-white"
              />
              <ToggleButton
                isActive={selectedFilters.includes('WTC')}
                onClick={() => toggleFilter('WTC')}
                text="WTC"
                activeClassName="bg-green-500 text-white"
              />
              <ToggleButton
                isActive={selectedFilters.includes('Non Railway')}
                onClick={() => toggleFilter('Non Railway')}
                text="Non Railway"
                activeClassName="bg-gray-500 text-white"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ToggleButton = ({ isActive, onClick, text, activeClassName }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-md font-medium transition-all duration-200 text-sm whitespace-nowrap ${isActive
      ? `${activeClassName} shadow-sm`
      : 'text-gray-600 hover:bg-gray-200'
      }`}
  >
    {text}
  </button>
);

export default PageHeader;