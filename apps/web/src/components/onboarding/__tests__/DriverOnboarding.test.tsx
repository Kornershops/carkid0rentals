import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DriverOnboarding from '../DriverOnboarding';

describe('DriverOnboarding', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it('renders multi-step onboarding wizard', () => {
    render(<DriverOnboarding />);
    
    expect(screen.getByText(/driver onboarding/i)).toBeInTheDocument();
    expect(screen.getByText(/step 1/i)).toBeInTheDocument();
    expect(screen.getByText(/personal information/i)).toBeInTheDocument();
  });

  it('validates personal information step', async () => {
    render(<DriverOnboarding />);
    
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText(/full name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/phone number is required/i)).toBeInTheDocument();
    });
  });

  it('progresses through steps with valid data', async () => {
    render(<DriverOnboarding />);
    
    await userEvent.type(screen.getByLabelText(/full name/i), 'John Doe');
    await userEvent.type(screen.getByLabelText(/phone/i), '08012345678');
    await userEvent.type(screen.getByLabelText(/address/i), '123 Main St');

    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    await waitFor(() => {
      expect(screen.getByText(/step 2/i)).toBeInTheDocument();
      expect(screen.getByText(/license information/i)).toBeInTheDocument();
    });
  });

  it('handles license upload', async () => {
    render(<DriverOnboarding />);
    
    // Navigate to license step
    await userEvent.type(screen.getByLabelText(/full name/i), 'John Doe');
    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    await waitFor(() => {
      const fileInput = screen.getByLabelText(/upload license/i);
      const file = new File(['license'], 'license.jpg', { type: 'image/jpeg' });
      fireEvent.change(fileInput, { target: { files: [file] } });
    });

    await waitFor(() => {
      expect(screen.getByText(/license.jpg/i)).toBeInTheDocument();
    });
  });

  it('validates license number format', async () => {
    render(<DriverOnboarding />);
    
    // Navigate to license step
    await userEvent.type(screen.getByLabelText(/full name/i), 'John Doe');
    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    await waitFor(async () => {
      const licenseInput = screen.getByLabelText(/license number/i);
      await userEvent.type(licenseInput, 'INVALID');
      fireEvent.blur(licenseInput);
    });

    await waitFor(() => {
      expect(screen.getByText(/invalid license number format/i)).toBeInTheDocument();
    });
  });

  it('handles vehicle preferences step', async () => {
    render(<DriverOnboarding />);
    
    // Navigate to vehicle preferences
    await userEvent.type(screen.getByLabelText(/full name/i), 'John Doe');
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    
    await waitFor(() => fireEvent.click(screen.getByRole('button', { name: /next/i })));

    await waitFor(() => {
      expect(screen.getByText(/vehicle preferences/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/sedan/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/suv/i)).toBeInTheDocument();
    });
  });

  it('submits complete onboarding', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, driverId: 'DRV123' })
    });

    render(<DriverOnboarding />);
    
    // Fill all steps
    await userEvent.type(screen.getByLabelText(/full name/i), 'John Doe');
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    
    await waitFor(() => fireEvent.click(screen.getByRole('button', { name: /next/i })));
    await waitFor(() => fireEvent.click(screen.getByRole('button', { name: /submit/i })));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/drivers/onboard'),
        expect.objectContaining({ method: 'POST' })
      );
      expect(screen.getByText(/onboarding complete/i)).toBeInTheDocument();
    });
  });

  it('allows going back to previous steps', async () => {
    render(<DriverOnboarding />);
    
    await userEvent.type(screen.getByLabelText(/full name/i), 'John Doe');
    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    await waitFor(() => {
      const backButton = screen.getByRole('button', { name: /back/i });
      fireEvent.click(backButton);
    });

    expect(screen.getByText(/step 1/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
  });

  it('shows progress indicator', () => {
    render(<DriverOnboarding />);
    
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.getByText(/33%/i)).toBeInTheDocument();
  });

  it('handles API errors during submission', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    render(<DriverOnboarding />);
    
    await userEvent.type(screen.getByLabelText(/full name/i), 'John Doe');
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    await waitFor(() => fireEvent.click(screen.getByRole('button', { name: /next/i })));
    await waitFor(() => fireEvent.click(screen.getByRole('button', { name: /submit/i })));

    await waitFor(() => {
      expect(screen.getByText(/onboarding failed/i)).toBeInTheDocument();
    });
  });
});
