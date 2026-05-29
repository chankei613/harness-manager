# Harness Manager

AI execution permission manager for Claude Code — visually manage harness profiles (permissions, hooks, env vars) and export to `settings.json`.

## Features

- Create named **Harness Profiles** with allowed/denied tools, hooks, and env vars
- Built-in presets: `readonly`, `backend-dev`, `prod-safe`
- Export any profile to a `.claude/settings.json` file
- Import existing `settings.json` as a new profile
- Live JSON preview before exporting
- Duplicate profiles to iterate on configurations

## Tech Stack

- **Desktop**: Wails v2 (Go + Vue 3)
- **Backend**: Go 1.22+, SQLite/GORM
- **Frontend**: Vue 3 + Vite + UnoCSS + shadcn-vue

## Development

```bash
# Install Wails CLI
go install github.com/wailsapp/wails/v2/cmd/wails@v2.12.0

# Install dependencies
make tidy

# Start dev server
make dev

# Build
make build
```

## License

MIT
