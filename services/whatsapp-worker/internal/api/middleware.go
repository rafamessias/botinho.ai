package api

import (
	"net/http"
	"strings"
)

func WorkerTokenMiddleware(validToken string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			auth := r.Header.Get("Authorization")
			if !strings.HasPrefix(auth, "Bearer ") {
				writeError(w, http.StatusUnauthorized, "missing bearer token", "")
				return
			}
			token := strings.TrimSpace(strings.TrimPrefix(auth, "Bearer "))
			if token != validToken {
				writeError(w, http.StatusUnauthorized, "invalid worker token", "")
				return
			}
			next.ServeHTTP(w, r)
		})
	}
}
