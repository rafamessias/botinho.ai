package config

import (
	"os"
	"strconv"
	"time"
)

type WorkerConfig struct {
	Port                 string
	WorkerID             string
	WorkerURL            string
	RedisURL             string
	FirestoreProjectID   string
	MaxSessions          int
	WorkerInternalToken  string
	StoreCheckpointEvery time.Duration
}

func LoadWorker() WorkerConfig {
	workerID := getEnv("WORKER_ID", "worker-1")
	return WorkerConfig{
		Port:                 getEnv("PORT", "8081"),
		WorkerID:             workerID,
		WorkerURL:            getEnv("WORKER_URL", "http://localhost:8081"),
		RedisURL:             getEnv("REDIS_URL", "redis://localhost:6379"),
		FirestoreProjectID:   os.Getenv("FIRESTORE_PROJECT_ID"),
		MaxSessions:          getEnvInt("MAX_SESSIONS_PER_WORKER", 25),
		WorkerInternalToken:  getEnv("WORKER_INTERNAL_TOKEN", "dev-worker-token"),
		StoreCheckpointEvery: getEnvDuration("STORE_CHECKPOINT_INTERVAL", 30*time.Second),
	}
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

func getEnvInt(key string, fallback int) int {
	v := os.Getenv(key)
	if v == "" {
		return fallback
	}
	n, err := strconv.Atoi(v)
	if err != nil {
		return fallback
	}
	return n
}

func getEnvDuration(key string, fallback time.Duration) time.Duration {
	v := os.Getenv(key)
	if v == "" {
		return fallback
	}
	d, err := time.ParseDuration(v)
	if err != nil {
		return fallback
	}
	return d
}
