import * as SupportComponents from '../index'

describe('Support Index', () => {
  it('exports SupportTicketForm component', () => {
    expect(SupportComponents.SupportTicketForm).toBeDefined()
  })

  it('exports TicketList component', () => {
    expect(SupportComponents.TicketList).toBeDefined()
  })

  it('exports TicketDetail component', () => {
    expect(SupportComponents.TicketDetail).toBeDefined()
  })

  it('exports KnowledgeBase component', () => {
    expect(SupportComponents.KnowledgeBase).toBeDefined()
  })

  it('exports FAQSearch component', () => {
    expect(SupportComponents.FAQSearch).toBeDefined()
  })

  it('exports LiveChatWidget component', () => {
    expect(SupportComponents.LiveChatWidget).toBeDefined()
  })

  it('exports all components as named exports', () => {
    const exports = Object.keys(SupportComponents)
    expect(exports).toContain('SupportTicketForm')
    expect(exports).toContain('TicketList')
    expect(exports).toContain('TicketDetail')
    expect(exports).toContain('KnowledgeBase')
    expect(exports).toContain('FAQSearch')
    expect(exports).toContain('LiveChatWidget')
  })
})
