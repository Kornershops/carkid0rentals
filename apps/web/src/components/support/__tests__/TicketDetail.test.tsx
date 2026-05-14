import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TicketDetail from '../TicketDetail'

const mockTicket = {
  id: 'TKT-001',
  subject: 'Payment not processed',
  category: 'payment_issue',
  priority: 'high',
  status: 'open',
  description: 'My payment was deducted but booking not confirmed',
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-15T12:00:00Z',
  messages: [
    {
      id: '1',
      content: 'My payment was deducted but booking not confirmed',
      sender: 'user',
      senderName: 'John Doe',
      createdAt: '2024-01-15T10:00:00Z',
      attachments: [],
    },
    {
      id: '2',
      content: 'We are investigating this issue. Can you provide the transaction ID?',
      sender: 'agent',
      senderName: 'Support Agent',
      createdAt: '2024-01-15T11:00:00Z',
      attachments: [],
    },
  ],
}

describe('TicketDetail', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ ticket: mockTicket }),
      })
    )
  })

  it('renders ticket details', async () => {
    render(<TicketDetail ticketId="TKT-001" />)
    
    await waitFor(() => {
      expect(screen.getByText('TKT-001')).toBeInTheDocument()
      expect(screen.getByText('Payment not processed')).toBeInTheDocument()
      expect(screen.getByText(/payment was deducted/i)).toBeInTheDocument()
    })
  })

  it('displays ticket status badge', async () => {
    render(<TicketDetail ticketId="TKT-001" />)
    
    await waitFor(() => {
      expect(screen.getByText('Open')).toBeInTheDocument()
    })
  })

  it('displays priority indicator', async () => {
    render(<TicketDetail ticketId="TKT-001" />)
    
    await waitFor(() => {
      expect(screen.getByText('High')).toBeInTheDocument()
    })
  })

  it('shows message thread', async () => {
    render(<TicketDetail ticketId="TKT-001" />)
    
    await waitFor(() => {
      expect(screen.getByText(/payment was deducted/i)).toBeInTheDocument()
      expect(screen.getByText(/investigating this issue/i)).toBeInTheDocument()
    })
  })

  it('distinguishes user and agent messages', async () => {
    render(<TicketDetail ticketId="TKT-001" />)
    
    await waitFor(() => {
      const userMessage = screen.getByText(/payment was deducted/i).closest('.message')
      const agentMessage = screen.getByText(/investigating/i).closest('.message')
      
      expect(userMessage).toHaveClass('user-message')
      expect(agentMessage).toHaveClass('agent-message')
    })
  })

  it('sends reply message', async () => {
    const user = userEvent.setup()
    
    global.fetch = jest.fn()
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ ticket: mockTicket }),
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ 
            message: {
              id: '3',
              content: 'Transaction ID is TXN123456',
              sender: 'user',
            },
          }),
        })
      )
    
    render(<TicketDetail ticketId="TKT-001" />)
    
    await waitFor(() => {
      expect(screen.getByText('TKT-001')).toBeInTheDocument()
    })
    
    const replyInput = screen.getByPlaceholderText(/type your message/i)
    await user.type(replyInput, 'Transaction ID is TXN123456')
    
    const sendButton = screen.getByRole('button', { name: /send/i })
    await user.click(sendButton)
    
    await waitFor(() => {
      expect(screen.getByText('Transaction ID is TXN123456')).toBeInTheDocument()
    })
  })

  it('attaches files to reply', async () => {
    const user = userEvent.setup()
    const file = new File(['receipt'], 'receipt.pdf', { type: 'application/pdf' })
    
    render(<TicketDetail ticketId="TKT-001" />)
    
    await waitFor(() => {
      expect(screen.getByText('TKT-001')).toBeInTheDocument()
    })
    
    const fileInput = screen.getByLabelText(/attach file/i)
    await user.upload(fileInput, file)
    
    expect(screen.getByText('receipt.pdf')).toBeInTheDocument()
  })

  it('shows typing indicator when agent is typing', async () => {
    render(<TicketDetail ticketId="TKT-001" />)
    
    await waitFor(() => {
      expect(screen.getByText('TKT-001')).toBeInTheDocument()
    })
    
    // Simulate WebSocket message
    const typingEvent = new CustomEvent('agent-typing', { detail: { ticketId: 'TKT-001' } })
    window.dispatchEvent(typingEvent)
    
    await waitFor(() => {
      expect(screen.getByText(/agent is typing/i)).toBeInTheDocument()
    })
  })

  it('updates ticket status', async () => {
    const user = userEvent.setup()
    
    global.fetch = jest.fn()
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ ticket: mockTicket }),
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        })
      )
    
    render(<TicketDetail ticketId="TKT-001" />)
    
    await waitFor(() => {
      expect(screen.getByText('TKT-001')).toBeInTheDocument()
    })
    
    const statusButton = screen.getByRole('button', { name: /change status/i })
    await user.click(statusButton)
    
    const resolvedOption = screen.getByRole('option', { name: /resolved/i })
    await user.click(resolvedOption)
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/tickets/TKT-001/status'),
        expect.any(Object)
      )
    })
  })

  it('escalates ticket', async () => {
    const user = userEvent.setup()
    render(<TicketDetail ticketId="TKT-001" />)
    
    await waitFor(() => {
      expect(screen.getByText('TKT-001')).toBeInTheDocument()
    })
    
    const escalateButton = screen.getByRole('button', { name: /escalate/i })
    await user.click(escalateButton)
    
    await waitFor(() => {
      expect(screen.getByText(/confirm escalation/i)).toBeInTheDocument()
    })
    
    const confirmButton = screen.getByRole('button', { name: /confirm/i })
    await user.click(confirmButton)
    
    await waitFor(() => {
      expect(screen.getByText(/ticket escalated/i)).toBeInTheDocument()
    })
  })

  it('closes ticket', async () => {
    const user = userEvent.setup()
    const resolvedTicket = { ...mockTicket, status: 'resolved' }
    
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ ticket: resolvedTicket }),
      })
    )
    
    render(<TicketDetail ticketId="TKT-001" />)
    
    await waitFor(() => {
      expect(screen.getByText('TKT-001')).toBeInTheDocument()
    })
    
    const closeButton = screen.getByRole('button', { name: /close ticket/i })
    await user.click(closeButton)
    
    await waitFor(() => {
      expect(screen.getByText(/mark as resolved/i)).toBeInTheDocument()
    })
  })

  it('shows ticket timeline', async () => {
    render(<TicketDetail ticketId="TKT-001" />)
    
    await waitFor(() => {
      expect(screen.getByText(/created/i)).toBeInTheDocument()
      expect(screen.getByText(/updated/i)).toBeInTheDocument()
    })
  })

  it('displays related articles', async () => {
    const ticketWithArticles = {
      ...mockTicket,
      relatedArticles: [
        { id: '1', title: 'Payment troubleshooting' },
        { id: '2', title: 'Refund policy' },
      ],
    }
    
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ ticket: ticketWithArticles }),
      })
    )
    
    render(<TicketDetail ticketId="TKT-001" />)
    
    await waitFor(() => {
      expect(screen.getByText(/related articles/i)).toBeInTheDocument()
      expect(screen.getByText('Payment troubleshooting')).toBeInTheDocument()
    })
  })

  it('shows loading state', () => {
    global.fetch = jest.fn(() => new Promise(() => {}))
    
    render(<TicketDetail ticketId="TKT-001" />)
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('shows error state on fetch failure', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('Network error')))
    
    render(<TicketDetail ticketId="TKT-001" />)
    
    await waitFor(() => {
      expect(screen.getByText(/failed to load ticket/i)).toBeInTheDocument()
    })
  })

  it('auto-scrolls to latest message', async () => {
    const scrollIntoView = jest.fn()
    Element.prototype.scrollIntoView = scrollIntoView
    
    render(<TicketDetail ticketId="TKT-001" />)
    
    await waitFor(() => {
      expect(scrollIntoView).toHaveBeenCalled()
    })
  })
})
