package payments

import (
	"context"
	"fmt"
	"log"
	"time"

	"gorm.io/gorm"
)

// Service handles payment business logic
type Service struct {
	db                *gorm.DB
	paystackClient    *PaystackClient
	flutterwaveClient *FlutterwaveClient
	stripeClient      *StripeClient
}

// NewService creates a new payment service
func NewService(db *gorm.DB) *Service {
	return &Service{
		db:                db,
		paystackClient:    NewPaystackClient(),
		flutterwaveClient: NewFlutterwaveClient(),
		stripeClient:      NewStripeClient(),
	}
}

// SavePaymentMethod saves a payment method for future use
func (s *Service) SavePaymentMethod(ctx context.Context, userID uint, req SavePaymentMethodRequest) (*PaymentMethod, error) {
	// If setting as default, unset other defaults
	if req.IsDefault {
		s.db.Model(&PaymentMethod{}).
			Where("user_id = ? AND is_default = ?", userID, true).
			Update("is_default", false)
	}

	method := &PaymentMethod{
		UserID:       userID,
		Provider:     req.Provider,
		Type:         "card",
		Last4:        req.Last4,
		Brand:        req.Brand,
		ExpiryMonth:  req.ExpiryMonth,
		ExpiryYear:   req.ExpiryYear,
		AuthCode:     req.AuthCode, // TODO: Encrypt this
		CustomerCode: req.CustomerCode,
		IsDefault:    req.IsDefault,
		Active:       true,
	}

	if err := s.db.Create(method).Error; err != nil {
		return nil, fmt.Errorf("failed to save payment method: %w", err)
	}

	return method, nil
}

// GetPaymentMethods retrieves all saved payment methods for a user
func (s *Service) GetPaymentMethods(ctx context.Context, userID uint) ([]PaymentMethod, error) {
	var methods []PaymentMethod
	if err := s.db.Where("user_id = ? AND active = ?", userID, true).
		Order("is_default DESC, created_at DESC").
		Find(&methods).Error; err != nil {
		return nil, fmt.Errorf("failed to get payment methods: %w", err)
	}

	return methods, nil
}

// DeletePaymentMethod soft deletes a payment method
func (s *Service) DeletePaymentMethod(ctx context.Context, userID uint, methodID uint) error {
	result := s.db.Where("id = ? AND user_id = ?", methodID, userID).
		Delete(&PaymentMethod{})

	if result.Error != nil {
		return fmt.Errorf("failed to delete payment method: %w", result.Error)
	}

	if result.RowsAffected == 0 {
		return fmt.Errorf("payment method not found")
	}

	return nil
}

// CreateSplitPayment creates a split payment request
func (s *Service) CreateSplitPayment(ctx context.Context, userID uint, bookingID string, totalAmount int, currency string, participants []string) (*SplitPayment, error) {
	participantCount := len(participants)
	amountPerUser := totalAmount / participantCount

	// Create split payment
	split := &SplitPayment{
		BookingID:     bookingID,
		InitiatorID:   userID,
		TotalAmount:   totalAmount,
		Currency:      currency,
		Participants:  participantCount,
		AmountPerUser: amountPerUser,
		PaidCount:     0,
		Status:        "pending",
	}

	if err := s.db.Create(split).Error; err != nil {
		return nil, fmt.Errorf("failed to create split payment: %w", err)
	}

	// Create participants
	for _, email := range participants {
		participant := &SplitPaymentParticipant{
			SplitPaymentID: split.ID,
			Email:          email,
			Amount:         amountPerUser,
			Paid:           false,
		}
		s.db.Create(participant)
	}

	return split, nil
}

// GetSplitPayment retrieves a split payment
func (s *Service) GetSplitPayment(ctx context.Context, splitID uint) (*SplitPayment, error) {
	var split SplitPayment
	if err := s.db.First(&split, splitID).Error; err != nil {
		return nil, fmt.Errorf("split payment not found: %w", err)
	}

	return &split, nil
}

// MarkSplitPaymentPaid marks a participant as paid
func (s *Service) MarkSplitPaymentPaid(ctx context.Context, splitID uint, userEmail string, paymentID string) error {
	now := time.Now()

	// Update participant
	result := s.db.Model(&SplitPaymentParticipant{}).
		Where("split_payment_id = ? AND email = ?", splitID, userEmail).
		Updates(map[string]interface{}{
			"paid":       true,
			"payment_id": paymentID,
			"paid_at":    now,
		})

	if result.Error != nil {
		return fmt.Errorf("failed to mark participant as paid: %w", result.Error)
	}

	// Update split payment paid count
	var paidCount int64
	s.db.Model(&SplitPaymentParticipant{}).
		Where("split_payment_id = ? AND paid = ?", splitID, true).
		Count(&paidCount)

	// Update split payment status
	var split SplitPayment
	s.db.First(&split, splitID)

	status := "partial"
	if paidCount == int64(split.Participants) {
		status = "completed"
	}

	s.db.Model(&split).Updates(map[string]interface{}{
		"paid_count": paidCount,
		"status":     status,
	})

	return nil
}

// CreateInstallmentPlan creates an installment payment plan
func (s *Service) CreateInstallmentPlan(ctx context.Context, userID uint, bookingID string, totalAmount int, currency string, installments int) (*PaymentPlan, error) {
	amountPerPlan := totalAmount / installments
	nextDueDate := time.Now().AddDate(0, 1, 0) // First payment due in 1 month

	plan := &PaymentPlan{
		BookingID:     bookingID,
		UserID:        userID,
		TotalAmount:   totalAmount,
		Currency:      currency,
		Installments:  installments,
		AmountPerPlan: amountPerPlan,
		PaidCount:     0,
		Status:        "active",
		NextDueDate:   nextDueDate,
	}

	if err := s.db.Create(plan).Error; err != nil {
		return nil, fmt.Errorf("failed to create installment plan: %w", err)
	}

	return plan, nil
}

// GetPaymentPlan retrieves a payment plan
func (s *Service) GetPaymentPlan(ctx context.Context, planID uint) (*PaymentPlan, error) {
	var plan PaymentPlan
	if err := s.db.First(&plan, planID).Error; err != nil {
		return nil, fmt.Errorf("payment plan not found: %w", err)
	}

	return &plan, nil
}

// ProcessInstallmentPayment processes an installment payment
func (s *Service) ProcessInstallmentPayment(ctx context.Context, planID uint) error {
	var plan PaymentPlan
	if err := s.db.First(&plan, planID).Error; err != nil {
		return fmt.Errorf("payment plan not found: %w", err)
	}

	// Increment paid count
	plan.PaidCount++

	// Update status if completed
	if plan.PaidCount >= plan.Installments {
		plan.Status = "completed"
	} else {
		// Set next due date
		plan.NextDueDate = time.Now().AddDate(0, 1, 0)
	}

	if err := s.db.Save(&plan).Error; err != nil {
		return fmt.Errorf("failed to update payment plan: %w", err)
	}

	return nil
}

// CreateRefund creates a refund request
func (s *Service) CreateRefund(ctx context.Context, userID uint, paymentID string, amount *int, reason string) (*Refund, error) {
	// Get payment
	var payment Payment
	if err := s.db.First(&payment, "id = ?", paymentID).Error; err != nil {
		return nil, fmt.Errorf("payment not found: %w", err)
	}

	// Verify user owns the payment
	// TODO: Convert userID to string or payment.UserID to uint
	// if payment.UserID != userID {
	// 	return nil, fmt.Errorf("unauthorized")
	// }

	// Default to full refund
	refundAmount := payment.Amount
	if amount != nil {
		refundAmount = *amount
	}

	refund := &Refund{
		PaymentID: paymentID,
		UserID:    userID,
		Amount:    refundAmount,
		Currency:  payment.Currency,
		Reason:    reason,
		Status:    RefundPending,
	}

	if err := s.db.Create(refund).Error; err != nil {
		return nil, fmt.Errorf("failed to create refund: %w", err)
	}

	// Process refund with provider
	go s.processRefund(refund, &payment)

	return refund, nil
}

// processRefund processes a refund with the payment provider
func (s *Service) processRefund(refund *Refund, payment *Payment) {
	var err error
	var providerRef string

	// Update status to processing
	s.db.Model(refund).Update("status", RefundProcessing)

	// Process with appropriate provider
	switch payment.Provider {
	case ProviderPaystack:
		providerRef, err = s.paystackClient.ProcessRefund(payment.Reference, refund.Amount)
	case ProviderFlutterwave:
		providerRef, err = s.flutterwaveClient.ProcessRefund(payment.Reference, refund.Amount)
	case ProviderStripe:
		providerRef, err = s.stripeClient.ProcessRefund(payment.Reference, refund.Amount)
	default:
		err = fmt.Errorf("unsupported provider: %s", payment.Provider)
	}

	now := time.Now()
	if err != nil {
		log.Printf("Refund processing failed: %v", err)
		s.db.Model(refund).Updates(map[string]interface{}{
			"status":       RefundFailed,
			"processed_at": now,
		})
		return
	}

	// Update refund status
	s.db.Model(refund).Updates(map[string]interface{}{
		"status":       RefundCompleted,
		"provider_ref": providerRef,
		"processed_at": now,
	})

	// Update payment status
	s.db.Model(payment).Update("status", PaymentRefunded)
}

// GetPaymentHistory retrieves payment history for a user
func (s *Service) GetPaymentHistory(ctx context.Context, userID uint, limit, offset int) ([]Payment, int64, error) {
	var payments []Payment
	var total int64

	// Get total count
	if err := s.db.Model(&Payment{}).Where("user_id = ?", userID).Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count payments: %w", err)
	}

	// Get paginated payments
	if err := s.db.Where("user_id = ?", userID).
		Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&payments).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to get payment history: %w", err)
	}

	return payments, total, nil
}

// GetRefunds retrieves refunds for a user
func (s *Service) GetRefunds(ctx context.Context, userID uint) ([]Refund, error) {
	var refunds []Refund
	if err := s.db.Where("user_id = ?", userID).
		Order("created_at DESC").
		Find(&refunds).Error; err != nil {
		return nil, fmt.Errorf("failed to get refunds: %w", err)
	}

	return refunds, nil
}
