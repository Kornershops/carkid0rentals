import * as PaymentComponents from '../index'

describe('Payments Index', () => {
  it('exports AddPaymentMethod component', () => {
    expect(PaymentComponents.AddPaymentMethod).toBeDefined()
  })

  it('exports PaymentHistory component', () => {
    expect(PaymentComponents.PaymentHistory).toBeDefined()
  })

  it('exports SplitPaymentForm component', () => {
    expect(PaymentComponents.SplitPaymentForm).toBeDefined()
  })

  it('exports InstallmentCalculator component', () => {
    expect(PaymentComponents.InstallmentCalculator).toBeDefined()
  })

  it('exports RefundRequest component', () => {
    expect(PaymentComponents.RefundRequest).toBeDefined()
  })

  it('exports SavedCards component', () => {
    expect(PaymentComponents.SavedCards).toBeDefined()
  })

  it('exports PaymentMethodSelector component', () => {
    expect(PaymentComponents.PaymentMethodSelector).toBeDefined()
  })

  it('exports all components as named exports', () => {
    const exports = Object.keys(PaymentComponents)
    expect(exports).toContain('AddPaymentMethod')
    expect(exports).toContain('PaymentHistory')
    expect(exports).toContain('SplitPaymentForm')
    expect(exports).toContain('InstallmentCalculator')
    expect(exports).toContain('RefundRequest')
    expect(exports).toContain('SavedCards')
    expect(exports).toContain('PaymentMethodSelector')
  })
})
