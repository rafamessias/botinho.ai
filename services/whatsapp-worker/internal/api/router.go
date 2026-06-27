package api

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"

	"github.com/botinho/botinho.ai/services/whatsapp-worker/internal/config"
	"github.com/botinho/botinho.ai/services/whatsapp-worker/internal/wa"
)

type WorkerHandlers struct {
	pool *wa.Pool
}

func NewWorkerHandlers(pool *wa.Pool) *WorkerHandlers {
	return &WorkerHandlers{pool: pool}
}

func (h *WorkerHandlers) Health(w http.ResponseWriter, _ *http.Request) {
	writeJSON(w, http.StatusOK, map[string]any{
		"status":   "ok",
		"sessions": h.pool.Count(),
	})
}

func (h *WorkerHandlers) StartSession(w http.ResponseWriter, r *http.Request) {
	var req struct {
		SessionID string `json:"sessionId"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.SessionID == "" {
		writeError(w, http.StatusBadRequest, "sessionId is required", "")
		return
	}
	session, err := h.pool.Start(r.Context(), req.SessionID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to start session", err.Error())
		return
	}
	writeJSON(w, http.StatusCreated, session)
}

func (h *WorkerHandlers) ConnectSession(w http.ResponseWriter, r *http.Request) {
	sessionID := chi.URLParam(r, "sessionID")
	if err := h.pool.Connect(r.Context(), sessionID); err != nil {
		writeError(w, http.StatusInternalServerError, "failed to connect session", err.Error())
		return
	}
	session, err := h.pool.Status(sessionID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to get session status", err.Error())
		return
	}
	writeJSON(w, http.StatusOK, session)
}

func (h *WorkerHandlers) StopSession(w http.ResponseWriter, r *http.Request) {
	sessionID := chi.URLParam(r, "sessionID")
	if err := h.pool.Stop(r.Context(), sessionID); err != nil {
		writeError(w, http.StatusInternalServerError, "failed to stop session", err.Error())
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{"success": true})
}

func (h *WorkerHandlers) SessionStatus(w http.ResponseWriter, r *http.Request) {
	sessionID := chi.URLParam(r, "sessionID")
	session, err := h.pool.Status(sessionID)
	if err != nil {
		writeError(w, http.StatusNotFound, "session not found", err.Error())
		return
	}
	writeJSON(w, http.StatusOK, session)
}

func (h *WorkerHandlers) SendMessage(w http.ResponseWriter, r *http.Request) {
	sessionID := chi.URLParam(r, "sessionID")
	var req struct {
		To   string `json:"to"`
		Text string `json:"text"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "invalid request body", err.Error())
		return
	}
	ctx, cancel := context.WithTimeout(r.Context(), 25*time.Second)
	defer cancel()
	message, err := h.pool.SendText(ctx, sessionID, req.To, req.Text)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to send message", err.Error())
		return
	}
	writeJSON(w, http.StatusOK, message)
}

func NewWorkerRouter(cfg config.WorkerConfig, handlers *WorkerHandlers) http.Handler {
	r := chi.NewRouter()
	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	r.Get("/health", handlers.Health)
	r.Route("/internal", func(r chi.Router) {
		r.Use(WorkerTokenMiddleware(cfg.WorkerInternalToken))
		r.Post("/sessions", handlers.StartSession)
		r.Post("/sessions/{sessionID}/connect", handlers.ConnectSession)
		r.Delete("/sessions/{sessionID}", handlers.StopSession)
		r.Get("/sessions/{sessionID}/status", handlers.SessionStatus)
		r.Post("/sessions/{sessionID}/send", handlers.SendMessage)
	})
	return r
}
