package auth

import (
	"time"

	"github.com/carkid0/rentals/api/config"
	"github.com/carkid0/rentals/api/middleware"
	"github.com/gofiber/fiber/v3"
)

func SetupRoutes(router fiber.Router) {
	auth := router.Group("/auth")
	auth.Post("/login", Login)
	auth.Post("/verify", VerifyOTP)
	auth.Post("/kyc", middleware.Protected(), SubmitKYC)
	auth.Patch("/role", middleware.Protected(), UpdateRole)
	auth.Get("/me", middleware.Protected(), GetMe)
}

// Login sends OTP to phone/email (mock: always succeeds)
func Login(c fiber.Ctx) error {
	var req LoginRequest
	if err := c.Bind().JSON(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request"})
	}

	if req.Phone == "" && req.Email == "" {
		return c.Status(400).JSON(fiber.Map{"error": "Phone or email required"})
	}

	// In production: call SmileID/Dojah OTP API
	// For now: OTP is always "123456"
	return c.JSON(fiber.Map{"message": "OTP sent", "expiresIn": 300})
}

// VerifyOTP validates OTP and returns JWT
func VerifyOTP(c fiber.Ctx) error {
	var req VerifyOTPRequest
	if err := c.Bind().JSON(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request"})
	}

	// Mock OTP validation
	if req.OTP != "123456" {
		return c.Status(401).JSON(fiber.Map{"error": "Invalid OTP"})
	}

	// Find or create user
	identifier := req.Phone
	if identifier == "" {
		identifier = req.Email
	}

	var user User
	if config.DB != nil {
		result := config.DB.Where("phone = ? OR email = ?", identifier, identifier).First(&user)
		if result.Error != nil {
			user = User{Phone: req.Phone, Email: req.Email, Role: "customer", KYCStatus: KYCPending}
			config.DB.Create(&user)
		}
	} else {
		// Memory fallback
		user = User{
			ID: "usr_mock_001", Phone: req.Phone, Email: req.Email,
			Role: "customer", KYCStatus: KYCPending, CreatedAt: time.Now(),
		}
	}

	token, err := middleware.GenerateToken(user.ID, user.Role)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Token generation failed"})
	}

	return c.JSON(AuthResponse{Token: token, User: user})
}

// SubmitKYC processes identity verification
func SubmitKYC(c fiber.Ctx) error {
	userID := c.Locals("userID").(string)

	var req KYCSubmission
	if err := c.Bind().JSON(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request"})
	}

	if config.DB != nil {
		config.DB.Model(&User{}).Where("id = ?", userID).Updates(map[string]interface{}{
			"full_name":  req.FullName,
			"kyc_status": KYCApproved, // In production: set to pending, webhook from SmileID updates
		})
	}

	return c.JSON(fiber.Map{"status": "approved", "message": "KYC verified"})
}

// GetMe returns current user
func GetMe(c fiber.Ctx) error {
	userID := c.Locals("userID").(string)

	if config.DB == nil {
		return c.JSON(User{ID: userID, Role: "customer", KYCStatus: KYCApproved})
	}

	var user User
	if err := config.DB.First(&user, "id = ?", userID).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "User not found"})
	}
	return c.JSON(user)
}

// UpdateRole allows a user to upgrade their role to lister
func UpdateRole(c fiber.Ctx) error {
	userID := c.Locals("userID").(string)

	var body struct {
		Role string `json:"role"`
	}
	if err := c.Bind().JSON(&body); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request"})
	}

	// Users can only upgrade to lister or driver
	if body.Role != "lister" && body.Role != "driver" {
		return c.Status(400).JSON(fiber.Map{"error": "Can only upgrade to lister or driver"})
	}

	if config.DB != nil {
		config.DB.Model(&User{}).Where("id = ?", userID).Update("role", body.Role)
	}

	// Generate new token with updated role
	token, _ := middleware.GenerateToken(userID, body.Role)
	return c.JSON(fiber.Map{"token": token, "role": body.Role})
}
