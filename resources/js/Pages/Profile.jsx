import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { usePage } from '@inertiajs/react';
import Navbar from '../Components/Navbar';
import DealDetails from '../Components/DealDetails';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

function Profile() {
  const [savedGames, setSavedGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [activeNumericID, setActiveNumericID] = useState(null);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [crackData, setCrackData] = useState({});
  const [error, setError] = useState(null);
  const [preferences, setPreferences] = useState({ language: 'en', currency: 'USD' });
  const [prefSaving, setPrefSaving] = useState(false);
  const [prefMessage, setPrefMessage] = useState('');

  const { auth } = usePage().props;
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gamesRes, storesRes, prefRes] = await Promise.all([
          axios.get('/api/user/saved-games'),
          axios.get('/api/stores'),
          axios.get('/api/user/preferences'),
        ]);
        
        setSavedGames(gamesRes.data);
        setStores(storesRes.data);
        setPreferences(prefRes.data);
        
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
  }, []);

  const handleSelectGame = async (game) => {
    setDetailsLoading(true);
    setError(null);
    let gameID = game.game_id;

    try {
      if (isNaN(gameID)) {
        const searchRes = await axios.get(`/api/games/search?title=${encodeURIComponent(game.title)}`);
        const match = searchRes.data.find(g => g.external.toLowerCase() === game.title.toLowerCase()) || searchRes.data[0];
        if (match) {
          gameID = match.gameID;
        } else {
          throw new Error('Could not find numeric ID for this game.');
        }
      }

      setActiveNumericID(gameID);
      const response = await axios.get(`/api/games/${gameID}`);
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
      const response = await axios.get(`/api/user/crack-status/${encodeURIComponent(title)}`);
      const info = response.data;
      
      setCrackData(prev => ({
        ...prev,
        [title]: info
      }));
    } catch (err) {
      setCrackData(prev => ({ ...prev, [title]: null }));
    }
  };

  const removeGame = async (e, gameId) => {
    e.stopPropagation();
    try {
      await axios.delete(`/api/user/saved-games/${gameId}`);
      setSavedGames(savedGames.filter(g => g.game_id !== gameId));
    } catch (err) {
      console.error('Error removing game:', err);
    }
  };

  const handleSavePreferences = async () => {
    setPrefSaving(true);
    setPrefMessage('');
    try {
      const res = await axios.put('/api/user/preferences', preferences);
      setPreferences(res.data);
      i18n.changeLanguage(res.data.language);
      setPrefMessage('Preferences saved!');
      setTimeout(() => setPrefMessage(''), 3000);
    } catch (err) {
      setPrefMessage('Failed to save preferences.');
    } finally {
      setPrefSaving(false);
    }
  };

  const getCleanTitle = (title) => {
    return title.replace(/\b(DIRECTORS?|CUT|GOTY|GAME OF THE YEAR|DELUXE|ULTIMATE|ENHANCED|REMASTERED|REMAKE|EDITION)\b/gi, '').trim();
  };

  const open1337x = (e, gameTitle) => {
    e.stopPropagation();
    const cleanName = getCleanTitle(gameTitle);
    window.open(`https://1337x.to/search/${encodeURIComponent(cleanName)}/1/`, '_blank', 'noopener,noreferrer');
  };

  const openFitGirl = (e, gameTitle) => {
    e.stopPropagation();
    const cleanName = getCleanTitle(gameTitle);
    window.open(`https://fitgirl-repacks.site/?s=${encodeURIComponent(cleanName)}`, '_blank', 'noopener,noreferrer');
  };

  const openDodi = (e, gameTitle) => {
    e.stopPropagation();
    const cleanName = getCleanTitle(gameTitle);
    window.open(`https://dodi-repacks.site/?s=${encodeURIComponent(cleanName)}`, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex flex-col">
      <Head title="My Profile" />
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-12">
        {/* Preferences Section */}
        <div className="mb-12 bg-gray-800 rounded-2xl border border-gray-700 p-8 max-w-2xl">
          <h3 className="text-xl font-bold text-blue-400 mb-6 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {t('Preferences')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">{t('Language')}</label>
              <select
                value={preferences.language}
                onChange={(e) => setPreferences(prev => ({ ...prev, language: e.target.value }))}
                className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">{t('Currency')}</label>
              <select
                value={preferences.currency}
                onChange={(e) => setPreferences(prev => ({ ...prev, currency: e.target.value }))}
                className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-4">
            <button
              onClick={handleSavePreferences}
              disabled={prefSaving}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2 rounded-lg transition-colors"
            >
              {prefSaving ? 'Saving...' : t('Save Changes')}
            </button>
            {prefMessage && (
              <span className={`text-sm font-medium ${prefMessage.includes('saved') ? 'text-green-400' : 'text-red-400'}`}>
                {prefMessage}
              </span>
            )}
          </div>
        </div>

        {/* Wishlist Section */}
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
              Back to Wishlist
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
                    <a 
                      href="/"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold transition-all inline-block"
                    >
                      Go Find Deals
                    </a>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {savedGames.map(game => {
                      const info = crackData[game.title];
                      const isCracked = info && info.is_cracked;
                      const isUnreleased = info && info.is_unreleased_game;
                      const group = info && info.hacked_groups;

                      return (
                        <div 
                          key={game.game_id || game._id} 
                          onClick={() => handleSelectGame(game)}
                          className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 flex flex-col group hover:border-blue-500 transition-all cursor-pointer"
                        >
                          <img src={game.thumb} alt={game.title} className="w-full h-44 object-cover" />
                          <div className="p-6 flex-grow flex flex-col">
                            <h3 className="text-xl font-bold mb-3 text-gray-100 line-clamp-2 group-hover:text-blue-400 transition-colors">
                              {game.title}
                            </h3>

                            {/* Status & Release Group */}
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                                isCracked ? 'bg-green-900/50 text-green-400 border border-green-800' : 
                                isUnreleased ? 'bg-blue-900/50 text-blue-400 border border-blue-800' : 
                                info ? 'bg-red-900/50 text-red-400 border border-red-800' :
                                'bg-gray-700 text-gray-300'
                              }`}>
                                {isCracked ? 'CRACKED' : isUnreleased ? 'UNRELEASED' : info ? 'UNCRACKED' : 'Checking...'}
                              </span>

                              {isCracked && group && (
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-900/40 text-purple-300 border border-purple-800">
                                  by {group}
                                </span>
                              )}

                              {isCracked && (
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1">
                                  ✔ Repack Verified
                                </span>
                              )}
                            </div>

                            {/* Verified Repack Mirror Links */}
                            {isCracked && (
                              <div className="mb-4 space-y-1.5 bg-gray-900/40 p-2.5 rounded-lg border border-gray-700/60">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Repack Mirrors</span>
                                
                                <button
                                  onClick={(e) => openFitGirl(e, game.title)}
                                  className="w-full bg-gray-800 hover:bg-gray-700 text-pink-300 font-bold py-1.5 px-3 rounded text-xs flex items-center justify-between transition-all border border-gray-700"
                                >
                                  <span>🌸 FitGirl Repacks</span>
                                  <span className="text-[10px] text-gray-400">Download →</span>
                                </button>

                                <button
                                  onClick={(e) => openDodi(e, game.title)}
                                  className="w-full bg-gray-800 hover:bg-gray-700 text-amber-300 font-bold py-1.5 px-3 rounded text-xs flex items-center justify-between transition-all border border-gray-700"
                                >
                                  <span>⚡ DODI Repacks</span>
                                  <span className="text-[10px] text-gray-400">Download →</span>
                                </button>

                                <button
                                  onClick={(e) => open1337x(e, game.title)}
                                  className="w-full bg-gray-800 hover:bg-gray-700 text-emerald-400 font-bold py-1.5 px-3 rounded text-xs flex items-center justify-between transition-all border border-gray-700"
                                >
                                  <span>🏴‍☠️ 1337x Torrent Search</span>
                                  <span className="text-[10px] text-gray-400">Search →</span>
                                </button>
                              </div>
                            )}

                            <div className="mt-auto flex justify-end items-center pt-2">
                              <button 
                                onClick={(e) => removeGame(e, game.game_id)}
                                className="text-red-400 hover:text-red-300 text-xs font-bold transition-colors"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </main>

      <footer className="border-t border-gray-800 py-8 mt-auto text-center text-gray-500 text-sm">
        <p>Data provided by CheapShark API & GameStatus</p>
      </footer>
    </div>
  );
}

export default Profile;
