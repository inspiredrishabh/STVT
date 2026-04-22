import React, { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';

const SearchFilters = ({
  searchTerm, setSearchTerm, filterBatch, setFilterBatch,
  dropdownData, onClearFilters, mockAPI
}) => {
  const [loading, setLoading] = useState(false);
  const [dynamicDropdownData, setDynamicDropdownData] = useState(null);

  const hasActiveFilters = searchTerm || filterBatch;

  // Fetch fresh dropdown data when component mounts or when data changes
  useEffect(() => {
    const fetchDropdownData = async () => {
      if (!mockAPI) return;

      setLoading(true);
      try {
        const response = await mockAPI.getDropdownData();
        if (response.success) {
          setDynamicDropdownData(response.data);
        }
      } catch (error) {
        console.error('Error fetching dropdown data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDropdownData();
  }, [mockAPI]);

  // Use dynamically fetched data if available, otherwise fallback to passed dropdownData
  const currentDropdownData = dynamicDropdownData || dropdownData || {
    batches: [],
    streams: [],
    workInfo: []
  };

  if (loading && !dropdownData) {
    return (
      <div className="bg-white p-6 rounded-3xl shadow-lg border-2 border-orange-100">
        <div className="animate-pulse">
          <div className="h-6 bg-[#FFA652] rounded mb-4 w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-[#FFA652] rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-orange-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-black" />
          <h3 className="text-lg font-semibold text-[#1B2A41]">Search & Filter</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center space-x-1 text-sm text-gray-600 hover:text-black transition-colors"
          >
            <X className="h-4 w-4" />
            <span>Clear all</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SearchInput value={searchTerm} onChange={setSearchTerm} />
        <FilterSelect
          value={filterBatch}
          onChange={setFilterBatch}
          options={currentDropdownData.batches}
          placeholder="All Batches"
        />
      </div>
    </div>
  );
};

const baseInputClasses = `
  w-full px-4 py-3 rounded-lg border-2 border-gray-300
  bg-white text-[#1B2A41] shadow-md
  focus:border-orange-200 focus:ring-4 focus:ring-orange-200/20 focus:shadow-lg
  transition-all duration-200 ease-in-out
  placeholder-gray-400
  hover:border-orange-200 hover:shadow
`;

const SearchInput = ({ value, onChange }) => (
  <div className="relative group">
    <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-black h-5 w-5 transition-colors" />
    <input
      type="text"
      placeholder="Search by name, email, or Ticket No..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`${baseInputClasses} pl-11`}
    />
  </div>
);

const FilterSelect = ({ value, onChange, options, placeholder }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className={`${baseInputClasses} appearance-none cursor-pointer`}
  >
    <option value="">{placeholder}</option>
    {options.map(option => (
      <option key={option} value={option}>{option}</option>
    ))}
  </select>
);

export default SearchFilters;