package wa

import (
	"context"
	"encoding/base64"
	"errors"
	"fmt"
	"log"
	"os"
	"strings"
	"sync"
	"sync/atomic"
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
	"github.com/botinho/botinho.ai/services/whatsapp-worker/internal/wastore"
)

type SessionCallbacks struct {
	OnSessionUpdate func(ctx context.Context, session *models.Session) error
	OnMessage       func(ctx context.Context, message *models.Message) error
}

type Pool struct {
	maxSessions     int
	sessions        map[string]*Session
	mu              sync.RWMutex
	repos           *repository.Repositories
	callbacks       SessionCallbacks
	logger          waLog.Logger
	storeManager    *wastore.Manager
	workerID        string
	skipHistorySync atomic.Bool
}

type Session struct {
	ID            string
	container     *sqlstore.Container
	client        *whatsmeow.Client
	mu            sync.RWMutex
	status        models.SessionStatus
	qrCode        string
	qrImage       string
	qrExpires     time.Time
	phone         string
	lastMessageAt time.Time
	stopping      bool
	remoteLogout  bool
	qrCancel      context.CancelFunc
}

func NewPool(
	maxSessions int,
	repos *repository.Repositories,
	callbacks SessionCallbacks,
	storeManager *wastore.Manager,
	workerID string,
	skipHistorySync bool,
) *Pool {
	pool := &Pool{
		maxSessions:  maxSessions,
		sessions:     make(map[string]*Session),
		repos:        repos,
		callbacks:    callbacks,
		logger:       waLog.Stdout("WhatsApp", "INFO", true),
		storeManager: storeManager,
		workerID:     workerID,
	}
	pool.skipHistorySync.Store(skipHistorySync)
	return pool
}

func (p *Pool) SetSkipHistorySync(enabled bool) {
	p.skipHistorySync.Store(enabled)
}

func (p *Pool) SkipHistorySync() bool {
	return p.skipHistorySync.Load()
}

func (p *Pool) Count() int {
	p.mu.RLock()
	defer p.mu.RUnlock()
	return len(p.sessions)
}

type SessionHealth struct {
	SessionID      string               `json:"sessionId"`
	Status         models.SessionStatus `json:"status"`
	Connected      bool                 `json:"connected"`
	LoggedIn       bool                 `json:"loggedIn"`
	HasCredentials bool                 `json:"hasCredentials"`
	HasSnapshot    bool                 `json:"hasSnapshot"`
	PhoneNumber    string               `json:"phoneNumber,omitempty"`
	LastMessageAt  *time.Time           `json:"lastMessageAt,omitempty"`
}

type SessionRuntime struct {
	Connected      bool
	LoggedIn       bool
	HasCredentials bool
	Status         models.SessionStatus
}

func (p *Pool) SessionRuntime(sessionID string) (SessionRuntime, error) {
	session, err := p.getSession(sessionID)
	if err != nil {
		return SessionRuntime{}, err
	}
	session.mu.RLock()
	defer session.mu.RUnlock()
	return SessionRuntime{
		Connected:      session.client.IsConnected(),
		LoggedIn:       session.client.IsLoggedIn(),
		HasCredentials: sessionHasCredentials(session),
		Status:         session.status,
	}, nil
}

func (p *Pool) ListSessionHealth() []SessionHealth {
	p.mu.RLock()
	defer p.mu.RUnlock()

	health := make([]SessionHealth, 0, len(p.sessions))
	for sessionID, session := range p.sessions {
		session.mu.RLock()
		item := SessionHealth{
			SessionID:      sessionID,
			Status:         session.status,
			Connected:      session.client.IsConnected(),
			LoggedIn:       session.client.IsLoggedIn(),
			HasCredentials: sessionHasCredentials(session),
			HasSnapshot:    p.HasStoreSnapshot(context.Background(), sessionID),
			PhoneNumber:    session.phone,
		}
		if !session.lastMessageAt.IsZero() {
			lastMessageAt := session.lastMessageAt.UTC()
			item.LastMessageAt = &lastMessageAt
		}
		session.mu.RUnlock()
		health = append(health, item)
	}
	return health
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
	client.EnableAutoReconnect = true
	configureClientHistorySync(client, p.SkipHistorySync())
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
		return p.refreshSessionState(ctx, session, sessionID)
	}
	if !sessionHasCredentials(session) {
		if err := p.ensureQRChannel(session, sessionID); err != nil {
			return err
		}
	}
	if err := session.client.Connect(); err != nil {
		return fmt.Errorf("connect whatsapp: %w", err)
	}
	return p.refreshSessionState(ctx, session, sessionID)
}

func (p *Pool) ensureQRChannel(session *Session, sessionID string) error {
	session.mu.Lock()
	if session.qrCancel != nil {
		session.mu.Unlock()
		return nil
	}
	if sessionHasCredentials(session) {
		session.mu.Unlock()
		return nil
	}
	session.mu.Unlock()

	qrCtx, cancel := context.WithCancel(context.Background())
	qrChan, err := session.client.GetQRChannel(qrCtx)
	if err != nil {
		cancel()
		if errors.Is(err, whatsmeow.ErrQRStoreContainsID) {
			return nil
		}
		return fmt.Errorf("get qr channel: %w", err)
	}

	session.mu.Lock()
	session.qrCancel = cancel
	session.mu.Unlock()

	go p.consumeQRChannel(qrCtx, sessionID, qrChan)
	return nil
}

func (p *Pool) consumeQRChannel(ctx context.Context, sessionID string, qrChan <-chan whatsmeow.QRChannelItem) {
	for item := range qrChan {
		if ctx.Err() != nil {
			return
		}

		p.mu.RLock()
		session := p.sessions[sessionID]
		p.mu.RUnlock()
		if session == nil {
			return
		}

		switch {
		case item.Event == whatsmeow.QRChannelEventCode:
			image, err := encodeQRImage(item.Code)
			if err != nil {
				log.Printf("[wa] qr encode failed session=%s: %v", sessionID, err)
				continue
			}
			timeout := item.Timeout
			if timeout <= 0 {
				timeout = 60 * time.Second
			}
			session.mu.Lock()
			session.qrCode = item.Code
			session.qrImage = image
			session.qrExpires = time.Now().UTC().Add(timeout)
			session.status = models.SessionStatusQRPending
			session.mu.Unlock()
			log.Printf("[wa] qr code session=%s validFor=%s", sessionID, timeout)
			_ = p.syncSession(context.Background(), sessionID)

		case item == whatsmeow.QRChannelSuccess:
			log.Printf("[wa] qr channel pairing success session=%s", sessionID)

		case item.Event == whatsmeow.QRChannelEventError:
			log.Printf("[wa] qr channel pairing error session=%s: %v", sessionID, item.Error)
			session.mu.Lock()
			session.status = models.SessionStatusNeedsQR
			session.mu.Unlock()
			_ = p.syncSession(context.Background(), sessionID)

		case item == whatsmeow.QRChannelTimeout:
			log.Printf("[wa] qr channel timeout session=%s", sessionID)
			session.mu.Lock()
			session.status = models.SessionStatusNeedsQR
			session.mu.Unlock()
			_ = p.syncSession(context.Background(), sessionID)

		case item == whatsmeow.QRChannelScannedWithoutMultidevice:
			log.Printf("[wa] qr scanned without multidevice session=%s — enable linked devices on phone and scan again", sessionID)

		case item == whatsmeow.QRChannelClientOutdated:
			log.Printf("[wa] whatsapp client outdated session=%s", sessionID)
		}
	}
}

func (p *Pool) cancelQRChannel(session *Session) {
	session.mu.Lock()
	defer session.mu.Unlock()
	if session.qrCancel != nil {
		session.qrCancel()
		session.qrCancel = nil
	}
}

func (p *Pool) refreshSessionState(ctx context.Context, session *Session, sessionID string) error {
	session.mu.RLock()
	loggedIn := session.client.IsLoggedIn()
	session.mu.RUnlock()
	if loggedIn {
		p.promoteConnectedAfterSnapshot(ctx, sessionID)
		return nil
	}

	session.mu.Lock()
	switch {
	case sessionHasCredentials(session):
		if session.status == models.SessionStatusQRPending || session.status == models.SessionStatusNeedsQR {
			session.status = models.SessionStatusDisconnected
		}
	default:
		session.status = models.SessionStatusQRPending
	}
	session.mu.Unlock()
	return p.syncSession(ctx, sessionID)
}

func sessionHasCredentials(session *Session) bool {
	return session.client.Store != nil && session.client.Store.ID != nil
}

func (p *Pool) Stop(ctx context.Context, sessionID string, purgeStore bool) error {
	p.mu.Lock()
	session, ok := p.sessions[sessionID]
	if ok {
		session.stopping = true
	}
	p.mu.Unlock()

	if !ok {
		log.Printf("[wa] stop session=%s purge=%v (not in pool)", sessionID, purgeStore)
		if purgeStore && p.storeManager != nil && p.storeManager.Enabled() {
			if err := p.storeManager.Purge(ctx, sessionID); err != nil {
				log.Printf("[wa] stop purge failed session=%s: %v", sessionID, err)
				return err
			}
			log.Printf("[wa] stop purged store session=%s", sessionID)
		}
		return nil
	}

	log.Printf("[wa] stop session=%s purge=%v", sessionID, purgeStore)
	session.client.EnableAutoReconnect = false
	p.cancelQRChannel(session)
	if session.client.IsLoggedIn() {
		_ = session.client.Logout(ctx)
	} else if session.client.IsConnected() {
		session.client.Disconnect()
	}

	p.mu.Lock()
	delete(p.sessions, sessionID)
	p.mu.Unlock()

	if purgeStore {
		_ = p.storeManager.Purge(ctx, sessionID)
	} else {
		p.snapshotSession(ctx, sessionID)
	}
	return session.container.Close()
}

func (p *Pool) SnapshotAll(ctx context.Context) {
	p.mu.RLock()
	sessionIDs := make([]string, 0, len(p.sessions))
	for sessionID, session := range p.sessions {
		session.mu.RLock()
		loggedIn := session.client.IsLoggedIn()
		session.mu.RUnlock()
		if loggedIn {
			sessionIDs = append(sessionIDs, sessionID)
		}
	}
	p.mu.RUnlock()

	for _, sessionID := range sessionIDs {
		p.snapshotSession(ctx, sessionID)
	}
}

func (p *Pool) SnapshotSession(ctx context.Context, sessionID string) {
	p.snapshotSession(ctx, sessionID)
}

func (p *Pool) SnapshotSessionRequired(ctx context.Context, sessionID string) error {
	if p.storeManager == nil || !p.storeManager.Enabled() {
		return nil
	}

	companyID := ""
	workerID := p.workerID
	if p.repos != nil && p.repos.Sessions != nil {
		if session, err := p.repos.Sessions.GetSession(ctx, sessionID); err == nil {
			companyID = session.CompanyID
			if session.WorkerID != "" {
				workerID = session.WorkerID
			}
		}
	}

	if err := p.storeManager.Snapshot(ctx, sessionID, companyID, workerID); err != nil {
		return err
	}
	if !p.storeManager.HasSnapshot(ctx, sessionID) {
		return fmt.Errorf("waStores metadata missing after snapshot")
	}
	return nil
}

func (p *Pool) snapshotSession(ctx context.Context, sessionID string) {
	if err := p.SnapshotSessionRequired(ctx, sessionID); err != nil {
		log.Printf("[wa] snapshot failed session=%s: %v", sessionID, err)
	}
}

func (p *Pool) HasStoreSnapshot(ctx context.Context, sessionID string) bool {
	if p.storeManager == nil || !p.storeManager.Enabled() {
		return true
	}
	return p.storeManager.HasSnapshot(ctx, sessionID)
}

func (p *Pool) promoteConnectedAfterSnapshot(ctx context.Context, sessionID string) {
	session, err := p.getSession(sessionID)
	if err != nil {
		return
	}

	session.mu.RLock()
	phone := sessionPhone(session)
	session.mu.RUnlock()

	if p.storeManager != nil && p.storeManager.Enabled() {
		var snapErr error
		for attempt := 0; attempt < 5; attempt++ {
			snapErr = p.SnapshotSessionRequired(ctx, sessionID)
			if snapErr == nil {
				break
			}
			if !strings.Contains(snapErr.Error(), "session db not found") {
				break
			}
			time.Sleep(200 * time.Millisecond)
		}
		if snapErr != nil {
			log.Printf("[wa] pair snapshot failed session=%s: %v", sessionID, snapErr)
			p.failPairingWithPurge(ctx, sessionID, snapErr.Error())
			return
		}
	}

	session.mu.Lock()
	session.status = models.SessionStatusConnected
	if phone != "" {
		session.phone = phone
	}
	session.qrCode = ""
	session.qrImage = ""
	session.mu.Unlock()

	log.Printf("[wa] session connected session=%s phone=%s", sessionID, phone)
	_ = p.syncSession(ctx, sessionID)
}

func (p *Pool) failPairingWithPurge(ctx context.Context, sessionID, reason string) {
	log.Printf("[wa] pairing failed session=%s: %s", sessionID, reason)

	session, err := p.getSession(sessionID)
	if err == nil {
		session.client.EnableAutoReconnect = false
		p.cancelQRChannel(session)
		if session.client.IsConnected() {
			session.client.Disconnect()
		}
		session.mu.Lock()
		session.status = models.SessionStatusNeedsQR
		session.phone = ""
		session.qrCode = ""
		session.qrImage = ""
		session.mu.Unlock()
		_ = p.syncSession(ctx, sessionID)
	}

	if p.storeManager != nil && p.storeManager.Enabled() {
		if err := p.storeManager.Purge(ctx, sessionID); err != nil {
			log.Printf("[wa] pairing purge failed session=%s: %v", sessionID, err)
		}
	}
}

func (p *Pool) Status(sessionID string) (*models.Session, error) {
	return p.statusModel(context.Background(), sessionID)
}

func (p *Pool) statusModel(ctx context.Context, sessionID string) (*models.Session, error) {
	session, err := p.getSession(sessionID)
	if err != nil {
		return nil, err
	}
	model, err := p.modelLocked(session, sessionID)
	if err != nil {
		return nil, err
	}
	model.HasSnapshot = p.HasStoreSnapshot(ctx, sessionID)
	p.sanitizeSyncModel(ctx, sessionID, model)
	return model, nil
}

func (p *Pool) SendText(ctx context.Context, sessionID, toNumber, text string, quote *models.MessageQuote) (*models.Message, error) {
	session, err := p.getSession(sessionID)
	if err != nil {
		return nil, err
	}
	if !session.client.IsConnected() || !session.client.IsLoggedIn() {
		return nil, fmt.Errorf("session not connected")
	}
	jid, err := parsePhoneJID(toNumber)
	if err != nil {
		return nil, err
	}

	var waMessage *waE2E.Message
	if quote != nil && quote.MessageID != "" && quote.Body != "" {
		textCopy := text
		quotedBody := quote.Body
		stanzaID := quote.MessageID
		contextInfo := &waE2E.ContextInfo{
			StanzaID: &stanzaID,
			QuotedMessage: &waE2E.Message{
				Conversation: &quotedBody,
			},
		}
		if quote.Participant != "" {
			participant := quote.Participant
			contextInfo.Participant = &participant
		}
		waMessage = &waE2E.Message{
			ExtendedTextMessage: &waE2E.ExtendedTextMessage{
				Text:        &textCopy,
				ContextInfo: contextInfo,
			},
		}
	} else {
		waMessage = &waE2E.Message{
			Conversation: &text,
		}
	}

	resp, err := session.client.SendMessage(ctx, jid, waMessage)
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
	if quote != nil {
		message.QuotedMessageID = quote.MessageID
		message.QuotedBody = quote.Body
		message.QuotedParticipant = quote.Participant
	}
	if p.callbacks.OnMessage != nil {
		_ = p.callbacks.OnMessage(ctx, message)
	}
	return message, nil
}

func (p *Pool) openStore(ctx context.Context, sessionID string) (*sqlstore.Container, *store.Device, error) {
	dsn := fmt.Sprintf("file:%s?mode=memory&cache=private&_pragma=foreign_keys(1)", sessionID)
	if dir := strings.TrimSpace(os.Getenv("SESSION_STORE_DIR")); dir != "" {
		if err := os.MkdirAll(dir, 0o700); err != nil {
			return nil, nil, fmt.Errorf("create session store dir: %w", err)
		}
		if p.storeManager != nil && p.storeManager.Enabled() {
			if err := p.storeManager.RestoreIfNeeded(ctx, sessionID); err != nil {
				log.Printf("[wa] store restore failed session=%s: %v", sessionID, err)
			}
		}
		dsn = fmt.Sprintf(
			"file:%s/%s.db?_pragma=foreign_keys(1)&_pragma=journal_mode(WAL)&_pragma=busy_timeout(10000)",
			dir,
			sessionID,
		)
	}

	container, err := sqlstore.New(ctx, "sqlite", dsn, p.logger)
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

func (p *Pool) handleRemoteLogout(ctx context.Context, sessionID, reason string) {
	session, err := p.getSession(sessionID)
	if err != nil {
		return
	}

	phone := sessionPhone(session)
	session.client.EnableAutoReconnect = false
	p.cancelQRChannel(session)

	session.mu.Lock()
	session.remoteLogout = true
	session.status = models.SessionStatusNeedsQR
	session.phone = ""
	session.qrCode = ""
	session.qrImage = ""
	session.mu.Unlock()

	log.Printf("[wa] logged out from phone session=%s phone=%s reason=%s", sessionID, phone, reason)
	_ = p.syncSession(ctx, sessionID)

	p.mu.Lock()
	delete(p.sessions, sessionID)
	p.mu.Unlock()

	if session.client.IsConnected() {
		session.client.Disconnect()
	}
	if p.storeManager != nil && p.storeManager.Enabled() {
		go func() {
			if err := p.storeManager.Purge(context.Background(), sessionID); err != nil {
				log.Printf("[wa] purge after remote logout failed session=%s: %v", sessionID, err)
			}
		}()
	}
	_ = session.container.Close()
}

func (p *Pool) handleEvent(ctx context.Context, sessionID string, raw any) {
	switch evt := raw.(type) {
	case *events.QR:
		if len(evt.Codes) == 0 {
			return
		}
		p.mu.RLock()
		session := p.sessions[sessionID]
		p.mu.RUnlock()
		if session == nil {
			return
		}
		if sessionHasCredentials(session) {
			log.Printf("[wa] QR event ignored session=%s — stored credentials exist, waiting for login", sessionID)
			return
		}
		code := evt.Codes[0]
		image, err := encodeQRImage(code)
		if err != nil {
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
		session.mu.RLock()
		loggedIn := session.client.IsLoggedIn()
		hasCredentials := sessionHasCredentials(session)
		session.mu.RUnlock()
		if loggedIn {
			log.Printf("[wa] logged in session=%s phone=%s", sessionID, sessionPhone(session))
			p.promoteConnectedAfterSnapshot(ctx, sessionID)
			return
		}
		if hasCredentials {
			log.Printf("[wa] websocket connected session=%s credentials present, waiting for login", sessionID)
			_ = p.syncSession(ctx, sessionID)
			return
		}
		session.mu.Lock()
		if session.status == models.SessionStatusPending {
			session.status = models.SessionStatusQRPending
		}
		session.mu.Unlock()
		log.Printf("[wa] websocket connected session=%s awaiting QR scan", sessionID)
		_ = p.syncSession(ctx, sessionID)
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
		session.mu.Unlock()
		log.Printf("[wa] pair success session=%s phone=%s", sessionID, sessionPhone(session))
		p.promoteConnectedAfterSnapshot(ctx, sessionID)
	case *events.PairError:
		log.Printf(
			"[wa] pair error session=%s phone=%s: %v",
			sessionID,
			normalizePhone(evt.ID.User),
			evt.Error,
		)
		p.mu.RLock()
		session := p.sessions[sessionID]
		p.mu.RUnlock()
		if session == nil {
			return
		}
		session.mu.Lock()
		session.status = models.SessionStatusNeedsQR
		session.mu.Unlock()
		_ = p.syncSession(ctx, sessionID)
	case *events.QRScannedWithoutMultidevice:
		log.Printf("[wa] qr scanned without multidevice session=%s — enable linked devices on phone and scan again", sessionID)
	case *events.LoggedOut:
		reason := "phone_unlinked"
		if evt.OnConnect {
			reason = fmt.Sprintf("connect_failure_%d", evt.Reason)
		}
		p.handleRemoteLogout(ctx, sessionID, reason)
	case *events.StreamReplaced:
		log.Printf("[wa] stream replaced session=%s — another client connected with the same keys", sessionID)
		p.handleRemoteLogout(ctx, sessionID, "stream_replaced")
	case *events.UndecryptableMessage:
		log.Printf(
			"[wa] undecryptable message session=%s chat=%s sender=%s senderAlt=%s id=%s",
			sessionID,
			evt.Info.Chat.String(),
			evt.Info.Sender.String(),
			evt.Info.SenderAlt.String(),
			evt.Info.ID,
		)
	case *events.HistorySync:
		if !p.SkipHistorySync() {
			break
		}
		syncType := "unknown"
		conversations := 0
		if evt.Data != nil {
			syncType = evt.Data.GetSyncType().String()
			conversations = len(evt.Data.GetConversations())
		}
		log.Printf("[wa] history sync ignored session=%s type=%s conversations=%d", sessionID, syncType, conversations)
	case *events.Message:
		bodyPreview := extractMessageBody(evt)
		log.Printf(
			"[wa] message session=%s fromMe=%v chat=%s sender=%s id=%s bodyLen=%d",
			sessionID,
			evt.Info.IsFromMe,
			evt.Info.Chat.String(),
			evt.Info.Sender.String(),
			evt.Info.ID,
			len(bodyPreview),
		)
		if evt.Info.IsFromMe {
			log.Printf(
				"[wa] skipping outbound echo session=%s chat=%s id=%s (inbound testing requires a different phone than the linked number)",
				sessionID,
				evt.Info.Chat.String(),
				evt.Info.ID,
			)
			return
		}
		if evt.SourceWebMsg != nil {
			if p.SkipHistorySync() {
				log.Printf("[wa] skipping history/backfill message session=%s id=%s", sessionID, evt.Info.ID)
				return
			}
		}
		p.mu.RLock()
		waSession := p.sessions[sessionID]
		p.mu.RUnlock()
		if waSession == nil {
			return
		}
		waSession.mu.RLock()
		loggedIn := waSession.client.IsLoggedIn()
		remoteLogout := waSession.remoteLogout
		waSession.mu.RUnlock()
		if remoteLogout || !loggedIn {
			log.Printf("[wa] ignoring inbound message session=%s loggedIn=%v", sessionID, loggedIn)
			return
		}
		if evt.Info.IsGroup {
			log.Printf("[wa] skipping group message session=%s chat=%s", sessionID, evt.Info.Chat.String())
			return
		}
		waSession.mu.Lock()
		waSession.lastMessageAt = time.Now().UTC()
		waSession.mu.Unlock()
		message := inboundMessage(sessionID, evt, sessionPhone(waSession))
		if message.From == "" {
			log.Printf("[wa] inbound message missing sender phone session=%s chat=%s sender=%s senderAlt=%s id=%s", sessionID, evt.Info.Chat.String(), evt.Info.Sender.String(), evt.Info.SenderAlt.String(), evt.Info.ID)
		}
		if p.callbacks.OnMessage != nil {
			if err := p.callbacks.OnMessage(ctx, message); err != nil {
				log.Printf("[wa] failed to persist inbound message session=%s id=%s: %v", sessionID, evt.Info.ID, err)
			}
		}
	case *events.Disconnected:
		p.mu.RLock()
		session := p.sessions[sessionID]
		p.mu.RUnlock()
		if session == nil {
			return
		}
		session.mu.RLock()
		stopping := session.stopping
		remoteLogout := session.remoteLogout
		hasCredentials := sessionHasCredentials(session)
		session.mu.RUnlock()
		if stopping {
			log.Printf("[wa] disconnected session=%s during intentional stop, skipping reconnect", sessionID)
			return
		}
		if remoteLogout {
			log.Printf("[wa] disconnected session=%s after phone unlink, skipping reconnect", sessionID)
			return
		}
		if !hasCredentials {
			session.mu.Lock()
			session.status = models.SessionStatusNeedsQR
			session.mu.Unlock()
			log.Printf("[wa] disconnected session=%s without credentials, skipping reconnect", sessionID)
			_ = p.syncSession(ctx, sessionID)
			return
		}
		session.mu.Lock()
		session.status = models.SessionStatusDisconnected
		session.mu.Unlock()
		log.Printf("[wa] disconnected session=%s, syncing and scheduling reconnect", sessionID)
		_ = p.syncSession(ctx, sessionID)
		go func() {
			reconnectCtx := context.Background()
			time.Sleep(3 * time.Second)
			p.mu.RLock()
			reconnectSession := p.sessions[sessionID]
			p.mu.RUnlock()
			if reconnectSession == nil {
				return
			}
			reconnectSession.mu.RLock()
			stopping := reconnectSession.stopping
			remoteLogout := reconnectSession.remoteLogout
			reconnectSession.mu.RUnlock()
			if stopping || remoteLogout {
				return
			}
			if err := p.Connect(reconnectCtx, sessionID); err != nil {
				log.Printf("[wa] reconnect failed session=%s: %v", sessionID, err)
				p.mu.RLock()
				reconnectSession = p.sessions[sessionID]
				p.mu.RUnlock()
				if reconnectSession == nil {
					return
				}
				reconnectSession.mu.Lock()
				if !reconnectSession.client.IsLoggedIn() {
					reconnectSession.status = models.SessionStatusNeedsQR
				}
				reconnectSession.mu.Unlock()
				_ = p.syncSession(reconnectCtx, sessionID)
			}
		}()
	}
}

func (p *Pool) SyncSession(ctx context.Context, sessionID string) error {
	return p.syncSession(ctx, sessionID)
}

func (p *Pool) syncSession(ctx context.Context, sessionID string) error {
	model, err := p.currentModel(sessionID)
	if err != nil {
		return err
	}
	p.sanitizeSyncModel(ctx, sessionID, model)
	if p.callbacks.OnSessionUpdate != nil {
		return p.callbacks.OnSessionUpdate(ctx, model)
	}
	return nil
}

func (p *Pool) sanitizeSyncModel(ctx context.Context, sessionID string, model *models.Session) {
	if model.Status != models.SessionStatusConnected {
		return
	}
	if p.storeManager == nil || !p.storeManager.Enabled() {
		return
	}
	if p.storeManager.HasSnapshot(ctx, sessionID) {
		return
	}
	model.Status = models.SessionStatusQRPending
	model.PhoneNumber = ""
	model.QRCode = ""
	model.QRImage = ""
	model.QRExpiresAt = nil
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
	if session.client.IsLoggedIn() {
		if session.phone != "" {
			model.PhoneNumber = session.phone
		} else if session.client.Store.ID != nil {
			model.PhoneNumber = normalizePhone(session.client.Store.GetJID().User)
		}
	}
	model.LoggedIn = session.client.IsLoggedIn()
	model.HasCredentials = sessionHasCredentials(session)
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
	var digits strings.Builder
	for _, r := range phone {
		if r >= '0' && r <= '9' {
			digits.WriteRune(r)
		}
	}
	return digits.String()
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

func inboundMessage(sessionID string, evt *events.Message, businessPhone string) *models.Message {
	body := extractMessageBody(evt)
	msgType := "text"
	if body == "" {
		body = inferInboundPlaceholder(evt)
		msgType = "unknown"
	}
	from := resolveInboundCustomerPhone(evt)
	to := businessPhone
	if to == "" {
		to = resolveBusinessPhoneFromEvent(evt)
	}
	quotedMessageID, quotedBody, quotedParticipant := extractQuotedMessage(evt)
	return &models.Message{
		SessionID:         sessionID,
		PhoneNumber:       to,
		MessageID:         evt.Info.ID,
		ChatJID:           evt.Info.Chat.String(),
		From:              from,
		SenderJID:         resolveInboundSenderJID(evt),
		To:                to,
		Direction:         models.MessageDirectionInbound,
		Type:              msgType,
		Body:              body,
		QuotedMessageID:   quotedMessageID,
		QuotedBody:        quotedBody,
		QuotedParticipant: quotedParticipant,
		Timestamp:         evt.Info.Timestamp,
	}
}

func resolveBusinessPhoneFromEvent(evt *events.Message) string {
	if evt.Info.IsGroup {
		return normalizePhone(evt.Info.Chat.User)
	}
	if alt := evt.Info.RecipientAlt.ToNonAD(); alt.User != "" && alt.Server == types.DefaultUserServer {
		return normalizePhone(alt.User)
	}
	return ""
}

func resolveInboundSenderJID(evt *events.Message) string {
	if evt == nil {
		return ""
	}
	if sender := strings.TrimSpace(evt.Info.Sender.String()); sender != "" {
		return sender
	}
	return strings.TrimSpace(evt.Info.Chat.String())
}

func resolveInboundCustomerPhone(evt *events.Message) string {
	if evt.Info.IsGroup {
		return ""
	}
	if alt := evt.Info.SenderAlt.ToNonAD(); alt.User != "" && alt.Server == types.DefaultUserServer {
		if phone := normalizePhone(alt.User); phone != "" {
			return phone
		}
	}
	if chat := evt.Info.Chat.ToNonAD(); chat.User != "" && chat.Server == types.DefaultUserServer {
		return normalizePhone(chat.User)
	}
	if sender := evt.Info.Sender.ToNonAD(); sender.User != "" && sender.Server == types.DefaultUserServer {
		return normalizePhone(sender.User)
	}
	if phone := normalizePhone(evt.Info.Chat.User); phone != "" {
		return phone
	}
	return normalizePhone(evt.Info.Sender.User)
}

func inferInboundPlaceholder(evt *events.Message) string {
	if evt == nil || evt.Message == nil {
		return "[Message]"
	}
	switch {
	case evt.Message.GetImageMessage() != nil:
		return "[Image]"
	case evt.Message.GetVideoMessage() != nil:
		return "[Video]"
	case evt.Message.GetAudioMessage() != nil:
		return "[Audio]"
	case evt.Message.GetDocumentMessage() != nil:
		return "[Document]"
	case evt.Message.GetStickerMessage() != nil:
		return "[Sticker]"
	case evt.Message.GetContactMessage() != nil:
		return "[Contact]"
	case evt.Message.GetLocationMessage() != nil:
		return "[Location]"
	default:
		return "[Message]"
	}
}

func extractMessageBody(evt *events.Message) string {
	if evt == nil || evt.Message == nil {
		return ""
	}

	body := evt.Message.GetConversation()
	if body == "" && evt.Message.GetExtendedTextMessage() != nil {
		body = evt.Message.GetExtendedTextMessage().GetText()
	}
	if body == "" && evt.Message.GetImageMessage() != nil {
		body = evt.Message.GetImageMessage().GetCaption()
	}
	if body == "" && evt.Message.GetVideoMessage() != nil {
		body = evt.Message.GetVideoMessage().GetCaption()
	}
	if body == "" && evt.Message.GetDocumentMessage() != nil {
		body = evt.Message.GetDocumentMessage().GetCaption()
	}
	if body == "" && evt.Message.GetButtonsResponseMessage() != nil {
		body = evt.Message.GetButtonsResponseMessage().GetSelectedDisplayText()
	}
	if body == "" && evt.Message.GetListResponseMessage() != nil {
		body = evt.Message.GetListResponseMessage().GetTitle()
	}
	return strings.TrimSpace(body)
}

func extractContextInfo(msg *waE2E.Message) *waE2E.ContextInfo {
	if msg == nil {
		return nil
	}
	if ext := msg.GetExtendedTextMessage(); ext != nil {
		return ext.GetContextInfo()
	}
	if img := msg.GetImageMessage(); img != nil {
		return img.GetContextInfo()
	}
	if video := msg.GetVideoMessage(); video != nil {
		return video.GetContextInfo()
	}
	if audio := msg.GetAudioMessage(); audio != nil {
		return audio.GetContextInfo()
	}
	if doc := msg.GetDocumentMessage(); doc != nil {
		return doc.GetContextInfo()
	}
	if btn := msg.GetButtonsResponseMessage(); btn != nil {
		return btn.GetContextInfo()
	}
	if list := msg.GetListResponseMessage(); list != nil {
		return list.GetContextInfo()
	}
	return nil
}

func extractQuotedBody(msg *waE2E.Message) string {
	if msg == nil {
		return ""
	}
	if body := strings.TrimSpace(msg.GetConversation()); body != "" {
		return body
	}
	if ext := msg.GetExtendedTextMessage(); ext != nil {
		return strings.TrimSpace(ext.GetText())
	}
	if img := msg.GetImageMessage(); img != nil {
		if caption := strings.TrimSpace(img.GetCaption()); caption != "" {
			return caption
		}
		return "[Image]"
	}
	if video := msg.GetVideoMessage(); video != nil {
		if caption := strings.TrimSpace(video.GetCaption()); caption != "" {
			return caption
		}
		return "[Video]"
	}
	if audio := msg.GetAudioMessage(); audio != nil {
		return "[Audio]"
	}
	if doc := msg.GetDocumentMessage(); doc != nil {
		if caption := strings.TrimSpace(doc.GetCaption()); caption != "" {
			return caption
		}
		return "[Document]"
	}
	return ""
}

func extractQuotedMessage(evt *events.Message) (messageID, body, participant string) {
	if evt == nil || evt.Message == nil {
		return "", "", ""
	}

	contextInfo := extractContextInfo(evt.Message)
	if contextInfo == nil {
		return "", "", ""
	}

	messageID = strings.TrimSpace(contextInfo.GetStanzaID())
	if messageID == "" {
		return "", "", ""
	}

	body = extractQuotedBody(contextInfo.GetQuotedMessage())
	participant = strings.TrimSpace(contextInfo.GetParticipant())
	return messageID, body, participant
}
