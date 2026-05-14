import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NotificationDropdown from '../NotificationDropdown'

const mockNotifications = [
  {
    id: '1',
    title: 'Booking Confirmed',
    message: 'Your booking is confirmed',
    type: 'booking',
    read: false,
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    title: 'Payment Successful',
    message: 'Payment received',
    type: 'payment',
    read: false,
    createdAt: '2024-01-15T09:00:00Z',
  },
]

describe('NotificationDropdown', () => {
  it('renders dropdown when open', () => {
    render(<NotificationDropdown isOpen={true} notifications={mockNotifications} onClose={jest.fn()} />)
    
    expect(screen.getByText('Booking Confirmed')).toBeInTheDocument()
    expect(screen.getByText('Payment Successful')).toBeInTheDocument()
  })

  it('does not render when closed', () => {
    render(<NotificationDropdown isOpen={false} notifications={mockNotifications} onClose={jest.fn()} />)
    
    expect(screen.queryByText('Booking Confirmed')).not.toBeInTheDocument()
  })

  it('displays notification count', () => {
    render(<NotificationDropdown isOpen={true} notifications={mockNotifications} onClose={jest.fn()} />)
    
    expect(screen.getByText(/2 notifications/i)).toBeInTheDocument()
  })

  it('shows unread count', () => {
    render(<NotificationDropdown isOpen={true} notifications={mockNotifications} onClose={jest.fn()} />)
    
    expect(screen.getByText(/2 unread/i)).toBeInTheDocument()
  })

  it('marks notification as read on click', async () => {
    const onMarkRead = jest.fn()
    const user = userEvent.setup()
    
    render(<NotificationDropdown isOpen={true} notifications={mockNotifications} onClose={jest.fn()} onMarkRead={onMarkRead} />)
    
    const notification = screen.getByText('Booking Confirmed')
    await user.click(notification)
    
    expect(onMarkRead).toHaveBeenCalledWith('1')
  })

  it('marks all as read', async () => {
    const onMarkAllRead = jest.fn()
    const user = userEvent.setup()
    
    render(<NotificationDropdown isOpen={true} notifications={mockNotifications} onClose={jest.fn()} onMarkAllRead={onMarkAllRead} />)
    
    const markAllButton = screen.getByRole('button', { name: /mark all as read/i })
    await user.click(markAllButton)
    
    expect(onMarkAllRead).toHaveBeenCalled()
  })

  it('navigates to notification center', async () => {
    const user = userEvent.setup()
    render(<NotificationDropdown isOpen={true} notifications={mockNotifications} onClose={jest.fn()} />)
    
    const viewAllLink = screen.getByRole('link', { name: /view all/i })
    await user.click(viewAllLink)
    
    expect(window.location.pathname).toContain('/notifications')
  })

  it('closes on outside click', async () => {
    const onClose = jest.fn()
    const user = userEvent.setup()
    
    render(
      <div>
        <NotificationDropdown isOpen={true} notifications={mockNotifications} onClose={onClose} />
        <button>Outside</button>
      </div>
    )
    
    const outsideButton = screen.getByRole('button', { name: /outside/i })
    await user.click(outsideButton)
    
    expect(onClose).toHaveBeenCalled()
  })

  it('shows empty state when no notifications', () => {
    render(<NotificationDropdown isOpen={true} notifications={[]} onClose={jest.fn()} />)
    
    expect(screen.getByText(/no notifications/i)).toBeInTheDocument()
  })

  it('groups notifications by date', () => {
    render(<NotificationDropdown isOpen={true} notifications={mockNotifications} onClose={jest.fn()} />)
    
    expect(screen.getByText(/today/i)).toBeInTheDocument()
  })

  it('shows notification icons by type', () => {
    render(<NotificationDropdown isOpen={true} notifications={mockNotifications} onClose={jest.fn()} />)
    
    expect(screen.getByTestId('booking-icon')).toBeInTheDocument()
    expect(screen.getByTestId('payment-icon')).toBeInTheDocument()
  })

  it('displays relative timestamps', () => {
    render(<NotificationDropdown isOpen={true} notifications={mockNotifications} onClose={jest.fn()} />)
    
    expect(screen.getByText(/1 hour ago/i)).toBeInTheDocument()
    expect(screen.getByText(/2 hours ago/i)).toBeInTheDocument()
  })
})
