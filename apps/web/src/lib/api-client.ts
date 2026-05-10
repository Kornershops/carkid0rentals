const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

class ApiClient {
  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('carkid0_token');
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `HTTP ${res.status}`);
    }

    return res.json();
  }

  // Auth
  async login(payload: { phone?: string; email?: string }) {
    return this.request<{ message: string; expiresIn: number }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async verifyOTP(payload: { phone?: string; email?: string; otp: string }) {
    const res = await this.request<{ token: string; user: User }>('/auth/verify', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    localStorage.setItem('carkid0_token', res.token);
    return res;
  }

  async submitKYC(payload: { fullName: string; dateOfBirth: string; address: string; idType: string }) {
    return this.request<{ status: string }>('/auth/kyc', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async getMe() {
    return this.request<User>('/auth/me');
  }

  // Listings
  async getListings(params?: { category?: string; source?: string; country?: string; page?: number }) {
    const query = new URLSearchParams();
    if (params?.category) query.set('category', params.category);
    if (params?.source) query.set('source', params.source);
    if (params?.country) query.set('country', params.country);
    if (params?.page) query.set('page', String(params.page));
    return this.request<{ listings: Listing[]; total: number }>(`/listings?${query}`);
  }

  async getListing(id: string) {
    return this.request<Listing>(`/listings/${id}`);
  }

  async createListing(payload: CreateListingPayload) {
    return this.request<Listing>('/listings', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // Bookings
  async createBooking(payload: CreateBookingPayload) {
    return this.request<Booking>('/bookings', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async getMyBookings() {
    return this.request<Booking[]>('/bookings');
  }

  async getBooking(id: string) {
    return this.request<Booking>(`/bookings/${id}`);
  }

  // Payments
  async initializePayment(bookingId: string) {
    return this.request<{ authorizationUrl: string; reference: string }>('/payments/initialize', {
      method: 'POST',
      body: JSON.stringify({ bookingId }),
    });
  }

  async getPaymentStatus(bookingId: string) {
    return this.request<{ status: string; reference: string }>(`/payments/${bookingId}`);
  }
}

export const api = new ApiClient();

// Types
export interface User {
  id: string;
  phone: string;
  email: string;
  fullName: string;
  role: string;
  kycStatus: 'pending' | 'approved' | 'rejected';
  country: string;
  city: string;
}

export interface Listing {
  id: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  category: string;
  pricePerDay: number;
  images: string[];
  location: string;
  country: string;
  availability: string;
  status: 'pending' | 'approved' | 'rejected';
  features: string[];
  isEV: boolean;
  listerId: string;
  listerRole: 'admin' | 'lister';
  listerName: string;
}

export interface Booking {
  id: string;
  listingId: string;
  listingTitle: string;
  listerRole: string;
  startDate: string;
  endDate: string;
  days: number;
  pricePerDay: number;
  subtotal: number;
  serviceFee: number;
  total: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'paid' | 'active' | 'completed' | 'cancelled';
  paymentRef: string;
  createdAt: string;
}

export interface CreateBookingPayload {
  listingId: string;
  startDate: string;
  endDate: string;
  fullName: string;
  email: string;
  phone: string;
  message?: string;
}

export interface CreateListingPayload {
  title: string;
  brand: string;
  model: string;
  year: number;
  category: string;
  pricePerDay: number;
  images: string[];
  location: string;
  country: string;
  features: string[];
  isEV: boolean;
  listerName?: string;
}
