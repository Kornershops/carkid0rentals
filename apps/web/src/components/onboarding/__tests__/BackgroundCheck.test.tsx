import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BackgroundCheck from '../BackgroundCheck';

describe('BackgroundCheck', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it('renders background check consent form', () => {
    render(<BackgroundCheck />);
    
    expect(screen.getByText(/background check/i)).toBeInTheDocument();
    expect(screen.getByText(/consent/i)).toBeInTheDocument();
  });

  it('requires consent checkbox', async () => {
    render(<BackgroundCheck />);
    
    fireEvent.click(screen.getByRole('button', { name: /authorize/i }));

    await waitFor(() => {
      expect(screen.getByText(/consent is required/i)).toBeInTheDocument();
    });
  });

  it('shows consent details', () => {
    render(<BackgroundCheck />);
    
    expect(screen.getByText(/criminal record/i)).toBeInTheDocument();
    expect(screen.getByText(/driving history/i)).toBeInTheDocument();
  });

  it('submits background check authorization', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, checkId: 'CHK123' })
    });

    render(<BackgroundCheck />);
    
    const consentCheckbox = screen.getByLabelText(/i consent/i);
    fireEvent.click(consentCheckbox);
    
    fireEvent.click(screen.getByRole('button', { name: /authorize/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/background-check'),
        expect.objectContaining({ method: 'POST' })
      );
    });
  });

  it('shows check status', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ status: 'in_progress', startedAt: '2024-01-01' })
    });

    render(<BackgroundCheck userId="USR123" />);

    await waitFor(() => {
      expect(screen.getByText(/in progress/i)).toBeInTheDocument();
    });
  });

  it('displays completed check results', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ 
        status: 'completed', 
        result: 'clear',
        completedAt: '2024-01-02'
      })
    });

    render(<BackgroundCheck userId="USR123" />);

    await waitFor(() => {
      expect(screen.getByText(/clear/i)).toBeInTheDocument();
      expect(screen.getByTestId('check-icon')).toBeInTheDocument();
    });
  });

  it('shows failed check results', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ 
        status: 'completed', 
        result: 'flagged',
        reason: 'Pending violations'
      })
    });

    render(<BackgroundCheck userId="USR123" />);

    await waitFor(() => {
      expect(screen.getByText(/flagged/i)).toBeInTheDocument();
      expect(screen.getByText(/pending violations/i)).toBeInTheDocument();
    });
  });

  it('allows dispute submission', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ status: 'completed', result: 'flagged' })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      });

    render(<BackgroundCheck userId="USR123" />);

    await waitFor(() => {
      const disputeButton = screen.getByRole('button', { name: /dispute/i });
      fireEvent.click(disputeButton);
    });

    await waitFor(async () => {
      await userEvent.type(screen.getByLabelText(/reason/i), 'Error in report');
      fireEvent.click(screen.getByRole('button', { name: /submit dispute/i }));
    });

    await waitFor(() => {
      expect(screen.getByText(/dispute submitted/i)).toBeInTheDocument();
    });
  });

  it('handles API errors', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    render(<BackgroundCheck />);
    
    const consentCheckbox = screen.getByLabelText(/i consent/i);
    fireEvent.click(consentCheckbox);
    fireEvent.click(screen.getByRole('button', { name: /authorize/i }));

    await waitFor(() => {
      expect(screen.getByText(/failed to submit/i)).toBeInTheDocument();
    });
  });
});
