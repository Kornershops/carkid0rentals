export interface Lister {
  id: string;
  name: string;
  avatar?: string;
  rating: number;
  reviewCount: number;
  responseTime: string;
  verificationStatus: 'verified' | 'pending' | 'unverified';
  fleetCount: number;
  joinedDate: string;
  location: string;
}

export interface Listing {
  id: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  category: 'exotic' | 'premium' | 'eco-gig' | 'heavy-haul';
  pricePerDay: number;
  images: string[];
  location: string;
  country: string;
  availability: 'available' | 'rented' | 'maintenance';
  features: string[];
  specs: {
    seats?: number;
    transmission?: string;
    fuelType?: string;
    mileage?: string;
    hp?: number;
    payload?: number;
  };
  lister: Lister;
  isEV?: boolean;
}

export const MOCK_LISTERS: Lister[] = [
  {
    id: 'lister-1',
    name: 'Premium Fleet Lagos',
    rating: 4.9,
    reviewCount: 234,
    responseTime: '< 1 hour',
    verificationStatus: 'verified',
    fleetCount: 45,
    joinedDate: '2022-01',
    location: 'Lagos, Nigeria',
  },
  {
    id: 'lister-2',
    name: 'EcoRide Africa',
    rating: 4.8,
    reviewCount: 189,
    responseTime: '< 2 hours',
    verificationStatus: 'verified',
    fleetCount: 32,
    joinedDate: '2022-06',
    location: 'Nairobi, Kenya',
  },
  {
    id: 'lister-3',
    name: 'Heavy Haul Logistics',
    rating: 4.7,
    reviewCount: 156,
    responseTime: '< 3 hours',
    verificationStatus: 'verified',
    fleetCount: 28,
    joinedDate: '2021-11',
    location: 'Lagos, Nigeria',
  },
  {
    id: 'lister-4',
    name: 'Elite Motors SA',
    rating: 4.9,
    reviewCount: 312,
    responseTime: '< 1 hour',
    verificationStatus: 'verified',
    fleetCount: 67,
    joinedDate: '2021-03',
    location: 'Johannesburg, South Africa',
  },
  {
    id: 'lister-5',
    name: 'Gig Vehicle Hub',
    rating: 4.6,
    reviewCount: 98,
    responseTime: '< 4 hours',
    verificationStatus: 'verified',
    fleetCount: 18,
    joinedDate: '2023-02',
    location: 'Accra, Ghana',
  },
];

export const MOCK_LISTINGS: Listing[] = [
  // Exotic & Premium
  {
    id: 'listing-1',
    title: 'Mercedes-Benz GLE Coupe AMG',
    brand: 'Mercedes-Benz',
    model: 'GLE Coupe',
    year: 2023,
    category: 'exotic',
    pricePerDay: 450,
    images: [
      '/fleet/cars/mercedes-gle-coupe/exterior-front.png',
      '/fleet/cars/mercedes-gle-coupe/exterior-side-1.png',
      '/fleet/cars/mercedes-gle-coupe/exterior-action.png',
    ],
    location: 'Lagos',
    country: 'Nigeria',
    availability: 'available',
    features: ['AMG Performance', 'Airmatic Suspension', 'MBUX', 'Premium Sound'],
    specs: {
      seats: 5,
      transmission: 'Automatic',
      fuelType: 'Petrol',
      hp: 429,
    },
    lister: MOCK_LISTERS[0],
  },
  {
    id: 'listing-2',
    title: 'Toyota Land Cruiser 200 (Custom Interior)',
    brand: 'Toyota',
    model: 'Land Cruiser 200',
    year: 2021,
    category: 'premium',
    pricePerDay: 350,
    images: [
      '/fleet/cars/toyota-lc200-red-interior/exterior-side.jpg',
      '/fleet/cars/toyota-lc200-red-interior/interior-dash.jpg',
    ],
    location: 'Lagos',
    country: 'Nigeria',
    availability: 'available',
    features: ['Custom Leather', 'VIP Cabin', 'Off-Road Capable', 'Sunroof'],
    specs: {
      seats: 7,
      transmission: 'Automatic',
      fuelType: 'Diesel',
    },
    lister: MOCK_LISTERS[0],
  },
  {
    id: 'listing-3',
    title: 'Lexus GX460 (Facelift)',
    brand: 'Lexus',
    model: 'GX460',
    year: 2022,
    category: 'premium',
    pricePerDay: 250,
    images: [
      '/fleet/cars/lexus-gx460-facelift/exterior-front.jpg',
      '/fleet/cars/lexus-gx460-facelift/interior-cockpit.jpg',
    ],
    location: 'Johannesburg',
    country: 'South Africa',
    availability: 'available',
    features: ['Spindle Grille', 'Luxury Comfort', '4WD', 'Premium Audio'],
    specs: {
      seats: 7,
      transmission: 'Automatic',
      fuelType: 'Petrol',
    },
    lister: MOCK_LISTERS[3],
  },
  {
    id: 'listing-4',
    title: 'Toyota Land Cruiser Prado TXL',
    brand: 'Toyota',
    model: 'Prado TXL',
    year: 2022,
    category: 'premium',
    pricePerDay: 200,
    images: [
      '/fleet/cars/toyota-prado-txl/exterior-front.jpg',
      '/fleet/cars/toyota-prado-txl/interior-dash.jpg',
    ],
    location: 'Nairobi',
    country: 'Kenya',
    availability: 'available',
    features: ['7-Seater', 'Robust 4WD', 'TXL Trim', 'Sunroof'],
    specs: {
      seats: 7,
      transmission: 'Automatic',
      fuelType: 'Diesel',
    },
    lister: MOCK_LISTERS[1],
  },
  
  // Eco-Gig
  {
    id: 'listing-5',
    title: 'Wuling Bingo EV (Blue)',
    brand: 'Wuling',
    model: 'Bingo EV',
    year: 2024,
    category: 'eco-gig',
    pricePerDay: 35,
    images: [
      '/fleet/cars/wuling-bingo-ev-blue/exterior-front.png',
      '/fleet/cars/wuling-bingo-ev-blue/interior.png',
    ],
    location: 'Lagos',
    country: 'Nigeria',
    availability: 'available',
    features: ['Ultra Compact', 'Smart Connect', 'Zero Emissions', 'Fast Charging'],
    specs: {
      seats: 4,
      transmission: 'Automatic',
      fuelType: 'Electric',
      mileage: '200km range',
    },
    lister: MOCK_LISTERS[1],
    isEV: true,
  },
  {
    id: 'listing-6',
    title: 'Wuling Bingo EV (Green)',
    brand: 'Wuling',
    model: 'Bingo EV',
    year: 2024,
    category: 'eco-gig',
    pricePerDay: 35,
    images: [
      '/fleet/cars/wuling-bingo-ev-green/exterior-front.png',
      '/fleet/cars/wuling-bingo-ev-green/interior-brown.png',
    ],
    location: 'Nairobi',
    country: 'Kenya',
    availability: 'available',
    features: ['Eco-Friendly', 'Compact Design', 'City Commuter', 'Low Cost'],
    specs: {
      seats: 4,
      transmission: 'Automatic',
      fuelType: 'Electric',
      mileage: '200km range',
    },
    lister: MOCK_LISTERS[1],
    isEV: true,
  },
  {
    id: 'listing-7',
    title: 'Innoson IVM EX02 (Yellow)',
    brand: 'Innoson',
    model: 'IVM EX02',
    year: 2023,
    category: 'eco-gig',
    pricePerDay: 40,
    images: [
      '/fleet/cars/innoson-ivm-ex02-yellow/exterior-front.png',
      '/fleet/cars/innoson-ivm-ex02-yellow/exterior-rear.png',
    ],
    location: 'Lagos',
    country: 'Nigeria',
    availability: 'available',
    features: ['Locally Manufactured', 'Rugged Chassis', 'Low Fuel Consumption', 'Reliable'],
    specs: {
      seats: 5,
      transmission: 'Manual',
      fuelType: 'Petrol',
    },
    lister: MOCK_LISTERS[4],
  },
  {
    id: 'listing-8',
    title: 'Toyota Corolla 2017',
    brand: 'Toyota',
    model: 'Corolla',
    year: 2017,
    category: 'eco-gig',
    pricePerDay: 42,
    images: [
      '/fleet/cars/toyota-corolla-2017/exterior-front.png',
    ],
    location: 'Accra',
    country: 'Ghana',
    availability: 'available',
    features: ['Latest Features', 'Premium Economy', 'Fuel Efficient', 'Reliable'],
    specs: {
      seats: 5,
      transmission: 'Automatic',
      fuelType: 'Petrol',
    },
    lister: MOCK_LISTERS[4],
  },
  
  // Heavy-Haul
  {
    id: 'listing-9',
    title: 'Jet Mover EV (White)',
    brand: 'Jet Motor',
    model: 'Mover EV',
    year: 2023,
    category: 'heavy-haul',
    pricePerDay: 180,
    images: [
      '/fleet/cars/jet-mover-ev-white/exterior-front.png',
      '/fleet/cars/jet-mover-ev-white/exterior-side.png',
    ],
    location: 'Lagos',
    country: 'Nigeria',
    availability: 'available',
    features: ['Zero Emission Logistics', 'High Payload', 'Fast Charging', 'Fleet Tracking'],
    specs: {
      transmission: 'Automatic',
      fuelType: 'Electric',
      payload: 1500,
    },
    lister: MOCK_LISTERS[2],
    isEV: true,
  },
  {
    id: 'listing-10',
    title: 'Toyota Hilux (Security Escort)',
    brand: 'Toyota',
    model: 'Hilux',
    year: 2023,
    category: 'heavy-haul',
    pricePerDay: 300,
    images: [
      '/fleet/cars/toyota-hilux-escort/exterior-front.jpg',
      '/fleet/cars/toyota-hilux-escort/interior-cockpit-radio.jpg',
    ],
    location: 'Lagos',
    country: 'Nigeria',
    availability: 'available',
    features: ['Light Bar & Siren', 'VHF/UHF Comms', 'Enhanced Battery', 'Reinforced Bullbar'],
    specs: {
      seats: 5,
      transmission: 'Manual',
      fuelType: 'Diesel',
      payload: 1000,
    },
    lister: MOCK_LISTERS[2],
  },
  {
    id: 'listing-11',
    title: 'Toyota Land Cruiser 200 (Armored B6)',
    brand: 'Toyota',
    model: 'Land Cruiser 200',
    year: 2021,
    category: 'heavy-haul',
    pricePerDay: 650,
    images: [
      '/fleet/cars/toyota-lc200-armored/exterior-rear-hatch.jpg',
      '/fleet/cars/toyota-lc200-armored/exterior-rear-side.jpg',
    ],
    location: 'Lagos',
    country: 'Nigeria',
    availability: 'available',
    features: ['B6 Level Armor', 'Ballistic Glass', 'Run-Flat Tires', 'Upgraded Suspension'],
    specs: {
      seats: 7,
      transmission: 'Automatic',
      fuelType: 'Diesel',
      payload: 4500,
    },
    lister: MOCK_LISTERS[2],
  },
  {
    id: 'listing-12',
    title: 'Toyota Hilux Adventure',
    brand: 'Toyota',
    model: 'Hilux Adventure',
    year: 2024,
    category: 'heavy-haul',
    pricePerDay: 180,
    images: [
      '/fleet/cars/toyota-hilux-adventure/exterior-front.jpg',
      '/fleet/cars/toyota-hilux-adventure/exterior-side.jpg',
    ],
    location: 'Nairobi',
    country: 'Kenya',
    availability: 'available',
    features: ['4x4 Drive', 'Adventure Trim', 'Rugged Utility', 'Off-Road'],
    specs: {
      seats: 5,
      transmission: 'Manual',
      fuelType: 'Diesel',
      payload: 1000,
    },
    lister: MOCK_LISTERS[1],
  },
];
