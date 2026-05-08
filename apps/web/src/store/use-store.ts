import { create } from "zustand";
import { persist } from "zustand/middleware";

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
  isAuthenticated: boolean;
  redirectTo: string | null;
  token: string | null;
  user: { id: string; fullName: string; email: string; phone: string; kycStatus: string } | null;
  route: {
    origin: string;
    destination: string;
  };
  setRole: (role: UserRole) => void;
  setCountry: (country: OperatingCountry) => void;
  setHub: (hub: OperatingHub) => void;
  setTier: (tier: VehicleTier) => void;
  setRoute: (origin: string, destination: string) => void;
  setAuthenticated: (value: boolean) => void;
  setRedirectTo: (url: string | null) => void;
  setToken: (token: string | null) => void;
  setUser: (user: AppState['user']) => void;
  logout: () => void;
}


interface ComparisonState {
  comparisonIds: string[];
  addToCompare: (id: string) => void;
  removeFromCompare: (id: string) => void;
  clearComparison: () => void;
}

// Merge types for the final hook
type StoreState = AppState & ComparisonState;

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      role: "customer",
      country: "Nigeria",
      hub: "Lagos",
      tier: "all",
      isAuthenticated: false,
      redirectTo: null,
      token: null,
      user: null,
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
      setAuthenticated: (value) => set({ isAuthenticated: value }),
      setRedirectTo: (url) => set({ redirectTo: url }),
      setToken: (token) => {
        if (token) localStorage.setItem('carkid0_token', token);
        else localStorage.removeItem('carkid0_token');
        set({ token });
      },
      setUser: (user) => set({ user }),
      logout: () => {
        localStorage.removeItem('carkid0_token');
        document.cookie = 'carkid0_auth=; path=/; max-age=0';
        set({ isAuthenticated: false, token: null, user: null });
      },
      
      addToCompare: (id) => set((state) => ({
        comparisonIds: state.comparisonIds.length < 3 && !state.comparisonIds.includes(id)
          ? [...state.comparisonIds, id]
          : state.comparisonIds
      })),
      removeFromCompare: (id) => set((state) => ({
        comparisonIds: state.comparisonIds.filter(cid => cid !== id)
      })),
      clearComparison: () => set({ comparisonIds: [] }),
    }),
    {
      name: "carkid0-store",
    }
  )
);
