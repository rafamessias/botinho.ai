package api

import (
	"encoding/json"
	"net/http"

	"github.com/botinho/botinho.ai/services/whatsapp-worker/internal/models"
)

func writeJSON(w http.ResponseWriter, status int, payload any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(payload)
}

func writeError(w http.ResponseWriter, status int, message, details string) {
	writeJSON(w, status, models.ErrorResponse{
		Error: models.APIError{
			Message: message,
			Details: details,
		},
	})
}
