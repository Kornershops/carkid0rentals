import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PointsHistory from '../PointsHistory'

const mockHistory = [
  {
    id: '1',
    type: 'earned',
    amount: 100,
    description: 'Booking completed',
    date: '2024-01-15T10:00:00Z',
    bookingId: 'BK-123',
  },
  {
    id: '2',
    type: 'redeemed',
    amount: -50,
    description: 'Discount applied',
    date: '2024-01-14T15:00:00Z',
    rewardId: 'RW-456',
  },
  {
    id: '3',
    type: 'earned',
    amount: 25,
    description: 'Referral bonus',
    date: '2024-01-13T12:00:00Z',
    referralId: 'REF-789',
  },
  {
    id: '4',
    type: 'expired',
    amount: -10,
    description: 'Points expired',
    date: '2024-01-10T00:00:00Z',
  },
]

describe('PointsHistory', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ history: mockHistory }),
      })
    )
  })

  it('renders points history', async () => {
    render(<PointsHistory />)
    
    await waitFor(() => {
      expect(screen.getByText(/points history/i)).toBeInTheDocument()
    })
  })

  it('displays all transactions', async () => {
    render(<PointsHistory />)
    
    await waitFor(() => {
      expect(screen.getByText('Booking completed')).toBeInTheDocument()
      expect(screen.getByText('Discount applied')).toBeInTheDocument()
      expect(screen.getByText('Referral bonus')).toBeInTheDocument()
      expect(screen.getByText('Points expired')).toBeInTheDocument()
    })
  })

  it('shows earned points with positive sign', async () => {
    render(<PointsHistory />)
    
    await waitFor(() => {
      expect(screen.getByText('+100')).toBeInTheDocument()
      expect(screen.getByText('+25')).toBeInTheDocument()
    })
  })

  it('shows redeemed points with negative sign', async () => {
    render(<PointsHistory />)
    
    await waitFor(() => {
      expect(screen.getByText('-50')).toBeInTheDocument()
      expect(screen.getByText('-10')).toBeInTheDocument()
    })
  })

  it('filters by transaction type', async () => {
    const user = userEvent.setup()
    render(<PointsHistory />)
    
    await waitFor(() => {
      expect(screen.getByText('Booking completed')).toBeInTheDocument()
    })
    
    const filterSelect = screen.getByLabelText(/filter by type/i)
    await user.selectOptions(filterSelect, 'earned')
    
    expect(screen.getByText('Booking completed')).toBeInTheDocument()
    expect(screen.queryByText('Discount applied')).not.toBeInTheDocument()
  })

  it('filters by date range', async () => {
    const user = userEvent.setup()
    render(<PointsHistory />)
    
    await waitFor(() => {
      expect(screen.getByText('Booking completed')).toBeInTheDocument()
    })
    
    const startDate = screen.getByLabelText(/start date/i)
    const endDate = screen.getByLabelText(/end date/i)
    
    await user.type(startDate, '2024-01-14')
    await user.type(endDate, '2024-01-15')
    
    expect(screen.getByText('Booking completed')).toBeInTheDocument()
    expect(screen.queryByText('Referral bonus')).not.toBeInTheDocument()
  })

  it('sorts by date', async () => {
    const user = userEvent.setup()
    render(<PointsHistory />)
    
    await waitFor(() => {
      expect(screen.getByText('Booking completed')).toBeInTheDocument()
    })
    
    const sortSelect = screen.getByLabelText(/sort by/i)
    await user.selectOptions(sortSelect, 'oldest')
    
    const transactions = screen.getAllByRole('listitem')
    expect(transactions[0]).toHaveTextContent('Points expired')
  })

  it('sorts by amount', async () => {
    const user = userEvent.setup()
    render(<PointsHistory />)
    
    await waitFor(() => {
      expect(screen.getByText('Booking completed')).toBeInTheDocument()
    })
    
    const sortSelect = screen.getByLabelText(/sort by/i)
    await user.selectOptions(sortSelect, 'highest')
    
    const transactions = screen.getAllByRole('listitem')
    expect(transactions[0]).toHaveTextContent('Booking completed')
  })

  it('navigates to related booking', async () => {
    const user = userEvent.setup()
    render(<PointsHistory />)
    
    await waitFor(() => {
      expect(screen.getByText('Booking completed')).toBeInTheDocument()
    })
    
    const viewBooking = screen.getByRole('link', { name: /view booking/i })
    await user.click(viewBooking)
    
    expect(window.location.pathname).toContain('/bookings/BK-123')
  })

  it('exports history to CSV', async () => {
    const user = userEvent.setup()
    const createObjectURL = jest.fn()
    global.URL.createObjectURL = createObjectURL
    
    render(<PointsHistory />)
    
    await waitFor(() => {
      expect(screen.getByText('Booking completed')).toBeInTheDocument()
    })
    
    const exportButton = screen.getByRole('button', { name: /export/i })
    await user.click(exportButton)
    
    expect(createObjectURL).toHaveBeenCalled()
  })

  it('shows transaction details on click', async () => {
    const user = userEvent.setup()
    render(<PointsHistory />)
    
    await waitFor(() => {
      expect(screen.getByText('Booking completed')).toBeInTheDocument()
    })
    
    const transaction = screen.getByText('Booking completed')
    await user.click(transaction)
    
    await waitFor(() => {
      expect(screen.getByText(/transaction details/i)).toBeInTheDocument()
      expect(screen.getByText('BK-123')).toBeInTheDocument()
    })
  })

  it('groups transactions by date', async () => {
    render(<PointsHistory />)
    
    await waitFor(() => {
      expect(screen.getByText(/today/i)).toBeInTheDocument()
      expect(screen.getByText(/yesterday/i)).toBeInTheDocument()
    })
  })

  it('shows running balance', async () => {
    render(<PointsHistory showBalance={true} />)
    
    await waitFor(() => {
      expect(screen.getByText(/balance/i)).toBeInTheDocument()
    })
  })

  it('paginates results', async () => {
    const manyTransactions = Array.from({ length: 25 }, (_, i) => ({
      id: `${i + 1}`,
      type: 'earned',
      amount: 10,
      description: `Transaction ${i + 1}`,
      date: '2024-01-15T10:00:00Z',
    }))
    
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ history: manyTransactions }),
      })
    )
    
    const user = userEvent.setup()
    render(<PointsHistory />)
    
    await waitFor(() => {
      expect(screen.getByText('Transaction 1')).toBeInTheDocument()
    })
    
    const nextButton = screen.getByRole('button', { name: /next/i })
    await user.click(nextButton)
    
    await waitFor(() => {
      expect(screen.getByText('Transaction 11')).toBeInTheDocument()
    })
  })

  it('shows empty state when no history', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ history: [] }),
      })
    )
    
    render(<PointsHistory />)
    
    await waitFor(() => {
      expect(screen.getByText(/no points history/i)).toBeInTheDocument()
    })
  })

  it('shows loading state', () => {
    global.fetch = jest.fn(() => new Promise(() => {}))
    
    render(<PointsHistory />)
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('shows error state on fetch failure', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('Network error')))
    
    render(<PointsHistory />)
    
    await waitFor(() => {
      expect(screen.getByText(/failed to load history/i)).toBeInTheDocument()
    })
  })
})
