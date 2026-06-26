package wa

import (
	"context"
	"encoding/base64"
	"fmt"
	"strings"
	"sync"
	"time"

	qrcode "github.com/skip2/go-qrcode"
	"go.mau.fi/whatsmeow"
	"go.mau.fi/whatsmeow/proto/waE2E"
	"go.mau.fi/whatsmeow/store"
	"go.mau.fi/whatsmeow/store/sqlstore"
	"go.mau.fi/whatsmeow/types"
	"go.mau.fi/whatsmeow/types/events"
	waLog "go.mau.fi/whatsmeow/util/log"

	"github.com/botinho/botinho.ai/services/whatsapp-worker/internal/models"
	"github.com/botinho/botinho.ai/services/whatsapp-worker/internal/repository"
)

type SessionCallbacks struct {
	OnSessionUpdate func(ctx context.Context, session *models.Session) error
	OnMessage       func(ctx context.Context, message *models.Message) error
	OnCheckpoint    func(ctx context.Context, sessionID string, data []byte) error
}

type Session struct {
	ID        string
	container *sqlstore.Container
	client    *whatsmeow.Client
	mu        sync.RWMutex
	status    models.SessionStatus
	qrCode    string
	qrImage   string
	qrExpires time.Time
	phone     string
}

type Pool struct {
	maxSessions int
	sessions    map[string]*Session
	mu          sync.RWMutex
	repos       *repository.Repositories
	callbacks   SessionCallbacks
	logger      waLog.Logger
}

func NewPool(maxSessions int, repos *repository.Repositories, callbacks SessionCallbacks) *Pool {
	return &Pool{
		maxSessions: maxSessions,
		sessions:    make(map[string]*Session),
		repos:       repos,
		callbacks:   callbacks,
		logger:      waLog.Noop,
	}
}

func (p *Pool) Count() int {
	p.mu.RLock()
	defer p.mu.RUnlock()
	return len(p.sessions)
}

func (p *Pool) Start(ctx context.Context, sessionID string) (*models.Session, error) {
	p.mu.Lock()
	defer p.mu.Unlock()
	if len(p.sessions) >= p.maxSessions {
		return nil, fmt.Errorf("worker at capacity")
	}
	if _, exists := p.sessions[sessionID]; exists {
		return p.modelLocked(p.sessions[sessionID], sessionID)
	}

	container, device, err := p.openStore(ctx, sessionID)
	if err != nil {
		return nil, err
	}

	client := whatsmeow.NewClient(device, p.logger)
	session := &Session{
		ID:        sessionID,
		container: container,
		client:    client,
		status:    models.SessionStatusPending,
	}

	client.AddEventHandler(func(raw any) {
		p.handleEvent(context.Background(), sessionID, raw)
	})

	p.sessions[sessionID] = session
	model := &models.Session{
		ID:        sessionID,
		Status:    models.SessionStatusPending,
		CreatedAt: time.Now().UTC(),
		UpdatedAt: time.Now().UTC(),
	}
	if p.callbacks.OnSessionUpdate != nil {
		_ = p.callbacks.OnSessionUpdate(ctx, model)
	}
	return model, nil
}

func (p *Pool) Connect(ctx context.Context, sessionID string) error {
	session, err := p.getSession(sessionID)
	if err != nil {
		return err
	}
	if session.client.IsConnected() {
		return nil
	}
	if err := session.client.Connect(); err != nil {
		return fmt.Errorf("connect whatsapp: %w", err)
	}
	session.mu.Lock()
	session.status = models.SessionStatusQRPending
	session.mu.Unlock()
	return p.syncSession(ctx, sessionID)
}

func (p *Pool) Stop(ctx context.Context, sessionID string) error {
	p.mu.Lock()
	session, ok := p.sessions[sessionID]
	if ok {
		delete(p.sessions, sessionID)
	}
	p.mu.Unlock()
	if !ok {
		return nil
	}
	if session.client.IsLoggedIn() {
		_ = session.client.Logout(ctx)
	} else if session.client.IsConnected() {
		session.client.Disconnect()
	}
	_ = p.saveCheckpoint(ctx, session)
	return session.container.Close()
}

func (p *Pool) Status(sessionID string) (*models.Session, error) {
	return p.currentModel(sessionID)
}

func (p *Pool) SendText(ctx context.Context, sessionID, toNumber, text string) (*models.Message, error) {
	session, err := p.getSession(sessionID)
	if err != nil {
		return nil, err
	}
	if !session.client.IsConnected() {
		return nil, fmt.Errorf("session not connected")
	}
	jid, err := parsePhoneJID(toNumber)
	if err != nil {
		return nil, err
	}
	resp, err := session.client.SendMessage(ctx, jid, &waE2E.Message{
		Conversation: &text,
	})
	if err != nil {
		return nil, err
	}
	phone := sessionPhone(session)
	message := &models.Message{
		SessionID:   sessionID,
		PhoneNumber: phone,
		MessageID:   resp.ID,
		ChatJID:     jid.String(),
		From:        phone,
		To:          normalizePhone(toNumber),
		Direction:   models.MessageDirectionOutbound,
		Type:        "text",
		Body:        text,
		Timestamp:   time.Now().UTC(),
	}
	if p.callbacks.OnMessage != nil {
		_ = p.callbacks.OnMessage(ctx, message)
	}
	return message, nil
}

func (p *Pool) openStore(ctx context.Context, sessionID string) (*sqlstore.Container, *store.Device, error) {
	container, err := sqlstore.New(ctx, "sqlite", fmt.Sprintf("file:%s?mode=memory&cache=private&_pragma=foreign_keys(1)", sessionID), p.logger)
	if err != nil {
		return nil, nil, fmt.Errorf("open memory store: %w", err)
	}
	device, err := container.GetFirstDevice(ctx)
	if err != nil {
		_ = container.Close()
		return nil, nil, err
	}
	return container, device, nil
}

func (p *Pool) handleEvent(ctx context.Context, sessionID string, raw any) {
	switch evt := raw.(type) {
	case *events.QR:
		if len(evt.Codes) == 0 {
			return
		}
		code := evt.Codes[0]
		image, err := encodeQRImage(code)
		if err != nil {
			return
		}
		p.mu.RLock()
		session := p.sessions[sessionID]
		p.mu.RUnlock()
		if session == nil {
			return
		}
		session.mu.Lock()
		session.qrCode = code
		session.qrImage = image
		session.qrExpires = time.Now().UTC().Add(60 * time.Second)
		session.status = models.SessionStatusQRPending
		session.mu.Unlock()
		_ = p.syncSession(ctx, sessionID)
	case *events.Connected:
		p.mu.RLock()
		session := p.sessions[sessionID]
		p.mu.RUnlock()
		if session == nil {
			return
		}
		session.mu.Lock()
		session.status = models.SessionStatusConnected
		if jid := session.client.Store.GetJID(); jid.User != "" {
			session.phone = normalizePhone(jid.User)
		}
		session.qrCode = ""
		session.qrImage = ""
		session.mu.Unlock()
		_ = p.syncSession(ctx, sessionID)
		_ = p.saveCheckpoint(ctx, session)
	case *events.PairSuccess:
		p.mu.RLock()
		session := p.sessions[sessionID]
		p.mu.RUnlock()
		if session == nil {
			return
		}
		session.mu.Lock()
		if evt.ID.User != "" {
			session.phone = normalizePhone(evt.ID.User)
		}
		session.status = models.SessionStatusQRPending
		session.mu.Unlock()
		_ = p.syncSession(ctx, sessionID)
	case *events.Message:
		if evt.Info.IsFromMe {
			return
		}
		message := inboundMessage(sessionID, evt)
		if p.callbacks.OnMessage != nil {
			_ = p.callbacks.OnMessage(ctx, message)
		}
	case *events.Disconnected:
		p.mu.RLock()
		session := p.sessions[sessionID]
		p.mu.RUnlock()
		if session == nil {
			return
		}
		session.mu.Lock()
		session.status = models.SessionStatusDisconnected
		session.mu.Unlock()
		_ = p.syncSession(ctx, sessionID)
	}
}

func (p *Pool) syncSession(ctx context.Context, sessionID string) error {
	model, err := p.currentModel(sessionID)
	if err != nil {
		return err
	}
	if p.callbacks.OnSessionUpdate != nil {
		return p.callbacks.OnSessionUpdate(ctx, model)
	}
	return nil
}

func (p *Pool) currentModel(sessionID string) (*models.Session, error) {
	session, err := p.getSession(sessionID)
	if err != nil {
		return nil, err
	}
	return p.modelLocked(session, sessionID)
}

func (p *Pool) modelLocked(session *Session, sessionID string) (*models.Session, error) {
	session.mu.RLock()
	defer session.mu.RUnlock()
	model := &models.Session{
		ID:        sessionID,
		Status:    session.status,
		QRCode:    session.qrCode,
		QRImage:   session.qrImage,
		UpdatedAt: time.Now().UTC(),
	}
	if !session.qrExpires.IsZero() {
		exp := session.qrExpires
		model.QRExpiresAt = &exp
	}
	if session.phone != "" {
		model.PhoneNumber = session.phone
	}
	return model, nil
}

func (p *Pool) getSession(sessionID string) (*Session, error) {
	p.mu.RLock()
	defer p.mu.RUnlock()
	session, ok := p.sessions[sessionID]
	if !ok {
		return nil, fmt.Errorf("session not found")
	}
	return session, nil
}

func (p *Pool) saveCheckpoint(ctx context.Context, session *Session) error {
	if p.callbacks.OnCheckpoint == nil {
		return nil
	}
	return p.callbacks.OnCheckpoint(ctx, session.ID, []byte("checkpoint-v1"))
}

func encodeQRImage(code string) (string, error) {
	png, err := qrcode.Encode(code, qrcode.Medium, 256)
	if err != nil {
		return "", err
	}
	return "data:image/png;base64," + base64.StdEncoding.EncodeToString(png), nil
}

func parsePhoneJID(phone string) (types.JID, error) {
	phone = normalizePhone(phone)
	if phone == "" {
		return types.EmptyJID, fmt.Errorf("invalid phone number")
	}
	return types.NewJID(phone, types.DefaultUserServer), nil
}

func normalizePhone(phone string) string {
	return strings.TrimPrefix(strings.TrimSpace(phone), "+")
}

func sessionPhone(session *Session) string {
	session.mu.RLock()
	defer session.mu.RUnlock()
	if session.phone != "" {
		return session.phone
	}
	if session.client.Store.ID != nil {
		return normalizePhone(session.client.Store.GetJID().User)
	}
	return ""
}

func inboundMessage(sessionID string, evt *events.Message) *models.Message {
	body := evt.Message.GetConversation()
	if body == "" && evt.Message.GetExtendedTextMessage() != nil {
		body = evt.Message.GetExtendedTextMessage().GetText()
	}
	msgType := "text"
	if body == "" {
		msgType = "unknown"
	}
	from := normalizePhone(evt.Info.Sender.User)
	to := normalizePhone(evt.Info.Chat.User)
	return &models.Message{
		SessionID:   sessionID,
		PhoneNumber: to,
		MessageID:   evt.Info.ID,
		ChatJID:     evt.Info.Chat.String(),
		From:        from,
		To:          to,
		Direction:   models.MessageDirectionInbound,
		Type:        msgType,
		Body:        body,
		Timestamp:   evt.Info.Timestamp,
	}
}
