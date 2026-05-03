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

export const useStore = create<AppState>((set) => ({
  role: "customer",
  country: "Nigeria",
  hub: "Lagos",
  tier: "all",
  route: {
    origin: "",
    destination: "",
  },
  setRole: (role) => set({ role }),
  setCountry: (country) => set({ country }),
  setHub: (hub) => set({ hub }),
  setTier: (tier) => set({ tier }),
  setRoute: (origin, destination) => set({ route: { origin, destination } }),
}));
