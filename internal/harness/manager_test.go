package harness

import (
	"encoding/json"
	"os"
	"path/filepath"
	"testing"

	"github.com/chankei613/harness-manager/internal/db"
)

func TestPreviewJSON_EmptyProfile(t *testing.T) {
	m := NewManager()
	profile := &db.HarnessProfileFull{
		HarnessProfile: db.HarnessProfile{Name: "empty"},
	}

	out, err := m.PreviewJSON(profile)
	if err != nil {
		t.Fatalf("PreviewJSON error: %v", err)
	}

	var settings ClaudeSettings
	if err := json.Unmarshal([]byte(out), &settings); err != nil {
		t.Fatalf("output is not valid JSON: %v", err)
	}

	if settings.Permissions != nil {
		t.Errorf("expected nil permissions for empty profile, got %+v", settings.Permissions)
	}
}

func TestPreviewJSON_WithPermissions(t *testing.T) {
	m := NewManager()
	profile := &db.HarnessProfileFull{
		HarnessProfile: db.HarnessProfile{Name: "test"},
		Permissions: []db.HarnessPermission{
			{Type: db.PermissionAllow, Tool: "Read"},
			{Type: db.PermissionDeny, Tool: "Write"},
		},
	}

	out, err := m.PreviewJSON(profile)
	if err != nil {
		t.Fatalf("PreviewJSON error: %v", err)
	}

	var settings ClaudeSettings
	if err := json.Unmarshal([]byte(out), &settings); err != nil {
		t.Fatalf("output is not valid JSON: %v", err)
	}

	if settings.Permissions == nil {
		t.Fatal("expected permissions to be set")
	}
	if len(settings.Permissions.Allow) != 1 || settings.Permissions.Allow[0] != "Read" {
		t.Errorf("unexpected allow list: %v", settings.Permissions.Allow)
	}
	if len(settings.Permissions.Deny) != 1 || settings.Permissions.Deny[0] != "Write" {
		t.Errorf("unexpected deny list: %v", settings.Permissions.Deny)
	}
}

func TestPreviewJSON_WithEnvVars(t *testing.T) {
	m := NewManager()
	profile := &db.HarnessProfileFull{
		HarnessProfile: db.HarnessProfile{Name: "envtest"},
		EnvVars: []db.HarnessEnvVar{
			{Key: "FOO", Value: "bar"},
		},
	}

	out, err := m.PreviewJSON(profile)
	if err != nil {
		t.Fatalf("PreviewJSON error: %v", err)
	}

	var settings ClaudeSettings
	if err := json.Unmarshal([]byte(out), &settings); err != nil {
		t.Fatalf("output is not valid JSON: %v", err)
	}

	if settings.Env["FOO"] != "bar" {
		t.Errorf("expected env FOO=bar, got %v", settings.Env)
	}
}

func TestImportFromSettings_Basic(t *testing.T) {
	input := `{
		"permissions": {
			"allow": ["Read", "Bash"],
			"deny": ["Write"]
		},
		"env": {
			"MY_VAR": "hello"
		}
	}`

	tmp := filepath.Join(t.TempDir(), "myproject", "settings.json")
	if err := os.MkdirAll(filepath.Dir(tmp), 0755); err != nil {
		t.Fatalf("mkdir: %v", err)
	}
	if err := os.WriteFile(tmp, []byte(input), 0644); err != nil {
		t.Fatalf("write: %v", err)
	}

	m := NewManager()
	req, err := m.ImportFromSettings(tmp)
	if err != nil {
		t.Fatalf("ImportFromSettings error: %v", err)
	}

	if req.Name != "myproject" {
		t.Errorf("expected name %q, got %q", "myproject", req.Name)
	}
	if req.Scope != db.ScopeProject {
		t.Errorf("expected scope project, got %q", req.Scope)
	}

	allowCount := 0
	denyCount := 0
	for _, p := range req.Permissions {
		if p.Type == db.PermissionAllow {
			allowCount++
		} else {
			denyCount++
		}
	}
	if allowCount != 2 || denyCount != 1 {
		t.Errorf("expected 2 allow + 1 deny, got %d allow + %d deny", allowCount, denyCount)
	}

	if len(req.EnvVars) != 1 || req.EnvVars[0].Key != "MY_VAR" {
		t.Errorf("unexpected env vars: %v", req.EnvVars)
	}
}

func TestImportFromSettings_InvalidJSON(t *testing.T) {
	tmp := filepath.Join(t.TempDir(), "proj", "settings.json")
	os.MkdirAll(filepath.Dir(tmp), 0755)
	os.WriteFile(tmp, []byte("not json"), 0644)

	m := NewManager()
	_, err := m.ImportFromSettings(tmp)
	if err == nil {
		t.Fatal("expected error for invalid JSON, got nil")
	}
}

func TestExportToSettings_WritesFile(t *testing.T) {
	m := NewManager()
	profile := &db.HarnessProfileFull{
		HarnessProfile: db.HarnessProfile{Name: "export-test"},
		Permissions: []db.HarnessPermission{
			{Type: db.PermissionAllow, Tool: "Read"},
		},
	}

	dir := t.TempDir()
	if err := m.ExportToSettings(profile, dir); err != nil {
		t.Fatalf("ExportToSettings error: %v", err)
	}

	data, err := os.ReadFile(filepath.Join(dir, "settings.json"))
	if err != nil {
		t.Fatalf("settings.json not written: %v", err)
	}

	var settings ClaudeSettings
	if err := json.Unmarshal(data, &settings); err != nil {
		t.Fatalf("written file is not valid JSON: %v", err)
	}
	if settings.Permissions == nil || len(settings.Permissions.Allow) != 1 {
		t.Errorf("unexpected exported permissions: %+v", settings.Permissions)
	}
}
