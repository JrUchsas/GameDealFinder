import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex justify-center my-6">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for a game..."
        className="px-4 py-2 w-full max-w-md rounded-l-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
      />
      <button
        type="submit"
        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-r-lg font-semibold transition-colors"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
