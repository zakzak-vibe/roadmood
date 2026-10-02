import React, { useState, useRef } from 'react';
import { EXPRESSWAYS, ExpresswayData } from '../data/trafficData';

interface SingaporeMapProps {
  isRouteActive: boolean;
  activeFilter: 'all' | 'grumpy' | 'incidents' | 'cameras';
  setActiveFilter: (filter: 'all' | 'grumpy' | 'incidents' | 'cameras') => void;
  selectedExpressway: string | null;
  onSelectExpressway: (id: string) => void;
  onShowCameraModal: (cam: ExpresswayData['cameras'][0]) => void;
  onShowToast: (msg: string) => void;
  onOpenApiHealth?: () => void;
  liveExpressways?: Record<string, any>;
  onRefreshLive?: () => Promise<void>;
  isLiveActive?: boolean;
  fromPoint?: { name: string; svgX: number; svgY: number };
  toPoint?: { name: string; svgX: number; svgY: number };
  svgRoutePath?: string;
  isClassicRoute?: boolean;
}

export const SingaporeMap: React.FC<SingaporeMapProps> = ({
  isRouteActive,
  activeFilter,
  setActiveFilter,
  selectedExpressway,
  onSelectExpressway,
  onShowCameraModal,
  onShowToast,
  onOpenApiHealth,
  liveExpressways,
  onRefreshLive,
  isLiveActive,
  fromPoint = { name: 'Toa Payoh Central', svgX: 415, svgY: 310 },
  toPoint = { name: 'Changi Airport T3', svgX: 890, svgY: 285 },
  svgRoutePath,
  isClassicRoute = true,
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [previewExpy, setPreviewExpy] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoom = (delta: number) => {
    setZoomLevel((prev) => Math.min(Math.max(0.8, prev + delta), 2.2));
    onShowToast(delta > 0 ? 'Zoomed in on expressway corridor' : 'Zoomed out to island view');
  };

  const handleResetLocation = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
    onShowToast('Centered on Singapore Island live network');
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    onShowToast('Fetching fresh LTA DataMall speeds, incidents & cameras...');
    if (onRefreshLive) {
      await onRefreshLive();
    }
    setTimeout(() => {
      setIsRefreshing(false);
      onShowToast('Live telemetry pulled! Expressway spirits updated.');
    }, 600);
  };

  const pieData = {
    ...EXPRESSWAYS.pie,
    currentSpeed: liveExpressways?.pie?.currentSpeed ?? EXPRESSWAYS.pie.currentSpeed,
    characterQuote: liveExpressways?.pie?.quote ?? EXPRESSWAYS.pie.characterQuote,
  };
  const cteData = {
    ...EXPRESSWAYS.cte,
    currentSpeed: liveExpressways?.cte?.currentSpeed ?? EXPRESSWAYS.cte.currentSpeed,
    characterQuote: liveExpressways?.cte?.quote ?? EXPRESSWAYS.cte.characterQuote,
  };
  const ecpData = {
    ...EXPRESSWAYS.ecp,
    currentSpeed: liveExpressways?.ecp?.currentSpeed ?? EXPRESSWAYS.ecp.currentSpeed,
    characterQuote: liveExpressways?.ecp?.quote ?? EXPRESSWAYS.ecp.characterQuote,
  };
  const ayeData = {
    ...EXPRESSWAYS.aye,
    currentSpeed: liveExpressways?.aye?.currentSpeed ?? EXPRESSWAYS.aye.currentSpeed,
    characterQuote: liveExpressways?.aye?.quote ?? EXPRESSWAYS.aye.characterQuote,
  };
  const sleData = {
    ...EXPRESSWAYS.sle,
    currentSpeed: liveExpressways?.sle?.currentSpeed ?? EXPRESSWAYS.sle.currentSpeed,
    characterQuote: liveExpressways?.sle?.quote ?? EXPRESSWAYS.sle.characterQuote,
  };
  const kpeData = {
    ...EXPRESSWAYS.kpe,
    currentSpeed: liveExpressways?.kpe?.currentSpeed ?? EXPRESSWAYS.kpe.currentSpeed,
    characterQuote: liveExpressways?.kpe?.quote ?? EXPRESSWAYS.kpe.characterQuote,
  };

  // Active expressway for camera preview
  const currentPreviewData = previewExpy ? EXPRESSWAYS[previewExpy] : null;

  return (
    <main className="flex-1 min-w-0 relative flex flex-col bg-[#e2eef8] select-none h-[540px] lg:h-auto overflow-hidden">
      {/* 1. TOP HUD LAYER CONTROLS */}
      <div className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between pointer-events-none gap-2">
        {/* Left Filter Pills */}
        <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md p-1.5 rounded-full shadow-md pointer-events-auto border border-[#eee0d6]">
          <button
            type="button"
            onClick={() => {
              setActiveFilter('all');
              onShowToast('Displaying all island expressway spirits');
            }}
            className={`px-3 py-1 rounded-full text-[12px] font-bold transition-all cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-[#006c49] text-white shadow-xs'
                : 'text-[#3c4a42] hover:bg-[#f9ebe2]'
            }`}
          >
            All Moods
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveFilter('grumpy');
              onShowToast('Filtering to sulking & grumpy expressways only');
            }}
            className={`px-3 py-1 rounded-full text-[12px] font-bold transition-all cursor-pointer ${
              activeFilter === 'grumpy'
                ? 'bg-[#b91a24] text-white shadow-xs'
                : 'text-[#3c4a42] hover:bg-[#f9ebe2]'
            }`}
          >
            😤 Grumpy Only
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveFilter('incidents');
              onShowToast('Showing all active road alerts & breakdowns');
            }}
            className={`px-3 py-1 rounded-full text-[12px] font-bold transition-all cursor-pointer ${
              activeFilter === 'incidents'
                ? 'bg-[#fea619] text-[#2a1700] shadow-xs'
                : 'text-[#3c4a42] hover:bg-[#f9ebe2]'
            }`}
          >
            ⚠️ Incidents (3)
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveFilter('cameras');
              onShowToast('Displaying LTA traffic camera locations');
            }}
            className={`px-3 py-1 rounded-full text-[12px] font-bold transition-all cursor-pointer hidden sm:inline-flex ${
              activeFilter === 'cameras'
                ? 'bg-[#006c49] text-white shadow-xs'
                : 'text-[#3c4a42] hover:bg-[#f9ebe2]'
            }`}
          >
            📷 Cameras
          </button>
        </div>

        {/* Right Live Telemetry Badge */}
        <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-md pointer-events-auto border border-[#eee0d6]">
          <button
            type="button"
            onClick={onOpenApiHealth}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            title="Inspect /api/health and LTA endpoints status"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#10b981]" />
            </span>
            <span className="text-[12px] text-[#211a15] font-extrabold hidden md:inline">
              {isLiveActive ? 'Live LTA & OneMap • Connected' : 'Live Traffic • 2m ago'}
            </span>
          </button>
          <button
            type="button"
            aria-label="Refresh Map Data"
            onClick={handleRefresh}
            className={`w-6 h-6 rounded-full flex items-center justify-center text-[#3c4a42] hover:text-[#211a15] transition-transform active:rotate-180 cursor-pointer ${
              isRefreshing ? 'animate-spin text-[#006c49]' : ''
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">refresh</span>
          </button>
        </div>
      </div>

      {/* Floating Center Guide Pill */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 z-20 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full shadow-md flex items-center gap-2 pointer-events-auto border border-[#eee0d6] text-center max-w-[90%] truncate">
        <span className="text-[14px]">🇸🇬</span>
        <span className="text-[12px] text-[#211a15] font-extrabold truncate">
          Singapore Live Road Moods
        </span>
        <span className="text-[#3c4a42] text-[11px] font-medium hidden sm:inline">
          • Tap any expressway to check its live vibe
        </span>
      </div>

      {/* 2. INTERACTIVE SVG SINGAPORE VECTOR MAP CANVAS */}
      <div
        ref={containerRef}
        className="w-full h-full flex items-center justify-center relative overflow-hidden"
      >
        <div
          className="w-full h-full flex items-center justify-center transition-transform duration-300 ease-out"
          style={{
            transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
          }}
        >
          <svg
            className="w-full h-full max-w-[1300px] object-contain drop-shadow-[0_4px_16px_rgba(40,30,20,0.06)]"
            viewBox="0 0 1000 600"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="water-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E2EEF8" />
                <stop offset="100%" stopColor="#D4E4F0" />
              </linearGradient>

              {/* Route Glowing Filters */}
              <filter id="route-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow
                  dx="0"
                  dy="2"
                  stdDeviation="4"
                  floodColor="#006C49"
                  floodOpacity="0.35"
                />
              </filter>
              <filter id="jam-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow
                  dx="0"
                  dy="2"
                  stdDeviation="4"
                  floodColor="#BA1A1A"
                  floodOpacity="0.45"
                />
              </filter>
            </defs>

            {/* Water Canvas Background */}
            <rect width="1000" height="600" fill="url(#water-grad)" />

            {/* Surrounding Regional Coastlines (Johor & Riau Islands) */}
            <path
              d="M 20 60 Q 200 40 450 70 Q 700 80 980 40 L 980 0 L 20 0 Z"
              fill="#D7D0C4"
              opacity="0.65"
            />
            <path
              d="M 100 550 Q 400 520 600 560 Q 800 580 980 540 L 980 600 L 100 600 Z"
              fill="#D7D0C4"
              opacity="0.5"
            />

            {/* Offshore Islands (Sentosa, Jurong Island, Pulau Ubin & Tekong) */}
            {/* Sentosa */}
            <path
              d="M 440 460 Q 480 455 520 465 Q 500 485 450 480 Z"
              fill="#E8E2D5"
              stroke="#D3CABE"
              strokeWidth="1.5"
            />
            {/* Jurong Island */}
            <path
              d="M 230 440 Q 300 430 330 460 Q 310 495 240 485 Q 210 460 230 440 Z"
              fill="#E8E2D5"
              stroke="#D3CABE"
              strokeWidth="1.5"
            />
            {/* Pulau Ubin & Pulau Tekong */}
            <path
              d="M 770 180 Q 840 170 870 190 Q 830 215 760 200 Z"
              fill="#E8E2D5"
              stroke="#D3CABE"
              strokeWidth="1.5"
            />
            <path
              d="M 880 180 Q 940 170 960 210 Q 910 240 880 200 Z"
              fill="#E8E2D5"
              stroke="#D3CABE"
              strokeWidth="1.5"
            />

            {/* MAIN SINGAPORE ISLAND SILHOUETTE */}
            <path
              d="
                M 180 340 
                C 160 310, 180 260, 220 230 
                C 260 200, 310 180, 380 170 
                C 430 160, 480 155, 540 165 
                C 600 175, 680 190, 750 200 
                C 810 210, 870 230, 920 280 
                C 940 310, 930 350, 890 380 
                C 850 410, 780 430, 700 435 
                C 630 440, 580 450, 530 440 
                C 480 430, 450 410, 410 420 
                C 360 430, 320 440, 260 420 
                C 210 400, 190 370, 180 340 Z"
              fill="#ECE7DE"
              stroke="#D8CEBE"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />

            {/* BASE NETWORK EXPRESSWAY HIGHWAYS */}
            {/* AYE (Ayer Rajah) - Cruising Green */}
            <path
              d="M 230 405 C 280 400 360 395 440 410 C 490 418 530 420 570 395"
              stroke="#10B981"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.85"
            />
            <path
              d="M 230 405 C 280 400 360 395 440 410 C 490 418 530 420 570 395"
              stroke="#6FFBBE"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.9"
            />

            {/* BKE (Bukit Timah) - Breezy Green */}
            <path
              d="M 430 170 C 425 210 420 260 415 310"
              stroke="#10B981"
              strokeWidth="5"
              strokeLinecap="round"
              opacity="0.8"
            />

            {/* SLE (Seletar) - Green */}
            <path
              d="M 430 170 C 480 165 550 180 620 210"
              stroke="#10B981"
              strokeWidth="5"
              strokeLinecap="round"
              opacity="0.8"
            />

            {/* CTE (Central Expressway) - Amber / Nervous */}
            <path
              d="M 520 200 C 515 250 510 320 525 385"
              stroke="#FEA619"
              strokeWidth="6"
              strokeLinecap="round"
              opacity="0.9"
            />

            {/* TPE (Tampines) - Mild Amber */}
            <path
              d="M 620 210 C 690 220 780 230 840 280"
              stroke="#FEA619"
              strokeWidth="5"
              strokeLinecap="round"
              opacity="0.85"
            />

            {/* PIE Base (Pan Island Expressway full west-east) */}
            {!isRouteActive && (
              <path
                d="M 240 380 C 330 350 415 310 520 295 C 620 295 720 315 820 320"
                stroke="#BA1A1A"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.85"
              />
            )}

            {/* ACTIVE NAVIGATION ROUTE HIGHLIGHT */}
            {isRouteActive && (
              <g id="active-route-group">
                {isClassicRoute ? (
                  <>
                    {/* Segment B: PIE Heavy Traffic Section (Red Jammed) */}
                    <path
                      d="M 415 310 C 470 300 530 285 620 295 C 670 300 700 315 730 318"
                      stroke="#BA1A1A"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      filter="url(#jam-glow)"
                    />
                    <path
                      d="M 415 310 C 470 300 530 285 620 295 C 670 300 700 315 730 318"
                      stroke="#FFB3AD"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Segment C: KPE Tunnel Connector (Amber Flow) */}
                    <path
                      d="M 620 295 C 625 330 635 365 650 380"
                      stroke="#FEA619"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M 620 295 C 625 330 635 365 650 380"
                      stroke="#FFDDB8"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Segment D: ECP Coastal Express (Green Breezy Flow to Airport) */}
                    <path
                      d="M 570 395 C 640 385 730 375 800 350 C 850 330 875 305 890 285"
                      stroke="#10B981"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      filter="url(#route-glow)"
                    />
                    <path
                      d="M 570 395 C 640 385 730 375 800 350 C 850 330 875 305 890 285"
                      stroke="#6FFBBE"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </>
                ) : (
                  <>
                    {/* Dynamic Computed Route Curve connecting fromPoint to toPoint */}
                    <path
                      d={
                        svgRoutePath ||
                        `M ${fromPoint.svgX} ${fromPoint.svgY} Q ${(fromPoint.svgX + toPoint.svgX) / 2} ${
                          (fromPoint.svgY + toPoint.svgY) / 2 - 35
                        } ${toPoint.svgX} ${toPoint.svgY}`
                      }
                      stroke="#006C49"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      filter="url(#route-glow)"
                    />
                    <path
                      d={
                        svgRoutePath ||
                        `M ${fromPoint.svgX} ${fromPoint.svgY} Q ${(fromPoint.svgX + toPoint.svgX) / 2} ${
                          (fromPoint.svgY + toPoint.svgY) / 2 - 35
                        } ${toPoint.svgX} ${toPoint.svgY}`
                      }
                      stroke="#6FFBBE"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </>
                )}

                {/* Origin Pin */}
                <circle cx={fromPoint.svgX} cy={fromPoint.svgY} r="7" fill="#006C49" />
                <circle cx={fromPoint.svgX} cy={fromPoint.svgY} r="3" fill="#ffffff" />
                <circle cx={fromPoint.svgX} cy={fromPoint.svgY} r="14" fill="#006C49" opacity="0.25">
                  <animate
                    attributeName="r"
                    values="7;18;7"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.3;0;0.3"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </circle>

                {/* Destination Pin */}
                <circle cx={toPoint.svgX} cy={toPoint.svgY} r="7" fill="#BA1A1A" />
                <circle cx={toPoint.svgX} cy={toPoint.svgY} r="3" fill="#ffffff" />
                <circle cx={toPoint.svgX} cy={toPoint.svgY} r="16" fill="#BA1A1A" opacity="0.25">
                  <animate
                    attributeName="r"
                    values="7;18;7"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.3;0;0.3"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </circle>
              </g>
            )}
          </svg>
        </div>

        {/* 3. MAP MARKERS OVERLAY (DIE-CUT STICKER BADGES) */}
        <div className="absolute inset-0 pointer-events-none">
          {/* PIE Sulking Badge */}
          {(activeFilter === 'all' || activeFilter === 'grumpy') && (
            <div
              className="pointer-events-auto absolute top-[44%] left-[58%] -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10"
              onClick={() => {
                onSelectExpressway('pie');
                setPreviewExpy('pie');
              }}
            >
              <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-full shadow-lg border-2 border-white hover:scale-110 active:scale-95 transition-transform">
                <span className="w-6 h-6 rounded-full bg-[#b91a24] flex items-center justify-center text-white text-[11px] font-extrabold shadow-inner">
                  😤
                </span>
                <div className="flex flex-col pr-1">
                  <span className="text-[11px] text-[#b91a24] font-extrabold leading-tight">
                    PIE: Sulking
                  </span>
                  <span className="text-[10px] text-[#3c4a42] font-bold leading-tight">
                    {pieData.currentSpeed} km/h
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* CTE Grumpy Badge */}
          {(activeFilter === 'all' || activeFilter === 'grumpy') && (
            <div
              className="pointer-events-auto absolute top-[36%] left-[49%] -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10"
              onClick={() => {
                onSelectExpressway('cte');
                setPreviewExpy('cte');
              }}
            >
              <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-full shadow-lg border-2 border-white hover:scale-110 active:scale-95 transition-transform">
                <span className="w-6 h-6 rounded-full bg-[#fea619] flex items-center justify-center text-[#684000] text-[11px] font-extrabold">
                  👀
                </span>
                <div className="flex flex-col pr-1">
                  <span className="text-[11px] text-[#855300] font-extrabold leading-tight">
                    CTE: Grumpy
                  </span>
                  <span className="text-[10px] text-[#3c4a42] font-bold leading-tight">
                    {cteData.currentSpeed} km/h
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* AYE Cruising Badge */}
          {activeFilter === 'all' && (
            <div
              className="pointer-events-auto absolute top-[64%] left-[34%] -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10"
              onClick={() => {
                onSelectExpressway('aye');
                setPreviewExpy('aye');
              }}
            >
              <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-full shadow-lg border-2 border-white hover:scale-110 active:scale-95 transition-transform">
                <span className="w-6 h-6 rounded-full bg-[#10b981] flex items-center justify-center text-[#00422b] text-[11px] font-extrabold">
                  🚗
                </span>
                <div className="flex flex-col pr-1">
                  <span className="text-[11px] text-[#006c49] font-extrabold leading-tight">
                    AYE: Cruising
                  </span>
                  <span className="text-[10px] text-[#3c4a42] font-bold leading-tight">
                    {ayeData.currentSpeed} km/h
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ECP Grinning Badge */}
          {activeFilter === 'all' && (
            <div
              className="pointer-events-auto absolute top-[57%] left-[76%] -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10"
              onClick={() => {
                onSelectExpressway('ecp');
                setPreviewExpy('ecp');
              }}
            >
              <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-full shadow-lg border-2 border-white hover:scale-110 active:scale-95 transition-transform">
                <span className="w-6 h-6 rounded-full bg-[#6ffbbe] flex items-center justify-center text-[#002113] text-[11px] font-extrabold">
                  😎
                </span>
                <div className="flex flex-col pr-1">
                  <span className="text-[11px] text-[#006c49] font-extrabold leading-tight">
                    ECP: Grinning
                  </span>
                  <span className="text-[10px] text-[#3c4a42] font-bold leading-tight">
                    {ecpData.currentSpeed} km/h
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* SLE Breezy Badge */}
          {activeFilter === 'all' && (
            <div
              className="pointer-events-auto absolute top-[27%] left-[53%] -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10"
              onClick={() => {
                onSelectExpressway('sle');
                setPreviewExpy('sle');
              }}
            >
              <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-full shadow-lg border-2 border-white hover:scale-110 active:scale-95 transition-transform">
                <span className="w-6 h-6 rounded-full bg-[#10b981] flex items-center justify-center text-[#00422b] text-[11px] font-extrabold">
                  🌿
                </span>
                <div className="flex flex-col pr-1">
                  <span className="text-[11px] text-[#006c49] font-extrabold leading-tight">
                    SLE: Breezy
                  </span>
                  <span className="text-[10px] text-[#3c4a42] font-bold leading-tight">
                    {sleData.currentSpeed} km/h
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* KPE Meh Badge */}
          {activeFilter === 'all' && (
            <div
              className="pointer-events-auto absolute top-[52%] left-[64%] -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10"
              onClick={() => {
                onSelectExpressway('kpe');
                setPreviewExpy('kpe');
              }}
            >
              <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-full shadow-lg border-2 border-white hover:scale-110 active:scale-95 transition-transform">
                <span className="w-6 h-6 rounded-full bg-[#ffddb8] flex items-center justify-center text-[#653e00] text-[11px] font-extrabold">
                  😐
                </span>
                <div className="flex flex-col pr-1">
                  <span className="text-[11px] text-[#855300] font-extrabold leading-tight">
                    KPE: Meh
                  </span>
                  <span className="text-[10px] text-[#3c4a42] font-bold leading-tight">
                    {kpeData.currentSpeed} km/h
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* INCIDENT 1: Accident on PIE Bedok North */}
          {(activeFilter === 'all' || activeFilter === 'incidents') && (
            <div
              className="pointer-events-auto absolute top-[47%] left-[68%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
              onClick={() =>
                onShowToast(
                  'Accident on PIE (towards Changi) before Bedok North Exit. Lane 1 blocked.'
                )
              }
            >
              <div
                className="w-7 h-7 rounded-full bg-[#ba1a1a] text-white flex items-center justify-center shadow-lg hover:scale-125 transition-transform ring-2 ring-white"
                title="Accident: Bedok North Exit"
              >
                <span className="material-symbols-outlined text-[15px]">car_crash</span>
              </div>
            </div>
          )}

          {/* INCIDENT 2: Roadworks Bartley slip road */}
          {(activeFilter === 'all' || activeFilter === 'incidents') && (
            <div
              className="pointer-events-auto absolute top-[40%] left-[61%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
              onClick={() =>
                onShowToast(
                  'Maintenance work on Bartley Viaduct slip road. Speed reduced to 50 km/h.'
                )
              }
            >
              <div
                className="w-7 h-7 rounded-full bg-[#fea619] text-[#2a1700] flex items-center justify-center shadow-lg hover:scale-125 transition-transform ring-2 ring-white"
                title="Roadwork: Bartley slip road"
              >
                <span className="material-symbols-outlined text-[15px]">traffic</span>
              </div>
            </div>
          )}

          {/* INCIDENT 3: Heavy Rain & Flash Ponding Alert Banner */}
          {(activeFilter === 'all' || activeFilter === 'incidents') && (
            <div
              className="pointer-events-auto absolute top-[43%] left-[54%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20"
              onClick={() =>
                onShowToast(
                  'NEA Warning: Heavy downpour along PIE stretch. Reduced visibility & ponding risk!'
                )
              }
            >
              <div className="flex items-center gap-1.5 bg-[#ffdad7] border border-[#ffb3ad] px-2.5 py-1 rounded-full shadow-lg hover:scale-105 transition-transform">
                <span className="text-[13px]">🌧️</span>
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#410004] font-extrabold leading-tight">
                    NEA: Heavy Rain & Floods
                  </span>
                  <span className="text-[9px] text-[#79000e] font-semibold leading-tight">
                    Ponding Risk • Kallang
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* CAMERAS PIN LAYER (when filter is 'cameras') */}
          {activeFilter === 'cameras' && (
            <>
              <div
                className="pointer-events-auto absolute top-[45%] left-[57%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20"
                onClick={() => onShowCameraModal(pieData.cameras[0])}
              >
                <div className="px-2 py-1 bg-white rounded-full shadow-lg border border-[#eee0d6] flex items-center gap-1 text-[11px] font-bold text-[#006c49] hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[14px]">videocam</span>
                  <span>CAM #4702</span>
                </div>
              </div>
              <div
                className="pointer-events-auto absolute top-[38%] left-[50%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20"
                onClick={() => onShowCameraModal(cteData.cameras[0])}
              >
                <div className="px-2 py-1 bg-white rounded-full shadow-lg border border-[#eee0d6] flex items-center gap-1 text-[11px] font-bold text-[#855300] hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[14px]">videocam</span>
                  <span>CAM #1701</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 4. FLOATING LIVE CAMERA PREVIEW CARD (MODAL / HOVER POPUP) */}
      {currentPreviewData && currentPreviewData.cameras.length > 0 && (
        <div className="absolute bottom-20 left-4 z-40 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-xl max-w-xs border border-[#eee0d6] transition-all animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-[#eee0d6]/70">
            <div className="flex items-center gap-1.5 truncate">
              <span className="w-2 h-2 rounded-full bg-[#ba1a1a] animate-ping shrink-0" />
              <span className="text-[13px] text-[#211a15] font-extrabold truncate">
                {currentPreviewData.cameras[0].location}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setPreviewExpy(null)}
              className="w-5 h-5 rounded-full flex items-center justify-center text-[#3c4a42] hover:text-[#211a15] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>

          <div
            onClick={() => onShowCameraModal(currentPreviewData.cameras[0])}
            className="w-full h-32 rounded-xl bg-[#f9ebe2] overflow-hidden relative shadow-inner cursor-pointer group"
          >
            <img
              src={currentPreviewData.cameras[0].imageUrl}
              alt={currentPreviewData.cameras[0].location}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
            <div className="absolute bottom-1.5 right-1.5 bg-[#211a15]/80 backdrop-blur-sm text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
              CAM #{currentPreviewData.cameras[0].camNumber} • LIVE
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between text-[11px]">
            <span className="text-[#b91a24] font-extrabold">
              {currentPreviewData.cameras[0].speedText}
            </span>
            <span className="text-[#3c4a42] font-semibold">
              {currentPreviewData.cameras[0].updatedAgo}
            </span>
          </div>
        </div>
      )}

      {/* 5. MAP CONTROLS & COLOR LEGEND (BOTTOM RIGHT) */}
      <div className="absolute bottom-4 right-4 z-30 flex flex-col items-end gap-2 pointer-events-none">
        {/* Expressway Vibe Legend */}
        <div className="bg-white/95 backdrop-blur-md p-2.5 rounded-xl shadow-md flex items-center gap-3 pointer-events-auto border border-[#eee0d6]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
            <span className="text-[11px] text-[#211a15] font-bold">Breezy &gt;70km/h</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#fea619]" />
            <span className="text-[11px] text-[#211a15] font-bold">Meh 40-70</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ba1a1a]" />
            <span className="text-[11px] text-[#211a15] font-bold">Sulking &lt;40</span>
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="flex flex-col bg-white/95 backdrop-blur-md rounded-full shadow-md overflow-hidden pointer-events-auto border border-[#eee0d6]">
          <button
            type="button"
            aria-label="Zoom In"
            onClick={() => handleZoom(0.25)}
            className="w-9 h-9 flex items-center justify-center text-[#211a15] hover:bg-[#f9ebe2] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[19px]">add</span>
          </button>
          <button
            type="button"
            aria-label="Zoom Out"
            onClick={() => handleZoom(-0.25)}
            className="w-9 h-9 flex items-center justify-center text-[#211a15] hover:bg-[#f9ebe2] transition-colors cursor-pointer border-t border-[#eee0d6]"
          >
            <span className="material-symbols-outlined text-[19px]">remove</span>
          </button>
          <button
            type="button"
            aria-label="Current Location"
            onClick={handleResetLocation}
            className="w-9 h-9 flex items-center justify-center text-[#006c49] hover:bg-[#f9ebe2] transition-colors cursor-pointer border-t border-[#eee0d6]"
          >
            <span className="material-symbols-outlined text-[18px]">my_location</span>
          </button>
        </div>
      </div>
    </main>
  );
};
