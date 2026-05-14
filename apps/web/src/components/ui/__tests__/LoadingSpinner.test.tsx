import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingSpinner from '../LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders loading spinner', () => {
    render(<LoadingSpinner />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders with custom size', () => {
    const { rerender } = render(<LoadingSpinner size="sm" />);
    expect(screen.getByTestId('loading-spinner')).toHaveClass('spinner-sm');
    
    rerender(<LoadingSpinner size="lg" />);
    expect(screen.getByTestId('loading-spinner')).toHaveClass('spinner-lg');
  });

  it('renders with custom color', () => {
    render(<LoadingSpinner color="primary" />);
    expect(screen.getByTestId('loading-spinner')).toHaveClass('text-primary');
  });

  it('renders with loading text', () => {
    render(<LoadingSpinner text="Loading..." />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders fullscreen overlay', () => {
    render(<LoadingSpinner fullscreen />);
    expect(screen.getByTestId('loading-overlay')).toBeInTheDocument();
  });

  it('renders centered spinner', () => {
    render(<LoadingSpinner centered />);
    expect(screen.getByTestId('loading-spinner').parentElement).toHaveClass('flex', 'justify-center');
  });

  it('applies custom className', () => {
    render(<LoadingSpinner className="custom-class" />);
    expect(screen.getByTestId('loading-spinner')).toHaveClass('custom-class');
  });

  it('renders with delay', () => {
    jest.useFakeTimers();
    render(<LoadingSpinner delay={500} />);
    
    expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    
    jest.advanceTimersByTime(500);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    
    jest.useRealTimers();
  });
});
