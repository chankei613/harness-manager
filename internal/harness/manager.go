package harness

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"github.com/chankei613/harness-manager/internal/db"
)

// Manager handles settings.json read/write operations.
type Manager struct{}

func NewManager() *Manager {
	return &Manager{}
}

// ─── Claude Code settings.json フォーマット ──────────────────────

type ClaudeSettings struct {
	Permissions *ClaudePermissions        `json:"permissions,omitempty"`
	Hooks       map[string][]ClaudeHookEntry `json:"hooks,omitempty"`
	Env         map[string]string         `json:"env,omitempty"`
}

type ClaudePermissions struct {
	Allow []string `json:"allow,omitempty"`
	Deny  []string `json:"deny,omitempty"`
}

type ClaudeHookEntry struct {
	Matcher string        `json:"matcher"`
	Hooks   []ClaudeHook  `json:"hooks"`
}

type ClaudeHook struct {
	Type    string `json:"type"`
	Command string `json:"command"`
}

// ─── エクスポート ─────────────────────────────────────────────────

func (m *Manager) ExportToSettings(profile *db.HarnessProfileFull, targetPath string) error {
	settings := m.profileToSettings(profile)

	data, err := json.MarshalIndent(settings, "", "  ")
	if err != nil {
		return fmt.Errorf("marshal settings: %w", err)
	}

	outPath := targetPath
	if !strings.HasSuffix(targetPath, ".json") {
		outPath = filepath.Join(targetPath, "settings.json")
	}

	if err := os.MkdirAll(filepath.Dir(outPath), 0755); err != nil {
		return fmt.Errorf("mkdir: %w", err)
	}

	return os.WriteFile(outPath, data, 0644)
}

func (m *Manager) PreviewJSON(profile *db.HarnessProfileFull) (string, error) {
	settings := m.profileToSettings(profile)
	data, err := json.MarshalIndent(settings, "", "  ")
	if err != nil {
		return "", err
	}
	return string(data), nil
}

func (m *Manager) profileToSettings(profile *db.HarnessProfileFull) ClaudeSettings {
	settings := ClaudeSettings{}

	var allow, deny []string
	for _, p := range profile.Permissions {
		if p.Type == db.PermissionAllow {
			allow = append(allow, p.Tool)
		} else {
			deny = append(deny, p.Tool)
		}
	}
	if len(allow) > 0 || len(deny) > 0 {
		settings.Permissions = &ClaudePermissions{Allow: allow, Deny: deny}
	}

	// hooks をイベント × matcher でグループ化
	type hookKey struct{ event, matcher string }
	hookMap := make(map[hookKey][]db.HarnessHook)
	for _, h := range profile.Hooks {
		k := hookKey{string(h.Event), h.Matcher}
		hookMap[k] = append(hookMap[k], h)
	}

	if len(hookMap) > 0 {
		settings.Hooks = make(map[string][]ClaudeHookEntry)
		// event ごとにまとめる
		byEvent := make(map[string]map[string][]db.HarnessHook)
		for k, hooks := range hookMap {
			if byEvent[k.event] == nil {
				byEvent[k.event] = make(map[string][]db.HarnessHook)
			}
			byEvent[k.event][k.matcher] = hooks
		}
		for event, matchers := range byEvent {
			for matcher, hooks := range matchers {
				var clauseHooks []ClaudeHook
				for _, h := range hooks {
					clauseHooks = append(clauseHooks, ClaudeHook{Type: "command", Command: h.Command})
				}
				settings.Hooks[event] = append(settings.Hooks[event], ClaudeHookEntry{
					Matcher: matcher,
					Hooks:   clauseHooks,
				})
			}
		}
	}

	if len(profile.EnvVars) > 0 {
		settings.Env = make(map[string]string)
		for _, e := range profile.EnvVars {
			settings.Env[e.Key] = e.Value
		}
	}

	return settings
}

// ─── インポート ───────────────────────────────────────────────────

func (m *Manager) ImportFromSettings(settingsPath string) (*db.CreateProfileRequest, error) {
	data, err := os.ReadFile(settingsPath)
	if err != nil {
		return nil, fmt.Errorf("read settings: %w", err)
	}

	var settings ClaudeSettings
	if err := json.Unmarshal(data, &settings); err != nil {
		return nil, fmt.Errorf("parse settings: %w", err)
	}

	req := &db.CreateProfileRequest{
		Name:  filepath.Base(filepath.Dir(settingsPath)),
		Scope: db.ScopeProject,
	}

	if settings.Permissions != nil {
		for _, t := range settings.Permissions.Allow {
			req.Permissions = append(req.Permissions, db.PermissionInput{Type: db.PermissionAllow, Tool: t})
		}
		for _, t := range settings.Permissions.Deny {
			req.Permissions = append(req.Permissions, db.PermissionInput{Type: db.PermissionDeny, Tool: t})
		}
	}

	for event, entries := range settings.Hooks {
		for _, entry := range entries {
			for _, h := range entry.Hooks {
				req.Hooks = append(req.Hooks, db.HookInput{
					Event:          db.HookEvent(event),
					Matcher:        entry.Matcher,
					Command:        h.Command,
					TimeoutSeconds: 30,
				})
			}
		}
	}

	for k, v := range settings.Env {
		req.EnvVars = append(req.EnvVars, db.EnvVarInput{Key: k, Value: v})
	}

	return req, nil
}
