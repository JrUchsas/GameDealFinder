import React from 'react';

const FilterSidebar = ({ filters, setFilters, onApply }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 w-full lg:w-72 h-fit space-y-6">
      <h3 className="text-xl font-bold text-blue-400 mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
        </svg>
        Filters
      </h3>

      {/* Sort By */}
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">Sort By</label>
        <select
          name="sortBy"
          value={filters.sortBy}
          onChange={handleChange}
          className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Deal Rating">Deal Rating</option>
          <option value="Title">Title</option>
          <option value="Savings">Savings</option>
          <option value="Price">Price</option>
          <option value="Metacritic">Metacritic</option>
          <option value="Reviews">Reviews</option>
        </select>
      </div>

      {/* Price Range */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Max Price (${filters.upperPrice})</label>
          <input
            type="range"
            name="upperPrice"
            min="0"
            max="50"
            value={filters.upperPrice}
            onChange={handleChange}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>
      </div>

      {/* Ratings */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Min. Metacritic ({filters.metacritic})</label>
          <input
            type="range"
            name="metacritic"
            min="0"
            max="100"
            step="10"
            value={filters.metacritic}
            onChange={handleChange}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>
      </div>

      {/* On Sale Toggle */}
      <div className="flex items-center gap-3 py-2">
        <input
          type="checkbox"
          name="onSale"
          id="onSale"
          checked={filters.onSale}
          onChange={handleChange}
          className="w-4 h-4 rounded border-gray-600 bg-gray-900 text-blue-500 focus:ring-blue-500"
        />
        <label htmlFor="onSale" className="text-sm font-medium text-gray-300 cursor-pointer">
          Show On Sale Only
        </label>
      </div>

      <button
        onClick={onApply}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-lg shadow-blue-900/20"
      >
        Apply Filters
      </button>
    </div>
  );
};

export default FilterSidebar;
