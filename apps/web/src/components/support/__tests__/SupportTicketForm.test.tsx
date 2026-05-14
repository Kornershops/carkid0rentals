import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SupportTicketForm from '../SupportTicketForm'

describe('SupportTicketForm', () => {
  it('renders support ticket form', () => {
    render(<SupportTicketForm onSuccess={jest.fn()} />)
    
    expect(screen.getByText(/create support ticket/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/subject/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/priority/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument()
  })

  it('displays ticket categories', () => {
    render(<SupportTicketForm onSuccess={jest.fn()} />)
    
    const categorySelect = screen.getByLabelText(/category/i)
    
    expect(screen.getByRole('option', { name: /booking issue/i })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: /payment issue/i })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: /vehicle issue/i })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: /account issue/i })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: /technical issue/i })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: /other/i })).toBeInTheDocument()
  })

  it('displays priority levels', () => {
    render(<SupportTicketForm onSuccess={jest.fn()} />)
    
    expect(screen.getByRole('option', { name: /low/i })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: /medium/i })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: /high/i })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: /urgent/i })).toBeInTheDocument()
  })

  it('validates required fields', async () => {
    const user = userEvent.setup()
    render(<SupportTicketForm onSuccess={jest.fn()} />)
    
    const submitButton = screen.getByRole('button', { name: /submit ticket/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/subject is required/i)).toBeInTheDocument()
      expect(screen.getByText(/category is required/i)).toBeInTheDocument()
      expect(screen.getByText(/description is required/i)).toBeInTheDocument()
    })
  })

  it('validates minimum description length', async () => {
    const user = userEvent.setup()
    render(<SupportTicketForm onSuccess={jest.fn()} />)
    
    const descriptionInput = screen.getByLabelText(/description/i)
    await user.type(descriptionInput, 'Short')
    
    fireEvent.blur(descriptionInput)
    
    await waitFor(() => {
      expect(screen.getByText(/description must be at least 20 characters/i)).toBeInTheDocument()
    })
  })

  it('allows file attachments', async () => {
    const user = userEvent.setup()
    const file = new File(['screenshot'], 'screenshot.png', { type: 'image/png' })
    
    render(<SupportTicketForm onSuccess={jest.fn()} />)
    
    const fileInput = screen.getByLabelText(/attach files/i)
    await user.upload(fileInput, file)
    
    expect(screen.getByText('screenshot.png')).toBeInTheDocument()
  })

  it('validates attachment file size (max 10MB)', async () => {
    const user = userEvent.setup()
    const largeFile = new File(['x'.repeat(11 * 1024 * 1024)], 'large.png', { 
      type: 'image/png' 
    })
    
    render(<SupportTicketForm onSuccess={jest.fn()} />)
    
    const fileInput = screen.getByLabelText(/attach files/i)
    await user.upload(fileInput, largeFile)
    
    await waitFor(() => {
      expect(screen.getByText(/file size must be less than 10mb/i)).toBeInTheDocument()
    })
  })

  it('auto-saves draft every 30 seconds', async () => {
    jest.useFakeTimers()
    const user = userEvent.setup({ delay: null })
    
    render(<SupportTicketForm onSuccess={jest.fn()} />)
    
    await user.type(screen.getByLabelText(/subject/i), 'Test subject')
    await user.type(screen.getByLabelText(/description/i), 'Test description that is long enough')
    
    // Fast-forward 30 seconds
    jest.advanceTimersByTime(30000)
    
    await waitFor(() => {
      expect(screen.getByText(/draft saved/i)).toBeInTheDocument()
    })
    
    jest.useRealTimers()
  })

  it('loads draft from localStorage', () => {
    const draft = {
      subject: 'Saved subject',
      category: 'booking_issue',
      priority: 'high',
      description: 'Saved description',
    }
    
    localStorage.getItem = jest.fn(() => JSON.stringify(draft))
    
    render(<SupportTicketForm onSuccess={jest.fn()} />)
    
    expect(screen.getByLabelText(/subject/i)).toHaveValue('Saved subject')
    expect(screen.getByLabelText(/category/i)).toHaveValue('booking_issue')
    expect(screen.getByLabelText(/priority/i)).toHaveValue('high')
    expect(screen.getByLabelText(/description/i)).toHaveValue('Saved description')
  })

  it('suggests related articles based on subject', async () => {
    const user = userEvent.setup()
    
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          articles: [
            { id: '1', title: 'How to cancel a booking' },
            { id: '2', title: 'Refund policy' },
          ],
        }),
      })
    )
    
    render(<SupportTicketForm onSuccess={jest.fn()} />)
    
    await user.type(screen.getByLabelText(/subject/i), 'Cancel booking')
    
    await waitFor(() => {
      expect(screen.getByText(/related articles/i)).toBeInTheDocument()
      expect(screen.getByText('How to cancel a booking')).toBeInTheDocument()
      expect(screen.getByText('Refund policy')).toBeInTheDocument()
    })
  })

  it('submits ticket successfully', async () => {
    const onSuccess = jest.fn()
    const user = userEvent.setup()
    
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ 
          ticketId: 'TKT-123',
          estimatedResponse: '2 hours',
        }),
      })
    )
    
    render(<SupportTicketForm onSuccess={onSuccess} />)
    
    await user.type(screen.getByLabelText(/subject/i), 'Payment not processed')
    await user.selectOptions(screen.getByLabelText(/category/i), 'payment_issue')
    await user.selectOptions(screen.getByLabelText(/priority/i), 'high')
    await user.type(screen.getByLabelText(/description/i), 'My payment was deducted but booking not confirmed')
    
    const submitButton = screen.getByRole('button', { name: /submit ticket/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith({
        ticketId: 'TKT-123',
        estimatedResponse: '2 hours',
      })
    })
  })

  it('clears draft after successful submission', async () => {
    const user = userEvent.setup()
    
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ ticketId: 'TKT-123' }),
      })
    )
    
    localStorage.removeItem = jest.fn()
    
    render(<SupportTicketForm onSuccess={jest.fn()} />)
    
    await user.type(screen.getByLabelText(/subject/i), 'Test')
    await user.selectOptions(screen.getByLabelText(/category/i), 'other')
    await user.type(screen.getByLabelText(/description/i), 'Test description that is long enough')
    
    const submitButton = screen.getByRole('button', { name: /submit ticket/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(localStorage.removeItem).toHaveBeenCalledWith('ticket_draft')
    })
  })

  it('shows character count for description', async () => {
    const user = userEvent.setup()
    render(<SupportTicketForm onSuccess={jest.fn()} />)
    
    const descriptionInput = screen.getByLabelText(/description/i)
    await user.type(descriptionInput, 'Test description')
    
    expect(screen.getByText(/16 \/ 1000/i)).toBeInTheDocument()
  })

  it('displays error on submission failure', async () => {
    const user = userEvent.setup()
    
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: 'Server error' }),
      })
    )
    
    render(<SupportTicketForm onSuccess={jest.fn()} />)
    
    await user.type(screen.getByLabelText(/subject/i), 'Test')
    await user.selectOptions(screen.getByLabelText(/category/i), 'other')
    await user.type(screen.getByLabelText(/description/i), 'Test description that is long enough')
    
    const submitButton = screen.getByRole('button', { name: /submit ticket/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/server error/i)).toBeInTheDocument()
    })
  })
})
