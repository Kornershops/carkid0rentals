import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FAQSearch from '../FAQSearch'

const mockFAQs = [
  {
    id: '1',
    question: 'How do I cancel my booking?',
    answer: 'You can cancel your booking from the bookings page. Refund depends on cancellation policy.',
    category: 'booking',
    helpful: 45,
    views: 150,
  },
  {
    id: '2',
    question: 'What payment methods do you accept?',
    answer: 'We accept credit cards, debit cards, and bank transfers.',
    category: 'payment',
    helpful: 60,
    views: 200,
  },
  {
    id: '3',
    question: 'How do I verify my account?',
    answer: 'Upload your ID and proof of address in the account settings.',
    category: 'account',
    helpful: 30,
    views: 100,
  },
]

describe('FAQSearch', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ faqs: mockFAQs }),
      })
    )
  })

  it('renders FAQ search', async () => {
    render(<FAQSearch />)
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/search faqs/i)).toBeInTheDocument()
    })
  })

  it('displays all FAQs initially', async () => {
    render(<FAQSearch />)
    
    await waitFor(() => {
      expect(screen.getByText('How do I cancel my booking?')).toBeInTheDocument()
      expect(screen.getByText('What payment methods do you accept?')).toBeInTheDocument()
      expect(screen.getByText('How do I verify my account?')).toBeInTheDocument()
    })
  })

  it('searches FAQs by keyword', async () => {
    const user = userEvent.setup()
    render(<FAQSearch />)
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/search faqs/i)).toBeInTheDocument()
    })
    
    const searchInput = screen.getByPlaceholderText(/search faqs/i)
    await user.type(searchInput, 'cancel')
    
    await waitFor(() => {
      expect(screen.getByText('How do I cancel my booking?')).toBeInTheDocument()
      expect(screen.queryByText('What payment methods do you accept?')).not.toBeInTheDocument()
    })
  })

  it('shows autocomplete suggestions', async () => {
    const user = userEvent.setup()
    
    global.fetch = jest.fn()
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ faqs: mockFAQs }),
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ 
            suggestions: ['cancel booking', 'cancellation policy', 'cancel refund'],
          }),
        })
      )
    
    render(<FAQSearch />)
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/search faqs/i)).toBeInTheDocument()
    })
    
    const searchInput = screen.getByPlaceholderText(/search faqs/i)
    await user.type(searchInput, 'can')
    
    await waitFor(() => {
      expect(screen.getByText('cancel booking')).toBeInTheDocument()
      expect(screen.getByText('cancellation policy')).toBeInTheDocument()
    })
  })

  it('selects suggestion on click', async () => {
    const user = userEvent.setup()
    
    global.fetch = jest.fn()
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ faqs: mockFAQs }),
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ 
            suggestions: ['cancel booking'],
          }),
        })
      )
    
    render(<FAQSearch />)
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/search faqs/i)).toBeInTheDocument()
    })
    
    const searchInput = screen.getByPlaceholderText(/search faqs/i)
    await user.type(searchInput, 'can')
    
    await waitFor(() => {
      expect(screen.getByText('cancel booking')).toBeInTheDocument()
    })
    
    const suggestion = screen.getByText('cancel booking')
    await user.click(suggestion)
    
    expect(searchInput).toHaveValue('cancel booking')
  })

  it('filters by category', async () => {
    const user = userEvent.setup()
    render(<FAQSearch />)
    
    await waitFor(() => {
      expect(screen.getByText('How do I cancel my booking?')).toBeInTheDocument()
    })
    
    const categoryFilter = screen.getByLabelText(/category/i)
    await user.selectOptions(categoryFilter, 'booking')
    
    expect(screen.getByText('How do I cancel my booking?')).toBeInTheDocument()
    expect(screen.queryByText('What payment methods do you accept?')).not.toBeInTheDocument()
  })

  it('expands FAQ to show answer', async () => {
    const user = userEvent.setup()
    render(<FAQSearch />)
    
    await waitFor(() => {
      expect(screen.getByText('How do I cancel my booking?')).toBeInTheDocument()
    })
    
    const faq = screen.getByText('How do I cancel my booking?')
    await user.click(faq)
    
    await waitFor(() => {
      expect(screen.getByText(/refund depends on cancellation policy/i)).toBeInTheDocument()
    })
  })

  it('marks FAQ as helpful', async () => {
    const user = userEvent.setup()
    
    global.fetch = jest.fn()
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ faqs: mockFAQs }),
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        })
      )
    
    render(<FAQSearch />)
    
    await waitFor(() => {
      expect(screen.getByText('How do I cancel my booking?')).toBeInTheDocument()
    })
    
    const faq = screen.getByText('How do I cancel my booking?')
    await user.click(faq)
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /helpful/i })).toBeInTheDocument()
    })
    
    const helpfulButton = screen.getByRole('button', { name: /helpful/i })
    await user.click(helpfulButton)
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/faqs/1/helpful'),
        expect.any(Object)
      )
    })
  })

  it('shows popular FAQs', async () => {
    render(<FAQSearch />)
    
    await waitFor(() => {
      expect(screen.getByText(/popular questions/i)).toBeInTheDocument()
    })
    
    const faqs = screen.getAllByRole('button')
    expect(faqs[0]).toHaveTextContent('What payment methods') // Most views
  })

  it('shows no results message', async () => {
    const user = userEvent.setup()
    render(<FAQSearch />)
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/search faqs/i)).toBeInTheDocument()
    })
    
    const searchInput = screen.getByPlaceholderText(/search faqs/i)
    await user.type(searchInput, 'xyz123nonexistent')
    
    await waitFor(() => {
      expect(screen.getByText(/no faqs found/i)).toBeInTheDocument()
    })
  })

  it('suggests creating ticket for no results', async () => {
    const user = userEvent.setup()
    render(<FAQSearch />)
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/search faqs/i)).toBeInTheDocument()
    })
    
    const searchInput = screen.getByPlaceholderText(/search faqs/i)
    await user.type(searchInput, 'xyz123')
    
    await waitFor(() => {
      expect(screen.getByText(/create a support ticket/i)).toBeInTheDocument()
    })
  })

  it('clears search', async () => {
    const user = userEvent.setup()
    render(<FAQSearch />)
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/search faqs/i)).toBeInTheDocument()
    })
    
    const searchInput = screen.getByPlaceholderText(/search faqs/i)
    await user.type(searchInput, 'cancel')
    
    const clearButton = screen.getByRole('button', { name: /clear/i })
    await user.click(clearButton)
    
    expect(searchInput).toHaveValue('')
  })

  it('shows loading state', () => {
    global.fetch = jest.fn(() => new Promise(() => {}))
    
    render(<FAQSearch />)
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('shows error state on fetch failure', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('Network error')))
    
    render(<FAQSearch />)
    
    await waitFor(() => {
      expect(screen.getByText(/failed to load faqs/i)).toBeInTheDocument()
    })
  })
})
