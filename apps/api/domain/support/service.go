package support

import (
	"context"
	"fmt"
	"strings"
	"time"

	"gorm.io/gorm"
)

// Service handles support business logic
type Service struct {
	db *gorm.DB
}

// NewService creates a new support service
func NewService(db *gorm.DB) *Service {
	return &Service{db: db}
}

// CreateTicket creates a new support ticket
func (s *Service) CreateTicket(ctx context.Context, userID uint, req CreateTicketRequest) (*Ticket, error) {
	priority := PriorityMedium
	if req.Priority != nil {
		priority = *req.Priority
	}

	ticket := &Ticket{
		UserID:      userID,
		Category:    req.Category,
		Priority:    priority,
		Status:      TicketStatusOpen,
		Subject:     req.Subject,
		Description: req.Description,
	}

	if err := s.db.Create(ticket).Error; err != nil {
		return nil, fmt.Errorf("failed to create ticket: %w", err)
	}

	// Create initial message
	message := &TicketMessage{
		TicketID:   ticket.ID,
		SenderID:   userID,
		SenderType: "user",
		Message:    req.Description,
	}
	s.db.Create(message)

	return ticket, nil
}

// GetTickets retrieves tickets for a user
func (s *Service) GetTickets(ctx context.Context, userID uint, status *TicketStatus, limit, offset int) ([]Ticket, int64, error) {
	var tickets []Ticket
	var total int64

	query := s.db.Model(&Ticket{}).Where("user_id = ?", userID)
	
	if status != nil {
		query = query.Where("status = ?", *status)
	}

	// Get total count
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count tickets: %w", err)
	}

	// Get paginated tickets
	if err := query.Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&tickets).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to get tickets: %w", err)
	}

	return tickets, total, nil
}

// GetTicket retrieves a single ticket with messages
func (s *Service) GetTicket(ctx context.Context, userID, ticketID uint) (*Ticket, []TicketMessage, error) {
	var ticket Ticket
	if err := s.db.First(&ticket, "id = ? AND user_id = ?", ticketID, userID).Error; err != nil {
		return nil, nil, fmt.Errorf("ticket not found: %w", err)
	}

	var messages []TicketMessage
	if err := s.db.Where("ticket_id = ?", ticketID).
		Order("created_at ASC").
		Find(&messages).Error; err != nil {
		return nil, nil, fmt.Errorf("failed to get messages: %w", err)
	}

	return &ticket, messages, nil
}

// AddTicketMessage adds a message to a ticket
func (s *Service) AddTicketMessage(ctx context.Context, userID, ticketID uint, req AddTicketMessageRequest) (*TicketMessage, error) {
	// Verify ticket ownership
	var ticket Ticket
	if err := s.db.First(&ticket, "id = ? AND user_id = ?", ticketID, userID).Error; err != nil {
		return nil, fmt.Errorf("ticket not found: %w", err)
	}

	message := &TicketMessage{
		TicketID:   ticketID,
		SenderID:   userID,
		SenderType: "user",
		Message:    req.Message,
	}

	if len(req.Attachments) > 0 {
		// Store attachments as JSON
		// message.Attachments = json.Marshal(req.Attachments)
	}

	if err := s.db.Create(message).Error; err != nil {
		return nil, fmt.Errorf("failed to add message: %w", err)
	}

	// Update ticket status if closed
	if ticket.Status == TicketStatusClosed || ticket.Status == TicketStatusResolved {
		s.db.Model(&ticket).Update("status", TicketStatusOpen)
	}

	return message, nil
}

// UpdateTicketStatus updates the status of a ticket
func (s *Service) UpdateTicketStatus(ctx context.Context, userID, ticketID uint, status TicketStatus) error {
	result := s.db.Model(&Ticket{}).
		Where("id = ? AND user_id = ?", ticketID, userID).
		Update("status", status)

	if result.Error != nil {
		return fmt.Errorf("failed to update ticket status: %w", result.Error)
	}

	if result.RowsAffected == 0 {
		return fmt.Errorf("ticket not found")
	}

	// Set resolved/closed timestamps
	now := time.Now()
	if status == TicketStatusResolved {
		s.db.Model(&Ticket{}).Where("id = ?", ticketID).Update("resolved_at", now)
	} else if status == TicketStatusClosed {
		s.db.Model(&Ticket{}).Where("id = ?", ticketID).Update("closed_at", now)
	}

	return nil
}

// SearchKnowledgeBase searches the knowledge base
func (s *Service) SearchKnowledgeBase(ctx context.Context, query, category string, limit int) ([]KnowledgeBaseArticle, int64, error) {
	var articles []KnowledgeBaseArticle
	var total int64

	if limit == 0 {
		limit = 10
	}

	dbQuery := s.db.Model(&KnowledgeBaseArticle{}).Where("published = ?", true)

	// Search in title and content
	if query != "" {
		searchTerm := "%" + strings.ToLower(query) + "%"
		dbQuery = dbQuery.Where(
			"LOWER(title) LIKE ? OR LOWER(content) LIKE ? OR LOWER(summary) LIKE ?",
			searchTerm, searchTerm, searchTerm,
		)
	}

	// Filter by category
	if category != "" {
		dbQuery = dbQuery.Where("category = ?", category)
	}

	// Get total count
	if err := dbQuery.Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count articles: %w", err)
	}

	// Get articles
	if err := dbQuery.Order("view_count DESC, helpful_count DESC").
		Limit(limit).
		Find(&articles).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to search articles: %w", err)
	}

	return articles, total, nil
}

// GetKnowledgeBaseArticle retrieves a single article
func (s *Service) GetKnowledgeBaseArticle(ctx context.Context, slug string) (*KnowledgeBaseArticle, error) {
	var article KnowledgeBaseArticle
	if err := s.db.First(&article, "slug = ? AND published = ?", slug, true).Error; err != nil {
		return nil, fmt.Errorf("article not found: %w", err)
	}

	// Increment view count
	s.db.Model(&article).Update("view_count", gorm.Expr("view_count + 1"))

	return &article, nil
}

// MarkArticleHelpful marks an article as helpful
func (s *Service) MarkArticleHelpful(ctx context.Context, articleID uint) error {
	result := s.db.Model(&KnowledgeBaseArticle{}).
		Where("id = ?", articleID).
		Update("helpful_count", gorm.Expr("helpful_count + 1"))

	if result.Error != nil {
		return fmt.Errorf("failed to mark article as helpful: %w", result.Error)
	}

	return nil
}

// GetFAQs retrieves FAQs by category
func (s *Service) GetFAQs(ctx context.Context, category string) ([]FAQ, error) {
	var faqs []FAQ

	query := s.db.Where("active = ?", true)
	
	if category != "" {
		query = query.Where("category = ?", category)
	}

	if err := query.Order("order ASC, view_count DESC").Find(&faqs).Error; err != nil {
		return nil, fmt.Errorf("failed to get FAQs: %w", err)
	}

	return faqs, nil
}

// SearchFAQs searches FAQs
func (s *Service) SearchFAQs(ctx context.Context, query string) ([]FAQ, error) {
	var faqs []FAQ

	searchTerm := "%" + strings.ToLower(query) + "%"
	if err := s.db.Where("active = ? AND (LOWER(question) LIKE ? OR LOWER(answer) LIKE ?)", true, searchTerm, searchTerm).
		Order("view_count DESC").
		Limit(10).
		Find(&faqs).Error; err != nil {
		return nil, fmt.Errorf("failed to search FAQs: %w", err)
	}

	return faqs, nil
}

// StartLiveChat starts a new live chat session
func (s *Service) StartLiveChat(ctx context.Context, userID uint, initialMessage string) (*LiveChatSession, error) {
	// Check if user has an active session
	var existingSession LiveChatSession
	err := s.db.Where("user_id = ? AND status IN ?", userID, []string{"waiting", "active"}).
		First(&existingSession).Error

	if err == nil {
		// Return existing session
		return &existingSession, nil
	}

	// Create new session
	session := &LiveChatSession{
		UserID:    userID,
		Status:    "waiting",
		StartedAt: time.Now(),
	}

	if err := s.db.Create(session).Error; err != nil {
		return nil, fmt.Errorf("failed to start chat session: %w", err)
	}

	// Add initial message if provided
	if initialMessage != "" {
		message := &LiveChatMessage{
			SessionID:  session.ID,
			SenderID:   userID,
			SenderType: "user",
			Message:    initialMessage,
		}
		s.db.Create(message)
	}

	return session, nil
}

// SendChatMessage sends a message in a live chat
func (s *Service) SendChatMessage(ctx context.Context, userID, sessionID uint, message string) (*LiveChatMessage, error) {
	// Verify session ownership
	var session LiveChatSession
	if err := s.db.First(&session, "id = ? AND user_id = ?", sessionID, userID).Error; err != nil {
		return nil, fmt.Errorf("session not found: %w", err)
	}

	if session.Status == "ended" {
		return nil, fmt.Errorf("chat session has ended")
	}

	chatMessage := &LiveChatMessage{
		SessionID:  sessionID,
		SenderID:   userID,
		SenderType: "user",
		Message:    message,
	}

	if err := s.db.Create(chatMessage).Error; err != nil {
		return nil, fmt.Errorf("failed to send message: %w", err)
	}

	return chatMessage, nil
}

// GetChatMessages retrieves messages for a chat session
func (s *Service) GetChatMessages(ctx context.Context, userID, sessionID uint) ([]LiveChatMessage, error) {
	// Verify session ownership
	var session LiveChatSession
	if err := s.db.First(&session, "id = ? AND user_id = ?", sessionID, userID).Error; err != nil {
		return nil, fmt.Errorf("session not found: %w", err)
	}

	var messages []LiveChatMessage
	if err := s.db.Where("session_id = ?", sessionID).
		Order("created_at ASC").
		Find(&messages).Error; err != nil {
		return nil, fmt.Errorf("failed to get messages: %w", err)
	}

	return messages, nil
}

// EndChatSession ends a live chat session
func (s *Service) EndChatSession(ctx context.Context, userID, sessionID uint) error {
	now := time.Now()
	result := s.db.Model(&LiveChatSession{}).
		Where("id = ? AND user_id = ?", sessionID, userID).
		Updates(map[string]interface{}{
			"status":   "ended",
			"ended_at": now,
		})

	if result.Error != nil {
		return fmt.Errorf("failed to end session: %w", result.Error)
	}

	if result.RowsAffected == 0 {
		return fmt.Errorf("session not found")
	}

	return nil
}

// RateChatSession rates a chat session
func (s *Service) RateChatSession(ctx context.Context, userID, sessionID uint, rating int, feedback string) error {
	result := s.db.Model(&LiveChatSession{}).
		Where("id = ? AND user_id = ?", sessionID, userID).
		Updates(map[string]interface{}{
			"rating":   rating,
			"feedback": feedback,
		})

	if result.Error != nil {
		return fmt.Errorf("failed to rate session: %w", result.Error)
	}

	if result.RowsAffected == 0 {
		return fmt.Errorf("session not found")
	}

	return nil
}

// GetCannedResponses retrieves canned responses for a category
func (s *Service) GetCannedResponses(ctx context.Context, category TicketCategory) ([]CannedResponse, error) {
	var responses []CannedResponse

	if err := s.db.Where("category = ? AND active = ?", category, true).
		Find(&responses).Error; err != nil {
		return nil, fmt.Errorf("failed to get canned responses: %w", err)
	}

	return responses, nil
}
