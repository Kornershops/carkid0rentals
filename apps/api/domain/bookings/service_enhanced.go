package bookings

import (
	"errors"
	"time"

	"gorm.io/gorm"
)

type EnhancedService struct {
	db *gorm.DB
}

func NewEnhancedService(db *gorm.DB) *EnhancedService {
	return &EnhancedService{db: db}
}

// InstantBook creates an instant booking without approval
func (s *EnhancedService) InstantBook(userID, listingID string, startDate, endDate time.Time, insuranceType string) (*Booking, error) {
	// Calculate pricing
	days := int(endDate.Sub(startDate).Hours() / 24)
	pricePerDay := 50000 // TODO: Get from listing
	subtotal := pricePerDay * days
	serviceFee := subtotal * 10 / 100
	
	insuranceFee := 0
	switch insuranceType {
	case "basic":
		insuranceFee = 5000 * days
	case "premium":
		insuranceFee = 10000 * days
	case "full":
		insuranceFee = 15000 * days
	}
	
	total := subtotal + serviceFee + insuranceFee

	booking := &Booking{
		UserID:        userID,
		ListingID:     listingID,
		StartDate:     startDate,
		EndDate:       endDate,
		Days:          days,
		PricePerDay:   pricePerDay,
		Subtotal:      subtotal,
		ServiceFee:    serviceFee,
		Total:         total,
		Currency:      "NGN",
		Status:        StatusConfirmed,
		InstantBook:   true,
		InsuranceType: insuranceType,
		InsuranceFee:  insuranceFee,
	}

	if err := s.db.Create(booking).Error; err != nil {
		return nil, err
	}

	// Create insurance policy if selected
	if insuranceType != "" {
		policy := &InsurancePolicy{
			BookingID:  booking.ID,
			Type:       insuranceType,
			Premium:    insuranceFee,
			Coverage:   getCoverage(insuranceType),
			Deductible: getDeductible(insuranceType),
			Active:     true,
		}
		s.db.Create(policy)
	}

	return booking, nil
}

// ModifyBooking modifies an existing booking dates
func (s *EnhancedService) ModifyBooking(bookingID string, newStartDate, newEndDate time.Time, reason string) (*BookingModification, error) {
	var booking Booking
	if err := s.db.First(&booking, "id = ?", bookingID).Error; err != nil {
		return nil, errors.New("booking not found")
	}

	if booking.Status == StatusCompleted || booking.Status == StatusCancelled {
		return nil, errors.New("cannot modify completed or cancelled booking")
	}

	// Calculate price difference
	oldDays := int(booking.EndDate.Sub(booking.StartDate).Hours() / 24)
	newDays := int(newEndDate.Sub(newStartDate).Hours() / 24)
	priceDiff := (newDays - oldDays) * booking.PricePerDay

	modification := &BookingModification{
		BookingID:    bookingID,
		OldStartDate: booking.StartDate,
		OldEndDate:   booking.EndDate,
		NewStartDate: newStartDate,
		NewEndDate:   newEndDate,
		PriceDiff:    priceDiff,
		Status:       "approved", // Auto-approve for now
		Reason:       reason,
	}

	if err := s.db.Create(modification).Error; err != nil {
		return nil, err
	}

	// Update booking
	booking.StartDate = newStartDate
	booking.EndDate = newEndDate
	booking.Days = newDays
	booking.Subtotal = booking.PricePerDay * newDays
	booking.Total = booking.Subtotal + booking.ServiceFee + booking.InsuranceFee
	s.db.Save(&booking)

	return modification, nil
}

// CancelBooking cancels a booking with refund calculation
func (s *EnhancedService) CancelBooking(bookingID, reason, cancelledBy string) (*BookingCancellation, error) {
	var booking Booking
	if err := s.db.First(&booking, "id = ?", bookingID).Error; err != nil {
		return nil, errors.New("booking not found")
	}

	if booking.Status == StatusCompleted || booking.Status == StatusCancelled {
		return nil, errors.New("booking already completed or cancelled")
	}

	// Calculate refund based on cancellation policy
	refundAmount := calculateRefund(booking)

	cancellation := &BookingCancellation{
		BookingID:    bookingID,
		Reason:       reason,
		RefundAmount: refundAmount,
		RefundStatus: "pending",
		CancelledBy:  cancelledBy,
	}

	if err := s.db.Create(cancellation).Error; err != nil {
		return nil, err
	}

	// Update booking status
	booking.Status = StatusCancelled
	s.db.Save(&booking)

	return cancellation, nil
}

// ExtendBooking extends a booking end date
func (s *EnhancedService) ExtendBooking(bookingID string, newEndDate time.Time) error {
	var booking Booking
	if err := s.db.First(&booking, "id = ?", bookingID).Error; err != nil {
		return errors.New("booking not found")
	}

	if booking.Status != StatusActive {
		return errors.New("can only extend active bookings")
	}

	if newEndDate.Before(booking.EndDate) {
		return errors.New("new end date must be after current end date")
	}

	// Calculate additional cost
	additionalDays := int(newEndDate.Sub(booking.EndDate).Hours() / 24)
	additionalCost := additionalDays * booking.PricePerDay

	booking.EndDate = newEndDate
	booking.Days += additionalDays
	booking.Subtotal += additionalCost
	booking.Total += additionalCost

	return s.db.Save(&booking).Error
}

// CreatePriceAlert creates a price alert for a listing
func (s *EnhancedService) CreatePriceAlert(userID, listingID string, targetPrice int) (*PriceAlert, error) {
	alert := &PriceAlert{
		UserID:      userID,
		ListingID:   listingID,
		TargetPrice: targetPrice,
		Active:      true,
		Triggered:   false,
	}

	if err := s.db.Create(alert).Error; err != nil {
		return nil, err
	}

	return alert, nil
}

// GetPriceAlerts gets user's active price alerts
func (s *EnhancedService) GetPriceAlerts(userID string) ([]PriceAlert, error) {
	var alerts []PriceAlert
	err := s.db.Where("user_id = ? AND active = ?", userID, true).Find(&alerts).Error
	return alerts, err
}

// CheckPriceAlerts checks if any alerts should be triggered
func (s *EnhancedService) CheckPriceAlerts(listingID string, currentPrice int) error {
	var alerts []PriceAlert
	if err := s.db.Where("listing_id = ? AND active = ? AND triggered = ? AND target_price >= ?",
		listingID, true, false, currentPrice).Find(&alerts).Error; err != nil {
		return err
	}

	for _, alert := range alerts {
		alert.Triggered = true
		s.db.Save(&alert)
		// TODO: Send notification to user
	}

	return nil
}

// GetFlexibleDates gets available dates within ±3 days
func (s *EnhancedService) GetFlexibleDates(listingID string, targetDate time.Time) ([]time.Time, error) {
	dates := []time.Time{}
	
	for i := -3; i <= 3; i++ {
		date := targetDate.AddDate(0, 0, i)
		// TODO: Check availability in calendar
		dates = append(dates, date)
	}
	
	return dates, nil
}

// GetBookingModifications gets modification history for a booking
func (s *EnhancedService) GetBookingModifications(bookingID string) ([]BookingModification, error) {
	var mods []BookingModification
	err := s.db.Where("booking_id = ?", bookingID).Order("created_at DESC").Find(&mods).Error
	return mods, err
}

// GetInsuranceOptions returns available insurance options
func (s *EnhancedService) GetInsuranceOptions(days int) []map[string]interface{} {
	return []map[string]interface{}{
		{
			"type":       "basic",
			"name":       "Basic Protection",
			"premium":    5000 * days,
			"coverage":   1000000,
			"deductible": 100000,
			"features":   []string{"Collision damage", "Theft protection"},
		},
		{
			"type":       "premium",
			"name":       "Premium Protection",
			"premium":    10000 * days,
			"coverage":   3000000,
			"deductible": 50000,
			"features":   []string{"Full collision", "Theft", "Personal injury", "Roadside assistance"},
		},
		{
			"type":       "full",
			"name":       "Full Coverage",
			"premium":    15000 * days,
			"coverage":   5000000,
			"deductible": 0,
			"features":   []string{"Zero deductible", "Full coverage", "Personal injury", "24/7 support", "Replacement vehicle"},
		},
	}
}

// Helper functions
func calculateRefund(booking Booking) int {
	now := time.Now()
	daysUntilStart := int(booking.StartDate.Sub(now).Hours() / 24)

	if daysUntilStart >= 7 {
		return booking.Total // Full refund
	} else if daysUntilStart >= 3 {
		return booking.Total * 75 / 100 // 75% refund
	} else if daysUntilStart >= 1 {
		return booking.Total * 50 / 100 // 50% refund
	}
	return 0 // No refund
}

func getCoverage(insuranceType string) int {
	switch insuranceType {
	case "basic":
		return 1000000
	case "premium":
		return 3000000
	case "full":
		return 5000000
	}
	return 0
}

func getDeductible(insuranceType string) int {
	switch insuranceType {
	case "basic":
		return 100000
	case "premium":
		return 50000
	case "full":
		return 0
	}
	return 0
}
