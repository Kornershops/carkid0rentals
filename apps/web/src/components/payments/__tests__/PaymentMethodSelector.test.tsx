import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PaymentMethodSelector from '../PaymentMethodSelector'

const mockPaymentMethods = [
  { id: 'card-1', type: 'card', last4: '4242', brand: 'visa', isDefault: true },
  { id: 'card-2', type: 'card', last4: '5555', brand: 'mastercard', isDefault: false },
  { id: 'bank-1', type: 'bank_transfer', bankName: 'GTBank', accountLast4: '1234', isDefault: false },
]

describe('PaymentMethodSelector', () => {
  it('renders payment method options', () => {
    render(<PaymentMethodSelector methods={mockPaymentMethods} onSelect={jest.fn()} />)
    
    expect(screen.getByText('****4242')).toBeInTheDocument()
    expect(screen.getByText('****5555')).toBeInTheDocument()
    expect(screen.getByText('GTBank')).toBeInTheDocument()
  })

  it('pre-selects default payment method', () => {
    render(<PaymentMethodSelector methods={mockPaymentMethods} onSelect={jest.fn()} />)
    
    const defaultMethod = screen.getByTestId('method-card-1')
    expect(defaultMethod).toHaveClass('selected')
  })

  it('selects payment method on click', async () => {
    const onSelect = jest.fn()
    const user = userEvent.setup()
    
    render(<PaymentMethodSelector methods={mockPaymentMethods} onSelect={onSelect} />)
    
    const method = screen.getByTestId('method-card-2')
    await user.click(method)
    
    expect(onSelect).toHaveBeenCalledWith(mockPaymentMethods[1])
  })

  it('displays card brand icons', () => {
    render(<PaymentMethodSelector methods={mockPaymentMethods} onSelect={jest.fn()} />)
    
    expect(screen.getByAltText(/visa/i)).toBeInTheDocument()
    expect(screen.getByAltText(/mastercard/i)).toBeInTheDocument()
  })

  it('shows add new payment method option', () => {
    render(<PaymentMethodSelector methods={mockPaymentMethods} onSelect={jest.fn()} />)
    
    expect(screen.getByText(/add new payment method/i)).toBeInTheDocument()
  })

  it('opens add payment method modal', async () => {
    const user = userEvent.setup()
    render(<PaymentMethodSelector methods={mockPaymentMethods} onSelect={jest.fn()} />)
    
    const addButton = screen.getByText(/add new payment method/i)
    await user.click(addButton)
    
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })
  })

  it('filters by payment type', async () => {
    const user = userEvent.setup()
    render(<PaymentMethodSelector methods={mockPaymentMethods} onSelect={jest.fn()} />)
    
    const filterSelect = screen.getByLabelText(/filter by type/i)
    await user.selectOptions(filterSelect, 'card')
    
    expect(screen.getByText('****4242')).toBeInTheDocument()
    expect(screen.queryByText('GTBank')).not.toBeInTheDocument()
  })

  it('shows payment method details on hover', async () => {
    const user = userEvent.setup()
    render(<PaymentMethodSelector methods={mockPaymentMethods} onSelect={jest.fn()} />)
    
    const method = screen.getByTestId('method-card-1')
    await user.hover(method)
    
    await waitFor(() => {
      expect(screen.getByText(/expires/i)).toBeInTheDocument()
    })
  })

  it('disables expired payment methods', () => {
    const expiredMethod = {
      ...mockPaymentMethods[0],
      expiryMonth: 1,
      expiryYear: 2020,
    }
    
    render(<PaymentMethodSelector methods={[expiredMethod]} onSelect={jest.fn()} />)
    
    const method = screen.getByTestId('method-card-1')
    expect(method).toHaveAttribute('disabled')
    expect(screen.getByText(/expired/i)).toBeInTheDocument()
  })

  it('shows recommended payment method', () => {
    const methodsWithRecommended = mockPaymentMethods.map((m, i) => ({
      ...m,
      recommended: i === 0,
    }))
    
    render(<PaymentMethodSelector methods={methodsWithRecommended} onSelect={jest.fn()} />)
    
    expect(screen.getByText(/recommended/i)).toBeInTheDocument()
  })

  it('displays processing fees for each method', () => {
    const methodsWithFees = mockPaymentMethods.map(m => ({
      ...m,
      fee: m.type === 'card' ? 1.5 : 0,
    }))
    
    render(<PaymentMethodSelector methods={methodsWithFees} onSelect={jest.fn()} amount={10000} />)
    
    expect(screen.getByText(/\+₦150/i)).toBeInTheDocument() // 1.5% of 10000
    expect(screen.getByText(/free/i)).toBeInTheDocument()
  })

  it('sorts methods by usage frequency', async () => {
    const user = userEvent.setup()
    const methodsWithUsage = mockPaymentMethods.map((m, i) => ({
      ...m,
      usageCount: i * 5,
    }))
    
    render(<PaymentMethodSelector methods={methodsWithUsage} onSelect={jest.fn()} />)
    
    const sortSelect = screen.getByLabelText(/sort by/i)
    await user.selectOptions(sortSelect, 'most_used')
    
    const methods = screen.getAllByTestId(/method-/)
    expect(methods[0]).toHaveTextContent('GTBank')
  })

  it('shows empty state when no methods', () => {
    render(<PaymentMethodSelector methods={[]} onSelect={jest.fn()} />)
    
    expect(screen.getByText(/no payment methods/i)).toBeInTheDocument()
  })

  it('validates method before selection', async () => {
    const onSelect = jest.fn()
    const user = userEvent.setup()
    
    const invalidMethod = {
      ...mockPaymentMethods[0],
      status: 'verification_required',
    }
    
    render(<PaymentMethodSelector methods={[invalidMethod]} onSelect={onSelect} />)
    
    const method = screen.getByTestId('method-card-1')
    await user.click(method)
    
    await waitFor(() => {
      expect(screen.getByText(/verification required/i)).toBeInTheDocument()
    })
    
    expect(onSelect).not.toHaveBeenCalled()
  })

  it('shows security badges for verified methods', () => {
    const verifiedMethods = mockPaymentMethods.map(m => ({
      ...m,
      verified: true,
    }))
    
    render(<PaymentMethodSelector methods={verifiedMethods} onSelect={jest.fn()} />)
    
    expect(screen.getAllByText(/verified/i)).toHaveLength(3)
  })
})
