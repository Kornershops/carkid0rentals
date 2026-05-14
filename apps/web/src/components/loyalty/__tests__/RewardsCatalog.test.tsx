import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RewardsCatalog from '../RewardsCatalog'

const mockRewards = [
  {
    id: '1',
    name: '₦5,000 Discount',
    description: 'Get ₦5,000 off your next booking',
    pointsCost: 500,
    category: 'discount',
    available: true,
    expiryDays: 30,
    image: '/rewards/discount.png',
  },
  {
    id: '2',
    name: 'Free Upgrade',
    description: 'Upgrade to premium vehicle for free',
    pointsCost: 1000,
    category: 'upgrade',
    available: true,
    expiryDays: 60,
    image: '/rewards/upgrade.png',
  },
  {
    id: '3',
    name: 'Airport Pickup',
    description: 'Free airport pickup service',
    pointsCost: 750,
    category: 'service',
    available: false,
    expiryDays: 45,
    image: '/rewards/airport.png',
  },
]

describe('RewardsCatalog', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ 
          rewards: mockRewards,
          userPoints: 1200,
        }),
      })
    )
  })

  it('renders rewards catalog', async () => {
    render(<RewardsCatalog />)
    
    await waitFor(() => {
      expect(screen.getByText(/rewards catalog/i)).toBeInTheDocument()
    })
  })

  it('displays all available rewards', async () => {
    render(<RewardsCatalog />)
    
    await waitFor(() => {
      expect(screen.getByText('₦5,000 Discount')).toBeInTheDocument()
      expect(screen.getByText('Free Upgrade')).toBeInTheDocument()
      expect(screen.getByText('Airport Pickup')).toBeInTheDocument()
    })
  })

  it('shows user points balance', async () => {
    render(<RewardsCatalog />)
    
    await waitFor(() => {
      expect(screen.getByText(/1,200 points/i)).toBeInTheDocument()
    })
  })

  it('shows points cost for each reward', async () => {
    render(<RewardsCatalog />)
    
    await waitFor(() => {
      expect(screen.getByText('500 points')).toBeInTheDocument()
      expect(screen.getByText('1,000 points')).toBeInTheDocument()
      expect(screen.getByText('750 points')).toBeInTheDocument()
    })
  })

  it('indicates if user can afford reward', async () => {
    render(<RewardsCatalog />)
    
    await waitFor(() => {
      const discount = screen.getByText('₦5,000 Discount').closest('.reward-card')
      const upgrade = screen.getByText('Free Upgrade').closest('.reward-card')
      
      expect(discount).not.toHaveClass('insufficient-points')
      expect(upgrade).not.toHaveClass('insufficient-points')
    })
  })

  it('shows insufficient points warning', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ 
          rewards: mockRewards,
          userPoints: 400, // Less than cheapest reward
        }),
      })
    )
    
    render(<RewardsCatalog />)
    
    await waitFor(() => {
      expect(screen.getByText(/insufficient points/i)).toBeInTheDocument()
    })
  })

  it('filters rewards by category', async () => {
    const user = userEvent.setup()
    render(<RewardsCatalog />)
    
    await waitFor(() => {
      expect(screen.getByText('₦5,000 Discount')).toBeInTheDocument()
    })
    
    const categoryFilter = screen.getByLabelText(/category/i)
    await user.selectOptions(categoryFilter, 'discount')
    
    expect(screen.getByText('₦5,000 Discount')).toBeInTheDocument()
    expect(screen.queryByText('Free Upgrade')).not.toBeInTheDocument()
  })

  it('sorts rewards by points cost', async () => {
    const user = userEvent.setup()
    render(<RewardsCatalog />)
    
    await waitFor(() => {
      expect(screen.getByText('₦5,000 Discount')).toBeInTheDocument()
    })
    
    const sortSelect = screen.getByLabelText(/sort by/i)
    await user.selectOptions(sortSelect, 'lowest_points')
    
    const rewards = screen.getAllByRole('article')
    expect(rewards[0]).toHaveTextContent('₦5,000 Discount')
  })

  it('shows reward details on click', async () => {
    const user = userEvent.setup()
    render(<RewardsCatalog />)
    
    await waitFor(() => {
      expect(screen.getByText('₦5,000 Discount')).toBeInTheDocument()
    })
    
    const reward = screen.getByText('₦5,000 Discount')
    await user.click(reward)
    
    await waitFor(() => {
      expect(screen.getByText(/reward details/i)).toBeInTheDocument()
      expect(screen.getByText(/expires in 30 days/i)).toBeInTheDocument()
    })
  })

  it('redeems reward', async () => {
    const user = userEvent.setup()
    
    global.fetch = jest.fn()
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ 
            rewards: mockRewards,
            userPoints: 1200,
          }),
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ 
            success: true,
            rewardCode: 'RWD-123',
          }),
        })
      )
    
    render(<RewardsCatalog />)
    
    await waitFor(() => {
      expect(screen.getByText('₦5,000 Discount')).toBeInTheDocument()
    })
    
    const redeemButton = screen.getAllByRole('button', { name: /redeem/i })[0]
    await user.click(redeemButton)
    
    await waitFor(() => {
      expect(screen.getByText(/confirm redemption/i)).toBeInTheDocument()
    })
    
    const confirmButton = screen.getByRole('button', { name: /confirm/i })
    await user.click(confirmButton)
    
    await waitFor(() => {
      expect(screen.getByText(/reward redeemed/i)).toBeInTheDocument()
      expect(screen.getByText('RWD-123')).toBeInTheDocument()
    })
  })

  it('prevents redeeming unavailable rewards', async () => {
    render(<RewardsCatalog />)
    
    await waitFor(() => {
      expect(screen.getByText('Airport Pickup')).toBeInTheDocument()
    })
    
    const redeemButtons = screen.getAllByRole('button', { name: /redeem/i })
    const unavailableButton = redeemButtons[2] // Airport Pickup
    
    expect(unavailableButton).toBeDisabled()
  })

  it('shows popular rewards', async () => {
    const rewardsWithPopularity = mockRewards.map((r, i) => ({
      ...r,
      redemptions: (3 - i) * 100,
    }))
    
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ 
          rewards: rewardsWithPopularity,
          userPoints: 1200,
        }),
      })
    )
    
    render(<RewardsCatalog />)
    
    await waitFor(() => {
      expect(screen.getByText(/popular rewards/i)).toBeInTheDocument()
    })
  })

  it('shows new rewards badge', async () => {
    const rewardsWithNew = mockRewards.map((r, i) => ({
      ...r,
      isNew: i === 0,
    }))
    
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ 
          rewards: rewardsWithNew,
          userPoints: 1200,
        }),
      })
    )
    
    render(<RewardsCatalog />)
    
    await waitFor(() => {
      expect(screen.getByText(/new/i)).toBeInTheDocument()
    })
  })

  it('shows limited availability warning', async () => {
    const limitedRewards = mockRewards.map((r, i) => ({
      ...r,
      stock: i === 0 ? 5 : 100,
    }))
    
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ 
          rewards: limitedRewards,
          userPoints: 1200,
        }),
      })
    )
    
    render(<RewardsCatalog />)
    
    await waitFor(() => {
      expect(screen.getByText(/only 5 left/i)).toBeInTheDocument()
    })
  })

  it('shows empty state when no rewards', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ 
          rewards: [],
          userPoints: 1200,
        }),
      })
    )
    
    render(<RewardsCatalog />)
    
    await waitFor(() => {
      expect(screen.getByText(/no rewards available/i)).toBeInTheDocument()
    })
  })

  it('shows loading state', () => {
    global.fetch = jest.fn(() => new Promise(() => {}))
    
    render(<RewardsCatalog />)
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('shows error state on fetch failure', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('Network error')))
    
    render(<RewardsCatalog />)
    
    await waitFor(() => {
      expect(screen.getByText(/failed to load rewards/i)).toBeInTheDocument()
    })
  })
})
