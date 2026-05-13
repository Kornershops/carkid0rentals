package payments

import (
	"errors"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

// Mock payment providers
type MockPaymentProvider struct {
	mock.Mock
}

func (m *MockPaymentProvider) ProcessPayment(amount float64, currency string, metadata map[string]string) (string, error) {
	args := m.Called(amount, currency, metadata)
	return args.String(0), args.Error(1)
}

func (m *MockPaymentProvider) VerifyPayment(reference string) (bool, error) {
	args := m.Called(reference)
	return args.Bool(0), args.Error(1)
}

func (m *MockPaymentProvider) ProcessRefund(reference string, amount float64) (string, error) {
	args := m.Called(reference, amount)
	return args.String(0), args.Error(1)
}

// Test: Save Payment Method
func TestSavePaymentMethod(t *testing.T) {
	service := &PaymentService{}

	method := &PaymentMethod{
		UserID:         "user-123",
		Provider:       "paystack",
		CardLast4:      "4242",
		CardBrand:      "visa",
		ExpiryMonth:    "12",
		ExpiryYear:     "2025",
		CardholderName: "John Doe",
		IsDefault:      true,
	}

	err := service.SavePaymentMethod(method)

	assert.NoError(t, err)
	assert.NotEmpty(t, method.ID)
}

// Test: Get User Payment Methods
func TestGetUserPaymentMethods(t *testing.T) {
	service := &PaymentService{}

	userID := "user-123"

	methods, err := service.GetUserPaymentMethods(userID)

	assert.NoError(t, err)
	assert.NotNil(t, methods)
}

// Test: Delete Payment Method
func TestDeletePaymentMethod(t *testing.T) {
	service := &PaymentService{}

	methodID := "method-123"

	err := service.DeletePaymentMethod(methodID)

	assert.NoError(t, err)
}

// Test: Split Payment Calculation (Equal Split)
func TestSplitPaymentCalculationEqual(t *testing.T) {
	service := &PaymentService{}

	totalAmount := 10000.0
	participants := 4

	amountPerPerson := service.CalculateEqualSplit(totalAmount, participants)

	assert.Equal(t, 2500.0, amountPerPerson)
}

// Test: Split Payment Calculation (Custom Split)
func TestSplitPaymentCalculationCustom(t *testing.T) {
	service := &PaymentService{}

	totalAmount := 10000.0
	customAmounts := []float64{3000.0, 2500.0, 2000.0, 2500.0}

	isValid := service.ValidateCustomSplit(totalAmount, customAmounts)

	assert.True(t, isValid)
}

// Test: Split Payment Calculation (Invalid Custom Split)
func TestSplitPaymentCalculationInvalid(t *testing.T) {
	service := &PaymentService{}

	totalAmount := 10000.0
	customAmounts := []float64{3000.0, 2500.0, 2000.0, 3000.0} // Total: 10500

	isValid := service.ValidateCustomSplit(totalAmount, customAmounts)

	assert.False(t, isValid)
}

// Test: Create Split Payment
func TestCreateSplitPayment(t *testing.T) {
	service := &PaymentService{}

	splitPayment := &SplitPayment{
		BookingID:   "booking-123",
		TotalAmount: 10000.0,
		Participants: []SplitParticipant{
			{Email: "user1@example.com", Amount: 2500.0},
			{Email: "user2@example.com", Amount: 2500.0},
			{Email: "user3@example.com", Amount: 2500.0},
			{Email: "user4@example.com", Amount: 2500.0},
		},
	}

	err := service.CreateSplitPayment(splitPayment)

	assert.NoError(t, err)
	assert.NotEmpty(t, splitPayment.ID)
}

// Test: Installment Calculation (3 months)
func TestInstallmentCalculation3Months(t *testing.T) {
	service := &PaymentService{}

	amount := 100000.0
	months := 3
	interestRate := 0.05 // 5%

	monthlyPayment := service.CalculateMonthlyPayment(amount, months, interestRate)
	totalCost := service.CalculateTotalCost(amount, interestRate)

	expectedMonthly := (amount * (1 + interestRate)) / float64(months)
	expectedTotal := amount * (1 + interestRate)

	assert.Equal(t, expectedMonthly, monthlyPayment)
	assert.Equal(t, expectedTotal, totalCost)
}

// Test: Installment Calculation (6 months)
func TestInstallmentCalculation6Months(t *testing.T) {
	service := &PaymentService{}

	amount := 100000.0
	months := 6
	interestRate := 0.08 // 8%

	monthlyPayment := service.CalculateMonthlyPayment(amount, months, interestRate)
	totalCost := service.CalculateTotalCost(amount, interestRate)

	expectedMonthly := (amount * (1 + interestRate)) / float64(months)
	expectedTotal := amount * (1 + interestRate)

	assert.Equal(t, expectedMonthly, monthlyPayment)
	assert.Equal(t, expectedTotal, totalCost)
}

// Test: Installment Calculation (12 months)
func TestInstallmentCalculation12Months(t *testing.T) {
	service := &PaymentService{}

	amount := 100000.0
	months := 12
	interestRate := 0.12 // 12%

	monthlyPayment := service.CalculateMonthlyPayment(amount, months, interestRate)
	totalCost := service.CalculateTotalCost(amount, interestRate)

	expectedMonthly := (amount * (1 + interestRate)) / float64(months)
	expectedTotal := amount * (1 + interestRate)

	assert.Equal(t, expectedMonthly, monthlyPayment)
	assert.Equal(t, expectedTotal, totalCost)
}

// Test: Create Installment Plan
func TestCreateInstallmentPlan(t *testing.T) {
	service := &PaymentService{}

	installment := &InstallmentPlan{
		BookingID:      "booking-123",
		Amount:         100000.0,
		Months:         6,
		InterestRate:   0.08,
		MonthlyPayment: 18000.0,
		TotalCost:      108000.0,
	}

	err := service.CreateInstallmentPlan(installment)

	assert.NoError(t, err)
	assert.NotEmpty(t, installment.ID)
}

// Test: Installment Eligibility Check
func TestInstallmentEligibility(t *testing.T) {
	service := &PaymentService{}

	// Eligible amount
	assert.True(t, service.IsEligibleForInstallment(50000.0))
	assert.True(t, service.IsEligibleForInstallment(100000.0))

	// Not eligible amount
	assert.False(t, service.IsEligibleForInstallment(49999.0))
	assert.False(t, service.IsEligibleForInstallment(10000.0))
}

// Test: Process Refund (Full)
func TestProcessFullRefund(t *testing.T) {
	mockProvider := new(MockPaymentProvider)
	service := &PaymentService{Provider: mockProvider}

	refund := &Refund{
		BookingID:    "booking-123",
		Amount:       10000.0,
		Reason:       "cancellation",
		RefundAmount: 10000.0,
	}

	mockProvider.On("ProcessRefund", mock.Anything, refund.RefundAmount).Return("refund-123", nil)

	err := service.ProcessRefund(refund)

	assert.NoError(t, err)
	assert.Equal(t, "processed", refund.Status)
	mockProvider.AssertExpectations(t)
}

// Test: Process Refund (Partial)
func TestProcessPartialRefund(t *testing.T) {
	mockProvider := new(MockPaymentProvider)
	service := &PaymentService{Provider: mockProvider}

	refund := &Refund{
		BookingID:    "booking-123",
		Amount:       10000.0,
		Reason:       "cancellation",
		RefundAmount: 7500.0, // 75% refund
	}

	mockProvider.On("ProcessRefund", mock.Anything, refund.RefundAmount).Return("refund-123", nil)

	err := service.ProcessRefund(refund)

	assert.NoError(t, err)
	assert.Equal(t, "processed", refund.Status)
	mockProvider.AssertExpectations(t)
}

// Test: Payment Provider Fallback
func TestPaymentProviderFallback(t *testing.T) {
	mockPaystack := new(MockPaymentProvider)
	mockFlutterwave := new(MockPaymentProvider)
	mockStripe := new(MockPaymentProvider)

	service := &PaymentService{
		Providers: []PaymentProvider{mockPaystack, mockFlutterwave, mockStripe},
	}

	amount := 10000.0
	currency := "NGN"
	metadata := map[string]string{"booking_id": "booking-123"}

	// Paystack fails
	mockPaystack.On("ProcessPayment", amount, currency, metadata).Return("", errors.New("paystack error"))

	// Flutterwave succeeds
	mockFlutterwave.On("ProcessPayment", amount, currency, metadata).Return("flw-ref-123", nil)

	reference, err := service.ProcessPaymentWithFallback(amount, currency, metadata)

	assert.NoError(t, err)
	assert.Equal(t, "flw-ref-123", reference)
	mockPaystack.AssertExpectations(t)
	mockFlutterwave.AssertExpectations(t)
}

// Test: Payment Provider All Fail
func TestPaymentProviderAllFail(t *testing.T) {
	mockPaystack := new(MockPaymentProvider)
	mockFlutterwave := new(MockPaymentProvider)
	mockStripe := new(MockPaymentProvider)

	service := &PaymentService{
		Providers: []PaymentProvider{mockPaystack, mockFlutterwave, mockStripe},
	}

	amount := 10000.0
	currency := "NGN"
	metadata := map[string]string{"booking_id": "booking-123"}

	// All providers fail
	mockPaystack.On("ProcessPayment", amount, currency, metadata).Return("", errors.New("paystack error"))
	mockFlutterwave.On("ProcessPayment", amount, currency, metadata).Return("", errors.New("flutterwave error"))
	mockStripe.On("ProcessPayment", amount, currency, metadata).Return("", errors.New("stripe error"))

	reference, err := service.ProcessPaymentWithFallback(amount, currency, metadata)

	assert.Error(t, err)
	assert.Empty(t, reference)
	assert.Contains(t, err.Error(), "all payment providers failed")
}

// Test: Get Payment History
func TestGetPaymentHistory(t *testing.T) {
	service := &PaymentService{}

	userID := "user-123"
	page := 1
	limit := 10

	history, err := service.GetPaymentHistory(userID, page, limit)

	assert.NoError(t, err)
	assert.NotNil(t, history)
}

// Test: Payment History Filtering
func TestPaymentHistoryFiltering(t *testing.T) {
	service := &PaymentService{}

	filters := PaymentFilters{
		UserID:   "user-123",
		Status:   "success",
		Provider: "paystack",
		DateFrom: time.Now().AddDate(0, -1, 0),
		DateTo:   time.Now(),
	}

	history, err := service.GetFilteredPaymentHistory(filters, 1, 10)

	assert.NoError(t, err)
	assert.NotNil(t, history)
}

// Test: Verify Payment
func TestVerifyPayment(t *testing.T) {
	mockProvider := new(MockPaymentProvider)
	service := &PaymentService{Provider: mockProvider}

	reference := "pay-ref-123"

	mockProvider.On("VerifyPayment", reference).Return(true, nil)

	isValid, err := service.VerifyPayment(reference)

	assert.NoError(t, err)
	assert.True(t, isValid)
	mockProvider.AssertExpectations(t)
}

// Helper methods for PaymentService
func (s *PaymentService) CalculateEqualSplit(total float64, participants int) float64 {
	return total / float64(participants)
}

func (s *PaymentService) ValidateCustomSplit(total float64, amounts []float64) bool {
	sum := 0.0
	for _, amount := range amounts {
		sum += amount
	}
	return sum == total
}

func (s *PaymentService) CalculateMonthlyPayment(amount float64, months int, interestRate float64) float64 {
	return (amount * (1 + interestRate)) / float64(months)
}

func (s *PaymentService) CalculateTotalCost(amount float64, interestRate float64) float64 {
	return amount * (1 + interestRate)
}

func (s *PaymentService) IsEligibleForInstallment(amount float64) bool {
	return amount >= 50000.0
}
