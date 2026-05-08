package payments

import (
	"bytes"
	"crypto/hmac"
	"crypto/sha512"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"time"

	"github.com/carkid0/rentals/api/config"
	"github.com/carkid0/rentals/api/domain/bookings"
	"github.com/carkid0/rentals/api/middleware"
	"github.com/gofiber/fiber/v3"
)

var paystackSecretKey string

func init() {
	paystackSecretKey = os.Getenv("PAYSTACK_SECRET_KEY")
	if paystackSecretKey == "" {
		paystackSecretKey = "sk_test_xxxxxxxxxxxxxxxxxxxxx"
	}
}

func SetupRoutes(router fiber.Router) {
	p := router.Group("/payments")
	p.Post("/initialize", middleware.Protected(), InitializePayment)
	p.Post("/webhook", HandleWebhook) // No auth — Paystack calls this
	p.Get("/:bookingId", middleware.Protected(), GetPaymentStatus)
}

func InitializePayment(c fiber.Ctx) error {
	userID := c.Locals("userID").(string)

	var req InitPaymentRequest
	if err := c.Bind().JSON(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request"})
	}

	if config.DB == nil {
		return c.Status(503).JSON(fiber.Map{"error": "Database unavailable"})
	}

	// Fetch booking
	var booking bookings.Booking
	if err := config.DB.First(&booking, "id = ? AND user_id = ?", req.BookingID, userID).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Booking not found"})
	}

	// Amount in smallest unit (kobo for NGN, cents for others)
	amount := booking.Total * 100
	reference := fmt.Sprintf("ck0_%d_%s", time.Now().UnixMilli(), booking.ID[:8])

	// Call Paystack Initialize Transaction
	payload := map[string]interface{}{
		"email":     booking.Email,
		"amount":    amount,
		"currency":  booking.Currency,
		"reference": reference,
		"callback_url": os.Getenv("FRONTEND_URL") + "/booking/confirmation?listing=" + booking.ListingID +
			"&start=" + booking.StartDate.Format("2006-01-02") +
			"&end=" + booking.EndDate.Format("2006-01-02"),
		"metadata": map[string]string{
			"booking_id": booking.ID,
			"user_id":    userID,
		},
	}

	body, _ := json.Marshal(payload)
	req2, _ := http.NewRequest("POST", "https://api.paystack.co/transaction/initialize", bytes.NewBuffer(body))
	req2.Header.Set("Authorization", "Bearer "+paystackSecretKey)
	req2.Header.Set("Content-Type", "application/json")

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req2)
	if err != nil {
		return c.Status(502).JSON(fiber.Map{"error": "Payment gateway unreachable"})
	}
	defer resp.Body.Close()

	var psResp struct {
		Status  bool `json:"status"`
		Data    struct {
			AuthorizationURL string `json:"authorization_url"`
			AccessCode       string `json:"access_code"`
			Reference        string `json:"reference"`
		} `json:"data"`
		Message string `json:"message"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&psResp); err != nil || !psResp.Status {
		return c.Status(502).JSON(fiber.Map{"error": "Payment initialization failed"})
	}

	// Save payment record
	payment := Payment{
		BookingID: booking.ID,
		UserID:    userID,
		Amount:    amount,
		Currency:  booking.Currency,
		Reference: reference,
		Status:    PaymentPending,
	}
	config.DB.Create(&payment)

	// Update booking with payment ref
	config.DB.Model(&booking).Update("payment_ref", reference)

	return c.JSON(PaystackInitResponse{
		AuthorizationURL: psResp.Data.AuthorizationURL,
		Reference:        psResp.Data.Reference,
		AccessCode:       psResp.Data.AccessCode,
	})
}

func HandleWebhook(c fiber.Ctx) error {
	// Verify signature
	signature := c.Get("x-paystack-signature")
	bodyBytes := c.Body()

	mac := hmac.New(sha512.New, []byte(paystackSecretKey))
	mac.Write(bodyBytes)
	expectedSig := hex.EncodeToString(mac.Sum(nil))

	if signature != expectedSig {
		return c.Status(401).JSON(fiber.Map{"error": "Invalid signature"})
	}

	var event struct {
		Event string `json:"event"`
		Data  struct {
			Reference string `json:"reference"`
			Status    string `json:"status"`
			Metadata  struct {
				BookingID string `json:"booking_id"`
			} `json:"metadata"`
		} `json:"data"`
	}

	if err := json.Unmarshal(bodyBytes, &event); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid payload"})
	}

	if config.DB == nil {
		return c.SendStatus(200)
	}

	if event.Event == "charge.success" {
		// Update payment
		config.DB.Model(&Payment{}).Where("reference = ?", event.Data.Reference).Updates(map[string]interface{}{
			"status":       PaymentSuccess,
			"paystack_ref": event.Data.Reference,
		})

		// Update booking status to paid
		config.DB.Model(&bookings.Booking{}).Where("id = ?", event.Data.Metadata.BookingID).Update("status", bookings.StatusPaid)
	}

	return c.SendStatus(200)
}

func GetPaymentStatus(c fiber.Ctx) error {
	userID := c.Locals("userID").(string)
	bookingID := c.Params("bookingId")

	if config.DB == nil {
		return c.Status(404).JSON(fiber.Map{"error": "Not found"})
	}

	var payment Payment
	if err := config.DB.First(&payment, "booking_id = ? AND user_id = ?", bookingID, userID).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Payment not found"})
	}

	return c.JSON(payment)
}

// VerifyTransaction verifies a transaction with Paystack (utility)
func VerifyTransaction(reference string) (bool, error) {
	req, _ := http.NewRequest("GET", "https://api.paystack.co/transaction/verify/"+reference, nil)
	req.Header.Set("Authorization", "Bearer "+paystackSecretKey)

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return false, err
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	var result struct {
		Status bool `json:"status"`
		Data   struct {
			Status string `json:"status"`
		} `json:"data"`
	}
	json.Unmarshal(body, &result)

	return result.Status && result.Data.Status == "success", nil
}
