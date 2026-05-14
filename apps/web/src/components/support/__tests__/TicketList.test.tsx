import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TicketList from '../TicketList'

const mockTickets = [
  {
    id: 'TKT-001',
    subject: 'Payment not processed',
    category: 'payment_issue',
    priority: 'high',
    status: 'open',
    createdAt: '2024-01-15T10:00:00Z',
    lastUpdated: '2024-01-15T10:00:00Z',
    unreadMessages: 2,
  },
  {
    id: 'TKT-002',
    subject: 'Vehicle not available',
    category: 'booking_issue',
    priority: 'medium',
    status: 'in_progress',
    createdAt: '2024-01-14T15:30:00Z',
    lastUpdated: '2024-01-15T09:00:00Z',
    unreadMessages: 0,
  },
  {
    id: 'TKT-003',
    subject: 'Account verification',
    category: 'account_issue',
    priority: 'low',
    status: 'resolved',
    createdAt: '2024-01-10T12:00:00Z',
    lastUpdated: '2024-01-12T14:00:00Z',
    unreadMessages: 0,
  },
]

describe('TicketList', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ tickets: mockTickets }),
      })
    )
  })

  it('renders ticket list', async () => {
    render(<TicketList />)
    
    await waitFor(() => {
      expect(screen.getByText('Payment not processed')).toBeInTheDocument()
      expect(screen.getByText('Vehicle not available')).toBeInTheDocument()
      expect(screen.getByText('Account verification')).toBeInTheDocument()
    })
  })

  it('displays ticket status badges', async () => {
    render(<TicketList />)
    
    await waitFor(() => {
      expect(screen.getByText('Open')).toBeInTheDocument()
      expect(screen.getByText('In Progress')).toBeInTheDocument()
      expect(screen.getByText('Resolved')).toBeInTheDocument()
    })
  })

  it('displays priority indicators', async () => {
    render(<TicketList />)
    
    await waitFor(() => {
      expect(screen.getByText('High')).toBeInTheDocument()
      expect(screen.getByText('Medium')).toBeInTheDocument()
      expect(screen.getByText('Low')).toBeInTheDocument()
    })
  })

  it('shows unread message count', async () => {
    render(<TicketList />)
    
    await waitFor(() => {
      expect(screen.getByText('2 new')).toBeInTheDocument()
    })
  })

  it('filters tickets by status', async () => {
    const user = userEvent.setup()
    render(<TicketList />)
    
    await waitFor(() => {
      expect(screen.getByText('Payment not processed')).toBeInTheDocument()
    })
    
    const statusFilter = screen.getByLabelText(/filter by status/i)
    await user.selectOptions(statusFilter, 'open')
    
    expect(screen.getByText('Payment not processed')).toBeInTheDocument()
    expect(screen.queryByText('Vehicle not available')).not.toBeInTheDocument()
    expect(screen.queryByText('Account verification')).not.toBeInTheDocument()
  })

  it('filters tickets by category', async () => {
    const user = userEvent.setup()
    render(<TicketList />)
    
    await waitFor(() => {
      expect(screen.getByText('Payment not processed')).toBeInTheDocument()
    })
    
    const categoryFilter = screen.getByLabelText(/filter by category/i)
    await user.selectOptions(categoryFilter, 'payment_issue')
    
    expect(screen.getByText('Payment not processed')).toBeInTheDocument()
    expect(screen.queryByText('Vehicle not available')).not.toBeInTheDocument()
  })

  it('filters tickets by priority', async () => {
    const user = userEvent.setup()
    render(<TicketList />)
    
    await waitFor(() => {
      expect(screen.getByText('Payment not processed')).toBeInTheDocument()
    })
    
    const priorityFilter = screen.getByLabelText(/filter by priority/i)
    await user.selectOptions(priorityFilter, 'high')
    
    expect(screen.getByText('Payment not processed')).toBeInTheDocument()
    expect(screen.queryByText('Vehicle not available')).not.toBeInTheDocument()
  })

  it('searches tickets by subject', async () => {
    const user = userEvent.setup()
    render(<TicketList />)
    
    await waitFor(() => {
      expect(screen.getByText('Payment not processed')).toBeInTheDocument()
    })
    
    const searchInput = screen.getByPlaceholderText(/search tickets/i)
    await user.type(searchInput, 'payment')
    
    expect(screen.getByText('Payment not processed')).toBeInTheDocument()
    expect(screen.queryByText('Vehicle not available')).not.toBeInTheDocument()
  })

  it('sorts tickets by date', async () => {
    const user = userEvent.setup()
    render(<TicketList />)
    
    await waitFor(() => {
      expect(screen.getByText('Payment not processed')).toBeInTheDocument()
    })
    
    const sortSelect = screen.getByLabelText(/sort by/i)
    await user.selectOptions(sortSelect, 'oldest')
    
    const tickets = screen.getAllByRole('article')
    expect(tickets[0]).toHaveTextContent('Account verification')
  })

  it('sorts tickets by priority', async () => {
    const user = userEvent.setup()
    render(<TicketList />)
    
    await waitFor(() => {
      expect(screen.getByText('Payment not processed')).toBeInTheDocument()
    })
    
    const sortSelect = screen.getByLabelText(/sort by/i)
    await user.selectOptions(sortSelect, 'priority')
    
    const tickets = screen.getAllByRole('article')
    expect(tickets[0]).toHaveTextContent('High')
  })

  it('navigates to ticket detail on click', async () => {
    const user = userEvent.setup()
    const mockPush = jest.fn()
    
    jest.mock('next/navigation', () => ({
      useRouter: () => ({ push: mockPush }),
    }))
    
    render(<TicketList />)
    
    await waitFor(() => {
      expect(screen.getByText('Payment not processed')).toBeInTheDocument()
    })
    
    const ticket = screen.getByText('Payment not processed')
    await user.click(ticket)
    
    // Should navigate to ticket detail
    expect(window.location.pathname).toContain('/tickets/TKT-001')
  })

  it('shows empty state when no tickets', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ tickets: [] }),
      })
    )
    
    render(<TicketList />)
    
    await waitFor(() => {
      expect(screen.getByText(/no tickets found/i)).toBeInTheDocument()
    })
  })

  it('shows loading state', () => {
    global.fetch = jest.fn(() => new Promise(() => {}))
    
    render(<TicketList />)
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('shows error state on fetch failure', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('Network error')))
    
    render(<TicketList />)
    
    await waitFor(() => {
      expect(screen.getByText(/failed to load tickets/i)).toBeInTheDocument()
    })
  })

  it('paginates results', async () => {
    const manyTickets = Array.from({ length: 25 }, (_, i) => ({
      id: `TKT-${i + 1}`,
      subject: `Ticket ${i + 1}`,
      category: 'other',
      priority: 'low',
      status: 'open',
      createdAt: '2024-01-15T10:00:00Z',
      lastUpdated: '2024-01-15T10:00:00Z',
      unreadMessages: 0,
    }))
    
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ tickets: manyTickets }),
      })
    )
    
    const user = userEvent.setup()
    render(<TicketList />)
    
    await waitFor(() => {
      expect(screen.getByText('Ticket 1')).toBeInTheDocument()
    })
    
    const nextButton = screen.getByRole('button', { name: /next/i })
    await user.click(nextButton)
    
    await waitFor(() => {
      expect(screen.getByText('Ticket 11')).toBeInTheDocument()
    })
  })

  it('refreshes ticket list', async () => {
    const user = userEvent.setup()
    render(<TicketList />)
    
    await waitFor(() => {
      expect(screen.getByText('Payment not processed')).toBeInTheDocument()
    })
    
    const refreshButton = screen.getByRole('button', { name: /refresh/i })
    await user.click(refreshButton)
    
    expect(global.fetch).toHaveBeenCalledTimes(2)
  })
})
