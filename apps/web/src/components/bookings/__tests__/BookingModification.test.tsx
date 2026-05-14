import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BookingModification from '../BookingModification';

const mockBooking = {
  id: 'BK123',
  vehicleId: 'V456',
  vehicleName: 'Tesla Model 3',
  startDate: '2024-02-01',
  endDate: '2024-02-05',
  totalPrice: 50000,
  status: 'confirmed'
};

describe('BookingModification', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it('renders modification form with current booking details', () => {
    render(<BookingModification booking={mockBooking} onClose={jest.fn()} />);
    
    expect(screen.getByText(/modify booking/i)).toBeInTheDocument();
    expect(screen.getByText(/BK123/i)).toBeInTheDocument();
    expect(screen.getByText(/tesla model 3/i)).toBeInTheDocument();
  });

  it('allows date modification with price recalculation', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ newPrice: 60000, priceDifference: 10000 })
    });

    render(<BookingModification booking={mockBooking} onClose={jest.fn()} />);
    
    const endDateInput = screen.getByLabelText(/end date/i);
    await userEvent.clear(endDateInput);
    await userEvent.type(endDateInput, '2024-02-06');

    await waitFor(() => {
      expect(screen.getByText(/₦60,000/)).toBeInTheDocument();
      expect(screen.getByText(/\+₦10,000/)).toBeInTheDocument();
    });
  });

  it('validates date constraints', async () => {
    render(<BookingModification booking={mockBooking} onClose={jest.fn()} />);
    
    const startDateInput = screen.getByLabelText(/start date/i);
    await userEvent.clear(startDateInput);
    await userEvent.type(startDateInput, '2024-01-01');

    expect(screen.getByText(/cannot modify past dates/i)).toBeInTheDocument();
  });

  it('handles modification submission', async () => {
    const onClose = jest.fn();
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true })
    });

    render(<BookingModification booking={mockBooking} onClose={onClose} />);
    
    const submitButton = screen.getByRole('button', { name: /confirm modification/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/bookings/BK123/modify'),
        expect.any(Object)
      );
      expect(onClose).toHaveBeenCalled();
    });
  });

  it('shows modification fee when applicable', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ newPrice: 60000, modificationFee: 2000 })
    });

    render(<BookingModification booking={mockBooking} onClose={jest.fn()} />);
    
    const endDateInput = screen.getByLabelText(/end date/i);
    await userEvent.type(endDateInput, '2024-02-06');

    await waitFor(() => {
      expect(screen.getByText(/modification fee.*₦2,000/i)).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    render(<BookingModification booking={mockBooking} onClose={jest.fn()} />);
    
    const submitButton = screen.getByRole('button', { name: /confirm modification/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/failed to modify booking/i)).toBeInTheDocument();
    });
  });

  it('allows cancellation of modification', () => {
    const onClose = jest.fn();
    render(<BookingModification booking={mockBooking} onClose={onClose} />);
    
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(onClose).toHaveBeenCalled();
  });

  it('disables modification for non-modifiable bookings', () => {
    const completedBooking = { ...mockBooking, status: 'completed' };
    render(<BookingModification booking={completedBooking} onClose={jest.fn()} />);
    
    expect(screen.getByText(/cannot modify completed bookings/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /confirm modification/i })).toBeDisabled();
  });
});
