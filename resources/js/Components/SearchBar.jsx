import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl flex gap-2">
      <input
        type="text"
        placeholder="Search for games..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
      />
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-lg transition-colors"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
