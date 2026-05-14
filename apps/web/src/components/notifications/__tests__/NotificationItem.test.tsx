import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NotificationItem from '../NotificationItem'

const mockNotification = {
  id: '1',
  title: 'Booking Confirmed',
  message: 'Your booking for Toyota Camry is confirmed',
  type: 'booking',
  read: false,
  createdAt: '2024-01-15T10:00:00Z',
  actionUrl: '/bookings/123',
}

describe('NotificationItem', () => {
  it('renders notification item', () => {
    render(<NotificationItem notification={mockNotification} />)
    
    expect(screen.getByText('Booking Confirmed')).toBeInTheDocument()
    expect(screen.getByText(/Toyota Camry is confirmed/i)).toBeInTheDocument()
  })

  it('shows unread indicator', () => {
    render(<NotificationItem notification={mockNotification} />)
    
    const item = screen.getByRole('article')
    expect(item).toHaveClass('unread')
  })

  it('does not show unread indicator for read notifications', () => {
    const readNotification = { ...mockNotification, read: true }
    render(<NotificationItem notification={readNotification} />)
    
    const item = screen.getByRole('article')
    expect(item).not.toHaveClass('unread')
  })

  it('displays notification icon by type', () => {
    render(<NotificationItem notification={mockNotification} />)
    
    expect(screen.getByTestId('booking-icon')).toBeInTheDocument()
  })

  it('shows relative timestamp', () => {
    render(<NotificationItem notification={mockNotification} />)
    
    expect(screen.getByText(/ago/i)).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const onClick = jest.fn()
    const user = userEvent.setup()
    
    render(<NotificationItem notification={mockNotification} onClick={onClick} />)
    
    const item = screen.getByRole('article')
    await user.click(item)
    
    expect(onClick).toHaveBeenCalledWith(mockNotification)
  })

  it('marks as read on click', async () => {
    const onMarkRead = jest.fn()
    const user = userEvent.setup()
    
    render(<NotificationItem notification={mockNotification} onMarkRead={onMarkRead} />)
    
    const item = screen.getByRole('article')
    await user.click(item)
    
    expect(onMarkRead).toHaveBeenCalledWith('1')
  })

  it('navigates to action URL', async () => {
    const user = userEvent.setup()
    render(<NotificationItem notification={mockNotification} />)
    
    const item = screen.getByRole('article')
    await user.click(item)
    
    expect(window.location.pathname).toContain('/bookings/123')
  })

  it('shows delete button on hover', async () => {
    const user = userEvent.setup()
    render(<NotificationItem notification={mockNotification} />)
    
    const item = screen.getByRole('article')
    await user.hover(item)
    
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument()
  })

  it('deletes notification', async () => {
    const onDelete = jest.fn()
    const user = userEvent.setup()
    
    render(<NotificationItem notification={mockNotification} onDelete={onDelete} />)
    
    const item = screen.getByRole('article')
    await user.hover(item)
    
    const deleteButton = screen.getByRole('button', { name: /delete/i })
    await user.click(deleteButton)
    
    expect(onDelete).toHaveBeenCalledWith('1')
  })
})
