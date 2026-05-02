import { create } from "zustand";

interface AppState {
  role: "customer" | "rental_company" | "driver";
  tier: "all" | "eco-gig" | "elite" | "heavy-haul";
  setRole: (role: "customer" | "rental_company" | "driver") => void;
  setTier: (tier: "all" | "eco-gig" | "elite" | "heavy-haul") => void;
}

export const useStore = create<AppState>((set) => ({
  role: "customer",
  tier: "all",
  setRole: (role) => set({ role }),
  setTier: (tier) => set({ tier }),
}));
