package notifications

import (
	"fmt"
	"log"
	"os"

	"github.com/twilio/twilio-go"
	twilioApi "github.com/twilio/twilio-go/rest/api/v2010"
)

// SMSClient handles SMS notifications via Twilio
type SMSClient struct {
	client *twilio.RestClient
	from   string
}

// NewSMSClient creates a new Twilio SMS client
func NewSMSClient() *SMSClient {
	accountSid := os.Getenv("TWILIO_ACCOUNT_SID")
	authToken := os.Getenv("TWILIO_AUTH_TOKEN")
	fromNumber := os.Getenv("TWILIO_PHONE_NUMBER")

	if accountSid == "" || authToken == "" {
		log.Println("Warning: Twilio credentials not set, SMS notifications disabled")
		return &SMSClient{}
	}

	client := twilio.NewRestClientWithParams(twilio.ClientParams{
		Username: accountSid,
		Password: authToken,
	})

	return &SMSClient{
		client: client,
		from:   fromNumber,
	}
}

// SendSMS sends an SMS notification
func (s *SMSClient) SendSMS(to, message string) error {
	if s.client == nil {
		log.Println("Twilio client not initialized, skipping SMS")
		return nil
	}

	params := &twilioApi.CreateMessageParams{}
	params.SetTo(to)
	params.SetFrom(s.from)
	params.SetBody(message)

	resp, err := s.client.Api.CreateMessage(params)
	if err != nil {
		return fmt.Errorf("error sending SMS: %w", err)
	}

	log.Printf("SMS sent successfully to %s (SID: %s)", to, *resp.Sid)
	return nil
}

// SendBookingConfirmationSMS sends a booking confirmation SMS
func (s *SMSClient) SendBookingConfirmationSMS(to, vehicleName, bookingID string) error {
	message := fmt.Sprintf(
		"CarKid0 Rentals: Your booking for %s is confirmed! Booking ID: %s. Check the app for details.",
		vehicleName,
		bookingID,
	)
	return s.SendSMS(to, message)
}

// SendSafeHaltViolationSMS sends a Safe-Halt violation SMS
func (s *SMSClient) SendSafeHaltViolationSMS(to, violationType string) error {
	message := fmt.Sprintf(
		"⚠️ CarKid0 Rentals ALERT: Safe-Halt violation detected (%s). Please check the app immediately.",
		violationType,
	)
	return s.SendSMS(to, message)
}
