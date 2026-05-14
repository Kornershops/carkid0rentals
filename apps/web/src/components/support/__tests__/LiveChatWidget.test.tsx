import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LiveChatWidget from '../LiveChatWidget'

describe('LiveChatWidget', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ sessionId: 'chat-123' }),
      })
    )
  })

  it('renders chat widget button', () => {
    render(<LiveChatWidget />)
    
    expect(screen.getByRole('button', { name: /chat/i })).toBeInTheDocument()
  })

  it('opens chat window on click', async () => {
    const user = userEvent.setup()
    render(<LiveChatWidget />)
    
    const chatButton = screen.getByRole('button', { name: /chat/i })
    await user.click(chatButton)
    
    await waitFor(() => {
      expect(screen.getByText(/live chat/i)).toBeInTheDocument()
    })
  })

  it('starts chat session', async () => {
    const user = userEvent.setup()
    render(<LiveChatWidget />)
    
    const chatButton = screen.getByRole('button', { name: /chat/i })
    await user.click(chatButton)
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/support/chat/start'),
        expect.any(Object)
      )
    })
  })

  it('sends message', async () => {
    const user = userEvent.setup()
    
    global.fetch = jest.fn()
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ sessionId: 'chat-123' }),
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        })
      )
    
    render(<LiveChatWidget />)
    
    const chatButton = screen.getByRole('button', { name: /chat/i })
    await user.click(chatButton)
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/type a message/i)).toBeInTheDocument()
    })
    
    const messageInput = screen.getByPlaceholderText(/type a message/i)
    await user.type(messageInput, 'I need help')
    
    const sendButton = screen.getByRole('button', { name: /send/i })
    await user.click(sendButton)
    
    await waitFor(() => {
      expect(screen.getByText('I need help')).toBeInTheDocument()
    })
  })

  it('shows typing indicator when agent is typing', async () => {
    const user = userEvent.setup()
    render(<LiveChatWidget />)
    
    const chatButton = screen.getByRole('button', { name: /chat/i })
    await user.click(chatButton)
    
    await waitFor(() => {
      expect(screen.getByText(/live chat/i)).toBeInTheDocument()
    })
    
    // Simulate WebSocket message
    const typingEvent = new CustomEvent('agent-typing')
    window.dispatchEvent(typingEvent)
    
    await waitFor(() => {
      expect(screen.getByText(/agent is typing/i)).toBeInTheDocument()
    })
  })

  it('displays agent messages', async () => {
    const user = userEvent.setup()
    
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ 
          sessionId: 'chat-123',
          messages: [
            { id: '1', content: 'Hello! How can I help?', sender: 'agent' },
          ],
        }),
      })
    )
    
    render(<LiveChatWidget />)
    
    const chatButton = screen.getByRole('button', { name: /chat/i })
    await user.click(chatButton)
    
    await waitFor(() => {
      expect(screen.getByText('Hello! How can I help?')).toBeInTheDocument()
    })
  })

  it('closes chat window', async () => {
    const user = userEvent.setup()
    render(<LiveChatWidget />)
    
    const chatButton = screen.getByRole('button', { name: /chat/i })
    await user.click(chatButton)
    
    await waitFor(() => {
      expect(screen.getByText(/live chat/i)).toBeInTheDocument()
    })
    
    const closeButton = screen.getByRole('button', { name: /close/i })
    await user.click(closeButton)
    
    await waitFor(() => {
      expect(screen.queryByText(/live chat/i)).not.toBeInTheDocument()
    })
  })

  it('minimizes chat window', async () => {
    const user = userEvent.setup()
    render(<LiveChatWidget />)
    
    const chatButton = screen.getByRole('button', { name: /chat/i })
    await user.click(chatButton)
    
    await waitFor(() => {
      expect(screen.getByText(/live chat/i)).toBeInTheDocument()
    })
    
    const minimizeButton = screen.getByRole('button', { name: /minimize/i })
    await user.click(minimizeButton)
    
    expect(screen.getByRole('button', { name: /chat/i })).toBeInTheDocument()
  })

  it('shows unread message count', async () => {
    render(<LiveChatWidget unreadCount={3} />)
    
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('attaches files to message', async () => {
    const user = userEvent.setup()
    const file = new File(['screenshot'], 'screenshot.png', { type: 'image/png' })
    
    render(<LiveChatWidget />)
    
    const chatButton = screen.getByRole('button', { name: /chat/i })
    await user.click(chatButton)
    
    await waitFor(() => {
      expect(screen.getByLabelText(/attach file/i)).toBeInTheDocument()
    })
    
    const fileInput = screen.getByLabelText(/attach file/i)
    await user.upload(fileInput, file)
    
    expect(screen.getByText('screenshot.png')).toBeInTheDocument()
  })

  it('shows chat availability status', () => {
    render(<LiveChatWidget available={true} />)
    
    expect(screen.getByText(/online/i)).toBeInTheDocument()
  })

  it('shows offline message when unavailable', () => {
    render(<LiveChatWidget available={false} />)
    
    expect(screen.getByText(/offline/i)).toBeInTheDocument()
  })

  it('ends chat session', async () => {
    const user = userEvent.setup()
    render(<LiveChatWidget />)
    
    const chatButton = screen.getByRole('button', { name: /chat/i })
    await user.click(chatButton)
    
    await waitFor(() => {
      expect(screen.getByText(/live chat/i)).toBeInTheDocument()
    })
    
    const endButton = screen.getByRole('button', { name: /end chat/i })
    await user.click(endButton)
    
    await waitFor(() => {
      expect(screen.getByText(/rate this chat/i)).toBeInTheDocument()
    })
  })

  it('rates chat session', async () => {
    const user = userEvent.setup()
    render(<LiveChatWidget />)
    
    const chatButton = screen.getByRole('button', { name: /chat/i })
    await user.click(chatButton)
    
    await waitFor(() => {
      expect(screen.getByText(/live chat/i)).toBeInTheDocument()
    })
    
    const endButton = screen.getByRole('button', { name: /end chat/i })
    await user.click(endButton)
    
    await waitFor(() => {
      expect(screen.getByText(/rate this chat/i)).toBeInTheDocument()
    })
    
    const rating5 = screen.getByRole('button', { name: /5 stars/i })
    await user.click(rating5)
    
    await waitFor(() => {
      expect(screen.getByText(/thank you/i)).toBeInTheDocument()
    })
  })
})
