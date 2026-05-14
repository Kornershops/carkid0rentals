import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SavedCards from '../SavedCards'

const mockCards = [
  {
    id: '1',
    last4: '4242',
    brand: 'visa',
    expiryMonth: 12,
    expiryYear: 2025,
    isDefault: true,
    holderName: 'John Doe',
  },
  {
    id: '2',
    last4: '5555',
    brand: 'mastercard',
    expiryMonth: 6,
    expiryYear: 2024,
    isDefault: false,
    holderName: 'John Doe',
  },
  {
    id: '3',
    last4: '3782',
    brand: 'amex',
    expiryMonth: 3,
    expiryYear: 2026,
    isDefault: false,
    holderName: 'John Doe',
  },
]

describe('SavedCards', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ cards: mockCards }),
      })
    )
  })

  it('renders saved cards list', async () => {
    render(<SavedCards />)
    
    await waitFor(() => {
      expect(screen.getByText('****4242')).toBeInTheDocument()
      expect(screen.getByText('****5555')).toBeInTheDocument()
      expect(screen.getByText('****3782')).toBeInTheDocument()
    })
  })

  it('displays card brand icons', async () => {
    render(<SavedCards />)
    
    await waitFor(() => {
      expect(screen.getByAltText(/visa/i)).toBeInTheDocument()
      expect(screen.getByAltText(/mastercard/i)).toBeInTheDocument()
      expect(screen.getByAltText(/amex/i)).toBeInTheDocument()
    })
  })

  it('shows default card badge', async () => {
    render(<SavedCards />)
    
    await waitFor(() => {
      expect(screen.getByText(/default/i)).toBeInTheDocument()
    })
  })

  it('displays card expiry dates', async () => {
    render(<SavedCards />)
    
    await waitFor(() => {
      expect(screen.getByText('12/25')).toBeInTheDocument()
      expect(screen.getByText('06/24')).toBeInTheDocument()
      expect(screen.getByText('03/26')).toBeInTheDocument()
    })
  })

  it('highlights expired cards', async () => {
    const expiredCard = {
      ...mockCards[1],
      expiryMonth: 1,
      expiryYear: 2023,
    }
    
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ cards: [expiredCard] }),
      })
    )
    
    render(<SavedCards />)
    
    await waitFor(() => {
      expect(screen.getByText(/expired/i)).toBeInTheDocument()
    })
  })

  it('warns about cards expiring soon', async () => {
    const now = new Date()
    const soonCard = {
      ...mockCards[1],
      expiryMonth: now.getMonth() + 2,
      expiryYear: now.getFullYear(),
    }
    
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ cards: [soonCard] }),
      })
    )
    
    render(<SavedCards />)
    
    await waitFor(() => {
      expect(screen.getByText(/expiring soon/i)).toBeInTheDocument()
    })
  })

  it('sets card as default', async () => {
    const user = userEvent.setup()
    
    global.fetch = jest.fn()
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ cards: mockCards }),
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        })
      )
    
    render(<SavedCards />)
    
    await waitFor(() => {
      expect(screen.getByText('****5555')).toBeInTheDocument()
    })
    
    const setDefaultButtons = screen.getAllByRole('button', { name: /set as default/i })
    await user.click(setDefaultButtons[0])
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/payment-methods/2/default'),
        expect.any(Object)
      )
    })
  })

  it('removes card with confirmation', async () => {
    const user = userEvent.setup()
    
    global.fetch = jest.fn()
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ cards: mockCards }),
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        })
      )
    
    render(<SavedCards />)
    
    await waitFor(() => {
      expect(screen.getByText('****5555')).toBeInTheDocument()
    })
    
    const removeButtons = screen.getAllByRole('button', { name: /remove/i })
    await user.click(removeButtons[1])
    
    // Confirm deletion
    await waitFor(() => {
      expect(screen.getByText(/are you sure/i)).toBeInTheDocument()
    })
    
    const confirmButton = screen.getByRole('button', { name: /confirm/i })
    await user.click(confirmButton)
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/payment-methods/2'),
        expect.objectContaining({ method: 'DELETE' })
      )
    })
  })

  it('prevents removing default card', async () => {
    const user = userEvent.setup()
    render(<SavedCards />)
    
    await waitFor(() => {
      expect(screen.getByText('****4242')).toBeInTheDocument()
    })
    
    const removeButtons = screen.getAllByRole('button', { name: /remove/i })
    const defaultCardRemoveButton = removeButtons[0]
    
    expect(defaultCardRemoveButton).toBeDisabled()
  })

  it('edits card details', async () => {
    const user = userEvent.setup()
    render(<SavedCards />)
    
    await waitFor(() => {
      expect(screen.getByText('****4242')).toBeInTheDocument()
    })
    
    const editButtons = screen.getAllByRole('button', { name: /edit/i })
    await user.click(editButtons[0])
    
    // Edit form should appear
    await waitFor(() => {
      expect(screen.getByLabelText(/cardholder name/i)).toBeInTheDocument()
    })
    
    await user.clear(screen.getByLabelText(/cardholder name/i))
    await user.type(screen.getByLabelText(/cardholder name/i), 'Jane Doe')
    
    const saveButton = screen.getByRole('button', { name: /save/i })
    await user.click(saveButton)
    
    await waitFor(() => {
      expect(screen.getByText(/card updated/i)).toBeInTheDocument()
    })
  })

  it('shows empty state when no cards', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ cards: [] }),
      })
    )
    
    render(<SavedCards />)
    
    await waitFor(() => {
      expect(screen.getByText(/no saved cards/i)).toBeInTheDocument()
    })
  })

  it('navigates to add card form', async () => {
    const user = userEvent.setup()
    render(<SavedCards onAddCard={jest.fn()} />)
    
    await waitFor(() => {
      expect(screen.getByText('****4242')).toBeInTheDocument()
    })
    
    const addButton = screen.getByRole('button', { name: /add new card/i })
    await user.click(addButton)
    
    expect(window.location.pathname).toContain('/add-card')
  })

  it('shows loading state', () => {
    global.fetch = jest.fn(() => new Promise(() => {}))
    
    render(<SavedCards />)
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('shows error state on fetch failure', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('Network error')))
    
    render(<SavedCards />)
    
    await waitFor(() => {
      expect(screen.getByText(/failed to load cards/i)).toBeInTheDocument()
    })
  })

  it('displays card usage statistics', async () => {
    const cardsWithStats = mockCards.map(card => ({
      ...card,
      lastUsed: '2024-01-15T10:00:00Z',
      usageCount: 5,
    }))
    
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ cards: cardsWithStats }),
      })
    )
    
    render(<SavedCards />)
    
    await waitFor(() => {
      expect(screen.getByText(/last used/i)).toBeInTheDocument()
      expect(screen.getByText(/5 times/i)).toBeInTheDocument()
    })
  })
})
