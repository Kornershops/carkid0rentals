import { OperatingHub } from "@/store/use-store";

export type VehicleTier = "eco-gig" | "elite" | "heavy-haul";

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  tier: VehicleTier;
  pricePerDay: number;
  image: string;
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
    model: "Corolla Hybrid",
    year: 2022,
    tier: "eco-gig",
    pricePerDay: 18000,
    image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80",
    status: "available",
    features: ["Bluetooth", "Backup Camera", "Keyless Entry"],
    hubs: ["Lagos", "Abuja", "Kaduna", "Kano"],
    fuelEfficiency: "22 km/L",
    estDailyRevenue: 45000,
  },
  {
    id: "v-002",
    brand: "Honda",
    model: "Civic",
    year: 2021,
    tier: "eco-gig",
    pricePerDay: 20000,
    image: "https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?w=800&q=80",
    status: "available",
    features: ["Apple CarPlay", "Lane Assist"],
    hubs: ["Lagos", "Port Harcourt", "Warri", "Enugu"],
    fuelEfficiency: "18 km/L",
    estDailyRevenue: 40000,
  },
  {
    id: "v-007",
    brand: "Toyota",
    model: "Camry SE",
    year: 2023,
    tier: "eco-gig",
    pricePerDay: 22000,
    image: "https://images.unsplash.com/photo-1623914022830-4e3b74966627?w=800&q=80",
    status: "available",
    features: ["Leather Seats", "Blind Spot Monitor"],
    hubs: ["Abuja", "Kano", "Kaduna", "Enugu"],
    fuelEfficiency: "16 km/L",
    estDailyRevenue: 50000,
  },
  {
    id: "v-010",
    brand: "Hyundai",
    model: "Elantra",
    year: 2022,
    tier: "eco-gig",
    pricePerDay: 19000,
    image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800&q=80",
    status: "available",
    features: ["Fuel Saver Mode", "USB Ports"],
    hubs: ["Kaduna", "Warri", "Port Harcourt"],
    fuelEfficiency: "19 km/L",
    estDailyRevenue: 42000,
  },
  {
    id: "v-003",
    brand: "Mercedes-Benz",
    model: "G63 AMG",
    year: 2023,
    tier: "elite",
    pricePerDay: 450000,
    image: "https://images.unsplash.com/photo-1520031441872-265e4ff70366?w=800&q=80",
    status: "available",
    features: ["Burmester Audio", "Massage Seats", "Armored Glass"],
    hubs: ["Lagos", "Abuja"],
    hp: 577,
    zeroToSixty: 4.4,
  },
  {
    id: "v-004",
    brand: "Porsche",
    model: "911 Turbo S",
    year: 2024,
    tier: "elite",
    pricePerDay: 380000,
    image: "https://images.unsplash.com/photo-1503376712344-c01ffbd01e74?w=800&q=80",
    status: "available",
    features: ["Sport Chrono", "Carbon Ceramics"],
    hubs: ["Lagos", "Port Harcourt"],
    hp: 640,
    zeroToSixty: 2.6,
  },
  {
    id: "v-008",
    brand: "Land Rover",
    model: "Range Rover Vogue",
    year: 2024,
    tier: "elite",
    pricePerDay: 400000,
    image: "https://images.unsplash.com/photo-1606611013016-969c19ba27bb?w=800&q=80",
    status: "available",
    features: ["Executive Seating", "Pixel LED Headlights"],
    hubs: ["Abuja", "Port Harcourt", "Enugu"],
    hp: 523,
    zeroToSixty: 4.6,
  },
  {
    id: "v-011",
    brand: "Bentley",
    model: "Bentayga",
    year: 2023,
    tier: "elite",
    pricePerDay: 480000,
    image: "https://images.unsplash.com/photo-1631215424564-92790757d549?w=800&q=80",
    status: "available",
    features: ["Hand-stitched Leather", "Night Vision"],
    hubs: ["Lagos", "Abuja", "Warri"],
    hp: 542,
    zeroToSixty: 4.4,
  },
  {
    id: "v-005",
    brand: "Mercedes-Benz",
    model: "Actros 2645",
    year: 2020,
    tier: "heavy-haul",
    pricePerDay: 250000,
    image: "https://images.unsplash.com/photo-1591768575198-88dac53fbd0a?w=800&q=80",
    status: "available",
    features: ["Tailgate Lift", "Air Suspension"],
    hubs: ["Lagos", "Port Harcourt", "Warri"],
    payloadKg: 26000,
    clearanceHeight: 4.0,
  },
  {
    id: "v-009",
    brand: "Scania",
    model: "R500 V8",
    year: 2022,
    tier: "heavy-haul",
    pricePerDay: 220000,
    image: "https://images.unsplash.com/photo-1542442828-287217bfb842?w=800&q=80",
    status: "available",
    features: ["Highline Cab", "Retarder"],
    hubs: ["Kano", "Kaduna", "Abuja"],
    payloadKg: 32000,
    clearanceHeight: 4.2,
  },
  {
    id: "v-006",
    brand: "Ford",
    model: "Transit 350 HD",
    year: 2022,
    tier: "heavy-haul",
    pricePerDay: 80000,
    image: "https://images.unsplash.com/photo-1583593683074-ce444db8f3f8?w=800&q=80",
    status: "available",
    features: ["High Roof", "Cargo Tie-downs"],
    hubs: ["Lagos", "Enugu", "Warri", "Kaduna"],
    payloadKg: 2000,
    clearanceHeight: 2.8,
  }
];
