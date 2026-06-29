package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"

	"github.com/joho/godotenv"

	"github.com/botinho/botinho.ai/services/whatsapp-worker/internal/api"
	"github.com/botinho/botinho.ai/services/whatsapp-worker/internal/config"
	"github.com/botinho/botinho.ai/services/whatsapp-worker/internal/models"
	"github.com/botinho/botinho.ai/services/whatsapp-worker/internal/registry"
	"github.com/botinho/botinho.ai/services/whatsapp-worker/internal/repository"
	"github.com/botinho/botinho.ai/services/whatsapp-worker/internal/systemprops"
	"github.com/botinho/botinho.ai/services/whatsapp-worker/internal/wa"
	"github.com/botinho/botinho.ai/services/whatsapp-worker/internal/wastore"
	"github.com/botinho/botinho.ai/services/whatsapp-worker/internal/webhook"
)

func resolveInboundWebhookURL(session *models.Session) string {
	if session.WebhookURL != "" {
		return session.WebhookURL
	}
	if session.CompanyID == "" {
		return ""
	}

	base := strings.TrimRight(os.Getenv("WEBHOOK_APP_URL"), "/")
	if base == "" {
		base = "http://host.docker.internal:3000"
	}

	secret := strings.TrimSpace(os.Getenv("WHATSAPP_WEBHOOK_SECRET"))
	if secret == "" {
		secret = strings.TrimSpace(os.Getenv("WORKER_INTERNAL_TOKEN"))
	}
	if secret == "" {
		return ""
	}

	return fmt.Sprintf(
		"%s/api/webhooks/whatsapp/inbound?companyId=%s&token=%s",
		base,
		session.CompanyID,
		secret,
	)
}

func recoverWorkerSessions(
	ctx context.Context,
	workerID string,
	repos *repository.Repositories,
	reg *registry.Registry,
	pool *wa.Pool,
	storeManager *wastore.Manager,
) {
	sessions, err := repos.Sessions.ListSessions(ctx)
	if err != nil {
		log.Printf("[worker] session recovery list failed: %v", err)
		return
	}

	for _, session := range sessions {
		if session.WorkerID != workerID {
			continue
		}
		if session.Status == models.SessionStatusPending ||
			session.Status == models.SessionStatusQRPending ||
			session.Status == models.SessionStatusNeedsQR {
			continue
		}
		if session.Status != models.SessionStatusConnected &&
			session.Status != models.SessionStatusDisconnected {
			continue
		}

		hasSnapshot := storeManager == nil || !storeManager.Enabled() || storeManager.HasSnapshot(ctx, session.ID)

		if session.Status == models.SessionStatusConnected && !hasSnapshot {
			if _, liveErr := pool.Status(session.ID); liveErr == nil {
				runtime, runErr := pool.SessionRuntime(session.ID)
				if runErr == nil {
					switch {
					case runtime.LoggedIn:
						if err := pool.SnapshotSessionRequired(ctx, session.ID); err != nil {
							log.Printf("[worker] snapshot retry failed session=%s: %v", session.ID, err)
						} else {
							_ = pool.SyncSession(ctx, session.ID)
						}
					case runtime.HasCredentials:
						_ = pool.Connect(ctx, session.ID)
					case runtime.Status == models.SessionStatusQRPending ||
						runtime.Status == models.SessionStatusNeedsQR ||
						runtime.Status == models.SessionStatusPending:
						_ = pool.SyncSession(ctx, session.ID)
					default:
						_ = pool.SyncSession(ctx, session.ID)
					}
					continue
				}
			}

			log.Printf(
				"[worker] ghost session %s firestore=connected but no persisted store — purging",
				session.ID,
			)
			downgradeStaleConnectedSession(ctx, repos, reg, pool, session)
			continue
		}

		if session.Status == models.SessionStatusDisconnected && storeManager != nil &&
			storeManager.Enabled() && !hasSnapshot {
			continue
		}

		ensureWorkerSession(ctx, pool, session.ID, session.Status)
	}
}

func downgradeStaleConnectedSession(
	ctx context.Context,
	repos *repository.Repositories,
	reg *registry.Registry,
	pool *wa.Pool,
	session *models.Session,
) {
	if err := pool.Stop(ctx, session.ID, true); err != nil {
		log.Printf("[worker] ghost purge stop failed session=%s: %v", session.ID, err)
	}

	oldPhone := session.PhoneNumber
	session.Status = models.SessionStatusNeedsQR
	session.PhoneNumber = ""
	session.QRCode = ""
	session.QRImage = ""
	session.QRExpiresAt = nil
	session.UpdatedAt = time.Now().UTC()
	if err := repos.Sessions.UpdateSession(ctx, session); err != nil {
		log.Printf("[worker] downgrade stale session failed session=%s: %v", session.ID, err)
		return
	}
	log.Printf("[worker] downgraded stale session %s to needs_qr", session.ID)
	if oldPhone != "" {
		_ = repos.Sessions.DeletePhoneIndex(ctx, oldPhone)
		_ = reg.RemovePhoneIndex(ctx, oldPhone, session.ID)
	}
}

func ensureWorkerSession(ctx context.Context, pool *wa.Pool, sessionID string, firestoreStatus models.SessionStatus) {
	live, err := pool.Status(sessionID)
	if err == nil {
		runtime, healthErr := pool.SessionRuntime(sessionID)
		if healthErr == nil {
			if firestoreStatus == models.SessionStatusConnected && !runtime.LoggedIn && !runtime.HasCredentials {
				log.Printf(
					"[worker] session %s firestore=connected but not paired live=%s — syncing",
					sessionID,
					live.Status,
				)
				_ = pool.SyncSession(ctx, sessionID)
				return
			}
			if !runtime.LoggedIn && !runtime.HasCredentials &&
				(live.Status == models.SessionStatusQRPending ||
					live.Status == models.SessionStatusNeedsQR ||
					runtime.Connected) {
				_ = pool.SyncSession(ctx, sessionID)
				return
			}
		}
	}
	if err == nil && live.Status == models.SessionStatusConnected {
		health, healthErr := pool.SessionRuntime(sessionID)
		if healthErr == nil && health.LoggedIn {
			return
		}
	}

	if err == nil && live.Status != models.SessionStatusConnected {
		health, healthErr := pool.SessionRuntime(sessionID)
		if healthErr == nil && health.Connected && health.HasCredentials && !health.LoggedIn {
			log.Printf(
				"[worker] session %s connected with credentials, waiting for login (firestore=%s live=%s)",
				sessionID,
				firestoreStatus,
				live.Status,
			)
			_ = pool.Connect(ctx, sessionID)
			return
		}
	}

	log.Printf("[worker] ensuring session %s firestoreStatus=%s liveStatus=%v", sessionID, firestoreStatus, liveStatusLabel(live, err))
	if _, err := pool.Start(ctx, sessionID); err != nil {
		log.Printf("[worker] ensure start failed session=%s: %v", sessionID, err)
		return
	}
	if err := pool.Connect(ctx, sessionID); err != nil {
		log.Printf("[worker] ensure connect failed session=%s: %v", sessionID, err)
	}
}

func liveStatusLabel(live *models.Session, err error) string {
	if err != nil {
		return "missing"
	}
	return string(live.Status)
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

	storeCfg := wastore.LoadConfig()
	storeManager, err := wastore.NewManager(ctx, storeCfg, repos.StoreSnapshots)
	if err != nil {
		log.Fatalf("wastore: %v", err)
	}

	systemProperties := systemprops.Load(ctx, repos)
	log.Printf("[worker] systemProperties whatsappSkipHistorySync=%v", systemProperties.WhatsAppSkipHistorySync)

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
			} else if err == nil && existing.PhoneNumber != "" {
				_ = repos.Sessions.DeletePhoneIndex(ctx, existing.PhoneNumber)
				_ = reg.RemovePhoneIndex(ctx, existing.PhoneNumber, session.ID)
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

			webhookURL := resolveInboundWebhookURL(session)
			if webhookURL == "" {
				log.Printf("[worker] inbound message missing webhook URL for session=%s companyId=%s", message.SessionID, session.CompanyID)
				return nil
			}

			log.Printf(
				"[worker] dispatching inbound webhook session=%s from=%s messageId=%s",
				message.SessionID,
				message.From,
				message.MessageID,
			)
			go webhook.DispatchInbound(context.Background(), webhookURL, message, session.PhoneNumber)
			return nil
		},
	}, storeManager, cfg.WorkerID, systemProperties.WhatsAppSkipHistorySync)

	handlers := api.NewWorkerHandlers(pool)
	router := api.NewWorkerRouter(cfg, handlers)

	go recoverWorkerSessions(ctx, cfg.WorkerID, repos, reg, pool, storeManager)

	go func() {
		ticker := time.NewTicker(30 * time.Second)
		defer ticker.Stop()
		for range ticker.C {
			props := systemprops.Load(context.Background(), repos)
			pool.SetSkipHistorySync(props.WhatsAppSkipHistorySync)
			recoverWorkerSessions(context.Background(), cfg.WorkerID, repos, reg, pool, storeManager)
		}
	}()

	go func() {
		ticker := time.NewTicker(10 * time.Second)
		defer ticker.Stop()
		for range ticker.C {
			_ = reg.Heartbeat(context.Background(), cfg.WorkerID, pool.Count())
		}
	}()

	if storeManager.Enabled() {
		go func() {
			ticker := time.NewTicker(storeCfg.SnapshotEvery)
			defer ticker.Stop()
			for range ticker.C {
				pool.SnapshotAll(context.Background())
			}
		}()
	}

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

	pool.SnapshotAll(context.Background())

	shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	_ = server.Shutdown(shutdownCtx)
	_ = reg.Close()
}
