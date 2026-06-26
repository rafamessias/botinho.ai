.PHONY: build test run-worker docker-up docker-down

export GOROOT ?= $(HOME)/.local/go
export PATH := $(GOROOT)/bin:$(PATH)

build:
	go build -o bin/worker ./cmd/worker

test:
	go test ./...

run-worker:
	go run ./cmd/worker

docker-up:
	docker compose -f docker-compose.dev.yml up --build -d

docker-down:
	docker compose -f docker-compose.dev.yml down
