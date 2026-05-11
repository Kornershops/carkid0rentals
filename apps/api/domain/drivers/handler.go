package drivers

import (
	"time"

	"github.com/carkid0/rentals/api/config"
	"github.com/carkid0/rentals/api/domain/bookings"
	"github.com/carkid0/rentals/api/domain/listings"
	"github.com/carkid0/rentals/api/middleware"
	"github.com/gofiber/fiber/v3"
)

func SetupRoutes(router fiber.Router) {
	drivers := router.Group("/drivers", middleware.Protected())
	drivers.Get("/dashboard", GetDriverDashboard)
	drivers.Post("/register", RegisterDriver)
	drivers.Get("/verification-status", GetVerificationStatus)
	drivers.Post("/upload-document", UploadDocument)
	drivers.Post("/onboard", CompleteOnboarding)
}

func GetDriverDashboard(c fiber.Ctx) error {
	userID := c.Locals("userID").(string)

	if config.DB == nil {
		return c.Status(503).JSON(fiber.Map{"error": "Database unavailable"})
	}

	var todayEarnings int
	config.DB.Model(&bookings.Booking{}).
		Select("COALESCE(SUM(total), 0)").
		Where("user_id = ? AND status = ? AND DATE(created_at) = CURRENT_DATE", userID, "paid").
		Scan(&todayEarnings)

	var weeklyEarnings int
	config.DB.Model(&bookings.Booking{}).
		Select("COALESCE(SUM(total), 0)").
		Where("user_id = ? AND status = ? AND created_at >= ?",
			userID, "paid", time.Now().AddDate(0, 0, -7)).
		Scan(&weeklyEarnings)

	var activeBookings int64
	config.DB.Model(&bookings.Booking{}).
		Where("user_id = ? AND status IN ?", userID, []string{"confirmed", "paid", "active"}).
		Count(&activeBookings)

	var availableVehicles int64
	config.DB.Model(&listings.Listing{}).
		Where("category = ? AND availability = ?", "eco-gig", "available").
		Count(&availableVehicles)

	return c.JSON(fiber.Map{
		"todayEarnings":     todayEarnings,
		"weeklyEarnings":    weeklyEarnings,
		"activeBookings":    activeBookings,
		"availableVehicles": availableVehicles,
	})
}

func RegisterDriver(c fiber.Ctx) error {
	userID := c.Locals("userID").(string)

	var req struct {
		LicenseNumber string `json:"licenseNumber"`
		LicenseExpiry string `json:"licenseExpiry"`
		Experience    int    `json:"experience"`
		VehicleType   string `json:"vehicleType"`
	}

	if err := c.Bind().JSON(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request"})
	}

	if config.DB == nil {
		return c.Status(503).JSON(fiber.Map{"error": "Database unavailable"})
	}

	expiry, _ := time.Parse("2006-01-02", req.LicenseExpiry)

	driver := Driver{
		UserID:        userID,
		LicenseNumber: req.LicenseNumber,
		LicenseExpiry: expiry,
		Experience:    req.Experience,
		VehicleType:   req.VehicleType,
		Status:        "pending",
	}

	config.DB.Create(&driver)

	// Update user role to driver
	config.DB.Exec("UPDATE users SET role = ? WHERE id = ?", "driver", userID)

	return c.Status(201).JSON(driver)
}

func GetVerificationStatus(c fiber.Ctx) error {
	userID := c.Locals("userID").(string)

	if config.DB == nil {
		return c.Status(503).JSON(fiber.Map{"error": "Database unavailable"})
	}

	var driver Driver
	if err := config.DB.First(&driver, "user_id = ?", userID).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Driver not found"})
	}

	var documents []Document
	config.DB.Where("driver_id = ?", driver.ID).Find(&documents)

	return c.JSON(fiber.Map{
		"status":    driver.Status,
		"documents": documents,
	})
}

func UploadDocument(c fiber.Ctx) error {
	userID := c.Locals("userID").(string)
	docType := c.FormValue("type")

	if config.DB == nil {
		return c.Status(503).JSON(fiber.Map{"error": "Database unavailable"})
	}

	var driver Driver
	if err := config.DB.First(&driver, "user_id = ?", userID).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Driver not found"})
	}

	file, err := c.FormFile("document")
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "No file uploaded"})
	}

	// Save file locally (in production: use Cloudinary/S3)
	filename := "uploads/documents/" + userID + "_" + docType + "_" + file.Filename
	c.SaveFile(file, filename)

	document := Document{
		DriverID: driver.ID,
		Type:     docType,
		URL:      filename,
		Status:   "pending",
	}
	config.DB.Create(&document)

	return c.JSON(document)
}

func CompleteOnboarding(c fiber.Ctx) error {
	userID := c.Locals("userID").(string)

	var req struct {
		Preferences map[string]interface{} `json:"preferences"`
	}

	c.Bind().JSON(&req)

	if config.DB != nil {
		config.DB.Exec("UPDATE users SET updated_at = ? WHERE id = ?", time.Now(), userID)
	}

	return c.JSON(fiber.Map{"status": "complete"})
}
