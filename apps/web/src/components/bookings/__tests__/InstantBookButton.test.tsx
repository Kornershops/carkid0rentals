import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import InstantBookButton from '../InstantBookButton'

const mockVehicle = {
  id: '123',
  name: 'Toyota Camry',
  pricePerDay: 15000,
  instantBookEnabled: true,
  available: true,
}

describe('InstantBookButton', () => {
  it('renders instant book button', () => {
    render(<InstantBookButton vehicle={mockVehicle} />)
    
    expect(screen.getByRole('button', { name: /instant book/i })).toBeInTheDocument()
  })

  it('shows instant book badge', () => {
    render(<InstantBookButton vehicle={mockVehicle} />)
    
    expect(screen.getByText(/instant book/i)).toBeInTheDocument()
  })

  it('is disabled when vehicle not available', () => {
    const unavailableVehicle = { ...mockVehicle, available: false }
    
    render(<InstantBookButton vehicle={unavailableVehicle} />)
    
    const button = screen.getByRole('button', { name: /instant book/i })
    expect(button).toBeDisabled()
  })

  it('is disabled when instant book not enabled', () => {
    const regularVehicle = { ...mockVehicle, instantBookEnabled: false }
    
    render(<InstantBookButton vehicle={regularVehicle} />)
    
    expect(screen.queryByRole('button', { name: /instant book/i })).not.toBeInTheDocument()
  })

  it('requires authentication', async () => {
    const user = userEvent.setup()
    
    render(<InstantBookButton vehicle={mockVehicle} isAuthenticated={false} />)
    
    const button = screen.getByRole('button', { name: /instant book/i })
    await user.click(button)
    
    await waitFor(() => {
      expect(screen.getByText(/please login/i)).toBeInTheDocument()
    })
  })

  it('checks user verification status', async () => {
    const user = userEvent.setup()
    
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ verified: false }),
      })
    )
    
    render(<InstantBookButton vehicle={mockVehicle} isAuthenticated={true} />)
    
    const button = screen.getByRole('button', { name: /instant book/i })
    await user.click(button)
    
    await waitFor(() => {
      expect(screen.getByText(/verification required/i)).toBeInTheDocument()
    })
  })

  it('shows booking confirmation modal', async () => {
    const user = userEvent.setup()
    
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ verified: true }),
      })
    )
    
    render(<InstantBookButton vehicle={mockVehicle} isAuthenticated={true} />)
    
    const button = screen.getByRole('button', { name: /instant book/i })
    await user.click(button)
    
    await waitFor(() => {
      expect(screen.getByText(/confirm instant booking/i)).toBeInTheDocument()
      expect(screen.getByText('Toyota Camry')).toBeInTheDocument()
    })
  })

  it('displays booking summary', async () => {
    const user = userEvent.setup()
    
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ verified: true }),
      })
    )
    
    render(<InstantBookButton vehicle={mockVehicle} dates={{ start: '2024-02-01', end: '2024-02-05' }} isAuthenticated={true} />)
    
    const button = screen.getByRole('button', { name: /instant book/i })
    await user.click(button)
    
    await waitFor(() => {
      expect(screen.getByText(/4 days/i)).toBeInTheDocument()
      expect(screen.getByText('₦60,000')).toBeInTheDocument() // 4 * 15000
    })
  })

  it('creates instant booking', async () => {
    const onSuccess = jest.fn()
    const user = userEvent.setup()
    
    global.fetch = jest.fn()
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ verified: true }),
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ 
            bookingId: 'BK-123',
            status: 'confirmed',
          }),
        })
      )
    
    render(<InstantBookButton vehicle={mockVehicle} isAuthenticated={true} onSuccess={onSuccess} />)
    
    const button = screen.getByRole('button', { name: /instant book/i })
    await user.click(button)
    
    await waitFor(() => {
      expect(screen.getByText(/confirm instant booking/i)).toBeInTheDocument()
    })
    
    const confirmButton = screen.getByRole('button', { name: /confirm/i })
    await user.click(confirmButton)
    
    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith({
        bookingId: 'BK-123',
        status: 'confirmed',
      })
    })
  })

  it('shows loading state during booking', async () => {
    const user = userEvent.setup()
    
    global.fetch = jest.fn()
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ verified: true }),
        })
      )
      .mockImplementationOnce(() => new Promise(() => {}))
    
    render(<InstantBookButton vehicle={mockVehicle} isAuthenticated={true} />)
    
    const button = screen.getByRole('button', { name: /instant book/i })
    await user.click(button)
    
    await waitFor(() => {
      expect(screen.getByText(/confirm instant booking/i)).toBeInTheDocument()
    })
    
    const confirmButton = screen.getByRole('button', { name: /confirm/i })
    await user.click(confirmButton)
    
    await waitFor(() => {
      expect(screen.getByText(/booking/i)).toBeInTheDocument()
    })
  })

  it('displays error on booking failure', async () => {
    const user = userEvent.setup()
    
    global.fetch = jest.fn()
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ verified: true }),
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: false,
          json: () => Promise.resolve({ error: 'Vehicle no longer available' }),
        })
      )
    
    render(<InstantBookButton vehicle={mockVehicle} isAuthenticated={true} />)
    
    const button = screen.getByRole('button', { name: /instant book/i })
    await user.click(button)
    
    await waitFor(() => {
      expect(screen.getByText(/confirm instant booking/i)).toBeInTheDocument()
    })
    
    const confirmButton = screen.getByRole('button', { name: /confirm/i })
    await user.click(confirmButton)
    
    await waitFor(() => {
      expect(screen.getByText(/vehicle no longer available/i)).toBeInTheDocument()
    })
  })

  it('shows instant book benefits', async () => {
    const user = userEvent.setup()
    
    render(<InstantBookButton vehicle={mockVehicle} />)
    
    const infoIcon = screen.getByLabelText(/instant book info/i)
    await user.hover(infoIcon)
    
    await waitFor(() => {
      expect(screen.getByText(/skip approval wait/i)).toBeInTheDocument()
      expect(screen.getByText(/immediate confirmation/i)).toBeInTheDocument()
    })
  })

  it('applies instant book discount', async () => {
    const vehicleWithDiscount = {
      ...mockVehicle,
      instantBookDiscount: 10, // 10% discount
    }
    
    const user = userEvent.setup()
    
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ verified: true }),
      })
    )
    
    render(<InstantBookButton vehicle={vehicleWithDiscount} dates={{ start: '2024-02-01', end: '2024-02-05' }} isAuthenticated={true} />)
    
    const button = screen.getByRole('button', { name: /instant book/i })
    await user.click(button)
    
    await waitFor(() => {
      expect(screen.getByText(/10% instant book discount/i)).toBeInTheDocument()
      expect(screen.getByText('₦54,000')).toBeInTheDocument() // 60000 - 10%
    })
  })
})
