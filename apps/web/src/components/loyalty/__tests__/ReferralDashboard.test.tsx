import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ReferralDashboard from '../ReferralDashboard'

const mockReferralData = {
  referralCode: 'JOHN2024',
  referralLink: 'https://carkid0.com/ref/JOHN2024',
  totalReferrals: 15,
  successfulReferrals: 12,
  pendingReferrals: 3,
  pointsEarned: 1200,
  referrals: [
    {
      id: '1',
      name: 'Jane Doe',
      status: 'completed',
      pointsEarned: 100,
      joinedAt: '2024-01-10T10:00:00Z',
    },
    {
      id: '2',
      name: 'Bob Smith',
      status: 'pending',
      pointsEarned: 0,
      joinedAt: '2024-01-15T15:00:00Z',
    },
  ],
}

describe('ReferralDashboard', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ referralData: mockReferralData }),
      })
    )
  })

  it('renders referral dashboard', async () => {
    render(<ReferralDashboard />)
    
    await waitFor(() => {
      expect(screen.getByText(/referral program/i)).toBeInTheDocument()
    })
  })

  it('displays referral code', async () => {
    render(<ReferralDashboard />)
    
    await waitFor(() => {
      expect(screen.getByText('JOHN2024')).toBeInTheDocument()
    })
  })

  it('copies referral code to clipboard', async () => {
    const user = userEvent.setup()
    const mockClipboard = { writeText: jest.fn() }
    Object.assign(navigator, { clipboard: mockClipboard })
    
    render(<ReferralDashboard />)
    
    await waitFor(() => {
      expect(screen.getByText('JOHN2024')).toBeInTheDocument()
    })
    
    const copyButton = screen.getByRole('button', { name: /copy code/i })
    await user.click(copyButton)
    
    expect(mockClipboard.writeText).toHaveBeenCalledWith('JOHN2024')
    await waitFor(() => {
      expect(screen.getByText(/copied/i)).toBeInTheDocument()
    })
  })

  it('displays referral link', async () => {
    render(<ReferralDashboard />)
    
    await waitFor(() => {
      expect(screen.getByText('https://carkid0.com/ref/JOHN2024')).toBeInTheDocument()
    })
  })

  it('copies referral link to clipboard', async () => {
    const user = userEvent.setup()
    const mockClipboard = { writeText: jest.fn() }
    Object.assign(navigator, { clipboard: mockClipboard })
    
    render(<ReferralDashboard />)
    
    await waitFor(() => {
      expect(screen.getByText(/referral program/i)).toBeInTheDocument()
    })
    
    const copyLinkButton = screen.getByRole('button', { name: /copy link/i })
    await user.click(copyLinkButton)
    
    expect(mockClipboard.writeText).toHaveBeenCalledWith('https://carkid0.com/ref/JOHN2024')
  })

  it('shows referral statistics', async () => {
    render(<ReferralDashboard />)
    
    await waitFor(() => {
      expect(screen.getByText('15')).toBeInTheDocument() // Total
      expect(screen.getByText('12')).toBeInTheDocument() // Successful
      expect(screen.getByText('3')).toBeInTheDocument() // Pending
      expect(screen.getByText('1,200')).toBeInTheDocument() // Points
    })
  })

  it('displays referral list', async () => {
    render(<ReferralDashboard />)
    
    await waitFor(() => {
      expect(screen.getByText('Jane Doe')).toBeInTheDocument()
      expect(screen.getByText('Bob Smith')).toBeInTheDocument()
    })
  })

  it('shows referral status badges', async () => {
    render(<ReferralDashboard />)
    
    await waitFor(() => {
      expect(screen.getByText('Completed')).toBeInTheDocument()
      expect(screen.getByText('Pending')).toBeInTheDocument()
    })
  })

  it('shares via social media', async () => {
    const user = userEvent.setup()
    global.open = jest.fn()
    
    render(<ReferralDashboard />)
    
    await waitFor(() => {
      expect(screen.getByText(/referral program/i)).toBeInTheDocument()
    })
    
    const whatsappButton = screen.getByRole('button', { name: /share on whatsapp/i })
    await user.click(whatsappButton)
    
    expect(global.open).toHaveBeenCalledWith(
      expect.stringContaining('whatsapp.com'),
      '_blank'
    )
  })

  it('shares via email', async () => {
    const user = userEvent.setup()
    render(<ReferralDashboard />)
    
    await waitFor(() => {
      expect(screen.getByText(/referral program/i)).toBeInTheDocument()
    })
    
    const emailButton = screen.getByRole('button', { name: /share via email/i })
    await user.click(emailButton)
    
    expect(window.location.href).toContain('mailto:')
  })

  it('generates QR code', async () => {
    const user = userEvent.setup()
    render(<ReferralDashboard />)
    
    await waitFor(() => {
      expect(screen.getByText(/referral program/i)).toBeInTheDocument()
    })
    
    const qrButton = screen.getByRole('button', { name: /show qr code/i })
    await user.click(qrButton)
    
    await waitFor(() => {
      expect(screen.getByAltText(/qr code/i)).toBeInTheDocument()
    })
  })

  it('shows referral rewards breakdown', async () => {
    render(<ReferralDashboard />)
    
    await waitFor(() => {
      expect(screen.getByText(/how it works/i)).toBeInTheDocument()
      expect(screen.getByText(/100 points per referral/i)).toBeInTheDocument()
      expect(screen.getByText(/friend gets 50 points/i)).toBeInTheDocument()
    })
  })

  it('filters referrals by status', async () => {
    const user = userEvent.setup()
    render(<ReferralDashboard />)
    
    await waitFor(() => {
      expect(screen.getByText('Jane Doe')).toBeInTheDocument()
    })
    
    const filterSelect = screen.getByLabelText(/filter by status/i)
    await user.selectOptions(filterSelect, 'completed')
    
    expect(screen.getByText('Jane Doe')).toBeInTheDocument()
    expect(screen.queryByText('Bob Smith')).not.toBeInTheDocument()
  })

  it('sorts referrals by date', async () => {
    const user = userEvent.setup()
    render(<ReferralDashboard />)
    
    await waitFor(() => {
      expect(screen.getByText('Jane Doe')).toBeInTheDocument()
    })
    
    const sortSelect = screen.getByLabelText(/sort by/i)
    await user.selectOptions(sortSelect, 'newest')
    
    const referrals = screen.getAllByRole('listitem')
    expect(referrals[0]).toHaveTextContent('Bob Smith')
  })

  it('shows empty state when no referrals', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ 
          referralData: { ...mockReferralData, referrals: [] },
        }),
      })
    )
    
    render(<ReferralDashboard />)
    
    await waitFor(() => {
      expect(screen.getByText(/no referrals yet/i)).toBeInTheDocument()
    })
  })

  it('shows loading state', () => {
    global.fetch = jest.fn(() => new Promise(() => {}))
    
    render(<ReferralDashboard />)
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('shows error state on fetch failure', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('Network error')))
    
    render(<ReferralDashboard />)
    
    await waitFor(() => {
      expect(screen.getByText(/failed to load referral data/i)).toBeInTheDocument()
    })
  })

  it('displays referral leaderboard', async () => {
    render(<ReferralDashboard />)
    
    await waitFor(() => {
      expect(screen.getByText(/top referrers/i)).toBeInTheDocument()
    })
  })
})
