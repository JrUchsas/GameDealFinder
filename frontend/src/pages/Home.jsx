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
  const [activeNumericID, setActiveNumericID] = useState(null); // Explicitly track numeric ID
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [resultsTitle, setResultsTitle] = useState('Trending Deals');
  
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
    handleApplyFilters();
  }, []);

  const handleApplyFilters = async () => {
    setLoading(true);
    setError(null);
    setSelectedGame(null);
    setHasSearched(true);
    setResultsTitle('Filtered Deals');
    
    try {
      const params = {
        sortBy: filters.sortBy,
        upperPrice: filters.upperPrice,
        metacritic: filters.metacritic,
        onSale: filters.onSale ? 1 : 0,
      };

      if (filters.title) {
        params.title = filters.title;
      }

      const response = await axios.get(`${API_BASE}/deals`, { params });
      setGames(response.data);
    } catch (err) {
      setError('Failed to fetch deals. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (title) => {
    setLoading(true);
    setError(null);
    setSelectedGame(null);
    setHasSearched(true);
    setResultsTitle(`Results for "${title}"`);
    setFilters(prev => ({ ...prev, title })); 

    try {
      const response = await axios.get(`${API_BASE}/games/search?title=${encodeURIComponent(title)}`);
      setGames(response.data);
    } catch (err) {
      setError('Failed to search games. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectGame = async (gameID) => {
    setLoading(true);
    setError(null);
    setActiveNumericID(gameID);
    try {
      const response = await axios.get(`${API_BASE}/games/${gameID}`);
      setSelectedGame(response.data);
    } catch (err) {
      setError('Failed to fetch game details.');
      setActiveNumericID(null);
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
        <div className="w-full lg:w-72">
          <FilterSidebar 
            filters={filters} 
            setFilters={setFilters} 
            onApply={handleApplyFilters} 
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-200">
              {selectedGame ? 'Deal Comparison' : resultsTitle}
            </h2>
            {!loading && !selectedGame && games.length > 0 && (
              <span className="text-sm text-gray-500 bg-gray-800/50 px-3 py-1 rounded-full border border-gray-700">
                {games.length} results found
              </span>
            )}
          </div>

          {loading && (
            <div className="flex flex-col items-center justify-center my-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-400 animate-pulse">Hunting for the best deals...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded my-6 text-center shadow-lg">
              {error}
            </div>
          )}

          {!loading && (
            <>
              {selectedGame && (
                <button
                  onClick={() => {
                    setSelectedGame(null);
                    setActiveNumericID(null);
                  }}
                  className="mb-6 text-blue-400 hover:text-blue-300 flex items-center gap-2 transition-colors font-medium group"
                >
                  <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
                  Back to {resultsTitle}
                </button>
              )}

              {selectedGame ? (
                <DealDetails 
                  gameData={selectedGame} 
                  stores={stores} 
                  selectedGameID={activeNumericID}
                />
              ) : (
                <GameList games={games} onSelectGame={handleSelectGame} />
              )}

              {games.length === 0 && !selectedGame && !error && (
                <div className="text-center my-20 bg-gray-800/50 p-10 rounded-2xl border border-dashed border-gray-700">
                  <p className="text-2xl text-gray-500 italic mb-2">
                    {hasSearched ? 'No games or deals found matching your criteria.' : 'Start searching to find amazing deals!'}
                  </p>
                  <p className="text-gray-600">Try adjusting your filters or search term.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
