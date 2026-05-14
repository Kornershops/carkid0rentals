import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RoleSelection from '../RoleSelection';

describe('RoleSelection', () => {
  it('renders role selection interface', () => {
    render(<RoleSelection />);
    
    expect(screen.getByText(/choose your role/i)).toBeInTheDocument();
  });

  it('shows all available roles', () => {
    render(<RoleSelection />);
    
    expect(screen.getByText(/customer/i)).toBeInTheDocument();
    expect(screen.getByText(/driver/i)).toBeInTheDocument();
    expect(screen.getByText(/lister/i)).toBeInTheDocument();
    expect(screen.getByText(/company/i)).toBeInTheDocument();
  });

  it('displays role descriptions', () => {
    render(<RoleSelection />);
    
    expect(screen.getByText(/rent vehicles/i)).toBeInTheDocument();
    expect(screen.getByText(/drive for others/i)).toBeInTheDocument();
    expect(screen.getByText(/list your vehicle/i)).toBeInTheDocument();
  });

  it('handles role selection', () => {
    const onSelect = jest.fn();
    render(<RoleSelection onSelect={onSelect} />);
    
    const driverCard = screen.getByText(/driver/i).closest('button');
    fireEvent.click(driverCard!);

    expect(onSelect).toHaveBeenCalledWith('driver');
  });

  it('highlights selected role', () => {
    render(<RoleSelection selectedRole="lister" />);
    
    const listerCard = screen.getByText(/lister/i).closest('button');
    expect(listerCard).toHaveClass('selected');
  });

  it('allows multiple role selection', () => {
    const onSelect = jest.fn();
    render(<RoleSelection multiple onSelect={onSelect} />);
    
    fireEvent.click(screen.getByText(/customer/i).closest('button')!);
    fireEvent.click(screen.getByText(/driver/i).closest('button')!);

    expect(onSelect).toHaveBeenCalledTimes(2);
  });

  it('shows role icons', () => {
    render(<RoleSelection />);
    
    expect(screen.getAllByTestId(/role-icon/i)).toHaveLength(4);
  });

  it('shows role benefits', () => {
    render(<RoleSelection showBenefits />);
    
    expect(screen.getByText(/earn money/i)).toBeInTheDocument();
    expect(screen.getByText(/flexible schedule/i)).toBeInTheDocument();
  });

  it('disables unavailable roles', () => {
    render(<RoleSelection disabledRoles={['company']} />);
    
    const companyCard = screen.getByText(/company/i).closest('button');
    expect(companyCard).toBeDisabled();
  });

  it('shows continue button when role selected', () => {
    render(<RoleSelection selectedRole="driver" onContinue={jest.fn()} />);
    
    expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument();
  });

  it('calls continue callback', () => {
    const onContinue = jest.fn();
    render(<RoleSelection selectedRole="driver" onContinue={onContinue} />);
    
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));
    expect(onContinue).toHaveBeenCalled();
  });
});
