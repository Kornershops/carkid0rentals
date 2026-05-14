import * as NotificationComponents from '../index'

describe('Notifications Index', () => {
  it('exports NotificationBell component', () => {
    expect(NotificationComponents.NotificationBell).toBeDefined()
  })

  it('exports NotificationCenter component', () => {
    expect(NotificationComponents.NotificationCenter).toBeDefined()
  })

  it('exports NotificationDropdown component', () => {
    expect(NotificationComponents.NotificationDropdown).toBeDefined()
  })

  it('exports NotificationItem component', () => {
    expect(NotificationComponents.NotificationItem).toBeDefined()
  })

  it('exports NotificationPreferences component', () => {
    expect(NotificationComponents.NotificationPreferences).toBeDefined()
  })

  it('exports all components as named exports', () => {
    const exports = Object.keys(NotificationComponents)
    expect(exports).toContain('NotificationBell')
    expect(exports).toContain('NotificationCenter')
    expect(exports).toContain('NotificationDropdown')
    expect(exports).toContain('NotificationItem')
    expect(exports).toContain('NotificationPreferences')
  })
})
