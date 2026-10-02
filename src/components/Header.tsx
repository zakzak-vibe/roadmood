import React from 'react';

interface HeaderProps {
  activeTab: 'moods' | 'awards' | 'my-trips';
  onSelectTab: (tab: 'moods' | 'awards' | 'my-trips') => void;
  onOpenNotifications: () => void;
  unreadCount?: number;
  onFocusMap?: () => void;
  onOpenApiHealth?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onOpenNotifications,
  unreadCount = 2,
  onFocusMap,
  onOpenApiHealth,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 bg-[#fff8f5]/90 backdrop-blur-xl border-b border-[#eee0d6]/80 shadow-[0_1px_8px_rgba(60,40,20,0.05)]">
      <div className="h-16 w-full px-4 md:px-6 flex items-center justify-between gap-4">
        {/* Logo & Singapore Live Indicator */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => onSelectTab('moods')}
            className="flex items-center gap-2.5 shrink-0 text-left focus:outline-none group cursor-pointer"
          >
            <img
              alt="Road Moods Brand Logo"
              className="h-8 md:h-9 w-auto object-contain transition-transform group-hover:scale-105"
              src="https://lh3.googleusercontent.com/aida/AEtjO1XPXEYwX0XvVrAuzwPtW2j1RYwLo27nJjSw6nTAL6b6KSlchQTxJ0r0Qo8u-DZ7pDQEsLfjRtkGDzpsaRUrrQ0YJM3_A_CFJMyRdlzTHpdQRCFstiib6aU8DWOcnJ6RlbqB4n6erpEZnE95xs-DK5ncm-Laj9Ptz8q65ocGWipiAvfYRgjuE-Rb2bs5zKV2t2lvJ3D9eW0CF7-sLxNfzjNPob8VU4krkeE-8d3n8GWXB2E_dniewwQm4cPq"
            />
            <span className="font-extrabold text-[21px] tracking-tight text-[#211a15] hidden sm:inline">
              Road Moods
            </span>
          </button>

          <button
            type="button"
            onClick={onOpenApiHealth}
            className="hidden md:flex items-center gap-2 px-3 py-1 bg-[#f9ebe2] hover:bg-[#fff1e7] rounded-full shadow-[0_2px_6px_-1px_rgba(60,40,20,0.04)] border border-[#eee0d6] cursor-pointer transition-colors group"
            title="Click to check /api/health and LTA endpoints status"
          >
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></span>
            <span className="text-[11px] text-[#3c4a42] font-bold tracking-wide group-hover:text-[#006c49]">
              Live Traffic Vibes • Singapore (API Health)
            </span>
          </button>
        </div>

        {/* Center Nav Pills */}
        <nav className="flex items-center gap-1 p-1 bg-[#fff1e7] rounded-full border border-[#eee0d6]">
          <button
            type="button"
            onClick={() => onSelectTab('moods')}
            className={`px-4 py-1.5 rounded-full text-[13px] font-bold transition-all cursor-pointer ${
              activeTab === 'moods'
                ? 'bg-[#f3e6dc] text-[#211a15] shadow-xs'
                : 'text-[#3c4a42] hover:text-[#211a15] hover:bg-[#f9ebe2]/60'
            }`}
          >
            Moods
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('awards')}
            className={`px-4 py-1.5 rounded-full text-[13px] font-bold transition-all cursor-pointer ${
              activeTab === 'awards'
                ? 'bg-[#f3e6dc] text-[#211a15] shadow-xs'
                : 'text-[#3c4a42] hover:text-[#211a15] hover:bg-[#f9ebe2]/60'
            }`}
          >
            Awards
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('my-trips')}
            className={`px-4 py-1.5 rounded-full text-[13px] font-bold transition-all cursor-pointer ${
              activeTab === 'my-trips'
                ? 'bg-[#f3e6dc] text-[#211a15] shadow-xs'
                : 'text-[#3c4a42] hover:text-[#211a15] hover:bg-[#f9ebe2]/60'
            }`}
          >
            My Trips
          </button>
        </nav>

        {/* Right Action Icons */}
        <div className="flex items-center gap-2">
          {onFocusMap && (
            <button
              onClick={onFocusMap}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white rounded-full shadow-[0_2px_6px_-1px_rgba(60,40,20,0.06)] border border-[#eee0d6] hover:bg-[#f9ebe2] hover:text-[#211a15] transition-all text-[#3c4a42] text-[12px] font-bold cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px] text-[#006c49]">explore</span>
              <span>Live Map</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenNotifications}
            className="w-9 h-9 rounded-full bg-[#fff1e7] hover:bg-[#f9ebe2] border border-[#eee0d6] flex items-center justify-center text-[#3c4a42] transition-colors relative cursor-pointer"
            title="Notifications & Alerts"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#ba1a1a]"></span>
            )}
          </button>

          <div
            className="w-8 h-8 rounded-full bg-[#006c49] text-white flex items-center justify-center font-bold text-xs shadow-sm cursor-pointer hover:ring-2 hover:ring-[#10b981] transition-all"
            title="Zaki Jufri"
          >
            <span className="material-symbols-outlined text-[18px]">person</span>
          </div>
        </div>
      </div>
    </header>
  );
};
