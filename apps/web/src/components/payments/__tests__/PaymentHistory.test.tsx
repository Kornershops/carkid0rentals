import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PaymentHistory from '../PaymentHistory'

const mockPayments = [
  {
    id: '1',
    amount: 50000,
    currency: 'NGN',
    status: 'completed',
    method: 'card',
    last4: '4242',
    createdAt: '2024-01-15T10:00:00Z',
    description: 'Booking payment for Toyota Camry',
  },
  {
    id: '2',
    amount: 75000,
    currency: 'NGN',
    status: 'pending',
    method: 'bank_transfer',
    createdAt: '2024-01-14T15:30:00Z',
    description: 'Booking payment for Honda Accord',
  },
]

describe('PaymentHistory', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ payments: mockPayments }),
      })
    )
  })

  it('renders payment history table', async () => {
    render(<PaymentHistory />)
    
    await waitFor(() => {
      expect(screen.getByText(/payment history/i)).toBeInTheDocument()
    })
    
    expect(screen.getByText('Toyota Camry')).toBeInTheDocument()
    expect(screen.getByText('Honda Accord')).toBeInTheDocument()
  })

  it('displays payment amounts correctly', async () => {
    render(<PaymentHistory />)
    
    await waitFor(() => {
      expect(screen.getByText('₦50,000')).toBeInTheDocument()
      expect(screen.getByText('₦75,000')).toBeInTheDocument()
    })
  })

  it('shows payment status badges', async () => {
    render(<PaymentHistory />)
    
    await waitFor(() => {
      expect(screen.getByText('Completed')).toBeInTheDocument()
      expect(screen.getByText('Pending')).toBeInTheDocument()
    })
  })

  it('filters payments by status', async () => {
    const user = userEvent.setup()
    render(<PaymentHistory />)
    
    await waitFor(() => {
      expect(screen.getByText('Toyota Camry')).toBeInTheDocument()
    })
    
    const statusFilter = screen.getByLabelText(/filter by status/i)
    await user.selectOptions(statusFilter, 'completed')
    
    expect(screen.getByText('Toyota Camry')).toBeInTheDocument()
    expect(screen.queryByText('Honda Accord')).not.toBeInTheDocument()
  })

  it('searches payments by description', async () => {
    const user = userEvent.setup()
    render(<PaymentHistory />)
    
    await waitFor(() => {
      expect(screen.getByText('Toyota Camry')).toBeInTheDocument()
    })
    
    const searchInput = screen.getByPlaceholderText(/search payments/i)
    await user.type(searchInput, 'Toyota')
    
    expect(screen.getByText('Toyota Camry')).toBeInTheDocument()
    expect(screen.queryByText('Honda Accord')).not.toBeInTheDocument()
  })

  it('exports to CSV', async () => {
    const user = userEvent.setup()
    const createObjectURL = jest.fn()
    global.URL.createObjectURL = createObjectURL
    
    render(<PaymentHistory />)
    
    await waitFor(() => {
      expect(screen.getByText('Toyota Camry')).toBeInTheDocument()
    })
    
    const exportButton = screen.getByRole('button', { name: /export csv/i })
    await user.click(exportButton)
    
    expect(createObjectURL).toHaveBeenCalled()
  })

  it('paginates results', async () => {
    const manyPayments = Array.from({ length: 25 }, (_, i) => ({
      id: `${i + 1}`,
      amount: 50000,
      currency: 'NGN',
      status: 'completed',
      method: 'card',
      last4: '4242',
      createdAt: '2024-01-15T10:00:00Z',
      description: `Payment ${i + 1}`,
    }))
    
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ payments: manyPayments }),
      })
    )
    
    const user = userEvent.setup()
    render(<PaymentHistory />)
    
    await waitFor(() => {
      expect(screen.getByText('Payment 1')).toBeInTheDocument()
    })
    
    const nextButton = screen.getByRole('button', { name: /next/i })
    await user.click(nextButton)
    
    await waitFor(() => {
      expect(screen.getByText('Payment 11')).toBeInTheDocument()
    })
  })

  it('shows loading state', () => {
    global.fetch = jest.fn(() => new Promise(() => {}))
    
    render(<PaymentHistory />)
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('shows error state on fetch failure', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('Network error')))
    
    render(<PaymentHistory />)
    
    await waitFor(() => {
      expect(screen.getByText(/failed to load/i)).toBeInTheDocument()
    })
  })

  it('shows empty state when no payments', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ payments: [] }),
      })
    )
    
    render(<PaymentHistory />)
    
    await waitFor(() => {
      expect(screen.getByText(/no payments found/i)).toBeInTheDocument()
    })
  })
})
