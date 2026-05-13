package support

import (
	"time"

	"gorm.io/gorm"
)

type TicketStatus string
type TicketPriority string
type TicketCategory string

const (
	TicketStatusOpen       TicketStatus = "open"
	TicketStatusInProgress TicketStatus = "in_progress"
	TicketStatusResolved   TicketStatus = "resolved"
	TicketStatusClosed     TicketStatus = "closed"
)

const (
	PriorityLow      TicketPriority = "low"
	PriorityMedium   TicketPriority = "medium"
	PriorityHigh     TicketPriority = "high"
	PriorityCritical TicketPriority = "critical"
)

const (
	CategoryBooking  TicketCategory = "booking"
	CategoryPayment  TicketCategory = "payment"
	CategoryVehicle  TicketCategory = "vehicle"
	CategoryAccount  TicketCategory = "account"
	CategoryTechnical TicketCategory = "technical"
	CategoryOther    TicketCategory = "other"
)

// Ticket represents a support ticket
type Ticket struct {
	ID          uint           `gorm:"primarykey" json:"id"`
	UserID      uint           `gorm:"not null;index" json:"user_id"`
	Category    TicketCategory `gorm:"not null;index" json:"category"`
	Priority    TicketPriority `gorm:"default:medium" json:"priority"`
	Status      TicketStatus   `gorm:"default:open;index" json:"status"`
	Subject     string         `gorm:"not null" json:"subject"`
	Description string         `gorm:"type:text;not null" json:"description"`
	AssignedTo  *uint          `gorm:"index" json:"assigned_to,omitempty"`
	ResolvedAt  *time.Time     `json:"resolved_at,omitempty"`
	ClosedAt    *time.Time     `json:"closed_at,omitempty"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
}

// TicketMessage represents a message in a ticket thread
type TicketMessage struct {
	ID          uint           `gorm:"primarykey" json:"id"`
	TicketID    uint           `gorm:"not null;index" json:"ticket_id"`
	SenderID    uint           `gorm:"not null" json:"sender_id"`
	SenderType  string         `gorm:"not null" json:"sender_type"` // user, agent
	Message     string         `gorm:"type:text;not null" json:"message"`
	Attachments string         `gorm:"type:jsonb" json:"attachments,omitempty"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
}

// CannedResponse represents a pre-written response template
type CannedResponse struct {
	ID        uint           `gorm:"primarykey" json:"id"`
	Category  TicketCategory `gorm:"not null;index" json:"category"`
	Title     string         `gorm:"not null" json:"title"`
	Response  string         `gorm:"type:text;not null" json:"response"`
	Tags      string         `gorm:"type:jsonb" json:"tags,omitempty"`
	Active    bool           `gorm:"default:true" json:"active"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

// KnowledgeBaseArticle represents a help article
type KnowledgeBaseArticle struct {
	ID          uint           `gorm:"primarykey" json:"id"`
	Category    string         `gorm:"not null;index" json:"category"`
	Title       string         `gorm:"not null" json:"title"`
	Slug        string         `gorm:"uniqueIndex;not null" json:"slug"`
	Content     string         `gorm:"type:text;not null" json:"content"`
	Summary     string         `gorm:"type:text" json:"summary"`
	Tags        string         `gorm:"type:jsonb" json:"tags,omitempty"`
	ViewCount   int            `gorm:"default:0" json:"view_count"`
	HelpfulCount int           `gorm:"default:0" json:"helpful_count"`
	Published   bool           `gorm:"default:false;index" json:"published"`
	AuthorID    uint           `json:"author_id"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
}

// FAQ represents a frequently asked question
type FAQ struct {
	ID        uint           `gorm:"primarykey" json:"id"`
	Category  string         `gorm:"not null;index" json:"category"`
	Question  string         `gorm:"not null" json:"question"`
	Answer    string         `gorm:"type:text;not null" json:"answer"`
	Order     int            `gorm:"default:0" json:"order"`
	ViewCount int            `gorm:"default:0" json:"view_count"`
	Active    bool           `gorm:"default:true;index" json:"active"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

// LiveChatSession represents an active chat session
type LiveChatSession struct {
	ID         uint           `gorm:"primarykey" json:"id"`
	UserID     uint           `gorm:"not null;index" json:"user_id"`
	AgentID    *uint          `gorm:"index" json:"agent_id,omitempty"`
	Status     string         `gorm:"default:waiting;index" json:"status"` // waiting, active, ended
	StartedAt  time.Time      `json:"started_at"`
	EndedAt    *time.Time     `json:"ended_at,omitempty"`
	Rating     *int           `json:"rating,omitempty"` // 1-5
	Feedback   string         `gorm:"type:text" json:"feedback,omitempty"`
	CreatedAt  time.Time      `json:"created_at"`
	UpdatedAt  time.Time      `json:"updated_at"`
	DeletedAt  gorm.DeletedAt `gorm:"index" json:"-"`
}

// LiveChatMessage represents a message in a live chat
type LiveChatMessage struct {
	ID         uint           `gorm:"primarykey" json:"id"`
	SessionID  uint           `gorm:"not null;index" json:"session_id"`
	SenderID   uint           `gorm:"not null" json:"sender_id"`
	SenderType string         `gorm:"not null" json:"sender_type"` // user, agent, bot
	Message    string         `gorm:"type:text;not null" json:"message"`
	CreatedAt  time.Time      `json:"created_at"`
	DeletedAt  gorm.DeletedAt `gorm:"index" json:"-"`
}

// Request/Response DTOs

type CreateTicketRequest struct {
	Category    TicketCategory `json:"category" validate:"required"`
	Subject     string         `json:"subject" validate:"required"`
	Description string         `json:"description" validate:"required"`
	Priority    *TicketPriority `json:"priority,omitempty"`
}

type AddTicketMessageRequest struct {
	Message     string   `json:"message" validate:"required"`
	Attachments []string `json:"attachments,omitempty"`
}

type UpdateTicketStatusRequest struct {
	Status TicketStatus `json:"status" validate:"required"`
}

type SearchKnowledgeBaseRequest struct {
	Query    string `json:"query" validate:"required"`
	Category string `json:"category,omitempty"`
	Limit    int    `json:"limit,omitempty"`
}

type StartLiveChatRequest struct {
	InitialMessage string `json:"initial_message,omitempty"`
}

type SendChatMessageRequest struct {
	Message string `json:"message" validate:"required"`
}

type RateChatSessionRequest struct {
	Rating   int    `json:"rating" validate:"required,min=1,max=5"`
	Feedback string `json:"feedback,omitempty"`
}

type TicketResponse struct {
	ID          uint           `json:"id"`
	Category    TicketCategory `json:"category"`
	Priority    TicketPriority `json:"priority"`
	Status      TicketStatus   `json:"status"`
	Subject     string         `json:"subject"`
	Description string         `json:"description"`
	MessageCount int           `json:"message_count"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
}

type TicketDetailResponse struct {
	Ticket   Ticket          `json:"ticket"`
	Messages []TicketMessage `json:"messages"`
}

type KnowledgeBaseSearchResponse struct {
	Articles []KnowledgeBaseArticle `json:"articles"`
	Total    int64                  `json:"total"`
}

type LiveChatResponse struct {
	Session  LiveChatSession   `json:"session"`
	Messages []LiveChatMessage `json:"messages"`
}

// TableName overrides
func (Ticket) TableName() string {
	return "support_tickets"
}

func (TicketMessage) TableName() string {
	return "support_ticket_messages"
}

func (CannedResponse) TableName() string {
	return "support_canned_responses"
}

func (KnowledgeBaseArticle) TableName() string {
	return "knowledge_base_articles"
}

func (FAQ) TableName() string {
	return "faqs"
}

func (LiveChatSession) TableName() string {
	return "live_chat_sessions"
}

func (LiveChatMessage) TableName() string {
	return "live_chat_messages"
}
