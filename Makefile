.PHONY: dev build build-mac lint test tidy clean

dev:
	wails dev

build:
	wails build

build-mac:
	wails build -platform darwin/arm64 -o harness-manager-darwin-arm64
	wails build -platform darwin/amd64 -o harness-manager-darwin-amd64

lint:
	golangci-lint run ./...
	cd frontend && npm run lint

test:
	go test ./...
	cd frontend && npm run test:unit

tidy:
	go mod tidy
	cd frontend && npm install

clean:
	rm -rf build/bin/
	rm -rf frontend/dist/
