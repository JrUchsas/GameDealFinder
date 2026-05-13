import React from 'react';

const SystemRequirements = ({ details }) => {
  if (!details || !details.platforms) return null;

  const pcPlatform = details.platforms.find(p => p.platform.name === "PC");
  const requirements = pcPlatform?.requirements;

  if (!requirements || (!requirements.minimum && !requirements.recommended)) {
    return (
      <div className="mt-8 p-6 bg-gray-900/50 rounded-xl border border-gray-700">
        <h3 className="text-xl font-bold mb-4 text-blue-400">System Requirements</h3>
        <p className="text-gray-400 italic">No specific PC requirements found for this title.</p>
      </div>
    );
  }

  const formatReq = (text) => {
    if (!text) return null;
    return text.split('\n').map((line, i) => (
      <p key={i} className="mb-1">{line}</p>
    ));
  };

  return (
    <div className="mt-8 p-6 bg-gray-900/50 rounded-xl border border-gray-700">
      <h3 className="text-xl font-bold mb-6 text-blue-400 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        System Requirements (PC)
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {requirements.minimum && (
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-500">Minimum</h4>
            <div className="text-sm text-gray-300 bg-gray-800/50 p-4 rounded-lg border border-gray-700 leading-relaxed">
              {formatReq(requirements.minimum)}
            </div>
          </div>
        )}
        
        {requirements.recommended && (
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-blue-500/70">Recommended</h4>
            <div className="text-sm text-gray-300 bg-blue-900/10 p-4 rounded-lg border border-blue-900/20 leading-relaxed">
              {formatReq(requirements.recommended)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemRequirements;
