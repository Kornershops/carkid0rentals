import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SplitPaymentForm from '../SplitPaymentForm'

describe('SplitPaymentForm', () => {
  const mockBooking = {
    id: '123',
    totalAmount: 100000,
    currency: 'NGN',
  }

  it('renders split payment form', () => {
    render(<SplitPaymentForm booking={mockBooking} onSuccess={jest.fn()} />)
    
    expect(screen.getByText(/split payment/i)).toBeInTheDocument()
    expect(screen.getByText('₦100,000')).toBeInTheDocument()
  })

  it('allows adding participants (2-4)', async () => {
    const user = userEvent.setup()
    render(<SplitPaymentForm booking={mockBooking} onSuccess={jest.fn()} />)
    
    const addButton = screen.getByRole('button', { name: /add participant/i })
    
    await user.click(addButton)
    expect(screen.getAllByLabelText(/participant.*email/i)).toHaveLength(2)
    
    await user.click(addButton)
    expect(screen.getAllByLabelText(/participant.*email/i)).toHaveLength(3)
    
    await user.click(addButton)
    expect(screen.getAllByLabelText(/participant.*email/i)).toHaveLength(4)
    
    // Should be disabled at 4 participants
    expect(addButton).toBeDisabled()
  })

  it('calculates equal split correctly', async () => {
    const user = userEvent.setup()
    render(<SplitPaymentForm booking={mockBooking} onSuccess={jest.fn()} />)
    
    const addButton = screen.getByRole('button', { name: /add participant/i })
    await user.click(addButton) // 2 participants
    
    const equalSplitButton = screen.getByRole('button', { name: /equal split/i })
    await user.click(equalSplitButton)
    
    const amountInputs = screen.getAllByLabelText(/amount/i)
    expect(amountInputs[0]).toHaveValue('50000')
    expect(amountInputs[1]).toHaveValue('50000')
  })

  it('validates total amount matches booking', async () => {
    const user = userEvent.setup()
    render(<SplitPaymentForm booking={mockBooking} onSuccess={jest.fn()} />)
    
    const amountInput = screen.getAllByLabelText(/amount/i)[0]
    await user.clear(amountInput)
    await user.type(amountInput, '60000')
    
    const submitButton = screen.getByRole('button', { name: /create split/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/total must equal ₦100,000/i)).toBeInTheDocument()
    })
  })

  it('validates email format', async () => {
    const user = userEvent.setup()
    render(<SplitPaymentForm booking={mockBooking} onSuccess={jest.fn()} />)
    
    const emailInput = screen.getAllByLabelText(/email/i)[0]
    await user.type(emailInput, 'invalid-email')
    
    fireEvent.blur(emailInput)
    
    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument()
    })
  })

  it('creates split payment successfully', async () => {
    const onSuccess = jest.fn()
    const user = userEvent.setup()
    
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ splitId: 'split-123' }),
      })
    )
    
    render(<SplitPaymentForm booking={mockBooking} onSuccess={onSuccess} />)
    
    await user.type(screen.getAllByLabelText(/email/i)[0], 'user1@example.com')
    await user.type(screen.getAllByLabelText(/amount/i)[0], '100000')
    
    const submitButton = screen.getByRole('button', { name: /create split/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith({ splitId: 'split-123' })
    })
  })
})
