// Client service to consume /api/* endpoints

export interface ApiHealthResponse {
  status: string;
  timestamp: string;
  uptime: number;
  latency_ms: number;
  env: {
    node_env: string;
    LTA_ACCOUNT_KEY: string;
    ONEMAP_TOKEN: string;
  };
  services: {
    lta_datamall: {
      name: string;
      endpoints: Record<string, string>;
      key_configured: boolean;
      status: string;
    };
    onemap_routing: {
      name: string;
      endpoint: string;
      token_configured: boolean;
      status: string;
    };
    nea_weather: {
      name: string;
      endpoint: string;
      status: string;
    };
  };
}

export interface LiveExpressway {
  code: string;
  name: string;
  currentSpeed: number;
  mood: 'sulking' | 'grumpy' | 'meh' | 'cruising' | 'breezy' | 'grinning';
  moodLabel: string;
  emoji: string;
  delayMinutes: number;
  camImage: string;
  quote: string;
}

export interface TrafficOverviewResponse {
  success: boolean;
  isLive: boolean;
  ltaKeyConfigured: boolean;
  lastUpdated: string;
  grumpiestExpy: {
    code: string;
    name: string;
    currentSpeed: number;
    delayMinutes: number;
    mood: string;
    moodLabel: string;
    quote: string;
    peakDelayNote: string;
  };
  expressways: Record<string, LiveExpressway>;
  incidents: {
    Type: string;
    Latitude: number;
    Longitude: number;
    Message: string;
  }[];
  floodAlerts: {
    headline: string;
    description: string;
    areaDesc: string;
    severity: string;
  }[];
  weather: {
    area: string;
    forecast: string;
    valid_from: string;
    valid_to: string;
  };
}

export interface OneMapRouteResponse {
  status_message: string;
  route_geometry: string;
  status: number;
  route_instructions: (string | number)[][];
  route_name: string[];
  route_summary: {
    start_point: string;
    end_point: string;
    total_time: number;
    total_distance: number;
  };
}

export async function fetchTrafficOverview(): Promise<TrafficOverviewResponse> {
  const res = await fetch('/api/traffic-overview');
  if (!res.ok) throw new Error(`Failed to fetch traffic overview: ${res.statusText}`);
  return res.json();
}

export async function fetchApiHealth(): Promise<ApiHealthResponse> {
  const res = await fetch('/api/health');
  if (!res.ok) throw new Error(`Health check failed: ${res.statusText}`);
  return res.json();
}

export async function fetchTrafficIncidents() {
  const res = await fetch('/api/traffic-incidents');
  if (!res.ok) throw new Error(`Failed to fetch incidents: ${res.statusText}`);
  return res.json();
}

export async function fetchTravelTimes() {
  const res = await fetch('/api/travel-times');
  if (!res.ok) throw new Error(`Failed to fetch travel times: ${res.statusText}`);
  return res.json();
}

export async function fetchFloodAlerts() {
  const res = await fetch('/api/flood-alerts');
  if (!res.ok) throw new Error(`Failed to fetch flood alerts: ${res.statusText}`);
  return res.json();
}

export async function fetchRoadWorks() {
  const res = await fetch('/api/road-works');
  if (!res.ok) throw new Error(`Failed to fetch road works: ${res.statusText}`);
  return res.json();
}

export async function fetchTrafficSpeeds() {
  const res = await fetch('/api/traffic-speeds');
  if (!res.ok) throw new Error(`Failed to fetch traffic speeds: ${res.statusText}`);
  return res.json();
}

export async function fetchOneMapRoute(
  startLatLon: string = '1.3343,103.8563',
  endLatLon: string = '1.3644,103.9915'
): Promise<OneMapRouteResponse> {
  const res = await fetch(
    `/api/onemap-route?start=${encodeURIComponent(startLatLon)}&end=${encodeURIComponent(
      endLatLon
    )}&routeType=drive`
  );
  if (!res.ok) throw new Error(`Failed to fetch OneMap route: ${res.statusText}`);
  return res.json();
}

export async function fetchNeaWeather2Hr(area: string = 'Kallang') {
  const res = await fetch(`/api/weather-2hr?area=${encodeURIComponent(area)}`);
  if (!res.ok) throw new Error(`Failed to fetch weather: ${res.statusText}`);
  return res.json();
}
