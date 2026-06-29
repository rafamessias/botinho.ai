package wastore

import (
	"os"
	"strconv"
	"strings"
	"time"
)

type Config struct {
	Backend         string
	LocalDir        string
	SessionStoreDir string
	Bucket          string
	SnapshotEvery   time.Duration
	RetainVersions  int
}

func LoadConfig() Config {
	backend := strings.ToLower(strings.TrimSpace(os.Getenv("WA_STORE_BACKEND")))
	bucket := strings.TrimSpace(os.Getenv("WA_STORE_BUCKET"))
	if backend == "" {
		if bucket != "" || strings.TrimSpace(os.Getenv("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET")) != "" {
			backend = "gcs"
		} else {
			backend = "local"
		}
	}

	localDir := strings.TrimSpace(os.Getenv("WA_STORE_LOCAL_DIR"))
	if localDir == "" {
		localDir = "/data/wa-store-backups"
	}

	sessionDir := strings.TrimSpace(os.Getenv("SESSION_STORE_DIR"))

	retain := 3
	if v := strings.TrimSpace(os.Getenv("WA_STORE_RETAIN_VERSIONS")); v != "" {
		if parsed, err := strconv.Atoi(v); err == nil && parsed > 0 {
			retain = parsed
		}
	}

	interval := 60 * time.Second
	if v := strings.TrimSpace(os.Getenv("WA_STORE_SNAPSHOT_INTERVAL")); v != "" {
		if parsed, err := time.ParseDuration(v); err == nil && parsed > 0 {
			interval = parsed
		}
	}

	return Config{
		Backend:         backend,
		LocalDir:        localDir,
		SessionStoreDir: sessionDir,
		Bucket:          bucket,
		SnapshotEvery:   interval,
		RetainVersions:  retain,
	}
}

func (c Config) Enabled() bool {
	return c.SessionStoreDir != ""
}
