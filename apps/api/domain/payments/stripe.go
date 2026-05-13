package payments

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/url"
	"os"
	"strings"
	"time"
)

// StripeClient handles Stripe payment operations
type StripeClient struct {
	secretKey string
	baseURL   string
	client    *http.Client
}

// NewStripeClient creates a new Stripe client
func NewStripeClient() *StripeClient {
	secretKey := os.Getenv("STRIPE_SECRET_KEY")
	if secretKey == "" {
		log.Println("Warning: STRIPE_SECRET_KEY not set")
	}

	return &StripeClient{
		secretKey: secretKey,
		baseURL:   "https://api.stripe.com/v1",
		client:    &http.Client{Timeout: 30 * time.Second},
	}
}

// InitializePayment creates a Stripe checkout session
func (s *StripeClient) InitializePayment(email string, amount int, currency, reference, callbackURL string, metadata map[string]string) (string, string, error) {
	if s.secretKey == "" {
		return "", "", fmt.Errorf("stripe not configured")
	}

	// Stripe uses lowercase currency codes
	currency = strings.ToLower(currency)

	// Create form data
	data := url.Values{}
	data.Set("payment_method_types[]", "card")
	data.Set("line_items[0][price_data][currency]", currency)
	data.Set("line_items[0][price_data][product_data][name]", "Vehicle Rental")
	data.Set("line_items[0][price_data][unit_amount]", fmt.Sprintf("%d", amount))
	data.Set("line_items[0][quantity]", "1")
	data.Set("mode", "payment")
	data.Set("success_url", callbackURL+"&session_id={CHECKOUT_SESSION_ID}")
	data.Set("cancel_url", callbackURL+"&canceled=true")
	data.Set("customer_email", email)
	data.Set("client_reference_id", reference)

	// Add metadata
	for key, value := range metadata {
		data.Set("metadata["+key+"]", value)
	}

	req, _ := http.NewRequest("POST", s.baseURL+"/checkout/sessions", strings.NewReader(data.Encode()))
	req.Header.Set("Authorization", "Bearer "+s.secretKey)
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	resp, err := s.client.Do(req)
	if err != nil {
		return "", "", fmt.Errorf("stripe request failed: %w", err)
	}
	defer resp.Body.Close()

	var result struct {
		ID  string `json:"id"`
		URL string `json:"url"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return "", "", fmt.Errorf("failed to decode response: %w", err)
	}

	if result.URL == "" {
		return "", "", fmt.Errorf("stripe session creation failed")
	}

	return result.URL, result.ID, nil
}

// VerifyTransaction verifies a Stripe checkout session
func (s *StripeClient) VerifyTransaction(sessionID string) (bool, error) {
	if s.secretKey == "" {
		return false, fmt.Errorf("stripe not configured")
	}

	req, _ := http.NewRequest("GET", s.baseURL+"/checkout/sessions/"+sessionID, nil)
	req.Header.Set("Authorization", "Bearer "+s.secretKey)

	resp, err := s.client.Do(req)
	if err != nil {
		return false, err
	}
	defer resp.Body.Close()

	var result struct {
		PaymentStatus string `json:"payment_status"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return false, err
	}

	return result.PaymentStatus == "paid", nil
}

// ProcessRefund processes a refund with Stripe
func (s *StripeClient) ProcessRefund(paymentIntentID string, amount int) (string, error) {
	if s.secretKey == "" {
		return "", fmt.Errorf("stripe not configured")
	}

	data := url.Values{}
	data.Set("payment_intent", paymentIntentID)
	if amount > 0 {
		data.Set("amount", fmt.Sprintf("%d", amount))
	}

	req, _ := http.NewRequest("POST", s.baseURL+"/refunds", strings.NewReader(data.Encode()))
	req.Header.Set("Authorization", "Bearer "+s.secretKey)
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	resp, err := s.client.Do(req)
	if err != nil {
		return "", fmt.Errorf("refund request failed: %w", err)
	}
	defer resp.Body.Close()

	var result struct {
		ID     string `json:"id"`
		Status string `json:"status"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return "", fmt.Errorf("failed to decode response: %w", err)
	}

	if result.Status != "succeeded" && result.Status != "pending" {
		return "", fmt.Errorf("refund failed with status: %s", result.Status)
	}

	return result.ID, nil
}

// SaveCard creates a Stripe setup intent for saving cards
func (s *StripeClient) SaveCard(customerID string) (string, error) {
	if s.secretKey == "" {
		return "", fmt.Errorf("stripe not configured")
	}

	data := url.Values{}
	data.Set("customer", customerID)
	data.Set("payment_method_types[]", "card")

	req, _ := http.NewRequest("POST", s.baseURL+"/setup_intents", strings.NewReader(data.Encode()))
	req.Header.Set("Authorization", "Bearer "+s.secretKey)
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	resp, err := s.client.Do(req)
	if err != nil {
		return "", fmt.Errorf("setup intent request failed: %w", err)
	}
	defer resp.Body.Close()

	var result struct {
		ClientSecret string `json:"client_secret"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return "", fmt.Errorf("failed to decode response: %w", err)
	}

	return result.ClientSecret, nil
}

// CreateCustomer creates a Stripe customer
func (s *StripeClient) CreateCustomer(email, name string) (string, error) {
	if s.secretKey == "" {
		return "", fmt.Errorf("stripe not configured")
	}

	data := url.Values{}
	data.Set("email", email)
	if name != "" {
		data.Set("name", name)
	}

	req, _ := http.NewRequest("POST", s.baseURL+"/customers", strings.NewReader(data.Encode()))
	req.Header.Set("Authorization", "Bearer "+s.secretKey)
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	resp, err := s.client.Do(req)
	if err != nil {
		return "", fmt.Errorf("customer creation failed: %w", err)
	}
	defer resp.Body.Close()

	var result struct {
		ID string `json:"id"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return "", fmt.Errorf("failed to decode response: %w", err)
	}

	return result.ID, nil
}
