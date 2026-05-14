import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ListerOnboarding from '../ListerOnboarding';

describe('ListerOnboarding', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it('renders lister onboarding form', () => {
    render(<ListerOnboarding />);
    
    expect(screen.getByText(/become a lister/i)).toBeInTheDocument();
    expect(screen.getByText(/business information/i)).toBeInTheDocument();
  });

  it('validates business information', async () => {
    render(<ListerOnboarding />);
    
    const submitButton = screen.getByRole('button', { name: /continue/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/business name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/tax id is required/i)).toBeInTheDocument();
    });
  });

  it('handles business type selection', async () => {
    render(<ListerOnboarding />);
    
    const individualRadio = screen.getByLabelText(/individual/i);
    const companyRadio = screen.getByLabelText(/company/i);

    fireEvent.click(companyRadio);
    expect(companyRadio).toBeChecked();

    fireEvent.click(individualRadio);
    expect(individualRadio).toBeChecked();
  });

  it('shows additional fields for company type', async () => {
    render(<ListerOnboarding />);
    
    const companyRadio = screen.getByLabelText(/company/i);
    fireEvent.click(companyRadio);

    await waitFor(() => {
      expect(screen.getByLabelText(/company registration number/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/tax identification number/i)).toBeInTheDocument();
    });
  });

  it('handles bank account information', async () => {
    render(<ListerOnboarding />);
    
    await userEvent.type(screen.getByLabelText(/business name/i), 'Test Business');
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));

    await waitFor(() => {
      expect(screen.getByText(/bank information/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/account number/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/bank name/i)).toBeInTheDocument();
    });
  });

  it('validates account number format', async () => {
    render(<ListerOnboarding />);
    
    await userEvent.type(screen.getByLabelText(/business name/i), 'Test Business');
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));

    await waitFor(async () => {
      const accountInput = screen.getByLabelText(/account number/i);
      await userEvent.type(accountInput, '123');
      fireEvent.blur(accountInput);
    });

    await waitFor(() => {
      expect(screen.getByText(/account number must be 10 digits/i)).toBeInTheDocument();
    });
  });

  it('verifies bank account', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ accountName: 'Test Business Account' })
    });

    render(<ListerOnboarding />);
    
    await userEvent.type(screen.getByLabelText(/business name/i), 'Test Business');
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));

    await waitFor(async () => {
      await userEvent.type(screen.getByLabelText(/account number/i), '1234567890');
      await userEvent.selectOptions(screen.getByLabelText(/bank name/i), 'GTBank');
    });

    await waitFor(() => {
      expect(screen.getByText(/test business account/i)).toBeInTheDocument();
    });
  });

  it('handles document uploads', async () => {
    render(<ListerOnboarding />);
    
    await userEvent.type(screen.getByLabelText(/business name/i), 'Test Business');
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));
    await waitFor(() => fireEvent.click(screen.getByRole('button', { name: /continue/i })));

    await waitFor(() => {
      const fileInput = screen.getByLabelText(/business registration/i);
      const file = new File(['doc'], 'registration.pdf', { type: 'application/pdf' });
      fireEvent.change(fileInput, { target: { files: [file] } });
    });

    await waitFor(() => {
      expect(screen.getByText(/registration.pdf/i)).toBeInTheDocument();
    });
  });

  it('submits complete lister application', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, listerId: 'LST123' })
    });

    render(<ListerOnboarding />);
    
    await userEvent.type(screen.getByLabelText(/business name/i), 'Test Business');
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));
    await waitFor(() => fireEvent.click(screen.getByRole('button', { name: /continue/i })));
    await waitFor(() => fireEvent.click(screen.getByRole('button', { name: /submit application/i })));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/lister/register'),
        expect.objectContaining({ method: 'POST' })
      );
      expect(screen.getByText(/application submitted/i)).toBeInTheDocument();
    });
  });

  it('shows terms and conditions acceptance', () => {
    render(<ListerOnboarding />);
    
    expect(screen.getByLabelText(/i agree to the terms/i)).toBeInTheDocument();
  });

  it('requires terms acceptance before submission', async () => {
    render(<ListerOnboarding />);
    
    await userEvent.type(screen.getByLabelText(/business name/i), 'Test Business');
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));
    await waitFor(() => fireEvent.click(screen.getByRole('button', { name: /continue/i })));

    const submitButton = screen.getByRole('button', { name: /submit application/i });
    
    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });
  });
});
