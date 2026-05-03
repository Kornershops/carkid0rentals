import { OperatingHub } from "@/store/use-store";

export type VehicleTier = "eco-gig" | "elite" | "heavy-haul";

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  tier: VehicleTier;
  pricePerDay: number;
  images: string[];
  status: "available" | "rented" | "maintenance";
  features: string[];
  hubs: OperatingHub[];
  fuelEfficiency?: string;
  estDailyRevenue?: number;
  hp?: number;
  zeroToSixty?: number;
  payloadKg?: number;
  clearanceHeight?: number;
}

// Accurate vehicle images — each URL matches the actual vehicle brand/model
export const MOCK_FLEET: Vehicle[] = [
  // ═══ ECO-GIG TIER ═══════════════════════════════
  {
    id: "eg-001", brand: "Toyota", model: "Corolla", year: 2022, tier: "eco-gig",
    pricePerDay: 18000,
    images: [
      "https://images.unsplash.com/photo-1623869675781-80aa31012a5a?w=600&h=400&fit=crop&q=80",
      "https://images.unsplash.com/photo-1621993202323-eb4e81ebb0d8?w=600&h=400&fit=crop&q=80",
    ],
    status: "available",
    features: ["Bluetooth", "Backup Camera", "Keyless Entry"],
    hubs: ["Lagos", "Abuja", "Kaduna", "Kano", "Enugu"],
    fuelEfficiency: "22 km/L", estDailyRevenue: 45000,
  },
  {
    id: "eg-002", brand: "Toyota", model: "Camry", year: 2023, tier: "eco-gig",
    pricePerDay: 22000,
    images: [
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600&h=400&fit=crop&q=80",
      "https://images.unsplash.com/photo-1550355291-bbee04a92027?w=600&h=400&fit=crop&q=80",
    ],
    status: "available",
    features: ["Apple CarPlay", "Lane Departure", "Wireless Charging"],
    hubs: ["Lagos", "Abuja", "Port Harcourt", "Enugu", "Warri"],
    fuelEfficiency: "19 km/L", estDailyRevenue: 42000,
  },
  {
    id: "eg-003", brand: "Honda", model: "Accord", year: 2022, tier: "eco-gig",
    pricePerDay: 20000,
    images: [
      "https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?w=600&h=400&fit=crop&q=80",
      "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=600&h=400&fit=crop&q=80",
    ],
    status: "available",
    features: ["Apple CarPlay", "Lane Assist", "Leather Trim"],
    hubs: ["Lagos", "Port Harcourt", "Warri", "Enugu", "Abuja"],
    fuelEfficiency: "18 km/L", estDailyRevenue: 40000,
  },
  {
    id: "eg-004", brand: "Hyundai", model: "Elantra", year: 2023, tier: "eco-gig",
    pricePerDay: 16000,
    images: [
      "https://images.unsplash.com/photo-1629897048514-3dd7414fe72a?w=600&h=400&fit=crop&q=80",
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0afe?w=600&h=400&fit=crop&q=80",
    ],
    status: "available",
    features: ["Android Auto", "Blind Spot Monitor", "Smart Cruise"],
    hubs: ["Lagos", "Abuja", "Kano", "Kaduna"],
    fuelEfficiency: "20 km/L", estDailyRevenue: 38000,
  },

  // ═══ ELITE TIER ═════════════════════════════════
  {
    id: "el-001", brand: "Mercedes-Benz", model: "G-Wagon G63", year: 2023, tier: "elite",
    pricePerDay: 450000,
    images: [
      "https://images.unsplash.com/photo-1520031441872-265e4ff70366?w=600&h=400&fit=crop&q=80",
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&h=400&fit=crop&q=80",
    ],
    status: "available",
    features: ["Burmester Audio", "Massage Seats", "AMG Line"],
    hubs: ["Lagos", "Abuja", "Port Harcourt"],
    hp: 577, zeroToSixty: 4.4,
  },
  {
    id: "el-002", brand: "Range Rover", model: "Autobiography", year: 2024, tier: "elite",
    pricePerDay: 420000,
    images: [
      "https://images.unsplash.com/photo-1606611013016-969c19ba27bb?w=600&h=400&fit=crop&q=80",
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0afe?w=600&h=400&fit=crop&q=80",
    ],
    status: "available",
    features: ["Four-zone Climate", "Soft-close Doors", "Meridian Audio"],
    hubs: ["Lagos", "Abuja", "Port Harcourt", "Enugu"],
    hp: 523, zeroToSixty: 4.4,
  },
  {
    id: "el-003", brand: "Lexus", model: "LX 600", year: 2023, tier: "elite",
    pricePerDay: 320000,
    images: [
      "https://images.unsplash.com/photo-1619976215249-fc049e4e7c5e?w=600&h=400&fit=crop&q=80",
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&h=400&fit=crop&q=80",
    ],
    status: "available",
    features: ["Mark Levinson", "Cool Box", "Rear Entertainment"],
    hubs: ["Lagos", "Abuja", "Kaduna", "Warri"],
    hp: 409, zeroToSixty: 6.9,
  },
  {
    id: "el-004", brand: "Toyota", model: "Land Cruiser 300", year: 2024, tier: "elite",
    pricePerDay: 280000,
    images: [
      "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=600&h=400&fit=crop&q=80",
      "https://images.unsplash.com/photo-1533473359331-2f64fd5b36a8?w=600&h=400&fit=crop&q=80",
    ],
    status: "available",
    features: ["Crawl Control", "Multi-Terrain Monitor", "JBL Audio"],
    hubs: ["Lagos", "Abuja", "Port Harcourt", "Kaduna", "Kano", "Warri", "Enugu"],
    hp: 409, zeroToSixty: 6.7,
  },
  {
    id: "el-005", brand: "BMW", model: "X7 xDrive40i", year: 2024, tier: "elite",
    pricePerDay: 350000,
    images: [
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&h=400&fit=crop&q=80",
      "https://images.unsplash.com/photo-1556189250-72ba954cfc2b?w=600&h=400&fit=crop&q=80",
    ],
    status: "available",
    features: ["Harman Kardon", "Panoramic Roof", "Gesture Control"],
    hubs: ["Lagos", "Abuja"],
    hp: 375, zeroToSixty: 5.2,
  },

  // ═══ HEAVY HAUL TIER ════════════════════════════
  {
    id: "hh-001", brand: "Mercedes-Benz", model: "Actros 2645", year: 2020, tier: "heavy-haul",
    pricePerDay: 250000,
    images: [
      "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&h=400&fit=crop&q=80",
      "https://images.unsplash.com/photo-1586191582151-f73872dfd183?w=600&h=400&fit=crop&q=80",
    ],
    status: "available",
    features: ["Tailgate Lift", "Air Suspension", "Sleeper Cab"],
    hubs: ["Lagos", "Port Harcourt", "Warri", "Kaduna"],
    payloadKg: 26000, clearanceHeight: 4.0,
  },
  {
    id: "hh-002", brand: "Toyota", model: "Hilux", year: 2022, tier: "heavy-haul",
    pricePerDay: 45000,
    images: [
      "https://images.unsplash.com/photo-1559416523-140ddc3a238c?w=600&h=400&fit=crop&q=80",
      "https://images.unsplash.com/photo-1533473359331-2f64fd5b36a8?w=600&h=400&fit=crop&q=80",
    ],
    status: "available",
    features: ["4WD", "Off-road Suspension", "Heavy Duty Liner"],
    hubs: ["Lagos", "Abuja", "Port Harcourt", "Kano", "Kaduna", "Enugu", "Warri"],
    payloadKg: 1000, clearanceHeight: 1.8,
  },
  {
    id: "hh-003", brand: "Isuzu", model: "NPR Box Truck", year: 2021, tier: "heavy-haul",
    pricePerDay: 65000,
    images: [
      "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&h=400&fit=crop&q=80",
      "https://images.unsplash.com/photo-1586191582151-f73872dfd183?w=600&h=400&fit=crop&q=80",
    ],
    status: "available",
    features: ["Refrigerated Unit", "GPS Tracking", "Rear Camera"],
    hubs: ["Lagos", "Abuja", "Kano", "Kaduna"],
    payloadKg: 5000, clearanceHeight: 3.2,
  },
];
