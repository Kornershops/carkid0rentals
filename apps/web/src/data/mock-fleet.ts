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
  // --- NIGERIA (Lagos, Abuja) - REAL ASSETS ---
  {
    id: "ng-eg-in-01",
    brand: "Innoson",
    model: "IVM EX02",
    year: 2023,
    tier: "eco-gig",
    pricePerDay: 40,
    images: [
      "/fleet/innoson/white Innoson IVM EX02.png",
      "/fleet/innoson/yellow Innoson IVM EX02.png",
      "/fleet/innoson/back view yellow Innoson IVM EX02.png"
    ],
    features: ["Locally Manufactured", "Rugged Chassis", "Low Fuel Consumption", "Perfect for Ride-Hailing"],
    hubs: ["Lagos", "Abuja", "Enugu"],
    countries: ["Nigeria"],
    status: "available",
    fuelEfficiency: "15km/L"
  },
  {
    id: "ng-eg-sg-01",
    brand: "Saglev",
    model: "S5 Sedan EV",
    year: 2024,
    tier: "eco-gig",
    pricePerDay: 45,
    images: ["/fleet/saglev/images.jpg", "/fleet/saglev/2images.jpg"],
    features: ["100% Electric", "Fast Charging", "Silent Drive", "Modern Interior"],
    hubs: ["Lagos"],
    countries: ["Nigeria"],
    isEV: true,
    status: "available",
    hp: 150
  },
  {
    id: "ng-eg-wb-01",
    brand: "Wuling",
    model: "Bingo EV",
    year: 2024,
    tier: "eco-gig",
    pricePerDay: 35,
    images: [
      "/fleet/wuling/Blue Wuling Bingo EV.png",
      "/fleet/wuling/Green Wuling Bingo EV.png",
      "/fleet/wuling/White Wuling Bingo EVfrontview.png",
      "/fleet/wuling/Interior Wuling Bingo EV.png"
    ],
    features: ["Ultra Compact", "Smart Connect", "Zero Emissions", "City Specialist"],
    hubs: ["Lagos", "Abuja"],
    countries: ["Nigeria"],
    isEV: true,
    status: "available"
  },
  {
    id: "ng-hh-jm-01",
    brand: "Jet Motor",
    model: "Mover EV",
    year: 2023,
    tier: "heavy-haul",
    pricePerDay: 180,
    images: [
      "/fleet/jet-motor/sideview White Jet Mover EV Logistics Van.png",
      "/fleet/jet-motor/Backview White Jet Mover EV Logistics Van.png",
      "/fleet/jet-motor/Interior White Jet Mover EV Logistics Van.png",
      "/fleet/jet-motor/sideview open door Jet Mover EV Logistics Van.png"
    ],
    features: ["Electric Cargo Van", "High Payload", "Fleet Telemetry", "Cross-Border Ready"],
    hubs: ["Lagos", "Abuja"],
    countries: ["Nigeria", "Ghana"],
    isEV: true,
    status: "available",
    payloadKg: 1500
  },
  {
    id: "ng-eg-tc-01",
    brand: "Toyota",
    model: "Corolla (Classic)",
    year: 2010,
    tier: "eco-gig",
    pricePerDay: 30,
    images: ["/fleet/toyota/corolla/2010 Corolla White.png", "/fleet/toyota/corolla/Grey Corolla.png"],
    features: ["Gold Standard Reliability", "Parts Everywhere", "Budget Friendly", "Lagos Favorite"],
    hubs: ["Lagos", "Abuja", "PH", "Kano"],
    countries: ["Nigeria"],
    status: "available"
  },
  {
    id: "ng-eg-tm-01",
    brand: "Toyota",
    model: "Corolla (Modern)",
    year: 2015,
    tier: "eco-gig",
    pricePerDay: 42,
    images: ["/fleet/toyota/corolla/2015 Corolla Red.png", "/fleet/toyota/corolla/2014 Red Corolla.png"],
    features: ["Modern Design", "Bluetooth", "Spacious Interior", "Premium Ride-Hailing"],
    hubs: ["Lagos", "Abuja"],
    countries: ["Nigeria"],
    status: "available"
  },

  // --- KENYA (Nairobi) ---
  {
    id: "ke-eg-001",
    brand: "Toyota",
    model: "Vitz",
    year: 2020,
    tier: "eco-gig",
    pricePerDay: 40,
    images: ["/fleet/vitz-1.jpg"],
    features: ["Ultra Fuel Efficient", "Easy Parking", "Hybrid Option"],
    hubs: ["Nairobi"],
    countries: ["Kenya"],
    status: "available"
  },
  {
    id: "ke-el-001",
    brand: "Toyota",
    model: "Land Cruiser V8",
    year: 2023,
    tier: "elite",
    pricePerDay: 280,
    images: ["/fleet/v8-1.jpg"],
    features: ["4WD", "Safari Ready", "VIP Protection", "Leather Seats"],
    hubs: ["Nairobi"],
    countries: ["Kenya"],
    status: "available"
  },

  // --- SOUTH AFRICA (Johannesburg) ---
  {
    id: "sa-eg-001",
    brand: "VW",
    model: "Polo Vivo",
    year: 2023,
    tier: "eco-gig",
    pricePerDay: 45,
    images: ["/fleet/polo-1.jpg"],
    features: ["Popular Choice", "Fuel Efficient", "Modern Infotainment"],
    hubs: ["Johannesburg"],
    countries: ["South Africa"],
    status: "available"
  },
  {
    id: "sa-el-001",
    brand: "Porsche",
    model: "911 Carrera",
    year: 2023,
    tier: "elite",
    pricePerDay: 650,
    images: ["/fleet/porsche-911.jpg"],
    features: ["Sport Mode", "Convertible", "High Performance"],
    hubs: ["Johannesburg"],
    countries: ["South Africa"],
    status: "available"
  },

  // --- GHANA (Accra) ---
  {
    id: "gh-eg-001",
    brand: "Kia",
    model: "Picanto",
    year: 2021,
    tier: "eco-gig",
    pricePerDay: 30,
    images: ["/fleet/picanto-1.jpg"],
    features: ["Economy King", "City Friendly", "Low Rent"],
    hubs: ["Accra"],
    countries: ["Ghana"],
    status: "available"
  },
  {
    id: "gh-hh-001",
    brand: "Sinotruk",
    model: "Howo Tipper",
    year: 2021,
    tier: "heavy-haul",
    pricePerDay: 220,
    images: ["/fleet/howo-1.jpg"],
    features: ["Mining Ready", "6x4 Drive", "Heavy Payload"],
    hubs: ["Accra"],
    countries: ["Ghana"],
    status: "available"
  },
];
