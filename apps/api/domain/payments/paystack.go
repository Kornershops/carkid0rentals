package payments

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"time"
)

// PaystackClient handles Paystack payment operations
type PaystackClient struct {
	secretKey string
	baseURL   string
	client    *http.Client
}

// NewPaystackClient creates a new Paystack client
func NewPaystackClient() *PaystackClient {
	secretKey := os.Getenv("PAYSTACK_SECRET_KEY")
	if secretKey == "" {
		log.Println("Warning: PAYSTACK_SECRET_KEY not set")
		secretKey = "sk_test_xxxxxxxxxxxxxxxxxxxxx"
	}

	return &PaystackClient{
		secretKey: secretKey,
		baseURL:   "https://api.paystack.co",
		client:    &http.Client{Timeout: 30 * time.Second},
	}
}

// InitializePayment initializes a payment with Paystack
func (p *PaystackClient) InitializePayment(email string, amount int, currency, reference, callbackURL string, metadata map[string]string) (string, string, error) {
	payload := map[string]interface{}{
		"email":        email,
		"amount":       amount,
		"currency":     currency,
		"reference":    reference,
		"callback_url": callbackURL,
		"metadata":     metadata,
	}

	body, _ := json.Marshal(payload)
	req, _ := http.NewRequest("POST", p.baseURL+"/transaction/initialize", bytes.NewBuffer(body))
	req.Header.Set("Authorization", "Bearer "+p.secretKey)
	req.Header.Set("Content-Type", "application/json")

	resp, err := p.client.Do(req)
	if err != nil {
		return "", "", fmt.Errorf("paystack request failed: %w", err)
	}
	defer resp.Body.Close()

	var result struct {
		Status  bool `json:"status"`
		Message string `json:"message"`
		Data    struct {
			AuthorizationURL string `json:"authorization_url"`
			AccessCode       string `json:"access_code"`
			Reference        string `json:"reference"`
		} `json:"data"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return "", "", fmt.Errorf("failed to decode response: %w", err)
	}

	if !result.Status {
		return "", "", fmt.Errorf("paystack error: %s", result.Message)
	}

	return result.Data.AuthorizationURL, result.Data.Reference, nil
}

// VerifyTransaction verifies a transaction with Paystack
func (p *PaystackClient) VerifyTransaction(reference string) (bool, error) {
	req, _ := http.NewRequest("GET", p.baseURL+"/transaction/verify/"+reference, nil)
	req.Header.Set("Authorization", "Bearer "+p.secretKey)

	resp, err := p.client.Do(req)
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

// ProcessRefund processes a refund with Paystack
func (p *PaystackClient) ProcessRefund(reference string, amount int) (string, error) {
	payload := map[string]interface{}{
		"transaction": reference,
	}

	// Partial refund if amount specified
	if amount > 0 {
		payload["amount"] = amount
	}

	body, _ := json.Marshal(payload)
	req, _ := http.NewRequest("POST", p.baseURL+"/refund", bytes.NewBuffer(body))
	req.Header.Set("Authorization", "Bearer "+p.secretKey)
	req.Header.Set("Content-Type", "application/json")

	resp, err := p.client.Do(req)
	if err != nil {
		return "", fmt.Errorf("refund request failed: %w", err)
	}
	defer resp.Body.Close()

	var result struct {
		Status  bool `json:"status"`
		Message string `json:"message"`
		Data    struct {
			ID string `json:"id"`
		} `json:"data"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return "", fmt.Errorf("failed to decode response: %w", err)
	}

	if !result.Status {
		return "", fmt.Errorf("refund failed: %s", result.Message)
	}

	return result.Data.ID, nil
}

// ChargeAuthorization charges a saved card using authorization code
func (p *PaystackClient) ChargeAuthorization(email, authCode string, amount int, currency string) (string, error) {
	payload := map[string]interface{}{
		"email":              email,
		"amount":             amount,
		"authorization_code": authCode,
		"currency":           currency,
	}

	body, _ := json.Marshal(payload)
	req, _ := http.NewRequest("POST", p.baseURL+"/transaction/charge_authorization", bytes.NewBuffer(body))
	req.Header.Set("Authorization", "Bearer "+p.secretKey)
	req.Header.Set("Content-Type", "application/json")

	resp, err := p.client.Do(req)
	if err != nil {
		return "", fmt.Errorf("charge request failed: %w", err)
	}
	defer resp.Body.Close()

	var result struct {
		Status  bool `json:"status"`
		Message string `json:"message"`
		Data    struct {
			Reference string `json:"reference"`
			Status    string `json:"status"`
		} `json:"data"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return "", fmt.Errorf("failed to decode response: %w", err)
	}

	if !result.Status || result.Data.Status != "success" {
		return "", fmt.Errorf("charge failed: %s", result.Message)
	}

	return result.Data.Reference, nil
}
