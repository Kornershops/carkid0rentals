package notifications

import (
	"strconv"

	"github.com/gofiber/fiber/v3"
)

// Handler handles notification HTTP requests
type Handler struct {
	service *Service
}

// NewHandler creates a new notification handler
func NewHandler(service *Service) *Handler {
	return &Handler{service: service}
}

// RegisterRoutes registers notification routes
func (h *Handler) RegisterRoutes(app *fiber.App) {
	notifications := app.Group("/api/v1/notifications")

	// Notification endpoints
	notifications.Post("/register-device", h.RegisterDevice)
	notifications.Get("/", h.GetNotifications)
	notifications.Patch("/:id/read", h.MarkAsRead)
	notifications.Patch("/read-all", h.MarkAllAsRead)
	notifications.Get("/unread-count", h.GetUnreadCount)

	// Preferences endpoints
	notifications.Get("/preferences", h.GetPreferences)
	notifications.Patch("/preferences", h.UpdatePreferences)
}

// RegisterDevice registers a device token for push notifications
// POST /api/v1/notifications/register-device
func (h *Handler) RegisterDevice(c fiber.Ctx) error {
	// Get user ID from context (set by auth middleware)
	userID := c.Locals("userID").(uint)

	var req RegisterDeviceRequest
	if err := c.Bind().JSON(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	if err := h.service.RegisterDevice(c.Context(), userID, req); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to register device",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Device registered successfully",
	})
}

// GetNotifications retrieves notifications for the authenticated user
// GET /api/v1/notifications?limit=20&offset=0
func (h *Handler) GetNotifications(c fiber.Ctx) error {
	userID := c.Locals("userID").(uint)

	// Parse pagination parameters
	limit := c.QueryInt("limit", 20)
	offset := c.QueryInt("offset", 0)

	if limit > 100 {
		limit = 100 // Max limit
	}

	notifications, total, err := h.service.GetNotifications(c.Context(), userID, limit, offset)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to get notifications",
		})
	}

	// Convert to response format
	responses := make([]NotificationResponse, len(notifications))
	for i, n := range notifications {
		responses[i] = NotificationResponse{
			ID:        n.ID,
			Type:      n.Type,
			Title:     n.Title,
			Body:      n.Body,
			Data:      n.Data,
			Read:      n.Read,
			ReadAt:    n.ReadAt,
			CreatedAt: n.CreatedAt,
		}
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"notifications": responses,
		"total":         total,
		"limit":         limit,
		"offset":        offset,
	})
}

// MarkAsRead marks a notification as read
// PATCH /api/v1/notifications/:id/read
func (h *Handler) MarkAsRead(c fiber.Ctx) error {
	userID := c.Locals("userID").(uint)

	notificationID, err := strconv.ParseUint(c.Params("id"), 10, 32)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid notification ID",
		})
	}

	if err := h.service.MarkAsRead(c.Context(), userID, uint(notificationID)); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to mark notification as read",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Notification marked as read",
	})
}

// MarkAllAsRead marks all notifications as read
// PATCH /api/v1/notifications/read-all
func (h *Handler) MarkAllAsRead(c fiber.Ctx) error {
	userID := c.Locals("userID").(uint)

	if err := h.service.MarkAllAsRead(c.Context(), userID); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to mark all notifications as read",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "All notifications marked as read",
	})
}

// GetUnreadCount gets the count of unread notifications
// GET /api/v1/notifications/unread-count
func (h *Handler) GetUnreadCount(c fiber.Ctx) error {
	userID := c.Locals("userID").(uint)

	count, err := h.service.GetUnreadCount(c.Context(), userID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to get unread count",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"unread_count": count,
	})
}

// GetPreferences gets notification preferences for the authenticated user
// GET /api/v1/notifications/preferences
func (h *Handler) GetPreferences(c fiber.Ctx) error {
	userID := c.Locals("userID").(uint)

	prefs, err := h.service.GetPreferences(c.Context(), userID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to get preferences",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"preferences": prefs,
	})
}

// UpdatePreferences updates notification preferences
// PATCH /api/v1/notifications/preferences
func (h *Handler) UpdatePreferences(c fiber.Ctx) error {
	userID := c.Locals("userID").(uint)

	var req UpdatePreferencesRequest
	if err := c.Bind().JSON(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	prefs, err := h.service.UpdatePreferences(c.Context(), userID, req)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to update preferences",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message":     "Preferences updated successfully",
		"preferences": prefs,
	})
}
