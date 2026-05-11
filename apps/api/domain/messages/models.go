package messages

import "time"

type Conversation struct {
	ID        string    `json:"id" gorm:"primaryKey;type:uuid;default:gen_random_uuid()"`
	UserID    string    `json:"userId" gorm:"index"`
	ListerID  string    `json:"listerId" gorm:"index"`
	ListingID string    `json:"listingId"`
	UpdatedAt time.Time `json:"updatedAt"`
	CreatedAt time.Time `json:"createdAt"`
}

type Message struct {
	ID             string    `json:"id" gorm:"primaryKey;type:uuid;default:gen_random_uuid()"`
	ConversationID string    `json:"conversationId" gorm:"index"`
	SenderID       string    `json:"senderId"`
	Content        string    `json:"content"`
	CreatedAt      time.Time `json:"createdAt"`
}
