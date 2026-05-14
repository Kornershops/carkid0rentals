import * as BookingComponents from '../index'

describe('Bookings Index', () => {
  it('exports CancellationFlow component', () => {
    expect(BookingComponents.CancellationFlow).toBeDefined()
  })

  it('exports InstantBookButton component', () => {
    expect(BookingComponents.InstantBookButton).toBeDefined()
  })

  it('exports FlexibleDatesCalendar component', () => {
    expect(BookingComponents.FlexibleDatesCalendar).toBeDefined()
  })

  it('exports ModifyBookingModal component', () => {
    expect(BookingComponents.ModifyBookingModal).toBeDefined()
  })

  it('exports PriceAlertForm component', () => {
    expect(BookingComponents.PriceAlertForm).toBeDefined()
  })

  it('exports all components as named exports', () => {
    const exports = Object.keys(BookingComponents)
    expect(exports).toContain('CancellationFlow')
    expect(exports).toContain('InstantBookButton')
    expect(exports).toContain('FlexibleDatesCalendar')
    expect(exports).toContain('ModifyBookingModal')
    expect(exports).toContain('PriceAlertForm')
  })
})
