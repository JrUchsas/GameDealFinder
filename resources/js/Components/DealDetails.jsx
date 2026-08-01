import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { usePage } from '@inertiajs/react';
import PriceHistory from './PriceHistory';
import SystemRequirements from './SystemRequirements';

const DealDetails = ({ gameData, stores, selectedGameID }) => {
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [rawgDetails, setRawgDetails] = useState(null);
  const [rawgLoading, setRawgLoading] = useState(false);
  const [crackInfo, setCrackInfo] = useState(null);
  const [crackLoading, setCrackLoading] = useState(false);

  const { auth } = usePage().props;
  const isAuthenticated = !!(auth && auth.user);

  useEffect(() => {
    if (gameData && gameData.info) {
      fetchRawgDetails(gameData.info.title);
      fetchCrackInfo(gameData.info.title);
    }
  }, [gameData]);

  const fetchRawgDetails = async (title) => {
    setRawgLoading(true);
    try {
      const response = await axios.get(`/api/games/details/${encodeURIComponent(title)}`);
      setRawgDetails(response.data);
    } catch (err) {
      console.error('Failed to fetch RAWG details:', err);
    } finally {
      setRawgLoading(false);
    }
  };

  const fetchCrackInfo = async (title) => {
    setCrackLoading(true);
    try {
      const response = await axios.get(`/api/user/crack-status/${encodeURIComponent(title)}`);
      setCrackInfo(response.data);
    } catch (err) {
      console.error('Failed to fetch crack status:', err);
    } finally {
      setCrackLoading(false);
    }
  };

  if (!gameData) return null;

  const handleSave = async () => {
    if (!isAuthenticated) {
      setSaveMessage('Please login to save games');
      return;
    }
    setSaveLoading(true);
    setSaveMessage('');
    try {
      const idToSend = (selectedGameID || gameData.info.title || 'unknown').toString();
      
      await axios.post('/api/user/saved-games', {
        gameId: idToSend, 
        title: gameData.info.title,
        thumb: gameData.info.thumb
      });
      setSaveMessage('Game saved successfully!');
    } catch (err) {
      setSaveMessage(err.response?.data?.error || 'Failed to save game');
    } finally {
      setSaveLoading(false);
    }
  };

  const getCleanTitle = (title) => {
    return title.replace(/\b(DIRECTORS?|CUT|GOTY|GAME OF THE YEAR|DELUXE|ULTIMATE|ENHANCED|REMASTERED|REMAKE|EDITION)\b/gi, '').trim();
  };

  const open1337x = () => {
    const cleanName = getCleanTitle(gameData.info.title);
    window.open(`https://1337x.to/search/${encodeURIComponent(cleanName)}/1/`, '_blank', 'noopener,noreferrer');
  };

  const openFitGirl = () => {
    const cleanName = getCleanTitle(gameData.info.title);
    window.open(`https://fitgirl-repacks.site/?s=${encodeURIComponent(cleanName)}`, '_blank', 'noopener,noreferrer');
  };

  const getStoreName = (storeID) => {
    const store = stores.find((s) => s.storeID.toString() === storeID.toString());
    return store ? store.storeName : 'Unknown Store';
  };

  const getStoreIcon = (storeID) => {
    const store = stores.find((s) => s.storeID.toString() === storeID.toString());
    return store ? `https://www.cheapshark.com${store.images.icon}` : null;
  };

  return (
    <div className="my-8 bg-gray-800 p-8 rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Game Image Container */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="sticky top-24">
            <div className="relative group overflow-hidden rounded-xl border-2 border-gray-700 shadow-2xl bg-gray-900 aspect-[3/4]">
              <img
                src={rawgDetails?.background_image || gameData.info.thumb}
                alt={gameData.info.title}
                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60"></div>
            </div>
            
            {/* Quick Stats/Badges */}
            <div className="mt-6 space-y-3">
              <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700/50 flex justify-between items-center">
                <span className="text-gray-400 text-sm">Best Recorded</span>
                <span className="text-xl font-black text-green-400">${gameData.cheapestPriceEver.price}</span>
              </div>
              
              {rawgDetails?.metacritic && (
                <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700/50 flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Metacritic</span>
                  <span className={`text-xl font-black ${
                    rawgDetails.metacritic > 75 ? 'text-green-400' : 
                    rawgDetails.metacritic > 50 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {rawgDetails.metacritic}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Details Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-8">
            <div>
              <h2 className="text-4xl font-black text-white mb-2 leading-tight">{gameData.info.title}</h2>
              {rawgDetails?.released && (
                <p className="text-gray-400 text-sm font-medium">Released: {new Date(rawgDetails.released).toLocaleDateString()}</p>
              )}
            </div>
            
            <div className="flex flex-col items-end gap-3">
              <button
                onClick={handleSave}
                disabled={saveLoading}
                className={`w-full whitespace-nowrap px-8 py-3 rounded-xl font-bold transition-all transform active:scale-95 shadow-xl ${
                  isAuthenticated 
                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20' 
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed opacity-50'
                }`}
              >
                {saveLoading ? 'Saving...' : 'Add to Wishlist'}
              </button>

              {rawgDetails?.platforms?.some(p => p.platform.name === "PC") && (
                <a 
                  href={`https://www.systemrequirementslab.com/cyri/search?q=${encodeURIComponent(rawgDetails.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-8 py-3 bg-gray-700/50 hover:bg-gray-700 text-blue-400 border border-gray-600 rounded-xl font-bold transition-all text-sm shadow-xl"
                >
                  Can I Run It?
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
              
              {saveMessage && (
                <div className={`px-4 py-2 rounded-lg text-xs font-bold animate-fade-in ${
                  saveMessage.includes('successfully') 
                    ? 'bg-green-900/40 text-green-400 border border-green-800' 
                    : 'bg-yellow-900/40 text-yellow-400 border border-yellow-800'
                }`}>
                  {saveMessage}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-10">
            {/* Crack Status & Download Section */}
            <section className="bg-gray-900/40 p-6 rounded-xl border border-gray-700/60">
              <h3 className="text-xl font-bold mb-4 text-gray-300 flex items-center justify-between">
                <span className="flex items-center gap-3">
                  <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
                  Crack Status & Availability
                </span>
                {crackInfo && (
                  <span className={`px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                    crackInfo.is_cracked ? 'bg-green-900/50 text-green-400 border border-green-800' :
                    crackInfo.is_unreleased_game ? 'bg-blue-900/50 text-blue-400 border border-blue-800' :
                    'bg-red-900/50 text-red-400 border border-red-800'
                  }`}>
                    {crackInfo.is_cracked ? 'CRACKED' : crackInfo.is_unreleased_game ? 'UNRELEASED' : 'UNCRACKED'}
                  </span>
                )}
              </h3>

              {crackLoading ? (
                <div className="text-sm text-gray-500 py-4 text-center">Checking crack status...</div>
              ) : crackInfo ? (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                  <div className="space-y-1 text-sm text-gray-300">
                    {crackInfo.readable_status && (
                      <p><span className="text-gray-500">Status:</span> {crackInfo.readable_status}</p>
                    )}
                    {crackInfo.hacked_groups && (
                      <p><span className="text-gray-500">Cracked by:</span> <span className="font-bold text-purple-400">{crackInfo.hacked_groups}</span></p>
                    )}
                    {crackInfo.protections && (
                      <p><span className="text-gray-500">Protection:</span> {crackInfo.protections}</p>
                    )}
                  </div>

                  {crackInfo.is_cracked && (
                    <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={open1337x}
                        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl transition-all shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 text-sm"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download on 1337x.to
                      </button>

                      <button
                        onClick={openFitGirl}
                        className="px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-pink-300 font-bold rounded-xl transition-all border border-gray-600 flex items-center justify-center gap-2 text-sm"
                      >
                        FitGirl Repacks
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Crack status information unavailable for this title.</p>
              )}
            </section>

            {/* Deals Section */}
            <section>
              <h3 className="text-xl font-bold mb-6 text-gray-300 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
                Current Market Deals
              </h3>
              
              <div className="grid grid-cols-1 gap-3">
                {gameData.deals.map((deal) => (
                  <div key={deal.dealID} className="flex items-center justify-between p-4 bg-gray-900/40 rounded-xl border border-gray-700/50 hover:border-blue-500/50 hover:bg-gray-900/60 transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center p-2 border border-gray-700 group-hover:border-blue-500/50 transition-colors">
                        <img src={getStoreIcon(deal.storeID)} alt="" className="w-full h-full object-contain" />
                      </div>
                      <span className="font-bold text-gray-200">{getStoreName(deal.storeID)}</span>
                    </div>
                    
                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <span className="text-gray-500 line-through text-xs block font-medium">${deal.retailPrice}</span>
                        <span className="text-2xl font-black text-white">${deal.price}</span>
                      </div>
                      <a
                        href={`https://www.cheapshark.com/redirect?dealID=${deal.dealID}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-2.5 bg-green-600 hover:bg-green-500 text-white rounded-xl font-black transition-all shadow-lg shadow-green-900/20 group-hover:scale-105 active:scale-95"
                      >
                        Buy Now
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Technical Specs Section */}
            <section id="specs">
              {rawgLoading ? (
                <div className="flex flex-col items-center justify-center p-12 bg-gray-900/20 rounded-2xl border border-gray-700/50">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                  <p className="text-sm text-gray-500">Checking hardware compatibility...</p>
                </div>
              ) : (
                <SystemRequirements details={rawgDetails} />
              )}
            </section>

            {/* Price Analytics Section */}
            <section>
              <PriceHistory 
                cheapestEver={gameData.cheapestPriceEver} 
                currentDeals={gameData.deals} 
              />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealDetails;
