import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DatePicker from '../DatePicker';

describe('DatePicker', () => {
  it('renders date picker input', () => {
    render(<DatePicker placeholder="Select date" />);
    expect(screen.getByPlaceholderText(/select date/i)).toBeInTheDocument();
  });

  it('opens calendar on input click', async () => {
    render(<DatePicker />);
    
    fireEvent.click(screen.getByRole('textbox'));
    
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it('selects a date', async () => {
    const onChange = jest.fn();
    render(<DatePicker onChange={onChange} />);
    
    fireEvent.click(screen.getByRole('textbox'));
    
    await waitFor(() => {
      const dateButton = screen.getByText('15');
      fireEvent.click(dateButton);
    });
    
    expect(onChange).toHaveBeenCalled();
  });

  it('displays selected date', async () => {
    render(<DatePicker value="2024-02-15" />);
    expect(screen.getByDisplayValue(/feb.*15.*2024/i)).toBeInTheDocument();
  });

  it('navigates between months', async () => {
    render(<DatePicker />);
    
    fireEvent.click(screen.getByRole('textbox'));
    
    await waitFor(() => {
      const nextButton = screen.getByRole('button', { name: /next month/i });
      fireEvent.click(nextButton);
    });
    
    await waitFor(() => {
      expect(screen.getByText(/march|apr|may/i)).toBeInTheDocument();
    });
  });

  it('disables past dates', async () => {
    render(<DatePicker disablePast />);
    
    fireEvent.click(screen.getByRole('textbox'));
    
    await waitFor(() => {
      const pastDates = screen.getAllByRole('button').filter(btn => 
        btn.hasAttribute('disabled') && /^\d+$/.test(btn.textContent || '')
      );
      expect(pastDates.length).toBeGreaterThan(0);
    });
  });

  it('supports date range selection', async () => {
    const onChange = jest.fn();
    render(<DatePicker range onChange={onChange} />);
    
    fireEvent.click(screen.getByRole('textbox'));
    
    await waitFor(() => {
      fireEvent.click(screen.getByText('10'));
      fireEvent.click(screen.getByText('15'));
    });
    
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({
      start: expect.any(String),
      end: expect.any(String)
    }));
  });

  it('validates min and max dates', async () => {
    render(<DatePicker minDate="2024-02-01" maxDate="2024-02-28" />);
    
    fireEvent.click(screen.getByRole('textbox'));
    
    await waitFor(() => {
      const disabledDates = screen.getAllByRole('button', { disabled: true });
      expect(disabledDates.length).toBeGreaterThan(0);
    });
  });

  it('closes on outside click', async () => {
    render(<DatePicker />);
    
    fireEvent.click(screen.getByRole('textbox'));
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());
    
    fireEvent.click(document.body);
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('formats date according to locale', () => {
    render(<DatePicker value="2024-02-15" format="DD/MM/YYYY" />);
    expect(screen.getByDisplayValue('15/02/2024')).toBeInTheDocument();
  });
});
