import React from 'react';

const GameList = ({ games, onSelectGame }) => {
  if (games.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-8">
      {games.map((game) => (
        <div
          key={game.gameID}
          onClick={() => onSelectGame(game.gameID)}
          className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer transform hover:scale-105 transition-transform border border-gray-700 hover:border-blue-500"
        >
          <img
            src={game.thumb}
            alt={game.external}
            className="w-full h-40 object-cover"
          />
          <div className="p-4">
            <h3 className="text-lg font-bold line-clamp-2">{game.title || game.external}</h3>
            {game.salePrice ? (
              <div className="mt-2 flex items-center justify-between">
                <div>
                  <span className="text-gray-500 line-through text-xs block">${game.normalPrice}</span>
                  <span className="text-xl font-bold text-green-400">${game.salePrice}</span>
                </div>
                {game.savings > 0 && (
                  <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">
                    -{Math.round(game.savings)}%
                  </span>
                )}
              </div>
            ) : (
              <p className="text-gray-400 mt-2">Cheapest: ${game.cheapest}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default GameList;
