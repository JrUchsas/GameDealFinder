import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from '../components/SearchBar';
import GameList from '../components/GameList';
import DealDetails from '../components/DealDetails';
import FilterSidebar from '../components/FilterSidebar';

const API_BASE = 'http://localhost:5000/api';

function Home() {
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  
  // Feature 1: Filter State
  const [filters, setFilters] = useState({
    sortBy: 'Deal Rating',
    upperPrice: 50,
    metacritic: 0,
    onSale: false,
    title: ''
  });

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await axios.get(`${API_BASE}/stores`);
        setStores(response.data);
      } catch (err) {
        console.error('Error fetching stores:', err);
      }
    };
    fetchStores();
    // Load trending deals on mount
    handleApplyFilters();
  }, []);

  const handleApplyFilters = async (searchTitle = '') => {
    setLoading(true);
    setError(null);
    setSelectedGame(null);
    setHasSearched(true);
    
    try {
      const params = {
        sortBy: filters.sortBy,
        upperPrice: filters.upperPrice,
        metacritic: filters.metacritic,
        onSale: filters.onSale ? 1 : 0,
      };

      if (searchTitle || filters.title) {
        params.title = searchTitle || filters.title;
      }

      const response = await axios.get(`${API_BASE}/deals`, { params });
      setGames(response.data);
    } catch (err) {
      setError('Failed to fetch deals. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (title) => {
    setFilters(prev => ({ ...prev, title }));
    handleApplyFilters(title);
  };

  const handleSelectGame = async (gameID) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE}/games/${gameID}`);
      setSelectedGame(response.data);
    } catch (err) {
      setError('Failed to fetch game details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center mb-10">
        <h1 className="text-4xl font-extrabold text-blue-500 mb-2">Game Deal Finder</h1>
        <p className="text-gray-400 mb-6">Find the best prices across all digital stores</p>
        <SearchBar onSearch={handleSearch} />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:block">
          <FilterSidebar 
            filters={filters} 
            setFilters={setFilters} 
            onApply={() => handleApplyFilters()} 
          />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {loading && (
            <div className="flex justify-center my-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded my-6 text-center">
              {error}
            </div>
          )}

          {!loading && selectedGame && (
            <button
              onClick={() => setSelectedGame(null)}
              className="mb-4 text-blue-400 hover:text-blue-300 flex items-center gap-2 transition-colors"
            >
              ← Back to results
            </button>
          )}

          {selectedGame ? (
            <DealDetails gameData={selectedGame} stores={stores} />
          ) : (
            <GameList games={games} onSelectGame={handleSelectGame} />
          )}

          {!loading && games.length === 0 && !selectedGame && !error && (
            <div className="text-center my-20">
              <p className="text-2xl text-gray-500 italic">
                {hasSearched ? 'No deals found matching your criteria.' : 'Start searching to find amazing deals!'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
