import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Card from '../Card';

describe('Card', () => {
  it('renders card with content', () => {
    render(<Card>Card Content</Card>);
    expect(screen.getByText(/card content/i)).toBeInTheDocument();
  });

  it('renders card with title', () => {
    render(<Card title="Card Title">Content</Card>);
    expect(screen.getByText(/card title/i)).toBeInTheDocument();
  });

  it('renders card with header and footer', () => {
    render(
      <Card header={<div>Header</div>} footer={<div>Footer</div>}>
        Body
      </Card>
    );
    
    expect(screen.getByText(/header/i)).toBeInTheDocument();
    expect(screen.getByText(/body/i)).toBeInTheDocument();
    expect(screen.getByText(/footer/i)).toBeInTheDocument();
  });

  it('applies hover effect', () => {
    render(<Card hoverable>Hoverable Card</Card>);
    expect(screen.getByText(/hoverable card/i).closest('div')).toHaveClass('hoverable');
  });

  it('handles click events', () => {
    const onClick = jest.fn();
    render(<Card onClick={onClick}>Clickable</Card>);
    
    fireEvent.click(screen.getByText(/clickable/i).closest('div')!);
    expect(onClick).toHaveBeenCalled();
  });

  it('renders bordered variant', () => {
    render(<Card bordered>Bordered</Card>);
    expect(screen.getByText(/bordered/i).closest('div')).toHaveClass('border');
  });

  it('renders with custom padding', () => {
    render(<Card padding="lg">Large Padding</Card>);
    expect(screen.getByText(/large padding/i).closest('div')).toHaveClass('p-lg');
  });

  it('renders loading state', () => {
    render(<Card loading>Content</Card>);
    expect(screen.getByTestId('card-skeleton')).toBeInTheDocument();
  });
});
