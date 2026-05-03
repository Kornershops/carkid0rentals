import { OperatingHub } from "@/store/use-store";

export type VehicleTier = "eco-gig" | "elite" | "heavy-haul";

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  tier: VehicleTier;
  pricePerDay: number;
  images: string[]; // Support for multiple images (Exterior, Interior, etc.)
  status: "available" | "rented" | "maintenance";
  features: string[];
  hubs: OperatingHub[];
  // Eco-Gig specific
  fuelEfficiency?: string;
  estDailyRevenue?: number;
  // Elite specific
  hp?: number;
  zeroToSixty?: number;
  // Heavy Haul specific
  payloadKg?: number;
  clearanceHeight?: number;
}

export const MOCK_FLEET: Vehicle[] = [
  {
    id: "v-001",
    brand: "Toyota",
    model: "Corolla Hybrid (L-Spec)",
    year: 2022,
    tier: "eco-gig",
    pricePerDay: 18000,
    images: [
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80",
      "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800&q=80"
    ],
    status: "available",
    features: ["Bluetooth", "Backup Camera", "Keyless Entry", "Eco Mode"],
    hubs: ["Lagos", "Abuja", "Kaduna", "Kano", "Enugu"],
    fuelEfficiency: "22 km/L",
    estDailyRevenue: 45000,
  },
  {
    id: "v-002",
    brand: "Honda",
    model: "Civic Touring",
    year: 2021,
    tier: "eco-gig",
    pricePerDay: 20000,
    images: [
      "https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?w=800&q=80",
      "https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=800&q=80"
    ],
    status: "available",
    features: ["Apple CarPlay", "Lane Assist", "Leather Trim"],
    hubs: ["Lagos", "Port Harcourt", "Warri", "Enugu", "Abuja"],
    fuelEfficiency: "18 km/L",
    estDailyRevenue: 40000,
  },
  {
    id: "v-003",
    brand: "Mercedes-Benz",
    model: "G63 AMG Magno",
    year: 2023,
    tier: "elite",
    pricePerDay: 450000,
    images: [
      "https://images.unsplash.com/photo-1520031441872-265e4ff70366?w=800&q=80",
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80"
    ],
    status: "available",
    features: ["Burmester Audio", "Massage Seats", "Armored Glass", "IWC Clock"],
    hubs: ["Lagos", "Abuja", "Port Harcourt"],
    hp: 577,
    zeroToSixty: 4.4,
  },
  {
    id: "v-004",
    brand: "Porsche",
    model: "911 Turbo S (Exclusive)",
    year: 2024,
    tier: "elite",
    pricePerDay: 380000,
    images: [
      "https://images.unsplash.com/photo-1503376712344-c01ffbd01e74?w=800&q=80",
      "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800&q=80"
    ],
    status: "available",
    features: ["Sport Chrono", "Carbon Ceramics", "Burmester Surround"],
    hubs: ["Lagos", "Port Harcourt", "Abuja"],
    hp: 640,
    zeroToSixty: 2.6,
  },
  {
    id: "v-005",
    brand: "Mercedes-Benz",
    model: "Actros 2645 Heavy",
    year: 2020,
    tier: "heavy-haul",
    pricePerDay: 250000,
    images: [
      "https://images.unsplash.com/photo-1591768575198-88dac53fbd0a?w=800&q=80",
      "https://images.unsplash.com/photo-1586191582151-f73872dfd183?w=800&q=80"
    ],
    status: "available",
    features: ["Tailgate Lift", "Air Suspension", "Sleeper Cab"],
    hubs: ["Lagos", "Port Harcourt", "Warri", "Kaduna"],
    payloadKg: 26000,
    clearanceHeight: 4.0,
  },
  {
    id: "v-012",
    brand: "Lexus",
    model: "LX600 VIP",
    year: 2023,
    tier: "elite",
    pricePerDay: 320000,
    images: [
      "https://images.unsplash.com/photo-1635336585117-90f670f5e714?w=800&q=80",
      "https://images.unsplash.com/photo-1603584173870-7f3396c39370?w=800&q=80"
    ],
    status: "available",
    features: ["Mark Levinson", "Cool Box", "Rear Theatre"],
    hubs: ["Lagos", "Abuja", "Kaduna", "Warri"],
    hp: 409,
    zeroToSixty: 6.9,
  },
  {
    id: "v-013",
    brand: "Toyota",
    model: "Hilux Adventure",
    year: 2022,
    tier: "heavy-haul",
    pricePerDay: 45000,
    images: [
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80",
      "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&q=80"
    ],
    status: "available",
    features: ["4WD", "Off-road Suspension", "Heavy Duty Liner"],
    hubs: ["Lagos", "Abuja", "Port Harcourt", "Kano", "Kaduna", "Enugu", "Warri"],
    payloadKg: 1000,
    clearanceHeight: 1.8,
  },
  {
    id: "v-014",
    brand: "Rolls-Royce",
    model: "Cullinan Black Badge",
    year: 2024,
    tier: "elite",
    pricePerDay: 850000,
    images: [
      "https://images.unsplash.com/photo-1631215424564-92790757d549?w=800&q=80",
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80"
    ],
    status: "available",
    features: ["Starlight Headliner", "Viewing Suite", "Champagne Cooler"],
    hubs: ["Lagos", "Abuja"],
    hp: 592,
    zeroToSixty: 4.5,
  },
  {
    id: "v-015",
    brand: "Tesla",
    model: "Model X Plaid",
    year: 2023,
    tier: "elite",
    pricePerDay: 300000,
    images: [
      "https://images.unsplash.com/photo-1617788138017-80ad42243c2d?w=800&q=80",
      "https://images.unsplash.com/photo-1536700503339-1e4b06520771?w=800&q=80"
    ],
    status: "available",
    features: ["FSD Enabled", "Ludicrous Mode", "Yoke Steering"],
    hubs: ["Lagos", "Abuja"],
    hp: 1020,
    zeroToSixty: 2.5,
  },
  {
    id: "v-016",
    brand: "Isuzu",
    model: "NPR Box Truck",
    year: 2021,
    tier: "heavy-haul",
    pricePerDay: 65000,
    images: [
      "https://images.unsplash.com/photo-1586191582151-f73872dfd183?w=800&q=80",
      "https://images.unsplash.com/photo-1542442828-287217bfb842?w=800&q=80"
    ],
    status: "available",
    features: ["Refrigerated Unit", "GPS Tracking"],
    hubs: ["Lagos", "Abuja", "Kano", "Kaduna"],
    payloadKg: 5000,
    clearanceHeight: 3.2,
  },
  {
    id: "v-017",
    brand: "Range Rover",
    model: "Autobiography LWB",
    year: 2024,
    tier: "elite",
    pricePerDay: 420000,
    images: [
      "https://images.unsplash.com/photo-1606611013016-969c19ba27bb?w=800&q=80",
      "https://images.unsplash.com/photo-1563720223185-11003d516905?w=800&q=80"
    ],
    status: "available",
    features: ["Four-zone Climate", "Soft-close Doors"],
    hubs: ["Lagos", "Abuja", "Port Harcourt", "Enugu"],
    hp: 523,
    zeroToSixty: 4.4,
  },
  {
    id: "v-018",
    brand: "Toyota",
    model: "Land Cruiser 300",
    year: 2024,
    tier: "elite",
    pricePerDay: 280000,
    images: [
      "https://images.unsplash.com/photo-1635336585117-90f670f5e714?w=800&q=80",
      "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&q=80"
    ],
    status: "available",
    features: ["Crawl Control", "Multi-Terrain Monitor"],
    hubs: ["Lagos", "Abuja", "Port Harcourt", "Kaduna", "Kano", "Warri", "Enugu"],
    hp: 409,
    zeroToSixty: 6.7,
  }
];
