// /api/travel-times.js
// Proxies LTA DataMall EstTravelTimes endpoint

export default async function handler(req, res) {
  const accountKey = process.env.LTA_ACCOUNT_KEY;

  if (accountKey && accountKey !== 'MY_LTA_ACCOUNT_KEY') {
    try {
      const response = await fetch('https://datamall2.mytransport.sg/ltaodataservice/EstTravelTimes', {
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
      console.warn('Failed to fetch from live LTA EstTravelTimes API, falling back to cached sample:', err);
    }
  }

  // Realistic sample response matching user specification
  const fallback = {
    "odata.metadata": "http://datamall2.mytransport.sg/ltaodataservice/$metadata#EstTravelTimes",
    "value": [
      {
        "Name": "AYE",
        "Direction": 1,
        "FarEndPoint": "TUAS CHECKPOINT",
        "StartPoint": "AYE/MCE INTERCHANGE",
        "EndPoint": "TELOK BLANGAH RD",
        "EstTime": 2
      },
      {
        "Name": "AYE",
        "Direction": 1,
        "FarEndPoint": "TUAS CHECKPOINT",
        "StartPoint": "TELOK BLANGAH RD",
        "EndPoint": "LOWER DELTA RD",
        "EstTime": 1
      },
      {
        "Name": "PIE",
        "Direction": 1,
        "FarEndPoint": "CHANGI AIRPORT",
        "StartPoint": "TOA PAYOH",
        "EndPoint": "WOODSVILLE FLYOVER",
        "EstTime": 14
      },
      {
        "Name": "PIE",
        "Direction": 1,
        "FarEndPoint": "CHANGI AIRPORT",
        "StartPoint": "WOODSVILLE FLYOVER",
        "EndPoint": "EUNOS FLYOVER",
        "EstTime": 18
      },
      {
        "Name": "ECP",
        "Direction": 1,
        "FarEndPoint": "CHANGI AIRPORT",
        "StartPoint": "FORT RD",
        "EndPoint": "AIRPORT BLVD",
        "EstTime": 7
      },
      {
        "Name": "CTE",
        "Direction": 2,
        "FarEndPoint": "AYE",
        "StartPoint": "ANG MO KIO AVE 1",
        "EndPoint": "MOULMEIN RD",
        "EstTime": 12
      },
      {
        "Name": "KPE",
        "Direction": 1,
        "FarEndPoint": "TPE",
        "StartPoint": "ECP INTERCHANGE",
        "EndPoint": "DEFU FLYOVER",
        "EstTime": 6
      }
    ]
  };

  return res.status(200).json(fallback);
}
