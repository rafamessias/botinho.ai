package repository

import (
	"context"
	"fmt"
	"os"
	"strings"
	"time"

	"cloud.google.com/go/firestore"
	"google.golang.org/api/iterator"
	"google.golang.org/api/option"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	"github.com/botinho/botinho.ai/services/whatsapp-worker/internal/models"
)

type FirestoreRepository struct {
	client *firestore.Client
}

func NewFirestoreRepository(ctx context.Context, projectID string) (*FirestoreRepository, error) {
	var opts []option.ClientOption
	if credJSON := strings.TrimSpace(os.Getenv("FIREBASE_SERVICE_ACCOUNT_JSON")); credJSON != "" {
		opts = append(opts, option.WithCredentialsJSON([]byte(credJSON)))
	}

	client, err := firestore.NewClient(ctx, projectID, opts...)
	if err != nil {
		return nil, fmt.Errorf("firestore client: %w", err)
	}
	return &FirestoreRepository{client: client}, nil
}

func (f *FirestoreRepository) Close() error {
	return f.client.Close()
}

func (f *FirestoreRepository) CreateSession(ctx context.Context, session *models.Session) error {
	_, err := f.client.Collection("sessions").Doc(session.ID).Set(ctx, sessionToMap(session))
	return err
}

func (f *FirestoreRepository) UpdateSession(ctx context.Context, session *models.Session) error {
	session.UpdatedAt = time.Now().UTC()
	data := sessionToMap(session)
	if session.PhoneNumber == "" && session.Status == models.SessionStatusNeedsQR {
		data["phoneNumber"] = firestore.Delete
		data["qrCode"] = firestore.Delete
		data["qrImage"] = firestore.Delete
		data["expiresAt"] = firestore.Delete
	}
	_, err := f.client.Collection("sessions").Doc(session.ID).Set(ctx, data, firestore.MergeAll)
	return err
}

func sessionToMap(session *models.Session) map[string]any {
	data := map[string]any{
		"sessionId": session.ID,
		"status":    session.Status,
		"updatedAt": session.UpdatedAt,
	}
	if session.CompanyID != "" {
		data["companyId"] = session.CompanyID
	}
	if session.PhoneNumber != "" {
		data["phoneNumber"] = session.PhoneNumber
	}
	if session.WorkerID != "" {
		data["workerId"] = session.WorkerID
	}
	if session.QRCode != "" {
		data["qrCode"] = session.QRCode
	}
	if session.QRImage != "" {
		data["qrImage"] = session.QRImage
	}
	if session.Label != "" {
		data["label"] = session.Label
	}
	if session.WebhookURL != "" {
		data["webhookUrl"] = session.WebhookURL
	}
	if session.QRExpiresAt != nil {
		data["expiresAt"] = *session.QRExpiresAt
	}
	if session.LastSeenAt != nil {
		data["lastSeenAt"] = *session.LastSeenAt
	}
	if !session.CreatedAt.IsZero() {
		data["createdAt"] = session.CreatedAt
	}
	return data
}

func inboundEventToMap(event *models.InboundEvent) map[string]any {
	return map[string]any{
		"channel":     event.Channel,
		"sessionId":   event.SessionID,
		"messageId":   event.MessageID,
		"from":        event.From,
		"to":          event.To,
		"body":        event.Body,
		"type":        event.Type,
		"timestamp":   event.Timestamp,
		"phoneNumber": event.PhoneNumber,
		"status":      event.Status,
		"attempts":    event.Attempts,
		"createdAt":   event.CreatedAt,
		"updatedAt":   event.UpdatedAt,
	}
}

func (f *FirestoreRepository) GetSession(ctx context.Context, sessionID string) (*models.Session, error) {
	doc, err := f.client.Collection("sessions").Doc(sessionID).Get(ctx)
	if err != nil {
		if status.Code(err) == codes.NotFound {
			return nil, ErrNotFound
		}
		return nil, err
	}
	var session models.Session
	if err := doc.DataTo(&session); err != nil {
		return nil, err
	}
	session.ID = doc.Ref.ID
	return &session, nil
}

func (f *FirestoreRepository) ListSessions(ctx context.Context) ([]*models.Session, error) {
	iter := f.client.Collection("sessions").Documents(ctx)
	defer iter.Stop()
	out := make([]*models.Session, 0)
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return nil, err
		}
		var session models.Session
		if err := doc.DataTo(&session); err != nil {
			return nil, err
		}
		session.ID = doc.Ref.ID
		out = append(out, &session)
	}
	return out, nil
}

func (f *FirestoreRepository) DeleteSession(ctx context.Context, sessionID string) error {
	_, err := f.client.Collection("sessions").Doc(sessionID).Delete(ctx)
	return err
}

func (f *FirestoreRepository) SetPhoneIndex(ctx context.Context, phoneNumber, sessionID string) error {
	_, err := f.client.Collection("phoneIndex").Doc(phoneNumber).Set(ctx, map[string]string{
		"sessionId": sessionID,
	})
	return err
}

func (f *FirestoreRepository) GetSessionByPhone(ctx context.Context, phoneNumber string) (string, error) {
	doc, err := f.client.Collection("phoneIndex").Doc(phoneNumber).Get(ctx)
	if err != nil {
		if status.Code(err) == codes.NotFound {
			return "", ErrNotFound
		}
		return "", err
	}
	value, ok := doc.Data()["sessionId"].(string)
	if !ok || value == "" {
		return "", ErrNotFound
	}
	return value, nil
}

func (f *FirestoreRepository) DeletePhoneIndex(ctx context.Context, phoneNumber string) error {
	_, err := f.client.Collection("phoneIndex").Doc(phoneNumber).Delete(ctx)
	return err
}

func (f *FirestoreRepository) SaveMessage(ctx context.Context, message *models.Message) error {
	ref := f.client.Collection("messages").NewDoc()
	message.ID = ref.ID
	_, err := ref.Set(ctx, message)
	return err
}

func (f *FirestoreRepository) ListMessages(ctx context.Context, sessionID string, limit int) ([]*models.Message, error) {
	query := f.client.Collection("messages").
		Where("sessionId", "==", sessionID).
		OrderBy("timestamp", firestore.Desc)
	if limit > 0 {
		query = query.Limit(limit)
	}
	iter := query.Documents(ctx)
	defer iter.Stop()
	out := make([]*models.Message, 0)
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return nil, err
		}
		var message models.Message
		if err := doc.DataTo(&message); err != nil {
			return nil, err
		}
		message.ID = doc.Ref.ID
		out = append(out, &message)
	}
	return out, nil
}

func (f *FirestoreRepository) GetStoreSnapshot(ctx context.Context, sessionID string) (*models.StoreSnapshot, error) {
	doc, err := f.client.Collection("waStores").Doc(sessionID).Get(ctx)
	if err != nil {
		if status.Code(err) == codes.NotFound {
			return nil, ErrNotFound
		}
		return nil, err
	}
	var snapshot models.StoreSnapshot
	if err := doc.DataTo(&snapshot); err != nil {
		return nil, err
	}
	snapshot.SessionID = doc.Ref.ID
	return &snapshot, nil
}

func (f *FirestoreRepository) SaveStoreSnapshot(ctx context.Context, snapshot *models.StoreSnapshot) error {
	data := map[string]any{
		"sessionId":       snapshot.SessionID,
		"storageProvider": snapshot.StorageProvider,
		"objectPath":      snapshot.ObjectPath,
		"version":         snapshot.Version,
		"sha256":          snapshot.SHA256,
		"sizeBytes":       snapshot.SizeBytes,
		"updatedAt":       snapshot.UpdatedAt,
	}
	if snapshot.CompanyID != "" {
		data["companyId"] = snapshot.CompanyID
	}
	if snapshot.WorkerID != "" {
		data["workerId"] = snapshot.WorkerID
	}
	_, err := f.client.Collection("waStores").Doc(snapshot.SessionID).Set(ctx, data, firestore.MergeAll)
	return err
}

func (f *FirestoreRepository) DeleteStoreSnapshot(ctx context.Context, sessionID string) error {
	_, err := f.client.Collection("waStores").Doc(sessionID).Delete(ctx)
	return err
}

func (f *FirestoreRepository) UpsertInboundEvent(ctx context.Context, companyID, eventID string, event *models.InboundEvent) error {
	ref := f.client.Collection("companies").Doc(companyID).Collection("inboundEvents").Doc(eventID)
	_, err := ref.Set(ctx, inboundEventToMap(event), firestore.MergeAll)
	return err
}

func (f *FirestoreRepository) Get(ctx context.Context) (*models.SystemProperties, error) {
	doc, err := f.client.Collection("systemProperties").Doc("default").Get(ctx)
	if err != nil {
		if status.Code(err) == codes.NotFound {
			return &models.SystemProperties{WhatsAppSkipHistorySync: true}, nil
		}
		return nil, err
	}
	var props models.SystemProperties
	if err := doc.DataTo(&props); err != nil {
		return nil, err
	}
	return &props, nil
}
