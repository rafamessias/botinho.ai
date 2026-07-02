package models

import "time"

type SessionStatus string

const (
	SessionStatusPending     SessionStatus = "pending"
	SessionStatusQRPending   SessionStatus = "qr_pending"
	SessionStatusConnected   SessionStatus = "connected"
	SessionStatusDisconnected SessionStatus = "disconnected"
	SessionStatusNeedsQR     SessionStatus = "needs_qr"
)

type Session struct {
	ID          string        `firestore:"-" json:"sessionId"`
	CompanyID   string        `firestore:"companyId,omitempty" json:"companyId,omitempty"`
	PhoneNumber string        `firestore:"phoneNumber,omitempty" json:"phoneNumber,omitempty"`
	WorkerID    string        `firestore:"workerId,omitempty" json:"workerId,omitempty"`
	Status      SessionStatus `firestore:"status" json:"status"`
	QRCode      string        `firestore:"qrCode,omitempty" json:"qrCode,omitempty"`
	QRImage     string        `firestore:"qrImage,omitempty" json:"qrImage,omitempty"`
	QRExpiresAt *time.Time    `firestore:"expiresAt,omitempty" json:"expiresAt,omitempty"`
	Label               string        `firestore:"label,omitempty" json:"label,omitempty"`
	WebhookURL          string        `firestore:"webhookUrl,omitempty" json:"webhookUrl,omitempty"`
	AcceptGroupMessages bool          `firestore:"acceptGroupMessages" json:"acceptGroupMessages"`
	CreatedAt           time.Time     `firestore:"createdAt,omitempty" json:"createdAt"`
	UpdatedAt   time.Time     `firestore:"updatedAt,omitempty" json:"updatedAt"`
	LastSeenAt  *time.Time    `firestore:"lastSeenAt,omitempty" json:"lastSeenAt,omitempty"`
	LoggedIn       bool `firestore:"-" json:"loggedIn"`
	HasCredentials bool `firestore:"-" json:"hasCredentials"`
	HasSnapshot    bool `firestore:"-" json:"hasSnapshot"`
}

type MessageDirection string

const (
	MessageDirectionInbound  MessageDirection = "inbound"
	MessageDirectionOutbound MessageDirection = "outbound"
)

type MessageQuote struct {
	MessageID   string `json:"messageId"`
	Body        string `json:"body"`
	Participant string `json:"participant,omitempty"`
}

type Message struct {
	ID                string           `firestore:"-" json:"id,omitempty"`
	SessionID         string           `firestore:"sessionId" json:"sessionId"`
	PhoneNumber       string           `firestore:"phoneNumber" json:"phoneNumber"`
	MessageID         string           `firestore:"messageId" json:"messageId"`
	ChatJID           string           `firestore:"chatJid" json:"chatJid"`
	From              string           `firestore:"from" json:"from"`
	SenderJID         string           `firestore:"senderJid,omitempty" json:"senderJid,omitempty"`
	To                string           `firestore:"to" json:"to"`
	Direction         MessageDirection `firestore:"direction" json:"direction"`
	Type              string           `firestore:"type" json:"type"`
	Body              string           `firestore:"body" json:"body"`
	MediaURL          string           `firestore:"mediaUrl,omitempty" json:"mediaUrl,omitempty"`
	QuotedMessageID   string           `firestore:"quotedMessageId,omitempty" json:"quotedMessageId,omitempty"`
	QuotedBody        string           `firestore:"quotedBody,omitempty" json:"quotedBody,omitempty"`
	QuotedParticipant string           `firestore:"quotedParticipant,omitempty" json:"quotedParticipant,omitempty"`
	Timestamp         time.Time        `firestore:"timestamp" json:"timestamp"`
}

type WorkerInfo struct {
	WorkerID        string `json:"id"`
	URL             string `json:"url"`
	Capacity        int    `json:"capacity"`
	CurrentSessions int    `json:"currentSessions"`
	Status          string `json:"status"`
	LastHeartbeat   int64  `json:"lastHeartbeat"`
}

type InboundEvent struct {
	Channel     string    `firestore:"channel" json:"channel"`
	SessionID   string    `firestore:"sessionId" json:"sessionId"`
	MessageID   string    `firestore:"messageId" json:"messageId"`
	From        string    `firestore:"from" json:"from"`
	To          string    `firestore:"to,omitempty" json:"to,omitempty"`
	Body        string    `firestore:"body" json:"body"`
	Type        string    `firestore:"type,omitempty" json:"type,omitempty"`
	Timestamp   time.Time `firestore:"timestamp" json:"timestamp"`
	PhoneNumber string    `firestore:"phoneNumber,omitempty" json:"phoneNumber,omitempty"`
	Status      string    `firestore:"status" json:"status"`
	Attempts    int       `firestore:"attempts" json:"attempts"`
	CreatedAt   time.Time `firestore:"createdAt" json:"createdAt"`
	UpdatedAt   time.Time `firestore:"updatedAt" json:"updatedAt"`
}

type SendMessageRequest struct {
	SessionID   string        `json:"sessionId,omitempty"`
	PhoneNumber string        `json:"phoneNumber,omitempty"`
	To          string        `json:"to"`
	Text        string        `json:"text"`
	Quote       *MessageQuote `json:"quote,omitempty"`
}

type APIError struct {
	Message string `json:"message"`
	Details string `json:"details,omitempty"`
}

type ErrorResponse struct {
	Error APIError `json:"error"`
}
