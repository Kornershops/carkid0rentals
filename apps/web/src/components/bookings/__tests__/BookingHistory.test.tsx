import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BookingHistory from '../BookingHistory';

const mockBookings = [
  { id: 'BK1', vehicleName: 'Tesla Model 3', status: 'completed', date: '2024-01-15', total: 50000 },
  { id: 'BK2', vehicleName: 'BMW X5', status: 'active', date: '2024-02-01', total: 75000 },
  { id: 'BK3', vehicleName: 'Honda Civic', status: 'cancelled', date: '2024-01-20', total: 30000 }
];

describe('BookingHistory', () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ bookings: mockBookings, total: 3 })
    });
  });

  it('renders booking history list', async () => {
    render(<BookingHistory />);
    
    await waitFor(() => {
      expect(screen.getByText(/tesla model 3/i)).toBeInTheDocument();
      expect(screen.getByText(/bmw x5/i)).toBeInTheDocument();
    });
  });

  it('displays booking details', async () => {
    render(<BookingHistory />);
    
    await waitFor(() => {
      expect(screen.getByText(/BK1/)).toBeInTheDocument();
      expect(screen.getByText(/₦50,000/)).toBeInTheDocument();
      expect(screen.getByText(/completed/i)).toBeInTheDocument();
    });
  });

  it('filters by status', async () => {
    render(<BookingHistory />);
    
    await waitFor(() => screen.getByText(/tesla model 3/i));
    
    const statusFilter = screen.getByLabelText(/status/i);
    await userEvent.selectOptions(statusFilter, 'active');

    await waitFor(() => {
      expect(screen.getByText(/bmw x5/i)).toBeInTheDocument();
      expect(screen.queryByText(/tesla model 3/i)).not.toBeInTheDocument();
    });
  });

  it('filters by date range', async () => {
    render(<BookingHistory />);
    
    await waitFor(() => screen.getByText(/tesla model 3/i));
    
    const startDate = screen.getByLabelText(/start date/i);
    await userEvent.type(startDate, '2024-02-01');

    await waitFor(() => {
      expect(screen.getByText(/bmw x5/i)).toBeInTheDocument();
      expect(screen.queryByText(/tesla model 3/i)).not.toBeInTheDocument();
    });
  });

  it('sorts bookings by date', async () => {
    render(<BookingHistory />);
    
    await waitFor(() => screen.getByText(/tesla model 3/i));
    
    const sortButton = screen.getByRole('button', { name: /sort by date/i });
    fireEvent.click(sortButton);

    await waitFor(() => {
      const bookings = screen.getAllByTestId('booking-item');
      expect(bookings[0]).toHaveTextContent(/bmw x5/i);
    });
  });

  it('searches bookings', async () => {
    render(<BookingHistory />);
    
    await waitFor(() => screen.getByText(/tesla model 3/i));
    
    const searchInput = screen.getByPlaceholderText(/search bookings/i);
    await userEvent.type(searchInput, 'Tesla');

    await waitFor(() => {
      expect(screen.getByText(/tesla model 3/i)).toBeInTheDocument();
      expect(screen.queryByText(/bmw x5/i)).not.toBeInTheDocument();
    });
  });

  it('shows empty state when no bookings', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ bookings: [], total: 0 })
    });

    render(<BookingHistory />);
    
    await waitFor(() => {
      expect(screen.getByText(/no bookings found/i)).toBeInTheDocument();
    });
  });

  it('handles pagination', async () => {
    render(<BookingHistory />);
    
    await waitFor(() => screen.getByText(/tesla model 3/i));
    
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('page=2'),
        expect.any(Object)
      );
    });
  });

  it('navigates to booking detail', async () => {
    const onBookingClick = jest.fn();
    render(<BookingHistory onBookingClick={onBookingClick} />);
    
    await waitFor(() => screen.getByText(/tesla model 3/i));
    
    fireEvent.click(screen.getByText(/tesla model 3/i));
    expect(onBookingClick).toHaveBeenCalledWith('BK1');
  });

  it('shows loading state', () => {
    render(<BookingHistory />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('handles API errors', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    render(<BookingHistory />);
    
    await waitFor(() => {
      expect(screen.getByText(/failed to load bookings/i)).toBeInTheDocument();
    });
  });

  it('exports bookings to CSV', async () => {
    render(<BookingHistory />);
    
    await waitFor(() => screen.getByText(/tesla model 3/i));
    
    const exportButton = screen.getByRole('button', { name: /export/i });
    fireEvent.click(exportButton);

    await waitFor(() => {
      expect(screen.getByText(/exported successfully/i)).toBeInTheDocument();
    });
  });
});
