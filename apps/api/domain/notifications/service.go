package notifications

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"time"

	"gorm.io/gorm"
)

// Service handles notification business logic
type Service struct {
	db         *gorm.DB
	fcmClient  *FCMClient
	emailClient *EmailClient
	smsClient   *SMSClient
}

// NewService creates a new notification service
func NewService(db *gorm.DB) *Service {
	fcmClient, err := NewFCMClient()
	if err != nil {
		log.Printf("Warning: Failed to initialize FCM client: %v", err)
	}

	return &Service{
		db:          db,
		fcmClient:   fcmClient,
		emailClient: NewEmailClient(),
		smsClient:   NewSMSClient(),
	}
}

// CreateNotification creates a new notification and sends it through all enabled channels
func (s *Service) CreateNotification(ctx context.Context, req CreateNotificationRequest) (*Notification, error) {
	// Create notification record
	notification := &Notification{
		UserID: req.UserID,
		Type:   req.Type,
		Title:  req.Title,
		Body:   req.Body,
		Data:   req.Data,
		Read:   false,
	}

	if err := s.db.Create(notification).Error; err != nil {
		return nil, fmt.Errorf("failed to create notification: %w", err)
	}

	// Get user preferences
	prefs, err := s.GetPreferences(ctx, req.UserID)
	if err != nil {
		log.Printf("Failed to get preferences for user %d: %v", req.UserID, err)
		// Continue anyway with default preferences
		prefs = &NotificationPreference{
			UserID: req.UserID,
			Push:   true,
			Email:  true,
			SMS:    false,
			InApp:  true,
		}
	}

	// Send through enabled channels
	go s.sendThroughChannels(notification, prefs)

	return notification, nil
}

// sendThroughChannels sends notification through all enabled channels
func (s *Service) sendThroughChannels(notification *Notification, prefs *NotificationPreference) {
	// Push notification
	if prefs.Push {
		if err := s.sendPushNotification(notification); err != nil {
			log.Printf("Failed to send push notification: %v", err)
		}
	}

	// Email notification
	if prefs.Email {
		if err := s.sendEmailNotification(notification); err != nil {
			log.Printf("Failed to send email notification: %v", err)
		}
	}

	// SMS notification
	if prefs.SMS {
		if err := s.sendSMSNotification(notification); err != nil {
			log.Printf("Failed to send SMS notification: %v", err)
		}
	}
}

// sendPushNotification sends push notification via FCM
func (s *Service) sendPushNotification(notification *Notification) error {
	// Get all active device tokens for the user
	var tokens []DeviceToken
	if err := s.db.Where("user_id = ? AND active = ?", notification.UserID, true).Find(&tokens).Error; err != nil {
		return fmt.Errorf("failed to get device tokens: %w", err)
	}

	if len(tokens) == 0 {
		return nil // No tokens to send to
	}

	// Send via FCM
	if s.fcmClient != nil {
		data := map[string]string{
			"notification_id": fmt.Sprintf("%d", notification.ID),
			"type":            notification.Type,
		}
		if notification.Data != "" {
			data["data"] = notification.Data
		}

		tokenStrings := make([]string, len(tokens))
		for i, t := range tokens {
			tokenStrings[i] = t.Token
		}

		if err := s.fcmClient.SendMulticast(context.Background(), tokenStrings, notification.Title, notification.Body, data); err != nil {
			log.Printf("Failed to send FCM notification: %v", err)
		}
	}

	return nil
}

// sendEmailNotification sends email notification via SendGrid
func (s *Service) sendEmailNotification(notification *Notification) error {
	// Get user email
	// TODO: Fetch user email from database
	// For now, log the notification
	log.Printf("Email notification to user %d: %s - %s", notification.UserID, notification.Title, notification.Body)

	// Send via SendGrid
	if s.emailClient != nil {
		// TODO: Get user email and name from database
		// s.emailClient.SendEmail(userEmail, userName, notification.Title, notification.Body)
	}

	return nil
}

// sendSMSNotification sends SMS notification via Twilio
func (s *Service) sendSMSNotification(notification *Notification) error {
	// Get user phone
	// TODO: Fetch user phone from database
	// For now, log the notification
	log.Printf("SMS notification to user %d: %s", notification.UserID, notification.Body)

	// Send via Twilio
	if s.smsClient != nil {
		// TODO: Get user phone from database
		// s.smsClient.SendSMS(userPhone, notification.Body)
	}

	return nil
}

// GetNotifications retrieves notifications for a user
func (s *Service) GetNotifications(ctx context.Context, userID uint, limit, offset int) ([]Notification, int64, error) {
	var notifications []Notification
	var total int64

	// Get total count
	if err := s.db.Model(&Notification{}).Where("user_id = ?", userID).Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count notifications: %w", err)
	}

	// Get paginated notifications
	if err := s.db.Where("user_id = ?", userID).
		Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&notifications).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to get notifications: %w", err)
	}

	return notifications, total, nil
}

// MarkAsRead marks a notification as read
func (s *Service) MarkAsRead(ctx context.Context, userID, notificationID uint) error {
	now := time.Now()
	result := s.db.Model(&Notification{}).
		Where("id = ? AND user_id = ?", notificationID, userID).
		Updates(map[string]interface{}{
			"read":    true,
			"read_at": now,
		})

	if result.Error != nil {
		return fmt.Errorf("failed to mark notification as read: %w", result.Error)
	}

	if result.RowsAffected == 0 {
		return fmt.Errorf("notification not found")
	}

	return nil
}

// MarkAllAsRead marks all notifications as read for a user
func (s *Service) MarkAllAsRead(ctx context.Context, userID uint) error {
	now := time.Now()
	if err := s.db.Model(&Notification{}).
		Where("user_id = ? AND read = ?", userID, false).
		Updates(map[string]interface{}{
			"read":    true,
			"read_at": now,
		}).Error; err != nil {
		return fmt.Errorf("failed to mark all notifications as read: %w", err)
	}

	return nil
}

// GetUnreadCount gets the count of unread notifications for a user
func (s *Service) GetUnreadCount(ctx context.Context, userID uint) (int64, error) {
	var count int64
	if err := s.db.Model(&Notification{}).
		Where("user_id = ? AND read = ?", userID, false).
		Count(&count).Error; err != nil {
		return 0, fmt.Errorf("failed to count unread notifications: %w", err)
	}

	return count, nil
}

// RegisterDevice registers a device token for push notifications
func (s *Service) RegisterDevice(ctx context.Context, userID uint, req RegisterDeviceRequest) error {
	// Check if token already exists
	var existing DeviceToken
	err := s.db.Where("token = ?", req.Token).First(&existing).Error

	if err == nil {
		// Token exists, update user_id and activate
		existing.UserID = userID
		existing.Active = true
		existing.Platform = req.Platform
		return s.db.Save(&existing).Error
	}

	if err != gorm.ErrRecordNotFound {
		return fmt.Errorf("failed to check existing token: %w", err)
	}

	// Create new token
	token := &DeviceToken{
		UserID:   userID,
		Token:    req.Token,
		Platform: req.Platform,
		Active:   true,
	}

	if err := s.db.Create(token).Error; err != nil {
		return fmt.Errorf("failed to register device: %w", err)
	}

	return nil
}

// GetPreferences gets notification preferences for a user
func (s *Service) GetPreferences(ctx context.Context, userID uint) (*NotificationPreference, error) {
	var prefs NotificationPreference
	err := s.db.Where("user_id = ?", userID).First(&prefs).Error

	if err == gorm.ErrRecordNotFound {
		// Create default preferences
		prefs = NotificationPreference{
			UserID: userID,
			Push:   true,
			Email:  true,
			SMS:    false,
			InApp:  true,
		}
		if err := s.db.Create(&prefs).Error; err != nil {
			return nil, fmt.Errorf("failed to create default preferences: %w", err)
		}
		return &prefs, nil
	}

	if err != nil {
		return nil, fmt.Errorf("failed to get preferences: %w", err)
	}

	return &prefs, nil
}

// UpdatePreferences updates notification preferences for a user
func (s *Service) UpdatePreferences(ctx context.Context, userID uint, req UpdatePreferencesRequest) (*NotificationPreference, error) {
	prefs, err := s.GetPreferences(ctx, userID)
	if err != nil {
		return nil, err
	}

	// Update only provided fields
	updates := make(map[string]interface{})
	if req.Push != nil {
		updates["push"] = *req.Push
	}
	if req.Email != nil {
		updates["email"] = *req.Email
	}
	if req.SMS != nil {
		updates["sms"] = *req.SMS
	}
	if req.InApp != nil {
		updates["in_app"] = *req.InApp
	}

	if len(updates) > 0 {
		if err := s.db.Model(prefs).Updates(updates).Error; err != nil {
			return nil, fmt.Errorf("failed to update preferences: %w", err)
		}
	}

	return prefs, nil
}

// SendBookingConfirmed sends a booking confirmed notification
func (s *Service) SendBookingConfirmed(ctx context.Context, userID uint, bookingID uint, vehicleName string) error {
	data, _ := json.Marshal(map[string]interface{}{
		"booking_id": bookingID,
		"type":       "booking",
	})

	req := CreateNotificationRequest{
		UserID: userID,
		Type:   NotificationTypeBookingConfirmed,
		Title:  "Booking Confirmed! 🎉",
		Body:   fmt.Sprintf("Your booking for %s has been confirmed.", vehicleName),
		Data:   string(data),
	}

	_, err := s.CreateNotification(ctx, req)
	return err
}

// SendPaymentReceived sends a payment received notification
func (s *Service) SendPaymentReceived(ctx context.Context, userID uint, amount float64) error {
	data, _ := json.Marshal(map[string]interface{}{
		"amount": amount,
		"type":   "payment",
	})

	req := CreateNotificationRequest{
		UserID: userID,
		Type:   NotificationTypePaymentReceived,
		Title:  "Payment Received ✅",
		Body:   fmt.Sprintf("Payment of $%.2f has been received.", amount),
		Data:   string(data),
	}

	_, err := s.CreateNotification(ctx, req)
	return err
}

// SendSafeHaltViolation sends a Safe-Halt violation notification
func (s *Service) SendSafeHaltViolation(ctx context.Context, userID uint, violationType string) error {
	data, _ := json.Marshal(map[string]interface{}{
		"violation_type": violationType,
		"type":           "safehalt",
	})

	req := CreateNotificationRequest{
		UserID: userID,
		Type:   NotificationTypeSafeHaltViolation,
		Title:  "⚠️ Safe-Halt Violation",
		Body:   fmt.Sprintf("Safe-Halt violation detected: %s", violationType),
		Data:   string(data),
	}

	_, err := s.CreateNotification(ctx, req)
	return err
}
