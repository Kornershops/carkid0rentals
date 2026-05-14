import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NotificationCenter from '../NotificationCenter'

const mockNotifications = [
  {
    id: '1',
    title: 'Booking Confirmed',
    message: 'Your booking for Toyota Camry is confirmed',
    type: 'booking',
    read: false,
    createdAt: '2024-01-15T10:00:00Z',
    actionUrl: '/bookings/123',
  },
  {
    id: '2',
    title: 'Payment Successful',
    message: 'Payment of ₦50,000 received',
    type: 'payment',
    read: false,
    createdAt: '2024-01-15T09:00:00Z',
    actionUrl: '/payments/456',
  },
  {
    id: '3',
    title: 'Ticket Reply',
    message: 'Support team replied to your ticket',
    type: 'support',
    read: true,
    createdAt: '2024-01-14T15:00:00Z',
    actionUrl: '/support/tickets/789',
  },
]

describe('NotificationCenter', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ notifications: mockNotifications }),
      })
    )
  })

  it('renders notification center', async () => {
    render(<NotificationCenter />)
    
    await waitFor(() => {
      expect(screen.getByText(/notifications/i)).toBeInTheDocument()
    })
  })

  it('displays all notifications', async () => {
    render(<NotificationCenter />)
    
    await waitFor(() => {
      expect(screen.getByText('Booking Confirmed')).toBeInTheDocument()
      expect(screen.getByText('Payment Successful')).toBeInTheDocument()
      expect(screen.getByText('Ticket Reply')).toBeInTheDocument()
    })
  })

  it('filters by notification type', async () => {
    const user = userEvent.setup()
    render(<NotificationCenter />)
    
    await waitFor(() => {
      expect(screen.getByText('Booking Confirmed')).toBeInTheDocument()
    })
    
    const filterSelect = screen.getByLabelText(/filter by type/i)
    await user.selectOptions(filterSelect, 'booking')
    
    expect(screen.getByText('Booking Confirmed')).toBeInTheDocument()
    expect(screen.queryByText('Payment Successful')).not.toBeInTheDocument()
  })

  it('filters by read status', async () => {
    const user = userEvent.setup()
    render(<NotificationCenter />)
    
    await waitFor(() => {
      expect(screen.getByText('Booking Confirmed')).toBeInTheDocument()
    })
    
    const filterSelect = screen.getByLabelText(/filter by status/i)
    await user.selectOptions(filterSelect, 'unread')
    
    expect(screen.getByText('Booking Confirmed')).toBeInTheDocument()
    expect(screen.queryByText('Ticket Reply')).not.toBeInTheDocument()
  })

  it('marks single notification as read', async () => {
    const user = userEvent.setup()
    
    global.fetch = jest.fn()
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ notifications: mockNotifications }),
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        })
      )
    
    render(<NotificationCenter />)
    
    await waitFor(() => {
      expect(screen.getByText('Booking Confirmed')).toBeInTheDocument()
    })
    
    const markReadButton = screen.getAllByRole('button', { name: /mark as read/i })[0]
    await user.click(markReadButton)
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/notifications/1/read'),
        expect.any(Object)
      )
    })
  })

  it('marks all as read', async () => {
    const user = userEvent.setup()
    render(<NotificationCenter />)
    
    await waitFor(() => {
      expect(screen.getByText('Booking Confirmed')).toBeInTheDocument()
    })
    
    const markAllButton = screen.getByRole('button', { name: /mark all as read/i })
    await user.click(markAllButton)
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/notifications/read-all'),
        expect.any(Object)
      )
    })
  })

  it('deletes notification', async () => {
    const user = userEvent.setup()
    render(<NotificationCenter />)
    
    await waitFor(() => {
      expect(screen.getByText('Booking Confirmed')).toBeInTheDocument()
    })
    
    const deleteButton = screen.getAllByRole('button', { name: /delete/i })[0]
    await user.click(deleteButton)
    
    await waitFor(() => {
      expect(screen.queryByText('Booking Confirmed')).not.toBeInTheDocument()
    })
  })

  it('navigates to action URL on click', async () => {
    const user = userEvent.setup()
    render(<NotificationCenter />)
    
    await waitFor(() => {
      expect(screen.getByText('Booking Confirmed')).toBeInTheDocument()
    })
    
    const notification = screen.getByText('Booking Confirmed')
    await user.click(notification)
    
    expect(window.location.pathname).toContain('/bookings/123')
  })

  it('groups notifications by date', async () => {
    render(<NotificationCenter />)
    
    await waitFor(() => {
      expect(screen.getByText(/today/i)).toBeInTheDocument()
      expect(screen.getByText(/yesterday/i)).toBeInTheDocument()
    })
  })

  it('shows empty state when no notifications', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ notifications: [] }),
      })
    )
    
    render(<NotificationCenter />)
    
    await waitFor(() => {
      expect(screen.getByText(/no notifications/i)).toBeInTheDocument()
    })
  })

  it('paginates notifications', async () => {
    const manyNotifications = Array.from({ length: 25 }, (_, i) => ({
      id: `${i + 1}`,
      title: `Notification ${i + 1}`,
      message: `Message ${i + 1}`,
      type: 'general',
      read: false,
      createdAt: '2024-01-15T10:00:00Z',
    }))
    
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ notifications: manyNotifications }),
      })
    )
    
    const user = userEvent.setup()
    render(<NotificationCenter />)
    
    await waitFor(() => {
      expect(screen.getByText('Notification 1')).toBeInTheDocument()
    })
    
    const nextButton = screen.getByRole('button', { name: /next/i })
    await user.click(nextButton)
    
    await waitFor(() => {
      expect(screen.getByText('Notification 11')).toBeInTheDocument()
    })
  })

  it('shows loading state', () => {
    global.fetch = jest.fn(() => new Promise(() => {}))
    
    render(<NotificationCenter />)
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })
})
