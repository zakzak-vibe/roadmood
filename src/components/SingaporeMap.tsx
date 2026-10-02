import React, { useEffect, useRef, useState, useCallback } from 'react';
import { EXPRESSWAYS, ExpresswayData } from '../data/trafficData';

declare global {
  interface Window {
    L: any;
    $: any;
  }
}

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
  fromPoint?: { name: string; svgX?: number; svgY?: number; lat?: number; lng?: number };
  toPoint?: { name: string; svgX?: number; svgY?: number; lat?: number; lng?: number };
  svgRoutePath?: string;
  isClassicRoute?: boolean;
}

// Expressway Real Coordinates (Lat, Lng) across Singapore
const EXPRESSWAY_COORDS: Record<string, { path: [number, number][]; center: [number, number] }> = {
  pie: {
    path: [
      [1.332, 103.655],
      [1.341, 103.708],
      [1.344, 103.743],
      [1.353, 103.785],
      [1.334, 103.856],
      [1.325, 103.882],
      [1.326, 103.905],
      [1.339, 103.955],
      [1.364, 103.991],
    ],
    center: [1.334, 103.856],
  },
  cte: {
    path: [
      [1.398, 103.865],
      [1.365, 103.856],
      [1.334, 103.856],
      [1.318, 103.851],
      [1.302, 103.842],
      [1.285, 103.844],
      [1.278, 103.848],
    ],
    center: [1.318, 103.851],
  },
  aye: {
    path: [
      [1.312, 103.642],
      [1.32, 103.72],
      [1.314, 103.765],
      [1.298, 103.785],
      [1.278, 103.815],
      [1.272, 103.845],
      [1.275, 103.858],
    ],
    center: [1.298, 103.785],
  },
  ecp: {
    path: [
      [1.364, 103.991],
      [1.345, 103.965],
      [1.31, 103.915],
      [1.298, 103.885],
      [1.288, 103.865],
      [1.275, 103.858],
    ],
    center: [1.31, 103.915],
  },
  kpe: {
    path: [
      [1.378, 103.895],
      [1.345, 103.888],
      [1.322, 103.885],
      [1.3, 103.875],
      [1.288, 103.865],
    ],
    center: [1.322, 103.885],
  },
  sle: {
    path: [
      [1.435, 103.785],
      [1.418, 103.815],
      [1.398, 103.855],
      [1.398, 103.865],
    ],
    center: [1.418, 103.815],
  },
  bke: {
    path: [
      [1.447, 103.771],
      [1.415, 103.775],
      [1.375, 103.778],
      [1.353, 103.785],
    ],
    center: [1.415, 103.775],
  },
};

const CAMERA_LOCATIONS: {
  id: string;
  camNumber: string;
  name: string;
  coords: [number, number];
  expyId: string;
  speed: string;
}[] = [
  {
    id: 'cam-4702',
    camNumber: '4702',
    name: 'PIE - Woodsville Flyover',
    coords: [1.334, 103.868],
    expyId: 'pie',
    speed: '28 km/h',
  },
  {
    id: 'cam-4703',
    camNumber: '4703',
    name: 'PIE - Kallang Way',
    coords: [1.325, 103.882],
    expyId: 'pie',
    speed: '31 km/h',
  },
  {
    id: 'cam-1701',
    camNumber: '1701',
    name: 'CTE - Moulmein Tunnel Entry',
    coords: [1.318, 103.851],
    expyId: 'cte',
    speed: '42 km/h',
  },
  {
    id: 'cam-2701',
    camNumber: '2701',
    name: 'KPE - Defu Underpass',
    coords: [1.345, 103.888],
    expyId: 'kpe',
    speed: '54 km/h',
  },
  {
    id: 'cam-3701',
    camNumber: '3701',
    name: 'ECP - Marine Parade',
    coords: [1.302, 103.905],
    expyId: 'ecp',
    speed: '84 km/h',
  },
  {
    id: 'cam-5701',
    camNumber: '5701',
    name: 'AYE - Keppel Viaduct',
    coords: [1.272, 103.845],
    expyId: 'aye',
    speed: '68 km/h',
  },
  {
    id: 'cam-6701',
    camNumber: '6701',
    name: 'SLE - Mandai Lake Flyover',
    coords: [1.418, 103.815],
    expyId: 'sle',
    speed: '76 km/h',
  },
];

const INCIDENT_LOCATIONS: {
  id: string;
  title: string;
  coords: [number, number];
  expyId: string;
  type: string;
}[] = [
  {
    id: 'inc-pie-1',
    title: 'PIE: Lane 1 Breakdown near Bedok North',
    coords: [1.338, 103.925],
    expyId: 'pie',
    type: 'breakdown',
  },
  {
    id: 'inc-pie-2',
    title: 'PIE: Heavy Rain • High Ponding Risk at Woodsville',
    coords: [1.334, 103.868],
    expyId: 'pie',
    type: 'ponding',
  },
  {
    id: 'inc-cte-1',
    title: 'CTE: ERP Gantry Surge past Moulmein',
    coords: [1.318, 103.851],
    expyId: 'cte',
    type: 'congestion',
  },
];

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
  fromPoint = { name: 'Toa Payoh Central', lat: 1.3343, lng: 103.8563 },
  toPoint = { name: 'Changi Airport T3', lat: 1.3644, lng: 103.9915 },
}) => {
  const mapInstanceRef = useRef<any>(null);
  const layersRef = useRef<{
    polylines: any[];
    markers: any[];
    routeLayer: any | null;
  }>({ polylines: [], markers: [], routeLayer: null });

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  // Initialize OneMap Leaflet Grey Map (TileJSON) as specified by user
  useEffect(() => {
    let isCancelled = false;

    const initMap = () => {
      const L = window.L;
      if (!L) {
        setTimeout(initMap, 100);
        return;
      }

      const mapContainer = document.getElementById('mapdiv');
      if (!mapContainer) return;

      // Clean up previous instance on mapdiv if any
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {
          console.warn('Map cleanup error:', e);
        }
        mapInstanceRef.current = null;
      }

      if ((mapContainer as any)._leaflet_id) {
        delete (mapContainer as any)._leaflet_id;
        mapContainer.innerHTML = '';
      }

      const sw = L.latLng(1.144, 103.535);
      const ne = L.latLng(1.494, 104.502);
      const bounds = L.latLngBounds(sw, ne);

      const attributionHtml =
        '<img src="https://www.onemap.gov.sg/web-assets/images/logo/om_logo.png" style="height:20px;width:20px;"/>&nbsp;<a href="https://www.onemap.gov.sg/" target="_blank" rel="noopener noreferrer">OneMap</a>&nbsp;&copy;&nbsp;contributors&nbsp;&#124;&nbsp;<a href="https://www.sla.gov.sg/" target="_blank" rel="noopener noreferrer">Singapore Land Authority</a>';

      const setupMap = (data: any) => {
        if (isCancelled) return;

        let map: any;

        try {
          if (L.TileJSON && typeof L.TileJSON.createMap === 'function') {
            map = L.TileJSON.createMap('mapdiv', data);
          } else {
            map = L.map('mapdiv', {
              maxBounds: bounds,
              minZoom: 11,
              maxZoom: 19,
              attributionControl: true,
            });
            const tileUrl =
              (data && data.tiles && data.tiles[0]) ||
              'https://www.onemap.gov.sg/maps/tiles/Grey_HD/{z}/{x}/{y}.png';
            L.tileLayer(tileUrl, {
              minZoom: 11,
              maxZoom: 19,
              bounds: [
                [1.16, 103.502],
                [1.56073, 104.11475],
              ],
            }).addTo(map);
          }
        } catch (err) {
          console.warn('L.TileJSON.createMap fallback to L.map:', err);
          map = L.map('mapdiv', {
            maxBounds: bounds,
            minZoom: 11,
            maxZoom: 19,
            attributionControl: true,
          });
          L.tileLayer('https://www.onemap.gov.sg/maps/tiles/Grey_HD/{z}/{x}/{y}.png', {
            minZoom: 11,
            maxZoom: 19,
            bounds: [
              [1.16, 103.502],
              [1.56073, 104.11475],
            ],
          }).addTo(map);
        }

        map.setMaxBounds(bounds);
        map.setView(L.latLng(1.2868108, 103.8545349), 16);

        /** DO NOT REMOVE the OneMap attribution below **/
        if (map.attributionControl) {
          map.attributionControl.setPrefix(attributionHtml);
        }

        mapInstanceRef.current = map;

        // Invalidate size to guarantee tile rendering inside flex containers
        setTimeout(() => {
          if (map) map.invalidateSize();
        }, 150);
        setTimeout(() => {
          if (map) map.invalidateSize();
        }, 500);

        setMapReady(true);
      };

      // Use $.get as specified in the OneMap snippet, with fallback to fetch
      if (window.$ && typeof window.$.get === 'function') {
        window.$.get(
          'https://www.onemap.gov.sg/maps/json/raster/tilejson/2.2.0/Grey.json',
          function (data: any) {
            setupMap(data);
          }
        );
      } else {
        fetch('https://www.onemap.gov.sg/maps/json/raster/tilejson/2.2.0/Grey.json')
          .then((res) => res.json())
          .then((data) => setupMap(data))
          .catch((err) => {
            console.warn('Grey.json fetch fallback:', err);
            setupMap({
              tiles: ['https://www.onemap.gov.sg/maps/tiles/Grey_HD/{z}/{x}/{y}.png'],
            });
          });
      }
    };

    initMap();

    return () => {
      isCancelled = true;
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {
          console.warn('Map cleanup error:', e);
        }
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Render expressway polylines, mascot tags, camera pins, and active route
  const renderMapLayers = useCallback(() => {
    const map = mapInstanceRef.current;
    const L = window.L;
    if (!map || !L || !mapReady) return;

    // Clear previous dynamic layers
    layersRef.current.polylines.forEach((poly) => poly.remove());
    layersRef.current.markers.forEach((marker) => marker.remove());
    if (layersRef.current.routeLayer) {
      layersRef.current.routeLayer.remove();
      layersRef.current.routeLayer = null;
    }
    layersRef.current.polylines = [];
    layersRef.current.markers = [];

    // 1. Draw Expressway Polylines
    Object.entries(EXPRESSWAYS).forEach(([id, baseData]) => {
      const coords = EXPRESSWAY_COORDS[id];
      if (!coords) return;

      const live = liveExpressways?.[id];
      const speed = live?.currentSpeed ?? baseData.currentSpeed;
      const mood = live?.mood ?? baseData.mood;

      const isSelected = selectedExpressway === id;
      const isRed = mood === 'sulking' || speed < 40;
      const isAmber = mood === 'meh' || mood === 'grumpy' || (speed >= 40 && speed < 70);

      const color = isRed ? '#b91a24' : isAmber ? '#fea619' : '#10b981';

      if (activeFilter === 'grumpy' && !isRed && !isAmber) return;

      const polyline = L.polyline(coords.path, {
        color,
        weight: isSelected ? 8 : 5,
        opacity: isSelected ? 0.95 : 0.85,
        smoothFactor: 1,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map);

      polyline.on('click', () => {
        onSelectExpressway(id);
        onShowToast(`Selected ${baseData.name} (${speed} km/h • ${mood})`);
      });

      polyline.bindTooltip(
        `<div class="p-1 font-sans">
          <strong>${baseData.code}</strong>: ${speed} km/h
          <div class="text-[11px] text-gray-600">${baseData.name}</div>
        </div>`,
        { sticky: true }
      );

      layersRef.current.polylines.push(polyline);

      // Add Mascot Marker at Expressway Center
      const emoji = isRed ? '😤' : isAmber ? '👀' : '🏄‍♂️';
      const mascotIcon = L.divIcon({
        className: 'custom-mascot-pin',
        html: `
          <div style="
            display: flex;
            align-items: center;
            gap: 4px;
            background: white;
            padding: 3px 8px;
            border-radius: 9999px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.18);
            border: 2px solid ${color};
            cursor: pointer;
            font-family: inherit;
            transform: translate(-50%, -50%);
            white-space: nowrap;
          ">
            <span style="font-size: 15px;">${emoji}</span>
            <span style="font-size: 11px; font-weight: 800; color: #211a15;">${baseData.code}</span>
            <span style="
              font-size: 10px;
              font-weight: 800;
              background: ${color};
              color: white;
              padding: 1px 5px;
              border-radius: 9999px;
            ">${speed}</span>
          </div>
        `,
        iconSize: [80, 28],
        iconAnchor: [40, 14],
      });

      const mascotMarker = L.marker(coords.center, { icon: mascotIcon }).addTo(map);
      mascotMarker.on('click', () => {
        onSelectExpressway(id);
        onShowToast(`Highlighting ${baseData.name} (${speed} km/h)`);
      });
      layersRef.current.markers.push(mascotMarker);
    });

    // 2. Draw Camera Markers
    if (activeFilter === 'all' || activeFilter === 'cameras') {
      CAMERA_LOCATIONS.forEach((cam) => {
        const camIcon = L.divIcon({
          className: 'custom-cam-pin',
          html: `
            <div style="
              background: #211a15;
              color: white;
              width: 28px;
              height: 28px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 2px 6px rgba(0,0,0,0.25);
              border: 2px solid #6ffbbe;
              cursor: pointer;
              transform: translate(-50%, -50%);
            ">
              <span style="font-size: 14px;">📷</span>
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const marker = L.marker(cam.coords, { icon: camIcon }).addTo(map);
        marker.on('click', () => {
          const expyData = EXPRESSWAYS[cam.expyId];
          const foundCam = expyData?.cameras.find((c) => c.id === cam.id) || {
            id: cam.id,
            camNumber: cam.camNumber,
            location: cam.name,
            imageUrl:
              'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=600&q=80',
            updatedAgo: 'Live snapshot',
            speedText: cam.speed,
          };
          onShowCameraModal(foundCam);
        });

        marker.bindTooltip(`<strong>${cam.name}</strong><br/>Click to view camera feed`, {
          direction: 'top',
        });
        layersRef.current.markers.push(marker);
      });
    }

    // 3. Draw Incident Markers
    if (activeFilter === 'all' || activeFilter === 'incidents') {
      INCIDENT_LOCATIONS.forEach((inc) => {
        const incIcon = L.divIcon({
          className: 'custom-inc-pin',
          html: `
            <div style="
              background: #b91a24;
              color: white;
              padding: 2px 6px;
              border-radius: 12px;
              font-size: 11px;
              font-weight: 800;
              box-shadow: 0 2px 8px rgba(185,26,36,0.4);
              border: 2px solid white;
              cursor: pointer;
              transform: translate(-50%, -50%);
              white-space: nowrap;
            ">
              ⚠️ ${inc.type.toUpperCase()}
            </div>
          `,
          iconSize: [60, 24],
          iconAnchor: [30, 12],
        });

        const marker = L.marker(inc.coords, { icon: incIcon }).addTo(map);
        marker.bindTooltip(`<strong>${inc.title}</strong>`, { direction: 'top' });
        layersRef.current.markers.push(marker);
      });
    }

    // 4. Draw Active Route Line & Endpoint Markers
    if (isRouteActive && fromPoint.lat && fromPoint.lng && toPoint.lat && toPoint.lng) {
      const startLatLng: [number, number] = [fromPoint.lat, fromPoint.lng];
      const endLatLng: [number, number] = [toPoint.lat, toPoint.lng];

      const routePoints: [number, number][] = [
        startLatLng,
        [
          (startLatLng[0] + endLatLng[0]) / 2 + (startLatLng[0] > endLatLng[0] ? -0.01 : 0.01),
          (startLatLng[1] + endLatLng[1]) / 2,
        ],
        endLatLng,
      ];

      const routeGroup = L.featureGroup();

      // Outer glow
      L.polyline(routePoints, {
        color: '#6ffbbe',
        weight: 10,
        opacity: 0.6,
        lineCap: 'round',
      }).addTo(routeGroup);

      // Inner stroke
      L.polyline(routePoints, {
        color: '#006c49',
        weight: 5,
        dashArray: '8, 8',
        opacity: 0.95,
        lineCap: 'round',
      }).addTo(routeGroup);

      // Start Marker (Origin)
      const startIcon = L.divIcon({
        className: 'route-start-pin',
        html: `
          <div style="
            background: #006c49;
            color: white;
            padding: 4px 10px;
            border-radius: 9999px;
            font-size: 11px;
            font-weight: 800;
            box-shadow: 0 4px 12px rgba(0,108,73,0.4);
            border: 2px solid white;
            white-space: nowrap;
            transform: translate(-50%, -100%);
          ">
            📍 ${fromPoint.name.split(' ')[0]}
          </div>
        `,
        iconSize: [60, 26],
        iconAnchor: [30, 26],
      });
      L.marker(startLatLng, { icon: startIcon }).addTo(routeGroup);

      // End Marker (Destination)
      const endIcon = L.divIcon({
        className: 'route-end-pin',
        html: `
          <div style="
            background: #b91a24;
            color: white;
            padding: 4px 10px;
            border-radius: 9999px;
            font-size: 11px;
            font-weight: 800;
            box-shadow: 0 4px 12px rgba(185,26,36,0.4);
            border: 2px solid white;
            white-space: nowrap;
            transform: translate(-50%, -100%);
          ">
            🎯 ${toPoint.name.split(' ')[0]}
          </div>
        `,
        iconSize: [60, 26],
        iconAnchor: [30, 26],
      });
      L.marker(endLatLng, { icon: endIcon }).addTo(routeGroup);

      routeGroup.addTo(map);
      layersRef.current.routeLayer = routeGroup;

      map.fitBounds([startLatLng, endLatLng], {
        padding: [60, 60],
        maxZoom: 15,
      });
    }
  }, [
    mapReady,
    activeFilter,
    selectedExpressway,
    liveExpressways,
    isRouteActive,
    fromPoint,
    toPoint,
    onSelectExpressway,
    onShowCameraModal,
    onShowToast,
  ]);

  useEffect(() => {
    renderMapLayers();
  }, [renderMapLayers]);

  // Zoom and Recenter Handlers
  const handleZoom = (delta: number) => {
    const map = mapInstanceRef.current;
    if (map) {
      map.setZoom(map.getZoom() + delta);
      onShowToast(delta > 0 ? 'Zoomed in on OneMap' : 'Zoomed out on OneMap');
    }
  };

  const handleResetLocation = () => {
    const map = mapInstanceRef.current;
    const L = window.L;
    if (map && L) {
      map.setView(L.latLng(1.2868108, 103.8545349), 16);
      onShowToast('Centered on OneMap Downtown (Zoom 16)');
    }
  };

  const handleFitIsland = () => {
    const map = mapInstanceRef.current;
    const L = window.L;
    if (map && L) {
      map.setView(L.latLng(1.3521, 103.8198), 12);
      onShowToast('Centered on Singapore Island live network');
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    onShowToast('Pulling live LTA DataMall speeds, incidents & cameras...');
    if (onRefreshLive) {
      await onRefreshLive();
    }
    setTimeout(() => {
      setIsRefreshing(false);
      onShowToast('Live telemetry refreshed! Expressway spirits updated.');
    }, 600);
  };

  return (
    <main className="flex-1 relative bg-[#e5e5e5] overflow-hidden flex flex-col min-h-[500px]">
      {/* 1. Official OneMap Grey Leaflet Canvas (Container id='mapdiv' as specified) */}
      <div
        id="mapdiv"
        style={{ height: '100%', minHeight: '600px', width: '100%', position: 'relative' }}
        className="z-0 flex-1 outline-none"
      />

      {/* 2. Top Controls & Filter Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md p-1.5 rounded-full shadow-lg border border-[#eee0d6] pointer-events-auto">
          <button
            type="button"
            onClick={() => {
              setActiveFilter('all');
              onShowToast('Showing all expressways & cameras');
            }}
            className={`px-3.5 py-1.5 rounded-full text-[12px] font-extrabold transition-all cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-[#006c49] text-white shadow-xs'
                : 'text-[#3c4a42] hover:bg-[#fff1e7]'
            }`}
          >
            All Expressways
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveFilter('grumpy');
              onShowToast('Filtering: Slow & Grumpy crawls only');
            }}
            className={`px-3.5 py-1.5 rounded-full text-[12px] font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeFilter === 'grumpy'
                ? 'bg-[#b91a24] text-white shadow-xs'
                : 'text-[#3c4a42] hover:bg-[#fff1e7]'
            }`}
          >
            <span>😤</span>
            <span>Grumpy Crawls</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveFilter('incidents');
              onShowToast('Filtering: Live incidents & ponding');
            }}
            className={`px-3.5 py-1.5 rounded-full text-[12px] font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeFilter === 'incidents'
                ? 'bg-[#fea619] text-[#2a1700] shadow-xs'
                : 'text-[#3c4a42] hover:bg-[#fff1e7]'
            }`}
          >
            <span>⚠️</span>
            <span>Incidents</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveFilter('cameras');
              onShowToast('Highlighting live traffic camera snapshots');
            }}
            className={`px-3.5 py-1.5 rounded-full text-[12px] font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeFilter === 'cameras'
                ? 'bg-[#211a15] text-[#6ffbbe] shadow-xs'
                : 'text-[#3c4a42] hover:bg-[#fff1e7]'
            }`}
          >
            <span>📷</span>
            <span>Cameras</span>
          </button>
        </div>

        {/* Live Indicator & Telemetry Button */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            type="button"
            onClick={onOpenApiHealth}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md shadow-md border border-[#eee0d6] text-[12px] font-extrabold text-[#211a15] hover:bg-[#f9ebe2] transition-colors cursor-pointer"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#006c49]" />
            </span>
            <span>OneMap Grey • Live</span>
          </button>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="w-8 h-8 rounded-full bg-white/95 backdrop-blur-md shadow-md border border-[#eee0d6] flex items-center justify-center text-[#211a15] hover:bg-[#f9ebe2] transition-colors cursor-pointer disabled:opacity-50"
            title="Refresh live telemetry feeds"
          >
            <span
              className={`material-symbols-outlined text-[18px] text-[#006c49] ${
                isRefreshing ? 'animate-spin' : ''
              }`}
            >
              refresh
            </span>
          </button>
        </div>
      </div>

      {/* 3. Bottom Expressway Speed Summary Ribbon */}
      <div className="absolute bottom-4 left-4 right-16 z-20 pointer-events-none flex flex-wrap gap-2 items-center">
        <div className="bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-lg border border-[#eee0d6] pointer-events-auto flex items-center gap-3 overflow-x-auto max-w-full">
          <span className="text-[10px] font-extrabold uppercase text-[#3c4a42] tracking-wider shrink-0">
            Speeds:
          </span>
          {Object.entries(EXPRESSWAYS)
            .slice(0, 5)
            .map(([id, ex]) => {
              const live = liveExpressways?.[id];
              const speed = live?.currentSpeed ?? ex.currentSpeed;
              const isSlow = speed < 45;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    onSelectExpressway(id);
                    onShowToast(`Selected ${ex.name} (${speed} km/h)`);
                  }}
                  className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-extrabold border transition-all cursor-pointer ${
                    selectedExpressway === id
                      ? 'bg-[#211a15] text-white border-[#211a15]'
                      : isSlow
                      ? 'bg-[#ffdad7] text-[#b91a24] border-[#ffb3ad]'
                      : 'bg-[#fff1e7] text-[#006c49] border-[#eee0d6]'
                  }`}
                >
                  <span>{ex.code}</span>
                  <span>{speed} km/h</span>
                </button>
              );
            })}
        </div>
      </div>

      {/* 4. Floating Zoom & Recenter Controls */}
      <div className="absolute right-4 bottom-8 z-20 flex flex-col bg-white/95 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden border border-[#eee0d6]">
        <button
          type="button"
          aria-label="Zoom In"
          onClick={() => handleZoom(1)}
          className="w-10 h-10 flex items-center justify-center text-[#211a15] hover:bg-[#f9ebe2] transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
        </button>
        <button
          type="button"
          aria-label="Zoom Out"
          onClick={() => handleZoom(-1)}
          className="w-10 h-10 flex items-center justify-center text-[#211a15] hover:bg-[#f9ebe2] transition-colors cursor-pointer border-t border-[#eee0d6]"
        >
          <span className="material-symbols-outlined text-[20px]">remove</span>
        </button>
        <button
          type="button"
          aria-label="Reset Downtown View (Zoom 16)"
          onClick={handleResetLocation}
          className="w-10 h-10 flex items-center justify-center text-[#006c49] hover:bg-[#f9ebe2] transition-colors cursor-pointer border-t border-[#eee0d6]"
          title="Downtown View (Zoom 16)"
        >
          <span className="material-symbols-outlined text-[19px]">near_me</span>
        </button>
        <button
          type="button"
          aria-label="Singapore Island View"
          onClick={handleFitIsland}
          className="w-10 h-10 flex items-center justify-center text-[#3c4a42] hover:bg-[#f9ebe2] transition-colors cursor-pointer border-t border-[#eee0d6]"
          title="Singapore Island View"
        >
          <span className="material-symbols-outlined text-[19px]">map</span>
        </button>
      </div>
    </main>
  );
};
