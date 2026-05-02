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
    pricePerDay: 15000,
    image: "https://images.unsplash.com/photo-1590362891991-f766f28d8212?w=800&q=80",
    status: "available",
    features: ["Bluetooth", "Backup Camera", "Keyless Entry"],
    fuelEfficiency: "22 km/L",
    estDailyRevenue: 45000,
  },
  {
    id: "v-002",
    brand: "Honda",
    model: "Civic",
    year: 2021,
    tier: "eco-gig",
    pricePerDay: 13000,
    image: "https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?w=800&q=80",
    status: "available",
    features: ["Apple CarPlay", "Lane Assist"],
    fuelEfficiency: "18 km/L",
    estDailyRevenue: 40000,
  },
  {
    id: "v-003",
    brand: "Mercedes-Benz",
    model: "G63 AMG",
    year: 2023,
    tier: "elite",
    pricePerDay: 250000,
    image: "https://images.unsplash.com/photo-1520031441872-265e4ff70366?w=800&q=80",
    status: "available",
    features: ["Burmester Audio", "Massage Seats", "Armored Glass"],
    hp: 577,
    zeroToSixty: 4.4,
  },
  {
    id: "v-004",
    brand: "Porsche",
    model: "911 Turbo S",
    year: 2024,
    tier: "elite",
    pricePerDay: 350000,
    image: "https://images.unsplash.com/photo-1503376712344-c01ffbd01e74?w=800&q=80",
    status: "available",
    features: ["Sport Chrono", "Carbon Ceramics"],
    hp: 640,
    zeroToSixty: 2.6,
  },
  {
    id: "v-005",
    brand: "Mercedes-Benz",
    model: "Actros 2645",
    year: 2020,
    tier: "heavy-haul",
    pricePerDay: 180000,
    image: "https://images.unsplash.com/photo-1591768575198-88dac53fbd0a?w=800&q=80",
    status: "available",
    features: ["Tailgate Lift", "Air Suspension"],
    payloadKg: 26000,
    clearanceHeight: 4.0,
  },
  {
    id: "v-006",
    brand: "Ford",
    model: "Transit 350 HD",
    year: 2022,
    tier: "heavy-haul",
    pricePerDay: 60000,
    image: "https://images.unsplash.com/photo-1583593683074-ce444db8f3f8?w=800&q=80",
    status: "available",
    features: ["High Roof", "Cargo Tie-downs"],
    payloadKg: 2000,
    clearanceHeight: 2.8,
  }
];
