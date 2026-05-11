package main

import (
	"bytes"
	"encoding/json"
	"net/http/httptest"
	"testing"

	"github.com/carkid0/rentals/api/config"
	"github.com/carkid0/rentals/api/domain/auth"
	"github.com/carkid0/rentals/api/domain/bookings"
	"github.com/carkid0/rentals/api/domain/company"
	"github.com/carkid0/rentals/api/domain/drivers"
	"github.com/carkid0/rentals/api/domain/fleet"
	"github.com/carkid0/rentals/api/domain/hauler"
	"github.com/carkid0/rentals/api/domain/iot"
	"github.com/carkid0/rentals/api/domain/lister"
	"github.com/carkid0/rentals/api/domain/listings"
	"github.com/carkid0/rentals/api/domain/logistics"
	"github.com/carkid0/rentals/api/domain/messages"
	"github.com/carkid0/rentals/api/domain/payments"
	"github.com/carkid0/rentals/api/middleware"
	"github.com/gofiber/fiber/v3"
	"github.com/stretchr/testify/assert"
)

func setupTestApp() *fiber.App {
	app := fiber.New()
	api := app.Group("/api/v1")
	
	auth.SetupRoutes(api)
	listings.SetupRoutes(api)
	bookings.SetupRoutes(api)
	payments.SetupRoutes(api)
	fleet.SetupRoutes(api)
	lister.SetupRoutes(api)
	drivers.SetupRoutes(api)
	messages.SetupRoutes(api)
	company.SetupRoutes(api)
	iot.SetupRoutes(api)
	logistics.SetupRoutes(api)
	hauler.SetupRoutes(api)
	
	return app
}

func getTestToken() string {
	token, _ := middleware.GenerateToken("test_user_001", "customer")
	return token
}

func TestHealthEndpoint(t *testing.T) {
	app := fiber.New()
	app.Get("/health", func(c fiber.Ctx) error {
		return c.JSON(fiber.Map{"status": "operational"})
	})

	req := httptest.NewRequest("GET", "/health", nil)
	resp, _ := app.Test(req)

	assert.Equal(t, 200, resp.StatusCode)
}

func TestAuthLogin(t *testing.T) {
	app := setupTestApp()

	body := map[string]string{"phone": "+2348012345678"}
	jsonBody, _ := json.Marshal(body)

	req := httptest.NewRequest("POST", "/api/v1/auth/login", bytes.NewBuffer(jsonBody))
	req.Header.Set("Content-Type", "application/json")

	resp, _ := app.Test(req)
	assert.Equal(t, 200, resp.StatusCode)
}

func TestAuthVerify(t *testing.T) {
	app := setupTestApp()

	body := map[string]string{
		"phone": "+2348012345678",
		"otp":   "123456",
	}
	jsonBody, _ := json.Marshal(body)

	req := httptest.NewRequest("POST", "/api/v1/auth/verify", bytes.NewBuffer(jsonBody))
	req.Header.Set("Content-Type", "application/json")

	resp, _ := app.Test(req)
	assert.Equal(t, 200, resp.StatusCode)
}

func TestGetListings(t *testing.T) {
	app := setupTestApp()

	req := httptest.NewRequest("GET", "/api/v1/listings", nil)
	resp, _ := app.Test(req)

	assert.Equal(t, 200, resp.StatusCode)
}

func TestListerDashboard(t *testing.T) {
	app := setupTestApp()
	token := getTestToken()

	req := httptest.NewRequest("GET", "/api/v1/lister/dashboard", nil)
	req.Header.Set("Authorization", "Bearer "+token)

	resp, _ := app.Test(req)
	assert.Equal(t, 200, resp.StatusCode)
}

func TestDriverDashboard(t *testing.T) {
	app := setupTestApp()
	token := getTestToken()

	req := httptest.NewRequest("GET", "/api/v1/drivers/dashboard", nil)
	req.Header.Set("Authorization", "Bearer "+token)

	resp, _ := app.Test(req)
	assert.Equal(t, 200, resp.StatusCode)
}

func TestCompanyFleet(t *testing.T) {
	app := setupTestApp()
	token := getTestToken()

	req := httptest.NewRequest("GET", "/api/v1/company/fleet", nil)
	req.Header.Set("Authorization", "Bearer "+token)

	resp, _ := app.Test(req)
	assert.Equal(t, 200, resp.StatusCode)
}

func TestIoTCommand(t *testing.T) {
	app := setupTestApp()
	token := getTestToken()

	body := map[string]string{
		"vehicleId": "v-001",
		"command":   "lock",
	}
	jsonBody, _ := json.Marshal(body)

	req := httptest.NewRequest("POST", "/api/v1/iot/command", bytes.NewBuffer(jsonBody))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+token)

	resp, _ := app.Test(req)
	assert.Equal(t, 200, resp.StatusCode)
}

func TestLogisticsDeliveries(t *testing.T) {
	app := setupTestApp()
	token := getTestToken()

	req := httptest.NewRequest("GET", "/api/v1/logistics/deliveries", nil)
	req.Header.Set("Authorization", "Bearer "+token)

	resp, _ := app.Test(req)
	assert.Equal(t, 200, resp.StatusCode)
}

func TestHaulerDashboard(t *testing.T) {
	app := setupTestApp()
	token := getTestToken()

	req := httptest.NewRequest("GET", "/api/v1/hauler/dashboard", nil)
	req.Header.Set("Authorization", "Bearer "+token)

	resp, _ := app.Test(req)
	assert.Equal(t, 200, resp.StatusCode)
}

func TestUnauthorizedAccess(t *testing.T) {
	app := setupTestApp()

	req := httptest.NewRequest("GET", "/api/v1/lister/dashboard", nil)
	resp, _ := app.Test(req)

	assert.Equal(t, 401, resp.StatusCode)
}
