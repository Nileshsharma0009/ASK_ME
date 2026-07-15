// =======================
// MAJOR GLOBAL PORTS
// =======================

export const PORTS = [
  // ---------------- India (5) ----------------
  { name: "Deendayal (Kandla)", lon: 70.22, lat: 22.99 },
  { name: "Mumbai", lon: 72.88, lat: 18.95 },
  { name: "Kochi", lon: 76.26, lat: 9.97 },
  { name: "Chennai", lon: 80.30, lat: 13.08 },
  { name: "Visakhapatnam", lon: 83.30, lat: 17.69 },

  // ---------------- Middle East ----------------
  { name: "Jebel Ali", lon: 55.02, lat: 25.01 },
  { name: "Strait of Hormuz", lon: 56.25, lat: 26.55 },

  // ---------------- Sri Lanka ----------------
  { name: "Colombo", lon: 79.84, lat: 6.93 },

  // ---------------- Singapore ----------------
  { name: "Singapore PSA", lon: 103.82, lat: 1.29 },
  { name: "Tuas Mega Port", lon: 103.63, lat: 1.24 },

  // ---------------- Malaysia ----------------
  { name: "Port Klang", lon: 101.38, lat: 3.00 },
  { name: "Tanjung Pelepas", lon: 103.55, lat: 1.36 },

  // ---------------- Vietnam ----------------
  { name: "Hai Phong", lon: 106.68, lat: 20.86 },
  { name: "Ho Chi Minh", lon: 106.70, lat: 10.82 },

  // ---------------- China (5) ----------------
  { name: "Shanghai", lon: 121.49, lat: 31.23 },
  { name: "Ningbo-Zhoushan", lon: 121.55, lat: 29.87 },
  { name: "Shenzhen", lon: 114.11, lat: 22.54 },
  { name: "Guangzhou", lon: 113.26, lat: 23.13 },
  { name: "Qingdao", lon: 120.38, lat: 36.07 },

  // ---------------- Korea ----------------
  { name: "Busan", lon: 129.04, lat: 35.10 },

  // ---------------- Japan ----------------
  { name: "Tokyo", lon: 139.76, lat: 35.68 },
  { name: "Osaka", lon: 135.43, lat: 34.69 },

  // ---------------- Africa ----------------
  { name: "Durban", lon: 31.05, lat: -29.88 },
  { name: "Mombasa", lon: 39.67, lat: -4.04 },

  // ---------------- Egypt ----------------
  { name: "Suez Canal", lon: 32.55, lat: 30.10 }
];


// =======================
// SHIPPING LANES
// =======================

export const ROUTES = [

  // Gulf → India
  ["Strait of Hormuz","Mumbai"],
  ["Jebel Ali","Deendayal (Kandla)"],
  ["Jebel Ali","Kochi"],

  // India → Sri Lanka
  ["Kochi","Colombo"],

  // India → Singapore
  ["Chennai","Singapore PSA"],
  ["Visakhapatnam","Tuas Mega Port"],

  // Singapore → Malaysia
  ["Singapore PSA","Port Klang"],
  ["Tuas Mega Port","Tanjung Pelepas"],

  // Singapore → Vietnam
  ["Singapore PSA","Ho Chi Minh"],
  ["Tuas Mega Port","Hai Phong"],

  // Vietnam → China
  ["Ho Chi Minh","Shenzhen"],
  ["Hai Phong","Shanghai"],

  // China Internal Export Corridors
  ["Shanghai","Busan"],
  ["Qingdao","Tokyo"],
  ["Ningbo-Zhoushan","Osaka"],

  // Korea → Japan
  ["Busan","Tokyo"],
  ["Busan","Osaka"],

  // India → Africa
  ["Mumbai","Mombasa"],
  ["Kochi","Durban"],

  // Africa → Suez
  ["Durban","Suez Canal"],
  ["Mombasa","Suez Canal"],

  // Suez → Europe/Gulf
  ["Suez Canal","Jebel Ali"],

  // China → Africa
  ["Shanghai","Durban"],
  ["Shenzhen","Mombasa"]
];


// =======================
// ANIMATED SHIPS
// =======================

export const SHIP_ROUTES = [

  {
    name:"Oil Tanker",
    start:[56.25,26.55],
    end:[72.88,18.95],
    durationMs:22000
  },

  {
    name:"India → Singapore",
    start:[80.30,13.08],
    end:[103.82,1.29],
    durationMs:45000
  },

  {
    name:"Singapore → Vietnam",
    start:[103.82,1.29],
    end:[106.70,10.82],
    durationMs:17000
  },

  {
    name:"Vietnam → China",
    start:[106.70,10.82],
    end:[121.49,31.23],
    durationMs:35000
  },

  {
    name:"China → Korea",
    start:[121.49,31.23],
    end:[129.04,35.10],
    durationMs:29000
  },

  {
    name:"Korea → Japan",
    start:[129.04,35.10],
    end:[139.76,35.68],
    durationMs:29000
  },

  {
    name:"India → Africa",
    start:[72.88,18.95],
    end:[39.67,-4.04],
    durationMs:30000
  },

  {
    name:"China → Africa",
    start:[114.11,22.54],
    end:[31.05,-29.88],
    durationMs:90000
  },

  {
    name:"Africa → Suez",
    start:[31.05,-29.88],
    end:[32.55,30.10],
    durationMs:40000
  },

  {
    name:"Suez → Gulf",
    start:[32.55,30.10],
    end:[55.02,25.01],
    durationMs:27000
  }
];


// =======================
// FEATURE CARDS
// =======================

export const FEATURE_CARDS = [
  [
    "Global Trade Network",
    "Major ports across Asia, Middle East and Africa connected by real shipping corridors."
  ],
  [
    "Live Vessel Tracking",
    "Animated vessels continuously move on international trade lanes."
  ],
  [
    "Strategic Chokepoints",
    "Includes Strait of Hormuz and Suez Canal for realistic maritime logistics."
  ],
  [
    "Decision Intelligence",
    "Designed for route optimization, congestion monitoring and operational awareness."
  ]
];

const shipSvg = encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="120" height="54" viewBox="0 0 120 54">
    <defs>
      <linearGradient id="hull" x1="0" x2="1"><stop offset="0%" stop-color="#f8fafc"/><stop offset="100%" stop-color="#cbd5e1"/></linearGradient>
      <linearGradient id="deck" x1="0" x2="1"><stop offset="0%" stop-color="#60a5fa"/><stop offset="100%" stop-color="#2563eb"/></linearGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#38bdf8" flood-opacity="0.45"/></filter>
    </defs>
    <g filter="url(#shadow)">
      <path d="M12 34h58l12 6h21l-10 8H30L12 34z" fill="url(#hull)"/>
      <path d="M28 22h28v12H28z" fill="#dbeafe"/>
      <path d="M58 18h14v16H58z" fill="url(#deck)"/>
      <path d="M75 23h9v9h-9z" fill="#93c5fd"/>
      <path d="M40 12h4v10h-4z" fill="#e2e8f0"/>
      <path d="M44 13l10 4-10 4z" fill="#38bdf8"/>
      <path d="M16 40h86" stroke="#fb923c" stroke-width="3.5" stroke-linecap="round"/>
    </g>
  </svg>
`);

export const SHIP_ICON = `data:image/svg+xml;charset=UTF-8,${shipSvg}`;

// export const FEATURE_CARDS = [
//   ['Focused Depth', 'Cleaner lighting, softer atmosphere, and better contrast.'],
//   ['Sharper Routes', 'Clearer shipping lanes without unstable material effects.'],
//   ['Live Motion', 'Ships drift with smooth eased motion and visible paths.'],
//   ['Login Friendly', 'The background supports the form instead of fighting it.'],
// ];
