import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BookingReceipt from '../BookingReceipt';

const mockBooking = {
  id: 'BK123',
  vehicleName: 'Tesla Model 3',
  startDate: '2024-02-01',
  endDate: '2024-02-05',
  dailyRate: 12500,
  totalDays: 4,
  subtotal: 50000,
  tax: 3750,
  serviceFee: 2500,
  total: 56250,
  paymentMethod: 'Visa ****1234',
  transactionId: 'TXN789',
  bookingDate: '2024-01-25T10:30:00Z'
};

describe('BookingReceipt', () => {
  it('renders receipt with all booking details', () => {
    render(<BookingReceipt booking={mockBooking} />);
    
    expect(screen.getByText(/booking receipt/i)).toBeInTheDocument();
    expect(screen.getByText(/BK123/)).toBeInTheDocument();
    expect(screen.getByText(/tesla model 3/i)).toBeInTheDocument();
    expect(screen.getByText(/₦56,250/)).toBeInTheDocument();
  });

  it('displays price breakdown correctly', () => {
    render(<BookingReceipt booking={mockBooking} />);
    
    expect(screen.getByText(/₦12,500.*×.*4 days/i)).toBeInTheDocument();
    expect(screen.getByText(/subtotal.*₦50,000/i)).toBeInTheDocument();
    expect(screen.getByText(/tax.*₦3,750/i)).toBeInTheDocument();
    expect(screen.getByText(/service fee.*₦2,500/i)).toBeInTheDocument();
  });

  it('shows payment information', () => {
    render(<BookingReceipt booking={mockBooking} />);
    
    expect(screen.getByText(/visa.*1234/i)).toBeInTheDocument();
    expect(screen.getByText(/TXN789/)).toBeInTheDocument();
  });

  it('allows downloading PDF receipt', async () => {
    const mockBlob = new Blob(['PDF content'], { type: 'application/pdf' });
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      blob: async () => mockBlob
    });

    render(<BookingReceipt booking={mockBooking} />);
    
    const downloadButton = screen.getByRole('button', { name: /download pdf/i });
    fireEvent.click(downloadButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/bookings/BK123/receipt.pdf'),
        expect.any(Object)
      );
    });
  });

  it('allows emailing receipt', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true })
    });

    render(<BookingReceipt booking={mockBooking} />);
    
    const emailButton = screen.getByRole('button', { name: /email receipt/i });
    fireEvent.click(emailButton);

    await waitFor(() => {
      expect(screen.getByText(/receipt sent/i)).toBeInTheDocument();
    });
  });

  it('allows printing receipt', () => {
    window.print = jest.fn();
    render(<BookingReceipt booking={mockBooking} />);
    
    const printButton = screen.getByRole('button', { name: /print/i });
    fireEvent.click(printButton);

    expect(window.print).toHaveBeenCalled();
  });

  it('displays booking dates formatted correctly', () => {
    render(<BookingReceipt booking={mockBooking} />);
    
    expect(screen.getByText(/feb.*1.*2024/i)).toBeInTheDocument();
    expect(screen.getByText(/feb.*5.*2024/i)).toBeInTheDocument();
  });

  it('shows transaction timestamp', () => {
    render(<BookingReceipt booking={mockBooking} />);
    
    expect(screen.getByText(/jan.*25.*2024/i)).toBeInTheDocument();
  });

  it('handles missing optional fields gracefully', () => {
    const minimalBooking = {
      id: 'BK456',
      vehicleName: 'Honda Civic',
      total: 30000
    };

    render(<BookingReceipt booking={minimalBooking} />);
    
    expect(screen.getByText(/BK456/)).toBeInTheDocument();
    expect(screen.getByText(/₦30,000/)).toBeInTheDocument();
  });
});
