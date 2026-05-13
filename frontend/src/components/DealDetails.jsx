import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PriceHistory from './PriceHistory';
import SystemRequirements from './SystemRequirements';

const DealDetails = ({ gameData, stores }) => {
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [rawgDetails, setRawgDetails] = useState(null);
  const [rawgLoading, setRawgLoading] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (gameData && gameData.info) {
      fetchRawgDetails(gameData.info.title);
    }
  }, [gameData]);

  const fetchRawgDetails = async (title) => {
    setRawgLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/games/details/${encodeURIComponent(title)}`);
      setRawgDetails(response.data);
    } catch (err) {
      console.error('Failed to fetch RAWG details:', err);
    } finally {
      setRawgLoading(false);
    }
  };

  if (!gameData) return null;

  const handleSave = async () => {
    if (!token) {
      setSaveMessage('Please login to save games');
      return;
    }
    setSaveLoading(true);
    setSaveMessage('');
    try {
      await axios.post('http://localhost:5000/api/user/saved-games', {
        gameId: gameData.info.title, // Using title as ID if unique enough
        title: gameData.info.title,
        thumb: gameData.info.thumb
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSaveMessage('Game saved successfully!');
    } catch (err) {
      setSaveMessage(err.response?.data?.error || 'Failed to save game');
    } finally {
      setSaveLoading(false);
    }
  };

  const getStoreName = (storeID) => {
    const store = stores.find((s) => s.storeID === storeID);
    return store ? store.storeName : 'Unknown Store';
  };

  const getStoreIcon = (storeID) => {
    const store = stores.find((s) => s.storeID === storeID);
    return store ? `https://www.cheapshark.com${store.images.icon}` : null;
  };

  return (
    <div className="my-8 bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-2xl">
      <div className="flex flex-col md:flex-row gap-8">
        <img
          src={gameData.info.thumb}
          alt={gameData.info.title}
          className="w-full md:w-64 h-auto rounded-lg shadow-lg object-contain bg-gray-900"
        />
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
            <h2 className="text-3xl font-bold text-white">{gameData.info.title}</h2>
            <button
              onClick={handleSave}
              disabled={saveLoading}
              className={`whitespace-nowrap px-6 py-2 rounded-lg font-bold transition-all transform active:scale-95 ${
                token 
                  ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20' 
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed opacity-50'
              }`}
            >
              {saveLoading ? 'Saving...' : 'Save to Profile'}
            </button>
          </div>
          
          {saveMessage && (
            <div className={`p-3 rounded-lg mb-6 text-sm font-medium ${
              saveMessage.includes('successfully') 
                ? 'bg-green-900/30 text-green-400 border border-green-800' 
                : 'bg-yellow-900/30 text-yellow-400 border border-yellow-800'
            }`}>
              {saveMessage}
            </div>
          )}

          <div className="bg-gray-900/50 p-4 rounded-lg mb-8 inline-block">
            <p className="text-gray-400 text-sm mb-1">Cheapest ever recorded</p>
            <p className="text-2xl text-green-400 font-black">
              ${gameData.cheapestPriceEver.price}
            </p>
          </div>

          <h3 className="text-xl font-semibold mb-4 text-gray-300 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            Available Deals
          </h3>
          
          <div className="space-y-3">
            {gameData.deals.map((deal) => (
              <div key={deal.dealID} className="flex items-center justify-between p-4 bg-gray-900/80 rounded-xl border border-gray-700/50 hover:border-blue-500/50 hover:bg-gray-900 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center p-2">
                    <img src={getStoreIcon(deal.storeID)} alt="" className="w-full h-full object-contain" />
                  </div>
                  <span className="font-semibold text-gray-200">{getStoreName(deal.storeID)}</span>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <span className="text-gray-500 line-through text-xs block">${deal.retailPrice}</span>
                    <span className="text-xl font-bold text-white">${deal.price}</span>
                  </div>
                  <a
                    href={`https://www.cheapshark.com/redirect?dealID=${deal.dealID}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 bg-green-600 hover:bg-green-500 text-white rounded-lg font-bold transition-all shadow-lg shadow-green-900/20 group-hover:scale-105"
                  >
                    View Deal
                  </a>
                </div>
              </div>
            ))}
          </div>
          
          <PriceHistory 
            cheapestEver={gameData.cheapestPriceEver} 
            currentDeals={gameData.deals} 
          />

          {rawgLoading ? (
            <div className="flex justify-center my-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <SystemRequirements details={rawgDetails} />
          )}
        </div>
      </div>
    </div>
  );
};

export default DealDetails;
