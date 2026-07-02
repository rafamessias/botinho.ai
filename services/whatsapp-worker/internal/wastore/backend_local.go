package wastore

import (
	"context"
	"os"
	"path/filepath"
)

type blobBackend interface {
	Upload(ctx context.Context, sessionID string, version int, srcPath string) (objectPath string, err error)
	Download(ctx context.Context, objectPath, dstPath string) error
	DeleteSession(ctx context.Context, sessionID string) error
}

type localBackend struct {
	root string
}

func newLocalBackend(root string) (*localBackend, error) {
	if err := os.MkdirAll(root, 0o700); err != nil {
		return nil, err
	}
	return &localBackend{root: root}, nil
}

func (b *localBackend) Upload(_ context.Context, sessionID string, version int, srcPath string) (string, error) {
	dst := localSnapshotPath(b.root, sessionID, version)
	if err := copyFile(srcPath, dst); err != nil {
		return "", err
	}
	return dst, nil
}

func (b *localBackend) Download(_ context.Context, objectPath, dstPath string) error {
	return copyFile(objectPath, dstPath)
}

func (b *localBackend) DeleteSession(_ context.Context, sessionID string) error {
	dir := filepath.Join(b.root, sessionID)
	if err := os.RemoveAll(dir); err != nil && !os.IsNotExist(err) {
		return err
	}
	return nil
}
