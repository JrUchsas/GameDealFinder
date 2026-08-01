import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../Components/Navbar';
import SearchBar from '../Components/SearchBar';
import GameList from '../Components/GameList';
import DealDetails from '../Components/DealDetails';
import FilterSidebar from '../Components/FilterSidebar';
import { Head } from '@inertiajs/react';

function Home() {
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [activeNumericID, setActiveNumericID] = useState(null);
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
    handleApplyFilters();
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const response = await axios.get('/api/stores');
      setStores(response.data);
    } catch (err) {
      console.error('Error fetching stores:', err);
    }
  };

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

      const response = await axios.get('/api/deals', { params });
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
      const response = await axios.get(`/api/games/search?title=${encodeURIComponent(title)}`);
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
      const response = await axios.get(`/api/games/${gameID}`);
      setSelectedGame(response.data);
    } catch (err) {
      setError('Failed to fetch game details.');
      setActiveNumericID(null);
    } finally {
      setLoading(false);
    }
  };

  // Find the top discount deal for the Steal of the Day hero banner
  const stealOfTheDay = games && games.length > 0
    ? [...games].sort((a, b) => (parseFloat(b.savings) || 0) - (parseFloat(a.savings) || 0))[0]
    : null;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex flex-col">
      <Head title="Home - Find Game Deals" />
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-4xl font-extrabold text-blue-500 mb-2">Game Deal Finder</h1>
          <p className="text-gray-400 mb-6 font-medium">Find the best prices across all digital stores</p>
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Steal of the Day Hero Banner */}
        {stealOfTheDay && !selectedGame && (
          <div className="mb-10 bg-gradient-to-r from-blue-950 via-gray-900 to-indigo-950 p-6 md:p-8 rounded-2xl border border-blue-500/40 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="absolute -top-12 -left-12 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="relative z-10 flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-xs font-black uppercase tracking-wider mb-3">
                🔥 Steal of the Day — {Math.round(parseFloat(stealOfTheDay.savings || 0))}% OFF
              </div>
              <h2 className="text-3xl font-black text-white mb-2 leading-tight">{stealOfTheDay.title || stealOfTheDay.external}</h2>
              <p className="text-gray-400 text-sm mb-4">Unbeatable price discount available right now across verified storefronts!</p>
              
              <div className="flex items-center gap-4">
                <span className="text-3xl font-black text-emerald-400">${stealOfTheDay.salePrice || stealOfTheDay.cheapest}</span>
                {stealOfTheDay.normalPrice && (
                  <span className="text-gray-500 line-through text-lg font-medium">${stealOfTheDay.normalPrice}</span>
                )}
                <button
                  onClick={() => handleSelectGame(stealOfTheDay.gameID)}
                  className="ml-auto bg-blue-600 hover:bg-blue-500 text-white font-extrabold px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-900/30 active:scale-95 text-sm"
                >
                  View Deal Comparison
                </button>
              </div>
            </div>

            <div className="relative z-10 w-full md:w-48 shrink-0 aspect-[16/9] md:aspect-square overflow-hidden rounded-xl border border-gray-700 shadow-xl bg-gray-900">
              <img src={stealOfTheDay.thumb} alt={stealOfTheDay.title} className="w-full h-full object-cover" />
            </div>
          </div>
        )}

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
      </main>

      <footer className="border-t border-gray-800 py-8 mt-auto text-center text-gray-500 text-sm">
        <p>Data provided by CheapShark API & GameStatus</p>
      </footer>
    </div>
  );
}

export default Home;
