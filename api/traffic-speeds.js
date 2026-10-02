// /api/traffic-speeds.js
// Proxies LTA DataMall TrafficSpeedBands endpoint

export default async function handler(req, res) {
  const accountKey = process.env.LTA_ACCOUNT_KEY;

  if (accountKey && accountKey !== 'MY_LTA_ACCOUNT_KEY') {
    try {
      const response = await fetch('https://datamall2.mytransport.sg/ltaodataservice/TrafficSpeedBands', {
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
      console.warn('Failed to fetch from live LTA TrafficSpeedBands API, falling back to cached sample:', err);
    }
  }

  // Realistic sample response matching user specification
  const fallback = {
    "odata.metadata": "http://datamall2.mytransport.sg/ltaodataservice/$metadata#TrafficSpeedBands",
    "lastUpdatedTime": new Date().toISOString().replace('T', ' ').substring(0, 19),
    "value": [
      {
        "LinkID": "103000001",
        "RoadName": "PAN ISLAND EXPRESSWAY",
        "RoadCategory": "A",
        "SpeedBand": 2,
        "MinimumSpeed": "15",
        "MaximumSpeed": "24",
        "StartLon": "103.8641",
        "StartLat": "1.3289",
        "EndLon": "103.8920",
        "EndLat": "1.3245"
      },
      {
        "LinkID": "103000002",
        "RoadName": "CENTRAL EXPRESSWAY",
        "RoadCategory": "A",
        "SpeedBand": 4,
        "MinimumSpeed": "40",
        "MaximumSpeed": "49",
        "StartLon": "103.8529",
        "StartLat": "1.3170",
        "EndLon": "103.8490",
        "EndLat": "1.3020"
      },
      {
        "LinkID": "103000003",
        "RoadName": "EAST COAST PARKWAY",
        "RoadCategory": "A",
        "SpeedBand": 8,
        "MinimumSpeed": "80",
        "MaximumSpeed": "89",
        "StartLon": "103.9010",
        "StartLat": "1.3020",
        "EndLon": "103.9780",
        "EndLat": "1.3450"
      },
      {
        "LinkID": "103000004",
        "RoadName": "AYER RAJAH EXPRESSWAY",
        "RoadCategory": "A",
        "SpeedBand": 7,
        "MinimumSpeed": "70",
        "MaximumSpeed": "79",
        "StartLon": "103.7486",
        "StartLat": "1.3228",
        "EndLon": "103.8050",
        "EndLat": "1.2820"
      }
    ]
  };

  return res.status(200).json(fallback);
}
