// /api/traffic-overview.js
// Aggregates live data from LTA DataMall, Singapore Traffic Cameras, and NEA Weather

export default async function handler(req, res) {
  const accountKey = process.env.LTA_ACCOUNT_KEY;
  const hasLtaKey = Boolean(accountKey && accountKey !== 'MY_LTA_ACCOUNT_KEY');

  let liveIncidents = [];
  let liveTravelTimes = [];
  let liveFloodAlerts = [];
  let liveSpeedBands = [];
  let liveWeatherForecast = null;
  let liveCameras = [];
  let isLtaLive = false;

  // 1. Fetch from LTA DataMall if key is provided
  if (hasLtaKey) {
    try {
      const headers = { AccountKey: accountKey, accept: 'application/json' };
      const [incRes, travelRes, floodRes, speedRes] = await Promise.allSettled([
        fetch('https://datamall2.mytransport.sg/ltaodataservice/TrafficIncidents', { headers }),
        fetch('https://datamall2.mytransport.sg/ltaodataservice/EstTravelTimes', { headers }),
        fetch('https://datamall2.mytransport.sg/ltaodataservice/PubFloodAlerts', { headers }),
        fetch('https://datamall2.mytransport.sg/ltaodataservice/TrafficSpeedBands', { headers })
      ]);

      if (incRes.status === 'fulfilled' && incRes.value.ok) {
        const d = await incRes.value.json();
        liveIncidents = d.value || [];
        isLtaLive = true;
      }
      if (travelRes.status === 'fulfilled' && travelRes.value.ok) {
        const d = await travelRes.value.json();
        liveTravelTimes = d.value || [];
        isLtaLive = true;
      }
      if (floodRes.status === 'fulfilled' && floodRes.value.ok) {
        const d = await floodRes.value.json();
        liveFloodAlerts = d.value || [];
      }
      if (speedRes.status === 'fulfilled' && speedRes.value.ok) {
        const d = await speedRes.value.json();
        liveSpeedBands = d.value || [];
      }
    } catch (err) {
      console.warn('LTA DataMall fetch error:', err);
    }
  }

  // 2. Fetch Live LTA Traffic Cameras (Open DataGovSG feed)
  try {
    const camRes = await fetch('https://api.data.gov.sg/v1/transport/traffic-images');
    if (camRes.ok) {
      const camData = await camRes.json();
      if (camData.items && camData.items[0]?.cameras) {
        liveCameras = camData.items[0].cameras;
      }
    }
  } catch (err) {
    console.warn('Live camera fetch error:', err);
  }

  // 3. Fetch Live NEA 2-Hour Weather
  try {
    const neaRes = await fetch('https://neaweather.com/api/v1/forecast/2hr');
    if (neaRes.ok) {
      liveWeatherForecast = await neaRes.json();
    } else {
      // Fallback to official NEA DataGovSG endpoint
      const govRes = await fetch('https://api.data.gov.sg/v1/environment/2-hour-weather-forecast');
      if (govRes.ok) {
        const govData = await govRes.json();
        const forecasts = govData.items?.[0]?.forecasts || [];
        const match = forecasts.find((f) => f.area.includes('Kallang') || f.area.includes('Bedok') || f.area.includes('Ang Mo Kio')) || forecasts[0];
        if (match) {
          liveWeatherForecast = {
            area: match.area,
            forecast: match.forecast,
            valid_from: govData.items[0].valid_period?.start || new Date().toISOString(),
            valid_to: govData.items[0].valid_period?.end || new Date(Date.now() + 7200000).toISOString()
          };
        }
      }
    }
  } catch (err) {
    console.warn('Weather fetch error:', err);
  }

  // Build mapped expressway speeds and moods
  // Base default values
  let pieSpeed = 22;
  let cteSpeed = 42;
  let ecpSpeed = 84;
  let ayeSpeed = 78;
  let sleSpeed = 80;
  let kpeSpeed = 54;
  let bkeSpeed = 75;

  // If live travel times exist, calculate speeds
  if (liveTravelTimes.length > 0) {
    liveTravelTimes.forEach((item) => {
      const name = (item.Name || '').toUpperCase();
      const estTime = item.EstTime || 5;
      if (name.includes('PIE') && estTime > 10) pieSpeed = Math.max(16, Math.min(45, Math.round(250 / estTime)));
      if (name.includes('CTE') && estTime > 8) cteSpeed = Math.max(25, Math.min(55, Math.round(300 / estTime)));
      if (name.includes('ECP')) ecpSpeed = Math.max(70, Math.min(90, Math.round(450 / Math.max(estTime, 4))));
      if (name.includes('AYE')) ayeSpeed = Math.max(65, Math.min(85, Math.round(400 / Math.max(estTime, 4))));
      if (name.includes('KPE')) kpeSpeed = Math.max(45, Math.min(70, Math.round(350 / Math.max(estTime, 5))));
    });
  }

  // Find camera images matching key expressways
  const findCamImage = (idPrefix) => {
    const found = liveCameras.find((c) => String(c.camera_id).startsWith(idPrefix));
    return found ? found.image : null;
  };

  const pieCamImg = findCamImage('47') || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCjXIoMO04KuAOqIFp6R61PDsMpWdnsCiBeHF8JQoLH7hQefyv4XqIT80PSzsq5-EpHVCxaWJ8QQnvf_nGECBZGbcPuJbZTQGXNy8Lhj1YF_Dd192PIuPTfRWbUrIhiIZA6LkHCBqKjrBYS7FsedmmE2xkUUDt-kn4f1oWRBJGMlA91no-D4L_7sByjLYs3MB3jRmaLdAbx7vMnE5VdBRV--OzhOw2dCTGujjtke3ezclKpq9QARyIQjA';
  const cteCamImg = findCamImage('17') || 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=600&q=80';
  const ecpCamImg = findCamImage('37') || 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=600&q=80';
  const ayeCamImg = findCamImage('57') || 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=600&q=80';
  const kpeCamImg = findCamImage('27') || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80';

  // Determine mood based on speed
  const getMood = (spd) => {
    if (spd < 30) return { mood: 'sulking', label: 'Sulking heavily', emoji: '😤' };
    if (spd < 50) return { mood: 'grumpy', label: 'Nervous & Grumpy', emoji: '👀' };
    if (spd < 70) return { mood: 'meh', label: 'Nervous / Busy flow', emoji: '😐' };
    if (spd < 80) return { mood: 'cruising', label: 'Cruising smoothly', emoji: '🚗' };
    return { mood: 'grinning', label: 'Breezy & smiling', emoji: '😎' };
  };

  const pieMood = getMood(pieSpeed);
  const cteMood = getMood(cteSpeed);
  const ecpMood = getMood(ecpSpeed);
  const ayeMood = getMood(ayeSpeed);
  const kpeMood = getMood(kpeSpeed);
  const sleMood = getMood(sleSpeed);
  const bkeMood = getMood(bkeSpeed);

  const payload = {
    success: true,
    isLive: isLtaLive || Boolean(liveWeatherForecast || liveCameras.length > 0),
    ltaKeyConfigured: hasLtaKey,
    lastUpdated: new Date().toISOString(),
    grumpiestExpy: {
      code: 'PIE',
      name: 'Pan Island Expressway',
      currentSpeed: pieSpeed,
      delayMinutes: 24,
      mood: pieMood.mood,
      moodLabel: pieMood.label,
      quote: '“Stuck at Eunos since 7:40 AM. Don\'t look at me.”',
      peakDelayNote: 'Peak delay: +24 mins near Woodsville'
    },
    expressways: {
      pie: {
        code: 'PIE',
        name: 'Pan Island Expressway',
        currentSpeed: pieSpeed,
        mood: pieMood.mood,
        moodLabel: pieMood.label,
        emoji: pieMood.emoji,
        delayMinutes: 24,
        camImage: pieCamImg,
        quote: '“Stuck at Eunos since 7:40 AM. Two lanes crawled to a halt lah.”'
      },
      cte: {
        code: 'CTE',
        name: 'Central Expressway',
        currentSpeed: cteSpeed,
        mood: cteMood.mood,
        moodLabel: cteMood.label,
        emoji: cteMood.emoji,
        delayMinutes: 14,
        camImage: cteCamImg,
        quote: '“Tunnels are packed like sardines. Slow crawl past Moulmein!”'
      },
      kpe: {
        code: 'KPE',
        name: 'Kallang-Paya Lebar Expressway',
        currentSpeed: kpeSpeed,
        mood: kpeMood.mood,
        moodLabel: kpeMood.label,
        emoji: kpeMood.emoji,
        delayMinutes: 6,
        camImage: kpeCamImg,
        quote: '“A bit crowded inside the tunnel, keep headlights on and mind the cameras!”'
      },
      ecp: {
        code: 'ECP',
        name: 'East Coast Parkway',
        currentSpeed: ecpSpeed,
        mood: ecpMood.mood,
        moodLabel: ecpMood.label,
        emoji: ecpMood.emoji,
        delayMinutes: 0,
        camImage: ecpCamImg,
        quote: '“Smooth sailing all the way to boarding gate! Pure coastal vibes! 🏄‍♂️”'
      },
      aye: {
        code: 'AYE',
        name: 'Ayer Rajah Expressway',
        currentSpeed: ayeSpeed,
        mood: ayeMood.mood,
        moodLabel: ayeMood.label,
        emoji: ayeMood.emoji,
        delayMinutes: 2,
        camImage: ayeCamImg,
        quote: '“Clear skies over Jurong and Buona Vista. Coasting happy!”'
      },
      sle: {
        code: 'SLE',
        name: 'Seletar Expressway',
        currentSpeed: sleSpeed,
        mood: sleMood.mood,
        moodLabel: sleMood.label,
        emoji: sleMood.emoji,
        delayMinutes: 0,
        camImage: pieCamImg,
        quote: '“Mandai green corridor is feeling fresh and open. Zero stress!”'
      },
      bke: {
        code: 'BKE',
        name: 'Bukit Timah Expressway',
        currentSpeed: bkeSpeed,
        mood: bkeMood.mood,
        moodLabel: bkeMood.label,
        emoji: bkeMood.emoji,
        delayMinutes: 3,
        camImage: pieCamImg,
        quote: '“Woodlands Checkpoint approach is holding steady.”'
      }
    },
    incidents: liveIncidents.length > 0 ? liveIncidents : [
      {
        Type: 'Accident',
        Latitude: 1.334312,
        Longitude: 103.921453,
        Message: '(1/10)08:15 Accident on PIE (towards Changi) before Bedok North Exit. Avoid lane 1.'
      },
      {
        Type: 'Roadwork',
        Latitude: 1.3909235,
        Longitude: 103.76543,
        Message: '(12/2)14:42 Roadworks on KJE (towards BKE) before BKE Exit. Avoid lane 2.'
      },
      {
        Type: 'Roadwork',
        Latitude: 1.322808,
        Longitude: 103.74865,
        Message: '(12/2)14:40 Roadworks on AYE (towards MCE) after Jurong Town Hall Exit. Avoid lane 1.'
      }
    ],
    floodAlerts: liveFloodAlerts.length > 0 ? liveFloodAlerts : [
      {
        headline: 'Flash Flood Alert',
        description: 'Heavy downpour along PIE stretch. Reduced visibility & slick tarmac. Allow extra braking distance!',
        areaDesc: 'Woodsville Flyover / Kallang',
        severity: 'Moderate'
      }
    ],
    weather: liveWeatherForecast || {
      area: 'Kallang',
      forecast: 'Thundery Showers',
      valid_from: new Date().toISOString(),
      valid_to: new Date(Date.now() + 7200000).toISOString()
    }
  };

  return res.status(200).json(payload);
}
