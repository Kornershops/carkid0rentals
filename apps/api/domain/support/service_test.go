package support

import (
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

// Test: Create Support Ticket
func TestCreateSupportTicket(t *testing.T) {
	service := &SupportService{}

	ticket := &Ticket{
		UserID:      "user-123",
		Subject:     "Payment Issue",
		Category:    "payment",
		Priority:    "high",
		Description: "I was charged twice for the same booking",
		Status:      "open",
	}

	err := service.CreateTicket(ticket)

	assert.NoError(t, err)
	assert.NotEmpty(t, ticket.ID)
	assert.Equal(t, "open", ticket.Status)
}

// Test: Get User Tickets
func TestGetUserTickets(t *testing.T) {
	service := &SupportService{}

	userID := "user-123"
	page := 1
	limit := 10

	tickets, err := service.GetUserTickets(userID, page, limit)

	assert.NoError(t, err)
	assert.NotNil(t, tickets)
}

// Test: Get Ticket by ID
func TestGetTicketByID(t *testing.T) {
	service := &SupportService{}

	ticketID := "ticket-123"

	ticket, err := service.GetTicketByID(ticketID)

	assert.NoError(t, err)
	assert.NotNil(t, ticket)
	assert.Equal(t, ticketID, ticket.ID)
}

// Test: Update Ticket Status
func TestUpdateTicketStatus(t *testing.T) {
	service := &SupportService{}

	ticketID := "ticket-123"
	newStatus := "in-progress"

	err := service.UpdateTicketStatus(ticketID, newStatus)

	assert.NoError(t, err)
}

// Test: Add Message to Ticket
func TestAddMessageToTicket(t *testing.T) {
	service := &SupportService{}

	message := &TicketMessage{
		TicketID:   "ticket-123",
		SenderType: "user",
		SenderName: "John Doe",
		Content:    "I need help with this issue",
	}

	err := service.AddMessage(message)

	assert.NoError(t, err)
	assert.NotEmpty(t, message.ID)
}

// Test: Get Ticket Messages
func TestGetTicketMessages(t *testing.T) {
	service := &SupportService{}

	ticketID := "ticket-123"

	messages, err := service.GetTicketMessages(ticketID)

	assert.NoError(t, err)
	assert.NotNil(t, messages)
}

// Test: Close Ticket
func TestCloseTicket(t *testing.T) {
	service := &SupportService{}

	ticketID := "ticket-123"

	err := service.CloseTicket(ticketID)

	assert.NoError(t, err)
}

// Test: Reopen Ticket
func TestReopenTicket(t *testing.T) {
	service := &SupportService{}

	ticketID := "ticket-123"

	err := service.ReopenTicket(ticketID)

	assert.NoError(t, err)
}

// Test: Search Knowledge Base
func TestSearchKnowledgeBase(t *testing.T) {
	service := &SupportService{}

	query := "how to book"

	articles, err := service.SearchKnowledgeBase(query)

	assert.NoError(t, err)
	assert.NotNil(t, articles)
}

// Test: Get Knowledge Base Article
func TestGetKnowledgeBaseArticle(t *testing.T) {
	service := &SupportService{}

	articleID := "kb-001"

	article, err := service.GetKnowledgeBaseArticle(articleID)

	assert.NoError(t, err)
	assert.NotNil(t, article)
	assert.Equal(t, articleID, article.ID)
}

// Test: Track Article View
func TestTrackArticleView(t *testing.T) {
	service := &SupportService{}

	articleID := "kb-001"

	err := service.TrackArticleView(articleID)

	assert.NoError(t, err)
}

// Test: Vote Article Helpful
func TestVoteArticleHelpful(t *testing.T) {
	service := &SupportService{}

	articleID := "kb-001"
	helpful := true

	err := service.VoteArticle(articleID, helpful)

	assert.NoError(t, err)
}

// Test: Search FAQs
func TestSearchFAQs(t *testing.T) {
	service := &SupportService{}

	query := "payment methods"

	faqs, err := service.SearchFAQs(query)

	assert.NoError(t, err)
	assert.NotNil(t, faqs)
}

// Test: Get FAQs by Category
func TestGetFAQsByCategory(t *testing.T) {
	service := &SupportService{}

	category := "payment"

	faqs, err := service.GetFAQsByCategory(category)

	assert.NoError(t, err)
	assert.NotNil(t, faqs)
}

// Test: Get All FAQs
func TestGetAllFAQs(t *testing.T) {
	service := &SupportService{}

	faqs, err := service.GetAllFAQs()

	assert.NoError(t, err)
	assert.NotNil(t, faqs)
	assert.Greater(t, len(faqs), 0)
}

// Test: Track FAQ View
func TestTrackFAQView(t *testing.T) {
	service := &SupportService{}

	faqID := "faq-001"

	err := service.TrackFAQView(faqID)

	assert.NoError(t, err)
}

// Test: Get Canned Responses
func TestGetCannedResponses(t *testing.T) {
	service := &SupportService{}

	category := "payment"

	responses, err := service.GetCannedResponses(category)

	assert.NoError(t, err)
	assert.NotNil(t, responses)
}

// Test: Ticket Status Validation
func TestTicketStatusValidation(t *testing.T) {
	validStatuses := []string{"open", "in-progress", "resolved", "closed"}

	for _, status := range validStatuses {
		assert.True(t, IsValidTicketStatus(status))
	}

	assert.False(t, IsValidTicketStatus("invalid_status"))
}

// Test: Ticket Priority Validation
func TestTicketPriorityValidation(t *testing.T) {
	validPriorities := []string{"low", "medium", "high", "urgent"}

	for _, priority := range validPriorities {
		assert.True(t, IsValidPriority(priority))
	}

	assert.False(t, IsValidPriority("invalid_priority"))
}

// Test: Ticket Category Validation
func TestTicketCategoryValidation(t *testing.T) {
	validCategories := []string{"booking", "payment", "vehicle", "account", "technical", "other"}

	for _, category := range validCategories {
		assert.True(t, IsValidCategory(category))
	}

	assert.False(t, IsValidCategory("invalid_category"))
}

// Test: Filter Tickets by Status
func TestFilterTicketsByStatus(t *testing.T) {
	service := &SupportService{}

	filters := TicketFilters{
		UserID: "user-123",
		Status: "open",
	}

	tickets, err := service.GetFilteredTickets(filters, 1, 10)

	assert.NoError(t, err)
	assert.NotNil(t, tickets)
}

// Test: Filter Tickets by Category
func TestFilterTicketsByCategory(t *testing.T) {
	service := &SupportService{}

	filters := TicketFilters{
		UserID:   "user-123",
		Category: "payment",
	}

	tickets, err := service.GetFilteredTickets(filters, 1, 10)

	assert.NoError(t, err)
	assert.NotNil(t, tickets)
}

// Test: Filter Tickets by Priority
func TestFilterTicketsByPriority(t *testing.T) {
	service := &SupportService{}

	filters := TicketFilters{
		UserID:   "user-123",
		Priority: "high",
	}

	tickets, err := service.GetFilteredTickets(filters, 1, 10)

	assert.NoError(t, err)
	assert.NotNil(t, tickets)
}

// Test: Sort Tickets by Date
func TestSortTicketsByDate(t *testing.T) {
	service := &SupportService{}

	tickets, err := service.GetUserTicketsSorted("user-123", "date", 1, 10)

	assert.NoError(t, err)
	assert.NotNil(t, tickets)
}

// Test: Sort Tickets by Priority
func TestSortTicketsByPriority(t *testing.T) {
	service := &SupportService{}

	tickets, err := service.GetUserTicketsSorted("user-123", "priority", 1, 10)

	assert.NoError(t, err)
	assert.NotNil(t, tickets)
}

// Helper functions
func IsValidTicketStatus(status string) bool {
	validStatuses := map[string]bool{
		"open":        true,
		"in-progress": true,
		"resolved":    true,
		"closed":      true,
	}
	return validStatuses[status]
}

func IsValidPriority(priority string) bool {
	validPriorities := map[string]bool{
		"low":    true,
		"medium": true,
		"high":   true,
		"urgent": true,
	}
	return validPriorities[priority]
}

func IsValidCategory(category string) bool {
	validCategories := map[string]bool{
		"booking":   true,
		"payment":   true,
		"vehicle":   true,
		"account":   true,
		"technical": true,
		"other":     true,
	}
	return validCategories[category]
}
