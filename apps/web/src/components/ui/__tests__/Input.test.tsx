import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Input from '../Input';

describe('Input', () => {
  it('renders input field', () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText(/enter text/i)).toBeInTheDocument();
  });

  it('handles text input', async () => {
    render(<Input />);
    const input = screen.getByRole('textbox');
    
    await userEvent.type(input, 'Hello World');
    expect(input).toHaveValue('Hello World');
  });

  it('calls onChange callback', async () => {
    const onChange = jest.fn();
    render(<Input onChange={onChange} />);
    
    await userEvent.type(screen.getByRole('textbox'), 'test');
    expect(onChange).toHaveBeenCalled();
  });

  it('renders with label', () => {
    render(<Input label="Username" />);
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
  });

  it('shows error message', () => {
    render(<Input error="This field is required" />);
    expect(screen.getByText(/this field is required/i)).toBeInTheDocument();
  });

  it('applies error styling', () => {
    render(<Input error="Error" />);
    expect(screen.getByRole('textbox')).toHaveClass('error');
  });

  it('renders disabled state', () => {
    render(<Input disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('renders different input types', () => {
    const { rerender } = render(<Input type="email" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');
    
    rerender(<Input type="password" />);
    expect(screen.getByLabelText(/password/i) || screen.getByRole('textbox')).toHaveAttribute('type', 'password');
  });

  it('shows character count', () => {
    render(<Input maxLength={50} showCount value="Hello" />);
    expect(screen.getByText(/5.*50/)).toBeInTheDocument();
  });

  it('renders with prefix and suffix', () => {
    render(<Input prefix="$" suffix=".00" />);
    expect(screen.getByText('$')).toBeInTheDocument();
    expect(screen.getByText('.00')).toBeInTheDocument();
  });
});
