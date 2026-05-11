package messages

import (
	"time"

	"github.com/carkid0/rentals/api/config"
	"github.com/carkid0/rentals/api/middleware"
	"github.com/gofiber/fiber/v3"
)

func SetupRoutes(router fiber.Router) {
	messages := router.Group("/messages", middleware.Protected())
	messages.Get("/", GetConversations)
	messages.Post("/", SendMessage)
}

func GetConversations(c fiber.Ctx) error {
	userID := c.Locals("userID").(string)

	if config.DB == nil {
		return c.JSON([]Conversation{})
	}

	var conversations []Conversation
	config.DB.Where("user_id = ? OR lister_id = ?", userID, userID).
		Order("updated_at DESC").
		Find(&conversations)

	return c.JSON(conversations)
}

func SendMessage(c fiber.Ctx) error {
	userID := c.Locals("userID").(string)

	var req struct {
		ConversationID string `json:"conversationId"`
		Message        string `json:"message"`
	}

	if err := c.Bind().JSON(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request"})
	}

	if config.DB == nil {
		return c.Status(503).JSON(fiber.Map{"error": "Database unavailable"})
	}

	message := Message{
		ConversationID: req.ConversationID,
		SenderID:       userID,
		Content:        req.Message,
	}

	config.DB.Create(&message)

	// Update conversation timestamp
	config.DB.Model(&Conversation{}).
		Where("id = ?", req.ConversationID).
		Update("updated_at", time.Now())

	return c.JSON(message)
}
