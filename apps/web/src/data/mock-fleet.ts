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

// Using verified, reliable Unsplash photo IDs
const img = (id: string) => `https://images.unsplash.com/photo-${id}?w=800&h=500&fit=crop&q=80`;

export const MOCK_FLEET: Vehicle[] = [
  {
    id: "v-001", brand: "Toyota", model: "Corolla Hybrid", year: 2022, tier: "eco-gig",
    pricePerDay: 18000,
    images: [img("1623869675781-80aa31012a5a"), img("1549317661-bd32c8ce0afe")],
    status: "available",
    features: ["Bluetooth", "Backup Camera", "Keyless Entry", "Eco Mode"],
    hubs: ["Lagos", "Abuja", "Kaduna", "Kano", "Enugu"],
    fuelEfficiency: "22 km/L", estDailyRevenue: 45000,
  },
  {
    id: "v-002", brand: "Honda", model: "Civic Touring", year: 2021, tier: "eco-gig",
    pricePerDay: 20000,
    images: [img("1619682817481-e994891cd1f5"), img("1583121274602-3e2820c69888")],
    status: "available",
    features: ["Apple CarPlay", "Lane Assist", "Leather Trim"],
    hubs: ["Lagos", "Port Harcourt", "Warri", "Enugu", "Abuja"],
    fuelEfficiency: "18 km/L", estDailyRevenue: 40000,
  },
  {
    id: "v-003", brand: "Mercedes-Benz", model: "G63 AMG", year: 2023, tier: "elite",
    pricePerDay: 450000,
    images: [img("1563720223185-11003d516935"), img("1618843479313-40f8afb4b4d8")],
    status: "available",
    features: ["Burmester Audio", "Massage Seats", "Armored Glass"],
    hubs: ["Lagos", "Abuja", "Port Harcourt"],
    hp: 577, zeroToSixty: 4.4,
  },
  {
    id: "v-004", brand: "Porsche", model: "Cayenne Turbo GT", year: 2024, tier: "elite",
    pricePerDay: 380000,
    images: [img("1544636331-e26879cd4d9b"), img("1580273916550-e323be2ae537")],
    status: "available",
    features: ["Sport Chrono", "Carbon Ceramics", "Bose Surround"],
    hubs: ["Lagos", "Port Harcourt", "Abuja"],
    hp: 640, zeroToSixty: 3.1,
  },
  {
    id: "v-005", brand: "Mercedes-Benz", model: "Actros 2645", year: 2020, tier: "heavy-haul",
    pricePerDay: 250000,
    images: [img("1601584115197-04ecc0da31d7"), img("1586191582151-f73872dfd183")],
    status: "available",
    features: ["Tailgate Lift", "Air Suspension", "Sleeper Cab"],
    hubs: ["Lagos", "Port Harcourt", "Warri", "Kaduna"],
    payloadKg: 26000, clearanceHeight: 4.0,
  },
  {
    id: "v-006", brand: "Lexus", model: "LX 600", year: 2023, tier: "elite",
    pricePerDay: 320000,
    images: [img("1619976215249-fc049e4e7c5e"), img("1549399542-7e3f8b79c341")],
    status: "available",
    features: ["Mark Levinson", "Cool Box", "Rear Entertainment"],
    hubs: ["Lagos", "Abuja", "Kaduna", "Warri"],
    hp: 409, zeroToSixty: 6.9,
  },
  {
    id: "v-007", brand: "Toyota", model: "Hilux Adventure", year: 2022, tier: "heavy-haul",
    pricePerDay: 45000,
    images: [img("1559416523-140ddc3a238c"), img("1533473359331-2f64fd5b36a8")],
    status: "available",
    features: ["4WD", "Off-road Suspension", "Heavy Duty Liner"],
    hubs: ["Lagos", "Abuja", "Port Harcourt", "Kano", "Kaduna", "Enugu", "Warri"],
    payloadKg: 1000, clearanceHeight: 1.8,
  },
  {
    id: "v-008", brand: "Range Rover", model: "Autobiography LWB", year: 2024, tier: "elite",
    pricePerDay: 420000,
    images: [img("1606611013016-969c19ba27bb"), img("1549317661-bd32c8ce0afe")],
    status: "available",
    features: ["Four-zone Climate", "Soft-close Doors", "Meridian Audio"],
    hubs: ["Lagos", "Abuja", "Port Harcourt", "Enugu"],
    hp: 523, zeroToSixty: 4.4,
  },
  {
    id: "v-009", brand: "Toyota", model: "Land Cruiser 300", year: 2024, tier: "elite",
    pricePerDay: 280000,
    images: [img("1519641471654-76ce0107ad1b"), img("1549399542-7e3f8b79c341")],
    status: "available",
    features: ["Crawl Control", "Multi-Terrain Monitor"],
    hubs: ["Lagos", "Abuja", "Port Harcourt", "Kaduna", "Kano", "Warri", "Enugu"],
    hp: 409, zeroToSixty: 6.7,
  },
  {
    id: "v-010", brand: "Isuzu", model: "NPR Box Truck", year: 2021, tier: "heavy-haul",
    pricePerDay: 65000,
    images: [img("1601584115197-04ecc0da31d7"), img("1586191582151-f73872dfd183")],
    status: "available",
    features: ["Refrigerated Unit", "GPS Tracking"],
    hubs: ["Lagos", "Abuja", "Kano", "Kaduna"],
    payloadKg: 5000, clearanceHeight: 3.2,
  },
  {
    id: "v-011", brand: "Toyota", model: "Camry SE", year: 2023, tier: "eco-gig",
    pricePerDay: 22000,
    images: [img("1550355291-bbee04a92027"), img("1583121274602-3e2820c69888")],
    status: "available",
    features: ["Wireless Charging", "Lane Departure", "Blind Spot"],
    hubs: ["Lagos", "Abuja", "Port Harcourt", "Enugu", "Warri"],
    fuelEfficiency: "19 km/L", estDailyRevenue: 42000,
  },
  {
    id: "v-012", brand: "BMW", model: "X5 xDrive40i", year: 2024, tier: "elite",
    pricePerDay: 350000,
    images: [img("1555215695-3004980ad54e"), img("1549317661-bd32c8ce0afe")],
    status: "available",
    features: ["Harman Kardon", "Panoramic Roof", "Gesture Control"],
    hubs: ["Lagos", "Abuja"],
    hp: 375, zeroToSixty: 5.2,
  },
];
