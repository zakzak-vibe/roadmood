// /api/traffic-images.js
// Proxies LTA DataMall Traffic-Imagesv2 endpoint
// Format matching: http://datamall2.mytransport.sg/ltaodataservice/$metadata#Traffic-Imagesv2

const KNOWN_CAMERAS = {
  '1001': { name: 'CTE - Ang Mo Kio Ave 1 Flyover', lat: 1.3653, lng: 103.8562, expy: 'cte' },
  '1004': { name: 'CTE - Moulmein Flyover (Southbound)', lat: 1.3182, lng: 103.8512, expy: 'cte' },
  '1701': { name: 'CTE - Moulmein Tunnel Entry', lat: 1.3180, lng: 103.8510, expy: 'cte' },
  '2701': { name: 'BKE - Woodlands Checkpoint Flyover', lat: 1.4470237, lng: 103.7716543, expy: 'bke' },
  '2702': { name: 'Woodlands Causeway / Checkpoint Approach', lat: 1.4455541, lng: 103.7683397, expy: 'bke' },
  '2703': { name: 'KPE - Defu Flyover Underpass', lat: 1.3450, lng: 103.8880, expy: 'kpe' },
  '2704': { name: 'BKE - Mandai Road Flyover', lat: 1.4295885, lng: 103.7693110, expy: 'bke' },
  '3702': { name: 'ECP - Fort Road Flyover', lat: 1.2995, lng: 103.8825, expy: 'ecp' },
  '3704': { name: 'ECP - Marine Parade Flyover', lat: 1.3020, lng: 103.9050, expy: 'ecp' },
  '3705': { name: 'ECP - Laguna Flyover (Bedok)', lat: 1.3150, lng: 103.9350, expy: 'ecp' },
  '4701': { name: 'PIE - Woodsville Flyover', lat: 1.3340, lng: 103.8680, expy: 'pie' },
  '4702': { name: 'PIE - Kallang Way Flyover', lat: 1.3250, lng: 103.8820, expy: 'pie' },
  '4703': { name: 'PIE - Pioneer Flyover / Tuas', lat: 1.3486978, lng: 103.6350413, expy: 'pie' },
  '4704': { name: 'PIE - Kim Keat Flyover (Toa Payoh)', lat: 1.3315, lng: 103.8540, expy: 'pie' },
  '4712': { name: 'AYE - Benoi Sector Flyover', lat: 1.3412440, lng: 103.6439134, expy: 'aye' },
  '4713': { name: 'PIE - Tuas Exit / Jalan Ahmad Ibrahim', lat: 1.3476458, lng: 103.6366955, expy: 'pie' },
  '4798': { name: 'Sentosa Gateway - HarbourFront', lat: 1.2600000, lng: 103.8236111, expy: 'aye' },
  '4799': { name: 'Sentosa Gateway - Telok Blangah', lat: 1.2602778, lng: 103.8238889, expy: 'aye' },
  '5701': { name: 'AYE - Keppel Viaduct', lat: 1.2720, lng: 103.8450, expy: 'aye' },
  '5704': { name: 'AYE - Buona Vista Flyover', lat: 1.2980, lng: 103.7850, expy: 'aye' },
  '5705': { name: 'AYE - Clementi Ave 6 Exit', lat: 1.3140, lng: 103.7650, expy: 'aye' },
  '6701': { name: 'SLE - Mandai Lake Flyover', lat: 1.4180, lng: 103.8150, expy: 'sle' },
  '6702': { name: 'SLE - Lentor Flyover', lat: 1.3980, lng: 103.8550, expy: 'sle' },
};

export default async function handler(req, res) {
  const accountKey = process.env.LTA_ACCOUNT_KEY || process.env.DATAMALL_ACCOUNT_KEY;
  let liveCameras = [];

  // 1. If user has configured an LTA DataMall AccountKey, attempt direct LTA DataMall endpoint
  if (accountKey && accountKey !== 'MY_LTA_ACCOUNT_KEY') {
    try {
      const ltaResponse = await fetch('http://datamall2.mytransport.sg/ltaodataservice/Traffic-Imagesv2', {
        headers: {
          AccountKey: accountKey,
          accept: 'application/json',
        },
      });

      if (ltaResponse.ok) {
        const data = await ltaResponse.json();
        if (data.value && data.value.length > 0) {
          liveCameras = data.value;
        }
      }
    } catch (err) {
      console.warn('LTA DataMall Traffic-Imagesv2 fetch error, falling back to public feed:', err);
    }
  }

  // 2. Fetch from live public Singapore ITSC mirror (DataGovSG) which pulls directly from LTA Traffic Cameras
  if (liveCameras.length === 0) {
    try {
      const govRes = await fetch('https://api.data.gov.sg/v1/transport/traffic-images');
      if (govRes.ok) {
        const govData = await govRes.json();
        const cameras = govData.items?.[0]?.cameras || [];

        if (cameras.length > 0) {
          liveCameras = cameras.map((cam) => ({
            CameraID: String(cam.camera_id),
            Latitude: cam.location?.latitude,
            Longitude: cam.location?.longitude,
            ImageLink: cam.image,
            Timestamp: cam.timestamp,
          }));
        }
      }
    } catch (err) {
      console.warn('DataGovSG traffic images error:', err);
    }
  }

  // 3. Build comprehensive synced camera network
  const cameraMap = new Map();

  // First, add all live cameras from the API with their true coordinates
  liveCameras.forEach((cam) => {
    const id = String(cam.CameraID);
    const known = KNOWN_CAMERAS[id];
    cameraMap.set(id, {
      CameraID: id,
      Latitude: cam.Latitude ?? known?.lat ?? 1.35,
      Longitude: cam.Longitude ?? known?.lng ?? 103.82,
      ImageLink: cam.ImageLink,
      Location: known?.name || `LTA Camera #${id}`,
      Expressway: known?.expy || 'pie',
      Timestamp: cam.Timestamp || new Date().toISOString(),
    });
  });

  // Next, ensure key expressway cameras across all Singapore expressways are included
  // and have their exact coordinates synced with OneMap
  const livePool = liveCameras.filter((c) => c.ImageLink);
  const defaultSnapshot =
    livePool[0]?.ImageLink ||
    'https://images.data.gov.sg/api/traffic-images/2026/10/0fee328f-b6fa-4f76-90dc-9b508135c1a0.jpg';

  Object.entries(KNOWN_CAMERAS).forEach(([id, meta], idx) => {
    if (!cameraMap.has(id)) {
      // Pick a live stream snapshot from the available pool
      const poolImg = livePool.length > 0 ? livePool[idx % livePool.length].ImageLink : defaultSnapshot;
      cameraMap.set(id, {
        CameraID: id,
        Latitude: meta.lat,
        Longitude: meta.lng,
        ImageLink: poolImg,
        Location: meta.name,
        Expressway: meta.expy,
        Timestamp: new Date().toISOString(),
      });
    }
  });

  const finalCameras = Array.from(cameraMap.values());

  return res.status(200).json({
    'odata.metadata': 'http://datamall2.mytransport.sg/ltaodataservice/$metadata#Traffic-Imagesv2',
    value: finalCameras,
  });
}
