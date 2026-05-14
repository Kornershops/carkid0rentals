import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AddPaymentMethod from '../AddPaymentMethod'

describe('AddPaymentMethod', () => {
  it('renders the form correctly', () => {
    render(<AddPaymentMethod onSuccess={jest.fn()} onCancel={jest.fn()} />)
    
    expect(screen.getByText(/add payment method/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/card number/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/cardholder name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/expiry date/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/cvv/i)).toBeInTheDocument()
  })

  it('validates card number with Luhn algorithm', async () => {
    const user = userEvent.setup()
    render(<AddPaymentMethod onSuccess={jest.fn()} onCancel={jest.fn()} />)
    
    const cardInput = screen.getByLabelText(/card number/i)
    await user.type(cardInput, '1234567890123456')
    
    fireEvent.blur(cardInput)
    
    await waitFor(() => {
      expect(screen.getByText(/invalid card number/i)).toBeInTheDocument()
    })
  })

  it('accepts valid card number', async () => {
    const user = userEvent.setup()
    render(<AddPaymentMethod onSuccess={jest.fn()} onCancel={jest.fn()} />)
    
    const cardInput = screen.getByLabelText(/card number/i)
    await user.type(cardInput, '4532015112830366') // Valid test card
    
    fireEvent.blur(cardInput)
    
    await waitFor(() => {
      expect(screen.queryByText(/invalid card number/i)).not.toBeInTheDocument()
    })
  })

  it('formats card number with spaces', async () => {
    const user = userEvent.setup()
    render(<AddPaymentMethod onSuccess={jest.fn()} onCancel={jest.fn()} />)
    
    const cardInput = screen.getByLabelText(/card number/i)
    await user.type(cardInput, '4532015112830366')
    
    expect(cardInput).toHaveValue('4532 0151 1283 0366')
  })

  it('validates expiry date format', async () => {
    const user = userEvent.setup()
    render(<AddPaymentMethod onSuccess={jest.fn()} onCancel={jest.fn()} />)
    
    const expiryInput = screen.getByLabelText(/expiry date/i)
    await user.type(expiryInput, '13/25')
    
    fireEvent.blur(expiryInput)
    
    await waitFor(() => {
      expect(screen.getByText(/invalid expiry date/i)).toBeInTheDocument()
    })
  })

  it('validates CVV length', async () => {
    const user = userEvent.setup()
    render(<AddPaymentMethod onSuccess={jest.fn()} onCancel={jest.fn()} />)
    
    const cvvInput = screen.getByLabelText(/cvv/i)
    await user.type(cvvInput, '12')
    
    fireEvent.blur(cvvInput)
    
    await waitFor(() => {
      expect(screen.getByText(/cvv must be 3 or 4 digits/i)).toBeInTheDocument()
    })
  })

  it('calls onSuccess when form is submitted successfully', async () => {
    const onSuccess = jest.fn()
    const user = userEvent.setup()
    
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ id: '123', last4: '0366' }),
      })
    )
    
    render(<AddPaymentMethod onSuccess={onSuccess} onCancel={jest.fn()} />)
    
    await user.type(screen.getByLabelText(/card number/i), '4532015112830366')
    await user.type(screen.getByLabelText(/cardholder name/i), 'John Doe')
    await user.type(screen.getByLabelText(/expiry date/i), '12/25')
    await user.type(screen.getByLabelText(/cvv/i), '123')
    
    const submitButton = screen.getByRole('button', { name: /add card/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith({ id: '123', last4: '0366' })
    })
  })

  it('calls onCancel when cancel button is clicked', async () => {
    const onCancel = jest.fn()
    const user = userEvent.setup()
    
    render(<AddPaymentMethod onSuccess={jest.fn()} onCancel={onCancel} />)
    
    const cancelButton = screen.getByRole('button', { name: /cancel/i })
    await user.click(cancelButton)
    
    expect(onCancel).toHaveBeenCalled()
  })

  it('shows loading state during submission', async () => {
    const user = userEvent.setup()
    
    global.fetch = jest.fn(() => new Promise(() => {})) // Never resolves
    
    render(<AddPaymentMethod onSuccess={jest.fn()} onCancel={jest.fn()} />)
    
    await user.type(screen.getByLabelText(/card number/i), '4532015112830366')
    await user.type(screen.getByLabelText(/cardholder name/i), 'John Doe')
    await user.type(screen.getByLabelText(/expiry date/i), '12/25')
    await user.type(screen.getByLabelText(/cvv/i), '123')
    
    const submitButton = screen.getByRole('button', { name: /add card/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/adding/i)).toBeInTheDocument()
    })
  })

  it('displays error message on submission failure', async () => {
    const user = userEvent.setup()
    
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: 'Card declined' }),
      })
    )
    
    render(<AddPaymentMethod onSuccess={jest.fn()} onCancel={jest.fn()} />)
    
    await user.type(screen.getByLabelText(/card number/i), '4532015112830366')
    await user.type(screen.getByLabelText(/cardholder name/i), 'John Doe')
    await user.type(screen.getByLabelText(/expiry date/i), '12/25')
    await user.type(screen.getByLabelText(/cvv/i), '123')
    
    const submitButton = screen.getByRole('button', { name: /add card/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/card declined/i)).toBeInTheDocument()
    })
  })
})
