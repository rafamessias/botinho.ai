package wastore

import (
	"context"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"strings"

	"cloud.google.com/go/storage"
	"google.golang.org/api/iterator"
	"google.golang.org/api/option"
)

type gcsBackend struct {
	bucket string
	client *storage.Client
}

func newGCSBackend(ctx context.Context, bucket string) (*gcsBackend, error) {
	var opts []option.ClientOption
	if credJSON := strings.TrimSpace(os.Getenv("FIREBASE_SERVICE_ACCOUNT_JSON")); credJSON != "" {
		opts = append(opts, option.WithCredentialsJSON([]byte(credJSON)))
	}

	client, err := storage.NewClient(ctx, opts...)
	if err != nil {
		return nil, fmt.Errorf("gcs client: %w", err)
	}
	return &gcsBackend{bucket: bucket, client: client}, nil
}

func (b *gcsBackend) objectPath(sessionID string, version int) string {
	return fmt.Sprintf("wa-session-stores/%s/v%d.db", sessionID, version)
}

func (b *gcsBackend) Upload(ctx context.Context, sessionID string, version int, srcPath string) (string, error) {
	objectPath := b.objectPath(sessionID, version)
	file, err := os.Open(srcPath)
	if err != nil {
		return "", err
	}
	defer file.Close()

	writer := b.client.Bucket(b.bucket).Object(objectPath).NewWriter(ctx)
	writer.ContentType = "application/octet-stream"
	if _, err := io.Copy(writer, file); err != nil {
		_ = writer.Close()
		return "", err
	}
	if err := writer.Close(); err != nil {
		return "", err
	}
	return objectPath, nil
}

func (b *gcsBackend) Download(ctx context.Context, objectPath, dstPath string) error {
	if err := os.MkdirAll(filepath.Dir(dstPath), 0o700); err != nil {
		return err
	}

	reader, err := b.client.Bucket(b.bucket).Object(objectPath).NewReader(ctx)
	if err != nil {
		return err
	}
	defer reader.Close()

	out, err := os.OpenFile(dstPath, os.O_CREATE|os.O_WRONLY|os.O_TRUNC, 0o600)
	if err != nil {
		return err
	}
	defer out.Close()

	if _, err := io.Copy(out, reader); err != nil {
		return err
	}
	return out.Sync()
}

func (b *gcsBackend) DeleteSession(ctx context.Context, sessionID string) error {
	prefix := fmt.Sprintf("wa-session-stores/%s/", sessionID)
	it := b.client.Bucket(b.bucket).Objects(ctx, &storage.Query{Prefix: prefix})
	for {
		attrs, err := it.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return err
		}
		if err := b.client.Bucket(b.bucket).Object(attrs.Name).Delete(ctx); err != nil {
			return err
		}
	}
	return nil
}

func (b *gcsBackend) Close() error {
	return b.client.Close()
}
