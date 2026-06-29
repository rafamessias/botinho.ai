package wastore

import (
	"crypto/sha256"
	"database/sql"
	"encoding/hex"
	"fmt"
	"io"
	"os"
	"path/filepath"

	_ "modernc.org/sqlite"
)

func sessionDBPath(sessionStoreDir, sessionID string) string {
	return filepath.Join(sessionStoreDir, sessionID+".db")
}

func localSnapshotPath(localDir, sessionID string, version int) string {
	return filepath.Join(localDir, sessionID, fmt.Sprintf("v%d.db", version))
}

func sha256File(path string) (string, int64, error) {
	file, err := os.Open(path)
	if err != nil {
		return "", 0, err
	}
	defer file.Close()

	hasher := sha256.New()
	size, err := io.Copy(hasher, file)
	if err != nil {
		return "", 0, err
	}
	return hex.EncodeToString(hasher.Sum(nil)), size, nil
}

func checkpointSQLite(dbPath string) error {
	dsn := fmt.Sprintf("file:%s?_pragma=busy_timeout(5000)", dbPath)
	db, err := sql.Open("sqlite", dsn)
	if err != nil {
		return fmt.Errorf("open sqlite for checkpoint: %w", err)
	}
	defer db.Close()

	if _, err := db.Exec("PRAGMA wal_checkpoint(FULL)"); err != nil {
		return fmt.Errorf("wal checkpoint: %w", err)
	}
	return nil
}

func copyFile(src, dst string) error {
	if err := os.MkdirAll(filepath.Dir(dst), 0o700); err != nil {
		return err
	}

	in, err := os.Open(src)
	if err != nil {
		return err
	}
	defer in.Close()

	out, err := os.OpenFile(dst, os.O_CREATE|os.O_WRONLY|os.O_TRUNC, 0o600)
	if err != nil {
		return err
	}
	defer out.Close()

	if _, err := io.Copy(out, in); err != nil {
		return err
	}
	return out.Sync()
}

func removeSessionDBFiles(sessionStoreDir, sessionID string) error {
	base := sessionDBPath(sessionStoreDir, sessionID)
	for _, path := range []string{base, base + "-wal", base + "-shm"} {
		if err := os.Remove(path); err != nil && !os.IsNotExist(err) {
			return err
		}
	}
	return nil
}

func localFileMatchesHash(path, expectedSHA string) bool {
	if expectedSHA == "" {
		return false
	}
	hash, _, err := sha256File(path)
	return err == nil && hash == expectedSHA
}
