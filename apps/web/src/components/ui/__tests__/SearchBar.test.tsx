import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from '../SearchBar';

describe('SearchBar', () => {
  it('renders search input', () => {
    render(<SearchBar placeholder="Search vehicles" />);
    expect(screen.getByPlaceholderText(/search vehicles/i)).toBeInTheDocument();
  });

  it('handles text input', async () => {
    render(<SearchBar />);
    const input = screen.getByRole('searchbox');
    
    await userEvent.type(input, 'Tesla');
    expect(input).toHaveValue('Tesla');
  });

  it('calls onSearch on enter key', async () => {
    const onSearch = jest.fn();
    render(<SearchBar onSearch={onSearch} />);
    
    const input = screen.getByRole('searchbox');
    await userEvent.type(input, 'Tesla{enter}');
    
    expect(onSearch).toHaveBeenCalledWith('Tesla');
  });

  it('calls onSearch on search button click', async () => {
    const onSearch = jest.fn();
    render(<SearchBar onSearch={onSearch} />);
    
    await userEvent.type(screen.getByRole('searchbox'), 'BMW');
    fireEvent.click(screen.getByRole('button', { name: /search/i }));
    
    expect(onSearch).toHaveBeenCalledWith('BMW');
  });

  it('shows suggestions on input', async () => {
    const suggestions = ['Tesla Model 3', 'Tesla Model Y', 'Tesla Model S'];
    render(<SearchBar suggestions={suggestions} />);
    
    await userEvent.type(screen.getByRole('searchbox'), 'Tesla');
    
    await waitFor(() => {
      expect(screen.getByText(/model 3/i)).toBeInTheDocument();
      expect(screen.getByText(/model y/i)).toBeInTheDocument();
    });
  });

  it('selects suggestion on click', async () => {
    const onSearch = jest.fn();
    const suggestions = ['Tesla Model 3', 'Tesla Model Y'];
    render(<SearchBar suggestions={suggestions} onSearch={onSearch} />);
    
    await userEvent.type(screen.getByRole('searchbox'), 'Tesla');
    await waitFor(() => fireEvent.click(screen.getByText(/model 3/i)));
    
    expect(onSearch).toHaveBeenCalledWith('Tesla Model 3');
  });

  it('clears input on clear button click', async () => {
    render(<SearchBar />);
    
    const input = screen.getByRole('searchbox');
    await userEvent.type(input, 'Search text');
    
    const clearButton = screen.getByRole('button', { name: /clear/i });
    fireEvent.click(clearButton);
    
    expect(input).toHaveValue('');
  });

  it('shows loading state', () => {
    render(<SearchBar loading />);
    expect(screen.getByTestId('search-spinner')).toBeInTheDocument();
  });

  it('debounces onChange callback', async () => {
    jest.useFakeTimers();
    const onChange = jest.fn();
    render(<SearchBar onChange={onChange} debounce={300} />);
    
    await userEvent.type(screen.getByRole('searchbox'), 'Test');
    
    jest.advanceTimersByTime(300);
    expect(onChange).toHaveBeenCalled();
    
    jest.useRealTimers();
  });

  it('renders with search icon', () => {
    render(<SearchBar />);
    expect(screen.getByTestId('search-icon')).toBeInTheDocument();
  });
});
