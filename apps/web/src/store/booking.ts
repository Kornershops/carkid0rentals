import { create } from 'zustand';

interface BookingData {
  vehicleId: string;
  pickupDate: string;
  returnDate: string;
  name: string;
  email: string;
  phone: string;
  message?: string;
  company?: string;
  cargoType?: string;
  cargoWeight?: string;
  cargoDescription?: string;
}

interface BookingState {
  currentBooking: BookingData | null;
  bookingReference: string | null;
  startBooking: (vehicleId: string) => void;
  updateBooking: (data: Partial<BookingData>) => void;
  completeBooking: (reference: string) => void;
  clearBooking: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  currentBooking: null,
  bookingReference: null,
  startBooking: (vehicleId) =>
    set({
      currentBooking: {
        vehicleId,
        pickupDate: '',
        returnDate: '',
        name: '',
        email: '',
        phone: '',
      },
    }),
  updateBooking: (data) =>
    set((state) => ({
      currentBooking: state.currentBooking
        ? { ...state.currentBooking, ...data }
        : null,
    })),
  completeBooking: (reference) =>
    set({ bookingReference: reference }),
  clearBooking: () =>
    set({ currentBooking: null, bookingReference: null }),
}));
