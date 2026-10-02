import React from 'react';
import {
  GrumpyMascotFace,
  FirstTimeWelcomeMascot,
  GrinningCoolMascot,
  NervousAmberMascot,
} from './MascotIcons';
import {
  RouteTripDetail,
  SavedTrip,
  QUICK_DESTINATIONS,
  EXPRESSWAYS,
} from '../data/trafficData';

interface RoutePanelProps {
  origin: string;
  setOrigin: (origin: string) => void;
  destination: string;
  setDestination: (dest: string) => void;
  isRouteActive: boolean;
  routeData: RouteTripDetail;
  savedTrips: SavedTrip[];
  onSelectSavedTrip: (trip: SavedTrip) => void;
  onSwapRoute: () => void;
  onRequestLocation: () => void;
  onSelectExpressway: (expyId: string) => void;
  onAlertWhenGreen: () => void;
  onStartDrive: () => void;
  onViewAwards: () => void;
  onShowToast: (msg: string) => void;
}

export const RoutePanel: React.FC<RoutePanelProps> = ({
  origin,
  setOrigin,
  destination,
  setDestination,
  isRouteActive,
  routeData,
  savedTrips,
  onSelectSavedTrip,
  onSwapRoute,
  onRequestLocation,
  onSelectExpressway,
  onAlertWhenGreen,
  onStartDrive,
  onViewAwards,
  onShowToast,
}) => {
  const pieExpy = EXPRESSWAYS.pie;

  return (
    <aside className="w-full lg:w-[460px] xl:w-[490px] shrink-0 bg-[#fff8f5] flex flex-col z-20 shadow-[8px_0_24px_-10px_rgba(60,40,20,0.06)] border-r border-[#eee0d6] overflow-y-auto max-h-none lg:max-h-[calc(100vh-4rem)]">
      <div className="p-4 lg:p-6 flex flex-col gap-5">
        {/* 1. GRUMPIEST EXPRESSWAY OF THE DAY BANNER */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#ffdad7] via-[#ffdad7]/80 to-[#f9ebe2] rounded-2xl p-4 shadow-sm border border-[#ffb3ad]">
          <div className="absolute -right-4 -bottom-6 w-28 h-28 rounded-full bg-[#b91a24]/10 blur-xl pointer-events-none" />
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full shadow-xs border border-[#ffdad7]">
              <span className="text-[13px] leading-none">👑</span>
              <span className="text-[11px] text-[#855300] uppercase tracking-wider font-extrabold">
                Today's Grumpiest Expy
              </span>
            </div>
            <button
              onClick={onViewAwards}
              className="group inline-flex items-center gap-0.5 text-[11px] text-[#855300] hover:text-[#211a15] transition-colors font-bold cursor-pointer"
            >
              <span>View Awards</span>
              <span className="material-symbols-outlined text-[15px] group-hover:translate-x-0.5 transition-transform">
                arrow_forward
              </span>
            </button>
          </div>

          <div
            onClick={() => onSelectExpressway('pie')}
            className="flex items-start gap-3.5 cursor-pointer group"
          >
            {/* Sulking Red Character Avatar */}
            <div className="relative shrink-0">
              <div className="w-14 h-14 rounded-full bg-[#b91a24] flex items-center justify-center shadow-md relative overflow-hidden group-hover:scale-105 transition-transform">
                <GrumpyMascotFace size={44} hasCrown={true} />
              </div>
              <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-[#ba1a1a] text-white text-[10px] leading-tight font-extrabold shadow-sm border border-white">
                {pieExpy.currentSpeed} km/h
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="px-2 py-0.5 rounded-md bg-[#b91a24] text-white text-[12px] font-extrabold shadow-xs">
                  {pieExpy.code}
                </span>
                <span className="font-bold text-[17px] text-[#211a15] truncate">
                  {pieExpy.name}
                </span>
              </div>
              <p className="text-[13px] text-[#3c4a42] mt-1 italic leading-snug">
                {pieExpy.characterQuote}
              </p>
              <div className="mt-2 flex items-center gap-1.5 text-[#3c4a42] text-[11px] font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a] animate-ping" />
                <span>
                  Peak delay: <strong className="text-[#ba1a1a]">+24 mins</strong> near Woodsville
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. ROUTE PLANNING & TACTILE CONTROLS */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#eee0d6] flex flex-col gap-3.5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[18px] font-extrabold text-[#211a15] tracking-tight">
                Plan your mood route
              </h2>
              <p className="text-[13px] text-[#3c4a42]">
                Check which expressway is smiling today
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#f9ebe2] flex items-center justify-center text-[#006c49]">
              <span className="material-symbols-outlined text-[20px]">alt_route</span>
            </div>
          </div>

          <div className="relative flex flex-col gap-2">
            {/* Origin Field */}
            <div className="flex items-center gap-2.5 bg-[#fff1e7] px-3.5 py-2 rounded-full border border-[#eee0d6] hover:bg-[#f9ebe2] transition-colors">
              <div className="relative flex items-center justify-center shrink-0">
                <span className="w-2.5 h-2.5 rounded-full bg-[#006c49] animate-pulse" />
                <span className="w-5 h-5 rounded-full bg-[#006c49]/20 absolute" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="block text-[10px] uppercase text-[#3c4a42] tracking-wider font-extrabold leading-none mb-0.5">
                  FROM
                </span>
                <input
                  type="text"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="w-full bg-transparent text-[14px] text-[#211a15] font-bold focus:outline-none truncate"
                  placeholder="Where are you starting from?"
                />
              </div>
            </div>

            {/* Tactile Route Switcher Button */}
            <button
              type="button"
              onClick={onSwapRoute}
              aria-label="Swap Locations"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white text-[#211a15] shadow-md border border-[#eee0d6] hover:bg-[#f3e6dc] hover:rotate-180 transition-all flex items-center justify-center cursor-pointer active:scale-90"
            >
              <span className="material-symbols-outlined text-[17px]">swap_vert</span>
            </button>

            {/* Destination Field */}
            <div className="flex items-center gap-2.5 bg-[#fff1e7] px-3.5 py-2 rounded-full border border-[#eee0d6] hover:bg-[#f9ebe2] transition-colors">
              <span className="material-symbols-outlined text-[#b91a24] text-[20px] shrink-0">
                sports_score
              </span>
              <div className="flex-1 min-w-0">
                <span className="block text-[10px] uppercase text-[#3c4a42] tracking-wider font-extrabold leading-none mb-0.5">
                  TO
                </span>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Where are you headed? (e.g. Marina Bay, Changi)"
                  className="w-full bg-transparent text-[14px] text-[#211a15] font-bold focus:outline-none truncate placeholder:text-[#3c4a42]/60"
                />
              </div>
              {destination && (
                <button
                  type="button"
                  onClick={() => setDestination('')}
                  className="w-5 h-5 rounded-full bg-[#eee0d6] text-[#3c4a42] hover:bg-[#bbcabf] flex items-center justify-center text-[12px] cursor-pointer"
                  title="Clear destination"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Quick Suggestion Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 scrollbar-none">
            {QUICK_DESTINATIONS.map((chip) => {
              const isSelected = destination.toLowerCase().includes(chip.id);
              return (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => {
                    setDestination(chip.value);
                    onShowToast(`Route calculated to ${chip.label}!`);
                  }}
                  className={`shrink-0 px-3 py-1 rounded-full text-[12px] font-bold transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-[#6ffbbe] text-[#002113] border-[#10b981] shadow-xs'
                      : 'bg-[#f9ebe2] text-[#3c4a42] border-[#eee0d6] hover:bg-[#6ffbbe]/70 hover:text-[#002113]'
                  }`}
                >
                  {chip.label}
                </button>
              );
            })}
          </div>

          {/* Saved & Recent Commutes Preview */}
          <div className="flex flex-col gap-2 pt-2 border-t border-[#eee0d6]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[#3c4a42] font-bold uppercase tracking-wider">
                {isRouteActive ? 'Saved & Recent Commutes' : 'Saved Commutes'}
              </span>
              <span className="text-[11px] text-[#3c4a42] font-semibold">
                {isRouteActive ? 'Edit ⚙️' : `${savedTrips.length} saved`}
              </span>
            </div>

            {isRouteActive ? (
              <div className="flex flex-col gap-1.5">
                {savedTrips.map((trip) => {
                  const badgeColor =
                    trip.mood === 'grinning'
                      ? 'bg-[#10b981] text-white'
                      : trip.mood === 'meh'
                      ? 'bg-[#fea619] text-[#2a1700]'
                      : 'bg-[#ff7a73] text-[#410004]';
                  return (
                    <div
                      key={trip.id}
                      onClick={() => onSelectSavedTrip(trip)}
                      className="p-2.5 rounded-xl bg-[#fff1e7] hover:bg-[#f9ebe2] border border-[#eee0d6] flex items-center justify-between gap-2 cursor-pointer transition-all hover:scale-[1.01]"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-[#855300] text-sm shrink-0">⭐</span>
                        <div className="min-w-0">
                          <p className="text-[13px] font-bold text-[#211a15] truncate">
                            {trip.title}
                          </p>
                          <p className="text-[11px] text-[#3c4a42] truncate">{trip.via}</p>
                        </div>
                      </div>
                      <span
                        className={`shrink-0 px-2 py-0.5 rounded-full text-[11px] font-extrabold ${badgeColor}`}
                      >
                        {trip.estTime} • {trip.moodLabel}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-[#fff1e7] border border-dashed border-[#bbcabf] flex items-center gap-3 text-left">
                <div className="w-8 h-8 rounded-full bg-[#f9ebe2] flex items-center justify-center text-[#006c49] shrink-0">
                  <span className="material-symbols-outlined text-[18px]">star_outline</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] text-[#211a15] font-bold">No saved trips yet</p>
                  <p className="text-[11px] text-[#3c4a42] leading-tight">
                    Star your frequent commute to check moods instantly before heading out!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 3. TRIP SUMMARY & VERDICT OR EMPTY STATE HERO */}
        {!isRouteActive ? (
          /* EMPTY STATE HERO (SCREEN A - Image 5) */
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#eee0d6] flex flex-col items-center text-center gap-4 relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-[#6ffbbe]/20 blur-xl pointer-events-none" />

            <div className="relative my-2">
              <div className="w-24 h-24 rounded-full bg-[#6ffbbe] flex items-center justify-center shadow-lg relative">
                <FirstTimeWelcomeMascot size={80} />
                <span className="absolute -bottom-1 -right-1 text-2xl select-none">👋</span>
              </div>
            </div>

            <div className="max-w-xs flex flex-col items-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6ffbbe]/60 text-[#005236] text-[11px] font-extrabold mb-1.5 shadow-xs border border-[#10b981]/30">
                <span className="text-[13px]">✨</span>
                <span>First time here?</span>
              </div>
              <h3 className="text-[20px] font-extrabold text-[#211a15] leading-tight">
                Where are we headed?
              </h3>
              <p className="text-[13px] text-[#3c4a42] mt-1.5 leading-relaxed">
                Set a destination above, or allow location access so Road Moods can find the fastest
                (and happiest!) expressway for your drive.
              </p>
            </div>

            <div className="w-full flex flex-col gap-2 pt-1">
              <button
                type="button"
                onClick={onRequestLocation}
                className="w-full py-3 px-4 rounded-full bg-[#006c49] hover:bg-[#10b981] text-white hover:text-[#00422b] text-[14px] font-extrabold flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer group"
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
                </span>
                <span className="material-symbols-outlined text-[19px]">near_me</span>
                <span>Allow Location Access</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setDestination('Changi Airport Terminal 3');
                  onShowToast('Showing live route to Changi Airport!');
                }}
                className="w-full py-2.5 px-4 rounded-full bg-[#fff1e7] hover:bg-[#f9ebe2] text-[#3c4a42] hover:text-[#211a15] text-[13px] font-bold transition-all cursor-pointer border border-[#eee0d6]"
              >
                Or explore Singapore expressway moods below
              </button>
            </div>

            <div className="w-full p-3 bg-gradient-to-r from-[#ffddb8]/50 via-[#f9ebe2] to-[#6ffbbe]/40 rounded-xl flex items-start gap-2.5 text-left border border-[#eee0d6]">
              <span className="text-xl shrink-0 mt-0.5">💡</span>
              <p className="text-[12px] text-[#3c4a42] leading-relaxed">
                <strong className="text-[#211a15]">Pro tip:</strong> Expressways smile when traffic
                is flowing above 70 km/h, and sulk when lanes crawl!
              </p>
            </div>
          </div>
        ) : (
          /* ACTIVE TRIP RECOMMENDATION & EXPRESSWAY BREAKDOWN (SCREEN B - Image 3) */
          <>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#eee0d6] flex flex-col gap-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#3c4a42]">
                  ACTIVE TRIP RECOMMENDATION
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#ffddb8] text-[#855300] text-[10px] font-extrabold border border-[#ffb95f]">
                  Optimal Mix
                </span>
              </div>

              <h3 className="text-[20px] font-extrabold text-[#211a15] tracking-tight leading-snug">
                {routeData.recommendationTitle}
              </h3>

              {/* 3 Metric Cards */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-[#fff1e7] rounded-xl p-2.5 border border-[#eee0d6]">
                  <span className="block text-[10px] text-[#3c4a42] font-semibold">Est. Time</span>
                  <span className="text-[24px] font-extrabold text-[#211a15] leading-none block my-1">
                    {routeData.estMinutes}
                  </span>
                  <span className="text-[10px] text-[#3c4a42]">minutes</span>
                </div>
                <div className="bg-[#ffdad7] rounded-xl p-2.5 border border-[#ffb3ad]">
                  <span className="block text-[10px] text-[#b91a24] font-semibold">Delay</span>
                  <span className="text-[22px] font-extrabold text-[#b91a24] leading-none block my-1">
                    +{routeData.delayMinutes} min
                  </span>
                  <span className="text-[10px] text-[#b91a24]">vs normal</span>
                </div>
                <div className="bg-[#fff1e7] rounded-xl p-2.5 border border-[#eee0d6]">
                  <span className="block text-[10px] text-[#3c4a42] font-semibold">Distance</span>
                  <span className="text-[24px] font-extrabold text-[#211a15] leading-none block my-1">
                    {routeData.distanceKm}
                  </span>
                  <span className="text-[10px] text-[#3c4a42]">km total</span>
                </div>
              </div>

              {/* Smart Commuter Tip */}
              <div className="p-3 bg-[#6ffbbe]/25 border border-[#10b981]/30 rounded-xl flex items-start gap-2.5 text-left">
                <span className="text-xl shrink-0 mt-0.5">💡</span>
                <div>
                  <p className="text-[13px] font-bold text-[#005236] leading-tight">
                    Wait 15 min, save 9 min!
                  </p>
                  <p className="text-[11px] text-[#005236]/90 mt-0.5 leading-snug">
                    {routeData.smartTip}
                  </p>
                </div>
              </div>

              {/* NEA Weather Advisory Card */}
              <div className="p-3 bg-[#ffdad7]/40 border border-[#ffb3ad] rounded-xl flex items-start gap-2.5 text-left">
                <span className="text-xl shrink-0 mt-0.5">🌧️</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold text-[#b91a24] tracking-wider uppercase">
                      {routeData.weatherWarning.title}
                    </span>
                    <span className="text-[10px] text-[#3c4a42] font-semibold">
                      {routeData.weatherWarning.updatedAgo}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#410004] mt-0.5 leading-snug">
                    {routeData.weatherWarning.description}
                  </p>
                </div>
              </div>

              {/* Trip Actions */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={onAlertWhenGreen}
                  className="py-2.5 px-3 rounded-full bg-[#fff1e7] hover:bg-[#f9ebe2] text-[#211a15] text-[12px] font-extrabold border border-[#eee0d6] flex items-center justify-center gap-1.5 cursor-pointer transition-transform active:scale-95"
                >
                  <span className="material-symbols-outlined text-[17px] text-[#006c49]">
                    notifications_active
                  </span>
                  <span>Alert when green</span>
                </button>
                <button
                  type="button"
                  onClick={onStartDrive}
                  className="py-2.5 px-3 rounded-full bg-[#006c49] hover:bg-[#10b981] text-white text-[12px] font-extrabold shadow-md flex items-center justify-center gap-1.5 cursor-pointer transition-transform active:scale-95"
                >
                  <span className="material-symbols-outlined text-[17px]">navigation</span>
                  <span>Start Drive</span>
                </button>
              </div>
            </div>

            {/* 4. EXPRESSWAYS ON YOUR ROUTE (ORDER OF TRAVEL) */}
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between px-1">
                <h4 className="text-[14px] font-extrabold text-[#211a15]">
                  Expressways on your route ({routeData.expressways.length})
                </h4>
                <span className="text-[11px] text-[#3c4a42] font-medium">Order of travel</span>
              </div>

              <div className="flex flex-col gap-3">
                {routeData.expressways.map((item, idx) => {
                  const isRed = item.mood === 'sulking';
                  const isAmber = item.mood === 'meh' || item.mood === 'grumpy';
                  const isGreen = item.mood === 'grinning' || item.mood === 'breezy';

                  const badgeBg = isRed
                    ? 'bg-[#b91a24] text-white'
                    : isAmber
                    ? 'bg-[#fea619] text-[#2a1700]'
                    : 'bg-[#006c49] text-white';

                  const speedColor = isRed
                    ? 'text-[#ba1a1a]'
                    : isAmber
                    ? 'text-[#855300]'
                    : 'text-[#006c49]';

                  return (
                    <div
                      key={item.code}
                      onClick={() => onSelectExpressway(item.expresswayId)}
                      className="bg-white rounded-2xl p-4 shadow-sm border border-[#eee0d6] hover:border-[#10b981] transition-all cursor-pointer hover:shadow-md flex flex-col gap-2 group"
                    >
                      <div className="flex items-start gap-3">
                        {/* Mascot Avatar */}
                        <div className="relative shrink-0">
                          <div
                            className={`w-11 h-11 rounded-full flex items-center justify-center shadow-xs ${
                              isRed ? 'bg-[#b91a24]' : isAmber ? 'bg-[#fea619]' : 'bg-[#10b981]'
                            }`}
                          >
                            {isRed && <GrumpyMascotFace size={34} hasCrown={false} />}
                            {isAmber && <NervousAmberMascot size={34} />}
                            {isGreen && <GrinningCoolMascot size={34} />}
                          </div>
                          <span className="absolute -bottom-1 -left-1 w-4 h-4 rounded-full bg-[#f9ebe2] text-[10px] font-extrabold text-[#211a15] flex items-center justify-center border border-[#eee0d6]">
                            {idx + 1}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 truncate">
                              <span
                                className={`px-1.5 py-0.5 rounded text-[11px] font-extrabold ${badgeBg}`}
                              >
                                {item.code}
                              </span>
                              <span className="text-[14px] font-bold text-[#211a15] truncate">
                                {item.sectionName}
                              </span>
                            </div>
                            <span className={`text-[12px] font-extrabold ${speedColor}`}>
                              {item.speedKmH} km/h
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 text-[11px] text-[#3c4a42] mt-0.5">
                            <span>{item.distanceKm} km</span>
                            <span>•</span>
                            <span className="font-semibold">{item.moodLabel}</span>
                          </div>
                        </div>
                      </div>

                      {/* Character Quote Bubble */}
                      <div className="bg-[#fff1e7] rounded-xl p-2.5 text-[12px] text-[#211a15] italic border border-[#eee0d6]/70">
                        {item.characterQuote}
                      </div>

                      {/* Incident Tags */}
                      {item.incidents && item.incidents.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-0.5">
                          {item.incidents.map((inc, i) => (
                            <span
                              key={i}
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                                inc.type === 'rain'
                                  ? 'bg-[#ffdad7] text-[#79000e] border border-[#ffb3ad]'
                                  : 'bg-[#ffdad6] text-[#ba1a1a] border border-[#ffb3ad]'
                              }`}
                            >
                              <span>{inc.type === 'rain' ? '🌧️' : '🚗'}</span>
                              <span>{inc.label}</span>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </aside>
  );
};
