export interface ExpresswayData {
  id: string;
  code: string;
  name: string;
  fullName: string;
  currentSpeed: number;
  freeFlowSpeed: number;
  delayMinutes: number;
  mood: 'sulking' | 'grumpy' | 'meh' | 'cruising' | 'breezy' | 'grinning';
  moodLabel: string;
  characterQuote: string;
  peakDelayNote?: string;
  incidents: {
    id: string;
    type: 'accident' | 'roadwork' | 'ponding' | 'congestion';
    title: string;
    description: string;
    lane?: string;
    location: string;
  }[];
  cameras: {
    id: string;
    camNumber: string;
    location: string;
    imageUrl: string;
    updatedAgo: string;
    speedText: string;
  }[];
  mapMarker: {
    xPercent: number;
    yPercent: number;
    label: string;
    emoji: string;
  };
  colorTheme: {
    bg: string;
    border: string;
    text: string;
    chipBg: string;
  };
}

export interface SavedTrip {
  id: string;
  title: string;
  from: string;
  to: string;
  via: string;
  tag: string;
  estTime: string;
  mood: 'grinning' | 'meh' | 'sulking';
  moodLabel: string;
}

export const INITIAL_SAVED_TRIPS: SavedTrip[] = [
  {
    id: 'trip-1',
    title: 'Home → Work (Marina Bay)',
    from: 'Toa Payoh Central',
    to: 'Marina Bay Financial Centre',
    via: 'Via CTE • Usual 8:15 AM',
    tag: 'Commute',
    estTime: '28m',
    mood: 'meh',
    moodLabel: 'Meh',
  },
  {
    id: 'trip-2',
    title: 'Work → Tampines Gym',
    from: 'Marina Bay Financial Centre',
    to: 'Tampines Hub',
    via: 'Via ECP & PIE • Saved preset',
    tag: 'Fitness',
    estTime: '21m',
    mood: 'grinning',
    moodLabel: 'Grinning',
  },
  {
    id: 'trip-3',
    title: 'Home → Changi T3',
    from: 'Toa Payoh Central',
    to: 'Changi Airport Terminal 3',
    via: 'Via PIE & ECP • Weekend trip',
    tag: 'Flight',
    estTime: '38m',
    mood: 'sulking',
    moodLabel: 'Sulking',
  },
];

export function getCurrentSgTime(): string {
  try {
    return new Intl.DateTimeFormat('en-SG', {
      timeZone: 'Asia/Singapore',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(new Date());
  } catch {
    return '12:45 PM';
  }
}

export const EXPRESSWAYS: Record<string, ExpresswayData> = {
  pie: {
    id: 'pie',
    code: 'PIE',
    name: 'Pan Island Expressway',
    fullName: 'Pan Island Expressway (PIE)',
    currentSpeed: 28,
    freeFlowSpeed: 80,
    delayMinutes: 16,
    mood: 'sulking',
    moodLabel: 'Sulking heavily',
    characterQuote: `“Heavy crawl near Woodsville as of ${getCurrentSgTime()}. Slow traffic bottleneck.”`,
    peakDelayNote: `Delay: +16 mins near Woodsville (${getCurrentSgTime()})`,
    incidents: [
      {
        id: 'inc-pie-1',
        type: 'accident',
        title: 'Lane 1 breakdown near Bedok North Exit',
        description: 'Two lanes crawled to a halt lah. Vehicle towing in progress.',
        lane: 'Lane 1',
        location: 'PIE (towards Changi) before Bedok North Exit',
      },
      {
        id: 'inc-pie-2',
        type: 'ponding',
        title: 'Heavy Rain • High Ponding Risk',
        description: 'Flash ponding advisory by PUB near Woodsville Flyover & Eunos.',
        location: 'Woodsville Flyover',
      },
    ],
    cameras: [
      {
        id: 'cam-4702',
        camNumber: '4702',
        location: 'PIE - Woodsville Flyover',
        imageUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuCjXIoMO04KuAOqIFp6R61PDsMpWdnsCiBeHF8JQoLH7hQefyv4XqIT80PSzsq5-EpHVCxaWJ8QQnvf_nGECBZGbcPuJbZTQGXNy8Lhj1YF_Dd192PIuPTfRWbUrIhiIZA6LkHCBqKjrBYS7FsedmmE2xkUUDt-kn4f1oWRBJGMlA91no-D4L_7sByjLYs3MB3jRmaLdAbx7vMnE5VdBRV--OzhOw2dCTGujjtke3ezclKpq9QARyIQjA',
        updatedAgo: '45s ago',
        speedText: 'Crawling at 18 km/h',
      },
      {
        id: 'cam-4703',
        camNumber: '4703',
        location: 'PIE - Kallang Way',
        imageUrl:
          'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=600&q=80',
        updatedAgo: '1m ago',
        speedText: 'Heavy crawl 22 km/h',
      },
    ],
    mapMarker: {
      xPercent: 58,
      yPercent: 44,
      label: 'PIE: Sulking',
      emoji: '😤',
    },
    colorTheme: {
      bg: 'bg-tertiary',
      border: 'border-tertiary',
      text: 'text-tertiary',
      chipBg: 'bg-tertiary-fixed',
    },
  },
  cte: {
    id: 'cte',
    code: 'CTE',
    name: 'Central Expressway',
    fullName: 'Central Expressway (CTE)',
    currentSpeed: 42,
    freeFlowSpeed: 80,
    delayMinutes: 14,
    mood: 'grumpy',
    moodLabel: 'Nervous & Grumpy',
    characterQuote: '“Tunnels are packed like sardines. Slow crawl past Moulmein!”',
    peakDelayNote: '+14 mins from AMK Ave 1 to Braddell',
    incidents: [
      {
        id: 'inc-cte-1',
        type: 'congestion',
        title: 'ERP Gantry Surges',
        description: 'Heavy flow filtering into CTE Southbound tunnel entry.',
        location: 'CTE Southbound near Moulmein',
      },
    ],
    cameras: [
      {
        id: 'cam-1701',
        camNumber: '1701',
        location: 'CTE - Moulmein Tunnel Entry',
        imageUrl:
          'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=600&q=80',
        updatedAgo: '30s ago',
        speedText: 'Moderate 42 km/h',
      },
    ],
    mapMarker: {
      xPercent: 49,
      yPercent: 36,
      label: 'CTE: Grumpy',
      emoji: '👀',
    },
    colorTheme: {
      bg: 'bg-secondary-container',
      border: 'border-secondary',
      text: 'text-secondary',
      chipBg: 'bg-secondary-fixed',
    },
  },
  kpe: {
    id: 'kpe',
    code: 'KPE',
    name: 'Kallang-Paya Lebar Expressway',
    fullName: 'Kallang-Paya Lebar Expressway (KPE)',
    currentSpeed: 54,
    freeFlowSpeed: 70,
    delayMinutes: 6,
    mood: 'meh',
    moodLabel: 'Nervous / Busy flow',
    characterQuote: '“A bit crowded inside the tunnel, keep headlights on and mind the cameras!”',
    peakDelayNote: '+6 mins entering Airport Flyover link',
    incidents: [
      {
        id: 'inc-kpe-1',
        type: 'roadwork',
        title: 'Bartley Viaduct Slip Road works',
        description: 'Speed reduced to 50 km/h approaching KPE junction.',
        location: 'KPE / Bartley slip road',
      },
    ],
    cameras: [
      {
        id: 'cam-2704',
        camNumber: '2704',
        location: 'KPE - Defu Flyover Underpass',
        imageUrl:
          'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
        updatedAgo: '2m ago',
        speedText: 'Paced 54 km/h',
      },
    ],
    mapMarker: {
      xPercent: 64,
      yPercent: 52,
      label: 'KPE: Meh',
      emoji: '😐',
    },
    colorTheme: {
      bg: 'bg-secondary-fixed',
      border: 'border-secondary-fixed-dim',
      text: 'text-secondary',
      chipBg: 'bg-surface-container',
    },
  },
  ecp: {
    id: 'ecp',
    code: 'ECP',
    name: 'East Coast Parkway',
    fullName: 'East Coast Parkway (ECP)',
    currentSpeed: 84,
    freeFlowSpeed: 90,
    delayMinutes: 0,
    mood: 'grinning',
    moodLabel: 'Breezy & smiling',
    characterQuote: '“Smooth sailing all the way to boarding gate! Pure coastal vibes! 🏄‍♂️”',
    peakDelayNote: 'Zero delay all morning',
    incidents: [],
    cameras: [
      {
        id: 'cam-3705',
        camNumber: '3705',
        location: 'ECP - Marine Parade Vista',
        imageUrl:
          'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=600&q=80',
        updatedAgo: '50s ago',
        speedText: 'Flourishing 84 km/h',
      },
    ],
    mapMarker: {
      xPercent: 76,
      yPercent: 57,
      label: 'ECP: Grinning',
      emoji: '😎',
    },
    colorTheme: {
      bg: 'bg-primary-fixed',
      border: 'border-primary',
      text: 'text-primary',
      chipBg: 'bg-primary-fixed/40',
    },
  },
  aye: {
    id: 'aye',
    code: 'AYE',
    name: 'Ayer Rajah Expressway',
    fullName: 'Ayer Rajah Expressway (AYE)',
    currentSpeed: 78,
    freeFlowSpeed: 90,
    delayMinutes: 2,
    mood: 'cruising',
    moodLabel: 'Cruising smoothly',
    characterQuote: '“Clear skies over Jurong and Buona Vista. Coasting happy!”',
    peakDelayNote: '+2 mins near Keppel port exit',
    incidents: [],
    cameras: [
      {
        id: 'cam-5701',
        camNumber: '5701',
        location: 'AYE - Clementi Ave 6 Exit',
        imageUrl:
          'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=600&q=80',
        updatedAgo: '1m ago',
        speedText: 'Smooth 78 km/h',
      },
    ],
    mapMarker: {
      xPercent: 34,
      yPercent: 64,
      label: 'AYE: Cruising',
      emoji: '🚗',
    },
    colorTheme: {
      bg: 'bg-primary-container',
      border: 'border-primary',
      text: 'text-primary',
      chipBg: 'bg-primary-fixed',
    },
  },
  sle: {
    id: 'sle',
    code: 'SLE',
    name: 'Seletar Expressway',
    fullName: 'Seletar Expressway (SLE)',
    currentSpeed: 80,
    freeFlowSpeed: 90,
    delayMinutes: 0,
    mood: 'breezy',
    moodLabel: 'Breezy & calm',
    characterQuote: '“Mandai green corridor is feeling fresh and open. Zero stress!”',
    peakDelayNote: 'Flowing smoothly',
    incidents: [],
    cameras: [
      {
        id: 'cam-6701',
        camNumber: '6701',
        location: 'SLE - Mandai Lake Flyover',
        imageUrl:
          'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80',
        updatedAgo: '2m ago',
        speedText: 'Flowing 80 km/h',
      },
    ],
    mapMarker: {
      xPercent: 53,
      yPercent: 27,
      label: 'SLE: Breezy',
      emoji: '🌿',
    },
    colorTheme: {
      bg: 'bg-primary-container',
      border: 'border-primary',
      text: 'text-primary',
      chipBg: 'bg-primary-fixed',
    },
  },
  bke: {
    id: 'bke',
    code: 'BKE',
    name: 'Bukit Timah Expressway',
    fullName: 'Bukit Timah Expressway (BKE)',
    currentSpeed: 75,
    freeFlowSpeed: 90,
    delayMinutes: 3,
    mood: 'cruising',
    moodLabel: 'Cruising',
    characterQuote: '“Woodlands Checkpoint approach is holding steady.”',
    incidents: [],
    cameras: [],
    mapMarker: {
      xPercent: 42,
      yPercent: 29,
      label: 'BKE: Cruising',
      emoji: '🌲',
    },
    colorTheme: {
      bg: 'bg-primary-container',
      border: 'border-primary',
      text: 'text-primary',
      chipBg: 'bg-primary-fixed',
    },
  },
};

export interface RouteTripDetail {
  fromText: string;
  toText: string;
  estMinutes: number;
  delayMinutes: number;
  distanceKm: number;
  recommendationTitle: string;
  smartTip: string;
  weatherWarning: {
    title: string;
    updatedAgo: string;
    description: string;
  };
  expressways: {
    expresswayId: string;
    code: string;
    sectionName: string;
    distanceKm: number;
    speedKmH: number;
    moodLabel: string;
    mood: 'sulking' | 'grumpy' | 'meh' | 'cruising' | 'breezy' | 'grinning';
    characterQuote: string;
    incidents: {
      type: string;
      label: string;
    }[];
  }[];
}

export const CHANGI_TRIP_DATA: RouteTripDetail = {
  fromText: 'My location (Toa Payoh Central)',
  toText: 'Changi Airport Terminal 3',
  estMinutes: 38,
  delayMinutes: 12,
  distanceKm: 24.6,
  recommendationTitle: 'PIE is grumpy, ECP is grinning!',
  smartTip:
    'Wait 15 min, save 9 min! PIE congestion near Kallang Way clears quickly post 8:30 AM. ECP is clear all morning.',
  weatherWarning: {
    title: 'NEA WEATHER',
    updatedAgo: 'Updated 3m ago',
    description:
      'Heavy downpour along PIE stretch. Reduced visibility & slick tarmac. Allow extra braking distance!',
  },
  expressways: [
    {
      expresswayId: 'pie',
      code: 'PIE',
      sectionName: 'Toa Payoh → Eunos',
      distanceKm: 14.2,
      speedKmH: 22,
      moodLabel: 'Sulking heavily',
      mood: 'sulking',
      characterQuote: '“Don\'t talk to me near Eunos. Two lanes crawled to a halt lah.”',
      incidents: [
        { type: 'car_crash', label: 'Lane 1 breakdown near Bedok North Exit' },
        { type: 'rain', label: 'Heavy Rain • High Ponding Risk' },
      ],
    },
    {
      expresswayId: 'kpe',
      code: 'KPE',
      sectionName: 'Tunnel Interchange',
      distanceKm: 4.5,
      speedKmH: 54,
      moodLabel: 'Nervous / Busy flow',
      mood: 'meh',
      characterQuote: '“A bit crowded inside the tunnel, keep headlights on and mind the cameras!”',
      incidents: [],
    },
    {
      expresswayId: 'ecp',
      code: 'ECP',
      sectionName: 'Airport Approach',
      distanceKm: 5.9,
      speedKmH: 82,
      moodLabel: 'Breezy & smiling',
      mood: 'grinning',
      characterQuote: '“Smooth sailing all the way to boarding gate! Pure coastal vibes! 🏄‍♂️”',
      incidents: [],
    },
  ],
};

export const QUICK_DESTINATIONS = [
  { id: 'changi', label: '✈️ Changi Airport', value: 'Changi Airport Terminal 3' },
  { id: 'marina', label: '🏢 Marina Bay', value: 'Marina Bay Financial Centre' },
  { id: 'jurong', label: '🌳 Jurong East', value: 'Jurong East Central' },
  { id: 'orchard', label: '🛍️ Orchard Road', value: 'Orchard Road / ION' },
  { id: 'woodlands', label: '🌲 Woodlands', value: 'Woodlands Checkpoint' },
  { id: 'sentosa', label: '🏝️ Sentosa', value: 'Sentosa Gateway' },
];
