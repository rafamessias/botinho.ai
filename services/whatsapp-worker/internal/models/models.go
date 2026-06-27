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
	ID          string        `json:"sessionId"`
	CompanyID   string        `json:"companyId,omitempty"`
	PhoneNumber string        `json:"phoneNumber,omitempty"`
	WorkerID    string        `json:"workerId,omitempty"`
	Status      SessionStatus `json:"status"`
	QRCode      string        `json:"qrCode,omitempty"`
	QRImage     string        `json:"qrImage,omitempty"`
	QRExpiresAt *time.Time    `json:"expiresAt,omitempty"`
	Label       string        `json:"label,omitempty"`
	WebhookURL  string        `json:"webhookUrl,omitempty"`
	CreatedAt   time.Time     `json:"createdAt"`
	UpdatedAt   time.Time     `json:"updatedAt"`
	LastSeenAt  *time.Time    `json:"lastSeenAt,omitempty"`
}

type MessageDirection string

const (
	MessageDirectionInbound  MessageDirection = "inbound"
	MessageDirectionOutbound MessageDirection = "outbound"
)

type Message struct {
	ID          string           `json:"id,omitempty"`
	SessionID   string           `json:"sessionId"`
	PhoneNumber string           `json:"phoneNumber"`
	MessageID   string           `json:"messageId"`
	ChatJID     string           `json:"chatJid"`
	From        string           `json:"from"`
	To          string           `json:"to"`
	Direction   MessageDirection `json:"direction"`
	Type        string           `json:"type"`
	Body        string           `json:"body"`
	MediaURL    string           `json:"mediaUrl,omitempty"`
	Timestamp   time.Time        `json:"timestamp"`
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
	Channel     string    `json:"channel"`
	SessionID   string    `json:"sessionId"`
	MessageID   string    `json:"messageId"`
	From        string    `json:"from"`
	To          string    `json:"to,omitempty"`
	Body        string    `json:"body"`
	Type        string    `json:"type,omitempty"`
	Timestamp   time.Time `json:"timestamp"`
	PhoneNumber string    `json:"phoneNumber,omitempty"`
	Status      string    `json:"status"`
	Attempts    int       `json:"attempts"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

type SendMessageRequest struct {
	SessionID   string `json:"sessionId,omitempty"`
	PhoneNumber string `json:"phoneNumber,omitempty"`
	To          string `json:"to"`
	Text        string `json:"text"`
}

type APIError struct {
	Message string `json:"message"`
	Details string `json:"details,omitempty"`
}

type ErrorResponse struct {
	Error APIError `json:"error"`
}
