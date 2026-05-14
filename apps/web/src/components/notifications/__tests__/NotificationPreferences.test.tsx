import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NotificationPreferences from '../NotificationPreferences'

const mockPreferences = {
  channels: {
    push: true,
    email: true,
    sms: false,
    inApp: true,
  },
  categories: {
    booking: { push: true, email: true, sms: false },
    payment: { push: true, email: true, sms: true },
    support: { push: true, email: false, sms: false },
    marketing: { push: false, email: true, sms: false },
    system: { push: true, email: true, sms: false },
  },
  quietHours: {
    enabled: true,
    start: '22:00',
    end: '08:00',
  },
}

describe('NotificationPreferences', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ preferences: mockPreferences }),
      })
    )
  })

  it('renders notification preferences', async () => {
    render(<NotificationPreferences />)
    
    await waitFor(() => {
      expect(screen.getByText(/notification preferences/i)).toBeInTheDocument()
    })
  })

  it('displays channel toggles', async () => {
    render(<NotificationPreferences />)
    
    await waitFor(() => {
      expect(screen.getByLabelText(/push notifications/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/email notifications/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/sms notifications/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/in-app notifications/i)).toBeInTheDocument()
    })
  })

  it('shows current channel settings', async () => {
    render(<NotificationPreferences />)
    
    await waitFor(() => {
      expect(screen.getByLabelText(/push notifications/i)).toBeChecked()
      expect(screen.getByLabelText(/email notifications/i)).toBeChecked()
      expect(screen.getByLabelText(/sms notifications/i)).not.toBeChecked()
      expect(screen.getByLabelText(/in-app notifications/i)).toBeChecked()
    })
  })

  it('toggles channel preference', async () => {
    const user = userEvent.setup()
    
    global.fetch = jest.fn()
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ preferences: mockPreferences }),
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        })
      )
    
    render(<NotificationPreferences />)
    
    await waitFor(() => {
      expect(screen.getByLabelText(/sms notifications/i)).toBeInTheDocument()
    })
    
    const smsToggle = screen.getByLabelText(/sms notifications/i)
    await user.click(smsToggle)
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/notifications/preferences'),
        expect.objectContaining({
          method: 'PATCH',
          body: expect.stringContaining('"sms":true'),
        })
      )
    })
  })

  it('displays category preferences', async () => {
    render(<NotificationPreferences />)
    
    await waitFor(() => {
      expect(screen.getByText(/booking updates/i)).toBeInTheDocument()
      expect(screen.getByText(/payment updates/i)).toBeInTheDocument()
      expect(screen.getByText(/support updates/i)).toBeInTheDocument()
      expect(screen.getByText(/marketing/i)).toBeInTheDocument()
      expect(screen.getByText(/system updates/i)).toBeInTheDocument()
    })
  })

  it('configures category-specific channels', async () => {
    const user = userEvent.setup()
    render(<NotificationPreferences />)
    
    await waitFor(() => {
      expect(screen.getByText(/booking updates/i)).toBeInTheDocument()
    })
    
    // Expand booking category
    const bookingSection = screen.getByText(/booking updates/i)
    await user.click(bookingSection)
    
    // Should show channel options for booking
    await waitFor(() => {
      expect(screen.getAllByLabelText(/push/i).length).toBeGreaterThan(1)
    })
  })

  it('enables quiet hours', async () => {
    const user = userEvent.setup()
    render(<NotificationPreferences />)
    
    await waitFor(() => {
      expect(screen.getByLabelText(/quiet hours/i)).toBeInTheDocument()
    })
    
    const quietHoursToggle = screen.getByLabelText(/quiet hours/i)
    expect(quietHoursToggle).toBeChecked()
  })

  it('configures quiet hours time range', async () => {
    const user = userEvent.setup()
    render(<NotificationPreferences />)
    
    await waitFor(() => {
      expect(screen.getByLabelText(/start time/i)).toBeInTheDocument()
    })
    
    const startTime = screen.getByLabelText(/start time/i)
    const endTime = screen.getByLabelText(/end time/i)
    
    expect(startTime).toHaveValue('22:00')
    expect(endTime).toHaveValue('08:00')
    
    await user.clear(startTime)
    await user.type(startTime, '23:00')
    
    const saveButton = screen.getByRole('button', { name: /save/i })
    await user.click(saveButton)
    
    await waitFor(() => {
      expect(screen.getByText(/preferences saved/i)).toBeInTheDocument()
    })
  })

  it('disables all notifications', async () => {
    const user = userEvent.setup()
    render(<NotificationPreferences />)
    
    await waitFor(() => {
      expect(screen.getByText(/disable all/i)).toBeInTheDocument()
    })
    
    const disableAllButton = screen.getByRole('button', { name: /disable all/i })
    await user.click(disableAllButton)
    
    await waitFor(() => {
      expect(screen.getByText(/confirm/i)).toBeInTheDocument()
    })
    
    const confirmButton = screen.getByRole('button', { name: /confirm/i })
    await user.click(confirmButton)
    
    await waitFor(() => {
      expect(screen.getByText(/all notifications disabled/i)).toBeInTheDocument()
    })
  })

  it('shows notification frequency options', async () => {
    render(<NotificationPreferences />)
    
    await waitFor(() => {
      expect(screen.getByText(/notification frequency/i)).toBeInTheDocument()
    })
    
    expect(screen.getByRole('option', { name: /instant/i })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: /daily digest/i })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: /weekly digest/i })).toBeInTheDocument()
  })

  it('previews notification settings', async () => {
    const user = userEvent.setup()
    render(<NotificationPreferences />)
    
    await waitFor(() => {
      expect(screen.getByText(/notification preferences/i)).toBeInTheDocument()
    })
    
    const previewButton = screen.getByRole('button', { name: /preview/i })
    await user.click(previewButton)
    
    await waitFor(() => {
      expect(screen.getByText(/test notification/i)).toBeInTheDocument()
    })
  })

  it('resets to default settings', async () => {
    const user = userEvent.setup()
    render(<NotificationPreferences />)
    
    await waitFor(() => {
      expect(screen.getByText(/notification preferences/i)).toBeInTheDocument()
    })
    
    const resetButton = screen.getByRole('button', { name: /reset to default/i })
    await user.click(resetButton)
    
    await waitFor(() => {
      expect(screen.getByText(/reset to default settings/i)).toBeInTheDocument()
    })
  })

  it('shows loading state', () => {
    global.fetch = jest.fn(() => new Promise(() => {}))
    
    render(<NotificationPreferences />)
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('shows error state on fetch failure', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('Network error')))
    
    render(<NotificationPreferences />)
    
    await waitFor(() => {
      expect(screen.getByText(/failed to load preferences/i)).toBeInTheDocument()
    })
  })

  it('validates quiet hours time range', async () => {
    const user = userEvent.setup()
    render(<NotificationPreferences />)
    
    await waitFor(() => {
      expect(screen.getByLabelText(/start time/i)).toBeInTheDocument()
    })
    
    const startTime = screen.getByLabelText(/start time/i)
    const endTime = screen.getByLabelText(/end time/i)
    
    await user.clear(startTime)
    await user.type(startTime, '08:00')
    await user.clear(endTime)
    await user.type(endTime, '08:00')
    
    const saveButton = screen.getByRole('button', { name: /save/i })
    await user.click(saveButton)
    
    await waitFor(() => {
      expect(screen.getByText(/invalid time range/i)).toBeInTheDocument()
    })
  })
})
