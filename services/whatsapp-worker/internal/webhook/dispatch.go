package webhook

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"time"

	"github.com/botinho/botinho.ai/services/whatsapp-worker/internal/models"
)

type InboundPayload struct {
	SessionID string `json:"sessionId"`
	MessageID string `json:"messageId"`
	From      string `json:"from"`
	To        string `json:"to"`
	Body      string `json:"body"`
	Type      string `json:"type"`
	Timestamp string `json:"timestamp"`
}

func DispatchInbound(ctx context.Context, webhookURL string, message *models.Message) {
	if webhookURL == "" || message.Direction != models.MessageDirectionInbound {
		return
	}

	payload := InboundPayload{
		SessionID: message.SessionID,
		MessageID: message.MessageID,
		From:      message.From,
		To:        message.To,
		Body:      message.Body,
		Type:      message.Type,
		Timestamp: message.Timestamp.UTC().Format(time.RFC3339),
	}

	data, err := json.Marshal(payload)
	if err != nil {
		return
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, webhookURL, bytes.NewReader(data))
	if err != nil {
		return
	}
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return
	}
	_ = resp.Body.Close()
}
