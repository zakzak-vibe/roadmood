import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { RoutePanel } from './components/RoutePanel';
import { SingaporeMap } from './components/SingaporeMap';
import { AwardsView } from './components/AwardsView';
import { MyTripsView } from './components/MyTripsView';
import { StartDriveModal } from './components/StartDriveModal';
import { CameraModal } from './components/CameraModal';
import { NotificationsDrawer } from './components/NotificationsDrawer';
import { ApiHealthModal } from './components/ApiHealthModal';
import { Footer } from './components/Footer';
import {
  CHANGI_TRIP_DATA,
  INITIAL_SAVED_TRIPS,
  SavedTrip,
  EXPRESSWAYS,
  ExpresswayData,
  RouteTripDetail,
} from './data/trafficData';
import {
  fetchTrafficOverview,
  fetchOneMapRoute,
  TrafficOverviewResponse,
} from './services/ltaApi';

// Coordinate lookup for Singapore landmarks for OneMap routing
const DESTINATION_COORDS: Record<string, { lat: number; lng: number }> = {
  'changi': { lat: 1.3644, lng: 103.9915 },
  'marina': { lat: 1.2789, lng: 103.8536 },
  'jurong': { lat: 1.3331, lng: 103.7436 },
  'orchard': { lat: 1.3048, lng: 103.8318 },
  'woodlands': { lat: 1.4470, lng: 103.7717 },
  'sentosa': { lat: 1.2540, lng: 103.8238 },
  'tampines': { lat: 1.3533, lng: 103.9452 },
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'moods' | 'awards' | 'my-trips'>('moods');
  const [origin, setOrigin] = useState<string>('📍 My location (Toa Payoh Central)');
  const [destination, setDestination] = useState<string>('Changi Airport Terminal 3');
  const [activeFilter, setActiveFilter] = useState<'all' | 'grumpy' | 'incidents' | 'cameras'>('all');
  const [selectedExpressway, setSelectedExpressway] = useState<string | null>(null);
  const [selectedCamera, setSelectedCamera] = useState<ExpresswayData['cameras'][0] | null>(null);
  const [isDriving, setIsDriving] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [isApiHealthOpen, setIsApiHealthOpen] = useState<boolean>(false);
  const [savedTrips, setSavedTrips] = useState<SavedTrip[]>(INITIAL_SAVED_TRIPS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastTimeout, setToastTimeout] = useState<number | null>(null);

  // Live telemetry state from endpoints
  const [liveOverview, setLiveOverview] = useState<TrafficOverviewResponse | null>(null);
  const [isLiveActive, setIsLiveActive] = useState<boolean>(false);
  const [routeData, setRouteData] = useState<RouteTripDetail>(CHANGI_TRIP_DATA);

  // Informational Dialogs
  const [infoModal, setInfoModal] = useState<{ title: string; content: string } | null>(null);

  const isRouteActive = Boolean(destination && destination.trim().length > 0);

  // Pull live data from /api/traffic-overview
  const loadLiveTraffic = async () => {
    try {
      const data = await fetchTrafficOverview();
      setLiveOverview(data);
      setIsLiveActive(true);

      // Dynamically update routeData with live speeds and weather
      if (data.expressways) {
        setRouteData((prev) => {
          const pieLive = data.expressways.pie;
          const kpeLive = data.expressways.kpe;
          const ecpLive = data.expressways.ecp;

          const updatedExpys = prev.expressways.map((ex) => {
            if (ex.code === 'PIE' && pieLive) {
              return {
                ...ex,
                speedKmH: pieLive.currentSpeed,
                mood: pieLive.mood as any,
                moodLabel: pieLive.moodLabel,
                characterQuote: pieLive.quote,
              };
            }
            if (ex.code === 'KPE' && kpeLive) {
              return {
                ...ex,
                speedKmH: kpeLive.currentSpeed,
                mood: kpeLive.mood as any,
                moodLabel: kpeLive.moodLabel,
                characterQuote: kpeLive.quote,
              };
            }
            if (ex.code === 'ECP' && ecpLive) {
              return {
                ...ex,
                speedKmH: ecpLive.currentSpeed,
                mood: ecpLive.mood as any,
                moodLabel: ecpLive.moodLabel,
                characterQuote: ecpLive.quote,
              };
            }
            return ex;
          });

          return {
            ...prev,
            weatherWarning: {
              title: data.weather?.forecast ? `NEA: ${data.weather.forecast.toUpperCase()}` : prev.weatherWarning.title,
              updatedAgo: 'Live Forecast',
              description: data.weather?.forecast
                ? `${data.weather.forecast} over ${data.weather.area || 'eastern expressway corridor'}. Drive with caution.`
                : prev.weatherWarning.description,
            },
            expressways: updatedExpys,
          };
        });
      }
    } catch (err) {
      console.warn('Failed to pull live traffic overview:', err);
    }
  };

  // Initial load and auto-refresh every 30s
  useEffect(() => {
    loadLiveTraffic();
    const interval = setInterval(loadLiveTraffic, 30000);
    return () => clearInterval(interval);
  }, []);

  // Recalculate route using OneMap when destination changes
  useEffect(() => {
    if (!destination) return;

    const lower = destination.toLowerCase();
    let destCoord = DESTINATION_COORDS['changi'];
    for (const [key, coord] of Object.entries(DESTINATION_COORDS)) {
      if (lower.includes(key)) {
        destCoord = coord;
        break;
      }
    }

    const startCoord = '1.3343,103.8563'; // Toa Payoh
    const endCoord = `${destCoord.lat},${destCoord.lng}`;

    fetchOneMapRoute(startCoord, endCoord)
      .then((oneMapRes) => {
        if (oneMapRes && oneMapRes.route_summary) {
          const estMins = Math.round(oneMapRes.route_summary.total_time / 60) || 35;
          const distKm = parseFloat((oneMapRes.route_summary.total_distance / 1000).toFixed(1)) || 24.6;

          setRouteData((prev) => ({
            ...prev,
            toText: destination,
            estMinutes: estMins,
            distanceKm: distKm,
            delayMinutes: Math.max(0, estMins - Math.round(distKm * 0.9)),
          }));
        }
      })
      .catch((e) => {
        console.warn('OneMap route fetch error:', e);
      });
  }, [destination]);

  const showToast = (message: string) => {
    if (toastTimeout) {
      window.clearTimeout(toastTimeout);
    }
    setToastMessage(message);
    const timeout = window.setTimeout(() => {
      setToastMessage(null);
    }, 3400);
    setToastTimeout(timeout);
  };

  const handleSwapRoute = () => {
    if (!destination) {
      setDestination('Changi Airport Terminal 3');
      showToast('Route set to Changi Airport Terminal 3');
      return;
    }
    const currentOrigin = origin.replace('📍 ', '');
    const currentDest = destination;
    setOrigin(`📍 ${currentDest}`);
    setDestination(currentOrigin);
    showToast('Route swapped! Recalculating expressway spirits...');
  };

  const handleRequestLocation = () => {
    showToast('GPS: Location locked to Toa Payoh Central (1.3343° N, 103.8563° E)');
    setOrigin('📍 My location (Toa Payoh Central)');
    setDestination('Changi Airport Terminal 3');
  };

  const handleSelectSavedTrip = (trip: SavedTrip) => {
    setOrigin(`📍 ${trip.from}`);
    setDestination(trip.to);
    showToast(`Loaded saved commute: ${trip.title}`);
  };

  const handleAlertWhenGreen = () => {
    showToast('Ding! We will buzz your phone the moment PIE turns green (>70 km/h).');
  };

  return (
    <div className="min-h-screen bg-[#fff8f5] text-[#211a15] flex flex-col font-sans selection:bg-[#6ffbbe] selection:text-[#002113]">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'moods') {
            showToast('Switched to Live Moods Map');
          }
        }}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        unreadCount={2}
        onFocusMap={() => {
          setActiveTab('moods');
          showToast('Centered on Singapore Live Map');
        }}
        onOpenApiHealth={() => setIsApiHealthOpen(true)}
      />

      {/* Main Content Area */}
      <main className="w-full pt-16 flex-1 flex flex-col">
        {activeTab === 'moods' && (
          <div className="flex-1 w-full flex flex-col lg:flex-row overflow-hidden relative min-h-[calc(100vh-4rem)]">
            {/* Left Route Panel (Screens A & B) */}
            <RoutePanel
              origin={origin}
              setOrigin={setOrigin}
              destination={destination}
              setDestination={setDestination}
              isRouteActive={isRouteActive}
              routeData={routeData}
              savedTrips={savedTrips}
              onSelectSavedTrip={handleSelectSavedTrip}
              onSwapRoute={handleSwapRoute}
              onRequestLocation={handleRequestLocation}
              onSelectExpressway={(id) => {
                setSelectedExpressway(id);
                const expy = EXPRESSWAYS[id];
                if (expy) {
                  showToast(`Highlighting ${expy.name} (${expy.currentSpeed} km/h)`);
                }
              }}
              onAlertWhenGreen={handleAlertWhenGreen}
              onStartDrive={() => setIsDriving(true)}
              onViewAwards={() => setActiveTab('awards')}
              onShowToast={showToast}
              liveOverview={liveOverview}
            />

            {/* Right Map Canvas */}
            <SingaporeMap
              isRouteActive={isRouteActive}
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
              selectedExpressway={selectedExpressway}
              onSelectExpressway={(id) => setSelectedExpressway(id)}
              onShowCameraModal={(cam) => setSelectedCamera(cam)}
              onShowToast={showToast}
              onOpenApiHealth={() => setIsApiHealthOpen(true)}
              liveExpressways={liveOverview?.expressways}
              onRefreshLive={loadLiveTraffic}
              isLiveActive={isLiveActive}
            />
          </div>
        )}

        {activeTab === 'awards' && (
          <AwardsView
            onBackToMoods={() => setActiveTab('moods')}
            onShowToast={showToast}
          />
        )}

        {activeTab === 'my-trips' && (
          <MyTripsView
            savedTrips={savedTrips}
            onSelectTrip={(trip) => {
              handleSelectSavedTrip(trip);
              setActiveTab('moods');
            }}
            onAddTrip={(trip) => {
              setSavedTrips((prev) => [trip, ...prev]);
            }}
            onDeleteTrip={(id) => {
              setSavedTrips((prev) => prev.filter((t) => t.id !== id));
              showToast('Commute removed from saved list.');
            }}
            onBackToMoods={() => setActiveTab('moods')}
            onShowToast={showToast}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onOpenDataSources={() => setIsApiHealthOpen(true)}
        onOpenVibeSupport={() =>
          setInfoModal({
            title: 'Expressway Vibe Support',
            content:
              'Got stuck in a massive crawl on CTE or PIE? Our emotional algorithm translates expressway sensor densities into expressive personality moods. Remember to take a deep breath, keep safe following distances in wet weather, and let Road Moods cheer you up!',
          })
        }
      />

      {/* Turn-by-Turn Driving Simulation Modal */}
      {isDriving && (
        <StartDriveModal
          destination={destination || 'Changi Airport Terminal 3'}
          onClose={() => {
            setIsDriving(false);
            showToast('Driving session ended. Hope your drive was smooth!');
          }}
        />
      )}

      {/* Camera Full-Screen Modal */}
      {selectedCamera && (
        <CameraModal
          camera={selectedCamera}
          onClose={() => setSelectedCamera(null)}
          onShowToast={showToast}
        />
      )}

      {/* Notifications Drawer */}
      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onShowToast={showToast}
      />

      {/* API Health Monitor Modal */}
      {isApiHealthOpen && (
        <ApiHealthModal
          onClose={() => setIsApiHealthOpen(false)}
          onShowToast={showToast}
        />
      )}

      {/* Information Dialog Modal */}
      {infoModal && (
        <div className="fixed inset-0 z-50 bg-[#211a15]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#eee0d6] animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#eee0d6]">
              <h3 className="text-[18px] font-extrabold text-[#211a15]">{infoModal.title}</h3>
              <button
                onClick={() => setInfoModal(null)}
                className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-[#f9ebe2] text-[#3c4a42] cursor-pointer"
              >
                ✕
              </button>
            </div>
            <p className="text-[13px] text-[#3c4a42] leading-relaxed mt-2">{infoModal.content}</p>
            <div className="mt-4 pt-3 flex justify-end">
              <button
                onClick={() => setInfoModal(null)}
                className="px-4 py-1.5 rounded-full bg-[#006c49] text-white text-[12px] font-bold cursor-pointer hover:bg-[#10b981]"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION CONTAINER (MATCHING MOCKUP) */}
      <div
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#372f29] text-[#fceee4] px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 text-[13px] font-bold transition-all duration-300 ${
          toastMessage
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <span className="material-symbols-outlined text-[#4edea3] text-[18px]">info</span>
        <span>{toastMessage}</span>
      </div>
    </div>
  );
}
