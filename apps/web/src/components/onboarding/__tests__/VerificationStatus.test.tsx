import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import VerificationStatus from '../VerificationStatus';

describe('VerificationStatus', () => {
  it('renders pending status', () => {
    render(<VerificationStatus status="pending" />);
    
    expect(screen.getByText(/verification pending/i)).toBeInTheDocument();
    expect(screen.getByText(/under review/i)).toBeInTheDocument();
  });

  it('renders approved status', () => {
    render(<VerificationStatus status="approved" />);
    
    expect(screen.getByText(/verified/i)).toBeInTheDocument();
    expect(screen.getByTestId('check-icon')).toBeInTheDocument();
  });

  it('renders rejected status', () => {
    render(<VerificationStatus status="rejected" />);
    
    expect(screen.getByText(/verification failed/i)).toBeInTheDocument();
    expect(screen.getByTestId('error-icon')).toBeInTheDocument();
  });

  it('shows rejection reason', () => {
    render(<VerificationStatus status="rejected" reason="Document expired" />);
    
    expect(screen.getByText(/document expired/i)).toBeInTheDocument();
  });

  it('shows resubmit button for rejected status', () => {
    render(<VerificationStatus status="rejected" onResubmit={jest.fn()} />);
    
    expect(screen.getByRole('button', { name: /resubmit/i })).toBeInTheDocument();
  });

  it('calls resubmit callback', () => {
    const onResubmit = jest.fn();
    render(<VerificationStatus status="rejected" onResubmit={onResubmit} />);
    
    fireEvent.click(screen.getByRole('button', { name: /resubmit/i }));
    expect(onResubmit).toHaveBeenCalled();
  });

  it('shows estimated time for pending status', () => {
    render(<VerificationStatus status="pending" estimatedTime="24 hours" />);
    
    expect(screen.getByText(/24 hours/i)).toBeInTheDocument();
  });

  it('shows verification date for approved status', () => {
    render(<VerificationStatus status="approved" verifiedAt="2024-01-01" />);
    
    expect(screen.getByText(/jan.*1.*2024/i)).toBeInTheDocument();
  });

  it('renders in-progress status', () => {
    render(<VerificationStatus status="in_progress" />);
    
    expect(screen.getByText(/verifying/i)).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('shows contact support link for rejected status', () => {
    render(<VerificationStatus status="rejected" />);
    
    expect(screen.getByRole('link', { name: /contact support/i })).toBeInTheDocument();
  });
});
