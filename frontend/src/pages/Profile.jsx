import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import DealDetails from '../components/DealDetails';

const API_BASE = 'http://localhost:5000/api';

function Profile() {
  const [savedGames, setSavedGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [activeNumericID, setActiveNumericID] = useState(null);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [crackStatuses, setCrackStatuses] = useState({});
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const token = sessionStorage.getItem('token');

  // Reset state when navigating to profile page
  useEffect(() => {
    setSelectedGame(null);
    setActiveNumericID(null);
    setError(null);
  }, [location]);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [gamesRes, storesRes] = await Promise.all([
          axios.get(`${API_BASE}/user/saved-games`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${API_BASE}/stores`)
        ]);
        
        setSavedGames(gamesRes.data);
        setStores(storesRes.data);
        
        gamesRes.data.forEach(game => {
          fetchCrackStatus(game.title);
        });
      } catch (err) {
        console.error('Error fetching profile data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, navigate]);

  const handleSelectGame = async (game) => {
    setDetailsLoading(true);
    setError(null);
    let gameID = game.gameId;

    try {
      // Check if gameID is numeric. If not, search for the ID first.
      if (isNaN(gameID)) {
        const searchRes = await axios.get(`${API_BASE}/games/search?title=${encodeURIComponent(game.title)}`);
        const match = searchRes.data.find(g => g.external.toLowerCase() === game.title.toLowerCase()) || searchRes.data[0];
        if (match) {
          gameID = match.gameID;
        } else {
          throw new Error('Could not find numeric ID for this game.');
        }
      }

      setActiveNumericID(gameID);
      const response = await axios.get(`${API_BASE}/games/${gameID}`);
      setSelectedGame(response.data);
    } catch (err) {
      console.error('Failed to fetch game details:', err);
      setError('Could not load game details. Please try again.');
      setActiveNumericID(null);
    } finally {
      setDetailsLoading(false);
    }
  };

  const fetchCrackStatus = async (title) => {
    try {
      const response = await axios.get(`${API_BASE}/user/crack-status/${encodeURIComponent(title)}`);
      const gameInfo = response.data;
      
      let status = 'Unknown';
      if (gameInfo) {
        if (gameInfo.is_cracked) {
          status = 'Cracked';
        } else if (gameInfo.is_unreleased_game) {
          status = 'Unreleased';
        } else {
          status = 'Uncracked';
        }
      } else {
        status = 'Not Cracked';
      }

      setCrackStatuses(prev => ({
        ...prev,
        [title]: status
      }));
    } catch (err) {
      setCrackStatuses(prev => ({ ...prev, [title]: 'Error' }));
    }
  };

  const removeGame = async (e, gameId) => {
    e.stopPropagation();
    try {
      await axios.delete(`${API_BASE}/user/saved-games/${gameId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSavedGames(savedGames.filter(g => g.gameId !== gameId));
    } catch (err) {
      console.error('Error removing game:', err);
    }
  };

  if (loading) return <div className="text-center mt-20">Loading profile...</div>;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-blue-500 mb-2">My Wishlist</h2>
          <p className="text-gray-400">Track your favorite games and their crack status</p>
        </div>
        {selectedGame && (
          <button
            onClick={() => {
              setSelectedGame(null);
              setActiveNumericID(null);
            }}
            className="text-blue-400 hover:text-blue-300 flex items-center gap-2 transition-colors font-medium group"
          >
            <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
            Back to Watchlist
          </button>
        )}
      </div>

      {detailsLoading && (
        <div className="flex flex-col items-center justify-center my-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-400">Fetching latest prices...</p>
        </div>
      )}

      {error && !detailsLoading && (
        <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded mb-8 text-center">
          {error}
        </div>
      )}

      {!detailsLoading && (
        <>
          {selectedGame ? (
            <DealDetails 
              gameData={selectedGame} 
              stores={stores} 
              selectedGameID={activeNumericID}
            />
          ) : (
            <>
              {savedGames.length === 0 ? (
                <div className="text-center py-20 bg-gray-800 rounded-2xl border border-gray-700 shadow-xl">
                  <p className="text-gray-400 text-xl mb-4">You haven't saved any games yet.</p>
                  <button 
                    onClick={() => navigate('/')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold transition-all"
                  >
                    Go Find Deals
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {savedGames.map(game => (
                    <div 
                      key={game.gameId} 
                      onClick={() => handleSelectGame(game)}
                      className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 flex flex-col group hover:border-blue-500 transition-all cursor-pointer"
                    >
                      <img src={game.thumb} alt={game.title} className="w-full h-44 object-cover" />
                      <div className="p-6 flex-grow flex flex-col">
                        <h3 className="text-xl font-bold mb-4 text-gray-100 line-clamp-2 group-hover:text-blue-400 transition-colors">
                          {game.title}
                        </h3>
                        
                        <div className="mt-auto flex justify-between items-center">
                          <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
                            crackStatuses[game.title] === 'Cracked' ? 'bg-green-900/50 text-green-400 border border-green-800' : 
                            crackStatuses[game.title] === 'Uncracked' ? 'bg-red-900/50 text-red-400 border border-red-800' : 
                            crackStatuses[game.title] === 'Unreleased' ? 'bg-blue-900/50 text-blue-400 border border-blue-800' :
                            'bg-gray-700 text-gray-300'
                          }`}>
                            {crackStatuses[game.title] || 'Checking...'}
                          </span>
                          
                          <button 
                            onClick={(e) => removeGame(e, game.gameId)}
                            className="text-red-400 hover:text-red-300 text-sm font-bold transition-colors opacity-0 group-hover:opacity-100"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default Profile;
