import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import VehicleCard from '../VehicleCard';

const mockVehicle = {
  id: 'V123',
  name: 'Tesla Model 3',
  category: 'Sedan',
  image: '/images/tesla.jpg',
  dailyRate: 12500,
  rating: 4.8,
  reviews: 120,
  available: true,
  features: ['GPS', 'Bluetooth', 'Sunroof']
};

describe('VehicleCard', () => {
  it('renders vehicle card', () => {
    render(<VehicleCard vehicle={mockVehicle} />);
    
    expect(screen.getByText(/tesla model 3/i)).toBeInTheDocument();
    expect(screen.getByText(/sedan/i)).toBeInTheDocument();
  });

  it('displays vehicle image', () => {
    render(<VehicleCard vehicle={mockVehicle} />);
    
    const image = screen.getByAltText(/tesla model 3/i);
    expect(image).toHaveAttribute('src', '/images/tesla.jpg');
  });

  it('shows daily rate', () => {
    render(<VehicleCard vehicle={mockVehicle} />);
    expect(screen.getByText(/₦12,500/)).toBeInTheDocument();
    expect(screen.getByText(/per day/i)).toBeInTheDocument();
  });

  it('displays rating and reviews', () => {
    render(<VehicleCard vehicle={mockVehicle} />);
    
    expect(screen.getByText(/4\.8/)).toBeInTheDocument();
    expect(screen.getByText(/120.*reviews/i)).toBeInTheDocument();
  });

  it('shows availability status', () => {
    render(<VehicleCard vehicle={mockVehicle} />);
    expect(screen.getByText(/available/i)).toBeInTheDocument();
  });

  it('shows unavailable status', () => {
    const unavailableVehicle = { ...mockVehicle, available: false };
    render(<VehicleCard vehicle={unavailableVehicle} />);
    
    expect(screen.getByText(/unavailable/i)).toBeInTheDocument();
  });

  it('displays vehicle features', () => {
    render(<VehicleCard vehicle={mockVehicle} />);
    
    expect(screen.getByText(/gps/i)).toBeInTheDocument();
    expect(screen.getByText(/bluetooth/i)).toBeInTheDocument();
    expect(screen.getByText(/sunroof/i)).toBeInTheDocument();
  });

  it('handles card click', () => {
    const onClick = jest.fn();
    render(<VehicleCard vehicle={mockVehicle} onClick={onClick} />);
    
    fireEvent.click(screen.getByText(/tesla model 3/i).closest('div')!);
    expect(onClick).toHaveBeenCalledWith(mockVehicle);
  });

  it('shows book now button', () => {
    render(<VehicleCard vehicle={mockVehicle} />);
    expect(screen.getByRole('button', { name: /book now/i })).toBeInTheDocument();
  });

  it('handles book button click', () => {
    const onBook = jest.fn();
    render(<VehicleCard vehicle={mockVehicle} onBook={onBook} />);
    
    fireEvent.click(screen.getByRole('button', { name: /book now/i }));
    expect(onBook).toHaveBeenCalledWith(mockVehicle.id);
  });

  it('disables book button when unavailable', () => {
    const unavailableVehicle = { ...mockVehicle, available: false };
    render(<VehicleCard vehicle={unavailableVehicle} />);
    
    expect(screen.getByRole('button', { name: /book now/i })).toBeDisabled();
  });

  it('shows favorite button', () => {
    render(<VehicleCard vehicle={mockVehicle} showFavorite />);
    expect(screen.getByRole('button', { name: /favorite/i })).toBeInTheDocument();
  });

  it('handles favorite toggle', () => {
    const onFavorite = jest.fn();
    render(<VehicleCard vehicle={mockVehicle} showFavorite onFavorite={onFavorite} />);
    
    fireEvent.click(screen.getByRole('button', { name: /favorite/i }));
    expect(onFavorite).toHaveBeenCalledWith(mockVehicle.id);
  });

  it('shows discount badge', () => {
    const vehicleWithDiscount = { ...mockVehicle, discount: 20 };
    render(<VehicleCard vehicle={vehicleWithDiscount} />);
    
    expect(screen.getByText(/20% off/i)).toBeInTheDocument();
  });

  it('renders compact variant', () => {
    render(<VehicleCard vehicle={mockVehicle} variant="compact" />);
    expect(screen.getByTestId('vehicle-card')).toHaveClass('compact');
  });
});
