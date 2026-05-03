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

const img = (id: string) => `https://images.unsplash.com/photo-${id}?w=600&h=400&fit=crop&q=80`;

export const MOCK_FLEET: Vehicle[] = [
  // ═══════════════════════════════════════════════════
  //  ECO-GIG TIER — Economy & Gig-Ready Sedans
  // ═══════════════════════════════════════════════════
  {
    id: "eg-001", brand: "Toyota", model: "Corolla", year: 2022, tier: "eco-gig", pricePerDay: 18000,
    images: [img("1623869675781-80aa31012a5a"), img("1621993202323-eb4e81ebb0d8")],
    status: "available", features: ["Bluetooth", "Backup Camera", "Keyless Entry"],
    hubs: ["Lagos", "Abuja", "Kaduna", "Kano", "Enugu"],
    fuelEfficiency: "22 km/L", estDailyRevenue: 45000,
  },
  {
    id: "eg-002", brand: "Toyota", model: "Camry", year: 2023, tier: "eco-gig", pricePerDay: 22000,
    images: [img("1621007947382-bb3c3994e3fb"), img("1550355291-bbee04a92027")],
    status: "available", features: ["Apple CarPlay", "Lane Departure", "Wireless Charging"],
    hubs: ["Lagos", "Abuja", "Port Harcourt", "Enugu", "Warri"],
    fuelEfficiency: "19 km/L", estDailyRevenue: 42000,
  },
  {
    id: "eg-003", brand: "Honda", model: "Accord", year: 2022, tier: "eco-gig", pricePerDay: 20000,
    images: [img("1606152421802-db97b9c7a11b"), img("1583121274602-3e2820c69888")],
    status: "available", features: ["Apple CarPlay", "Lane Assist", "Leather Trim"],
    hubs: ["Lagos", "Port Harcourt", "Warri", "Enugu", "Abuja"],
    fuelEfficiency: "18 km/L", estDailyRevenue: 40000,
  },
  {
    id: "eg-004", brand: "Hyundai", model: "Elantra", year: 2023, tier: "eco-gig", pricePerDay: 16000,
    images: [img("1629897048514-3dd7414fe72a"), img("1549317661-bd32c8ce0afe")],
    status: "available", features: ["Android Auto", "Blind Spot Monitor", "Smart Cruise"],
    hubs: ["Lagos", "Abuja", "Kano", "Kaduna"],
    fuelEfficiency: "20 km/L", estDailyRevenue: 38000,
  },
  {
    id: "eg-005", brand: "Kia", model: "Rio", year: 2023, tier: "eco-gig", pricePerDay: 14000,
    images: [img("1549317661-bd32c8ce0afe"), img("1583121274602-3e2820c69888")],
    status: "available", features: ["USB Charging", "Rear Camera", "ABS Brakes"],
    hubs: ["Lagos", "Abuja", "Kano", "Port Harcourt", "Warri"],
    fuelEfficiency: "24 km/L", estDailyRevenue: 35000,
  },
  {
    id: "eg-006", brand: "Toyota", model: "Yaris", year: 2022, tier: "eco-gig", pricePerDay: 15000,
    images: [img("1623869675781-80aa31012a5a"), img("1550355291-bbee04a92027")],
    status: "available", features: ["Fuel Efficient", "Compact Size", "Auto Climate"],
    hubs: ["Lagos", "Abuja", "Kaduna", "Enugu"],
    fuelEfficiency: "25 km/L", estDailyRevenue: 36000,
  },
  {
    id: "eg-007", brand: "Nissan", model: "Sentra", year: 2023, tier: "eco-gig", pricePerDay: 17000,
    images: [img("1606152421802-db97b9c7a11b"), img("1549317661-bd32c8ce0afe")],
    status: "available", features: ["ProPilot Assist", "Zero Gravity Seats", "Bose Audio"],
    hubs: ["Lagos", "Abuja", "Port Harcourt", "Kano"],
    fuelEfficiency: "21 km/L", estDailyRevenue: 39000,
  },
  {
    id: "eg-008", brand: "Honda", model: "Civic", year: 2022, tier: "eco-gig", pricePerDay: 19000,
    images: [img("1583121274602-3e2820c69888"), img("1621993202323-eb4e81ebb0d8")],
    status: "available", features: ["Honda Sensing", "Adaptive Cruise", "Sunroof"],
    hubs: ["Lagos", "Abuja", "Port Harcourt", "Warri", "Enugu"],
    fuelEfficiency: "19 km/L", estDailyRevenue: 41000,
  },
  {
    id: "eg-009", brand: "Volkswagen", model: "Jetta", year: 2023, tier: "eco-gig", pricePerDay: 21000,
    images: [img("1550355291-bbee04a92027"), img("1606152421802-db97b9c7a11b")],
    status: "available", features: ["Turbocharged", "Digital Cockpit", "Park Assist"],
    hubs: ["Lagos", "Abuja", "Port Harcourt"],
    fuelEfficiency: "18 km/L", estDailyRevenue: 40000,
  },
  {
    id: "eg-010", brand: "Mazda", model: "Mazda 3", year: 2023, tier: "eco-gig", pricePerDay: 20000,
    images: [img("1621007947382-bb3c3994e3fb"), img("1583121274602-3e2820c69888")],
    status: "available", features: ["Skyactiv Engine", "Heads-Up Display", "Bose Audio"],
    hubs: ["Lagos", "Abuja", "Enugu", "Kaduna"],
    fuelEfficiency: "20 km/L", estDailyRevenue: 40000,
  },
  {
    id: "eg-011", brand: "Hyundai", model: "Sonata", year: 2024, tier: "eco-gig", pricePerDay: 23000,
    images: [img("1629897048514-3dd7414fe72a"), img("1550355291-bbee04a92027")],
    status: "available", features: ["Remote Smart Parking", "Wireless CarPlay", "Ventilated Seats"],
    hubs: ["Lagos", "Abuja", "Port Harcourt", "Warri"],
    fuelEfficiency: "17 km/L", estDailyRevenue: 43000,
  },
  {
    id: "eg-012", brand: "Toyota", model: "RAV4", year: 2023, tier: "eco-gig", pricePerDay: 25000,
    images: [img("1519641471654-76ce0107ad1b"), img("1621993202323-eb4e81ebb0d8")],
    status: "available", features: ["AWD", "Terrain Response", "Roof Rails"],
    hubs: ["Lagos", "Abuja", "Port Harcourt", "Kaduna", "Kano", "Enugu", "Warri"],
    fuelEfficiency: "16 km/L", estDailyRevenue: 46000,
  },

  // ═══════════════════════════════════════════════════
  //  ELITE TIER — Premium & Luxury SUVs/Sedans
  // ═══════════════════════════════════════════════════
  {
    id: "el-001", brand: "Mercedes-Benz", model: "G-Wagon G63", year: 2023, tier: "elite", pricePerDay: 450000,
    images: [img("1520031441872-265e4ff70366"), img("1618843479313-40f8afb4b4d8")],
    status: "available", features: ["Burmester Audio", "Massage Seats", "AMG Line"],
    hubs: ["Lagos", "Abuja", "Port Harcourt"],
    hp: 577, zeroToSixty: 4.4,
  },
  {
    id: "el-002", brand: "Range Rover", model: "Autobiography", year: 2024, tier: "elite", pricePerDay: 420000,
    images: [img("1606611013016-969c19ba27bb"), img("1549317661-bd32c8ce0afe")],
    status: "available", features: ["Four-zone Climate", "Soft-close Doors", "Meridian Audio"],
    hubs: ["Lagos", "Abuja", "Port Harcourt", "Enugu"],
    hp: 523, zeroToSixty: 4.4,
  },
  {
    id: "el-003", brand: "Lexus", model: "LX 600", year: 2023, tier: "elite", pricePerDay: 320000,
    images: [img("1619976215249-fc049e4e7c5e"), img("1549399542-7e3f8b79c341")],
    status: "available", features: ["Mark Levinson", "Cool Box", "Rear Entertainment"],
    hubs: ["Lagos", "Abuja", "Kaduna", "Warri"],
    hp: 409, zeroToSixty: 6.9,
  },
  {
    id: "el-004", brand: "Toyota", model: "Land Cruiser 300", year: 2024, tier: "elite", pricePerDay: 280000,
    images: [img("1519641471654-76ce0107ad1b"), img("1533473359331-2f64fd5b36a8")],
    status: "available", features: ["Crawl Control", "Multi-Terrain Monitor", "JBL Audio"],
    hubs: ["Lagos", "Abuja", "Port Harcourt", "Kaduna", "Kano", "Warri", "Enugu"],
    hp: 409, zeroToSixty: 6.7,
  },
  {
    id: "el-005", brand: "BMW", model: "X7 xDrive40i", year: 2024, tier: "elite", pricePerDay: 350000,
    images: [img("1555215695-3004980ad54e"), img("1556189250-72ba954cfc2b")],
    status: "available", features: ["Harman Kardon", "Panoramic Roof", "Gesture Control"],
    hubs: ["Lagos", "Abuja"],
    hp: 375, zeroToSixty: 5.2,
  },
  {
    id: "el-006", brand: "Mercedes-Benz", model: "S-Class S580", year: 2024, tier: "elite", pricePerDay: 500000,
    images: [img("1618843479313-40f8afb4b4d8"), img("1520031441872-265e4ff70366")],
    status: "available", features: ["MBUX Rear Tablet", "E-Active Body Control", "Burmester 4D"],
    hubs: ["Lagos", "Abuja"],
    hp: 496, zeroToSixty: 4.4,
  },
  {
    id: "el-007", brand: "Porsche", model: "Cayenne Turbo", year: 2024, tier: "elite", pricePerDay: 380000,
    images: [img("1544636331-e26879cd4d9b"), img("1555215695-3004980ad54e")],
    status: "available", features: ["Sport Chrono", "PASM Air Suspension", "Bose Surround"],
    hubs: ["Lagos", "Abuja", "Port Harcourt"],
    hp: 541, zeroToSixty: 3.7,
  },
  {
    id: "el-008", brand: "Cadillac", model: "Escalade ESV", year: 2024, tier: "elite", pricePerDay: 400000,
    images: [img("1606611013016-969c19ba27bb"), img("1519641471654-76ce0107ad1b")],
    status: "available", features: ["AKG 36-Speaker Audio", "Super Cruise", "Night Vision"],
    hubs: ["Lagos", "Abuja"],
    hp: 420, zeroToSixty: 6.1,
  },
  {
    id: "el-009", brand: "Mercedes-Benz", model: "GLE 450 Coupe", year: 2023, tier: "elite", pricePerDay: 300000,
    images: [img("1618843479313-40f8afb4b4d8"), img("1556189250-72ba954cfc2b")],
    status: "available", features: ["AMG Body Kit", "Air Body Control", "Burmester Audio"],
    hubs: ["Lagos", "Abuja", "Port Harcourt", "Kaduna"],
    hp: 362, zeroToSixty: 5.5,
  },
  {
    id: "el-010", brand: "Audi", model: "Q8 55 TFSI", year: 2024, tier: "elite", pricePerDay: 360000,
    images: [img("1555215695-3004980ad54e"), img("1544636331-e26879cd4d9b")],
    status: "available", features: ["Virtual Cockpit", "Matrix LED", "Air Suspension"],
    hubs: ["Lagos", "Abuja", "Port Harcourt"],
    hp: 335, zeroToSixty: 5.6,
  },
  {
    id: "el-011", brand: "Lincoln", model: "Navigator Reserve", year: 2024, tier: "elite", pricePerDay: 380000,
    images: [img("1606611013016-969c19ba27bb"), img("1549399542-7e3f8b79c341")],
    status: "available", features: ["Revel Audio", "Perfect Position Seats", "Lincoln Co-Pilot"],
    hubs: ["Lagos", "Abuja"],
    hp: 440, zeroToSixty: 5.5,
  },
  {
    id: "el-012", brand: "Infiniti", model: "QX80 Sensory", year: 2024, tier: "elite", pricePerDay: 290000,
    images: [img("1519641471654-76ce0107ad1b"), img("1606611013016-969c19ba27bb")],
    status: "available", features: ["Hydraulic Body Motion", "Bose 17-Speaker", "ProPilot"],
    hubs: ["Lagos", "Abuja", "Port Harcourt", "Warri"],
    hp: 400, zeroToSixty: 5.9,
  },
  {
    id: "el-013", brand: "Toyota", model: "Prado VX-L", year: 2024, tier: "elite", pricePerDay: 250000,
    images: [img("1533473359331-2f64fd5b36a8"), img("1519641471654-76ce0107ad1b")],
    status: "available", features: ["Kinetic Suspension", "Multi-Terrain Select", "JBL Premium"],
    hubs: ["Lagos", "Abuja", "Port Harcourt", "Kaduna", "Kano", "Enugu", "Warri"],
    hp: 295, zeroToSixty: 7.8,
  },

  // ═══════════════════════════════════════════════════
  //  HEAVY-HAUL TIER — Trucks, Pickups & Logistics
  // ═══════════════════════════════════════════════════
  {
    id: "hh-001", brand: "Mercedes-Benz", model: "Actros 2645", year: 2020, tier: "heavy-haul", pricePerDay: 250000,
    images: [img("1601584115197-04ecc0da31d7"), img("1586191582151-f73872dfd183")],
    status: "available", features: ["Tailgate Lift", "Air Suspension", "Sleeper Cab"],
    hubs: ["Lagos", "Port Harcourt", "Warri", "Kaduna"],
    payloadKg: 26000, clearanceHeight: 4.0,
  },
  {
    id: "hh-002", brand: "Toyota", model: "Hilux", year: 2022, tier: "heavy-haul", pricePerDay: 45000,
    images: [img("1559416523-140ddc3a238c"), img("1533473359331-2f64fd5b36a8")],
    status: "available", features: ["4WD", "Off-road Suspension", "Heavy Duty Liner"],
    hubs: ["Lagos", "Abuja", "Port Harcourt", "Kano", "Kaduna", "Enugu", "Warri"],
    payloadKg: 1000, clearanceHeight: 1.8,
  },
  {
    id: "hh-003", brand: "Isuzu", model: "NPR Box Truck", year: 2021, tier: "heavy-haul", pricePerDay: 65000,
    images: [img("1601584115197-04ecc0da31d7"), img("1586191582151-f73872dfd183")],
    status: "available", features: ["Refrigerated Unit", "GPS Tracking", "Rear Camera"],
    hubs: ["Lagos", "Abuja", "Kano", "Kaduna"],
    payloadKg: 5000, clearanceHeight: 3.2,
  },
  {
    id: "hh-004", brand: "MAN", model: "TGS 33.360", year: 2021, tier: "heavy-haul", pricePerDay: 280000,
    images: [img("1586191582151-f73872dfd183"), img("1601584115197-04ecc0da31d7")],
    status: "available", features: ["Heavy Duty Chassis", "Air Brakes", "Tachograph"],
    hubs: ["Lagos", "Port Harcourt", "Kano", "Kaduna"],
    payloadKg: 33000, clearanceHeight: 4.2,
  },
  {
    id: "hh-005", brand: "DAF", model: "CF 85.360", year: 2020, tier: "heavy-haul", pricePerDay: 260000,
    images: [img("1601584115197-04ecc0da31d7"), img("1586191582151-f73872dfd183")],
    status: "available", features: ["Sleeper Cab", "Retarder Brake", "Fuel Economy Mode"],
    hubs: ["Lagos", "Abuja", "Port Harcourt", "Warri"],
    payloadKg: 28000, clearanceHeight: 4.0,
  },
  {
    id: "hh-006", brand: "Ford", model: "F-150 XLT", year: 2023, tier: "heavy-haul", pricePerDay: 55000,
    images: [img("1559416523-140ddc3a238c"), img("1533473359331-2f64fd5b36a8")],
    status: "available", features: ["EcoBoost V6", "Pro Power Onboard", "Tow Package"],
    hubs: ["Lagos", "Abuja", "Port Harcourt"],
    payloadKg: 1400, clearanceHeight: 2.0,
  },
  {
    id: "hh-007", brand: "Mitsubishi", model: "Canter FE85", year: 2022, tier: "heavy-haul", pricePerDay: 50000,
    images: [img("1601584115197-04ecc0da31d7"), img("1586191582151-f73872dfd183")],
    status: "available", features: ["Duonic Transmission", "Low Entry Cab", "Side Guard"],
    hubs: ["Lagos", "Abuja", "Kano", "Enugu", "Warri"],
    payloadKg: 3500, clearanceHeight: 2.8,
  },
  {
    id: "hh-008", brand: "Toyota", model: "Dyna 150", year: 2021, tier: "heavy-haul", pricePerDay: 48000,
    images: [img("1586191582151-f73872dfd183"), img("1601584115197-04ecc0da31d7")],
    status: "available", features: ["Power Steering", "Dual Rear Wheels", "Drop-Side Body"],
    hubs: ["Lagos", "Abuja", "Port Harcourt", "Kaduna", "Enugu"],
    payloadKg: 4000, clearanceHeight: 2.5,
  },
  {
    id: "hh-009", brand: "Volvo", model: "FH 440", year: 2021, tier: "heavy-haul", pricePerDay: 300000,
    images: [img("1601584115197-04ecc0da31d7"), img("1586191582151-f73872dfd183")],
    status: "available", features: ["I-Shift Gearbox", "Adaptive Cruise", "EBS Braking"],
    hubs: ["Lagos", "Port Harcourt", "Kano"],
    payloadKg: 32000, clearanceHeight: 4.2,
  },
  {
    id: "hh-010", brand: "Iveco", model: "Daily 70C", year: 2022, tier: "heavy-haul", pricePerDay: 55000,
    images: [img("1586191582151-f73872dfd183"), img("1559416523-140ddc3a238c")],
    status: "available", features: ["Panel Van Body", "Rear Shutter Door", "AEBS"],
    hubs: ["Lagos", "Abuja", "Port Harcourt", "Enugu"],
    payloadKg: 3000, clearanceHeight: 2.6,
  },
  {
    id: "hh-011", brand: "Ford", model: "Ranger Wildtrak", year: 2023, tier: "heavy-haul", pricePerDay: 42000,
    images: [img("1559416523-140ddc3a238c"), img("1533473359331-2f64fd5b36a8")],
    status: "available", features: ["Bi-Turbo Diesel", "Electronic Diff Lock", "Sport Bar"],
    hubs: ["Lagos", "Abuja", "Port Harcourt", "Kaduna", "Warri", "Enugu"],
    payloadKg: 1050, clearanceHeight: 1.8,
  },

  // ═══ ADDITIONAL ECO-GIG ═════════════════════════════
  {
    id: "eg-013", brand: "Kia", model: "Cerato", year: 2023, tier: "eco-gig", pricePerDay: 17000,
    images: [img("1629897048514-3dd7414fe72a"), img("1621993202323-eb4e81ebb0d8")],
    status: "available", features: ["Android Auto", "6-Speed Auto", "Rear Sensors"],
    hubs: ["Lagos", "Abuja", "Kano", "Kaduna", "Enugu"],
    fuelEfficiency: "19 km/L", estDailyRevenue: 38000,
  },
  {
    id: "eg-014", brand: "Nissan", model: "Almera", year: 2022, tier: "eco-gig", pricePerDay: 15000,
    images: [img("1606152421802-db97b9c7a11b"), img("1550355291-bbee04a92027")],
    status: "available", features: ["Spacious Cabin", "ABS", "Dual Airbags"],
    hubs: ["Lagos", "Abuja", "Port Harcourt", "Warri", "Kano"],
    fuelEfficiency: "21 km/L", estDailyRevenue: 35000,
  },
  {
    id: "eg-015", brand: "Suzuki", model: "Swift", year: 2023, tier: "eco-gig", pricePerDay: 13000,
    images: [img("1583121274602-3e2820c69888"), img("1549317661-bd32c8ce0afe")],
    status: "available", features: ["Compact", "City Drive Mode", "USB Port"],
    hubs: ["Lagos", "Abuja", "Port Harcourt", "Enugu", "Warri"],
    fuelEfficiency: "26 km/L", estDailyRevenue: 33000,
  },
  {
    id: "eg-016", brand: "Toyota", model: "Avalon", year: 2022, tier: "eco-gig", pricePerDay: 28000,
    images: [img("1621007947382-bb3c3994e3fb"), img("1623869675781-80aa31012a5a")],
    status: "available", features: ["Premium Audio", "Leather Interior", "Sunroof"],
    hubs: ["Lagos", "Abuja", "Port Harcourt"],
    fuelEfficiency: "15 km/L", estDailyRevenue: 48000,
  },

  // ═══ ADDITIONAL ELITE ═══════════════════════════════
  {
    id: "el-014", brand: "Bentley", model: "Bentayga V8", year: 2024, tier: "elite", pricePerDay: 750000,
    images: [img("1544636331-e26879cd4d9b"), img("1606611013016-969c19ba27bb")],
    status: "available", features: ["Naim Audio", "Mulliner Spec", "Air Ionizer"],
    hubs: ["Lagos", "Abuja"],
    hp: 542, zeroToSixty: 4.4,
  },
  {
    id: "el-015", brand: "Mercedes-Benz", model: "Maybach GLS 600", year: 2024, tier: "elite", pricePerDay: 900000,
    images: [img("1618843479313-40f8afb4b4d8"), img("1520031441872-265e4ff70366")],
    status: "available", features: ["Executive Rear Seats", "Champagne Flutes", "Burmester 3D"],
    hubs: ["Lagos", "Abuja"],
    hp: 550, zeroToSixty: 4.8,
  },
  {
    id: "el-016", brand: "BMW", model: "X5 xDrive40i", year: 2023, tier: "elite", pricePerDay: 300000,
    images: [img("1555215695-3004980ad54e"), img("1549399542-7e3f8b79c341")],
    status: "available", features: ["xDrive AWD", "Live Cockpit Pro", "Parking Assist"],
    hubs: ["Lagos", "Abuja", "Port Harcourt", "Kaduna"],
    hp: 335, zeroToSixty: 5.3,
  },
  {
    id: "el-017", brand: "Mercedes-Benz", model: "E-Class E350", year: 2024, tier: "elite", pricePerDay: 280000,
    images: [img("1618843479313-40f8afb4b4d8"), img("1556189250-72ba954cfc2b")],
    status: "available", features: ["MBUX Superscreen", "Air Body Control", "Ambient Lighting"],
    hubs: ["Lagos", "Abuja", "Port Harcourt", "Enugu"],
    hp: 255, zeroToSixty: 5.9,
  },
  {
    id: "el-018", brand: "Genesis", model: "GV80", year: 2024, tier: "elite", pricePerDay: 260000,
    images: [img("1519641471654-76ce0107ad1b"), img("1555215695-3004980ad54e")],
    status: "available", features: ["Lexicon Audio", "Smart Posture Care", "Road Preview"],
    hubs: ["Lagos", "Abuja", "Port Harcourt"],
    hp: 300, zeroToSixty: 6.5,
  },

  // ═══ ADDITIONAL HEAVY-HAUL ══════════════════════════
  {
    id: "hh-012", brand: "Scania", model: "R450", year: 2021, tier: "heavy-haul", pricePerDay: 320000,
    images: [img("1601584115197-04ecc0da31d7"), img("1586191582151-f73872dfd183")],
    status: "available", features: ["Opticruise", "Retarder", "EAS Suspension"],
    hubs: ["Lagos", "Port Harcourt", "Kano", "Kaduna"],
    payloadKg: 35000, clearanceHeight: 4.5,
  },
  {
    id: "hh-013", brand: "Nissan", model: "NP300 Navara", year: 2022, tier: "heavy-haul", pricePerDay: 40000,
    images: [img("1559416523-140ddc3a238c"), img("1533473359331-2f64fd5b36a8")],
    status: "available", features: ["4x4", "Diff Lock", "Steel Bumper"],
    hubs: ["Lagos", "Abuja", "Port Harcourt", "Enugu", "Warri", "Kaduna", "Kano"],
    payloadKg: 950, clearanceHeight: 1.7,
  },
  {
    id: "hh-014", brand: "Hino", model: "500 Series", year: 2021, tier: "heavy-haul", pricePerDay: 85000,
    images: [img("1601584115197-04ecc0da31d7"), img("1586191582151-f73872dfd183")],
    status: "available", features: ["Pro Shift", "Exhaust Brake", "Wide Cab"],
    hubs: ["Lagos", "Abuja", "Port Harcourt", "Warri"],
    payloadKg: 8000, clearanceHeight: 3.5,
  },
  {
    id: "hh-015", brand: "Tata", model: "LPT 1518", year: 2020, tier: "heavy-haul", pricePerDay: 70000,
    images: [img("1586191582151-f73872dfd183"), img("1601584115197-04ecc0da31d7")],
    status: "available", features: ["Power Steering", "Air Brakes", "Full Chassis"],
    hubs: ["Lagos", "Kano", "Kaduna", "Port Harcourt"],
    payloadKg: 10000, clearanceHeight: 3.8,
  },
];

