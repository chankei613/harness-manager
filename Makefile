.PHONY: dev build build-mac lint test tidy clean

dev:
	wails dev

build:
	wails build

build-mac:
	wails build -platform darwin/arm64 -o harness-manager-darwin-arm64
	xattr -cr build/bin/harness-manager.app && codesign --force --deep --sign - build/bin/harness-manager.app || true
	wails build -platform darwin/amd64 -o harness-manager-darwin-amd64
	xattr -cr build/bin/harness-manager.app && codesign --force --deep --sign - build/bin/harness-manager.app || true

lint:
	golangci-lint run . ./internal/...
	cd frontend && npm run lint

test:
	go test . ./internal/...
	cd frontend && npm run test:unit

tidy:
	go mod tidy
	cd frontend && npm install

clean:
	rm -rf build/bin/
	rm -rf frontend/dist/
