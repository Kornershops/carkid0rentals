import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Modal from '../Modal';

describe('Modal', () => {
  it('renders modal when open', () => {
    render(<Modal open>Modal Content</Modal>);
    expect(screen.getByText(/modal content/i)).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<Modal open={false}>Modal Content</Modal>);
    expect(screen.queryByText(/modal content/i)).not.toBeInTheDocument();
  });

  it('renders modal with title', () => {
    render(<Modal open title="Modal Title">Content</Modal>);
    expect(screen.getByText(/modal title/i)).toBeInTheDocument();
  });

  it('calls onClose when close button clicked', () => {
    const onClose = jest.fn();
    render(<Modal open onClose={onClose}>Content</Modal>);
    
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    expect(onClose).toHaveBeenCalled();
  });

  it('closes on overlay click', () => {
    const onClose = jest.fn();
    render(<Modal open onClose={onClose}>Content</Modal>);
    
    const overlay = screen.getByTestId('modal-overlay');
    fireEvent.click(overlay);
    expect(onClose).toHaveBeenCalled();
  });

  it('does not close on content click', () => {
    const onClose = jest.fn();
    render(<Modal open onClose={onClose}>Content</Modal>);
    
    fireEvent.click(screen.getByText(/content/i));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('renders footer with actions', () => {
    render(
      <Modal open footer={<button>Action</button>}>
        Content
      </Modal>
    );
    expect(screen.getByRole('button', { name: /action/i })).toBeInTheDocument();
  });

  it('renders different sizes', () => {
    const { rerender } = render(<Modal open size="sm">Small</Modal>);
    expect(screen.getByText(/small/i).closest('.modal')).toHaveClass('modal-sm');
    
    rerender(<Modal open size="lg">Large</Modal>);
    expect(screen.getByText(/large/i).closest('.modal')).toHaveClass('modal-lg');
  });

  it('prevents body scroll when open', () => {
    render(<Modal open>Content</Modal>);
    expect(document.body).toHaveStyle({ overflow: 'hidden' });
  });

  it('closes on escape key', () => {
    const onClose = jest.fn();
    render(<Modal open onClose={onClose}>Content</Modal>);
    
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });
});
