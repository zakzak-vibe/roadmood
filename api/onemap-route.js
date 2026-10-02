// /api/onemap-route.js
// Proxies OneMap routing endpoint with ONEMAP_TOKEN

export default async function handler(req, res) {
  const token = process.env.ONEMAP_TOKEN;
  
  // Extract query params or body
  const query = req.query || {};
  const start = query.start || '1.3343,103.8563'; // Toa Payoh
  const end = query.end || '1.3644,103.9915'; // Changi Airport T3
  const routeType = query.routeType || 'drive';

  if (token && token !== 'MY_ONEMAP_TOKEN') {
    try {
      const url = `https://www.onemap.gov.sg/api/public/routingsvc/route?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}&routeType=${encodeURIComponent(routeType)}`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          token: token,
          accept: 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        return res.status(200).json(data);
      }
    } catch (err) {
      console.warn('Failed to fetch from OneMap API, falling back to mock routing sample:', err);
    }
  }

  // Realistic sample response matching user specification
  const fallback = {
    "status_message": "Found route between points",
    "route_geometry": "{u`GktxxR?G_`A_p@f{A|~@w`F_lA",
    "status": 0,
    "route_instructions": [
      [
        "Head",
        "Lorong 4 Toa Payoh",
        450,
        "1.334300,103.856300",
        60,
        "450m",
        "South",
        "South",
        "drive",
        "Head south on Lorong 4 Toa Payoh toward PIE"
      ],
      [
        "Left",
        "Pan Island Expressway (PIE)",
        14200,
        "1.328900,103.864100",
        1380,
        "14.2km",
        "East",
        "East",
        "drive",
        "Merge onto PIE toward Changi Airport. Crawl alert: 18-22 km/h near Woodsville & Eunos"
      ],
      [
        "Right",
        "Kallang-Paya Lebar Expressway (KPE)",
        4500,
        "1.331200,103.894500",
        300,
        "4.5km",
        "South",
        "South",
        "drive",
        "Take exit 2A toward KPE Tunnel. Flow steady at 54 km/h"
      ],
      [
        "Left",
        "East Coast Parkway (ECP)",
        5900,
        "1.302000,103.901000",
        250,
        "5.9km",
        "East",
        "East",
        "drive",
        "Merge onto ECP toward Airport Blvd. Breezy cruising at 82 km/h"
      ],
      [
        "Arrived",
        "Changi Airport Terminal 3",
        0,
        "1.364400,103.991500",
        0,
        "0m",
        "North",
        "East",
        "drive",
        "You Have Arrived At Your Destination, On The Left"
      ]
    ],
    "route_name": [
      "PIE -> KPE -> ECP"
    ],
    "route_summary": {
      "start_point": "Toa Payoh Central",
      "end_point": "Changi Airport Terminal 3",
      "total_time": 2280, // seconds (~38 mins)
      "total_distance": 24600 // meters (24.6 km)
    }
  };

  return res.status(200).json(fallback);
}
