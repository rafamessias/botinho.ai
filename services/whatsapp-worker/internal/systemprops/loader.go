package systemprops

import (
	"context"
	"os"
	"strings"

	"github.com/botinho/botinho.ai/services/whatsapp-worker/internal/models"
	"github.com/botinho/botinho.ai/services/whatsapp-worker/internal/repository"
)

func parseBool(value string, fallback bool) bool {
	switch strings.ToLower(strings.TrimSpace(value)) {
	case "1", "true", "yes", "on":
		return true
	case "0", "false", "no", "off":
		return false
	default:
		return fallback
	}
}

// Load resolves platform settings. Explicit WA_SKIP_HISTORY_SYNC env overrides Firestore.
func Load(ctx context.Context, repos *repository.Repositories) models.SystemProperties {
	if value, ok := os.LookupEnv("WA_SKIP_HISTORY_SYNC"); ok {
		return models.SystemProperties{
			WhatsAppSkipHistorySync: parseBool(value, true),
		}
	}

	if repos != nil && repos.SystemProperties != nil {
		if props, err := repos.SystemProperties.Get(ctx); err == nil && props != nil {
			return *props
		}
	}

	return models.SystemProperties{WhatsAppSkipHistorySync: true}
}
