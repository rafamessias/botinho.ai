package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/joho/godotenv"

	"github.com/botinho/botinho.ai/services/whatsapp-worker/internal/api"
	"github.com/botinho/botinho.ai/services/whatsapp-worker/internal/config"
	"github.com/botinho/botinho.ai/services/whatsapp-worker/internal/models"
	"github.com/botinho/botinho.ai/services/whatsapp-worker/internal/registry"
	"github.com/botinho/botinho.ai/services/whatsapp-worker/internal/repository"
	"github.com/botinho/botinho.ai/services/whatsapp-worker/internal/wa"
	"github.com/botinho/botinho.ai/services/whatsapp-worker/internal/webhook"
)

func recoverWorkerSessions(ctx context.Context, workerID string, repos *repository.Repositories, pool *wa.Pool) {
	sessions, err := repos.Sessions.ListSessions(ctx)
	if err != nil {
		log.Printf("[worker] session recovery list failed: %v", err)
		return
	}

	for _, session := range sessions {
		if session.WorkerID != workerID {
			continue
		}
		if session.Status != models.SessionStatusConnected {
			continue
		}

		log.Printf("[worker] recovering session %s", session.ID)
		if _, err := pool.Start(ctx, session.ID); err != nil {
			log.Printf("[worker] recover start failed session=%s: %v", session.ID, err)
			continue
		}
		if err := pool.Connect(ctx, session.ID); err != nil {
			log.Printf("[worker] recover connect failed session=%s: %v", session.ID, err)
		}
	}
}

func main() {
	_ = godotenv.Load()
	_ = godotenv.Load("../../.env.local")
	_ = godotenv.Load("../../.env")
	cfg := config.LoadWorker()
	ctx := context.Background()

	reg, err := registry.New(cfg.RedisURL)
	if err != nil {
		log.Fatalf("redis: %v", err)
	}
	if err := reg.Ping(ctx); err != nil {
		log.Fatalf("redis ping: %v", err)
	}
	if err := reg.RegisterWorker(ctx, cfg.WorkerID, cfg.WorkerURL, cfg.MaxSessions); err != nil {
		log.Fatalf("register worker: %v", err)
	}

	repos, err := repository.NewRepositoriesFromWorkerConfig(ctx, cfg)
	if err != nil {
		log.Fatalf("repositories: %v", err)
	}
	defer repos.Close()

	pool := wa.NewPool(cfg.MaxSessions, repos, wa.SessionCallbacks{
		OnSessionUpdate: func(ctx context.Context, session *models.Session) error {
			existing, err := repos.Sessions.GetSession(ctx, session.ID)
			if err == nil {
				session.Label = existing.Label
				session.WebhookURL = existing.WebhookURL
				session.CompanyID = existing.CompanyID
				session.WorkerID = cfg.WorkerID
				session.CreatedAt = existing.CreatedAt
			} else {
				session.WorkerID = cfg.WorkerID
				session.CreatedAt = time.Now().UTC()
			}
			session.UpdatedAt = time.Now().UTC()
			if err := repos.Sessions.UpdateSession(ctx, session); err != nil {
				if err == repository.ErrNotFound {
					return repos.Sessions.CreateSession(ctx, session)
				}
				return err
			}
			if session.PhoneNumber != "" {
				_ = repos.Sessions.SetPhoneIndex(ctx, session.PhoneNumber, session.ID)
				_ = reg.SetPhoneIndex(ctx, session.PhoneNumber, session.ID)
			}
			return nil
		},
		OnMessage: func(ctx context.Context, message *models.Message) error {
			if message.Direction != models.MessageDirectionInbound {
				return repos.Messages.SaveMessage(ctx, message)
			}

			session, err := repos.Sessions.GetSession(ctx, message.SessionID)
			if err != nil {
				log.Printf("[worker] inbound message session lookup failed session=%s: %v", message.SessionID, err)
				return err
			}

			if session.CompanyID == "" {
				log.Printf("[worker] inbound message missing companyId for session=%s", message.SessionID)
				return nil
			}

			eventID := webhook.BuildInboundEventID(message.SessionID, message.MessageID)
			now := time.Now().UTC()
			event := &models.InboundEvent{
				Channel:     "whatsapp",
				SessionID:   message.SessionID,
				MessageID:   message.MessageID,
				From:        message.From,
				To:          message.To,
				Body:        message.Body,
				Type:        message.Type,
				Timestamp:   message.Timestamp,
				PhoneNumber: session.PhoneNumber,
				Status:      "pending",
				Attempts:    0,
				CreatedAt:   now,
				UpdatedAt:   now,
			}

			if err := repos.InboundEvents.UpsertInboundEvent(ctx, session.CompanyID, eventID, event); err != nil {
				return err
			}

			if session.WebhookURL != "" {
				go webhook.DispatchInbound(context.Background(), session.WebhookURL, message)
			}
			return nil
		},
		OnCheckpoint: func(ctx context.Context, sessionID string, data []byte) error {
			return repos.Checkpoints.SaveCheckpoint(ctx, sessionID, data)
		},
	})

	handlers := api.NewWorkerHandlers(pool)
	router := api.NewWorkerRouter(cfg, handlers)

	go recoverWorkerSessions(ctx, cfg.WorkerID, repos, pool)

	go func() {
		ticker := time.NewTicker(10 * time.Second)
		defer ticker.Stop()
		for range ticker.C {
			_ = reg.Heartbeat(context.Background(), cfg.WorkerID, pool.Count())
		}
	}()

	server := &http.Server{
		Addr:              ":" + cfg.Port,
		Handler:           router,
		ReadHeaderTimeout: 10 * time.Second,
	}

	go func() {
		log.Printf("worker %s listening on :%s", cfg.WorkerID, cfg.Port)
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("worker server: %v", err)
		}
	}()

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, syscall.SIGINT, syscall.SIGTERM)
	<-stop

	shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	_ = server.Shutdown(shutdownCtx)
	_ = reg.Close()
}
