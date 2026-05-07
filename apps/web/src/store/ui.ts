import { create } from 'zustand';

interface UIState {
  isRoleModalOpen: boolean;
  isMobileMenuOpen: boolean;
  isSidebarOpen: boolean;
  isLoading: boolean;
  loadingMessage: string;
  openRoleModal: () => void;
  closeRoleModal: () => void;
  toggleMobileMenu: () => void;
  toggleSidebar: () => void;
  setLoading: (isLoading: boolean, message?: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isRoleModalOpen: false,
  isMobileMenuOpen: false,
  isSidebarOpen: true,
  isLoading: false,
  loadingMessage: '',
  openRoleModal: () => set({ isRoleModalOpen: true }),
  closeRoleModal: () => set({ isRoleModalOpen: false }),
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setLoading: (isLoading, message = '') =>
    set({ isLoading, loadingMessage: message }),
}));
