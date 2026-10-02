// /api/traffic-incidents.js
// Proxies LTA DataMall Traffic Incidents endpoint

export default async function handler(req, res) {
  const accountKey = process.env.LTA_ACCOUNT_KEY;

  if (accountKey && accountKey !== 'MY_LTA_ACCOUNT_KEY') {
    try {
      const response = await fetch('https://datamall2.mytransport.sg/ltaodataservice/TrafficIncidents', {
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
      console.warn('Failed to fetch from live LTA TrafficIncidents API, falling back to cached sample:', err);
    }
  }

  // Realistic sample response matching user specification
  const fallback = {
    "odata.metadata": "http://datamall2.mytransport.sg/ltaodataservice/$metadata#IncidentSet",
    "value": [
      {
        "Type": "Accident",
        "Latitude": 1.334312,
        "Longitude": 103.921453,
        "Message": "(1/10)08:15 Accident on PIE (towards Changi) before Bedok North Exit. Avoid lane 1."
      },
      {
        "Type": "Roadwork",
        "Latitude": 1.390923508426507,
        "Longitude": 103.76543045742648,
        "Message": "(12/2)14:42 Roadworks on KJE (towards BKE) before BKE Exit. Avoid lane 2."
      },
      {
        "Type": "Roadwork",
        "Latitude": 1.3228083288625956,
        "Longitude": 103.7486545963207,
        "Message": "(12/2)14:40 Roadworks on AYE (towards MCE) after Jurong Town Hall Exit. Avoid lane 1."
      },
      {
        "Type": "Roadwork",
        "Latitude": 1.2655918425973762,
        "Longitude": 103.82208988201302,
        "Message": "(12/2)14:37 Roadworks on Telok Blangah Road (towards Tuas) after Sentosa Gateway. Avoid right lane."
      },
      {
        "Type": "Breakdown",
        "Latitude": 1.319502,
        "Longitude": 103.852980,
        "Message": "(1/10)08:22 Heavy vehicle breakdown on CTE (towards AYE) after Moulmein Flyover."
      }
    ]
  };

  return res.status(200).json(fallback);
}
