package notifications

import (
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"gorm.io/gorm"
)

// Mock database
type MockDB struct {
	mock.Mock
}

func (m *MockDB) Create(value interface{}) *gorm.DB {
	args := m.Called(value)
	return args.Get(0).(*gorm.DB)
}

func (m *MockDB) Find(dest interface{}, conds ...interface{}) *gorm.DB {
	args := m.Called(dest, conds)
	return args.Get(0).(*gorm.DB)
}

// Mock notification clients
type MockFCMClient struct {
	mock.Mock
}

func (m *MockFCMClient) Send(token string, title string, body string) error {
	args := m.Called(token, title, body)
	return args.Error(0)
}

type MockEmailClient struct {
	mock.Mock
}

func (m *MockEmailClient) Send(to string, subject string, body string) error {
	args := m.Called(to, subject, body)
	return args.Error(0)
}

type MockSMSClient struct {
	mock.Mock
}

func (m *MockSMSClient) Send(phone string, message string) error {
	args := m.Called(phone, message)
	return args.Error(0)
}

// Test: Create Notification
func TestCreateNotification(t *testing.T) {
	mockDB := new(MockDB)
	service := &NotificationService{DB: mockDB}

	notification := &Notification{
		UserID:  "user-123",
		Type:    "booking_confirmed",
		Title:   "Booking Confirmed",
		Message: "Your booking has been confirmed",
		Channel: "push",
	}

	mockDB.On("Create", notification).Return(&gorm.DB{Error: nil})

	err := service.CreateNotification(notification)

	assert.NoError(t, err)
	mockDB.AssertExpectations(t)
}

// Test: Send Push Notification
func TestSendPushNotification(t *testing.T) {
	mockFCM := new(MockFCMClient)
	service := &NotificationService{FCMClient: mockFCM}

	token := "device-token-123"
	title := "Test Notification"
	body := "This is a test"

	mockFCM.On("Send", token, title, body).Return(nil)

	err := service.SendPushNotification(token, title, body)

	assert.NoError(t, err)
	mockFCM.AssertExpectations(t)
}

// Test: Send Email Notification
func TestSendEmailNotification(t *testing.T) {
	mockEmail := new(MockEmailClient)
	service := &NotificationService{EmailClient: mockEmail}

	to := "user@example.com"
	subject := "Test Email"
	body := "This is a test email"

	mockEmail.On("Send", to, subject, body).Return(nil)

	err := service.SendEmailNotification(to, subject, body)

	assert.NoError(t, err)
	mockEmail.AssertExpectations(t)
}

// Test: Send SMS Notification
func TestSendSMSNotification(t *testing.T) {
	mockSMS := new(MockSMSClient)
	service := &NotificationService{SMSClient: mockSMS}

	phone := "+1234567890"
	message := "This is a test SMS"

	mockSMS.On("Send", phone, message).Return(nil)

	err := service.SendSMSNotification(phone, message)

	assert.NoError(t, err)
	mockSMS.AssertExpectations(t)
}

// Test: Multi-Channel Delivery
func TestMultiChannelDelivery(t *testing.T) {
	mockFCM := new(MockFCMClient)
	mockEmail := new(MockEmailClient)
	mockSMS := new(MockSMSClient)
	mockDB := new(MockDB)

	service := &NotificationService{
		FCMClient:   mockFCM,
		EmailClient: mockEmail,
		SMSClient:   mockSMS,
		DB:          mockDB,
	}

	notification := &Notification{
		UserID:  "user-123",
		Type:    "booking_confirmed",
		Title:   "Booking Confirmed",
		Message: "Your booking has been confirmed",
	}

	preferences := &NotificationPreferences{
		UserID:    "user-123",
		PushEnabled:  true,
		EmailEnabled: true,
		SMSEnabled:   true,
	}

	mockFCM.On("Send", mock.Anything, notification.Title, notification.Message).Return(nil)
	mockEmail.On("Send", mock.Anything, notification.Title, notification.Message).Return(nil)
	mockSMS.On("Send", mock.Anything, notification.Message).Return(nil)
	mockDB.On("Create", mock.Anything).Return(&gorm.DB{Error: nil}).Times(3)

	err := service.SendMultiChannel(notification, preferences)

	assert.NoError(t, err)
	mockFCM.AssertExpectations(t)
	mockEmail.AssertExpectations(t)
	mockSMS.AssertExpectations(t)
}

// Test: Get User Notifications
func TestGetUserNotifications(t *testing.T) {
	mockDB := new(MockDB)
	service := &NotificationService{DB: mockDB}

	userID := "user-123"
	notifications := []Notification{
		{ID: "notif-1", UserID: userID, Title: "Test 1"},
		{ID: "notif-2", UserID: userID, Title: "Test 2"},
	}

	mockDB.On("Find", mock.Anything, mock.Anything).Return(&gorm.DB{Error: nil})

	result, err := service.GetUserNotifications(userID, 1, 10)

	assert.NoError(t, err)
	assert.NotNil(t, result)
	mockDB.AssertExpectations(t)
}

// Test: Mark Notification as Read
func TestMarkAsRead(t *testing.T) {
	mockDB := new(MockDB)
	service := &NotificationService{DB: mockDB}

	notificationID := "notif-123"

	mockDB.On("Update", mock.Anything).Return(&gorm.DB{Error: nil})

	err := service.MarkAsRead(notificationID)

	assert.NoError(t, err)
	mockDB.AssertExpectations(t)
}

// Test: Mark All as Read
func TestMarkAllAsRead(t *testing.T) {
	mockDB := new(MockDB)
	service := &NotificationService{DB: mockDB}

	userID := "user-123"

	mockDB.On("Update", mock.Anything).Return(&gorm.DB{Error: nil})

	err := service.MarkAllAsRead(userID)

	assert.NoError(t, err)
	mockDB.AssertExpectations(t)
}

// Test: Get Unread Count
func TestGetUnreadCount(t *testing.T) {
	mockDB := new(MockDB)
	service := &NotificationService{DB: mockDB}

	userID := "user-123"
	expectedCount := int64(5)

	mockDB.On("Count", mock.Anything).Return(&gorm.DB{Error: nil})

	count, err := service.GetUnreadCount(userID)

	assert.NoError(t, err)
	assert.Equal(t, expectedCount, count)
	mockDB.AssertExpectations(t)
}

// Test: Update Notification Preferences
func TestUpdatePreferences(t *testing.T) {
	mockDB := new(MockDB)
	service := &NotificationService{DB: mockDB}

	preferences := &NotificationPreferences{
		UserID:       "user-123",
		PushEnabled:  true,
		EmailEnabled: false,
		SMSEnabled:   true,
		InAppEnabled: true,
	}

	mockDB.On("Save", preferences).Return(&gorm.DB{Error: nil})

	err := service.UpdatePreferences(preferences)

	assert.NoError(t, err)
	mockDB.AssertExpectations(t)
}

// Test: Get Notification Preferences
func TestGetPreferences(t *testing.T) {
	mockDB := new(MockDB)
	service := &NotificationService{DB: mockDB}

	userID := "user-123"
	expectedPrefs := &NotificationPreferences{
		UserID:       userID,
		PushEnabled:  true,
		EmailEnabled: true,
		SMSEnabled:   false,
		InAppEnabled: true,
	}

	mockDB.On("Find", mock.Anything, mock.Anything).Return(&gorm.DB{Error: nil})

	prefs, err := service.GetPreferences(userID)

	assert.NoError(t, err)
	assert.NotNil(t, prefs)
	mockDB.AssertExpectations(t)
}

// Test: Register Device Token
func TestRegisterDeviceToken(t *testing.T) {
	mockDB := new(MockDB)
	service := &NotificationService{DB: mockDB}

	deviceToken := &DeviceToken{
		UserID:   "user-123",
		Token:    "fcm-token-123",
		Platform: "android",
	}

	mockDB.On("Create", deviceToken).Return(&gorm.DB{Error: nil})

	err := service.RegisterDeviceToken(deviceToken)

	assert.NoError(t, err)
	mockDB.AssertExpectations(t)
}

// Test: Delete Device Token
func TestDeleteDeviceToken(t *testing.T) {
	mockDB := new(MockDB)
	service := &NotificationService{DB: mockDB}

	token := "fcm-token-123"

	mockDB.On("Delete", mock.Anything).Return(&gorm.DB{Error: nil})

	err := service.DeleteDeviceToken(token)

	assert.NoError(t, err)
	mockDB.AssertExpectations(t)
}

// Test: Notification Type Validation
func TestNotificationTypeValidation(t *testing.T) {
	validTypes := []string{
		"booking_confirmed",
		"booking_cancelled",
		"payment_success",
		"payment_failed",
		"refund_processed",
		"ticket_created",
		"ticket_reply",
		"loyalty_reward",
		"system_alert",
	}

	for _, notifType := range validTypes {
		assert.True(t, IsValidNotificationType(notifType))
	}

	assert.False(t, IsValidNotificationType("invalid_type"))
}

// Test: Notification Channel Validation
func TestNotificationChannelValidation(t *testing.T) {
	validChannels := []string{"push", "email", "sms", "in_app"}

	for _, channel := range validChannels {
		assert.True(t, IsValidChannel(channel))
	}

	assert.False(t, IsValidChannel("invalid_channel"))
}

// Helper functions
func IsValidNotificationType(notifType string) bool {
	validTypes := map[string]bool{
		"booking_confirmed": true,
		"booking_cancelled": true,
		"payment_success":   true,
		"payment_failed":    true,
		"refund_processed":  true,
		"ticket_created":    true,
		"ticket_reply":      true,
		"loyalty_reward":    true,
		"system_alert":      true,
	}
	return validTypes[notifType]
}

func IsValidChannel(channel string) bool {
	validChannels := map[string]bool{
		"push":   true,
		"email":  true,
		"sms":    true,
		"in_app": true,
	}
	return validChannels[channel]
}
