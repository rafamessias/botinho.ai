package repository

import (
	"context"
	"sync"
	"time"

	"github.com/google/uuid"

	"github.com/botinho/botinho.ai/services/whatsapp-worker/internal/models"
)

type SessionRepository interface {
	CreateSession(ctx context.Context, session *models.Session) error
	UpdateSession(ctx context.Context, session *models.Session) error
	GetSession(ctx context.Context, sessionID string) (*models.Session, error)
	ListSessions(ctx context.Context) ([]*models.Session, error)
	DeleteSession(ctx context.Context, sessionID string) error
	SetPhoneIndex(ctx context.Context, phoneNumber, sessionID string) error
	GetSessionByPhone(ctx context.Context, phoneNumber string) (string, error)
	DeletePhoneIndex(ctx context.Context, phoneNumber string) error
}

type MessageRepository interface {
	SaveMessage(ctx context.Context, message *models.Message) error
	ListMessages(ctx context.Context, sessionID string, limit int) ([]*models.Message, error)
}

type InboundEventRepository interface {
	UpsertInboundEvent(ctx context.Context, companyID, eventID string, event *models.InboundEvent) error
}

type StoreSnapshotRepository interface {
	GetStoreSnapshot(ctx context.Context, sessionID string) (*models.StoreSnapshot, error)
	SaveStoreSnapshot(ctx context.Context, snapshot *models.StoreSnapshot) error
	DeleteStoreSnapshot(ctx context.Context, sessionID string) error
}

type SystemPropertiesRepository interface {
	Get(ctx context.Context) (*models.SystemProperties, error)
}

type MemoryRepository struct {
	mu            sync.RWMutex
	sessions      map[string]*models.Session
	phoneIdx      map[string]string
	messages      []*models.Message
	inboundEvents map[string]*models.InboundEvent
	checkpoints   map[string]*models.StoreSnapshot
}

func NewMemoryRepository() *MemoryRepository {
	return &MemoryRepository{
		sessions:      make(map[string]*models.Session),
		phoneIdx:      make(map[string]string),
		messages:      make([]*models.Message, 0),
		inboundEvents: make(map[string]*models.InboundEvent),
		checkpoints:   make(map[string]*models.StoreSnapshot),
	}
}

func (m *MemoryRepository) CreateSession(_ context.Context, session *models.Session) error {
	m.mu.Lock()
	defer m.mu.Unlock()
	copySession := *session
	m.sessions[session.ID] = &copySession
	return nil
}

func (m *MemoryRepository) UpdateSession(_ context.Context, session *models.Session) error {
	m.mu.Lock()
	defer m.mu.Unlock()
	copySession := *session
	copySession.UpdatedAt = time.Now().UTC()
	m.sessions[session.ID] = &copySession
	return nil
}

func (m *MemoryRepository) GetSession(_ context.Context, sessionID string) (*models.Session, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()
	session, ok := m.sessions[sessionID]
	if !ok {
		return nil, ErrNotFound
	}
	copySession := *session
	return &copySession, nil
}

func (m *MemoryRepository) ListSessions(_ context.Context) ([]*models.Session, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()
	out := make([]*models.Session, 0, len(m.sessions))
	for _, session := range m.sessions {
		copySession := *session
		out = append(out, &copySession)
	}
	return out, nil
}

func (m *MemoryRepository) DeleteSession(_ context.Context, sessionID string) error {
	m.mu.Lock()
	defer m.mu.Unlock()
	if session, ok := m.sessions[sessionID]; ok && session.PhoneNumber != "" {
		delete(m.phoneIdx, session.PhoneNumber)
	}
	delete(m.sessions, sessionID)
	delete(m.checkpoints, sessionID)
	return nil
}

func (m *MemoryRepository) SetPhoneIndex(_ context.Context, phoneNumber, sessionID string) error {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.phoneIdx[phoneNumber] = sessionID
	return nil
}

func (m *MemoryRepository) GetSessionByPhone(_ context.Context, phoneNumber string) (string, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()
	sessionID, ok := m.phoneIdx[phoneNumber]
	if !ok {
		return "", ErrNotFound
	}
	return sessionID, nil
}

func (m *MemoryRepository) DeletePhoneIndex(_ context.Context, phoneNumber string) error {
	m.mu.Lock()
	defer m.mu.Unlock()
	delete(m.phoneIdx, phoneNumber)
	return nil
}

func (m *MemoryRepository) SaveMessage(_ context.Context, message *models.Message) error {
	m.mu.Lock()
	defer m.mu.Unlock()
	copyMessage := *message
	if copyMessage.ID == "" {
		copyMessage.ID = uuid.NewString()
	}
	m.messages = append(m.messages, &copyMessage)
	return nil
}

func (m *MemoryRepository) ListMessages(_ context.Context, sessionID string, limit int) ([]*models.Message, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()
	out := make([]*models.Message, 0)
	for i := len(m.messages) - 1; i >= 0; i-- {
		if m.messages[i].SessionID == sessionID {
			copyMessage := *m.messages[i]
			out = append(out, &copyMessage)
			if limit > 0 && len(out) >= limit {
				break
			}
		}
	}
	return out, nil
}

func (m *MemoryRepository) GetStoreSnapshot(_ context.Context, sessionID string) (*models.StoreSnapshot, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()
	snapshot, ok := m.checkpoints[sessionID]
	if !ok {
		return nil, ErrNotFound
	}
	copySnapshot := *snapshot
	return &copySnapshot, nil
}

func (m *MemoryRepository) SaveStoreSnapshot(_ context.Context, snapshot *models.StoreSnapshot) error {
	m.mu.Lock()
	defer m.mu.Unlock()
	copySnapshot := *snapshot
	m.checkpoints[snapshot.SessionID] = &copySnapshot
	return nil
}

func (m *MemoryRepository) DeleteStoreSnapshot(_ context.Context, sessionID string) error {
	m.mu.Lock()
	defer m.mu.Unlock()
	delete(m.checkpoints, sessionID)
	return nil
}

func (m *MemoryRepository) UpsertInboundEvent(_ context.Context, companyID, eventID string, event *models.InboundEvent) error {
	m.mu.Lock()
	defer m.mu.Unlock()
	copyEvent := *event
	key := companyID + ":" + eventID
	m.inboundEvents[key] = &copyEvent
	return nil
}

func (m *MemoryRepository) Get(_ context.Context) (*models.SystemProperties, error) {
	return &models.SystemProperties{WhatsAppSkipHistorySync: true}, nil
}
