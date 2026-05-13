package notifications

import (
	"fmt"
	"log"
	"os"

	"github.com/sendgrid/sendgrid-go"
	"github.com/sendgrid/sendgrid-go/helpers/mail"
)

// EmailClient handles email notifications via SendGrid
type EmailClient struct {
	client *sendgrid.Client
	from   *mail.Email
}

// NewEmailClient creates a new SendGrid email client
func NewEmailClient() *EmailClient {
	apiKey := os.Getenv("SENDGRID_API_KEY")
	if apiKey == "" {
		log.Println("Warning: SENDGRID_API_KEY not set, email notifications disabled")
		return &EmailClient{}
	}

	fromEmail := os.Getenv("SENDGRID_FROM_EMAIL")
	if fromEmail == "" {
		fromEmail = "notifications@carkid0rentals.com"
	}

	fromName := os.Getenv("SENDGRID_FROM_NAME")
	if fromName == "" {
		fromName = "CarKid0 Rentals"
	}

	return &EmailClient{
		client: sendgrid.NewSendClient(apiKey),
		from:   mail.NewEmail(fromName, fromEmail),
	}
}

// SendEmail sends an email notification
func (e *EmailClient) SendEmail(toEmail, toName, subject, htmlContent string) error {
	if e.client == nil {
		log.Println("SendGrid client not initialized, skipping email")
		return nil
	}

	to := mail.NewEmail(toName, toEmail)
	message := mail.NewSingleEmail(e.from, subject, to, "", htmlContent)

	response, err := e.client.Send(message)
	if err != nil {
		return fmt.Errorf("error sending email: %w", err)
	}

	if response.StatusCode >= 400 {
		return fmt.Errorf("sendgrid error: status %d, body: %s", response.StatusCode, response.Body)
	}

	log.Printf("Email sent successfully to %s (status: %d)", toEmail, response.StatusCode)
	return nil
}

// SendBookingConfirmationEmail sends a booking confirmation email
func (e *EmailClient) SendBookingConfirmationEmail(toEmail, toName, vehicleName, bookingID string) error {
	subject := "Booking Confirmed - CarKid0 Rentals"
	htmlContent := fmt.Sprintf(`
		<html>
		<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
			<div style="max-width: 600px; margin: 0 auto; padding: 20px;">
				<h1 style="color: #2563eb;">Booking Confirmed! 🎉</h1>
				<p>Hi %s,</p>
				<p>Your booking for <strong>%s</strong> has been confirmed.</p>
				<p><strong>Booking ID:</strong> %s</p>
				<div style="margin: 30px 0; padding: 20px; background-color: #f3f4f6; border-radius: 8px;">
					<h3 style="margin-top: 0;">Next Steps:</h3>
					<ol>
						<li>Check your booking details in the app</li>
						<li>Complete payment if not already done</li>
						<li>Prepare required documents</li>
						<li>Arrive at pickup location on time</li>
					</ol>
				</div>
				<p>If you have any questions, please contact our support team.</p>
				<p>Best regards,<br>CarKid0 Rentals Team</p>
			</div>
		</body>
		</html>
	`, toName, vehicleName, bookingID)

	return e.SendEmail(toEmail, toName, subject, htmlContent)
}

// SendPaymentReceivedEmail sends a payment confirmation email
func (e *EmailClient) SendPaymentReceivedEmail(toEmail, toName string, amount float64) error {
	subject := "Payment Received - CarKid0 Rentals"
	htmlContent := fmt.Sprintf(`
		<html>
		<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
			<div style="max-width: 600px; margin: 0 auto; padding: 20px;">
				<h1 style="color: #10b981;">Payment Received ✅</h1>
				<p>Hi %s,</p>
				<p>We have successfully received your payment of <strong>$%.2f</strong>.</p>
				<p>Your booking is now fully confirmed and you're all set!</p>
				<p>Thank you for choosing CarKid0 Rentals.</p>
				<p>Best regards,<br>CarKid0 Rentals Team</p>
			</div>
		</body>
		</html>
	`, toName, amount)

	return e.SendEmail(toEmail, toName, subject, htmlContent)
}
