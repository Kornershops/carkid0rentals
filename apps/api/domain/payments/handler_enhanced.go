package payments

import (
	"strconv"

	"github.com/gofiber/fiber/v3"
)

// Handler handles payment HTTP requests
type Handler struct {
	service *Service
}

// NewHandler creates a new payment handler
func NewHandler(service *Service) *Handler {
	return &Handler{service: service}
}

// RegisterEnhancedRoutes registers enhanced payment routes
func (h *Handler) RegisterEnhancedRoutes(app *fiber.App) {
	payments := app.Group("/api/v1/payments")

	// Saved payment methods
	payments.Post("/methods", h.SavePaymentMethod)
	payments.Get("/methods", h.GetPaymentMethods)
	payments.Delete("/methods/:id", h.DeletePaymentMethod)

	// Split payments
	payments.Post("/split", h.CreateSplitPayment)
	payments.Get("/split/:id", h.GetSplitPayment)

	// Installments
	payments.Post("/installments", h.CreateInstallmentPlan)
	payments.Get("/installments/:id", h.GetInstallmentPlan)

	// Refunds
	payments.Post("/refund", h.CreateRefund)
	payments.Get("/refunds", h.GetRefunds)

	// Payment history
	payments.Get("/history", h.GetPaymentHistory)
}

// SavePaymentMethod saves a payment method for future use
// POST /api/v1/payments/methods
func (h *Handler) SavePaymentMethod(c fiber.Ctx) error {
	userID := c.Locals("userID").(uint)

	var req SavePaymentMethodRequest
	if err := c.Bind().JSON(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	method, err := h.service.SavePaymentMethod(c.Context(), userID, req)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to save payment method",
		})
	}

	// Convert to response (hide sensitive data)
	response := PaymentMethodResponse{
		ID:          method.ID,
		Provider:    method.Provider,
		Type:        method.Type,
		Last4:       method.Last4,
		Brand:       method.Brand,
		ExpiryMonth: method.ExpiryMonth,
		ExpiryYear:  method.ExpiryYear,
		IsDefault:   method.IsDefault,
		CreatedAt:   method.CreatedAt,
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "Payment method saved successfully",
		"method":  response,
	})
}

// GetPaymentMethods retrieves all saved payment methods
// GET /api/v1/payments/methods
func (h *Handler) GetPaymentMethods(c fiber.Ctx) error {
	userID := c.Locals("userID").(uint)

	methods, err := h.service.GetPaymentMethods(c.Context(), userID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to get payment methods",
		})
	}

	// Convert to response format
	responses := make([]PaymentMethodResponse, len(methods))
	for i, m := range methods {
		responses[i] = PaymentMethodResponse{
			ID:          m.ID,
			Provider:    m.Provider,
			Type:        m.Type,
			Last4:       m.Last4,
			Brand:       m.Brand,
			ExpiryMonth: m.ExpiryMonth,
			ExpiryYear:  m.ExpiryYear,
			IsDefault:   m.IsDefault,
			CreatedAt:   m.CreatedAt,
		}
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"methods": responses,
	})
}

// DeletePaymentMethod deletes a saved payment method
// DELETE /api/v1/payments/methods/:id
func (h *Handler) DeletePaymentMethod(c fiber.Ctx) error {
	userID := c.Locals("userID").(uint)

	methodID, err := strconv.ParseUint(c.Params("id"), 10, 32)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid method ID",
		})
	}

	if err := h.service.DeletePaymentMethod(c.Context(), userID, uint(methodID)); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to delete payment method",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Payment method deleted successfully",
	})
}

// CreateSplitPayment creates a split payment request
// POST /api/v1/payments/split
func (h *Handler) CreateSplitPayment(c fiber.Ctx) error {
	userID := c.Locals("userID").(uint)

	var req CreateSplitPaymentRequest
	if err := c.Bind().JSON(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	// TODO: Get booking details to get total amount and currency
	// For now, using placeholder values
	totalAmount := 100000 // 1000.00 in smallest unit
	currency := "NGN"

	split, err := h.service.CreateSplitPayment(c.Context(), userID, req.BookingID, totalAmount, currency, req.Participants)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to create split payment",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message":       "Split payment created successfully",
		"split_payment": split,
	})
}

// GetSplitPayment retrieves a split payment
// GET /api/v1/payments/split/:id
func (h *Handler) GetSplitPayment(c fiber.Ctx) error {
	splitID, err := strconv.ParseUint(c.Params("id"), 10, 32)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid split payment ID",
		})
	}

	split, err := h.service.GetSplitPayment(c.Context(), uint(splitID))
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Split payment not found",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"split_payment": split,
	})
}

// CreateInstallmentPlan creates an installment payment plan
// POST /api/v1/payments/installments
func (h *Handler) CreateInstallmentPlan(c fiber.Ctx) error {
	userID := c.Locals("userID").(uint)

	var req CreateInstallmentRequest
	if err := c.Bind().JSON(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	// TODO: Get booking details to get total amount and currency
	totalAmount := 100000 // 1000.00 in smallest unit
	currency := "NGN"

	plan, err := h.service.CreateInstallmentPlan(c.Context(), userID, req.BookingID, totalAmount, currency, req.Installments)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to create installment plan",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "Installment plan created successfully",
		"plan":    plan,
	})
}

// GetInstallmentPlan retrieves an installment plan
// GET /api/v1/payments/installments/:id
func (h *Handler) GetInstallmentPlan(c fiber.Ctx) error {
	planID, err := strconv.ParseUint(c.Params("id"), 10, 32)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid plan ID",
		})
	}

	plan, err := h.service.GetPaymentPlan(c.Context(), uint(planID))
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Payment plan not found",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"plan": plan,
	})
}

// CreateRefund creates a refund request
// POST /api/v1/payments/refund
func (h *Handler) CreateRefund(c fiber.Ctx) error {
	userID := c.Locals("userID").(uint)

	var req RefundRequest
	if err := c.Bind().JSON(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	refund, err := h.service.CreateRefund(c.Context(), userID, req.PaymentID, req.Amount, req.Reason)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to create refund request",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "Refund request created successfully",
		"refund":  refund,
	})
}

// GetRefunds retrieves all refunds for a user
// GET /api/v1/payments/refunds
func (h *Handler) GetRefunds(c fiber.Ctx) error {
	userID := c.Locals("userID").(uint)

	refunds, err := h.service.GetRefunds(c.Context(), userID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to get refunds",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"refunds": refunds,
	})
}

// GetPaymentHistory retrieves payment history for a user
// GET /api/v1/payments/history?limit=20&offset=0
func (h *Handler) GetPaymentHistory(c fiber.Ctx) error {
	userID := c.Locals("userID").(uint)

	limit := c.QueryInt("limit", 20)
	offset := c.QueryInt("offset", 0)

	if limit > 100 {
		limit = 100
	}

	payments, total, err := h.service.GetPaymentHistory(c.Context(), userID, limit, offset)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to get payment history",
		})
	}

	return c.Status(fiber.StatusOK).JSON(PaymentHistoryResponse{
		Payments: payments,
		Total:    total,
		Limit:    limit,
		Offset:   offset,
	})
}
