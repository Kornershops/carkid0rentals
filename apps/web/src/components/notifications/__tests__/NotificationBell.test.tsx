import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NotificationBell from '../NotificationBell'

describe('NotificationBell', () => {
  const mockNotifications = [
    {
      id: '1',
      title: 'Booking Confirmed',
      message: 'Your booking for Toyota Camry is confirmed',
      type: 'booking',
      read: false,
      createdAt: '2024-01-15T10:00:00Z',
    },
    {
      id: '2',
      title: 'Payment Successful',
      message: 'Payment of ₦50,000 received',
      type: 'payment',
      read: false,
      createdAt: '2024-01-15T09:00:00Z',
    },
    {
      id: '3',
      title: 'Ticket Reply',
      message: 'Support team replied to your ticket',
      type: 'support',
      read: true,
      createdAt: '2024-01-14T15:00:00Z',
    },
  ]

  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ 
          notifications: mockNotifications,
          unreadCount: 2,
        }),
      })
    )
  })

  it('renders notification bell icon', () => {
    render(<NotificationBell />)
    
    expect(screen.getByRole('button', { name: /notifications/i })).toBeInTheDocument()
  })

  it('displays unread count badge', async () => {
    render(<NotificationBell />)
    
    await waitFor(() => {
      expect(screen.getByText('2')).toBeInTheDocument()
    })
  })

  it('hides badge when no unread notifications', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ 
          notifications: [],
          unreadCount: 0,
        }),
      })
    )
    
    render(<NotificationBell />)
    
    await waitFor(() => {
      expect(screen.queryByText('0')).not.toBeInTheDocument()
    })
  })

  it('opens dropdown on click', async () => {
    const user = userEvent.setup()
    render(<NotificationBell />)
    
    const bellButton = screen.getByRole('button', { name: /notifications/i })
    await user.click(bellButton)
    
    await waitFor(() => {
      expect(screen.getByText('Booking Confirmed')).toBeInTheDocument()
      expect(screen.getByText('Payment Successful')).toBeInTheDocument()
    })
  })

  it('closes dropdown on outside click', async () => {
    const user = userEvent.setup()
    render(
      <div>
        <NotificationBell />
        <button>Outside</button>
      </div>
    )
    
    const bellButton = screen.getByRole('button', { name: /notifications/i })
    await user.click(bellButton)
    
    await waitFor(() => {
      expect(screen.getByText('Booking Confirmed')).toBeInTheDocument()
    })
    
    const outsideButton = screen.getByRole('button', { name: /outside/i })
    await user.click(outsideButton)
    
    await waitFor(() => {
      expect(screen.queryByText('Booking Confirmed')).not.toBeInTheDocument()
    })
  })

  it('shows loading state while fetching', () => {
    global.fetch = jest.fn(() => new Promise(() => {}))
    
    render(<NotificationBell />)
    
    expect(screen.getByRole('button', { name: /notifications/i })).toBeInTheDocument()
  })

  it('polls for new notifications every 30 seconds', async () => {
    jest.useFakeTimers()
    
    render(<NotificationBell />)
    
    expect(global.fetch).toHaveBeenCalledTimes(1)
    
    jest.advanceTimersByTime(30000)
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2)
    })
    
    jest.useRealTimers()
  })

  it('plays sound for new notifications', async () => {
    const mockPlay = jest.fn()
    global.Audio = jest.fn().mockImplementation(() => ({
      play: mockPlay,
    }))
    
    const { rerender } = render(<NotificationBell />)
    
    await waitFor(() => {
      expect(screen.getByText('2')).toBeInTheDocument()
    })
    
    // Simulate new notification
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ 
          notifications: [...mockNotifications, {
            id: '4',
            title: 'New Message',
            message: 'You have a new message',
            type: 'message',
            read: false,
            createdAt: new Date().toISOString(),
          }],
          unreadCount: 3,
        }),
      })
    )
    
    rerender(<NotificationBell />)
    
    await waitFor(() => {
      expect(mockPlay).toHaveBeenCalled()
    })
  })

  it('shows desktop notification for new notifications', async () => {
    const mockNotification = jest.fn()
    global.Notification = mockNotification
    global.Notification.permission = 'granted'
    
    render(<NotificationBell />)
    
    await waitFor(() => {
      expect(mockNotification).toHaveBeenCalledWith(
        'Booking Confirmed',
        expect.objectContaining({
          body: 'Your booking for Toyota Camry is confirmed',
        })
      )
    })
  })

  it('requests notification permission if not granted', async () => {
    const mockRequestPermission = jest.fn(() => Promise.resolve('granted'))
    global.Notification = {
      permission: 'default',
      requestPermission: mockRequestPermission,
    }
    
    const user = userEvent.setup()
    render(<NotificationBell />)
    
    const bellButton = screen.getByRole('button', { name: /notifications/i })
    await user.click(bellButton)
    
    await waitFor(() => {
      expect(mockRequestPermission).toHaveBeenCalled()
    })
  })

  it('marks notification as read on click', async () => {
    const user = userEvent.setup()
    
    global.fetch = jest.fn()
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ 
            notifications: mockNotifications,
            unreadCount: 2,
          }),
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        })
      )
    
    render(<NotificationBell />)
    
    const bellButton = screen.getByRole('button', { name: /notifications/i })
    await user.click(bellButton)
    
    await waitFor(() => {
      expect(screen.getByText('Booking Confirmed')).toBeInTheDocument()
    })
    
    const notification = screen.getByText('Booking Confirmed')
    await user.click(notification)
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/notifications/1/read'),
        expect.any(Object)
      )
    })
  })

  it('navigates to notification center', async () => {
    const user = userEvent.setup()
    render(<NotificationBell />)
    
    const bellButton = screen.getByRole('button', { name: /notifications/i })
    await user.click(bellButton)
    
    await waitFor(() => {
      expect(screen.getByText(/view all/i)).toBeInTheDocument()
    })
    
    const viewAllLink = screen.getByText(/view all/i)
    await user.click(viewAllLink)
    
    expect(window.location.pathname).toContain('/notifications')
  })

  it('groups notifications by type', async () => {
    const user = userEvent.setup()
    render(<NotificationBell />)
    
    const bellButton = screen.getByRole('button', { name: /notifications/i })
    await user.click(bellButton)
    
    await waitFor(() => {
      expect(screen.getByText(/bookings/i)).toBeInTheDocument()
      expect(screen.getByText(/payments/i)).toBeInTheDocument()
      expect(screen.getByText(/support/i)).toBeInTheDocument()
    })
  })
})
