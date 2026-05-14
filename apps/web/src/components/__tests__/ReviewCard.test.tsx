import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ReviewCard from '../ReviewCard';

const mockReview = {
  id: 'R123',
  userName: 'John Doe',
  userAvatar: '/avatars/john.jpg',
  rating: 5,
  date: '2024-01-15',
  comment: 'Great vehicle! Very clean and comfortable.',
  helpful: 12,
  vehicleName: 'Tesla Model 3'
};

describe('ReviewCard', () => {
  it('renders review card', () => {
    render(<ReviewCard review={mockReview} />);
    
    expect(screen.getByText(/john doe/i)).toBeInTheDocument();
    expect(screen.getByText(/great vehicle/i)).toBeInTheDocument();
  });

  it('displays user avatar', () => {
    render(<ReviewCard review={mockReview} />);
    
    const avatar = screen.getByAltText(/john doe/i);
    expect(avatar).toHaveAttribute('src', '/avatars/john.jpg');
  });

  it('shows rating stars', () => {
    render(<ReviewCard review={mockReview} />);
    
    const stars = screen.getAllByTestId('star-icon');
    expect(stars).toHaveLength(5);
    expect(stars.filter(star => star.classList.contains('filled'))).toHaveLength(5);
  });

  it('displays review date', () => {
    render(<ReviewCard review={mockReview} />);
    expect(screen.getByText(/jan.*15.*2024/i)).toBeInTheDocument();
  });

  it('shows review comment', () => {
    render(<ReviewCard review={mockReview} />);
    expect(screen.getByText(/great vehicle.*clean.*comfortable/i)).toBeInTheDocument();
  });

  it('displays helpful count', () => {
    render(<ReviewCard review={mockReview} />);
    expect(screen.getByText(/12.*helpful/i)).toBeInTheDocument();
  });

  it('handles helpful button click', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ helpful: 13 })
    });

    render(<ReviewCard review={mockReview} />);
    
    const helpfulButton = screen.getByRole('button', { name: /helpful/i });
    fireEvent.click(helpfulButton);

    await waitFor(() => {
      expect(screen.getByText(/13.*helpful/i)).toBeInTheDocument();
    });
  });

  it('shows vehicle name when provided', () => {
    render(<ReviewCard review={mockReview} showVehicle />);
    expect(screen.getByText(/tesla model 3/i)).toBeInTheDocument();
  });

  it('displays verified badge', () => {
    const verifiedReview = { ...mockReview, verified: true };
    render(<ReviewCard review={verifiedReview} />);
    
    expect(screen.getByText(/verified/i)).toBeInTheDocument();
  });

  it('shows report button', () => {
    render(<ReviewCard review={mockReview} />);
    expect(screen.getByRole('button', { name: /report/i })).toBeInTheDocument();
  });

  it('handles report click', () => {
    const onReport = jest.fn();
    render(<ReviewCard review={mockReview} onReport={onReport} />);
    
    fireEvent.click(screen.getByRole('button', { name: /report/i }));
    expect(onReport).toHaveBeenCalledWith(mockReview.id);
  });

  it('shows reply button for owner', () => {
    render(<ReviewCard review={mockReview} isOwner />);
    expect(screen.getByRole('button', { name: /reply/i })).toBeInTheDocument();
  });

  it('displays owner response', () => {
    const reviewWithResponse = {
      ...mockReview,
      ownerResponse: 'Thank you for your feedback!'
    };
    render(<ReviewCard review={reviewWithResponse} />);
    
    expect(screen.getByText(/thank you for your feedback/i)).toBeInTheDocument();
  });

  it('truncates long comments', () => {
    const longReview = {
      ...mockReview,
      comment: 'A'.repeat(300)
    };
    render(<ReviewCard review={longReview} />);
    
    expect(screen.getByRole('button', { name: /read more/i })).toBeInTheDocument();
  });

  it('expands truncated comment', () => {
    const longReview = {
      ...mockReview,
      comment: 'A'.repeat(300)
    };
    render(<ReviewCard review={longReview} />);
    
    fireEvent.click(screen.getByRole('button', { name: /read more/i }));
    expect(screen.getByRole('button', { name: /show less/i })).toBeInTheDocument();
  });
});
