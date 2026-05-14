import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CompanyOnboarding from '../CompanyOnboarding';

describe('CompanyOnboarding', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it('renders company onboarding form', () => {
    render(<CompanyOnboarding />);
    
    expect(screen.getByText(/company registration/i)).toBeInTheDocument();
    expect(screen.getByText(/fleet management/i)).toBeInTheDocument();
  });

  it('validates company information', async () => {
    render(<CompanyOnboarding />);
    
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));

    await waitFor(() => {
      expect(screen.getByText(/company name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/registration number is required/i)).toBeInTheDocument();
    });
  });

  it('handles fleet size selection', async () => {
    render(<CompanyOnboarding />);
    
    await userEvent.selectOptions(screen.getByLabelText(/fleet size/i), '10-50');
    expect(screen.getByDisplayValue('10-50')).toBeInTheDocument();
  });

  it('shows insurance verification step', async () => {
    render(<CompanyOnboarding />);
    
    await userEvent.type(screen.getByLabelText(/company name/i), 'Test Fleet Co');
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));

    await waitFor(() => {
      expect(screen.getByText(/insurance information/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/policy number/i)).toBeInTheDocument();
    });
  });

  it('handles insurance document upload', async () => {
    render(<CompanyOnboarding />);
    
    await userEvent.type(screen.getByLabelText(/company name/i), 'Test Fleet Co');
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));

    await waitFor(() => {
      const fileInput = screen.getByLabelText(/insurance certificate/i);
      const file = new File(['cert'], 'insurance.pdf', { type: 'application/pdf' });
      fireEvent.change(fileInput, { target: { files: [file] } });
    });

    await waitFor(() => {
      expect(screen.getByText(/insurance.pdf/i)).toBeInTheDocument();
    });
  });

  it('allows adding multiple vehicles', async () => {
    render(<CompanyOnboarding />);
    
    await userEvent.type(screen.getByLabelText(/company name/i), 'Test Fleet Co');
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));
    await waitFor(() => fireEvent.click(screen.getByRole('button', { name: /continue/i })));

    await waitFor(() => {
      const addButton = screen.getByRole('button', { name: /add vehicle/i });
      fireEvent.click(addButton);
    });

    expect(screen.getAllByText(/vehicle/i).length).toBeGreaterThan(1);
  });

  it('validates vehicle information', async () => {
    render(<CompanyOnboarding />);
    
    await userEvent.type(screen.getByLabelText(/company name/i), 'Test Fleet Co');
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));
    await waitFor(() => fireEvent.click(screen.getByRole('button', { name: /continue/i })));

    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    });

    await waitFor(() => {
      expect(screen.getByText(/vehicle make is required/i)).toBeInTheDocument();
    });
  });

  it('submits complete company registration', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, companyId: 'CMP123' })
    });

    render(<CompanyOnboarding />);
    
    await userEvent.type(screen.getByLabelText(/company name/i), 'Test Fleet Co');
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));
    await waitFor(() => fireEvent.click(screen.getByRole('button', { name: /continue/i })));
    await waitFor(() => fireEvent.click(screen.getByRole('button', { name: /submit/i })));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/company/register'),
        expect.objectContaining({ method: 'POST' })
      );
    });
  });

  it('handles API errors', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    render(<CompanyOnboarding />);
    
    await userEvent.type(screen.getByLabelText(/company name/i), 'Test Fleet Co');
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));
    await waitFor(() => fireEvent.click(screen.getByRole('button', { name: /submit/i })));

    await waitFor(() => {
      expect(screen.getByText(/registration failed/i)).toBeInTheDocument();
    });
  });
});
