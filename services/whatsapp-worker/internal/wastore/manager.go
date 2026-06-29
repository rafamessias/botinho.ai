package wastore

import (
	"context"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/botinho/botinho.ai/services/whatsapp-worker/internal/models"
	"github.com/botinho/botinho.ai/services/whatsapp-worker/internal/repository"
)

type Manager struct {
	cfg      Config
	backend  blobBackend
	snapshots repository.StoreSnapshotRepository
}

func NewManager(ctx context.Context, cfg Config, snapshots repository.StoreSnapshotRepository) (*Manager, error) {
	if !cfg.Enabled() {
		return &Manager{cfg: cfg, snapshots: snapshots}, nil
	}

	var backend blobBackend
	switch cfg.Backend {
	case "gcs", "firebase":
		bucket := cfg.Bucket
		if bucket == "" {
			bucket = strings.TrimSpace(os.Getenv("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"))
		}
		if bucket == "" {
			return nil, fmt.Errorf("WA_STORE_BUCKET or NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET is required when WA_STORE_BACKEND=%s", cfg.Backend)
		}
		gcs, err := newGCSBackend(ctx, bucket)
		if err != nil {
			return nil, err
		}
		backend = gcs
	default:
		local, err := newLocalBackend(cfg.LocalDir)
		if err != nil {
			return nil, err
		}
		backend = local
	}

	log.Printf("[wastore] enabled backend=%s sessionDir=%s", cfg.Backend, cfg.SessionStoreDir)
	return &Manager{cfg: cfg, backend: backend, snapshots: snapshots}, nil
}

func (m *Manager) Enabled() bool {
	return m != nil && m.cfg.Enabled() && m.backend != nil && m.snapshots != nil
}

func (m *Manager) HasSnapshot(ctx context.Context, sessionID string) bool {
	if !m.Enabled() {
		return false
	}
	_, err := m.snapshots.GetStoreSnapshot(ctx, sessionID)
	return err == nil
}

func (m *Manager) RestoreIfNeeded(ctx context.Context, sessionID string) error {
	if !m.Enabled() {
		return nil
	}

	dbPath := sessionDBPath(m.cfg.SessionStoreDir, sessionID)
	meta, err := m.snapshots.GetStoreSnapshot(ctx, sessionID)
	if err == repository.ErrNotFound {
		return nil
	}
	if err != nil {
		return err
	}
	if meta.ObjectPath == "" {
		return nil
	}

	if localFileMatchesHash(dbPath, meta.SHA256) {
		return nil
	}

	log.Printf("[wastore] restoring session=%s from %s version=%d", sessionID, meta.ObjectPath, meta.Version)
	if err := removeSessionDBFiles(m.cfg.SessionStoreDir, sessionID); err != nil {
		return err
	}

	tempPath := dbPath + ".restore"
	if err := m.backend.Download(ctx, meta.ObjectPath, tempPath); err != nil {
		return fmt.Errorf("download snapshot: %w", err)
	}

	hash, _, err := sha256File(tempPath)
	if err != nil {
		_ = os.Remove(tempPath)
		return err
	}
	if hash != meta.SHA256 {
		_ = os.Remove(tempPath)
		return fmt.Errorf("snapshot sha256 mismatch for session %s", sessionID)
	}

	if err := os.Rename(tempPath, dbPath); err != nil {
		_ = os.Remove(tempPath)
		return err
	}

	log.Printf("[wastore] restored session=%s bytes=%d", sessionID, meta.SizeBytes)
	return nil
}

func (m *Manager) Snapshot(ctx context.Context, sessionID, companyID, workerID string) error {
	if !m.Enabled() {
		return nil
	}

	dbPath := sessionDBPath(m.cfg.SessionStoreDir, sessionID)
	if _, err := os.Stat(dbPath); err != nil {
		if os.IsNotExist(err) {
			return fmt.Errorf("session db not found: %s", dbPath)
		}
		return err
	}

	if err := checkpointSQLite(dbPath); err != nil {
		return err
	}

	hash, size, err := sha256File(dbPath)
	if err != nil {
		return err
	}

	existing, existingErr := m.snapshots.GetStoreSnapshot(ctx, sessionID)
	if existingErr == nil && existing.SHA256 == hash {
		return nil
	}

	version := 1
	if existingErr == nil {
		version = existing.Version + 1
	}

	tempPath := filepath.Join(os.TempDir(), fmt.Sprintf("%s-snapshot-%d.db", sessionID, time.Now().UnixNano()))
	if err := copyFile(dbPath, tempPath); err != nil {
		return err
	}
	defer os.Remove(tempPath)

	objectPath, err := m.backend.Upload(ctx, sessionID, version, tempPath)
	if err != nil {
		return err
	}

	now := time.Now().UTC()
	meta := &models.StoreSnapshot{
		SessionID:       sessionID,
		CompanyID:       companyID,
		WorkerID:        workerID,
		StorageProvider: m.cfg.Backend,
		ObjectPath:      objectPath,
		Version:         version,
		SHA256:          hash,
		SizeBytes:       size,
		UpdatedAt:       now,
	}
	if err := m.snapshots.SaveStoreSnapshot(ctx, meta); err != nil {
		return err
	}

	log.Printf("[wastore] snapshot session=%s version=%d bytes=%d path=%s", sessionID, version, size, objectPath)
	m.pruneOldVersions(ctx, sessionID, version)
	return nil
}

func (m *Manager) Purge(ctx context.Context, sessionID string) error {
	if !m.Enabled() {
		return removeSessionDBFiles(m.cfg.SessionStoreDir, sessionID)
	}

	if err := m.backend.DeleteSession(ctx, sessionID); err != nil {
		log.Printf("[wastore] purge backend failed session=%s: %v", sessionID, err)
	}
	if err := m.snapshots.DeleteStoreSnapshot(ctx, sessionID); err != nil && err != repository.ErrNotFound {
		return err
	}
	return removeSessionDBFiles(m.cfg.SessionStoreDir, sessionID)
}

func (m *Manager) pruneOldVersions(ctx context.Context, sessionID string, currentVersion int) {
	if m.cfg.RetainVersions <= 0 || m.cfg.Backend != "local" {
		return
	}
	minVersion := currentVersion - m.cfg.RetainVersions + 1
	if minVersion < 1 {
		return
	}
	for version := 1; version < minVersion; version++ {
		path := localSnapshotPath(m.cfg.LocalDir, sessionID, version)
		_ = os.Remove(path)
	}
}
