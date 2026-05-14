import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PointsBalance from '../PointsBalance'

const mockBalance = {
  totalPoints: 2500,
  availablePoints: 2000,
  pendingPoints: 500,
  tier: 'gold',
  nextTier: 'platinum',
  pointsToNextTier: 1500,
  expiringPoints: 200,
  expiryDate: '2024-03-15',
}

describe('PointsBalance', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ balance: mockBalance }),
      })
    )
  })

  it('renders points balance', async () => {
    render(<PointsBalance />)
    
    await waitFor(() => {
      expect(screen.getByText(/points balance/i)).toBeInTheDocument()
    })
  })

  it('displays total points', async () => {
    render(<PointsBalance />)
    
    await waitFor(() => {
      expect(screen.getByText('2,500')).toBeInTheDocument()
    })
  })

  it('shows available vs pending points', async () => {
    render(<PointsBalance />)
    
    await waitFor(() => {
      expect(screen.getByText(/2,000.*available/i)).toBeInTheDocument()
      expect(screen.getByText(/500.*pending/i)).toBeInTheDocument()
    })
  })

  it('displays current tier', async () => {
    render(<PointsBalance />)
    
    await waitFor(() => {
      expect(screen.getByText(/gold/i)).toBeInTheDocument()
    })
  })

  it('shows progress to next tier', async () => {
    render(<PointsBalance />)
    
    await waitFor(() => {
      expect(screen.getByText(/1,500 points to platinum/i)).toBeInTheDocument()
    })
  })

  it('displays tier progress bar', async () => {
    render(<PointsBalance />)
    
    await waitFor(() => {
      const progressBar = screen.getByRole('progressbar')
      expect(progressBar).toBeInTheDocument()
      // 2500 / (2500 + 1500) = 62.5%
      expect(progressBar).toHaveAttribute('aria-valuenow', '62.5')
    })
  })

  it('warns about expiring points', async () => {
    render(<PointsBalance />)
    
    await waitFor(() => {
      expect(screen.getByText(/200 points expiring/i)).toBeInTheDocument()
      expect(screen.getByText(/march 15/i)).toBeInTheDocument()
    })
  })

  it('shows points value in currency', async () => {
    render(<PointsBalance />)
    
    await waitFor(() => {
      // Assuming 1 point = ₦10
      expect(screen.getByText(/₦20,000/i)).toBeInTheDocument()
    })
  })

  it('navigates to points history', async () => {
    const user = userEvent.setup()
    render(<PointsBalance />)
    
    await waitFor(() => {
      expect(screen.getByText(/points balance/i)).toBeInTheDocument()
    })
    
    const historyLink = screen.getByRole('link', { name: /view history/i })
    await user.click(historyLink)
    
    expect(window.location.pathname).toContain('/loyalty/history')
  })

  it('navigates to rewards catalog', async () => {
    const user = userEvent.setup()
    render(<PointsBalance />)
    
    await waitFor(() => {
      expect(screen.getByText(/points balance/i)).toBeInTheDocument()
    })
    
    const rewardsButton = screen.getByRole('button', { name: /redeem points/i })
    await user.click(rewardsButton)
    
    expect(window.location.pathname).toContain('/loyalty/rewards')
  })

  it('shows tier benefits', async () => {
    const user = userEvent.setup()
    render(<PointsBalance />)
    
    await waitFor(() => {
      expect(screen.getByText(/gold/i)).toBeInTheDocument()
    })
    
    const tierBadge = screen.getByText(/gold/i)
    await user.hover(tierBadge)
    
    await waitFor(() => {
      expect(screen.getByText(/5% bonus points/i)).toBeInTheDocument()
      expect(screen.getByText(/priority support/i)).toBeInTheDocument()
    })
  })

  it('displays points earning rate', async () => {
    render(<PointsBalance />)
    
    await waitFor(() => {
      expect(screen.getByText(/earn 1 point per ₦100 spent/i)).toBeInTheDocument()
    })
  })

  it('shows recent points activity', async () => {
    const balanceWithActivity = {
      ...mockBalance,
      recentActivity: [
        { type: 'earned', amount: 100, description: 'Booking completed' },
        { type: 'redeemed', amount: -50, description: 'Discount applied' },
      ],
    }
    
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ balance: balanceWithActivity }),
      })
    )
    
    render(<PointsBalance />)
    
    await waitFor(() => {
      expect(screen.getByText(/recent activity/i)).toBeInTheDocument()
      expect(screen.getByText(/booking completed/i)).toBeInTheDocument()
      expect(screen.getByText(/discount applied/i)).toBeInTheDocument()
    })
  })

  it('refreshes balance', async () => {
    const user = userEvent.setup()
    render(<PointsBalance />)
    
    await waitFor(() => {
      expect(screen.getByText('2,500')).toBeInTheDocument()
    })
    
    const refreshButton = screen.getByRole('button', { name: /refresh/i })
    await user.click(refreshButton)
    
    expect(global.fetch).toHaveBeenCalledTimes(2)
  })

  it('shows loading state', () => {
    global.fetch = jest.fn(() => new Promise(() => {}))
    
    render(<PointsBalance />)
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('shows error state on fetch failure', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('Network error')))
    
    render(<PointsBalance />)
    
    await waitFor(() => {
      expect(screen.getByText(/failed to load balance/i)).toBeInTheDocument()
    })
  })
})
