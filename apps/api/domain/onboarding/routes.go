package onboarding

import (
	"github.com/gofiber/fiber/v3"
	"github.com/carkid0/rentals/api/middleware"
)

func SetupRoutes(router fiber.Router) {
	onboarding := router.Group("/onboarding")

	// Protected routes (require authentication)
	onboarding.Post("/progress", middleware.Protected(), SaveProgress)
	onboarding.Get("/progress", middleware.Protected(), GetProgress)
	onboarding.Delete("/progress", middleware.Protected(), DeleteProgress)
	
	// Admin only
	onboarding.Get("/analytics", middleware.Protected(), GetAnalytics)
}
