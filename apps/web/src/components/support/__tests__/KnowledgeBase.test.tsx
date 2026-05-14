import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import KnowledgeBase from '../KnowledgeBase'

const mockArticles = [
  {
    id: '1',
    title: 'How to cancel a booking',
    slug: 'how-to-cancel-booking',
    category: 'booking',
    excerpt: 'Learn how to cancel your booking and get a refund',
    views: 150,
    helpful: 45,
    lastUpdated: '2024-01-10T10:00:00Z',
  },
  {
    id: '2',
    title: 'Payment methods accepted',
    slug: 'payment-methods',
    category: 'payment',
    excerpt: 'We accept various payment methods including cards and bank transfers',
    views: 200,
    helpful: 60,
    lastUpdated: '2024-01-12T15:00:00Z',
  },
  {
    id: '3',
    title: 'Vehicle insurance coverage',
    slug: 'insurance-coverage',
    category: 'vehicle',
    excerpt: 'Understanding what is covered by our insurance',
    views: 100,
    helpful: 30,
    lastUpdated: '2024-01-08T12:00:00Z',
  },
]

const mockCategories = [
  { id: 'booking', name: 'Booking', count: 15 },
  { id: 'payment', name: 'Payment', count: 12 },
  { id: 'vehicle', name: 'Vehicle', count: 10 },
  { id: 'account', name: 'Account', count: 8 },
]

describe('KnowledgeBase', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ 
          articles: mockArticles,
          categories: mockCategories,
        }),
      })
    )
  })

  it('renders knowledge base articles', async () => {
    render(<KnowledgeBase />)
    
    await waitFor(() => {
      expect(screen.getByText('How to cancel a booking')).toBeInTheDocument()
      expect(screen.getByText('Payment methods accepted')).toBeInTheDocument()
      expect(screen.getByText('Vehicle insurance coverage')).toBeInTheDocument()
    })
  })

  it('displays article categories', async () => {
    render(<KnowledgeBase />)
    
    await waitFor(() => {
      expect(screen.getByText('Booking')).toBeInTheDocument()
      expect(screen.getByText('Payment')).toBeInTheDocument()
      expect(screen.getByText('Vehicle')).toBeInTheDocument()
    })
  })

  it('shows article count per category', async () => {
    render(<KnowledgeBase />)
    
    await waitFor(() => {
      expect(screen.getByText('15')).toBeInTheDocument()
      expect(screen.getByText('12')).toBeInTheDocument()
      expect(screen.getByText('10')).toBeInTheDocument()
    })
  })

  it('filters articles by category', async () => {
    const user = userEvent.setup()
    render(<KnowledgeBase />)
    
    await waitFor(() => {
      expect(screen.getByText('How to cancel a booking')).toBeInTheDocument()
    })
    
    const bookingCategory = screen.getByText('Booking')
    await user.click(bookingCategory)
    
    expect(screen.getByText('How to cancel a booking')).toBeInTheDocument()
    expect(screen.queryByText('Payment methods accepted')).not.toBeInTheDocument()
  })

  it('searches articles', async () => {
    const user = userEvent.setup()
    
    global.fetch = jest.fn()
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ 
            articles: mockArticles,
            categories: mockCategories,
          }),
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ 
            articles: [mockArticles[0]],
          }),
        })
      )
    
    render(<KnowledgeBase />)
    
    await waitFor(() => {
      expect(screen.getByText('How to cancel a booking')).toBeInTheDocument()
    })
    
    const searchInput = screen.getByPlaceholderText(/search articles/i)
    await user.type(searchInput, 'cancel')
    await user.keyboard('{Enter}')
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('search=cancel'),
        expect.any(Object)
      )
    })
  })

  it('displays popular articles', async () => {
    render(<KnowledgeBase />)
    
    await waitFor(() => {
      expect(screen.getByText(/popular articles/i)).toBeInTheDocument()
    })
    
    const articles = screen.getAllByRole('article')
    expect(articles[0]).toHaveTextContent('Payment methods accepted') // Most views
  })

  it('shows article view count', async () => {
    render(<KnowledgeBase />)
    
    await waitFor(() => {
      expect(screen.getByText('150 views')).toBeInTheDocument()
      expect(screen.getByText('200 views')).toBeInTheDocument()
    })
  })

  it('shows helpful count', async () => {
    render(<KnowledgeBase />)
    
    await waitFor(() => {
      expect(screen.getByText('45 found helpful')).toBeInTheDocument()
      expect(screen.getByText('60 found helpful')).toBeInTheDocument()
    })
  })

  it('navigates to article detail', async () => {
    const user = userEvent.setup()
    render(<KnowledgeBase />)
    
    await waitFor(() => {
      expect(screen.getByText('How to cancel a booking')).toBeInTheDocument()
    })
    
    const article = screen.getByText('How to cancel a booking')
    await user.click(article)
    
    expect(window.location.pathname).toContain('/knowledge-base/how-to-cancel-booking')
  })

  it('sorts articles by relevance', async () => {
    const user = userEvent.setup()
    render(<KnowledgeBase />)
    
    await waitFor(() => {
      expect(screen.getByText('How to cancel a booking')).toBeInTheDocument()
    })
    
    const sortSelect = screen.getByLabelText(/sort by/i)
    await user.selectOptions(sortSelect, 'most_helpful')
    
    const articles = screen.getAllByRole('article')
    expect(articles[0]).toHaveTextContent('Payment methods accepted')
  })

  it('shows recently updated articles', async () => {
    const user = userEvent.setup()
    render(<KnowledgeBase />)
    
    await waitFor(() => {
      expect(screen.getByText('How to cancel a booking')).toBeInTheDocument()
    })
    
    const sortSelect = screen.getByLabelText(/sort by/i)
    await user.selectOptions(sortSelect, 'recently_updated')
    
    const articles = screen.getAllByRole('article')
    expect(articles[0]).toHaveTextContent('Payment methods accepted')
  })

  it('shows empty state when no articles', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ 
          articles: [],
          categories: mockCategories,
        }),
      })
    )
    
    render(<KnowledgeBase />)
    
    await waitFor(() => {
      expect(screen.getByText(/no articles found/i)).toBeInTheDocument()
    })
  })

  it('shows loading state', () => {
    global.fetch = jest.fn(() => new Promise(() => {}))
    
    render(<KnowledgeBase />)
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('shows error state on fetch failure', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('Network error')))
    
    render(<KnowledgeBase />)
    
    await waitFor(() => {
      expect(screen.getByText(/failed to load articles/i)).toBeInTheDocument()
    })
  })

  it('displays breadcrumb navigation', async () => {
    render(<KnowledgeBase category="booking" />)
    
    await waitFor(() => {
      expect(screen.getByText(/home/i)).toBeInTheDocument()
      expect(screen.getByText(/knowledge base/i)).toBeInTheDocument()
      expect(screen.getByText(/booking/i)).toBeInTheDocument()
    })
  })

  it('shows related articles', async () => {
    render(<KnowledgeBase />)
    
    await waitFor(() => {
      expect(screen.getByText(/related articles/i)).toBeInTheDocument()
    })
  })
})
