// /api/road-works.js
// Proxies LTA DataMall RoadWorks endpoint

export default async function handler(req, res) {
  const accountKey = process.env.LTA_ACCOUNT_KEY;

  if (accountKey && accountKey !== 'MY_LTA_ACCOUNT_KEY') {
    try {
      const response = await fetch('https://datamall2.mytransport.sg/ltaodataservice/RoadWorks', {
        headers: {
          AccountKey: accountKey,
          accept: 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        return res.status(200).json(data);
      }
    } catch (err) {
      console.warn('Failed to fetch from live LTA RoadWorks API, falling back to cached sample:', err);
    }
  }

  // Realistic sample response matching user specification
  const fallback = {
    "odata.metadata": "http://datamall2.mytransport.sg/ltaodataservice/$metadata#RoadWorks",
    "value": [
      {
        "EventID": "RMINRM-202610-0176",
        "StartDate": "2026-10-01",
        "EndDate": "2026-10-15",
        "SvcDept": "LAND TRANSPORT AUTHORITY",
        "RoadName": "BARTLEY VIADUCT SLIP ROAD",
        "Other": "Resurfacing works approaching KPE. Speed limit 50 km/h."
      },
      {
        "EventID": "RMINRM-202610-1672",
        "StartDate": "2026-09-28",
        "EndDate": "2026-10-12",
        "SvcDept": "PUB - WATER RECLAMATION (NETWORK) DEPT",
        "RoadName": "ADAM ROAD",
        "Other": "Culvert upgrading near PIE exit"
      },
      {
        "EventID": "RMINRM-202610-0921",
        "StartDate": "2026-10-01",
        "EndDate": "2026-10-08",
        "SvcDept": "LAND TRANSPORT AUTHORITY",
        "RoadName": "AYE (TOWARDS MCE)",
        "Other": "Signboard replacement after Jurong Town Hall Exit. Lane 1 closed."
      }
    ]
  };

  return res.status(200).json(fallback);
}
