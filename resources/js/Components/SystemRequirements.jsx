import React from 'react';

const SystemRequirements = ({ details }) => {
  const gameName = details?.name || details?.name_original || '';

  if (!details || !details.platforms) {
    return (
      <div className="mt-8 p-6 bg-gray-900/30 rounded-2xl border border-gray-700 border-dashed text-center">
        <h3 className="text-xl font-bold mb-2 text-gray-300">System Requirements</h3>
        <p className="text-gray-500 text-sm mb-4">Hardware requirements data is currently loading or unavailable for this title.</p>
      </div>
    );
  }

  const pcPlatform = details.platforms.find(p => p.platform.name === "PC");
  const requirements = pcPlatform?.requirements;
  const isPC = details.platforms.some(p => p.platform.name === "PC");

  const hasRequirementsText = requirements && (requirements.minimum || requirements.recommended);

  const formatReq = (text) => {
    if (!text) return null;
    return text.split('\n').map((line, i) => (
      <p key={i} className="mb-1">{line}</p>
    ));
  };

  return (
    <div className="mt-8 p-6 bg-gray-900/50 rounded-xl border border-gray-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h3 className="text-xl font-bold text-blue-400 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          System Requirements (PC)
        </h3>

        {/* External Specs Quick Links */}
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={`https://www.systemrequirementslab.com/cyri/search?q=${encodeURIComponent(gameName)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-blue-900/40 hover:bg-blue-800/60 text-blue-300 border border-blue-700/50 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <span>Can I Run It?</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>

          <a
            href={`https://store.steampowered.com/search/?term=${encodeURIComponent(gameName)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-600 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <span>Steam Specs</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>

          <a
            href={`https://www.pcgamingwiki.com/w/index.php?search=${encodeURIComponent(gameName)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-600 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <span>PCGamingWiki</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
      
      {hasRequirementsText ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {requirements.minimum && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400">Minimum Requirements</h4>
              <div className="text-sm text-gray-300 bg-gray-800/50 p-4 rounded-lg border border-gray-700 leading-relaxed">
                {formatReq(requirements.minimum)}
              </div>
            </div>
          )}
          
          {requirements.recommended && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold uppercase tracking-wider text-blue-400">Recommended Requirements</h4>
              <div className="text-sm text-gray-300 bg-blue-900/10 p-4 rounded-lg border border-blue-900/30 leading-relaxed">
                {formatReq(requirements.recommended)}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="p-6 bg-gray-800/40 rounded-xl border border-gray-700 text-center">
          <p className="text-gray-400 text-sm mb-4">
            {isPC 
              ? `RAWG database doesn't have formatted text for "${gameName}". You can view full specs using the buttons below:`
              : `This game is primarily listed for non-PC platforms.`}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href={`https://www.systemrequirementslab.com/cyri/search?q=${encodeURIComponent(gameName)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-bold transition-all shadow-lg"
            >
              Test Hardware on Can You RUN It?
            </a>
            <a
              href={`https://store.steampowered.com/search/?term=${encodeURIComponent(gameName)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-bold transition-all"
            >
              Check Specs on Steam
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemRequirements;
