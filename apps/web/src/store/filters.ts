import { create } from 'zustand';

export type VehicleCategory = 'all' | 'exotic' | 'premium' | 'eco-gig' | 'heavy-haul';
export type SortOption = 'price-asc' | 'price-desc' | 'rating-desc';

interface FiltersState {
  search: string;
  category: VehicleCategory;
  location: string;
  sortBy: SortOption;
  fuelType: string;
  setSearch: (search: string) => void;
  setCategory: (category: VehicleCategory) => void;
  setLocation: (location: string) => void;
  setSortBy: (sortBy: SortOption) => void;
  setFuelType: (fuelType: string) => void;
  resetFilters: () => void;
}

const initialState = {
  search: '',
  category: 'all' as VehicleCategory,
  location: 'all',
  sortBy: 'price-asc' as SortOption,
  fuelType: 'all',
};

export const useFiltersStore = create<FiltersState>((set) => ({
  ...initialState,
  setSearch: (search) => set({ search }),
  setCategory: (category) => set({ category }),
  setLocation: (location) => set({ location }),
  setSortBy: (sortBy) => set({ sortBy }),
  setFuelType: (fuelType) => set({ fuelType }),
  resetFilters: () => set(initialState),
}));
