package harness

import (
	"fmt"

	"github.com/chankei613/harness-manager/internal/db"
)

// Preset はUIに表示するプリセット定義。
type Preset struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Icon        string `json:"icon"`
	Permissions []db.PermissionInput `json:"permissions"`
	Hooks       []db.HookInput       `json:"hooks"`
	EnvVars     []db.EnvVarInput     `json:"envVars"`
}

func (p Preset) ToCreateRequest() db.CreateProfileRequest {
	return db.CreateProfileRequest{
		Name:        p.Name,
		Description: p.Description,
		Scope:       db.ScopeAgent,
		Permissions: p.Permissions,
		Hooks:       p.Hooks,
		EnvVars:     p.EnvVars,
	}
}

func GetPresets() []Preset {
	return []Preset{
		readonlyPreset(),
		backendDevPreset(),
		prodSafePreset(),
		fullAutoPreset(),
	}
}

func FindPreset(id string) (Preset, error) {
	for _, p := range GetPresets() {
		if p.ID == id {
			return p, nil
		}
	}
	return Preset{}, fmt.Errorf("preset %q not found", id)
}

func readonlyPreset() Preset {
	return Preset{
		ID:          "readonly",
		Name:        "Read Only",
		Description: "Read-only access. No file writes, no destructive bash commands.",
		Icon:        "eye",
		Permissions: []db.PermissionInput{
			{Type: db.PermissionAllow, Tool: "Read"},
			{Type: db.PermissionAllow, Tool: "Bash(grep*)"},
			{Type: db.PermissionAllow, Tool: "Bash(find*)"},
			{Type: db.PermissionAllow, Tool: "Bash(ls*)"},
			{Type: db.PermissionAllow, Tool: "Bash(cat*)"},
			{Type: db.PermissionAllow, Tool: "WebSearch"},
			{Type: db.PermissionAllow, Tool: "WebFetch"},
			{Type: db.PermissionDeny, Tool: "Write"},
			{Type: db.PermissionDeny, Tool: "Edit"},
			{Type: db.PermissionDeny, Tool: "Bash"},
		},
	}
}

func backendDevPreset() Preset {
	return Preset{
		ID:          "backend-dev",
		Name:        "Backend Dev",
		Description: "Full development access with guardrails against force push and destructive rm.",
		Icon:        "terminal",
		Permissions: []db.PermissionInput{
			{Type: db.PermissionAllow, Tool: "Read"},
			{Type: db.PermissionAllow, Tool: "Write"},
			{Type: db.PermissionAllow, Tool: "Edit"},
			{Type: db.PermissionAllow, Tool: "Bash"},
			{Type: db.PermissionAllow, Tool: "mcp__supabase__*"},
			{Type: db.PermissionAllow, Tool: "mcp__github__*"},
			{Type: db.PermissionDeny, Tool: "Bash(git push --force*)"},
			{Type: db.PermissionDeny, Tool: "Bash(rm -rf*)"},
		},
	}
}

func prodSafePreset() Preset {
	return Preset{
		ID:          "prod-safe",
		Name:        "Prod Safe",
		Description: "Read-only with full audit logging of every tool call.",
		Icon:        "shield",
		Permissions: []db.PermissionInput{
			{Type: db.PermissionAllow, Tool: "Read"},
			{Type: db.PermissionAllow, Tool: "Bash(git status)"},
			{Type: db.PermissionAllow, Tool: "Bash(git log*)"},
			{Type: db.PermissionAllow, Tool: "Bash(git diff*)"},
			{Type: db.PermissionDeny, Tool: "Write"},
			{Type: db.PermissionDeny, Tool: "Edit"},
			{Type: db.PermissionDeny, Tool: "Bash"},
		},
		Hooks: []db.HookInput{
			{
				Event:          db.HookPreToolUse,
				Matcher:        "*",
				Command:        `echo "[PROD] $(date -u +%FT%TZ) tool:$TOOL_NAME" >> ~/prod-audit.log`,
				Blocking:       false,
				TimeoutSeconds: 5,
			},
		},
	}
}

func fullAutoPreset() Preset {
	return Preset{
		ID:          "full-auto",
		Name:        "Full Auto",
		Description: "Maximum autonomy. All tools allowed, only catastrophic operations blocked.",
		Icon:        "zap",
		Permissions: []db.PermissionInput{
			{Type: db.PermissionAllow, Tool: "Bash(*)"},
			{Type: db.PermissionAllow, Tool: "Read(*)"},
			{Type: db.PermissionAllow, Tool: "Write(*)"},
			{Type: db.PermissionAllow, Tool: "Edit(*)"},
			{Type: db.PermissionDeny, Tool: "Bash(rm -rf /*)"},
			{Type: db.PermissionDeny, Tool: "Bash(git push --force*)"},
		},
	}
}
