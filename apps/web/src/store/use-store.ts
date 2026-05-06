import { create } from "zustand";

export type OperatingCountry = "Nigeria" | "Kenya" | "South Africa" | "Egypt" | "Ghana";
export type OperatingHub = 
  | "Lagos" | "Abuja" | "Port Harcourt" | "Kano" | "Kaduna" | "Enugu" | "Warri"
  | "Nairobi" 
  | "Johannesburg" 
  | "Cairo" 
  | "Accra";

export type UserRole = "customer" | "driver" | "logistics" | "admin";
export type VehicleTier = "all" | "eco-gig" | "elite" | "heavy-haul";

interface AppState {
  role: UserRole;
  country: OperatingCountry;
  hub: OperatingHub;
  tier: VehicleTier;
  route: {
    origin: string;
    destination: string;
  };
  setRole: (role: UserRole) => void;
  setCountry: (country: OperatingCountry) => void;
  setHub: (hub: OperatingHub) => void;
  setTier: (tier: VehicleTier) => void;
  setRoute: (origin: string, destination: string) => void;
}


interface ComparisonState {
  comparisonIds: string[];
  addToCompare: (id: string) => void;
  removeFromCompare: (id: string) => void;
  clearComparison: () => void;
}

// Merge types for the final hook
type StoreState = AppState & ComparisonState;

export const useStore = create<StoreState>((set) => ({
  role: "customer",
  country: "Nigeria",
  hub: "Lagos",
  tier: "all",
  route: {
    origin: "",
    destination: "",
  },
  comparisonIds: [],
  
  setRole: (role) => set({ role }),
  setCountry: (country) => set({ country }),
  setHub: (hub) => set({ hub }),
  setTier: (tier) => set({ tier }),
  setRoute: (origin, destination) => set({ route: { origin, destination } }),
  
  addToCompare: (id) => set((state) => ({
    comparisonIds: state.comparisonIds.length < 3 && !state.comparisonIds.includes(id)
      ? [...state.comparisonIds, id]
      : state.comparisonIds
  })),
  removeFromCompare: (id) => set((state) => ({
    comparisonIds: state.comparisonIds.filter(cid => cid !== id)
  })),
  clearComparison: () => set({ comparisonIds: [] }),
}));
