import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import KYCVerification from '../KYCVerification';

describe('KYCVerification', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it('renders KYC verification form', () => {
    render(<KYCVerification />);
    
    expect(screen.getByText(/identity verification/i)).toBeInTheDocument();
    expect(screen.getByText(/kyc/i)).toBeInTheDocument();
  });

  it('validates personal information', async () => {
    render(<KYCVerification />);
    
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/last name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/date of birth is required/i)).toBeInTheDocument();
    });
  });

  it('handles ID type selection', async () => {
    render(<KYCVerification />);
    
    await userEvent.selectOptions(screen.getByLabelText(/id type/i), 'passport');
    expect(screen.getByDisplayValue('passport')).toBeInTheDocument();
  });

  it('shows ID-specific fields', async () => {
    render(<KYCVerification />);
    
    await userEvent.selectOptions(screen.getByLabelText(/id type/i), 'drivers_license');

    await waitFor(() => {
      expect(screen.getByLabelText(/license number/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/expiry date/i)).toBeInTheDocument();
    });
  });

  it('handles document upload', async () => {
    render(<KYCVerification />);
    
    const fileInput = screen.getByLabelText(/upload id document/i);
    const file = new File(['id'], 'passport.jpg', { type: 'image/jpeg' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText(/passport.jpg/i)).toBeInTheDocument();
    });
  });

  it('validates file size', async () => {
    render(<KYCVerification />);
    
    const fileInput = screen.getByLabelText(/upload id document/i);
    const largeFile = new File(['x'.repeat(6000000)], 'large.jpg', { type: 'image/jpeg' });
    fireEvent.change(fileInput, { target: { files: [largeFile] } });

    await waitFor(() => {
      expect(screen.getByText(/file size must be less than 5mb/i)).toBeInTheDocument();
    });
  });

  it('validates file type', async () => {
    render(<KYCVerification />);
    
    const fileInput = screen.getByLabelText(/upload id document/i);
    const invalidFile = new File(['doc'], 'document.txt', { type: 'text/plain' });
    fireEvent.change(fileInput, { target: { files: [invalidFile] } });

    await waitFor(() => {
      expect(screen.getByText(/only images and pdf files are allowed/i)).toBeInTheDocument();
    });
  });

  it('requires selfie upload', () => {
    render(<KYCVerification />);
    
    expect(screen.getByLabelText(/upload selfie/i)).toBeInTheDocument();
  });

  it('submits KYC verification', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, verificationId: 'VER123' })
    });

    render(<KYCVerification />);
    
    await userEvent.type(screen.getByLabelText(/first name/i), 'John');
    await userEvent.type(screen.getByLabelText(/last name/i), 'Doe');
    await userEvent.type(screen.getByLabelText(/date of birth/i), '1990-01-01');
    
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/kyc'),
        expect.objectContaining({ method: 'POST' })
      );
      expect(screen.getByText(/verification submitted/i)).toBeInTheDocument();
    });
  });

  it('shows verification status', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ status: 'pending', submittedAt: '2024-01-01' })
    });

    render(<KYCVerification userId="USR123" />);

    await waitFor(() => {
      expect(screen.getByText(/verification pending/i)).toBeInTheDocument();
    });
  });

  it('handles verification errors', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    render(<KYCVerification />);
    
    await userEvent.type(screen.getByLabelText(/first name/i), 'John');
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText(/verification failed/i)).toBeInTheDocument();
    });
  });
});
