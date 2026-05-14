import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CancellationFlow from '../CancellationFlow'

const mockBooking = {
  id: '123',
  vehicleName: 'Toyota Camry',
  startDate: '2024-02-01',
  endDate: '2024-02-05',
  totalAmount: 75000,
  status: 'confirmed',
  cancellationPolicy: 'flexible',
}

describe('CancellationFlow', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ booking: mockBooking }),
      })
    )
  })

  it('renders cancellation flow', async () => {
    render(<CancellationFlow bookingId="123" />)
    
    await waitFor(() => {
      expect(screen.getByText(/cancel booking/i)).toBeInTheDocument()
    })
  })

  it('displays booking details', async () => {
    render(<CancellationFlow bookingId="123" />)
    
    await waitFor(() => {
      expect(screen.getByText('Toyota Camry')).toBeInTheDocument()
      expect(screen.getByText(/feb 1.*feb 5/i)).toBeInTheDocument()
      expect(screen.getByText('₦75,000')).toBeInTheDocument()
    })
  })

  it('shows cancellation policy', async () => {
    render(<CancellationFlow bookingId="123" />)
    
    await waitFor(() => {
      expect(screen.getByText(/cancellation policy/i)).toBeInTheDocument()
      expect(screen.getByText(/flexible/i)).toBeInTheDocument()
    })
  })

  it('calculates refund amount based on timing', async () => {
    render(<CancellationFlow bookingId="123" />)
    
    await waitFor(() => {
      expect(screen.getByText(/refund amount/i)).toBeInTheDocument()
      // Flexible policy: 100% refund if >24h before
      expect(screen.getByText('₦75,000')).toBeInTheDocument()
      expect(screen.getByText(/100% refund/i)).toBeInTheDocument()
    })
  })

  it('shows reduced refund for late cancellation', async () => {
    const lateBooking = {
      ...mockBooking,
      startDate: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(), // 12 hours from now
    }
    
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ booking: lateBooking }),
      })
    )
    
    render(<CancellationFlow bookingId="123" />)
    
    await waitFor(() => {
      expect(screen.getByText(/50% refund/i)).toBeInTheDocument()
      expect(screen.getByText('₦37,500')).toBeInTheDocument()
    })
  })

  it('requires cancellation reason', async () => {
    const user = userEvent.setup()
    render(<CancellationFlow bookingId="123" />)
    
    await waitFor(() => {
      expect(screen.getByText(/cancel booking/i)).toBeInTheDocument()
    })
    
    const cancelButton = screen.getByRole('button', { name: /confirm cancellation/i })
    await user.click(cancelButton)
    
    await waitFor(() => {
      expect(screen.getByText(/please select a reason/i)).toBeInTheDocument()
    })
  })

  it('displays cancellation reason options', async () => {
    render(<CancellationFlow bookingId="123" />)
    
    await waitFor(() => {
      expect(screen.getByLabelText(/reason for cancellation/i)).toBeInTheDocument()
    })
    
    expect(screen.getByRole('option', { name: /change of plans/i })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: /found better option/i })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: /vehicle issue/i })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: /other/i })).toBeInTheDocument()
  })

  it('requires details for "other" reason', async () => {
    const user = userEvent.setup()
    render(<CancellationFlow bookingId="123" />)
    
    await waitFor(() => {
      expect(screen.getByLabelText(/reason/i)).toBeInTheDocument()
    })
    
    const reasonSelect = screen.getByLabelText(/reason/i)
    await user.selectOptions(reasonSelect, 'other')
    
    const cancelButton = screen.getByRole('button', { name: /confirm cancellation/i })
    await user.click(cancelButton)
    
    await waitFor(() => {
      expect(screen.getByText(/please provide details/i)).toBeInTheDocument()
    })
  })

  it('shows confirmation dialog', async () => {
    const user = userEvent.setup()
    render(<CancellationFlow bookingId="123" />)
    
    await waitFor(() => {
      expect(screen.getByLabelText(/reason/i)).toBeInTheDocument()
    })
    
    await user.selectOptions(screen.getByLabelText(/reason/i), 'change_of_plans')
    
    const cancelButton = screen.getByRole('button', { name: /confirm cancellation/i })
    await user.click(cancelButton)
    
    await waitFor(() => {
      expect(screen.getByText(/are you sure/i)).toBeInTheDocument()
      expect(screen.getByText(/this action cannot be undone/i)).toBeInTheDocument()
    })
  })

  it('cancels booking successfully', async () => {
    const onSuccess = jest.fn()
    const user = userEvent.setup()
    
    global.fetch = jest.fn()
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ booking: mockBooking }),
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ 
            success: true,
            refundAmount: 75000,
            refundId: 'REF-123',
          }),
        })
      )
    
    render(<CancellationFlow bookingId="123" onSuccess={onSuccess} />)
    
    await waitFor(() => {
      expect(screen.getByLabelText(/reason/i)).toBeInTheDocument()
    })
    
    await user.selectOptions(screen.getByLabelText(/reason/i), 'change_of_plans')
    await user.click(screen.getByRole('button', { name: /confirm cancellation/i }))
    
    await waitFor(() => {
      expect(screen.getByText(/are you sure/i)).toBeInTheDocument()
    })
    
    await user.click(screen.getByRole('button', { name: /yes, cancel/i }))
    
    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith({
        success: true,
        refundAmount: 75000,
        refundId: 'REF-123',
      })
    })
  })

  it('offers reschedule alternative', async () => {
    render(<CancellationFlow bookingId="123" />)
    
    await waitFor(() => {
      expect(screen.getByText(/or reschedule instead/i)).toBeInTheDocument()
    })
    
    const rescheduleButton = screen.getByRole('button', { name: /reschedule/i })
    expect(rescheduleButton).toBeInTheDocument()
  })

  it('shows processing fee if applicable', async () => {
    const bookingWithFee = {
      ...mockBooking,
      cancellationPolicy: 'moderate',
    }
    
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ booking: bookingWithFee }),
      })
    )
    
    render(<CancellationFlow bookingId="123" />)
    
    await waitFor(() => {
      expect(screen.getByText(/processing fee/i)).toBeInTheDocument()
      expect(screen.getByText(/₦3,750/i)).toBeInTheDocument() // 5% fee
    })
  })

  it('prevents cancellation if too late', async () => {
    const lateBooking = {
      ...mockBooking,
      startDate: new Date(Date.now() - 1000).toISOString(), // Already started
    }
    
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ booking: lateBooking }),
      })
    )
    
    render(<CancellationFlow bookingId="123" />)
    
    await waitFor(() => {
      expect(screen.getByText(/cannot cancel/i)).toBeInTheDocument()
      expect(screen.getByText(/booking has already started/i)).toBeInTheDocument()
    })
  })

  it('shows loading state during cancellation', async () => {
    const user = userEvent.setup()
    
    global.fetch = jest.fn()
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ booking: mockBooking }),
        })
      )
      .mockImplementationOnce(() => new Promise(() => {}))
    
    render(<CancellationFlow bookingId="123" />)
    
    await waitFor(() => {
      expect(screen.getByLabelText(/reason/i)).toBeInTheDocument()
    })
    
    await user.selectOptions(screen.getByLabelText(/reason/i), 'change_of_plans')
    await user.click(screen.getByRole('button', { name: /confirm cancellation/i }))
    await user.click(screen.getByRole('button', { name: /yes, cancel/i }))
    
    await waitFor(() => {
      expect(screen.getByText(/cancelling/i)).toBeInTheDocument()
    })
  })

  it('displays error on cancellation failure', async () => {
    const user = userEvent.setup()
    
    global.fetch = jest.fn()
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ booking: mockBooking }),
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: false,
          json: () => Promise.resolve({ error: 'Cancellation failed' }),
        })
      )
    
    render(<CancellationFlow bookingId="123" />)
    
    await waitFor(() => {
      expect(screen.getByLabelText(/reason/i)).toBeInTheDocument()
    })
    
    await user.selectOptions(screen.getByLabelText(/reason/i), 'change_of_plans')
    await user.click(screen.getByRole('button', { name: /confirm cancellation/i }))
    await user.click(screen.getByRole('button', { name: /yes, cancel/i }))
    
    await waitFor(() => {
      expect(screen.getByText(/cancellation failed/i)).toBeInTheDocument()
    })
  })
})
