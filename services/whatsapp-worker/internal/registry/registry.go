package registry

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/redis/go-redis/v9"

	"github.com/botinho/botinho.ai/services/whatsapp-worker/internal/models"
)

const (
	workerKeyPrefix  = "worker:"
	workerSetKey     = "workers:active"
	sessionKeyPrefix = "session:"
	phoneKeyPrefix   = "phone:"
	heartbeatTTL     = 60 * time.Second
)

type WorkerRecord struct {
	WorkerID        string `json:"workerId"`
	URL             string `json:"url"`
	Capacity        int    `json:"capacity"`
	CurrentSessions int    `json:"currentSessions"`
	LastHeartbeat   int64  `json:"lastHeartbeat"`
	Status          string `json:"status"`
}

type Registry struct {
	client *redis.Client
}

func New(redisURL string) (*Registry, error) {
	opts, err := redis.ParseURL(redisURL)
	if err != nil {
		return nil, fmt.Errorf("parse redis url: %w", err)
	}
	return &Registry{client: redis.NewClient(opts)}, nil
}

func (r *Registry) Ping(ctx context.Context) error {
	return r.client.Ping(ctx).Err()
}

func (r *Registry) Close() error {
	return r.client.Close()
}

func (r *Registry) RegisterWorker(ctx context.Context, workerID, url string, capacity int) error {
	record := WorkerRecord{
		WorkerID:        workerID,
		URL:             url,
		Capacity:        capacity,
		CurrentSessions: 0,
		LastHeartbeat:   time.Now().UnixMilli(),
		Status:          "idle",
	}
	data, err := json.Marshal(record)
	if err != nil {
		return err
	}
	pipe := r.client.Pipeline()
	pipe.Set(ctx, workerKeyPrefix+workerID, data, heartbeatTTL)
	pipe.SAdd(ctx, workerSetKey, workerID)
	_, err = pipe.Exec(ctx)
	return err
}

func (r *Registry) Heartbeat(ctx context.Context, workerID string, currentSessions int) error {
	key := workerKeyPrefix + workerID
	data, err := r.client.Get(ctx, key).Bytes()
	if err != nil {
		return err
	}
	var record WorkerRecord
	if err := json.Unmarshal(data, &record); err != nil {
		return err
	}
	record.LastHeartbeat = time.Now().UnixMilli()
	record.CurrentSessions = currentSessions
	if currentSessions >= record.Capacity {
		record.Status = "full"
	} else if currentSessions == 0 {
		record.Status = "idle"
	} else {
		record.Status = "active"
	}
	updated, err := json.Marshal(record)
	if err != nil {
		return err
	}
	return r.client.Set(ctx, key, updated, heartbeatTTL).Err()
}

func (r *Registry) GetAvailableWorker(ctx context.Context) (*WorkerRecord, error) {
	ids, err := r.client.SMembers(ctx, workerSetKey).Result()
	if err != nil {
		return nil, err
	}
	for _, id := range ids {
		record, err := r.getWorker(ctx, id)
		if err != nil {
			continue
		}
		if record.CurrentSessions < record.Capacity {
			return record, nil
		}
	}
	return nil, nil
}

func (r *Registry) GetWorker(ctx context.Context, workerID string) (*WorkerRecord, error) {
	return r.getWorker(ctx, workerID)
}

func (r *Registry) getWorker(ctx context.Context, workerID string) (*WorkerRecord, error) {
	data, err := r.client.Get(ctx, workerKeyPrefix+workerID).Bytes()
	if err != nil {
		return nil, err
	}
	var record WorkerRecord
	if err := json.Unmarshal(data, &record); err != nil {
		return nil, err
	}
	return &record, nil
}

func (r *Registry) ListWorkers(ctx context.Context) ([]models.WorkerInfo, error) {
	ids, err := r.client.SMembers(ctx, workerSetKey).Result()
	if err != nil {
		return nil, err
	}
	workers := make([]models.WorkerInfo, 0, len(ids))
	for _, id := range ids {
		record, err := r.getWorker(ctx, id)
		if err != nil {
			continue
		}
		workers = append(workers, models.WorkerInfo{
			WorkerID:        record.WorkerID,
			URL:             record.URL,
			Capacity:        record.Capacity,
			CurrentSessions: record.CurrentSessions,
			Status:          record.Status,
			LastHeartbeat:   record.LastHeartbeat,
		})
	}
	return workers, nil
}

func (r *Registry) AssignSession(ctx context.Context, sessionID, workerID string) error {
	pipe := r.client.Pipeline()
	pipe.Set(ctx, sessionKeyPrefix+sessionID, workerID, 0)
	record, err := r.getWorker(ctx, workerID)
	if err != nil {
		return err
	}
	record.CurrentSessions++
	if record.CurrentSessions >= record.Capacity {
		record.Status = "full"
	} else {
		record.Status = "active"
	}
	data, err := json.Marshal(record)
	if err != nil {
		return err
	}
	pipe.Set(ctx, workerKeyPrefix+workerID, data, heartbeatTTL)
	_, err = pipe.Exec(ctx)
	return err
}

func (r *Registry) GetWorkerForSession(ctx context.Context, sessionID string) (string, error) {
	return r.client.Get(ctx, sessionKeyPrefix+sessionID).Result()
}

func (r *Registry) RemoveSession(ctx context.Context, sessionID string) error {
	workerID, err := r.client.Get(ctx, sessionKeyPrefix+sessionID).Result()
	if err == redis.Nil {
		return nil
	}
	if err != nil {
		return err
	}
	pipe := r.client.Pipeline()
	pipe.Del(ctx, sessionKeyPrefix+sessionID)
	if record, recErr := r.getWorker(ctx, workerID); recErr == nil {
		if record.CurrentSessions > 0 {
			record.CurrentSessions--
		}
		if record.CurrentSessions == 0 {
			record.Status = "idle"
		} else if record.CurrentSessions < record.Capacity {
			record.Status = "active"
		}
		data, _ := json.Marshal(record)
		pipe.Set(ctx, workerKeyPrefix+workerID, data, heartbeatTTL)
	}
	_, err = pipe.Exec(ctx)
	return err
}

func (r *Registry) SetPhoneIndex(ctx context.Context, phoneNumber, sessionID string) error {
	pipe := r.client.Pipeline()
	pipe.Set(ctx, phoneKeyPrefix+phoneNumber, sessionID, 0)
	pipe.Set(ctx, sessionKeyPrefix+"phone:"+sessionID, phoneNumber, 0)
	_, err := pipe.Exec(ctx)
	return err
}

func (r *Registry) GetSessionByPhone(ctx context.Context, phoneNumber string) (string, error) {
	return r.client.Get(ctx, phoneKeyPrefix+phoneNumber).Result()
}

func (r *Registry) RemovePhoneIndex(ctx context.Context, phoneNumber, sessionID string) error {
	pipe := r.client.Pipeline()
	pipe.Del(ctx, phoneKeyPrefix+phoneNumber)
	pipe.Del(ctx, sessionKeyPrefix+"phone:"+sessionID)
	_, err := pipe.Exec(ctx)
	return err
}

func (r *Registry) CleanupStaleWorkers(ctx context.Context) error {
	ids, err := r.client.SMembers(ctx, workerSetKey).Result()
	if err != nil {
		return err
	}
	for _, id := range ids {
		exists, err := r.client.Exists(ctx, workerKeyPrefix+id).Result()
		if err != nil {
			return err
		}
		if exists == 0 {
			_ = r.client.SRem(ctx, workerSetKey, id).Err()
		}
	}
	return nil
}
