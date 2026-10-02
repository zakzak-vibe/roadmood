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

export interface LtaIncident {
  Type: string;
  Latitude: number;
  Longitude: number;
  Message: string;
}

export interface LtaTravelTime {
  Name: string;
  Direction: number;
  FarEndPoint: string;
  StartPoint: string;
  EndPoint: string;
  EstTime: number;
}

export interface LtaFloodAlert {
  alertId: string;
  dateTime: string;
  msgType: string;
  event: string;
  responseType: string;
  urgency: string;
  severity: string;
  headline: string;
  description: string;
  areaDesc: string;
  status: string;
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

export interface NeaWeather2Hr {
  area: string;
  forecast: string;
  valid_from: string;
  valid_to: string;
  condition_details?: {
    road_advisory: string;
    ponding_risk: string;
    humidity: string;
    temperature: string;
  };
}

export async function fetchApiHealth(): Promise<ApiHealthResponse> {
  const res = await fetch('/api/health');
  if (!res.ok) throw new Error(`Health check failed: ${res.statusText}`);
  return res.json();
}

export async function fetchTrafficIncidents(): Promise<{ value: LtaIncident[] }> {
  const res = await fetch('/api/traffic-incidents');
  if (!res.ok) throw new Error(`Failed to fetch incidents: ${res.statusText}`);
  return res.json();
}

export async function fetchTravelTimes(): Promise<{ value: LtaTravelTime[] }> {
  const res = await fetch('/api/travel-times');
  if (!res.ok) throw new Error(`Failed to fetch travel times: ${res.statusText}`);
  return res.json();
}

export async function fetchFloodAlerts(): Promise<{ value: LtaFloodAlert[] }> {
  const res = await fetch('/api/flood-alerts');
  if (!res.ok) throw new Error(`Failed to fetch flood alerts: ${res.statusText}`);
  return res.json();
}

export async function fetchRoadWorks(): Promise<{ value: any[] }> {
  const res = await fetch('/api/road-works');
  if (!res.ok) throw new Error(`Failed to fetch road works: ${res.statusText}`);
  return res.json();
}

export async function fetchTrafficSpeeds(): Promise<{ value: any[] }> {
  const res = await fetch('/api/traffic-speeds');
  if (!res.ok) throw new Error(`Failed to fetch traffic speeds: ${res.statusText}`);
  return res.json();
}

export async function fetchOneMapRoute(
  startLatLon: string,
  endLatLon: string
): Promise<OneMapRouteResponse> {
  const res = await fetch(
    `/api/onemap-route?start=${encodeURIComponent(startLatLon)}&end=${encodeURIComponent(
      endLatLon
    )}&routeType=drive`
  );
  if (!res.ok) throw new Error(`Failed to fetch OneMap route: ${res.statusText}`);
  return res.json();
}

export async function fetchNeaWeather2Hr(area: string = 'Kallang'): Promise<NeaWeather2Hr> {
  const res = await fetch(`/api/weather-2hr?area=${encodeURIComponent(area)}`);
  if (!res.ok) throw new Error(`Failed to fetch weather: ${res.statusText}`);
  return res.json();
}
