package support

import (
	"strconv"

	"github.com/gofiber/fiber/v3"
)

// Handler handles support HTTP requests
type Handler struct {
	service *Service
}

// NewHandler creates a new support handler
func NewHandler(service *Service) *Handler {
	return &Handler{service: service}
}

// RegisterRoutes registers support routes
func (h *Handler) RegisterRoutes(app *fiber.App) {
	support := app.Group("/api/v1/support")

	// Tickets
	support.Post("/tickets", h.CreateTicket)
	support.Get("/tickets", h.GetTickets)
	support.Get("/tickets/:id", h.GetTicket)
	support.Post("/tickets/:id/messages", h.AddTicketMessage)
	support.Patch("/tickets/:id/status", h.UpdateTicketStatus)

	// Knowledge Base
	support.Get("/knowledge-base/search", h.SearchKnowledgeBase)
	support.Get("/knowledge-base/:slug", h.GetKnowledgeBaseArticle)
	support.Post("/knowledge-base/:id/helpful", h.MarkArticleHelpful)

	// FAQs
	support.Get("/faqs", h.GetFAQs)
	support.Get("/faqs/search", h.SearchFAQs)

	// Live Chat
	support.Post("/chat/start", h.StartLiveChat)
	support.Post("/chat/:sessionId/messages", h.SendChatMessage)
	support.Get("/chat/:sessionId/messages", h.GetChatMessages)
	support.Post("/chat/:sessionId/end", h.EndChatSession)
	support.Post("/chat/:sessionId/rate", h.RateChatSession)
}

// CreateTicket creates a new support ticket
// POST /api/v1/support/tickets
func (h *Handler) CreateTicket(c fiber.Ctx) error {
	userID := c.Locals("userID").(uint)

	var req CreateTicketRequest
	if err := c.Bind().JSON(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	ticket, err := h.service.CreateTicket(c.Context(), userID, req)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to create ticket",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "Ticket created successfully",
		"ticket":  ticket,
	})
}

// GetTickets retrieves tickets for the authenticated user
// GET /api/v1/support/tickets?status=open&limit=20&offset=0
func (h *Handler) GetTickets(c fiber.Ctx) error {
	userID := c.Locals("userID").(uint)

	limit := c.QueryInt("limit", 20)
	offset := c.QueryInt("offset", 0)
	statusStr := c.Query("status")

	var status *TicketStatus
	if statusStr != "" {
		s := TicketStatus(statusStr)
		status = &s
	}

	tickets, total, err := h.service.GetTickets(c.Context(), userID, status, limit, offset)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to get tickets",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"tickets": tickets,
		"total":   total,
		"limit":   limit,
		"offset":  offset,
	})
}

// GetTicket retrieves a single ticket with messages
// GET /api/v1/support/tickets/:id
func (h *Handler) GetTicket(c fiber.Ctx) error {
	userID := c.Locals("userID").(uint)

	ticketID, err := strconv.ParseUint(c.Params("id"), 10, 32)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid ticket ID",
		})
	}

	ticket, messages, err := h.service.GetTicket(c.Context(), userID, uint(ticketID))
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Ticket not found",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"ticket":   ticket,
		"messages": messages,
	})
}

// AddTicketMessage adds a message to a ticket
// POST /api/v1/support/tickets/:id/messages
func (h *Handler) AddTicketMessage(c fiber.Ctx) error {
	userID := c.Locals("userID").(uint)

	ticketID, err := strconv.ParseUint(c.Params("id"), 10, 32)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid ticket ID",
		})
	}

	var req AddTicketMessageRequest
	if err := c.Bind().JSON(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	message, err := h.service.AddTicketMessage(c.Context(), userID, uint(ticketID), req)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to add message",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": message,
	})
}

// UpdateTicketStatus updates the status of a ticket
// PATCH /api/v1/support/tickets/:id/status
func (h *Handler) UpdateTicketStatus(c fiber.Ctx) error {
	userID := c.Locals("userID").(uint)

	ticketID, err := strconv.ParseUint(c.Params("id"), 10, 32)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid ticket ID",
		})
	}

	var req UpdateTicketStatusRequest
	if err := c.Bind().JSON(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	if err := h.service.UpdateTicketStatus(c.Context(), userID, uint(ticketID), req.Status); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to update ticket status",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Ticket status updated successfully",
	})
}

// SearchKnowledgeBase searches the knowledge base
// GET /api/v1/support/knowledge-base/search?query=booking&category=&limit=10
func (h *Handler) SearchKnowledgeBase(c fiber.Ctx) error {
	query := c.Query("query")
	category := c.Query("category")
	limit := c.QueryInt("limit", 10)

	articles, total, err := h.service.SearchKnowledgeBase(c.Context(), query, category, limit)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to search knowledge base",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"articles": articles,
		"total":    total,
	})
}

// GetKnowledgeBaseArticle retrieves a single article
// GET /api/v1/support/knowledge-base/:slug
func (h *Handler) GetKnowledgeBaseArticle(c fiber.Ctx) error {
	slug := c.Params("slug")

	article, err := h.service.GetKnowledgeBaseArticle(c.Context(), slug)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Article not found",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"article": article,
	})
}

// MarkArticleHelpful marks an article as helpful
// POST /api/v1/support/knowledge-base/:id/helpful
func (h *Handler) MarkArticleHelpful(c fiber.Ctx) error {
	articleID, err := strconv.ParseUint(c.Params("id"), 10, 32)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid article ID",
		})
	}

	if err := h.service.MarkArticleHelpful(c.Context(), uint(articleID)); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to mark article as helpful",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Thank you for your feedback",
	})
}

// GetFAQs retrieves FAQs
// GET /api/v1/support/faqs?category=booking
func (h *Handler) GetFAQs(c fiber.Ctx) error {
	category := c.Query("category")

	faqs, err := h.service.GetFAQs(c.Context(), category)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to get FAQs",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"faqs": faqs,
	})
}

// SearchFAQs searches FAQs
// GET /api/v1/support/faqs/search?query=payment
func (h *Handler) SearchFAQs(c fiber.Ctx) error {
	query := c.Query("query")

	if query == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Query parameter is required",
		})
	}

	faqs, err := h.service.SearchFAQs(c.Context(), query)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to search FAQs",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"faqs": faqs,
	})
}

// StartLiveChat starts a new live chat session
// POST /api/v1/support/chat/start
func (h *Handler) StartLiveChat(c fiber.Ctx) error {
	userID := c.Locals("userID").(uint)

	var req StartLiveChatRequest
	c.Bind().JSON(&req)

	session, err := h.service.StartLiveChat(c.Context(), userID, req.InitialMessage)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to start chat session",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "Chat session started",
		"session": session,
	})
}

// SendChatMessage sends a message in a live chat
// POST /api/v1/support/chat/:sessionId/messages
func (h *Handler) SendChatMessage(c fiber.Ctx) error {
	userID := c.Locals("userID").(uint)

	sessionID, err := strconv.ParseUint(c.Params("sessionId"), 10, 32)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid session ID",
		})
	}

	var req SendChatMessageRequest
	if err := c.Bind().JSON(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	message, err := h.service.SendChatMessage(c.Context(), userID, uint(sessionID), req.Message)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to send message",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": message,
	})
}

// GetChatMessages retrieves messages for a chat session
// GET /api/v1/support/chat/:sessionId/messages
func (h *Handler) GetChatMessages(c fiber.Ctx) error {
	userID := c.Locals("userID").(uint)

	sessionID, err := strconv.ParseUint(c.Params("sessionId"), 10, 32)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid session ID",
		})
	}

	messages, err := h.service.GetChatMessages(c.Context(), userID, uint(sessionID))
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Session not found",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"messages": messages,
	})
}

// EndChatSession ends a live chat session
// POST /api/v1/support/chat/:sessionId/end
func (h *Handler) EndChatSession(c fiber.Ctx) error {
	userID := c.Locals("userID").(uint)

	sessionID, err := strconv.ParseUint(c.Params("sessionId"), 10, 32)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid session ID",
		})
	}

	if err := h.service.EndChatSession(c.Context(), userID, uint(sessionID)); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to end chat session",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Chat session ended",
	})
}

// RateChatSession rates a chat session
// POST /api/v1/support/chat/:sessionId/rate
func (h *Handler) RateChatSession(c fiber.Ctx) error {
	userID := c.Locals("userID").(uint)

	sessionID, err := strconv.ParseUint(c.Params("sessionId"), 10, 32)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid session ID",
		})
	}

	var req RateChatSessionRequest
	if err := c.Bind().JSON(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	if err := h.service.RateChatSession(c.Context(), userID, uint(sessionID), req.Rating, req.Feedback); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to rate chat session",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Thank you for your feedback",
	})
}
