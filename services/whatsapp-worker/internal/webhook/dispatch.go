package webhook

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/botinho/botinho.ai/services/whatsapp-worker/internal/models"
)

type InboundPayload struct {
	SessionID         string `json:"sessionId"`
	MessageID         string `json:"messageId"`
	From              string `json:"from"`
	SenderJID         string `json:"senderJid,omitempty"`
	To                string `json:"to"`
	Body              string `json:"body"`
	Type              string `json:"type"`
	Timestamp         string `json:"timestamp"`
	EventID           string `json:"eventId"`
	PhoneNumber       string `json:"phoneNumber,omitempty"`
	QuotedMessageID   string `json:"quotedMessageId,omitempty"`
	QuotedBody        string `json:"quotedBody,omitempty"`
	QuotedParticipant string `json:"quotedParticipant,omitempty"`
}

const (
	maxWebhookAttempts = 3
	webhookRetryDelay  = 2 * time.Second
)

func BuildInboundEventID(sessionID, messageID string) string {
	raw := fmt.Sprintf("whatsapp_%s_%s", sessionID, messageID)
	replacer := strings.NewReplacer("/", "_", "\\", "_", "#", "_", "?", "_")
	return replacer.Replace(raw)
}

func DispatchInbound(ctx context.Context, webhookURL string, message *models.Message, phoneNumber string) {
	if webhookURL == "" || message.Direction != models.MessageDirectionInbound {
		return
	}

	eventID := BuildInboundEventID(message.SessionID, message.MessageID)
	payload := InboundPayload{
		SessionID:         message.SessionID,
		MessageID:         message.MessageID,
		From:              message.From,
		SenderJID:         message.SenderJID,
		To:                message.To,
		Body:              message.Body,
		Type:              message.Type,
		Timestamp:         message.Timestamp.UTC().Format(time.RFC3339),
		EventID:           eventID,
		PhoneNumber:       phoneNumber,
		QuotedMessageID:   message.QuotedMessageID,
		QuotedBody:        message.QuotedBody,
		QuotedParticipant: message.QuotedParticipant,
	}

	data, err := json.Marshal(payload)
	if err != nil {
		log.Printf("[webhook] failed to marshal inbound payload for session %s: %v", message.SessionID, err)
		return
	}

	client := &http.Client{Timeout: 10 * time.Second}

	for attempt := 1; attempt <= maxWebhookAttempts; attempt++ {
		req, err := http.NewRequestWithContext(ctx, http.MethodPost, webhookURL, bytes.NewReader(data))
		if err != nil {
			log.Printf("[webhook] failed to create request for session %s: %v", message.SessionID, err)
			return
		}
		req.Header.Set("Content-Type", "application/json")

		resp, err := client.Do(req)
		if err != nil {
			log.Printf("[webhook] inbound dispatch attempt %d failed for session %s to %s: %v", attempt, message.SessionID, webhookURL, err)
			if attempt < maxWebhookAttempts {
				time.Sleep(webhookRetryDelay * time.Duration(attempt))
				continue
			}
			return
		}

		body, _ := io.ReadAll(io.LimitReader(resp.Body, 512))
		resp.Body.Close()

		if resp.StatusCode >= 200 && resp.StatusCode < 300 {
			return
		}

		log.Printf(
			"[webhook] inbound dispatch attempt %d returned %d for session %s to %s: %s",
			attempt,
			resp.StatusCode,
			message.SessionID,
			webhookURL,
			string(body),
		)

		if attempt < maxWebhookAttempts {
			time.Sleep(webhookRetryDelay * time.Duration(attempt))
		}
	}
}
