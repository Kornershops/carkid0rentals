package loyalty

import (
	"strconv"

	"github.com/gofiber/fiber/v3"
)

type Handler struct {
	service *Service
}

func NewHandler(service *Service) *Handler {
	return &Handler{service: service}
}

// GetPoints gets user's points balance and tier
func (h *Handler) GetPoints(c fiber.Ctx) error {
	userID := c.Locals("userID").(uint)

	lp, err := h.service.GetOrCreateLoyaltyPoints(userID)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}

	nextTier, pointsNeeded := GetNextTier(lp.LifetimePoints)

	return c.JSON(fiber.Map{
		"points":          lp.Points,
		"tier":            lp.Tier,
		"lifetime_points": lp.LifetimePoints,
		"next_tier":       nextTier,
		"points_to_next":  pointsNeeded,
	})
}

// GetRewards gets available rewards catalog
func (h *Handler) GetRewards(c fiber.Ctx) error {
	rewards, err := h.service.GetActiveRewards()
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{"rewards": rewards})
}

// RedeemReward redeems points for a reward
func (h *Handler) RedeemReward(c fiber.Ctx) error {
	userID := c.Locals("userID").(uint)

	var req struct {
		RewardID uint `json:"reward_id"`
	}
	if err := c.Bind().JSON(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid request"})
	}

	code, err := h.service.RedeemPoints(userID, req.RewardID)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": err.Error()})
	}

	lp, _ := h.service.GetOrCreateLoyaltyPoints(userID)

	return c.JSON(fiber.Map{
		"success":     true,
		"new_balance": lp.Points,
		"reward_code": code,
	})
}

// GetHistory gets points transaction history
func (h *Handler) GetHistory(c fiber.Ctx) error {
	userID := c.Locals("userID").(uint)

	limit := 50
	if l := c.Query("limit"); l != "" {
		if parsed, err := strconv.Atoi(l); err == nil {
			limit = parsed
		}
	}

	transactions, err := h.service.GetPointsHistory(userID, limit)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{
		"transactions": transactions,
		"total":        len(transactions),
	})
}

// GenerateCode generates unique referral code
func (h *Handler) GenerateCode(c fiber.Ctx) error {
	userID := c.Locals("userID").(uint)

	referral, err := h.service.GenerateReferralCode(userID)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}

	shareURL := "https://carkid0rentals.com/signup?ref=" + referral.Code

	return c.JSON(fiber.Map{
		"code":      referral.Code,
		"share_url": shareURL,
	})
}

// ApplyCode applies referral code during signup
func (h *Handler) ApplyCode(c fiber.Ctx) error {
	userID := c.Locals("userID").(uint)

	var req struct {
		Code string `json:"code"`
	}
	if err := c.Bind().JSON(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid request"})
	}

	if err := h.service.ApplyReferralCode(req.Code, userID); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{
		"success":      true,
		"bonus_points": 500,
	})
}

// GetReferralStats gets referral statistics
func (h *Handler) GetReferralStats(c fiber.Ctx) error {
	userID := c.Locals("userID").(uint)

	stats, err := h.service.GetReferralStats(userID)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(stats)
}

// RegisterRoutes registers loyalty routes
func (h *Handler) RegisterRoutes(app fiber.Router, authMiddleware fiber.Handler) {
	loyalty := app.Group("/loyalty", authMiddleware)
	loyalty.Get("/points", h.GetPoints)
	loyalty.Get("/rewards", h.GetRewards)
	loyalty.Post("/redeem", h.RedeemReward)
	loyalty.Get("/history", h.GetHistory)

	referrals := app.Group("/referrals", authMiddleware)
	referrals.Post("/generate-code", h.GenerateCode)
	referrals.Post("/apply", h.ApplyCode)
	referrals.Get("/stats", h.GetReferralStats)
}
