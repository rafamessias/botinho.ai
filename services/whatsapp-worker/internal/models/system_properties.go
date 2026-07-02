package models

import "time"

type SystemProperties struct {
	WhatsAppSkipHistorySync bool      `firestore:"whatsappSkipHistorySync"`
	UpdatedAt               time.Time `firestore:"updatedAt,omitempty"`
}
