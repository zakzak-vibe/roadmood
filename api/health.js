// /api/health.js
// Health check monitoring endpoint for Road Moods APIs (LTA DataMall, OneMap, NEA Weather)

export default async function handler(req, res) {
  const startTime = Date.now();
  const ltaKeyConfigured = Boolean(process.env.LTA_ACCOUNT_KEY && process.env.LTA_ACCOUNT_KEY !== 'MY_LTA_ACCOUNT_KEY');
  const onemapTokenConfigured = Boolean(process.env.ONEMAP_TOKEN && process.env.ONEMAP_TOKEN !== 'MY_ONEMAP_TOKEN');

  const services = {
    lta_datamall: {
      name: 'LTA DataMall v2',
      endpoints: {
        traffic_incidents: 'https://datamall2.mytransport.sg/ltaodataservice/TrafficIncidents',
        est_travel_times: 'http://datamall2.mytransport.sg/ltaodataservice/EstTravelTimes',
        pub_flood_alerts: 'https://datamall2.mytransport.sg/ltaodataservice/PubFloodAlerts',
        road_works: 'http://datamall2.mytransport.sg/ltaodataservice/RoadWorks',
        traffic_speed_bands: 'http://datamall2.mytransport.sg/ltaodataservice/TrafficSpeedBands',
        traffic_images: 'http://datamall2.mytransport.sg/ltaodataservice/Traffic-Imagesv2'
      },
      key_configured: ltaKeyConfigured,
      status: ltaKeyConfigured ? 'ready' : 'mock_fallback (awaiting LTA_ACCOUNT_KEY)'
    },
    onemap_routing: {
      name: 'OneMap Routing Service',
      endpoint: 'https://www.onemap.gov.sg/api/public/routingsvc/route',
      token_configured: onemapTokenConfigured,
      status: onemapTokenConfigured ? 'ready' : 'mock_fallback (awaiting ONEMAP_TOKEN)'
    },
    nea_weather: {
      name: 'NEA Weather 2-Hour Forecast',
      endpoint: 'https://neaweather.com/api/v1/forecast/2hr',
      status: 'active'
    }
  };

  const status = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime ? Math.floor(process.uptime()) : 0,
    latency_ms: Date.now() - startTime,
    env: {
      node_env: process.env.NODE_ENV || 'development',
      LTA_ACCOUNT_KEY: ltaKeyConfigured ? 'Configured (secure)' : 'Missing - will use mock sample responses',
      ONEMAP_TOKEN: onemapTokenConfigured ? 'Configured (secure)' : 'Missing - will use mock sample responses'
    },
    services
  };

  if (res && typeof res.status === 'function') {
    return res.status(200).json(status);
  } else if (res && typeof res.setHeader === 'function') {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(status, null, 2));
    return;
  }

  return status;
}
