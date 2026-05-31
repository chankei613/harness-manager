# Harness Manager

AI execution permission manager for Claude Code — visually manage harness profiles (permissions, hooks, env vars) and export to `settings.json`.

## Features

- Create named **Harness Profiles** with allowed/denied tools, hooks, and env vars
- Built-in presets: `readonly`, `backend-dev`, `prod-safe`, `full-auto`
- Export any profile to a `.claude/settings.json` file
- Import existing `settings.json` as a new profile
- Live JSON preview before exporting
- Duplicate profiles to iterate on configurations

## Usage

### Create a profile

1. Click **New Profile** in the sidebar, or go to **Presets** and click **Use** to start from a template
2. Enter a **Name** (required) and optional description
3. Add entries in the **Permissions**, **Hooks**, and **Env** tabs
4. Click **Save**, then **Export** — choose your project's `.claude/` folder (or `~/.claude/` for global settings)

### Permissions

Define which Claude Code tools are allowed or denied. Wildcards are supported:

| Example | Effect |
|---------|--------|
| `allow Bash(*)` | Allow all Bash commands |
| `allow mcp__supabase__*` | Allow all Supabase MCP tools |
| `deny Bash(git push --force*)` | Block force push |

### Hooks

Inject shell commands before/after tool calls. Events: `PreToolUse`, `PostToolUse`, `Stop`, `Notification`.

Set `blocking: true` on a `PreToolUse` hook to cancel the tool call if the command exits non-zero.

### Export / Import

- **Export**: Opens a directory picker; writes `settings.json` to the chosen folder. Existing files are overwritten.
- **Import**: Opens a `settings.json` file and creates a new profile from it. The profile name defaults to the parent folder name.

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

# Run linters
make lint

# Run tests
make test

# Build (macOS)
make build-mac
```

## License

MIT
