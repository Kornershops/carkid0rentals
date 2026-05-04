export type VehicleTier = "eco-gig" | "elite" | "heavy-haul";

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  tier: VehicleTier;
  pricePerDay: number; // In USD
  images: string[];
  features: string[];
  hubs: string[];
  countries: string[];
  isEV?: boolean;
  status: "available" | "rented" | "maintenance";
  hp?: number;
  zeroToSixty?: string;
  fuelEfficiency?: string;
  payloadKg?: number;
}

export const MOCK_FLEET: Vehicle[] = [
  // --- ECO-GIG SEGMENT (Ride-Hailing & Daily) ---
  {
    id: "ng-eg-in-01",
    brand: "Innoson",
    model: "IVM EX02",
    year: 2023,
    tier: "eco-gig",
    pricePerDay: 40,
    images: ["/fleet/innoson/white-innoson-ivm-ex02.png", "/fleet/innoson/yellow-innoson-ivm-ex02.png"],
    features: ["Locally Manufactured", "Rugged Chassis", "Low Fuel Consumption"],
    hubs: ["Lagos", "Abuja", "Enugu", "Accra"],
    countries: ["Nigeria", "Ghana"],
    status: "available",
  },
  {
    id: "ng-eg-wb-01",
    brand: "Wuling",
    model: "Bingo EV",
    year: 2024,
    tier: "eco-gig",
    pricePerDay: 35,
    images: ["/fleet/wuling/blue-wuling-bingo-ev.png", "/fleet/wuling/green-wuling-bingo-ev.png"],
    features: ["Ultra Compact", "Smart Connect", "Zero Emissions"],
    hubs: ["Lagos", "Abuja", "Nairobi", "Cairo"],
    countries: ["Nigeria", "Kenya", "Egypt"],
    isEV: true,
    status: "available"
  },
  {
    id: "ng-eg-tc-01",
    brand: "Toyota",
    model: "Corolla (Classic)",
    year: 2010,
    tier: "eco-gig",
    pricePerDay: 30,
    images: ["/fleet/toyota/corolla/2010-corolla-white.png", "/fleet/toyota/corolla/grey-corolla.png"],
    features: ["Gold Standard Reliability", "Budget Friendly"],
    hubs: ["Lagos", "Abuja", "Port Harcourt", "Kano", "Kaduna", "Enugu", "Warri", "Accra"],
    countries: ["Nigeria", "Ghana"],
    status: "available"
  },
  {
    id: "sa-eg-01",
    brand: "VW",
    model: "Polo Vivo",
    year: 2023,
    tier: "eco-gig",
    pricePerDay: 45,
    images: ["/fleet/toyota/corolla/2010-corolla-white.png"], 
    features: ["SA Favorite", "Fuel Efficient", "Modern Infotainment"],
    hubs: ["Johannesburg"],
    countries: ["South Africa"],
    status: "available"
  },

  // --- ELITE SEGMENT (Exotic & Executive) ---
  {
    id: "ng-el-sg-01",
    brand: "Saglev",
    model: "S5 Sedan EV",
    year: 2024,
    tier: "elite",
    pricePerDay: 150,
    images: ["/fleet/saglev/images.jpg", "/fleet/saglev/2images.jpg"],
    features: ["100% Electric", "Fast Charging", "Silent Drive", "Executive Comfort"],
    hubs: ["Lagos", "Abuja", "Nairobi", "Johannesburg", "Cairo", "Accra"],
    countries: ["Nigeria", "Kenya", "South Africa", "Egypt", "Ghana"],
    isEV: true,
    status: "available"
  },
  {
    id: "ke-el-01",
    brand: "Toyota",
    model: "Land Cruiser V8",
    year: 2023,
    tier: "elite",
    pricePerDay: 280,
    images: ["/fleet/toyota/corolla/2014-red-corolla.png"], 
    features: ["4WD", "Safari Ready", "VIP Protection"],
    hubs: ["Nairobi", "Lagos", "Abuja", "Johannesburg"],
    countries: ["Kenya", "Nigeria", "South Africa"],
    status: "available"
  },
  {
    id: "sa-el-01",
    brand: "Porsche",
    model: "911 Carrera",
    year: 2023,
    tier: "elite",
    pricePerDay: 650,
    images: ["/fleet/toyota/corolla/2015-corolla-red.png"],
    features: ["Sport Mode", "High Performance", "Iconic Status"],
    hubs: ["Johannesburg", "Cairo"],
    countries: ["South Africa", "Egypt"],
    status: "available"
  },

  // --- HEAVY-HAUL SEGMENT (Logistics & Haulage) ---
  {
    id: "ng-hh-jm-01",
    brand: "Jet Motor",
    model: "Mover EV",
    year: 2023,
    tier: "heavy-haul",
    pricePerDay: 180,
    images: ["/fleet/jet-motor/sideview-white-jet-mover-ev-logistics-van.png", "/fleet/jet-motor/interior-white-jet-mover-ev-logistics-van.png"],
    features: ["Electric Cargo Van", "High Payload", "Fleet Telemetry"],
    hubs: ["Lagos", "Abuja", "Nairobi", "Johannesburg", "Cairo", "Accra"],
    countries: ["Nigeria", "Kenya", "South Africa", "Egypt", "Ghana"],
    isEV: true,
    status: "available",
    payloadKg: 1500
  },
  {
    id: "gh-hh-01",
    brand: "Sinotruk",
    model: "Howo Tipper",
    year: 2021,
    tier: "heavy-haul",
    pricePerDay: 220,
    images: ["/fleet/jet-motor/backview-white-jet-mover-ev-logistics-van.png"], 
    features: ["Mining Ready", "6x4 Drive", "Heavy Payload"],
    hubs: ["Accra", "Lagos", "Port Harcourt", "Johannesburg"],
    countries: ["Ghana", "Nigeria", "South Africa"],
    status: "available",
    payloadKg: 35000
  }
];
