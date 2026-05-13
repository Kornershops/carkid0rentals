package payments

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"
)

// FlutterwaveClient handles Flutterwave payment operations
type FlutterwaveClient struct {
	secretKey string
	baseURL   string
	client    *http.Client
}

// NewFlutterwaveClient creates a new Flutterwave client
func NewFlutterwaveClient() *FlutterwaveClient {
	secretKey := os.Getenv("FLUTTERWAVE_SECRET_KEY")
	if secretKey == "" {
		log.Println("Warning: FLUTTERWAVE_SECRET_KEY not set")
	}

	return &FlutterwaveClient{
		secretKey: secretKey,
		baseURL:   "https://api.flutterwave.com/v3",
		client:    &http.Client{Timeout: 30 * time.Second},
	}
}

// InitializePayment initializes a payment with Flutterwave
func (f *FlutterwaveClient) InitializePayment(email string, amount int, currency, reference, callbackURL string, metadata map[string]string) (string, string, error) {
	if f.secretKey == "" {
		return "", "", fmt.Errorf("flutterwave not configured")
	}

	payload := map[string]interface{}{
		"tx_ref":       reference,
		"amount":       float64(amount) / 100, // Flutterwave uses major units
		"currency":     currency,
		"redirect_url": callbackURL,
		"customer": map[string]string{
			"email": email,
		},
		"customizations": map[string]string{
			"title":       "CarKid0 Rentals",
			"description": "Vehicle Rental Payment",
		},
		"meta": metadata,
	}

	body, _ := json.Marshal(payload)
	req, _ := http.NewRequest("POST", f.baseURL+"/payments", bytes.NewBuffer(body))
	req.Header.Set("Authorization", "Bearer "+f.secretKey)
	req.Header.Set("Content-Type", "application/json")

	resp, err := f.client.Do(req)
	if err != nil {
		return "", "", fmt.Errorf("flutterwave request failed: %w", err)
	}
	defer resp.Body.Close()

	var result struct {
		Status  string `json:"status"`
		Message string `json:"message"`
		Data    struct {
			Link string `json:"link"`
		} `json:"data"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return "", "", fmt.Errorf("failed to decode response: %w", err)
	}

	if result.Status != "success" {
		return "", "", fmt.Errorf("flutterwave error: %s", result.Message)
	}

	return result.Data.Link, reference, nil
}

// VerifyTransaction verifies a transaction with Flutterwave
func (f *FlutterwaveClient) VerifyTransaction(transactionID string) (bool, error) {
	if f.secretKey == "" {
		return false, fmt.Errorf("flutterwave not configured")
	}

	req, _ := http.NewRequest("GET", f.baseURL+"/transactions/"+transactionID+"/verify", nil)
	req.Header.Set("Authorization", "Bearer "+f.secretKey)

	resp, err := f.client.Do(req)
	if err != nil {
		return false, err
	}
	defer resp.Body.Close()

	var result struct {
		Status string `json:"status"`
		Data   struct {
			Status string `json:"status"`
		} `json:"data"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return false, err
	}

	return result.Status == "success" && result.Data.Status == "successful", nil
}

// ProcessRefund processes a refund with Flutterwave
func (f *FlutterwaveClient) ProcessRefund(transactionID string, amount int) (string, error) {
	if f.secretKey == "" {
		return "", fmt.Errorf("flutterwave not configured")
	}

	payload := map[string]interface{}{
		"amount": float64(amount) / 100,
	}

	body, _ := json.Marshal(payload)
	req, _ := http.NewRequest("POST", f.baseURL+"/transactions/"+transactionID+"/refund", bytes.NewBuffer(body))
	req.Header.Set("Authorization", "Bearer "+f.secretKey)
	req.Header.Set("Content-Type", "application/json")

	resp, err := f.client.Do(req)
	if err != nil {
		return "", fmt.Errorf("refund request failed: %w", err)
	}
	defer resp.Body.Close()

	var result struct {
		Status  string `json:"status"`
		Message string `json:"message"`
		Data    struct {
			ID string `json:"id"`
		} `json:"data"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return "", fmt.Errorf("failed to decode response: %w", err)
	}

	if result.Status != "success" {
		return "", fmt.Errorf("refund failed: %s", result.Message)
	}

	return result.Data.ID, nil
}

// SaveCard saves a card for future payments
func (f *FlutterwaveClient) SaveCard(email, authCode string) (string, error) {
	// Flutterwave automatically saves cards when tokenization is enabled
	// Return the authorization code as the customer code
	return authCode, nil
}
