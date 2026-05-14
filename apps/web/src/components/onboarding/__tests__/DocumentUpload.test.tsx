import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DocumentUpload from '../DocumentUpload';

describe('DocumentUpload', () => {
  it('renders upload interface', () => {
    render(<DocumentUpload label="Upload Document" />);
    
    expect(screen.getByText(/upload document/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/upload document/i)).toBeInTheDocument();
  });

  it('handles file selection', async () => {
    render(<DocumentUpload label="Upload Document" />);
    
    const fileInput = screen.getByLabelText(/upload document/i);
    const file = new File(['content'], 'document.pdf', { type: 'application/pdf' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText(/document.pdf/i)).toBeInTheDocument();
    });
  });

  it('validates file type', async () => {
    render(<DocumentUpload label="Upload Document" accept=".pdf,.jpg" />);
    
    const fileInput = screen.getByLabelText(/upload document/i);
    const file = new File(['content'], 'document.txt', { type: 'text/plain' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText(/invalid file type/i)).toBeInTheDocument();
    });
  });

  it('validates file size', async () => {
    render(<DocumentUpload label="Upload Document" maxSize={1000000} />);
    
    const fileInput = screen.getByLabelText(/upload document/i);
    const largeFile = new File(['x'.repeat(2000000)], 'large.pdf', { type: 'application/pdf' });
    fireEvent.change(fileInput, { target: { files: [largeFile] } });

    await waitFor(() => {
      expect(screen.getByText(/file too large/i)).toBeInTheDocument();
    });
  });

  it('shows file preview for images', async () => {
    render(<DocumentUpload label="Upload Image" />);
    
    const fileInput = screen.getByLabelText(/upload image/i);
    const file = new File(['img'], 'photo.jpg', { type: 'image/jpeg' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByAltText(/preview/i)).toBeInTheDocument();
    });
  });

  it('allows file removal', async () => {
    render(<DocumentUpload label="Upload Document" />);
    
    const fileInput = screen.getByLabelText(/upload document/i);
    const file = new File(['content'], 'document.pdf', { type: 'application/pdf' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      const removeButton = screen.getByRole('button', { name: /remove/i });
      fireEvent.click(removeButton);
    });

    expect(screen.queryByText(/document.pdf/i)).not.toBeInTheDocument();
  });

  it('shows upload progress', async () => {
    render(<DocumentUpload label="Upload Document" showProgress />);
    
    const fileInput = screen.getByLabelText(/upload document/i);
    const file = new File(['content'], 'document.pdf', { type: 'application/pdf' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
  });

  it('handles multiple file uploads', async () => {
    render(<DocumentUpload label="Upload Documents" multiple />);
    
    const fileInput = screen.getByLabelText(/upload documents/i);
    const files = [
      new File(['1'], 'doc1.pdf', { type: 'application/pdf' }),
      new File(['2'], 'doc2.pdf', { type: 'application/pdf' })
    ];
    fireEvent.change(fileInput, { target: { files } });

    await waitFor(() => {
      expect(screen.getByText(/doc1.pdf/i)).toBeInTheDocument();
      expect(screen.getByText(/doc2.pdf/i)).toBeInTheDocument();
    });
  });

  it('calls onChange callback', async () => {
    const onChange = jest.fn();
    render(<DocumentUpload label="Upload Document" onChange={onChange} />);
    
    const fileInput = screen.getByLabelText(/upload document/i);
    const file = new File(['content'], 'document.pdf', { type: 'application/pdf' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(expect.any(File));
    });
  });

  it('shows drag and drop zone', () => {
    render(<DocumentUpload label="Upload Document" dragDrop />);
    
    expect(screen.getByText(/drag.*drop/i)).toBeInTheDocument();
  });
});
