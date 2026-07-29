import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../Components/Navbar';
import { Head } from '@inertiajs/react';

function Freebies() {
  const [freebies, setFreebies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFreebies = async () => {
      try {
        const response = await axios.get('/api/freebies');
        setFreebies(response.data);
      } catch (err) {
        setError('Failed to fetch freebies. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchFreebies();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex flex-col">
      <Head title="Freebie Central" />
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-blue-500 mb-2">Freebie Central</h2>
          <p className="text-gray-400">Current live giveaways and free-to-keep games</p>
        </div>

        {loading && (
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded mb-8 text-center">
            {error}
          </div>
        )}

        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {freebies.map((item) => (
              <div key={item.id} className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-blue-500 transition-all group flex flex-col">
                <div className="relative">
                  <img src={item.image} alt={item.title} className="w-full h-48 object-cover" />
                  <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded shadow-lg">
                    {item.type}
                  </div>
                </div>
                
                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-white line-clamp-1">{item.title}</h3>
                    <span className="text-xs text-gray-400 bg-gray-900 px-2 py-1 rounded">{item.platforms}</span>
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2 flex-grow">{item.description}</p>
                  
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-green-400 font-bold">{item.worth === 'N/A' ? 'FREE' : item.worth}</span>
                    <a
                      href={item.open_giveaway_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors"
                    >
                      Get Giveaway
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-gray-800 py-8 mt-auto text-center text-gray-500 text-sm">
        <p>Data provided by CheapShark API & GameStatus</p>
      </footer>
    </div>
  );
}

export default Freebies;
