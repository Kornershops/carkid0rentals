import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from '../Pagination';

describe('Pagination', () => {
  it('renders pagination controls', () => {
    render(<Pagination total={100} pageSize={10} current={1} />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('displays page numbers', () => {
    render(<Pagination total={100} pageSize={10} current={1} />);
    
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('handles page change', () => {
    const onChange = jest.fn();
    render(<Pagination total={100} pageSize={10} current={1} onChange={onChange} />);
    
    fireEvent.click(screen.getByText('2'));
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it('disables previous button on first page', () => {
    render(<Pagination total={100} pageSize={10} current={1} />);
    
    const prevButton = screen.getByRole('button', { name: /previous/i });
    expect(prevButton).toBeDisabled();
  });

  it('disables next button on last page', () => {
    render(<Pagination total={100} pageSize={10} current={10} />);
    
    const nextButton = screen.getByRole('button', { name: /next/i });
    expect(nextButton).toBeDisabled();
  });

  it('navigates to next page', () => {
    const onChange = jest.fn();
    render(<Pagination total={100} pageSize={10} current={1} onChange={onChange} />);
    
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it('navigates to previous page', () => {
    const onChange = jest.fn();
    render(<Pagination total={100} pageSize={10} current={5} onChange={onChange} />);
    
    fireEvent.click(screen.getByRole('button', { name: /previous/i }));
    expect(onChange).toHaveBeenCalledWith(4);
  });

  it('shows ellipsis for large page counts', () => {
    render(<Pagination total={1000} pageSize={10} current={5} />);
    expect(screen.getByText('...')).toBeInTheDocument();
  });

  it('highlights current page', () => {
    render(<Pagination total={100} pageSize={10} current={3} />);
    
    const currentPage = screen.getByText('3').closest('button');
    expect(currentPage).toHaveClass('active');
  });

  it('displays total count', () => {
    render(<Pagination total={100} pageSize={10} current={1} showTotal />);
    expect(screen.getByText(/100.*items/i)).toBeInTheDocument();
  });

  it('allows page size change', () => {
    const onPageSizeChange = jest.fn();
    render(
      <Pagination 
        total={100} 
        pageSize={10} 
        current={1} 
        pageSizeOptions={[10, 20, 50]}
        onPageSizeChange={onPageSizeChange}
      />
    );
    
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '20' } });
    expect(onPageSizeChange).toHaveBeenCalledWith(20);
  });
});
