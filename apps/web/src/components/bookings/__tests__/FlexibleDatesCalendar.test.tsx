import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FlexibleDatesCalendar from '../FlexibleDatesCalendar'

const mockPricing = {
  '2024-02-01': { price: 15000, available: true },
  '2024-02-02': { price: 15000, available: true },
  '2024-02-03': { price: 18000, available: true },
  '2024-02-04': { price: 18000, available: true },
  '2024-02-05': { price: 12000, available: true, bestPrice: true },
  '2024-02-06': { price: 12000, available: true, bestPrice: true },
  '2024-02-07': { price: 15000, available: false },
}

describe('FlexibleDatesCalendar', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ pricing: mockPricing }),
      })
    )
  })

  it('renders flexible dates calendar', async () => {
    render(<FlexibleDatesCalendar vehicleId="123" />)
    
    await waitFor(() => {
      expect(screen.getByText(/flexible dates/i)).toBeInTheDocument()
    })
  })

  it('displays calendar with prices', async () => {
    render(<FlexibleDatesCalendar vehicleId="123" />)
    
    await waitFor(() => {
      expect(screen.getByText('₦15,000')).toBeInTheDocument()
      expect(screen.getByText('₦18,000')).toBeInTheDocument()
      expect(screen.getByText('₦12,000')).toBeInTheDocument()
    })
  })

  it('highlights best price dates', async () => {
    render(<FlexibleDatesCalendar vehicleId="123" />)
    
    await waitFor(() => {
      const bestPriceDates = screen.getAllByText(/best price/i)
      expect(bestPriceDates).toHaveLength(2) // Feb 5 and 6
    })
  })

  it('shows unavailable dates', async () => {
    render(<FlexibleDatesCalendar vehicleId="123" />)
    
    await waitFor(() => {
      const unavailableDate = screen.getByText('7').closest('.calendar-day')
      expect(unavailableDate).toHaveClass('unavailable')
    })
  })

  it('selects date range', async () => {
    const user = userEvent.setup()
    render(<FlexibleDatesCalendar vehicleId="123" />)
    
    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument()
    })
    
    const startDate = screen.getByText('1')
    const endDate = screen.getByText('5')
    
    await user.click(startDate)
    await user.click(endDate)
    
    await waitFor(() => {
      expect(screen.getByText(/5 days selected/i)).toBeInTheDocument()
    })
  })

  it('calculates total price for range', async () => {
    const user = userEvent.setup()
    render(<FlexibleDatesCalendar vehicleId="123" />)
    
    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument()
    })
    
    await user.click(screen.getByText('1'))
    await user.click(screen.getByText('3'))
    
    await waitFor(() => {
      // Feb 1-3: 15000 + 15000 + 18000 = 48000
      expect(screen.getByText('₦48,000')).toBeInTheDocument()
    })
  })

  it('shows price comparison', async () => {
    const user = userEvent.setup()
    render(<FlexibleDatesCalendar vehicleId="123" />)
    
    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument()
    })
    
    await user.click(screen.getByText('1'))
    await user.click(screen.getByText('3'))
    
    await waitFor(() => {
      expect(screen.getByText(/compare with other dates/i)).toBeInTheDocument()
    })
  })

  it('suggests cheaper alternatives', async () => {
    const user = userEvent.setup()
    render(<FlexibleDatesCalendar vehicleId="123" />)
    
    await waitFor(() => {
      expect(screen.getByText('3')).toBeInTheDocument()
    })
    
    await user.click(screen.getByText('3'))
    await user.click(screen.getByText('4'))
    
    await waitFor(() => {
      expect(screen.getByText(/save ₦12,000 by booking feb 5-6/i)).toBeInTheDocument()
    })
  })

  it('prevents selecting unavailable dates', async () => {
    const user = userEvent.setup()
    render(<FlexibleDatesCalendar vehicleId="123" />)
    
    await waitFor(() => {
      expect(screen.getByText('7')).toBeInTheDocument()
    })
    
    const unavailableDate = screen.getByText('7')
    await user.click(unavailableDate)
    
    expect(screen.queryByText(/days selected/i)).not.toBeInTheDocument()
  })

  it('shows price trends', async () => {
    render(<FlexibleDatesCalendar vehicleId="123" />)
    
    await waitFor(() => {
      expect(screen.getByText(/price trends/i)).toBeInTheDocument()
      expect(screen.getByText(/weekends are more expensive/i)).toBeInTheDocument()
    })
  })

  it('filters by budget', async () => {
    const user = userEvent.setup()
    render(<FlexibleDatesCalendar vehicleId="123" />)
    
    await waitFor(() => {
      expect(screen.getByLabelText(/max price/i)).toBeInTheDocument()
    })
    
    const budgetInput = screen.getByLabelText(/max price/i)
    await user.type(budgetInput, '13000')
    
    await waitFor(() => {
      expect(screen.getByText('₦12,000')).toBeInTheDocument()
      expect(screen.queryByText('₦15,000')).not.toBeInTheDocument()
    })
  })

  it('shows monthly view', async () => {
    const user = userEvent.setup()
    render(<FlexibleDatesCalendar vehicleId="123" />)
    
    await waitFor(() => {
      expect(screen.getByText(/february 2024/i)).toBeInTheDocument()
    })
    
    const nextMonth = screen.getByRole('button', { name: /next month/i })
    await user.click(nextMonth)
    
    await waitFor(() => {
      expect(screen.getByText(/march 2024/i)).toBeInTheDocument()
    })
  })

  it('displays price legend', async () => {
    render(<FlexibleDatesCalendar vehicleId="123" />)
    
    await waitFor(() => {
      expect(screen.getByText(/best price/i)).toBeInTheDocument()
      expect(screen.getByText(/regular price/i)).toBeInTheDocument()
      expect(screen.getByText(/high demand/i)).toBeInTheDocument()
    })
  })

  it('shows loading state', () => {
    global.fetch = jest.fn(() => new Promise(() => {}))
    
    render(<FlexibleDatesCalendar vehicleId="123" />)
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('shows error state on fetch failure', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('Network error')))
    
    render(<FlexibleDatesCalendar vehicleId="123" />)
    
    await waitFor(() => {
      expect(screen.getByText(/failed to load pricing/i)).toBeInTheDocument()
    })
  })
})
