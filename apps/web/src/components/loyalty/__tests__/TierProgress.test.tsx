import { render, screen, waitFor } from '@testing-library/react'
import TierProgress from '../TierProgress'

const mockTierData = {
  currentTier: 'gold',
  currentPoints: 2500,
  nextTier: 'platinum',
  pointsToNextTier: 1500,
  tierBenefits: {
    gold: ['5% bonus points', 'Priority support', 'Free cancellation'],
    platinum: ['10% bonus points', 'VIP support', 'Free upgrades', 'Airport lounge access'],
  },
  progress: 62.5, // 2500 / (2500 + 1500)
}

describe('TierProgress', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ tierData: mockTierData }),
      })
    )
  })

  it('renders tier progress', async () => {
    render(<TierProgress />)
    
    await waitFor(() => {
      expect(screen.getByText(/tier progress/i)).toBeInTheDocument()
    })
  })

  it('displays current tier', async () => {
    render(<TierProgress />)
    
    await waitFor(() => {
      expect(screen.getByText(/gold/i)).toBeInTheDocument()
    })
  })

  it('shows next tier', async () => {
    render(<TierProgress />)
    
    await waitFor(() => {
      expect(screen.getByText(/platinum/i)).toBeInTheDocument()
    })
  })

  it('displays points to next tier', async () => {
    render(<TierProgress />)
    
    await waitFor(() => {
      expect(screen.getByText(/1,500 points to platinum/i)).toBeInTheDocument()
    })
  })

  it('shows progress bar', async () => {
    render(<TierProgress />)
    
    await waitFor(() => {
      const progressBar = screen.getByRole('progressbar')
      expect(progressBar).toBeInTheDocument()
      expect(progressBar).toHaveAttribute('aria-valuenow', '62.5')
    })
  })

  it('displays current tier benefits', async () => {
    render(<TierProgress />)
    
    await waitFor(() => {
      expect(screen.getByText('5% bonus points')).toBeInTheDocument()
      expect(screen.getByText('Priority support')).toBeInTheDocument()
      expect(screen.getByText('Free cancellation')).toBeInTheDocument()
    })
  })

  it('shows next tier benefits', async () => {
    render(<TierProgress />)
    
    await waitFor(() => {
      expect(screen.getByText('10% bonus points')).toBeInTheDocument()
      expect(screen.getByText('VIP support')).toBeInTheDocument()
      expect(screen.getByText('Free upgrades')).toBeInTheDocument()
    })
  })

  it('displays tier comparison', async () => {
    render(<TierProgress />)
    
    await waitFor(() => {
      expect(screen.getByText(/compare tiers/i)).toBeInTheDocument()
    })
  })

  it('shows all tier levels', async () => {
    render(<TierProgress />)
    
    await waitFor(() => {
      expect(screen.getByText(/bronze/i)).toBeInTheDocument()
      expect(screen.getByText(/silver/i)).toBeInTheDocument()
      expect(screen.getByText(/gold/i)).toBeInTheDocument()
      expect(screen.getByText(/platinum/i)).toBeInTheDocument()
    })
  })

  it('highlights current tier', async () => {
    render(<TierProgress />)
    
    await waitFor(() => {
      const goldTier = screen.getByText(/gold/i).closest('.tier-badge')
      expect(goldTier).toHaveClass('current-tier')
    })
  })

  it('shows tier requirements', async () => {
    render(<TierProgress />)
    
    await waitFor(() => {
      expect(screen.getByText(/0-999 points/i)).toBeInTheDocument() // Bronze
      expect(screen.getByText(/1,000-2,499 points/i)).toBeInTheDocument() // Silver
      expect(screen.getByText(/2,500-4,999 points/i)).toBeInTheDocument() // Gold
      expect(screen.getByText(/5,000\+ points/i)).toBeInTheDocument() // Platinum
    })
  })

  it('displays earning tips', async () => {
    render(<TierProgress />)
    
    await waitFor(() => {
      expect(screen.getByText(/how to earn more points/i)).toBeInTheDocument()
      expect(screen.getByText(/complete bookings/i)).toBeInTheDocument()
      expect(screen.getByText(/refer friends/i)).toBeInTheDocument()
    })
  })

  it('shows tier expiry information', async () => {
    const tierDataWithExpiry = {
      ...mockTierData,
      expiryDate: '2024-12-31',
    }
    
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ tierData: tierDataWithExpiry }),
      })
    )
    
    render(<TierProgress />)
    
    await waitFor(() => {
      expect(screen.getByText(/tier expires/i)).toBeInTheDocument()
      expect(screen.getByText(/dec 31/i)).toBeInTheDocument()
    })
  })

  it('shows congratulations for top tier', async () => {
    const topTierData = {
      ...mockTierData,
      currentTier: 'platinum',
      nextTier: null,
      pointsToNextTier: 0,
    }
    
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ tierData: topTierData }),
      })
    )
    
    render(<TierProgress />)
    
    await waitFor(() => {
      expect(screen.getByText(/you've reached the highest tier/i)).toBeInTheDocument()
    })
  })

  it('displays tier history', async () => {
    const tierDataWithHistory = {
      ...mockTierData,
      history: [
        { tier: 'silver', achievedAt: '2023-06-01' },
        { tier: 'gold', achievedAt: '2023-12-01' },
      ],
    }
    
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ tierData: tierDataWithHistory }),
      })
    )
    
    render(<TierProgress />)
    
    await waitFor(() => {
      expect(screen.getByText(/tier history/i)).toBeInTheDocument()
      expect(screen.getByText(/silver.*jun 2023/i)).toBeInTheDocument()
      expect(screen.getByText(/gold.*dec 2023/i)).toBeInTheDocument()
    })
  })

  it('shows loading state', () => {
    global.fetch = jest.fn(() => new Promise(() => {}))
    
    render(<TierProgress />)
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('shows error state on fetch failure', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('Network error')))
    
    render(<TierProgress />)
    
    await waitFor(() => {
      expect(screen.getByText(/failed to load tier data/i)).toBeInTheDocument()
    })
  })
})
