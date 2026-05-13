package notifications

import (
	"context"
	"fmt"
	"log"
	"os"

	firebase "firebase.google.com/go/v4"
	"firebase.google.com/go/v4/messaging"
	"google.golang.org/api/option"
)

// FCMClient handles Firebase Cloud Messaging
type FCMClient struct {
	client *messaging.Client
}

// NewFCMClient creates a new FCM client
func NewFCMClient() (*FCMClient, error) {
	// Check if Firebase credentials are configured
	credentialsPath := os.Getenv("FIREBASE_CREDENTIALS_PATH")
	if credentialsPath == "" {
		log.Println("Warning: FIREBASE_CREDENTIALS_PATH not set, FCM disabled")
		return &FCMClient{}, nil
	}

	opt := option.WithCredentialsFile(credentialsPath)
	app, err := firebase.NewApp(context.Background(), nil, opt)
	if err != nil {
		return nil, fmt.Errorf("error initializing firebase app: %w", err)
	}

	client, err := app.Messaging(context.Background())
	if err != nil {
		return nil, fmt.Errorf("error getting messaging client: %w", err)
	}

	return &FCMClient{client: client}, nil
}

// SendNotification sends a push notification via FCM
func (f *FCMClient) SendNotification(ctx context.Context, token, title, body string, data map[string]string) error {
	if f.client == nil {
		log.Println("FCM client not initialized, skipping push notification")
		return nil
	}

	message := &messaging.Message{
		Token: token,
		Notification: &messaging.Notification{
			Title: title,
			Body:  body,
		},
		Data: data,
		Android: &messaging.AndroidConfig{
			Priority: "high",
			Notification: &messaging.AndroidNotification{
				Sound: "default",
			},
		},
		APNS: &messaging.APNSConfig{
			Payload: &messaging.APNSPayload{
				Aps: &messaging.Aps{
					Sound: "default",
				},
			},
		},
	}

	response, err := f.client.Send(ctx, message)
	if err != nil {
		return fmt.Errorf("error sending FCM message: %w", err)
	}

	log.Printf("Successfully sent FCM message: %s", response)
	return nil
}

// SendMulticast sends a notification to multiple devices
func (f *FCMClient) SendMulticast(ctx context.Context, tokens []string, title, body string, data map[string]string) error {
	if f.client == nil {
		log.Println("FCM client not initialized, skipping push notification")
		return nil
	}

	message := &messaging.MulticastMessage{
		Tokens: tokens,
		Notification: &messaging.Notification{
			Title: title,
			Body:  body,
		},
		Data: data,
	}

	response, err := f.client.SendMulticast(ctx, message)
	if err != nil {
		return fmt.Errorf("error sending multicast message: %w", err)
	}

	log.Printf("Successfully sent %d messages, %d failures", response.SuccessCount, response.FailureCount)
	return nil
}
