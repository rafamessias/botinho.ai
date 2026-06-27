package repository

import (
	"context"
	"fmt"

	"github.com/botinho/botinho.ai/services/whatsapp-worker/internal/config"
)

type Repositories struct {
	Sessions      SessionRepository
	Messages      MessageRepository
	InboundEvents InboundEventRepository
	Checkpoints   StoreCheckpointRepository
	Close         func() error
}

func NewRepositories(ctx context.Context, firestoreProjectID string) (*Repositories, error) {
	if firestoreProjectID == "" {
		mem := NewMemoryRepository()
		return &Repositories{
			Sessions:      mem,
			Messages:      mem,
			InboundEvents: mem,
			Checkpoints:   mem,
			Close:         func() error { return nil },
		}, nil
	}

	fs, err := NewFirestoreRepository(ctx, firestoreProjectID)
	if err != nil {
		return nil, fmt.Errorf("firestore repository: %w", err)
	}
	return &Repositories{
		Sessions:      fs,
		Messages:      fs,
		InboundEvents: fs,
		Checkpoints:   fs,
		Close:         fs.Close,
	}, nil
}

func NewRepositoriesFromWorkerConfig(ctx context.Context, cfg config.WorkerConfig) (*Repositories, error) {
	return NewRepositories(ctx, cfg.FirestoreProjectID)
}
