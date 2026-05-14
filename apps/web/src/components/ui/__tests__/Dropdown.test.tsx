import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Dropdown from '../Dropdown';

const mockItems = [
  { id: '1', label: 'Option 1', value: 'opt1' },
  { id: '2', label: 'Option 2', value: 'opt2' },
  { id: '3', label: 'Option 3', value: 'opt3' }
];

describe('Dropdown', () => {
  it('renders dropdown trigger', () => {
    render(<Dropdown trigger={<button>Open Menu</button>} items={mockItems} />);
    expect(screen.getByRole('button', { name: /open menu/i })).toBeInTheDocument();
  });

  it('opens menu on trigger click', async () => {
    render(<Dropdown trigger={<button>Open</button>} items={mockItems} />);
    
    fireEvent.click(screen.getByRole('button'));
    
    await waitFor(() => {
      expect(screen.getByText(/option 1/i)).toBeInTheDocument();
      expect(screen.getByText(/option 2/i)).toBeInTheDocument();
    });
  });

  it('closes menu on item selection', async () => {
    const onSelect = jest.fn();
    render(<Dropdown trigger={<button>Open</button>} items={mockItems} onSelect={onSelect} />);
    
    fireEvent.click(screen.getByRole('button'));
    await waitFor(() => fireEvent.click(screen.getByText(/option 1/i)));
    
    expect(onSelect).toHaveBeenCalledWith(mockItems[0]);
    await waitFor(() => {
      expect(screen.queryByText(/option 1/i)).not.toBeInTheDocument();
    });
  });

  it('closes menu on outside click', async () => {
    render(<Dropdown trigger={<button>Open</button>} items={mockItems} />);
    
    fireEvent.click(screen.getByRole('button'));
    await waitFor(() => expect(screen.getByText(/option 1/i)).toBeInTheDocument());
    
    fireEvent.click(document.body);
    await waitFor(() => {
      expect(screen.queryByText(/option 1/i)).not.toBeInTheDocument();
    });
  });

  it('supports keyboard navigation', async () => {
    render(<Dropdown trigger={<button>Open</button>} items={mockItems} />);
    
    const trigger = screen.getByRole('button');
    fireEvent.click(trigger);
    
    await waitFor(() => {
      fireEvent.keyDown(trigger, { key: 'ArrowDown' });
      fireEvent.keyDown(trigger, { key: 'Enter' });
    });
  });

  it('renders disabled items', async () => {
    const itemsWithDisabled = [
      ...mockItems,
      { id: '4', label: 'Disabled', value: 'dis', disabled: true }
    ];
    
    render(<Dropdown trigger={<button>Open</button>} items={itemsWithDisabled} />);
    fireEvent.click(screen.getByRole('button'));
    
    await waitFor(() => {
      const disabledItem = screen.getByText(/disabled/i).closest('button');
      expect(disabledItem).toBeDisabled();
    });
  });

  it('renders with icons', async () => {
    const itemsWithIcons = mockItems.map(item => ({
      ...item,
      icon: <span data-testid={`icon-${item.id}`}>🚗</span>
    }));
    
    render(<Dropdown trigger={<button>Open</button>} items={itemsWithIcons} />);
    fireEvent.click(screen.getByRole('button'));
    
    await waitFor(() => {
      expect(screen.getByTestId('icon-1')).toBeInTheDocument();
    });
  });

  it('supports multi-select', async () => {
    const onSelect = jest.fn();
    render(<Dropdown trigger={<button>Open</button>} items={mockItems} multiple onSelect={onSelect} />);
    
    fireEvent.click(screen.getByRole('button'));
    await waitFor(() => {
      fireEvent.click(screen.getByText(/option 1/i));
      fireEvent.click(screen.getByText(/option 2/i));
    });
    
    expect(onSelect).toHaveBeenCalledTimes(2);
  });

  it('shows selected items', async () => {
    render(<Dropdown trigger={<button>Open</button>} items={mockItems} selected={['opt1']} />);
    
    fireEvent.click(screen.getByRole('button'));
    
    await waitFor(() => {
      const selectedItem = screen.getByText(/option 1/i).closest('button');
      expect(selectedItem).toHaveClass('selected');
    });
  });
});
