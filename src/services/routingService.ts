// Comprehensive Singapore geocoding & routing engine

export interface LocationPoint {
  id: string;
  name: string;
  category: 'airport' | 'town' | 'cbd' | 'shopping' | 'transport' | 'nature' | 'checkpoint';
  lat: number;
  lng: number;
  svgX: number;
  svgY: number;
  keywords: string[];
}

export const SINGAPORE_LOCATIONS: LocationPoint[] = [
  {
    id: 'changi-t3',
    name: 'Changi Airport Terminal 3',
    category: 'airport',
    lat: 1.3644,
    lng: 103.9915,
    svgX: 890,
    svgY: 285,
    keywords: ['changi', 'airport', 't3', 'terminal', 'jewel', 'flight', 't1', 't2', 't4'],
  },
  {
    id: 'toa-payoh',
    name: 'Toa Payoh Central',
    category: 'town',
    lat: 1.3343,
    lng: 103.8563,
    svgX: 460,
    svgY: 285,
    keywords: ['toa payoh', 'lorong', 'braddell', 'home', 'central'],
  },
  {
    id: 'marina-bay',
    name: 'Marina Bay Financial Centre',
    category: 'cbd',
    lat: 1.2789,
    lng: 103.8536,
    svgX: 580,
    svgY: 420,
    keywords: ['marina bay', 'mbfc', 'cbd', 'raffles place', 'downtown', 'sands', 'shenton'],
  },
  {
    id: 'jurong-east',
    name: 'Jurong East Central',
    category: 'town',
    lat: 1.3331,
    lng: 103.7436,
    svgX: 330,
    svgY: 370,
    keywords: ['jurong', 'jurong east', 'jem', 'westgate', 'imm', 'boon lay', 'jcube'],
  },
  {
    id: 'orchard',
    name: 'Orchard Road / ION',
    category: 'shopping',
    lat: 1.3048,
    lng: 103.8318,
    svgX: 490,
    svgY: 360,
    keywords: ['orchard', 'ion', 'somerset', 'takashimaya', 'dhoby ghaut', 'shopping'],
  },
  {
    id: 'woodlands',
    name: 'Woodlands Checkpoint',
    category: 'checkpoint',
    lat: 1.447,
    lng: 103.7717,
    svgX: 430,
    svgY: 175,
    keywords: ['woodlands', 'checkpoint', 'causeway', 'johor', 'marsiling', 'admiralty'],
  },
  {
    id: 'sentosa',
    name: 'Sentosa Gateway',
    category: 'nature',
    lat: 1.254,
    lng: 103.8238,
    svgX: 470,
    svgY: 470,
    keywords: ['sentosa', 'resorts world', 'universal', 'cove', 'vivocity', 'harbourfront'],
  },
  {
    id: 'tampines',
    name: 'Our Tampines Hub',
    category: 'town',
    lat: 1.3533,
    lng: 103.9452,
    svgX: 760,
    svgY: 280,
    keywords: ['tampines', 'hub', 'simei', 'pasir ris', 'east'],
  },
  {
    id: 'bedok',
    name: 'Bedok Mall / Central',
    category: 'town',
    lat: 1.324,
    lng: 103.93,
    svgX: 710,
    svgY: 330,
    keywords: ['bedok', 'kaki bukit', 'eunos', 'reservoir'],
  },
  {
    id: 'ang-mo-kio',
    name: 'Ang Mo Kio Hub',
    category: 'town',
    lat: 1.3691,
    lng: 103.8454,
    svgX: 490,
    svgY: 240,
    keywords: ['ang mo kio', 'amk', 'yio chu kang', 'hub'],
  },
  {
    id: 'bishan',
    name: 'Bishan Junction 8',
    category: 'town',
    lat: 1.3508,
    lng: 103.8485,
    svgX: 480,
    svgY: 270,
    keywords: ['bishan', 'junction 8', 'j8', 'marymount'],
  },
  {
    id: 'punggol',
    name: 'Punggol Waterway Point',
    category: 'town',
    lat: 1.4053,
    lng: 103.9022,
    svgX: 680,
    svgY: 200,
    keywords: ['punggol', 'waterway', 'sengkang', 'compassvale'],
  },
  {
    id: 'sengkang',
    name: 'Sengkang Compass One',
    category: 'town',
    lat: 1.3916,
    lng: 103.8953,
    svgX: 660,
    svgY: 220,
    keywords: ['sengkang', 'compass one', 'buangkok'],
  },
  {
    id: 'clementi',
    name: 'Clementi Mall',
    category: 'town',
    lat: 1.3151,
    lng: 103.7651,
    svgX: 370,
    svgY: 390,
    keywords: ['clementi', 'west coast', 'nus'],
  },
  {
    id: 'bugis',
    name: 'Bugis Junction',
    category: 'shopping',
    lat: 1.3005,
    lng: 103.8558,
    svgX: 550,
    svgY: 380,
    keywords: ['bugis', 'rochor', 'kampong glam', 'city hall'],
  },
  {
    id: 'kallang',
    name: 'Singapore Sports Hub (Kallang)',
    category: 'nature',
    lat: 1.3033,
    lng: 103.8747,
    svgX: 610,
    svgY: 360,
    keywords: ['kallang', 'sports hub', 'stadium', 'national stadium', 'geylang'],
  },
  {
    id: 'tuas',
    name: 'Tuas Checkpoint (Second Link)',
    category: 'checkpoint',
    lat: 1.3486,
    lng: 103.635,
    svgX: 200,
    svgY: 410,
    keywords: ['tuas', 'second link', 'checkpoint', 'malaysia'],
  },
];

// Fuzzy geocode search
export function geocodeLocation(input: string): LocationPoint {
  if (!input || !input.trim()) {
    return SINGAPORE_LOCATIONS[0]; // Changi
  }

  const clean = input
    .replace('📍', '')
    .replace('My location (', '')
    .replace(')', '')
    .toLowerCase()
    .trim();

  // 1. Direct name or keyword match
  for (const loc of SINGAPORE_LOCATIONS) {
    if (loc.name.toLowerCase().includes(clean) || clean.includes(loc.name.toLowerCase())) {
      return loc;
    }
    for (const kw of loc.keywords) {
      if (clean.includes(kw)) {
        return loc;
      }
    }
  }

  // 2. Partial word match
  const words = clean.split(/\s+/).filter((w) => w.length > 2);
  for (const word of words) {
    for (const loc of SINGAPORE_LOCATIONS) {
      if (loc.keywords.some((kw) => kw.includes(word) || word.includes(kw))) {
        return loc;
      }
    }
  }

  // 3. Coordinate or generic fallback in Singapore
  return {
    id: `custom-${clean.replace(/\s+/g, '-')}`,
    name: input.replace('📍', '').trim(),
    category: 'town',
    lat: 1.3343,
    lng: 103.8563,
    svgX: 520,
    svgY: 310,
    keywords: [clean],
  };
}

export interface ComputedRoute {
  fromLoc: LocationPoint;
  toLoc: LocationPoint;
  totalDistanceKm: number;
  estMinutes: number;
  delayMinutes: number;
  recommendationTitle: string;
  smartTip: string;
  expresswaysOnRoute: {
    code: string;
    sectionName: string;
    distanceKm: number;
    speedKmH: number;
    moodLabel: string;
    mood: 'sulking' | 'grumpy' | 'meh' | 'cruising' | 'breezy' | 'grinning';
    quote: string;
    incidents: { type: string; label: string }[];
  }[];
  svgRoutePath: string; // SVG path data (d attribute)
}

// Calculate dynamic route between any two points in Singapore
export function computeMoodRoute(
  fromInput: string,
  toInput: string,
  liveExpressways?: Record<string, any>
): ComputedRoute {
  const fromLoc = geocodeLocation(fromInput || 'Toa Payoh Central');
  const toLoc = geocodeLocation(toInput || 'Changi Airport Terminal 3');

  // Straight line haversine approximation
  const dLat = (toLoc.lat - fromLoc.lat) * 111.2;
  const dLng = (toLoc.lng - fromLoc.lng) * 111.3 * Math.cos((fromLoc.lat * Math.PI) / 180);
  const directDist = Math.sqrt(dLat * dLat + dLng * dLng);
  // Realistic road distance (Singapore road network tortuosity ~1.35)
  const totalDistanceKm = parseFloat(Math.max(4.2, directDist * 1.35).toFixed(1));

  // Determine expressways based on travel direction
  const isEastbound = toLoc.lng > fromLoc.lng + 0.05;
  const isWestbound = toLoc.lng < fromLoc.lng - 0.05;
  const isSouthbound = toLoc.lat < fromLoc.lat - 0.04;
  const isNorthbound = toLoc.lat > fromLoc.lat + 0.04;

  const pie = liveExpressways?.pie || { currentSpeed: 22, mood: 'sulking', quote: 'Stuck at Eunos' };
  const cte = liveExpressways?.cte || { currentSpeed: 42, mood: 'grumpy', quote: 'Slow crawl past Moulmein' };
  const ecp = liveExpressways?.ecp || { currentSpeed: 84, mood: 'grinning', quote: 'Pure coastal vibes!' };
  const aye = liveExpressways?.aye || { currentSpeed: 78, mood: 'cruising', quote: 'Clear skies coasting happy' };
  const kpe = liveExpressways?.kpe || { currentSpeed: 54, mood: 'meh', quote: 'Tunnel flow steady' };
  const sle = liveExpressways?.sle || { currentSpeed: 80, mood: 'breezy', quote: 'Mandai green corridor clear' };

  let expyList = [];

  // Routing decision logic based on geographic vector
  if (toLoc.id.includes('changi') || toLoc.id.includes('tampines') || toLoc.id.includes('bedok')) {
    // East corridor
    expyList = [
      {
        code: 'PIE',
        sectionName: `${fromLoc.name} → Woodsville`,
        distanceKm: parseFloat((totalDistanceKm * 0.5).toFixed(1)),
        speedKmH: pie.currentSpeed,
        mood: pie.mood,
        moodLabel: pie.mood === 'sulking' ? 'Sulking heavily' : 'Flowing',
        quote: pie.quote,
        incidents: [{ type: 'accident', label: 'Heavy crawl near Woodsville' }],
      },
      {
        code: 'KPE',
        sectionName: 'Tunnel Link to Airport',
        distanceKm: parseFloat((totalDistanceKm * 0.22).toFixed(1)),
        speedKmH: kpe.currentSpeed,
        mood: kpe.mood,
        moodLabel: 'Steady Tunnel Flow',
        quote: kpe.quote,
        incidents: [],
      },
      {
        code: 'ECP',
        sectionName: `Coast Approach to ${toLoc.name}`,
        distanceKm: parseFloat((totalDistanceKm * 0.28).toFixed(1)),
        speedKmH: ecp.currentSpeed,
        mood: ecp.mood,
        moodLabel: 'Breezy & smiling',
        quote: ecp.quote,
        incidents: [],
      },
    ];
  } else if (toLoc.id.includes('marina') || toLoc.id.includes('sentosa') || (isSouthbound && !isWestbound)) {
    // South / CBD corridor (CTE / AYE / MCE)
    expyList = [
      {
        code: 'CTE',
        sectionName: `${fromLoc.name} → Moulmein Tunnel`,
        distanceKm: parseFloat((totalDistanceKm * 0.6).toFixed(1)),
        speedKmH: cte.currentSpeed,
        mood: cte.mood,
        moodLabel: cte.mood === 'grumpy' ? 'Nervous & Grumpy' : 'Flowing',
        quote: cte.quote,
        incidents: [{ type: 'congestion', label: 'Tunnel bottleneck slow crawl' }],
      },
      {
        code: 'AYE',
        sectionName: `Marina Coastal Link → ${toLoc.name}`,
        distanceKm: parseFloat((totalDistanceKm * 0.4).toFixed(1)),
        speedKmH: aye.currentSpeed,
        mood: aye.mood,
        moodLabel: 'Cruising smoothly',
        quote: aye.quote,
        incidents: [],
      },
    ];
  } else if (toLoc.id.includes('jurong') || toLoc.id.includes('tuas') || isWestbound) {
    // West corridor (AYE / PIE West)
    expyList = [
      {
        code: 'PIE',
        sectionName: `${fromLoc.name} → Jurong East Exit`,
        distanceKm: parseFloat((totalDistanceKm * 0.45).toFixed(1)),
        speedKmH: pie.currentSpeed,
        mood: pie.mood,
        moodLabel: 'Moderate flow',
        quote: 'Approaching western corridors, traffic steady.',
        incidents: [],
      },
      {
        code: 'AYE',
        sectionName: `AYE Highway → ${toLoc.name}`,
        distanceKm: parseFloat((totalDistanceKm * 0.55).toFixed(1)),
        speedKmH: aye.currentSpeed,
        mood: aye.mood,
        moodLabel: 'Cruising smoothly',
        quote: aye.quote,
        incidents: [{ type: 'roadwork', label: 'Lane 1 road maintenance' }],
      },
    ];
  } else if (toLoc.id.includes('woodlands') || isNorthbound) {
    // North corridor (SLE / BKE)
    expyList = [
      {
        code: 'SLE',
        sectionName: `${fromLoc.name} → Mandai Flyover`,
        distanceKm: parseFloat((totalDistanceKm * 0.55).toFixed(1)),
        speedKmH: sle.currentSpeed,
        mood: sle.mood,
        moodLabel: 'Breezy & calm',
        quote: sle.quote,
        incidents: [],
      },
      {
        code: 'BKE',
        sectionName: `Woodlands Approach → ${toLoc.name}`,
        distanceKm: parseFloat((totalDistanceKm * 0.45).toFixed(1)),
        speedKmH: 75,
        mood: 'cruising',
        moodLabel: 'Cruising',
        quote: 'Checkpoint approaches moving smoothly.',
        incidents: [],
      },
    ];
  } else {
    // Generic central / city corridor
    expyList = [
      {
        code: 'CTE',
        sectionName: `${fromLoc.name} → Central Corridor`,
        distanceKm: parseFloat((totalDistanceKm * 0.5).toFixed(1)),
        speedKmH: cte.currentSpeed,
        mood: cte.mood,
        moodLabel: cte.mood === 'grumpy' ? 'Grumpy bottleneck' : 'Paced',
        quote: cte.quote,
        incidents: [],
      },
      {
        code: 'PIE',
        sectionName: `Flyover Link → ${toLoc.name}`,
        distanceKm: parseFloat((totalDistanceKm * 0.5).toFixed(1)),
        speedKmH: pie.currentSpeed,
        mood: pie.mood,
        moodLabel: pie.mood === 'sulking' ? 'Sulking' : 'Steady',
        quote: pie.quote,
        incidents: [],
      },
    ];
  }

  // Calculate est time factoring in individual expressway speeds
  let totalHours = 0;
  for (const seg of expyList) {
    const spd = Math.max(18, seg.speedKmH);
    totalHours += seg.distanceKm / spd;
  }
  // Add 3-5 mins local connecting roads
  const estMinutes = Math.round(totalHours * 60) + 4;
  const normalMinutes = Math.round((totalDistanceKm / 75) * 60) + 3;
  const delayMinutes = Math.max(0, estMinutes - normalMinutes);

  // Dynamic recommendation headline
  const expy1 = expyList[0];
  const expy2 = expyList[expyList.length - 1];
  const recommendationTitle =
    expy1.code !== expy2.code
      ? `${expy1.code} is ${expy1.mood}, ${expy2.code} is ${expy2.mood}!`
      : `${expy1.code} is ${expy1.mood} along this stretch today!`;

  const smartTip =
    delayMinutes > 5
      ? `Wait 15 min, save ${Math.min(delayMinutes, 10)} min! ${expy1.code} peak crawl clears quickly post rush hour.`
      : `Green light all the way! Smooth sailing to ${toLoc.name} with minimal slowdowns.`;

  // Dynamic SVG path connecting fromLoc to toLoc
  // We compute a smooth Bezier curve between fromLoc.svgX, svgY and toLoc.svgX, svgY
  const startX = fromLoc.svgX;
  const startY = fromLoc.svgY;
  const endX = toLoc.svgX;
  const endY = toLoc.svgY;

  // Mid-point curve control
  const midX = (startX + endX) / 2;
  const midY = (startY + endY) / 2 - 25; // Slight arched road curvature
  const svgRoutePath = `M ${startX} ${startY} Q ${midX} ${midY} ${endX} ${endY}`;

  return {
    fromLoc,
    toLoc,
    totalDistanceKm,
    estMinutes,
    delayMinutes,
    recommendationTitle,
    smartTip,
    expresswaysOnRoute: expyList,
    svgRoutePath,
  };
}
