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

type StoreCheckpointRepository interface {
	SaveCheckpoint(ctx context.Context, sessionID string, data []byte) error
	LoadCheckpoint(ctx context.Context, sessionID string) ([]byte, error)
	DeleteCheckpoint(ctx context.Context, sessionID string) error
}

type MemoryRepository struct {
	mu        sync.RWMutex
	sessions  map[string]*models.Session
	phoneIdx  map[string]string
	messages  []*models.Message
	checkpoints map[string][]byte
}

func NewMemoryRepository() *MemoryRepository {
	return &MemoryRepository{
		sessions:    make(map[string]*models.Session),
		phoneIdx:    make(map[string]string),
		messages:    make([]*models.Message, 0),
		checkpoints: make(map[string][]byte),
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

func (m *MemoryRepository) SaveCheckpoint(_ context.Context, sessionID string, data []byte) error {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.checkpoints[sessionID] = append([]byte(nil), data...)
	return nil
}

func (m *MemoryRepository) LoadCheckpoint(_ context.Context, sessionID string) ([]byte, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()
	data, ok := m.checkpoints[sessionID]
	if !ok {
		return nil, ErrNotFound
	}
	return append([]byte(nil), data...), nil
}

func (m *MemoryRepository) DeleteCheckpoint(_ context.Context, sessionID string) error {
	m.mu.Lock()
	defer m.mu.Unlock()
	delete(m.checkpoints, sessionID)
	return nil
}
