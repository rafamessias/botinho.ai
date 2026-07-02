package models

import "time"

type StoreSnapshot struct {
	SessionID       string    `firestore:"sessionId"`
	CompanyID       string    `firestore:"companyId,omitempty"`
	WorkerID        string    `firestore:"workerId,omitempty"`
	StorageProvider string    `firestore:"storageProvider"`
	ObjectPath      string    `firestore:"objectPath"`
	Version         int       `firestore:"version"`
	SHA256          string    `firestore:"sha256"`
	SizeBytes       int64     `firestore:"sizeBytes"`
	UpdatedAt       time.Time `firestore:"updatedAt"`
}
