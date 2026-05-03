import { create } from "zustand";

export type OperatingHub = "Lagos" | "Abuja" | "Port Harcourt" | "Kano" | "Kaduna" | "Enugu" | "Warri";

interface AppState {
  role: "customer" | "rental_company" | "driver";
  tier: "all" | "eco-gig" | "elite" | "heavy-haul";
  hub: OperatingHub;
  route: {
    origin: string;
    destination: string;
  };
  setRole: (role: "customer" | "rental_company" | "driver") => void;
  setTier: (tier: "all" | "eco-gig" | "elite" | "heavy-haul") => void;
  setHub: (hub: OperatingHub) => void;
  setRoute: (origin: string, destination: string) => void;
}

export const useStore = create<AppState>((set) => ({
  role: "customer",
  tier: "all",
  hub: "Lagos",
  route: {
    origin: "",
    destination: "",
  },
  setRole: (role) => set({ role }),
  setTier: (tier) => set({ tier }),
  setHub: (hub) => set({ hub }),
  setRoute: (origin, destination) => set({ route: { origin, destination } }),
}));
