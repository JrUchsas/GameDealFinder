import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const PriceHistory = ({ cheapestEver, currentDeals }) => {
  // Since CheapShark doesn't provide a full historical array, 
  // we'll visualize the current market spread vs the historical low.
  // We'll create a "Market Snapshot" chart.
  
  const data = currentDeals.map((deal, index) => ({
    name: `Store ${index + 1}`,
    price: parseFloat(deal.price),
    retail: parseFloat(deal.retailPrice),
    lowest: parseFloat(cheapestEver.price)
  })).sort((a, b) => a.price - b.price);

  return (
    <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700 mt-8">
      <h3 className="text-xl font-semibold mb-6 text-gray-300 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
        </svg>
        Price Snapshot & Comparison
      </h3>
      
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
            <XAxis dataKey="name" hide />
            <YAxis 
              stroke="#9ca3af" 
              fontSize={12} 
              tickFormatter={(value) => `$${value}`}
              domain={['auto', 'auto']}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1f2937', border: '#374151', borderRadius: '8px' }}
              itemStyle={{ color: '#fff' }}
              formatter={(value) => [`$${value}`, '']}
            />
            <Area 
              type="monotone" 
              dataKey="price" 
              stroke="#3b82f6" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorPrice)" 
              name="Current Deal"
            />
            <Line 
              type="monotone" 
              dataKey="lowest" 
              stroke="#10b981" 
              strokeDasharray="5 5" 
              name="Historical Low" 
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex justify-center gap-6 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="text-gray-400">Current Market Deals</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-dashed border-gray-900"></div>
          <span className="text-gray-400">Historical Low ($ {cheapestEver.price})</span>
        </div>
      </div>
    </div>
  );
};

export default PriceHistory;
