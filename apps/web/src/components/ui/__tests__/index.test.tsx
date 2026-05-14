import React from 'react';
import { render, screen } from '@testing-library/react';
import * as UIComponents from '../index';

describe('UI Components Index', () => {
  it('exports Button component', () => {
    const { Button } = UIComponents;
    expect(Button).toBeDefined();
    
    render(<Button>Test</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('exports Input component', () => {
    const { Input } = UIComponents;
    expect(Input).toBeDefined();
    
    render(<Input placeholder="Test" />);
    expect(screen.getByPlaceholderText(/test/i)).toBeInTheDocument();
  });

  it('exports Card component', () => {
    const { Card } = UIComponents;
    expect(Card).toBeDefined();
    
    render(<Card>Content</Card>);
    expect(screen.getByText(/content/i)).toBeInTheDocument();
  });

  it('exports Modal component', () => {
    const { Modal } = UIComponents;
    expect(Modal).toBeDefined();
    
    render(<Modal open>Modal</Modal>);
    expect(screen.getByText(/modal/i)).toBeInTheDocument();
  });

  it('exports Dropdown component', () => {
    const { Dropdown } = UIComponents;
    expect(Dropdown).toBeDefined();
  });

  it('exports DatePicker component', () => {
    const { DatePicker } = UIComponents;
    expect(DatePicker).toBeDefined();
    
    render(<DatePicker />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('exports SearchBar component', () => {
    const { SearchBar } = UIComponents;
    expect(SearchBar).toBeDefined();
    
    render(<SearchBar />);
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
  });

  it('exports FilterPanel component', () => {
    const { FilterPanel } = UIComponents;
    expect(FilterPanel).toBeDefined();
  });

  it('exports Pagination component', () => {
    const { Pagination } = UIComponents;
    expect(Pagination).toBeDefined();
    
    render(<Pagination total={100} pageSize={10} current={1} />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('exports LoadingSpinner component', () => {
    const { LoadingSpinner } = UIComponents;
    expect(LoadingSpinner).toBeDefined();
    
    render(<LoadingSpinner />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });
});
