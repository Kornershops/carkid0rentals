import {
  AppError,
  NetworkError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ServerError,
  ValidationError,
  logError,
} from './error-handling';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

class ApiClient {
  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('carkid0_token');
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    try {
      const token = this.getToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...((options.headers as Record<string, string>) || {}),
      };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

      if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'Request failed' }));
        
        switch (res.status) {
          case 400:
            throw new ValidationError(error.error || 'Validation failed', error.fields);
          case 401:
            throw new AuthenticationError(error.error || 'Authentication required');
          case 403:
            throw new AuthorizationError(error.error || 'Access denied');
          case 404:
            throw new NotFoundError(error.error || 'Resource not found');
          case 500:
          case 502:
          case 503:
            throw new ServerError(error.error || 'Server error occurred');
          default:
            throw new AppError(error.error || `HTTP ${res.status}`, 'API_ERROR', res.status);
        }
      }

      return res.json();
    } catch (error) {
      if (error instanceof AppError) {
        logError(error, `API: ${path}`);
        throw error;
      }
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        const networkError = new NetworkError('Unable to connect to server');
        logError(networkError, `API: ${path}`);
        throw networkError;
      }
      
      const appError = new AppError('An unexpected error occurred');
      logError(appError, `API: ${path}`);
      throw appError;
    }
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

  async updateRole(role: 'lister' | 'driver') {
    const res = await this.request<{ token: string; role: string }>('/auth/role', {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    });
    localStorage.setItem('carkid0_token', res.token);
    return res;
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

  // Lister
  async getListerDashboard() {
    return this.request<{
      monthlyRevenue: number;
      activeBookings: number;
      fleetSize: number;
      utilizationRate: number;
    }>('/lister/dashboard');
  }

  async getListerBookings(status?: string) {
    const query = status && status !== 'all' ? `?status=${status}` : '';
    return this.request<Booking[]>(`/lister/bookings${query}`);
  }

  async registerLister(payload: { businessName: string; businessType: string; taxId: string }) {
    return this.request<{ id: string; status: string }>('/lister/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // Driver
  async getDriverDashboard() {
    return this.request<{
      todayEarnings: number;
      weeklyEarnings: number;
      activeBookings: number;
      availableVehicles: number;
    }>('/drivers/dashboard');
  }

  async registerDriver(payload: {
    licenseNumber: string;
    licenseExpiry: string;
    experience: number;
    vehicleType: string;
  }) {
    return this.request<{ id: string; status: string }>('/drivers/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async getDriverVerificationStatus() {
    return this.request<{ status: string; documents: any[] }>('/drivers/verification-status');
  }

  async uploadDocument(file: File, type: string) {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('type', type);

    const token = this.getToken();
    const res = await fetch(`${API_BASE}/drivers/upload-document`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });

    if (!res.ok) throw new Error('Upload failed');
    return res.json();
  }

  async completeDriverOnboarding(preferences: any) {
    return this.request<{ status: string }>('/drivers/onboard', {
      method: 'POST',
      body: JSON.stringify({ preferences }),
    });
  }

  // Messages
  async getConversations() {
    return this.request<any[]>('/messages');
  }

  async sendMessage(conversationId: string, message: string) {
    return this.request<any>('/messages', {
      method: 'POST',
      body: JSON.stringify({ conversationId, message }),
    });
  }

  // Company
  async getCompanyFleet() {
    return this.request<{ vehicles: Listing[]; stats: any }>('/company/fleet');
  }

  async getCompanyAnalytics() {
    return this.request<any>('/company/analytics');
  }

  // IoT
  async sendIoTCommand(vehicleId: string, command: string) {
    return this.request<{ commandId: string; status: string }>('/iot/command', {
      method: 'POST',
      body: JSON.stringify({ vehicleId, command }),
    });
  }

  async getVehicleStatus(vehicleId: string) {
    return this.request<any>(`/iot/status/${vehicleId}`);
  }

  // Logistics
  async getDeliveries() {
    return this.request<any[]>('/logistics/deliveries');
  }

  async createDelivery(payload: any) {
    return this.request<any>('/logistics/deliveries', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // Hauler
  async getHaulerDashboard() {
    return this.request<any>('/hauler/dashboard');
  }

  async getHaulerVehicles() {
    return this.request<Listing[]>('/hauler/vehicles');
  }

  async createHaulerBooking(payload: CreateBookingPayload) {
    return this.request<Booking>('/hauler/book', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // Public
  async getPublicBooking(id: string) {
    return this.request<Booking>(`/bookings/${id}/public`);
  }

  async getFleetDetail(id: string) {
    return this.request<any>(`/fleet/${id}/detail`);
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
