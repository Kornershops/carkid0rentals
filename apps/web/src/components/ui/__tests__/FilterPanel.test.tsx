import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FilterPanel from '../FilterPanel';

const mockFilters = {
  category: ['Sedan', 'SUV', 'Truck'],
  priceRange: ['0-50', '50-100', '100+'],
  features: ['GPS', 'Bluetooth', 'Sunroof']
};

describe('FilterPanel', () => {
  it('renders filter panel', () => {
    render(<FilterPanel filters={mockFilters} />);
    expect(screen.getByText(/filters/i)).toBeInTheDocument();
  });

  it('displays all filter categories', () => {
    render(<FilterPanel filters={mockFilters} />);
    
    expect(screen.getByText(/category/i)).toBeInTheDocument();
    expect(screen.getByText(/price range/i)).toBeInTheDocument();
    expect(screen.getByText(/features/i)).toBeInTheDocument();
  });

  it('displays filter options', () => {
    render(<FilterPanel filters={mockFilters} />);
    
    expect(screen.getByLabelText(/sedan/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/suv/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/gps/i)).toBeInTheDocument();
  });

  it('handles filter selection', () => {
    const onFilterChange = jest.fn();
    render(<FilterPanel filters={mockFilters} onFilterChange={onFilterChange} />);
    
    const sedanCheckbox = screen.getByLabelText(/sedan/i);
    fireEvent.click(sedanCheckbox);
    
    expect(onFilterChange).toHaveBeenCalledWith(
      expect.objectContaining({ category: ['Sedan'] })
    );
  });

  it('handles multiple selections', () => {
    const onFilterChange = jest.fn();
    render(<FilterPanel filters={mockFilters} onFilterChange={onFilterChange} />);
    
    fireEvent.click(screen.getByLabelText(/sedan/i));
    fireEvent.click(screen.getByLabelText(/suv/i));
    
    expect(onFilterChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ category: expect.arrayContaining(['Sedan', 'SUV']) })
    );
  });

  it('resets all filters', () => {
    const onFilterChange = jest.fn();
    render(<FilterPanel filters={mockFilters} onFilterChange={onFilterChange} />);
    
    fireEvent.click(screen.getByLabelText(/sedan/i));
    fireEvent.click(screen.getByRole('button', { name: /reset/i }));
    
    expect(onFilterChange).toHaveBeenCalledWith({});
  });

  it('shows active filter count', () => {
    render(<FilterPanel filters={mockFilters} activeFilters={{ category: ['Sedan', 'SUV'] }} />);
    expect(screen.getByText(/2.*active/i)).toBeInTheDocument();
  });

  it('collapses and expands filter sections', async () => {
    render(<FilterPanel filters={mockFilters} collapsible />);
    
    const categoryHeader = screen.getByText(/category/i);
    fireEvent.click(categoryHeader);
    
    await waitFor(() => {
      expect(screen.queryByLabelText(/sedan/i)).not.toBeVisible();
    });
  });

  it('applies filters on button click', () => {
    const onApply = jest.fn();
    render(<FilterPanel filters={mockFilters} onApply={onApply} />);
    
    fireEvent.click(screen.getByLabelText(/sedan/i));
    fireEvent.click(screen.getByRole('button', { name: /apply/i }));
    
    expect(onApply).toHaveBeenCalled();
  });

  it('renders in mobile drawer mode', () => {
    render(<FilterPanel filters={mockFilters} mobile />);
    expect(screen.getByTestId('filter-drawer')).toBeInTheDocument();
  });
});
