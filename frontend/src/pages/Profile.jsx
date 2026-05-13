import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const API_BASE = 'http://localhost:5000/api';

function Profile() {
  const { t, i18n } = useTranslation();
  const [savedGames, setSavedGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [crackStatuses, setCrackStatuses] = useState({});
  const [prefs, setPrefs] = useState({ language: 'en', currency: 'USD' });
  const [updateMsg, setUpdateMsg] = useState('');
  
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [gamesRes, prefsRes] = await Promise.all([
          axios.get(`${API_BASE}/user/saved-games`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${API_BASE}/user/preferences`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        
        setSavedGames(gamesRes.data);
        setPrefs(prefsRes.data);
        i18n.changeLanguage(prefsRes.data.language);
        
        // Fetch crack status for each game
        gamesRes.data.forEach(game => {
          fetchCrackStatus(game.title);
        });
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, navigate]);

  const handleUpdatePrefs = async () => {
    try {
      const res = await axios.put(`${API_BASE}/user/preferences`, prefs, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPrefs(res.data);
      i18n.changeLanguage(res.data.language);
      setUpdateMsg('Preferences updated!');
      setTimeout(() => setUpdateMsg(''), 3000);
    } catch (err) {
      setUpdateMsg('Failed to update.');
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

  const removeGame = async (gameId) => {
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Profile Info & Preferences */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-blue-500">{t('Preferences')}</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">{t('Language')}</label>
                <select 
                  value={prefs.language}
                  onChange={(e) => setPrefs({...prefs, language: e.target.value})}
                  className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">{t('Currency')}</label>
                <select 
                  value={prefs.currency}
                  onChange={(e) => setPrefs({...prefs, currency: e.target.value})}
                  className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
              
              <button 
                onClick={handleUpdatePrefs}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition-colors mt-4"
              >
                {t('Save Changes')}
              </button>
              
              {updateMsg && (
                <p className={`text-center text-sm font-medium ${updateMsg.includes('updated') ? 'text-green-400' : 'text-red-400'}`}>
                  {updateMsg}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Saved Games */}
        <div className="lg:col-span-2">
          <h2 className="text-3xl font-bold mb-8 text-blue-500">{t('My Saved Games')}</h2>
          {savedGames.length === 0 ? (
            <div className="text-center py-20 bg-gray-800 rounded-lg border border-gray-700">
              <p className="text-gray-400 text-xl">You haven't saved any games yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {savedGames.map(game => (
                <div key={game.gameId} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700 flex flex-col group hover:border-blue-500 transition-all">
                  <img src={game.thumb} alt={game.title} className="w-full h-40 object-cover" />
                  <div className="p-4 flex-grow">
                    <h3 className="text-xl font-bold mb-2 text-gray-100">{game.title}</h3>
                    <div className="flex justify-between items-center mt-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        crackStatuses[game.title] === 'Cracked' ? 'bg-green-900/50 text-green-400 border border-green-800' : 
                        crackStatuses[game.title] === 'Uncracked' ? 'bg-red-900/50 text-red-400 border border-red-800' : 'bg-gray-700 text-gray-300'
                      }`}>
                        {crackStatuses[game.title] || 'Checking status...'}
                      </span>
                      <button 
                        onClick={() => removeGame(game.gameId)}
                        className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
